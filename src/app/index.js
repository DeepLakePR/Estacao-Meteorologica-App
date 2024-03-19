import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import { Link, router, Navigator } from 'expo-router';

export default function RootApp() {

  // User 
  const user = null;

  // Home
  function h(){
    
    router.push(`home?user=${user}`);

  }

  // Login
  function l(){

    router.push('login')

  }

  function testing(){

    setTimeout(()=>{

      if(user){ 
        h();

      }else{ 
        l(); 
      
      }

    }, 0)

  }

  // Return
  return (

    <View>

      <StatusBar style="auto" />

      <Text>Root Page</Text>

      <Link href="/login"></Link>
      <Link href={{pathname: "/home", params: { user: user }}}></Link>
      
      {
        testing()
      }

    </View>

  );

}
