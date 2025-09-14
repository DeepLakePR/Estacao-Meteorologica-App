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
    Alert,
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

// Chart (Graphs)
import { CurveType, LineChart } from "react-native-gifted-charts";

// Firestore
import { Database } from '../../services/firebase.initialize.js';
import { collection, getDoc, getDocs, doc, addDoc, updateDoc, query, orderBy, onSnapshot, where, deleteDoc } from 'firebase/firestore'

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

const dev_d_1 = [
    { value: 18, label: "1" },
    { value: 15, label: "2" },
    { value: 21, label: "3" },
    { value: 17, label: "4" },
    { value: 18, label: "5" },
    { value: 16, label: "6" },
    { value: 20, label: "7" },
    { value: 22, label: "8" },
    { value: 25, label: "9" },
    { value: 23, label: "10" },
    { value: 18, label: "11" },
    { value: 15, label: "12" },
    { value: 21, label: "13" },
    { value: 17, label: "14" },
    { value: 18, label: "15" },
    { value: 16, label: "16" },
    { value: 20, label: "17" },
    { value: 22, label: "18" },
    { value: 25, label: "19" },
    { value: 23, label: "20" }
]
const dev_d_2 = [
    { value: 11 },
    { value: 9 },
    { value: 8 },
    { value: 12 },
    { value: 15 },
    { value: 12 },
    { value: 10 },
    { value: 9 },
    { value: 4 },
    { value: 1 },
    { value: 11 },
    { value: 9 },
    { value: 8 },
    { value: 12 },
    { value: 15 },
    { value: 12 },
    { value: 10 },
    { value: 9 },
    { value: 4 },
    { value: 1 }
]

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

    // Prevision Database
    const PrevisionsDatabaseRef = collection(Database, "previsions");
    const PrevisionDocRef = doc(Database, "previsions", previsionId);
    const PrevisionAnotationsRef = collection(PrevisionDocRef, "previsionAnotations");

    // Monthly Average Prevision
    const [monthlyAverageData, setMonthlyAverageData] = useState({
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

    // Weather Graph
    const [weatherGraphData, setWeatherGraphData] = useState({
        data: [],
        data2: [],
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

            const monthlyWeatherGraph = {};

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

                const anotation = { ...anotationDoc.data(), "id": anotationDoc.id }

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

                const anotationDay = anotationCreatedAt.toDate().getDate();
                const anotationMaxTemp = cleanAndConvertToNumber(temperaturaMax);
                const anotationMinTemp = cleanAndConvertToNumber(temperaturaMin);

                if (!monthlyWeatherGraph[anotationDay]) monthlyWeatherGraph[anotationDay] = { max: [], min: [] };

                monthlyWeatherGraph[anotationDay].max.push(anotationMaxTemp);
                monthlyWeatherGraph[anotationDay].min.push(anotationMinTemp);

            });

            // Calc Average
            Object.entries(sumAverage).map((keyValue) => {
                1

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

            const resultMonthlyTemps = Object.entries(monthlyWeatherGraph).map(([day, temps]) => ({
                day: Number(day),
                max: Math.max(...temps.max),
                min: Math.min(...temps.min),
            }));

            setWeatherGraphData({
                data: resultMonthlyTemps.map(r => ({ label: r.day, value: r.max })),
                data2: resultMonthlyTemps.map(r => ({ label: r.day, value: r.min })),
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
                        return typeof (singlePrevisionAnotation[key]) === 'object' ? true
                            : typeof (singlePrevisionAnotation[key]) === "string" && singlePrevisionAnotation[key].trim().length === 0
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

            if (!isEditAnotation) {
                await addDoc(PrevisionAnotationsRef, anotation);

            } else {
                await updateDoc(doc(PrevisionAnotationsRef, singlePrevisionAnotation.id),
                    (({ id, ...anotation }) => anotation)(anotation)
                );

            }

            setModalAnotation(false);
            setIsEditAnotation(false);
            setSinglePrevisionAnotation(ANOTATION_FORMAT);
            setPrevisionLoadingIconDisplay('none');

        }, 1000);

    }

    // Delete Prevision Anotation
    async function handlePrevisionDelete() {

        Alert.alert(
            "Deletar Previsão?",
            "Você tem certeza que deseja deletar essa anotação?",
            [
                {
                    text: "Cancelar", style: "cancel"
                },
                {
                    text: "Deletar", onPress: () => {

                        const anotationRef = doc(PrevisionAnotationsRef, singlePrevisionAnotation.id);
                        deleteDoc(anotationRef);
                        setModalAnotation(false);

                    }
                }
            ]
        );

    }

    // Set New Prevision Anotation
    function setSinglePrevisionAnotationInput(newValue, finalCombination, property) {

        if (newValue.length === 0) {
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

        if (type === "new") {
            setSinglePrevisionAnotation(ANOTATION_FORMAT);
            setCurrentDateTimePicker(new Date());
            setIsEditAnotation(false);


        } else { // Edit
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
                                                        : typeof (singlePrevisionAnotation[anotationKey]) === "string"
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

                                {isEditAnotation && (
                                    <View style={{
                                        position: 'absolute',
                                        bottom: 20,
                                        right: 10,
                                        padding: 10
                                    }}>
                                        <TouchableOpacity style={{ padding: 8 }} activeOpacity={0.25}
                                            onPress={() => handlePrevisionDelete()}>
                                            <FontAwesome name="trash" size={22} color="black" />
                                        </TouchableOpacity>
                                    </View>
                                )}
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
                                {monthlyAverageData.temperaturaSeco}ºC
                            </Text>
                        </Text>
                        <Text style={PrevisionStyle.previsionMonthlyAverageText}>
                            Temp Úmido: <Text style={PrevisionStyle.previsionMonthlyAverageTextBold}>
                                {monthlyAverageData.temperaturaUmido}ºC
                            </Text>
                        </Text>

                        <Text style={{ ...PrevisionStyle.previsionMonthlyAverageText, width: '100%' }}>
                            UR: <Text style={PrevisionStyle.previsionMonthlyAverageTextBold}>
                                {monthlyAverageData.urTabela}
                            </Text>
                        </Text>

                        <Text style={PrevisionStyle.previsionMonthlyAverageText}>
                            Temp Mínima: <Text style={PrevisionStyle.previsionMonthlyAverageTextBold}>
                                {monthlyAverageData.temperaturaMin}ºC
                            </Text>
                        </Text>
                        <Text style={PrevisionStyle.previsionMonthlyAverageText}>
                            Temp Máxima: <Text style={PrevisionStyle.previsionMonthlyAverageTextBold}>
                                {monthlyAverageData.temperaturaMax}ºC
                            </Text>
                        </Text>

                        <Text style={PrevisionStyle.previsionMonthlyAverageText}>
                            Precipitação: <Text style={PrevisionStyle.previsionMonthlyAverageTextBold}>
                                {monthlyAverageData.precipitacao}mm
                            </Text>
                        </Text>

                        <Text style={PrevisionStyle.previsionMonthlyAverageText}>
                            Ceu WeWe: <Text style={PrevisionStyle.previsionMonthlyAverageTextBold}>
                                {monthlyAverageData.ceuWeWe}
                            </Text>
                        </Text>

                        <Text style={PrevisionStyle.previsionMonthlyAverageText}>
                            Solo 0900: <Text style={PrevisionStyle.previsionMonthlyAverageTextBold}>
                                {monthlyAverageData.solo0900}
                            </Text>
                        </Text>

                        <Text style={PrevisionStyle.previsionMonthlyAverageText}>
                            Pressão: <Text style={PrevisionStyle.previsionMonthlyAverageTextBold}>
                                {monthlyAverageData.pressao}hPa
                            </Text>
                        </Text>

                        <Text style={{ ...PrevisionStyle.previsionMonthlyAverageText, width: '100%' }}>
                            Veloc Vento Km/h: <Text style={PrevisionStyle.previsionMonthlyAverageTextBold}>
                                {monthlyAverageData.velocidadeKm}Km/h
                            </Text>
                        </Text>

                    </View>

                    <View style={PrevisionStyle.previsionWeatherGraph}>
                        <LineChart
                            key={JSON.stringify(weatherGraphData)}
                            data={weatherGraphData.data}
                            data2={weatherGraphData.data2}
                            spacing={30}
                            thickness={3}
                            noOfSections={4}
                            yAxisColor="#323232ff"
                            verticalLinesColor="rgba(62, 62, 62, 0.5)"
                            xAxisColor="#323232ff"
                            color="#e8591c"
                            color2="#89b3e0"
                            dataPointsColor1="#a73809ff"
                            dataPointsColor2="#396ca3ff"
                            startFillColor1="#d2531dff"
                            endFillColor1="#7e1c0fff"
                            startFillColor2="#5787baff"
                            endFillColor2="#23364bff"
                            startOpacity={1}
                            endOpacity={0.3}
                            curveType={CurveType.CUBIC}
                            curved
                            isAnimated
                            animationDuration={3000}
                            animateOnDataChange={true}
                            onDataChangeAnimationDuration={3000}
                            scrollAnimation={true}
                            adjustToWidth={true}
                            areaChart
                            yAxisLabelSuffix="ºC    "
                        />

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                            <View style={{ ...PrevisionStyle.previsionWeatherGraphLegendColor, backgroundColor: '#e8591c' }}></View>
                            <Text style={{ marginRight: 15 }}>Temperatura Máxima</Text>

                            <View style={{ ...PrevisionStyle.previsionWeatherGraphLegendColor, backgroundColor: '#89b3e0' }}></View>
                            <Text>Temperatura Mínima</Text>
                        </View>
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
