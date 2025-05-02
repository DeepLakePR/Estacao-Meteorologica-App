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
import StudentsStyle from "../../../styles/students-style.js";

// Icons
import { AntDesign, Entypo } from '@expo/vector-icons';

// Firestore
import { Database } from '../../../services/firebase.initialize.js';
import { collection, getDocs, addDoc, Timestamp, query, orderBy, onSnapshot } from 'firebase/firestore'

export default function Students() {

    // Return
    return (
        <SafeAreaProvider style={{ flex: 1 }}>
            <SafeAreaView style={StudentsStyle.mainContainer} edges={['top']}>

                <StatusBar style="light" backgroundColor="#3B6BA5" />

                {/* Students Header */}
                <View style={StudentsStyle.studentsHeader}>
                    <Text style={StudentsStyle.headerText}>
                        Estudantes
                    </Text>

                    {/* Create Student */}
                    <TouchableOpacity style={StudentsStyle.studentsCreatePrevisionButton}
                        >
                        <AntDesign name="plus" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                {/* List Students */}
                <ScrollView style={StudentsStyle.studentsWrapper} contentContainerStyle={{ alignItems: 'center', justifyContent: 'flex-start' }}>

                </ScrollView>

            </SafeAreaView >
        </SafeAreaProvider>
    );

}
