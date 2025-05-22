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
    ToastAndroid,
    Alert
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from "expo-router";

// Style
import StudentsStyle from "../../../styles/students-style.js";

// Icons
import { AntDesign, Entypo, FontAwesome } from '@expo/vector-icons';

// Firestore
import { Database } from '../../../services/firebase.initialize.js';
import {
    collection,
    deleteDoc,
    addDoc,
    updateDoc,
    Timestamp,
    doc,
    query,
    orderBy,
    onSnapshot,
    where
} from 'firebase/firestore'
import LoadingComponent from "../../../components/LoadingComponent";

// Docs References
const StudentsCollectionRef = collection(Database, "users");

export default function Students() {

    const structure_studentInfo = {
        id: null,
        userName: null,
        userCGMRegister: null,
        password: null,
        isActivatedAccount: true,
        isAdministrator: false,
    };

    // Is Loading 
    const [isLoadingInfo, setIsLoadingInfo] = useState(true);

    // Students Data
    const [studentsData, setStudentsData] = useState([]);

    const [studentModal, setStudentModal] = useState(false);
    const [studentModalIsEdit, setStudentModalIsEdit] = useState(false);

    const [studentInfo, setStudentInfo] = useState(structure_studentInfo);

    // Create/Update New Student
    function handleStudentModalSave() {

        if (!studentModalIsEdit) {

            if (!studentInfo) return alert("É necessário preencher todos os campos.");

            if (Object.keys(studentInfo).some((key) => {
                if (
                    (key === "userName" && studentInfo[key] === null)
                    ||
                    (key === "userCGMRegister" && studentInfo[key] === null)
                    ||
                    (key === "userPassword" && studentInfo[key] === null)
                ) {
                    alert("É necessário preencher todos os campos.");
                    return true;

                };

            })) {
                return false;

            }

            addDoc(StudentsCollectionRef,
                (({ id, ...studentInfo }) => studentInfo)(studentInfo)
            )

            setStudentModal(false);

        } else {

            // Update Student
            const studentRef = doc(StudentsCollectionRef, studentInfo.id);

            updateDoc(studentRef,
                (({ id, ...studentInfo }) => studentInfo)(studentInfo)
            );

            setStudentModal(false);

        }

        setStudentInfo(structure_studentInfo);

    }

    function handleStudentStatus() {

        setStudentInfo(
            old => (
                { ...old, isActivatedAccount: !old.isActivatedAccount }
                
            )
        );

        const studentRef = doc(StudentsCollectionRef, studentInfo.id);
        updateDoc(studentRef,
            (({ id, ...studentInfo }) => studentInfo)(studentInfo)
        );

        ToastAndroid.show(
            `Conta ${studentInfo.isActivatedAccount ? "desativada" : "ativada"}`,
            ToastAndroid.SHORT
        );

    }

    function handleStudentDelete() {

        Alert.alert(
            "Deletar estudante?",
            `Você tem certeza que deseja deletar o(a) estudante ${studentInfo.userName}?`,
            [
                {
                    text: "Cancelar", style: "cancel"
                },
                {
                    text: "Deletar", onPress: () => {

                        const studentRef = doc(StudentsCollectionRef, studentInfo.id);
                        deleteDoc(studentRef);
                        setStudentModal(false);

                    }
                }
            ]
        );

    }

    // Handle Student Edit Open
    function handleStudentModalOpen(isEdit, student) {
        setStudentModal(true);

        setStudentModalIsEdit(isEdit);
        setStudentInfo(student);

    }

    // Handle Update Input Student Modal
    function handleStudentModalInputs(key, newValue) {
        setStudentInfo(old => ({
            ...old,
            [key]: newValue
        }));

    }

    // Get All Students
    function getAllStudentsData() {

        setIsLoadingInfo(true);

        const StudentsCollectionRef = collection(Database, "users");
        const S_C_Ref_Query = query(StudentsCollectionRef, where("isAdministrator", "==", false), orderBy("userName", "asc"));

        const unsubscribe = onSnapshot(S_C_Ref_Query, (querySnapshot) => {

            const temp_students = [];

            querySnapshot.forEach((student) => {

                temp_students.push({
                    ...student.data(),
                    id: student.id
                });

            });

            setStudentsData(temp_students);

        });

        setIsLoadingInfo(false);

        return () => unsubscribe();

    }

    // First Render Effect - One Time Called
    useEffect(() => {
        getAllStudentsData();

    }, []);

    // Is Loading
    if (isLoadingInfo) {
        return <LoadingComponent />
    }

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
                    visible={studentModal}
                    onRequestClose={() => { setStudentModal(false) }}>

                    <View style={StudentsStyle.modalStudentsManagementContainer}>
                        <View style={StudentsStyle.modalStudentsManagementView}>

                            <TouchableOpacity style={StudentsStyle.modalStudentsManagementExitButton}
                                onPress={() => setStudentModal(false)}>
                                <AntDesign name="close" size={24} color="black" />
                            </TouchableOpacity>

                            <Text style={StudentsStyle.modalStudentsManagementTitle}>
                                {studentModalIsEdit ? "Editar Estudante" : "Criar Estudante"}
                            </Text>

                            <TextInput style={StudentsStyle.modalStudentsManagementInput} maxLength={75} placeholder={"Nome"} placeholderTextColor={"#DCE8FF"}
                                onChangeText={text => handleStudentModalInputs("userName", text)}
                                value={studentInfo.userName}
                                autoComplete="off" autoFocus={true} inputMode="text" />

                            <TextInput style={StudentsStyle.modalStudentsManagementInput} maxLength={75} placeholder={"CGM"} placeholderTextColor={"#DCE8FF"}
                                onChangeText={text => handleStudentModalInputs("userCGMRegister", text)}
                                value={studentInfo.userCGMRegister}
                                autoComplete="off" inputMode="numeric" />

                            <TextInput style={StudentsStyle.modalStudentsManagementInput} maxLength={75} placeholder={"Senha"} placeholderTextColor={"#DCE8FF"}
                                onChangeText={text => handleStudentModalInputs("password", text)}
                                value={studentInfo.password}
                                autoComplete="off" inputMode="numeric" />

                            <TouchableOpacity style={StudentsStyle.modalStudentsManagementSaveButton} activeOpacity={0.6}
                                onPress={() => handleStudentModalSave()}>
                                <Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>
                                    Salvar
                                </Text>
                            </TouchableOpacity>

                            {
                                studentModalIsEdit
                                    ?
                                    <View style={StudentsStyle.modalStudentsManagementEditOptions}>
                                        <TouchableOpacity style={StudentsStyle.modalStudentsManagementEditOptionsButton} activeOpacity={0.25}
                                            onPress={() => handleStudentStatus()}
                                        >
                                            <FontAwesome name="power-off" size={22} color="black" />
                                        </TouchableOpacity>

                                        <TouchableOpacity style={StudentsStyle.modalStudentsManagementEditOptionsButton} activeOpacity={0.25}
                                            onPress={() => handleStudentDelete()}
                                        >
                                            <FontAwesome name="trash" size={22} color="black" />
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    null
                            }

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
                        onPress={() => handleStudentModalOpen(false, structure_studentInfo)}>
                        <AntDesign name="plus" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                {/* List Students */}
                <ScrollView style={StudentsStyle.studentsListWrapper} contentContainerStyle={{ alignItems: 'center', justifyContent: 'flex-start', paddingBottom: 70 }}>

                    {   // Students Data 

                        studentsData.map((student, _) => {

                            return <View style={StudentsStyle.studentsBoxSingle} key={_}>
                                <Text style={StudentsStyle.studentsBoxSingleText}>
                                    <Text style={{ fontWeight: 'bold' }}>{student.userName}</Text> | {student.userCGMRegister}
                                </Text>

                                <TouchableOpacity style={StudentsStyle.studentsBoxSingleButton}
                                    onPress={() => { handleStudentModalOpen(true, student); }}>
                                    <FontAwesome name="gear" size={24} color="white" />
                                </TouchableOpacity>
                            </View>

                        })
                    }

                </ScrollView>

            </SafeAreaView>
        </SafeAreaProvider>
    );

}
