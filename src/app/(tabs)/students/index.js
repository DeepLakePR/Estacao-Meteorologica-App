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
import { AntDesign, Entypo, FontAwesome } from '@expo/vector-icons';

// Firestore
import { Database } from '../../../services/firebase.initialize.js';
import { collection, getDocs, addDoc, Timestamp, query, orderBy, onSnapshot } from 'firebase/firestore'

export default function Students() {

    // Return
    return (
        <SafeAreaProvider style={{ flex: 1 }}>
            <SafeAreaView style={StudentsStyle.mainContainer} edges={['top']}>

                <StatusBar style="light" backgroundColor="#3B6BA5" />

                {/* Modal Creation & Edit */}
                <Modal
                    statusBarTranslucent={true}
                    animationType="fade"
                    transparent={true}
                    visible={true}
                    onRequestClose={()=>{}}>

                        <View style={StudentsStyle.modalStudentsManagementContainer}>
                            <View style={StudentsStyle.modalStudentsManagementView}>

                                <TouchableOpacity style={StudentsStyle.modalStudentsManagementButton}>
                                    <AntDesign name="close" size={24} color="black" />
                                </TouchableOpacity>
                            
                                <Text style={StudentsStyle.modalStudentsManagementTitle}>
                                    {/*isEdit ? 'Editar Estudante' : 'Criar Estudante'*/} 
                                    Criar Estudante
                                </Text>

                                <TextInput style={StudentsStyle.modalStudentsManagementInput} maxLength={75} placeholder={"Nome"} placeholderTextColor={"#ccc"} />

                                <TextInput style={StudentsStyle.modalStudentsManagementInput} maxLength={75} placeholder={"CGM"} placeholderTextColor={"#ccc"} />

                                <TextInput style={StudentsStyle.modalStudentsManagementInput} maxLength={75} placeholder={"Senha"} placeholderTextColor={"#ccc"} />

                                <TouchableOpacity style={StudentsStyle.modalStudentsManagementButton}>
                                    <Text style={StudentsStyle.modalStudentsManagementButtonText}>
                                        Salvar
                                    </Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                </Modal>

                {/* Students Header */}
                <View style={StudentsStyle.header}>
                    <Text style={StudentsStyle.headerText}>
                        Estudantes
                    </Text>

                    {/* Create Student */}
                    <TouchableOpacity style={StudentsStyle.studentsCreateStudentButton}
                        >
                        <AntDesign name="plus" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                {/* List Students */}
                <ScrollView style={StudentsStyle.studentsListWrapper} contentContainerStyle={{ alignItems: 'center', justifyContent: 'flex-start', paddingBottom: 70 }}>

                    {/* Student Box */}
                    <View style={StudentsStyle.studentsBoxSingle}>
                        <Text style={StudentsStyle.studentsBoxSingleText}>student.name | student.cgm</Text>

                        <TouchableOpacity style={StudentsStyle.studentsBoxSingleButton}>
                            <FontAwesome name="gear" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    <View style={StudentsStyle.studentsBoxSingle}>
                        <Text style={StudentsStyle.studentsBoxSingleText}>student.name | student.cgm</Text>

                        <TouchableOpacity style={StudentsStyle.studentsBoxSingleButton}>
                            <FontAwesome name="gear" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    <View style={StudentsStyle.studentsBoxSingle}>
                        <Text style={StudentsStyle.studentsBoxSingleText}>student.name | student.cgm</Text>

                        <TouchableOpacity style={StudentsStyle.studentsBoxSingleButton}>
                            <FontAwesome name="gear" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    <View style={StudentsStyle.studentsBoxSingle}>
                        <Text style={StudentsStyle.studentsBoxSingleText}>student.name | student.cgm</Text>

                        <TouchableOpacity style={StudentsStyle.studentsBoxSingleButton}>
                            <FontAwesome name="gear" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    <View style={StudentsStyle.studentsBoxSingle}>
                        <Text style={StudentsStyle.studentsBoxSingleText}>student.name | student.cgm</Text>

                        <TouchableOpacity style={StudentsStyle.studentsBoxSingleButton}>
                            <FontAwesome name="gear" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    <View style={StudentsStyle.studentsBoxSingle}>
                        <Text style={StudentsStyle.studentsBoxSingleText}>student.name | student.cgm</Text>

                        <TouchableOpacity style={StudentsStyle.studentsBoxSingleButton}>
                            <FontAwesome name="gear" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    <View style={StudentsStyle.studentsBoxSingle}>
                        <Text style={StudentsStyle.studentsBoxSingleText}>student.name | student.cgm</Text>

                        <TouchableOpacity style={StudentsStyle.studentsBoxSingleButton}>
                            <FontAwesome name="gear" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    <View style={StudentsStyle.studentsBoxSingle}>
                        <Text style={StudentsStyle.studentsBoxSingleText}>student.name | student.cgm</Text>

                        <TouchableOpacity style={StudentsStyle.studentsBoxSingleButton}>
                            <FontAwesome name="gear" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    <View style={StudentsStyle.studentsBoxSingle}>
                        <Text style={StudentsStyle.studentsBoxSingleText}>student.name | student.cgm</Text>

                        <TouchableOpacity style={StudentsStyle.studentsBoxSingleButton}>
                            <FontAwesome name="gear" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    <View style={StudentsStyle.studentsBoxSingle}>
                        <Text style={StudentsStyle.studentsBoxSingleText}>student.name | student.cgm</Text>

                        <TouchableOpacity style={StudentsStyle.studentsBoxSingleButton}>
                            <FontAwesome name="gear" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    <View style={StudentsStyle.studentsBoxSingle}>
                        <Text style={StudentsStyle.studentsBoxSingleText}>student.name | student.cgm</Text>

                        <TouchableOpacity style={StudentsStyle.studentsBoxSingleButton}>
                            <FontAwesome name="gear" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    <View style={StudentsStyle.studentsBoxSingle}>
                        <Text style={StudentsStyle.studentsBoxSingleText}>student.name | student.cgm</Text>

                        <TouchableOpacity style={StudentsStyle.studentsBoxSingleButton}>
                            <FontAwesome name="gear" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    <View style={StudentsStyle.studentsBoxSingle}>
                        <Text style={StudentsStyle.studentsBoxSingleText}>student.name | student.cgm</Text>

                        <TouchableOpacity style={StudentsStyle.studentsBoxSingleButton}>
                            <FontAwesome name="gear" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    <View style={StudentsStyle.studentsBoxSingle}>
                        <Text style={StudentsStyle.studentsBoxSingleText}>student.name | student.cgm</Text>

                        <TouchableOpacity style={StudentsStyle.studentsBoxSingleButton}>
                            <FontAwesome name="gear" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    <View style={StudentsStyle.studentsBoxSingle}>
                        <Text style={StudentsStyle.studentsBoxSingleText}>student.name | student.cgm</Text>

                        <TouchableOpacity style={StudentsStyle.studentsBoxSingleButton}>
                            <FontAwesome name="gear" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                </ScrollView>

            </SafeAreaView>
        </SafeAreaProvider>
    );

}
