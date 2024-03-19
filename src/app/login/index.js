import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
    Text,
    View,
    ScrollView,
    Image,
    TextInput,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { Link, router, Navigator } from 'expo-router';

import LoginStyle from './login-style.js';

export default function Login() {

    // User 
    const [ user, setUser ] = useState(null);

    const [ password, setPassword ] = useState(null);

    const [ loadingIconDisplay, setLoadingIconDisplay ] = useState('none');

    function checkAccess(event){

        console.log('trying to login');
    
        if(!user || user.trim() === ''){ return alert('Insira um usuário.'); }
        if(!password || password.trim() === ''){ return alert('Insira uma senha.'); }

        setLoadingIconDisplay('flex');

        setTimeout(()=>{
            router.push(`home?user=${user}`);

        }, 2000);

        setTimeout(()=>{
            setLoadingIconDisplay('none');

        }, 5000);
    
    }

    return (

        <View style={LoginStyle.mainContainer}>

            <StatusBar style="auto" />

            <Image style={LoginStyle.loginIcon} source={require("../../../assets/login-asset.png")} />

            <Text style={LoginStyle.loginTitle}>Insira as Informações {'\n'} de Acesso</Text>

            <TextInput style={LoginStyle.loginInput} onChangeText={setUser} placeholder={"Usuário"} placeholderTextColor={"#c9c9c9"} />

            <TextInput style={{...LoginStyle.loginInput, marginBottom: 20}} onChangeText={setPassword} secureTextEntry={true} placeholder={"Senha"} placeholderTextColor={"#c9c9c9"} />

            <TouchableOpacity style={LoginStyle.loginSubmitButton} onPress={(e)=>checkAccess(e)} activeOpacity={0.65}>
                <Text style={{textAlign: 'center', fontSize: 17, color: 'white'}}>Acessar</Text>
            </TouchableOpacity>

            <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-end', padding: 20}}>
                <Text style={{color: '#919191'}}>© 2024 Todos os direitos reservados - Szymanski</Text>
            </View>

            <View style={{...LoginStyle.loginLoadingView, display: loadingIconDisplay}}>
                <ActivityIndicator size="large" animation={true} color={"white"} style={LoginStyle.loginLoadingIcon} />
            </View>

        </View>

    )

}
