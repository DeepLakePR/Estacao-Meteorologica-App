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
    ToastAndroid,
    Alert
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { router, useGlobalSearchParams } from "expo-router";

// Style
import AnnouncementsStyle from "../../../styles/announcements-style.js";

// Icons
import { AntDesign, Entypo, FontAwesome } from '@expo/vector-icons';

// Firestore
import { Database } from '../../../services/firebase.initialize.js';
import { collection, doc, updateDoc, getDocs, addDoc, Timestamp, query, orderBy, onSnapshot, limit, deleteDoc } from 'firebase/firestore'
import LoadingComponent from "../../../components/LoadingComponent";

// Variables
const DATE_FORMAT = { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' }

export default function Announcements() {

    const user = JSON.parse(Array.isArray(useGlobalSearchParams().user) ? useGlobalSearchParams().user[0] : useGlobalSearchParams().user);

    const [isLoading, setIsLoading] = useState(true);

    const [announcementMessage, setAnnouncementMessage] = useState({});

    const [announcementsData, setAnnouncementsData] = useState([]);

    const [announcementModal, setAnnouncementModal] = useState(false);

    // Database References
    const AnnouncementsCollectionRef = collection(Database, "announcements");

    const Announcements_C_Query = query(AnnouncementsCollectionRef, orderBy('date', 'desc'), limit(5))

    function getAllAnnouncementsData() {

        setIsLoading(true);

        const unsubscribe = onSnapshot(Announcements_C_Query, (querySnapshot) => {

            const temp_announcements = [];

            querySnapshot.forEach((announcement) => {

                temp_announcements.push({
                    ...announcement.data(),
                    id: announcement.id
                });

            });

            setAnnouncementsData(temp_announcements);

        });

        setIsLoading(false);

        return () => unsubscribe();

    }

    async function getRealTimeAnnouncements() {

        await onSnapshot(Announcements_C_Query, () => {
            getAllAnnouncementsData();

        });

    }

    function createAnnouncement() {

        if (!user.isAdministrator) return alert("Você não tem permissão para criar comunicados.");

        if (!announcementMessage.newMessage || announcementMessage.newMessage.trim().length === 0) return alert("Preencha o campo de comunicado.");

        const DB_Ref_Announcements = collection(Database, "announcements");
        const DB_Ref_CreatedDoc = addDoc(DB_Ref_Announcements, {
            message: announcementMessage.newMessage.trim(),
            date: Timestamp.now(),
            author: user.userName
        });

        DB_Ref_CreatedDoc.then(() => {
            setAnnouncementMessage({});
            Keyboard.dismiss();

        }).catch((error) => {
            alert("Erro ao criar comunicado, tente novamente mais tarde.");

            throw new Error("Erro ao criar comunicado: " + error);

        });

    }

    async function handleAnnouncementEdit(type) {

        try {

            if (!user.isAdministrator) return alert("Você não tem permissão para editar comunicados.");

            if (type === 'saveEdit') {
                
                if (!announcementMessage.message || announcementMessage.message.trim().length === 0) return alert("Preencha o campo de comunicado.");

                await updateDoc(
                    doc(AnnouncementsCollectionRef, announcementMessage.id),
                    (
                        ({ id, ...announcementMessage }) => ({
                            ...announcementMessage, date:
                                Timestamp.now()
                        })
                    )(announcementMessage)
                );

                ToastAndroid.show("Comunicado editado com sucesso.", ToastAndroid.SHORT);

                setAnnouncementModal(false);
                setAnnouncementMessage({});

            } else if (type === 'delete') {

                Alert.alert(
                    "Deletar Comunicado?",
                    "Você tem certeza que deseja deletar esse comunicado?",
                    [
                        {
                            text: "Cancelar", style: "cancel"
                        },
                        {
                            text: "Deletar",
                            onPress: async () => {
                                await deleteDoc(
                                    doc(AnnouncementsCollectionRef, announcementMessage.id)
                                );
                                ToastAndroid.show("Comunicado deletado com sucesso.", ToastAndroid.SHORT);

                                setAnnouncementModal(false);
                                setAnnouncementMessage({});
                            }
                        }
                    ]
                )

            }

        } catch (error) {
            setAnnouncementModal(false);
            alert("Erro ao editar comunicado, tente novamente mais tarde.");

        }

    }

    useEffect(() => {
        getAllAnnouncementsData();
        getRealTimeAnnouncements();

    }, []);

    if (isLoading)
        return <LoadingComponent />

    return (
        <SafeAreaProvider style={{ flex: 1 }}>
            <SafeAreaView style={AnnouncementsStyle.mainContainer} edges={['top']}>

                <StatusBar style="light" backgroundColor="#3B6BA5" />

                {/* Edit */}
                <Modal
                    statusBarTranslucent={true}
                    animationType="fade"
                    transparent={true}
                    visible={announcementModal}
                    onRequestClose={() => { setAnnouncementModal(false) }}>

                    <View style={AnnouncementsStyle.modalAnnouncementsManagementContainer}>
                        <View style={AnnouncementsStyle.modalAnnouncementsManagementView}>

                            <TouchableOpacity style={AnnouncementsStyle.modalAnnouncementsManagementExitButton}
                                onPress={() => setAnnouncementModal(false)}>
                                <AntDesign name="close" size={24} color="black" />
                            </TouchableOpacity>

                            <Text style={AnnouncementsStyle.modalAnnouncementsManagementTitle}>Editar Comunicado</Text>

                            <TextInput
                                style={AnnouncementsStyle.modalAnnouncementsManagementInput}
                                multiline={true}
                                numberOfLines={10}
                                scrollEnabled={true}
                                maxLength={500}
                                placeholder="Escreva seu comunicado..."
                                placeholderTextColor="#d1d1d1"
                                value={announcementMessage.message ? announcementMessage.message : ""}
                                autoComplete="off" autoFocus={true} inputMode="text"
                                onChangeText={(text) => setAnnouncementMessage({ ...announcementMessage, message: text })}
                            />

                            <TouchableOpacity style={AnnouncementsStyle.modalAnnouncementsManagementSaveButton} activeOpacity={0.6}
                                onPress={() => handleAnnouncementEdit('saveEdit')}>
                                <Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>
                                    Salvar
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={AnnouncementsStyle.modalAnnouncementsManagementDeleteButton} activeOpacity={0.25}
                                onPress={() => handleAnnouncementEdit('delete')}
                            >
                                <FontAwesome name="trash" size={22} color="black" />
                            </TouchableOpacity>

                        </View>
                    </View>
                </Modal>

                {/* Announcements Header */}
                <View style={AnnouncementsStyle.header}>
                    <Text style={AnnouncementsStyle.headerText}>
                        Comunicados
                    </Text>
                </View>

                <View style={AnnouncementsStyle.announcementsCreateMessage}>
                    <TextInput
                        style={AnnouncementsStyle.announcementsCreateMessageInput}
                        multiline={true}
                        numberOfLines={10}
                        scrollEnabled={true}
                        maxLength={500}
                        placeholder="Escreva seu comunicado..."
                        placeholderTextColor="#d1d1d1"
                        value={announcementMessage.newMessage ? announcementMessage.newMessage : ""}
                        onChangeText={(text) => setAnnouncementMessage({ newMessage: text })}
                    />

                    <TouchableOpacity
                        style={AnnouncementsStyle.announcementsCreateMessageButton}
                        onPress={() => createAnnouncement()}>
                        <Text style={{ color: 'white', fontSize: 16 }}>Criar Comunicado</Text>
                    </TouchableOpacity>
                </View>

                {/* Divider */}
                <View style={{ height: 2, width: '95%', backgroundColor: '#757575', borderRadius: '50%', marginBottom: 15 }}></View>

                {/* List Announcements */}
                <ScrollView style={AnnouncementsStyle.announcementsListWrapper} contentContainerStyle={{ alignItems: 'center', justifyContent: 'flex-start', paddingBottom: 70 }}>

                    <Text style={AnnouncementsStyle.announcementsListWrapperTitle}>Últimos Comunicados</Text>

                    {/* Announcements Box */
                        announcementsData.map((announcement, _) => {

                            return <View style={AnnouncementsStyle.announcementsBoxSingle} key={_}>

                                <View style={AnnouncementsStyle.announcementsBoxSingleHeader}>
                                    <Text style={AnnouncementsStyle.announcementsBoxSingleHeaderText}>{announcement.author}</Text>

                                    <Text style={AnnouncementsStyle.announcementsBoxSingleHeaderDate}>{announcement.date.toDate().toLocaleString('pt-BR', DATE_FORMAT)}</Text>
                                </View>

                                <Text style={AnnouncementsStyle.announcementsBoxSingleMessage}>{announcement.message}</Text>

                                <TouchableOpacity style={AnnouncementsStyle.announcementsBoxSingleButton}
                                    onPress={() => {
                                        setAnnouncementModal(true);
                                        setAnnouncementMessage(announcement)
                                    }}>
                                    <FontAwesome name="gear" size={20} color="white" />
                                </TouchableOpacity>

                            </View>
                        })
                    }

                </ScrollView>

            </SafeAreaView>
        </SafeAreaProvider>
    );

}
