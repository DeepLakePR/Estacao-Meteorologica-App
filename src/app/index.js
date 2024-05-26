import { useState, useEffect } from 'react';
import { LogBox } from 'react-native';
import { router } from 'expo-router';
import { Stack } from 'expo-router/stack';

import * as SecureStore from 'expo-secure-store';

const isProductionMode = false;

// Firestore
import FirebaseApp from './firebase.initialize.js';
import { getFirestore, collection, where, query, getDocs } from 'firebase/firestore'

const FirestoreDatabase = getFirestore(FirebaseApp);

export default function RootApp() {

  var UsersTable = collection(FirestoreDatabase, 'users');

  LogBox.ignoreAllLogs(isProductionMode);
  
  //// User 
  // Object Format: {'userName': 'Guilherme', 'password': 'Phone-Number (Number)', 'userCMGRegister': 'Number', 'sessionEndDate': 'Date'}

  // User Logging
  async function userLogging(){
    setTimeout(async()=>{

      var storageUserInfoResult = await SecureStore.getItemAsync('userInfo');

      let todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);

      if(storageUserInfoResult){

        // User Session Info
        let userInfoResult = JSON.parse(storageUserInfoResult);

        let userSessionCGMRegister = userInfoResult.userCMGRegister;
        let userSessionEndDate = userInfoResult.sessionEndDate;

        // Split Date and Convert
        let splitedDate = userSessionEndDate.split('/');
        userSessionEndDate = new Date(`${splitedDate[2]}-${splitedDate[1]}-${splitedDate[0]}`);

        // Check If User Exists
        let checkIfUserExists = query(
            UsersTable,
            where('userCGMRegister', '==', userSessionCGMRegister),
        );
        let userDoc = await getDocs(checkIfUserExists);

        // User Account Does Not Exist
        if (userDoc.empty) {
          router.push('login');
          return;
        }

        if (userDoc.docs[0].data()) { // User Exists

          // Check if User Account is Activated
          if(!userDoc.docs[0].data().isActivatedAccount){ 
            // Account is deactivated
            alert("Sua conta foi desativada e você foi deslogado, tente novamente mais tarde.");

            await SecureStore.deleteItemAsync('userInfo');
  
            router.push('login');
            return;

          };

          // Check if Session Expired
          if(todayDate > userSessionEndDate) {
            // Session Expired, Go To Login
            alert("Sessão de login expirada, faça login novamente.");

            await SecureStore.deleteItemAsync('userInfo');
  
            router.push('login');
            return;
  
          }else{ // Ready = All Is Okay, Can go to Home Page

            // Go To Home
            router.push(`home?user=${JSON.stringify(userInfoResult)}`);
            return;
  
          }

        } 

      }else{
        // Go To Login
        router.push('login')

      }

    }, 250)
  }

  useEffect(()=>{
    userLogging();

  }, []);

  // Return
  return (

    <Stack screenOptions={{ headerShown: false }}>

        <Stack.Screen name="index" options={{ title: "Aplicativo" }} />

        <Stack.Screen name="login/index" options={{ title: "Login" }} />

        <Stack.Screen name="prevision/index" options={{ title: "Previsão" }} />

        <Stack.Screen name="home/index" options={{ title: "Home" }} />

    </Stack>

  );

}
