import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import {
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Keyboard,
    Modal,
    Image,
    ScrollView,
    ToastAndroid
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from "expo-router";

// Style
import HomeStyle from "../../../styles/home-style.js";

// Icons
import { AntDesign, Entypo } from '@expo/vector-icons';

// Firestore
import { Database } from '../../../services/firebase.initialize.js';
import { collection, getDocs, addDoc, Timestamp, query, orderBy, onSnapshot } from 'firebase/firestore'

import { Collapse, CollapseHeader, CollapseBody } from 'accordion-collapse-react-native';
import LoadingComponent from "../../../components/LoadingComponent";

// Home Function
export default function Home() {

    // Is Loading 
    const [isLoadingInfo, setIsLoadingInfo] = useState(true);

    // User
    const user = JSON.parse(useLocalSearchParams().user);
    const userName = user.userName;

    if (user === null || user === undefined) {
        router.push('/login');

    }

    // Previsions
    const PrevisionsDatabaseRef = collection(Database, "previsions");

    const [modalCreatePrevision, setModalCreatePrevision] = useState(false);
    const [newPrevisionTitle, setNewPrevisionTitle] = useState(null);

    const [allPrevisions, setNewPrevision] = useState([]);

    // Get Date Local Time
    const CurrentHours = new Date().getHours();

    var dateLocalTime = CurrentHours >= 5 && CurrentHours <= 12 ? 'Bom dia,' : CurrentHours >= 13 && CurrentHours <= 17 ? 'Boa tarde,' : 'Boa noite,'

    // Get All Previsions
    async function getAllPrevisions() {

        setIsLoadingInfo(true);

        const finalDataPrevisions = [];

        const getPrevisionsQuery = query(PrevisionsDatabaseRef, orderBy("createdAt", "asc"));

        await getDocs(getPrevisionsQuery).then((querySnapshot) => {
            querySnapshot.docs.forEach((doc) => {

                let previsionYear = doc.data().createdAt.toDate().getFullYear().toString();

                if (!finalDataPrevisions[previsionYear]) {
                    finalDataPrevisions[previsionYear] = [];
                    finalDataPrevisions[previsionYear].push({ title: previsionYear });

                }

                finalDataPrevisions[previsionYear].push(doc);

            });
        })

        setNewPrevision(finalDataPrevisions);
        setIsLoadingInfo(false);

    }

    // Real Time Update Previsions
    async function realTimeUpdatePrevisions() {

        const realTimeUpdateQuery = query(PrevisionsDatabaseRef);
        await onSnapshot(realTimeUpdateQuery, () => {
            getAllPrevisions();

        });

    }

    // Create New Prevision
    async function createPrevision() {

        Keyboard.dismiss();

        // Check if is empty
        if (newPrevisionTitle === null || newPrevisionTitle.trim() === '') {
            return alert("Insira o nome da nova previsão.");
        }

        // Create New Prevision Document
        await addDoc(PrevisionsDatabaseRef, {
            previsionTitle: newPrevisionTitle,
            createdAt: Timestamp.fromDate(new Date()),
            createdBy: userName,
        });

        setModalCreatePrevision(false);
        ToastAndroid.show("Previsão criada com sucesso.", ToastAndroid.SHORT);

    }

    // Go To Prevision Info
    function goToPrevisionInfo(previsionInfo) {
        router.push(`/prevision?user=${JSON.stringify(user)}&previsionId=${previsionInfo.id}`);
        return true;

    }

    // Call Get All Previsions Async Function
    useEffect(() => {
        getAllPrevisions();
        realTimeUpdatePrevisions();

    }, []);

    // Is Loading
    if(isLoadingInfo) 
        return <LoadingComponent />

    // Return
    return (

        <SafeAreaProvider style={{ flex: 1 }}>
            <SafeAreaView style={HomeStyle.mainContainer} edges={['top']}>

                <StatusBar style="light" backgroundColor="#3B6BA5" />

                <Image style={HomeStyle.homeBackgroundImage} source={require('../../../../assets/home/home-background.jpg')} />

                {/* Create Prevision */}
                <Modal
                    statusBarTranslucent={true}
                    animationType="fade"
                    transparent={true}
                    visible={modalCreatePrevision}
                    onRequestClose={() => {
                        setModalCreatePrevision(false);
                    }}>

                    <View style={HomeStyle.modalCreatePrevisionContainer}>
                        <View style={HomeStyle.modalCreatePrevisionView}>

                            <TouchableOpacity style={HomeStyle.modalCreatePrevisionCloseButton} onPress={() => setModalCreatePrevision(false)}>
                                <Text style={HomeStyle.modalCreatePrevisionText}>X</Text>
                            </TouchableOpacity>

                            <Text style={HomeStyle.modalCreatePrevisionTitle}>Criar Previsão</Text>

                            <TextInput style={HomeStyle.modalCreatePrevisionInput} onChangeText={(newText) => setNewPrevisionTitle(newText)} placeholder={"Nome da Previsão"} placeholderTextColor={'#a8a8a8'} />

                            <TouchableOpacity style={HomeStyle.modalCreatePrevisionSubmit} onPress={() => createPrevision()}>
                                <Text style={{ ...HomeStyle.modalCreatePrevisionText, fontSize: 17 }}>Criar</Text>
                            </TouchableOpacity>

                        </View>
                    </View>

                </Modal>

                {/* Header */}
                <View style={HomeStyle.header}>
                    <Text style={HomeStyle.headerText}>
                        {dateLocalTime} <Text style={{ color: "#38BDF8", fontWeight: "bold" }}>{userName}</Text>
                    </Text>
                </View>

                {/* List Previsions */}
                <ScrollView style={HomeStyle.homeWrapper} contentContainerStyle={{ alignItems: 'center', justifyContent: 'flex-start' }}>

                    <View style={HomeStyle.homeWrapperHeader}>
                        <Text style={HomeStyle.homeWrapperTitle}>Lista de Previsões</Text>

                        {/* Create Prevision */}
                        {
                            user.isAdministrator
                                ?
                                <TouchableOpacity style={HomeStyle.homeCreatePrevisionButton}
                                onPress={() => setModalCreatePrevision(true)}
                                    >
                                    <AntDesign name="plus" size={24} color="white" />
                                </TouchableOpacity>
                                :
                                ''
                        }
                    </View>

                    {

                        allPrevisions.map(function (prevision, _i) {

                            let previsionsList = prevision.slice(1, prevision.length);

                            return <Collapse key={_i} touchableOpacityProps={{ activeOpacity: 0.5 }}>

                                <CollapseHeader accessibilityLabel={`${prevision[0].title}, abrir meses`}>
                                    <View style={{ ...HomeStyle.homePrevisionBox, backgroundColor: '#5C7FBF' }}>

                                        <Image style={HomeStyle.homePrevisionBoxIcon} source={require('../../../../assets/home/prevision-box-icon.png')} />

                                        <Text style={{ ...HomeStyle.homePrevisionBoxTitle, color: 'white' }}>{prevision[0].title}</Text>

                                    </View>
                                </CollapseHeader>

                                <CollapseBody style={HomeStyle.homePrevisionBoxCollapseBody}>

                                    {/* FlatList Previsions */

                                        previsionsList.map(function (prevision, __i) {

                                            return <View style={{ ...HomeStyle.homePrevisionBox, padding: 9 }} previsionId={prevision.id} key={__i}>

                                                <Image style={{...HomeStyle.homePrevisionBoxIcon, width: 28, height: 28}} source={require('../../../../assets/home/prevision-box-icon.png')} />

                                                <Text style={HomeStyle.homePrevisionBoxTitle}>{prevision.data().previsionTitle}</Text>

                                                <TouchableOpacity style={HomeStyle.homePrevisionBoxButton} onPress={() => goToPrevisionInfo(prevision)} activeOpacity="0.7">
                                                    <Entypo name="dots-three-horizontal" size={24} color="#5C7FBF" />
                                                </TouchableOpacity>

                                            </View>

                                        })

                                    }

                                </CollapseBody>

                            </Collapse>

                        })

                    }

                </ScrollView>

            </SafeAreaView>
        </SafeAreaProvider>

    );

}
