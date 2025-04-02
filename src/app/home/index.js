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
    Image
} from "react-native";
import {
    SafeAreaView
} from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";

// Style
import HomeStyle from "./home-style.js";

// Icons
import { AntDesign, Entypo } from '@expo/vector-icons';

// Firestore
import { Database } from '../firebase.initialize.js';
import { collection, getDocs, addDoc, Timestamp, query, orderBy, onSnapshot } from 'firebase/firestore'

import { Collapse, CollapseHeader, CollapseBody } from 'accordion-collapse-react-native';


// Home Function
export default function Home() {

    // User
    const user = JSON.parse(useLocalSearchParams().user);
    const userName = user.userName;

    if (user === null || user === undefined) {
        router.push('login');

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

        const finalDataPrevisions = [];

        const getPrevisionsQuery = query(PrevisionsDatabaseRef, orderBy("createdAt", "asc"));

        await getDocs(getPrevisionsQuery).then((querySnapshot) => {
            querySnapshot.docs.forEach((doc) => {

                let previsionYear = doc.data().createdAt.toDate().getFullYear().toString();

                if (!finalDataPrevisions[previsionYear]){
                    finalDataPrevisions[previsionYear] = [];
                    finalDataPrevisions[previsionYear].push({title: 'Previsões de ' + previsionYear});

                }

                finalDataPrevisions[previsionYear].push(doc);

            });
        })

        setNewPrevision(finalDataPrevisions);

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

        setModalCreatePrevision(!modalCreatePrevision);

    }

    // Go To Prevision Info
    function goToPrevisionInfo(previsionInfo) {
        router.push(`prevision?user=${JSON.stringify(user)}&previsionId=${previsionInfo.id}`);
        return true;

    }

    // Call Get All Previsions Async Function
    useEffect(() => {
        getAllPrevisions();
        realTimeUpdatePrevisions();

    }, []);

    // Return
    return (

        <SafeAreaView style={{ ...HomeStyle.mainContainer }}>

            <StatusBar style="light" backgroundColor="#262626" />

            <Image style={HomeStyle.homeBackgroundImage} source={require('../../../assets/home/home-background.jpg')} />

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalCreatePrevision}
                onRequestClose={() => {
                    setModalCreatePrevision(!modalCreatePrevision);
                }}>

                <View style={HomeStyle.modalCreatePrevisionContainer}>
                    <View style={HomeStyle.modalCreatePrevisionView}>

                        <TouchableOpacity style={HomeStyle.modalCreatePrevisionCloseButton} onPress={() => setModalCreatePrevision(!modalCreatePrevision)}>
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

            <View style={HomeStyle.homeHeader}>
                <Text style={HomeStyle.headerText}>
                    {dateLocalTime} <Text style={{ color: "#1195f2", fontWeight: "bold" }}>{userName}</Text>
                </Text>
            </View>

            <View style={HomeStyle.homeWrapper}>

                {

                    allPrevisions.map(function(prevision){

                        let previsionsList = prevision.slice(1, prevision.length);

                        return <Collapse>

                            <CollapseHeader>
                                <View style={HomeStyle.homePrevisionBox}>

                                    <Image style={HomeStyle.homePrevisionBoxIcon} source={require('../../../assets/home/prevision-box-icon.png')} />

                                    <Text style={HomeStyle.homePrevisionBoxTitle}>{prevision[0].title}</Text>

                                </View>
                            </CollapseHeader>

                            <CollapseBody style={{ paddingBottom: 50 }}>
                                <FlatList
                                    style={HomeStyle.homePrevisionsList}
                                    contentContainerStyle={{ alignItems: 'center', paddingBottom: 150 }}
                                    data={previsionsList}
                                    keyExtractor={item => item.id}
                                    renderItem={({ item }) => {

                                        return <View style={{ ...HomeStyle.homePrevisionBox, padding: 9 }} previsionId={item.id}>

                                            <Image style={HomeStyle.homePrevisionBoxIcon} source={require('../../../assets/home/prevision-box-icon.png')} />

                                            <Text style={HomeStyle.homePrevisionBoxTitle}>{item.data().previsionTitle}</Text>

                                            <TouchableOpacity style={HomeStyle.homePrevisionBoxButton} onPress={() => goToPrevisionInfo(item)}>
                                                <Entypo name="dots-three-horizontal" size={26} color="black" />
                                            </TouchableOpacity>

                                        </View>

                                    }}
                                />
                            </CollapseBody>

                        </Collapse>

                    })

                }

            </View>

            {
                user.isAdministrator
                    ?
                    <TouchableOpacity style={HomeStyle.homeCreatePrevisionButton}
                        onPress={() => setModalCreatePrevision(!modalCreatePrevision)}>
                        <AntDesign name="plus" size={24} color="black" />
                    </TouchableOpacity>
                    :
                    ''
            }

        </SafeAreaView>

    );

}
