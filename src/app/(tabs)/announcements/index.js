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
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from "expo-router";

// Style
import AnnouncementsStyle from "../../../styles/announcements-style.js";

// Icons
import { AntDesign, Entypo, FontAwesome } from '@expo/vector-icons';

// Firestore
import { Database } from '../../../services/firebase.initialize.js';
import { collection, getDocs, addDoc, Timestamp, query, orderBy, onSnapshot } from 'firebase/firestore'

export default function Announcements() {

    // Return
    return (
        <SafeAreaProvider style={{ flex: 1 }}>
            <SafeAreaView style={AnnouncementsStyle.mainContainer} edges={['top']}>

                <StatusBar style="light" backgroundColor="#3B6BA5" />

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
                    ></TextInput>

                    <TouchableOpacity style={AnnouncementsStyle.announcementsCreateMessageButton}>
                        <Text style={{color: 'white', fontSize: 16}}>Criar Comunicado</Text>
                    </TouchableOpacity>
                </View>

                {/* Divider */}
                <View style={{height: 2, width: '95%', backgroundColor: '#757575', borderRadius: '50%'}}></View>

                {/* List Announcements */}
                <ScrollView style={AnnouncementsStyle.announcementsListWrapper} contentContainerStyle={{ alignItems: 'center', justifyContent: 'flex-start', paddingBottom: 70 }}>

                    <Text style={AnnouncementsStyle.announcementsListWrapperTitle}>Últimos Comunicados</Text>

                    {/* Announcements Box */}
                    <View style={AnnouncementsStyle.announcementsBoxSingle}>

                        <View style={AnnouncementsStyle.announcementsBoxSingleHeader}>
                            <Text style={AnnouncementsStyle.announcementsBoxSingleHeaderText}>announcement.admin</Text>

                            <Text style={AnnouncementsStyle.announcementsBoxSingleHeaderDate}>announcement.date</Text>
                        </View>

                        <Text style={AnnouncementsStyle.announcementsBoxSingleMessage}>announcement.message</Text>

                        <TouchableOpacity style={AnnouncementsStyle.announcementsBoxSingleButton}>
                            <FontAwesome name="gear" size={20} color="white" />
                        </TouchableOpacity>

                    </View>

                </ScrollView>

            </SafeAreaView>
        </SafeAreaProvider>
    );

}
