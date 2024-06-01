import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import {
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    Keyboard,
    ActivityIndicator
} from 'react-native';
import { router } from 'expo-router';

import * as SecureStore from 'expo-secure-store';

import LoginStyle from './login-style.js';

// Firestore
import FirebaseApp from '../firebase.initialize.js';
import { getFirestore, collection, where, query, getDocs } from 'firebase/firestore'

const FirestoreDatabase = getFirestore(FirebaseApp);

export default function Login() {

    var UsersTable = collection(FirestoreDatabase, 'users');

    // User 
    const [userCGMRegister, setUserCGMRegister] = useState(null);
    const [password, setPassword] = useState(null);

    // Loading Icon
    const [loadingIconDisplay, setLoadingIconDisplay] = useState('none');

    // Variables
    const loginErrorMessage1 = 'Conta inexistente no banco de dados.';
    const loginErrorMessage2 = 'CGM ou senha incorreto(s).';
    const loginErrorMessage3 = 'Essa conta está desativada.';

    // Check If User Is Logged
    async function checkIfUserIsLogged(){
        
        // Login User Info Result
        let userInfoResult = await SecureStore.getItemAsync('userInfo');
        
        if(userInfoResult){
            router.push(`home?user=${userInfoResult}`);

        }

    }

    // Check User Access
    async function checkUserAccess() {

        // Dismiss Keyboard
        Keyboard.dismiss();

        if (!userCGMRegister || userCGMRegister.trim() === '') { return alert('Insira um CGM.'); }
        if (!password || password.trim() === '') { return alert('Insira uma senha.'); }

        // Check if user & password matches
        let loginMatches = false;

        let getUserQuery = query(
            UsersTable,
            where('userCGMRegister', '==', userCGMRegister),
            where('password', '==', password),
        );
        let userDoc = await getDocs(getUserQuery);

        if (userDoc.empty) {
            // Acount does not exist
            return alert(loginErrorMessage1);

        }

        if (userDoc.docs[0].data()) {

            if(!userDoc.docs[0].data().isActivatedAccount) {
                // Account is desactivated
                return alert(loginErrorMessage3);

            }

            loginMatches = true;

        }

        // User Data
        let userData = userDoc.docs[0].data();

        // Load User
        if (loginMatches) {

            setLoadingIconDisplay('flex');

            // Session Ends At
            let sessionEndDate = new Date();
            sessionEndDate.setDate(sessionEndDate.getDate() + 7);
            sessionEndDate = sessionEndDate.toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo", dateStyle: "short"});

            // Set Info On Store
            SecureStore.setItemAsync('userInfo', JSON.stringify({
                'userName': userData.userName,
                'password': userData.password,
                'userCMGRegister': userData.userCGMRegister,
                'isAdministrator': userData.isAdministrator,
                'isActivatedAccount': userData.isActivatedAccount,
                'sessionEndDate': sessionEndDate
            }));

            setTimeout(() => {
                router.push(`home?user=${JSON.stringify(userData)}`);

            }, 2000);

            setTimeout(() => {
                setLoadingIconDisplay('none');

            }, 5000);


        } else {
            alert(loginErrorMessage2);

        }

    }

    // Use Effect
    useEffect(()=>{
        checkIfUserIsLogged();

    }, []);

    // Return Login
    return (

        <View style={LoginStyle.mainContainer}>

            <StatusBar style="auto" />


            <Image style={LoginStyle.loginIcon} source={require("../../../assets/login/login-asset.png")} />


            <Text style={LoginStyle.loginTitle}>Insira as Informações {'\n'} de Acesso</Text>


            <TextInput style={LoginStyle.loginInput}
                onChangeText={setUserCGMRegister} placeholder={"CGM"} placeholderTextColor={"#c9c9c9"}
                inputMode='numeric' />


            <TextInput style={{ ...LoginStyle.loginInput, marginBottom: 20 }}
                onChangeText={setPassword} placeholder={"Senha"} placeholderTextColor={"#c9c9c9"}
                inputMode='numeric' />


            <TouchableOpacity style={LoginStyle.loginSubmitButton} onPress={() => checkUserAccess()} activeOpacity={0.65}>
                <Text style={{ textAlign: 'center', fontSize: 17, color: 'white' }}>Acessar</Text>
            </TouchableOpacity>


            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', padding: 20 }}>
                <Text style={{ color: '#919191' }}>© 2024 Todos os direitos reservados - Szymanski</Text>
            </View>


            <View style={{ ...LoginStyle.loginLoadingView, display: loadingIconDisplay }}>
                <ActivityIndicator size="large" animation={true} color={"white"} style={LoginStyle.loginLoadingIcon} />
            </View>

        </View>

    )

}
