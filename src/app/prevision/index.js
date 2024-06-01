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
    ActivityIndicator
} from "react-native";

import {
    useSafeAreaInsets
} from "react-native-safe-area-context";

import { router, useLocalSearchParams } from "expo-router";

import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

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

    // Prevision
    const PrevisionsDatabaseRef = collection(Database, "previsions");
    const PrevisionDocRef = doc(Database, "previsions", previsionId);
    const PrevisionAnotationsRef = collection(PrevisionDocRef, "previsionAnotations");

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

        await dates.then((anotationsList)=>{

            anotationsList.forEach(async(anotationInfo, index)=>{

                await XLSX.utils.sheet_add_aoa(ws, [
                    anotationInfo
                ], { origin: index + 1});

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
        const storageToSaveUri = await StorageAccessFramework.requestDirectoryPermissionsAsync().then((response)=>{
            if(response.granted){
                return response.directoryUri;
            }
        })

        const newExcelFile = await StorageAccessFramework.createFileAsync(
            storageToSaveUri,
            fileName,
            'base64'
        )

        setTimeout(async()=>{
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

        if(maxDaysToGet){
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

            querySnapshot.docs.forEach((anotationDoc) => {

                finalDataPrevisionAnotations.push([

                    anotationDoc.data().anotationCreatedAt.toDate().toLocaleString(
                        'pt-BR',
                        {
                            day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
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

            });

        });

        if(isSetState){
            setPrevisionAnotationsInfo(finalDataPrevisionAnotations);
            return;

        }else{
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
                'anotationCreatedAt': new Date(),
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

    useEffect(() => {
        getPrevisionAnotationsInfo(true);
        getPrevisionInfo();
        realTimeUpdatePrevisionAnotations();

    }, []);

    // Return
    return (

        <View style={PrevisionStyle.mainContainer}>

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

                            <TextInput style={PrevisionStyle.modalCreateAnotationInput}
                                placeholder={"Direção"} placeholderTextColor={mainInputsPHTextColor}
                                onChangeText={(text) => setNewPrevisionAnotationInput(text, null, 'direcao')} />

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

                <ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>

                    <ScrollView
                        horizontal={true} showsHorizontalScrollIndicator={true}
                        showsVerticalScrollIndicator={true}
                        style={PrevisionStyle.previsionTableScrollView}>

                        <Table borderStyle={{ borderWidth: 1, borderColor: '#d9d9d9' }}>

                            <Row data={HeadTable} style={PrevisionStyle.previsionTableHead} textStyle={PrevisionStyle.previsionTableText} widthArr={previsionTableWidthColumns} />

                            <Rows data={previsionAnotationsInfo} style={PrevisionStyle.previsionTableRow} textStyle={PrevisionStyle.previsionTableText} widthArr={previsionTableWidthColumns} />

                        </Table>

                    </ScrollView>

                </ScrollView>

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

        </View>

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
