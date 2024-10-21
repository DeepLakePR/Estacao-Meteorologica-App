import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import {
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Keyboard,
    FlatList,
    Modal,
    ScrollView,
    ActivityIndicator,
    SafeAreaView
} from "react-native";

import {
    useSafeAreaInsets
} from "react-native-safe-area-context";

import { router, useLocalSearchParams } from "expo-router";

import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

// Date Time Picker
import DateTimePicker from '@react-native-community/datetimepicker';

// Style
import PrevisionStyle from "./prevision-style.js";

// Icons
import { AntDesign } from '@expo/vector-icons';

// XLSX
import * as XLSX from "xlsx";
import { writeAsStringAsync, StorageAccessFramework, EncodingType } from "expo-file-system";
import * as Sharing from "expo-sharing";


// Firestore
import { Database } from '../firebase.initialize.js';
import { collection, getDoc, getDocs, doc, addDoc, query, orderBy, onSnapshot, where } from 'firebase/firestore'

// Variables
const mainInputsPHTextColor = "#a8a8a8"; // Create Anotation Inputs Place Holder Text Color

// Prevision Function
export default function Prevision() {

    // SafeArea
    const safeAreaInsets = useSafeAreaInsets();

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
        "Assinatura"
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
        90 // Assinatura
    ]

    // Prevision
    const { previsionId } = useLocalSearchParams();
    const [previsionInfo, setPrevisionInfo] = useState([]);

    const [previsionAnotationsInfo, setPrevisionAnotationsInfo] = useState([]);

    if (previsionId === null || previsionId === undefined) {
        router.push(`home?user=${JSON.stringify(user)}`);

    }

    const [previsionLoadingIconDisplay, setPrevisionLoadingIconDisplay] = useState('none');

    const [newPrevisionAnotation, setNewPrevisionAnotation] = useState({});
    const [modalCreateAnotation, setModalCreateAnotation] = useState(false);

    // Modal Date & Hour Picker
    const [createCurrentDateTimePicker, setCreateCurrentDateTimePicker] = useState(new Date());

    const [showDatePickerModalCreate, setShowDatePickerModalCreate] = useState(false);
    const [showHourPickerModalCreate, setShowHourPickerModalCreate] = useState(false);

    // Prevision
    const PrevisionsDatabaseRef = collection(Database, "previsions");
    const PrevisionDocRef = doc(Database, "previsions", previsionId);
    const PrevisionAnotationsRef = collection(PrevisionDocRef, "previsionAnotations");

    // Monthly Average Prevision
    const [Average_TempSeco, setAverage_TempSeco] = useState("N/A");
    const [Average_TempUmido, setAverage_TempUmido] = useState("N/A");

    const [Average_UR, setAverage_UR] = useState("N/A");

    const [Average_TempMin, setAverage_TempMin] = useState("N/A");
    const [Average_TempMax, setAverage_TempMax] = useState("N/A");

    const [Average_Preciptacao, setAverage_Preciptacao] = useState("N/A");
    const [Average_CeuWeWe, setAverage_CeuWeWe] = useState("N/A");
    const [Average_Solo0900, setAverage_Solo0900] = useState("N/A");
    const [Average_Pressao, setAverage_Pressao] = useState("N/A");

    const [Average_VelocidadeVento, setAverage_VelocidadeVento] = useState("N/A");

    //////////////////////////////////
    // Generate Excel
    const generateExcel = async (daysDuration) => {

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

            let anotationsLength = querySnapshot.docs.length;

            let sum_TemperaturaSeco = 0;
            let sum_TemperaturaUmido = 0;

            let sum_UrTabela = 0;

            let sum_TemperaturaMin = 0;
            let sum_TemperaturaMax = 0;

            let sum_Precipitacao = 0;
            let sum_CeuWeWe = 0;
            let sum_Solo0900 = 0;
            let sum_Pressao = 0;

            let sum_VelocidadeVento = 0;

            querySnapshot.docs.forEach((anotationDoc) => {

                // Push to Array
                finalDataPrevisionAnotations.push([

                    anotationDoc.data().anotationCreatedAt.toDate().toLocaleString(
                        'pt-BR',
                        {
                            day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo'
                        }
                    ),

                    anotationDoc.data().temperaturaSeco,
                    anotationDoc.data().temperaturaUmido,

                    anotationDoc.data().urTabela,

                    anotationDoc.data().temperaturaMin,
                    anotationDoc.data().temperaturaMax,

                    anotationDoc.data().precipitacao,
                    anotationDoc.data().ceuWeWe,
                    anotationDoc.data().solo0900,
                    anotationDoc.data().pressao,

                    anotationDoc.data().velocidadeKm,
                    anotationDoc.data().direcao,
                    anotationDoc.data().anotationCreatedBy,

                ]);

                // Calculate Average
                sum_TemperaturaSeco += cleanAndConvertToNumber(anotationDoc.data().temperaturaSeco);
                sum_TemperaturaUmido += cleanAndConvertToNumber(anotationDoc.data().temperaturaUmido);

                sum_UrTabela += cleanAndConvertToNumber(anotationDoc.data().urTabela);

                sum_TemperaturaMin += cleanAndConvertToNumber(anotationDoc.data().temperaturaMin);
                sum_TemperaturaMax += cleanAndConvertToNumber(anotationDoc.data().temperaturaMax);

                sum_Precipitacao += cleanAndConvertToNumber(anotationDoc.data().precipitacao);
                sum_CeuWeWe += cleanAndConvertToNumber(anotationDoc.data().ceuWeWe);
                sum_Solo0900 += cleanAndConvertToNumber(anotationDoc.data().solo0900);
                sum_Pressao += cleanAndConvertToNumber(anotationDoc.data().pressao);

                sum_VelocidadeVento += cleanAndConvertToNumber(anotationDoc.data().velocidadeKm);

            });

            setAverage_TempSeco(Math.round(isNaN(sum_TemperaturaSeco / anotationsLength) ? 0 : sum_TemperaturaSeco / anotationsLength));
            setAverage_TempUmido(Math.round(isNaN(sum_TemperaturaUmido / anotationsLength) ? 0 : sum_TemperaturaUmido / anotationsLength));
        
            setAverage_UR(Math.round(isNaN(sum_UrTabela / anotationsLength) ? 0 : sum_UrTabela / anotationsLength));
        
            setAverage_TempMin(Math.round(isNaN(sum_TemperaturaMin / anotationsLength) ? 0 : sum_TemperaturaMin / anotationsLength));
            setAverage_TempMax(Math.round(isNaN(sum_TemperaturaMax / anotationsLength) ? 0 : sum_TemperaturaMax / anotationsLength));
        
            setAverage_Preciptacao(Math.round(isNaN(sum_Precipitacao / anotationsLength) ? 0 : sum_Precipitacao / anotationsLength));
            setAverage_CeuWeWe(Math.round(isNaN(sum_CeuWeWe / anotationsLength) ? 0 : sum_CeuWeWe / anotationsLength));
            setAverage_Solo0900(Math.round(isNaN(sum_Solo0900 / anotationsLength) ? 0 : sum_Solo0900 / anotationsLength));
            setAverage_Pressao(Math.round(isNaN(sum_Pressao / anotationsLength) ? 0 : sum_Pressao / anotationsLength));
        
            setAverage_VelocidadeVento(Math.round(isNaN(sum_VelocidadeVento / anotationsLength) ? 0 : sum_VelocidadeVento / anotationsLength));

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

    // Create New Prevision Anotation
    async function createAnotation() {

        Keyboard.dismiss();

        setPrevisionLoadingIconDisplay('flex');

        setTimeout(async () => {

            if (Object.keys(newPrevisionAnotation).length < 11) {
                setPrevisionLoadingIconDisplay('none');
                return alert('É necessário preencher todos os campos para inserir as informações.');

            }

            await addDoc(PrevisionAnotationsRef, {
                ...newPrevisionAnotation,
                'anotationCreatedAt': createCurrentDateTimePicker,
                'anotationCreatedBy': user.userName
            });

            setModalCreateAnotation(!modalCreateAnotation);
            setNewPrevisionAnotation({});
            setPrevisionLoadingIconDisplay('none');

        }, 1000);

    }

    // Set New Prevision Anotation
    function setNewPrevisionAnotationInput(newValue, finalCombination, property) {

        if (newValue === null || newValue === undefined) {
            return false;

        }

        if (property === null || property === undefined) {
            return false;

        }

        if (finalCombination !== null) {
            newValue = newValue + finalCombination

        }

        setNewPrevisionAnotation({
            ...newPrevisionAnotation,
            [property]: newValue
        });
    }

    // Clean and Convert Single Information
    function cleanAndConvertToNumber(value) {

        console.log('teste');
        console.log(value);

        let cleanedValue = 0;

        if(value)
            cleanedValue = value.replace(/[^\d.-]/g, '');

        //console.log(cleanedValue);
        //console.log(parseFloat(cleanedValue));

        return parseFloat(cleanedValue);

    }

    useEffect(() => {
        getPrevisionAnotationsInfo(true);
        getPrevisionInfo();
        realTimeUpdatePrevisionAnotations();

    }, []);

    // Return
    return (

        <ScrollView style={PrevisionStyle.mainContainer} contentContainerStyle={{alignItems: 'center',justifyContent: 'flex-start'}}
        nestedScrollEnabled={true}>

            <StatusBar style="light" backgroundColor="#262626" />

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalCreateAnotation}
                onRequestClose={() => {
                    setModalCreateAnotation(!modalCreateAnotation);
                }}>

                <View style={PrevisionStyle.modalCreateAnotationContainer}>
                    <View style={PrevisionStyle.modalCreateAnotationView}>

                        <TouchableOpacity style={PrevisionStyle.modalCreateAnotationCloseButton} onPress={() => setModalCreateAnotation(!modalCreateAnotation)}>
                            <Text style={PrevisionStyle.modalCreateAnotationText}>X</Text>
                        </TouchableOpacity>

                        <Text style={PrevisionStyle.modalCreateAnotationTitle}>
                            Insira as informações da Estação Meteorológica
                        </Text>


                        <View style={PrevisionStyle.modalCreateAnotationInputsWrapper}>

                            <TextInput style={PrevisionStyle.modalCreateAnotationInput}
                                placeholder={"Temp Seco"} placeholderTextColor={mainInputsPHTextColor}
                                inputMode={'numeric'}
                                onChangeText={(text) => setNewPrevisionAnotationInput(text, ' ºC', 'temperaturaSeco')} />

                            <TextInput style={PrevisionStyle.modalCreateAnotationInput}
                                placeholder={"Temp Úmido"} placeholderTextColor={mainInputsPHTextColor}
                                inputMode={'numeric'}
                                onChangeText={(text) => setNewPrevisionAnotationInput(text, ' ºC', 'temperaturaUmido')} />

                            <TextInput style={PrevisionStyle.modalCreateAnotationInput}
                                placeholder={"UR Tabela"} placeholderTextColor={mainInputsPHTextColor}
                                inputMode={'numeric'}
                                onChangeText={(text) => setNewPrevisionAnotationInput(text, null, 'urTabela')} />

                            <TextInput style={PrevisionStyle.modalCreateAnotationInput}
                                placeholder={"Temp Mínima"} placeholderTextColor={mainInputsPHTextColor}
                                inputMode={'numeric'}
                                onChangeText={(text) => setNewPrevisionAnotationInput(text, ' ºC', 'temperaturaMin')} />

                            <TextInput style={PrevisionStyle.modalCreateAnotationInput}
                                placeholder={"Temp Máxima"} placeholderTextColor={mainInputsPHTextColor}
                                inputMode={'numeric'}
                                onChangeText={(text) => setNewPrevisionAnotationInput(text, ' ºC', 'temperaturaMax')} />

                            <TextInput style={PrevisionStyle.modalCreateAnotationInput}
                                placeholder={"Precipitação"} placeholderTextColor={mainInputsPHTextColor}
                                inputMode={'numeric'}
                                onChangeText={(text) => setNewPrevisionAnotationInput(text, 'mm', 'precipitacao')} />

                            <TextInput style={PrevisionStyle.modalCreateAnotationInput}
                                placeholder={"Céu WeWe"} placeholderTextColor={mainInputsPHTextColor}
                                inputMode={'numeric'}
                                onChangeText={(text) => setNewPrevisionAnotationInput(text, null, 'ceuWeWe')} />

                            <TextInput style={PrevisionStyle.modalCreateAnotationInput}
                                placeholder={"Solo 0900"} placeholderTextColor={mainInputsPHTextColor}
                                inputMode={'numeric'}
                                onChangeText={(text) => setNewPrevisionAnotationInput(text, null, 'solo0900')} />

                            <TextInput style={PrevisionStyle.modalCreateAnotationInput}
                                placeholder={"Pressão"} placeholderTextColor={mainInputsPHTextColor}
                                inputMode={'numeric'}
                                onChangeText={(text) => setNewPrevisionAnotationInput(text, 'hPa', 'pressao')} />

                            <TextInput style={PrevisionStyle.modalCreateAnotationInput}
                                placeholder={"Velocidade Km/h"} placeholderTextColor={mainInputsPHTextColor}
                                inputMode={'numeric'}
                                onChangeText={(text) => setNewPrevisionAnotationInput(text, 'Km', 'velocidadeKm')} />

                            <TextInput style={{...PrevisionStyle.modalCreateAnotationInput, width: '89%'}}
                                placeholder={"Direção"} placeholderTextColor={mainInputsPHTextColor}
                                onChangeText={(text) => setNewPrevisionAnotationInput(text, null, 'direcao')} />

                            <TouchableOpacity style={PrevisionStyle.modalCreateAnotationInput}
                            onPress={()=> setShowDatePickerModalCreate(true) }>
                                <Text style={{ textAlign: 'center' }}>
                                    {
                                        createCurrentDateTimePicker.toLocaleDateString(
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

                            <TouchableOpacity style={PrevisionStyle.modalCreateAnotationInput}
                            onPress={()=>{ setShowHourPickerModalCreate(true); }}>
                                <Text style={{ textAlign: 'center' }}>
                                    {
                                        createCurrentDateTimePicker.toLocaleTimeString(
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
                                showDatePickerModalCreate && (
                                <DateTimePicker
                                    value={createCurrentDateTimePicker}
                                    mode={'date'}
                                    display={"spinner"}
                                    is24Hour={true}
                                    timeZoneName={'America/Sao_Paulo'}
                                    onChange={(_, newDate)=>{ 
                                        setShowDatePickerModalCreate(false);

                                        console.log(newDate);

                                        setCreateCurrentDateTimePicker(newDate); 
                                    }} 
                                />
                            )}

                            {
                                showHourPickerModalCreate && (
                                    <DateTimePicker
                                        value={createCurrentDateTimePicker}
                                        mode={'time'}
                                        display={"clock"}
                                        is24Hour={true}
                                        timeZoneName={'America/Sao_Paulo'}
                                        onChange={(_, newTime)=>{ 
                                            setShowHourPickerModalCreate(false);

                                            console.log(newTime);

                                            setCreateCurrentDateTimePicker(newTime); 
                                        }} 
                                    />
                            )}
                            </SafeAreaView>
                            
                        </View>


                        <TouchableOpacity style={PrevisionStyle.modalCreateAnotationSubmit} onPress={() => createAnotation()}>
                            <Text style={{ ...PrevisionStyle.modalCreateAnotationText, fontSize: 17 }}>Criar</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ ...PrevisionStyle.previsionLoadingView, display: previsionLoadingIconDisplay }}>
                        <ActivityIndicator size="large" animation={true} color={"white"}
                            style={PrevisionStyle.previsionLoadingIcon} />
                    </View>
                </View>

            </Modal>

            <View style={PrevisionStyle.previsionHeader}>
                <TouchableOpacity style={PrevisionStyle.backToHomeButton} onPress={() =>
                    router.push(`home?user=${JSON.stringify(user)}`)}>
                    <AntDesign name="left" size={24} color="black" />
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
                    Temp Seco: <Text style={{fontWeight: '900'}}>{Average_TempSeco}ºC</Text>
                </Text>
                <Text style={PrevisionStyle.previsionMonthlyAverageText}>
                    Temp Úmido: <Text style={{fontWeight: '900'}}>{Average_TempUmido}ºC</Text>
                </Text>

                <Text style={{...PrevisionStyle.previsionMonthlyAverageText, width: '100%'}}>
                    UR: <Text style={{fontWeight: '900'}}>{Average_UR}</Text>
                </Text>

                <Text style={PrevisionStyle.previsionMonthlyAverageText}>
                    Temp Mínima: <Text style={{fontWeight: '900'}}>{Average_TempMin}ºC</Text>
                </Text>
                <Text style={PrevisionStyle.previsionMonthlyAverageText}>
                    Temp Máxima: <Text style={{fontWeight: '900'}}>{Average_TempMax}ºC</Text>
                </Text>

                <Text style={PrevisionStyle.previsionMonthlyAverageText}>
                    Precipitação: <Text style={{fontWeight: '900'}}>{Average_Preciptacao}mm</Text>
                </Text>

                <Text style={PrevisionStyle.previsionMonthlyAverageText}>
                    Ceu WeWe: <Text style={{fontWeight: '900'}}>{Average_CeuWeWe}</Text>
                </Text>

                <Text style={PrevisionStyle.previsionMonthlyAverageText}>
                    Solo 0900: <Text style={{fontWeight: '900'}}>{Average_Solo0900}</Text>
                </Text>

                <Text style={PrevisionStyle.previsionMonthlyAverageText}>
                    Pressão: <Text style={{fontWeight: '900'}}>{Average_Pressao}hPa</Text>
                </Text>

                <Text style={{...PrevisionStyle.previsionMonthlyAverageText, width: '100%'}}>
                    Veloc Vento Km/h: <Text style={{fontWeight: '900'}}>{Average_VelocidadeVento}Km/h</Text>
                </Text>

            </View>

            <View style={PrevisionStyle.generateButtonsWrapper}>

                <TouchableOpacity style={[PrevisionStyle.generateButton, PrevisionStyle.createAnotationButton]}
                    onPress={() => setModalCreateAnotation(!modalCreateAnotation)}>
                    <Text style={PrevisionStyle.generateButtonText}>
                        Inserir Informações na Previsão
                    </Text>
                </TouchableOpacity>

                <Text style={PrevisionStyle.generateButtonsTitle}>Gerar Excel e Gráficos</Text>

                <View style={PrevisionStyle.generateButtonsView}>

                    <TouchableOpacity style={PrevisionStyle.generateButton}
                        onPress={() => generateExcel(7)}>
                        <Text style={PrevisionStyle.generateButtonText}>Semanal</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={PrevisionStyle.generateButton}
                        onPress={() => generateExcel(15)}>
                        <Text style={PrevisionStyle.generateButtonText}>Quinzenal</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={PrevisionStyle.generateButton}
                        onPress={() => generateExcel(31)}>
                        <Text style={PrevisionStyle.generateButtonText}>Mensal</Text>
                    </TouchableOpacity>

                </View>

            </View>

        </ScrollView>

    );

}

/*

<FlatList 
                style={{width: '92%', minHeight: '20%', maxHeight: '60%', backgroundColor: '#bdbdbd', borderRadius: 4, marginTop: 20}}
                showsHorizontalScrollIndicator={true}
                showsVerticalScrollIndicator={true}
            />

                homeGenerateExcel:{
                    width: 200,
                    height: 38,
                    backgroundColor: '#262626',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 5
                }

                */
