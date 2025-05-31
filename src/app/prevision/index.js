import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import {
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Keyboard,
    Modal,
    ScrollView,
    ActivityIndicator,
} from "react-native";

import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

import { router, useLocalSearchParams } from "expo-router";

import { Table, Row, Rows } from 'react-native-table-component';

// Date Time Picker
import DateTimePicker from '@react-native-community/datetimepicker';

// Style
import PrevisionStyle from "../../styles/prevision-style.js";

// Icons
import { AntDesign, FontAwesome } from '@expo/vector-icons';

// XLSX
import * as XLSX from "xlsx";
import { writeAsStringAsync, StorageAccessFramework, EncodingType } from "expo-file-system";

// Firestore
import { Database } from '../../services/firebase.initialize.js';
import { collection, getDoc, getDocs, doc, addDoc, updateDoc, query, orderBy, onSnapshot, where } from 'firebase/firestore'

// Variables
const DATE_FORMAT_CONFIG = { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' };
const ANOTATION_FORMAT = {
    "anotationCreatedAt": new Date(),

    "temperaturaSeco": { placeholder: "Temp Seco", acronym: " ºC" },
    "temperaturaUmido": { placeholder: "Temp Úmido", acronym: " ºC" },

    "urTabela": { placeholder: "UR Tabela", acronym: null },

    "temperaturaMin": { placeholder: "Temp Mínima", acronym: " ºC" },
    "temperaturaMax": { placeholder: "Temp Máxima", acronym: " ºC" },

    "precipitacao": { placeholder: "Precipitação", acronym: "mm" },
    "ceuWeWe": { placeholder: "Céu WeWe", acronym: null },
    "solo0900": { placeholder: "Solo 0900", acronym: null },
    "pressao": { placeholder: "Pressão", acronym: "hPa" },

    "velocidadeKm": { placeholder: "Velocidade Km/h", acronym: "Km/h" },
    "direcao": { placeholder: "Direção", acronym: null },

    "anotationCreatedBy": null
};

// Prevision Function
export default function Prevision() {

    // User
    const user = JSON.parse(useLocalSearchParams().user);

    const HeadTable = [
        "Data",
        "Temperatura Seco",
        "Temperatura Úmido",
        "UR Tabela",
        "Temperatura Mínima",
        "Temperatura Máxima",
        "Precipitação",
        "Céu WeWe",
        "Solo 0900",
        "Pressão",
        "Velocidade Km/h",
        "Direção",
        "Assinatura",
        <FontAwesome style={{ textAlign: 'center' }} name="gear" size={20} color="white" />
    ];

    const previsionTableWidthColumns = [
        60, // Data
        105, // Temperatura Seco
        105, // Temperatura Úmido
        90, // UR Tabela
        105, // Temperatura Mínima
        105, // Temperatura Máxima
        100, // Precipitação
        90, // Céu WeWe
        90, // Solo 0900
        75, // Pressão
        95, // Velocidade Km/h
        70, // Direção
        90, // Assinatura
        40 // Edit
    ]

    // Prevision
    const { previsionId } = useLocalSearchParams();
    const [previsionInfo, setPrevisionInfo] = useState([]);

    const [previsionAnotationsInfo, setPrevisionAnotationsInfo] = useState([]);

    if (previsionId === null || previsionId === undefined) {
        router.push(`/(tabs)/home?user=${JSON.stringify(user)}`);

    }

    const [previsionLoadingIconDisplay, setPrevisionLoadingIconDisplay] = useState('none');

    const [singlePrevisionAnotation, setSinglePrevisionAnotation] = useState(ANOTATION_FORMAT);
    const [modalAnotation, setModalAnotation] = useState(false);

    // Modal Date & Hour Picker
    const [currentDateTimePicker, setCurrentDateTimePicker] = useState(new Date());

    const [viewDatePickerModal, setViewDatePickerModal] = useState(false);
    const [viewHourPickerModal, setViewHourPickerModal] = useState(false);

    const [isEditAnotation, setIsEditAnotation] = useState(false);

    // Prevision
    const PrevisionsDatabaseRef = collection(Database, "previsions");
    const PrevisionDocRef = doc(Database, "previsions", previsionId);
    const PrevisionAnotationsRef = collection(PrevisionDocRef, "previsionAnotations");

    // Monthly Average Prevision
    const [MonthlyAverageData, setMonthlyAverageData] = useState({
        "temperaturaSeco": "N/A",
        "temperaturaUmido": "N/A",

        "urTabela": "N/A",

        "temperaturaMin": "N/A",
        "temperaturaMax": "N/A",

        "precipitacao": "N/A",
        "ceuWeWe": "N/A",
        "solo0900": "N/A",
        "pressao": "N/A",

        "velocidadeKm": "N/A",
    });

    //////////////////////////////////
    // Generate Excel
    async function generateExcel(daysDuration) {

        // Keyboard Dismiss
        Keyboard.dismiss();

        // Excel Data
        let wb = XLSX.utils.book_new();
        let ws = XLSX.utils.aoa_to_sheet([

            [
                "Data",
                "Temperatura Seco",
                "Temperatura Úmido",
                "UR Tabela",
                "Temperatura Mínima",
                "Temperatura Máxima",
                "Precipitação",
                "Céu WeWe",
                "Solo 0900",
                "Pressão",
                "Velocidade Km/h",
                "Direção",
                "Assinatura"
            ],

        ]);

        let dates = getPrevisionAnotationsInfo(false, daysDuration);

        await dates.then((anotationsList) => {

            anotationsList.forEach(async (anotationInfo, index) => {

                await XLSX.utils.sheet_add_aoa(ws, [
                    anotationInfo
                ], { origin: index + 1 });

            })

        });

        // Month Name
        let monthName = previsionInfo.createdAt.toDate().toLocaleString('pt-BR', { month: 'long' });
        monthName = monthName[0].toUpperCase() + monthName.substring(1);

        // Create Excel
        await XLSX.utils.book_append_sheet(wb, ws, `Estacao Meteorologica ${monthName}`, true);
        const excelData = await XLSX.write(wb, { type: "base64" });

        // File Info
        const fileName = `Estacao_Meteorologica_${monthName}.xlsx`;

        // Save File into Internal Storage
        const storageToSaveUri = await StorageAccessFramework.requestDirectoryPermissionsAsync().then((response) => {
            if (response.granted) {
                return response.directoryUri;
            }
        })

        const newExcelFile = await StorageAccessFramework.createFileAsync(
            storageToSaveUri,
            fileName,
            'base64'
        )

        setTimeout(async () => {
            await writeAsStringAsync(newExcelFile, excelData, { encoding: EncodingType.Base64 });

        }, 1500);

        ///////////////////
        // XLSX Chart
        // > Next Update

    };
    //////////////////////////////////

    // Get Prevision Info
    async function getPrevisionInfo() {

        const previsionDocRef = await getDoc(doc(PrevisionsDatabaseRef, previsionId));
        setPrevisionInfo(previsionDocRef.data());

    }

    // Get Prevision Anotations Info
    async function getPrevisionAnotationsInfo(isSetState, maxDaysToGet) {

        if (maxDaysToGet) {
            var previsionStartDate = previsionInfo.createdAt.toDate();

            var previsionLimitEndDate = previsionInfo.createdAt.toDate();
            previsionLimitEndDate.setDate(previsionLimitEndDate.getDate() + maxDaysToGet);

            var getLimitedAnotationsPrevision = query(
                PrevisionAnotationsRef,
                orderBy("anotationCreatedAt", "asc"),
                where('anotationCreatedAt', '>=', previsionStartDate),
                where('anotationCreatedAt', '<=', previsionLimitEndDate)

            );

        }

        let getAllAnotationsPrevision = query(
            PrevisionAnotationsRef,
            orderBy("anotationCreatedAt", "asc")
        );

        const finalDataPrevisionAnotations = [];

        const getPrevisionAnotationsQuery = !maxDaysToGet ? getAllAnotationsPrevision : getLimitedAnotationsPrevision

        await getDocs(getPrevisionAnotationsQuery).then((querySnapshot) => {

            // Variables
            let anotationsLength = querySnapshot.docs.length;

            let sumAverage = {
                "temperaturaSeco": 0,
                "temperaturaUmido": 0,

                "urTabela": 0,

                "temperaturaMin": 0,
                "temperaturaMax": 0,

                "precipitacao": 0,
                "ceuWeWe": 0,
                "solo0900": 0,
                "pressao": 0,

                "velocidadeKm": 0,
            }

            // Push Data Inside Array and Set Average
            querySnapshot.docs.forEach((anotationDoc) => {

                const {
                    anotationCreatedAt,
                    temperaturaSeco,
                    temperaturaUmido,
                    urTabela,
                    temperaturaMin,
                    temperaturaMax,
                    precipitacao,
                    ceuWeWe,
                    solo0900,
                    pressao,
                    velocidadeKm,
                    direcao,
                    anotationCreatedBy,
                } = anotationDoc.data();

                const anotation = {...anotationDoc.data(), "id": anotationDoc.id}

                // Push to Array
                finalDataPrevisionAnotations.push([

                    anotationCreatedAt.toDate().toLocaleString(
                        'pt-BR', DATE_FORMAT_CONFIG
                    ),

                    temperaturaSeco,
                    temperaturaUmido,

                    urTabela,

                    temperaturaMin,
                    temperaturaMax,

                    precipitacao,
                    ceuWeWe,
                    solo0900,
                    pressao,

                    velocidadeKm,
                    direcao,
                    anotationCreatedBy,

                    <TouchableOpacity style={{ alignItems: 'center' }} onPress={
                        () => openAnotationModal(
                            'edit', 
                            anotation
                        )
                    }>
                        <AntDesign name="edit" size={22} color="white" />
                    </TouchableOpacity>

                ]);

                // Set Average Variable
                Object.keys(sumAverage).forEach((value) => {
                    sumAverage[value] += cleanAndConvertToNumber(anotationDoc.data()[value]);

                });

            });

            // Calc Average
            Object.entries(sumAverage).map((keyValue) => {

                let sumResult = Math.round(
                    isNaN(keyValue[1] / anotationsLength)
                        ? 0
                        : keyValue[1] / anotationsLength
                );

                setMonthlyAverageData(old => ({
                    ...old,
                    [keyValue[0]]: sumResult
                })
                );

            });

        });

        if (isSetState) {
            setPrevisionAnotationsInfo(finalDataPrevisionAnotations);
            return;

        } else {
            return finalDataPrevisionAnotations;

        }

    }

    // Real Time Update Prevision Anotations
    async function realTimeUpdatePrevisionAnotations() {

        const realTimeUpdateAnotationsQuery = query(PrevisionAnotationsRef);

        await onSnapshot(realTimeUpdateAnotationsQuery, () => {
            getPrevisionAnotationsInfo(true);

        });

    }

    // Handle Prevision Anotation
    async function handleAnotation() {

        Keyboard.dismiss();

        setPrevisionLoadingIconDisplay('flex');

        setTimeout(async () => {

            let haveEmptyValues = Object.keys(singlePrevisionAnotation).some(
                key => {
                    if (key !== "anotationCreatedAt" && key !== "anotationCreatedBy") 
                        return typeof(singlePrevisionAnotation[key]) === 'object' ? true 
                        : typeof(singlePrevisionAnotation[key]) === "string" && singlePrevisionAnotation[key].trim().length === 0 
                        ? true : false
                    
                })

            if (haveEmptyValues) {
                setPrevisionLoadingIconDisplay('none');
                return alert('É necessário preencher todos os campos para inserir as informações.');

            }

            const anotation = {
                ...singlePrevisionAnotation,
                'anotationCreatedAt': currentDateTimePicker,
                'anotationCreatedBy': user.userName
            }

            if(!isEditAnotation){
                await addDoc(PrevisionAnotationsRef, anotation);

            }else{
                await updateDoc(doc(PrevisionAnotationsRef, singlePrevisionAnotation.id), 
                    (({id, ...anotation}) => anotation )(anotation)
                );

            }

            setModalAnotation(false);
            setIsEditAnotation(false);
            setSinglePrevisionAnotation(ANOTATION_FORMAT);
            setPrevisionLoadingIconDisplay('none');

        }, 1000);

    }

    // Set New Prevision Anotation
    function setSinglePrevisionAnotationInput(newValue, finalCombination, property) {

        if(newValue.length === 0){
            setSinglePrevisionAnotation({
                ...singlePrevisionAnotation,
                [property]: newValue
            });
            return false;

        }

        if ((!newValue || !property) && !isEditAnotation)
            return false;

        if (finalCombination)
            newValue = newValue + finalCombination

        setSinglePrevisionAnotation({
            ...singlePrevisionAnotation,
            [property]: newValue
        });
    }

    // Open Anotation Modal
    function openAnotationModal(type, anotationToEdit) {

        if(type === "new") {
            setSinglePrevisionAnotation(ANOTATION_FORMAT);
            setCurrentDateTimePicker(new Date());
            setIsEditAnotation(false);
            

        }else { // Edit
            setSinglePrevisionAnotation(anotationToEdit);
            setCurrentDateTimePicker(anotationToEdit.anotationCreatedAt.toDate());
            setIsEditAnotation(true);

        }

        setModalAnotation(true);

    }

    // Clean and Convert Single Information
    function cleanAndConvertToNumber(value, returnString) {

        let cleanedValue = 0;

        if (value)
            cleanedValue = value.replace(/[^\d.-]/g, '');

        return !returnString ? parseFloat(cleanedValue) : cleanedValue;

    }

    useEffect(() => {
        getPrevisionAnotationsInfo(true);
        getPrevisionInfo();
        realTimeUpdatePrevisionAnotations();

    }, []);

    // Return
    return (

        <SafeAreaProvider style={{ flex: 1 }}>
            <SafeAreaView style={PrevisionStyle.mainContainer} edges={['top']}>

                <ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'flex-start' }}
                    nestedScrollEnabled={true}>

                    <StatusBar style="light" backgroundColor="#3B6BA5" translucent={true} />

                    <Modal
                        statusBarTranslucent={true}
                        animationType="fade"
                        transparent={true}
                        visible={modalAnotation}
                        onRequestClose={() => {
                            setModalAnotation(false);
                        }}>

                        <View style={PrevisionStyle.modalAnotationContainer}>
                            <View style={PrevisionStyle.modalAnotationView}>

                                <TouchableOpacity style={PrevisionStyle.modalAnotationCloseButton} onPress={() => setModalAnotation(false)}>
                                    <Text style={PrevisionStyle.modalAnotationText}>X</Text>
                                </TouchableOpacity>

                                <Text style={PrevisionStyle.modalAnotationTitle}>
                                    {!isEditAnotation
                                        ? "Insira as informações da Estação Meteorológica"
                                        : "Editar Anotação"
                                    }
                                </Text>

                                <View style={PrevisionStyle.modalAnotationInputsWrapper}>

                                    {
                                        Object.keys(ANOTATION_FORMAT).map((anotationKey) => {

                                            if (anotationKey === "anotationCreatedAt" || anotationKey === 'anotationCreatedBy')
                                                return false;

                                            return <TextInput style={
                                                anotationKey !== "urTabela"
                                                    ? PrevisionStyle.modalAnotationInput
                                                    : { ...PrevisionStyle.modalAnotationInput, width: "89%" }
                                            }
                                                key={anotationKey}
                                                placeholder={ANOTATION_FORMAT[anotationKey].placeholder} placeholderTextColor={"#a8a8a8"}
                                                inputMode={anotationKey !== "direcao" ? "numeric" : "text"}
                                                value={
                                                    isEditAnotation 
                                                    ? anotationKey === "direcao" 
                                                        ? singlePrevisionAnotation[anotationKey] 
                                                        : cleanAndConvertToNumber(singlePrevisionAnotation[anotationKey], true) 
                                                    : typeof(singlePrevisionAnotation[anotationKey]) === "string" 
                                                        ? anotationKey === "direcao"
                                                            ? singlePrevisionAnotation[anotationKey] 
                                                            : cleanAndConvertToNumber(singlePrevisionAnotation[anotationKey], true)
                                                        : ""
                                                }
                                                onChangeText={(text) => setSinglePrevisionAnotationInput(text, ANOTATION_FORMAT[anotationKey].acronym, anotationKey)}
                                            />

                                        })
                                    }

                                    <TouchableOpacity style={PrevisionStyle.modalAnotationInput}
                                        onPress={() => setViewDatePickerModal(true)}>
                                        <Text style={{ textAlign: 'center' }}>
                                            {
                                                currentDateTimePicker.toLocaleDateString(
                                                    'pt-BR',
                                                    {
                                                        year: 'numeric',
                                                        month: '2-digit',
                                                        day: '2-digit',
                                                        timeZone: 'America/Sao_Paulo'
                                                    }
                                                )
                                            }
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={PrevisionStyle.modalAnotationInput}
                                        onPress={() => { setViewHourPickerModal(true); }}>
                                        <Text style={{ textAlign: 'center' }}>
                                            {
                                                currentDateTimePicker.toLocaleTimeString(
                                                    'pt-BR',
                                                    {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        timeZone: 'America/Sao_Paulo'
                                                    }
                                                )
                                            }
                                        </Text>
                                    </TouchableOpacity>

                                    <SafeAreaView>
                                        {
                                            viewDatePickerModal && (
                                                <DateTimePicker
                                                    value={currentDateTimePicker}
                                                    mode={'date'}
                                                    display={"spinner"}
                                                    is24Hour={true}
                                                    timeZoneName={'America/Sao_Paulo'}
                                                    onChange={(_, newDate) => {
                                                        setViewDatePickerModal(false);
                                                        setCurrentDateTimePicker(newDate);
                                                    }}
                                                />
                                            )}

                                        {
                                            viewHourPickerModal && (
                                                <DateTimePicker
                                                    value={currentDateTimePicker}
                                                    mode={'time'}
                                                    display={"clock"}
                                                    is24Hour={true}
                                                    timeZoneName={'America/Sao_Paulo'}
                                                    onChange={(_, newTime) => {
                                                        setViewHourPickerModal(false);
                                                        setCurrentDateTimePicker(newTime);
                                                    }}
                                                />
                                            )}
                                    </SafeAreaView>

                                </View>


                                <TouchableOpacity style={PrevisionStyle.modalAnotationSubmit} onPress={() => handleAnotation()}>
                                    <Text style={{ ...PrevisionStyle.modalAnotationText, fontSize: 17, color: "white" }}>
                                        {!isEditAnotation ? "Criar" : "Salvar"}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{ ...PrevisionStyle.previsionLoadingView, display: previsionLoadingIconDisplay }}>
                                <ActivityIndicator size="large" animation={true} color={"white"}
                                    style={PrevisionStyle.previsionLoadingIcon} />
                            </View>
                        </View>

                    </Modal>

                    <View style={PrevisionStyle.header}>
                        <TouchableOpacity style={PrevisionStyle.backToHomeButton} onPress={() =>
                            router.push(`/(tabs)/home?user=${JSON.stringify(user)}`)}>
                            <AntDesign name="left" size={24} color="white" />
                        </TouchableOpacity>

                        <Text style={PrevisionStyle.previsionTitle}>
                            {previsionInfo.previsionTitle}
                        </Text>
                    </View>

                    <View style={PrevisionStyle.previsionTableWrapper}>

                        <ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
                            nestedScrollEnabled={true}>

                            <ScrollView
                                horizontal={true} showsHorizontalScrollIndicator={true} showsVerticalScrollIndicator={true}
                                nestedScrollEnabled={true}
                                style={PrevisionStyle.previsionTableScrollView}>

                                <Table borderStyle={{ borderWidth: 1, borderColor: '#d9d9d9' }}>

                                    <Row data={HeadTable} style={PrevisionStyle.previsionTableHead} textStyle={PrevisionStyle.previsionTableText} widthArr={previsionTableWidthColumns} />

                                    <Rows data={previsionAnotationsInfo} style={PrevisionStyle.previsionTableRow} textStyle={PrevisionStyle.previsionTableText} widthArr={previsionTableWidthColumns} />

                                </Table>

                            </ScrollView>

                        </ScrollView>

                    </View>

                    <View style={PrevisionStyle.previsionMonthlyAverage}>

                        <Text style={PrevisionStyle.previsionMonthlyAverageTitle}>Médias Mensais:</Text>

                        <Text style={PrevisionStyle.previsionMonthlyAverageText}>
                            Temp Seco: <Text style={PrevisionStyle.previsionMonthlyAverageTextBold}>
                                {MonthlyAverageData.temperaturaSeco}ºC
                            </Text>
                        </Text>
                        <Text style={PrevisionStyle.previsionMonthlyAverageText}>
                            Temp Úmido: <Text style={PrevisionStyle.previsionMonthlyAverageTextBold}>
                                {MonthlyAverageData.temperaturaUmido}ºC
                            </Text>
                        </Text>

                        <Text style={{ ...PrevisionStyle.previsionMonthlyAverageText, width: '100%' }}>
                            UR: <Text style={PrevisionStyle.previsionMonthlyAverageTextBold}>
                                {MonthlyAverageData.urTabela}
                            </Text>
                        </Text>

                        <Text style={PrevisionStyle.previsionMonthlyAverageText}>
                            Temp Mínima: <Text style={PrevisionStyle.previsionMonthlyAverageTextBold}>
                                {MonthlyAverageData.temperaturaMin}ºC
                            </Text>
                        </Text>
                        <Text style={PrevisionStyle.previsionMonthlyAverageText}>
                            Temp Máxima: <Text style={PrevisionStyle.previsionMonthlyAverageTextBold}>
                                {MonthlyAverageData.temperaturaMax}ºC
                            </Text>
                        </Text>

                        <Text style={PrevisionStyle.previsionMonthlyAverageText}>
                            Precipitação: <Text style={PrevisionStyle.previsionMonthlyAverageTextBold}>
                                {MonthlyAverageData.precipitacao}mm
                            </Text>
                        </Text>

                        <Text style={PrevisionStyle.previsionMonthlyAverageText}>
                            Ceu WeWe: <Text style={PrevisionStyle.previsionMonthlyAverageTextBold}>
                                {MonthlyAverageData.ceuWeWe}
                            </Text>
                        </Text>

                        <Text style={PrevisionStyle.previsionMonthlyAverageText}>
                            Solo 0900: <Text style={PrevisionStyle.previsionMonthlyAverageTextBold}>
                                {MonthlyAverageData.solo0900}
                            </Text>
                        </Text>

                        <Text style={PrevisionStyle.previsionMonthlyAverageText}>
                            Pressão: <Text style={PrevisionStyle.previsionMonthlyAverageTextBold}>
                                {MonthlyAverageData.pressao}hPa
                            </Text>
                        </Text>

                        <Text style={{ ...PrevisionStyle.previsionMonthlyAverageText, width: '100%' }}>
                            Veloc Vento Km/h: <Text style={PrevisionStyle.previsionMonthlyAverageTextBold}>
                                {MonthlyAverageData.velocidadeKm}Km/h
                            </Text>
                        </Text>

                    </View>

                    <View style={PrevisionStyle.buttonsWrapper}>

                        <TouchableOpacity style={[PrevisionStyle.buttonPrevision, PrevisionStyle.createAnotationButton]}
                            onPress={() => {
                                openAnotationModal('new');
                            }}>
                            <Text style={PrevisionStyle.buttonPrevisionText}>
                                Inserir Informações na Previsão
                            </Text>
                        </TouchableOpacity>

                        <Text style={PrevisionStyle.buttonsGenerateTitle}>Gerar Excel</Text>

                        <View style={PrevisionStyle.buttonsGenerate}>

                            <TouchableOpacity style={PrevisionStyle.buttonPrevision}
                                onPress={() => generateExcel(7)}>
                                <Text style={PrevisionStyle.buttonPrevisionText}>Semanal</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={PrevisionStyle.buttonPrevision}
                                onPress={() => generateExcel(15)}>
                                <Text style={PrevisionStyle.buttonPrevisionText}>Quinzenal</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={PrevisionStyle.buttonPrevision}
                                onPress={() => generateExcel(31)}>
                                <Text style={PrevisionStyle.buttonPrevisionText}>Mensal</Text>
                            </TouchableOpacity>

                        </View>

                    </View>

                </ScrollView>

            </SafeAreaView>
        </SafeAreaProvider>

    );

}
