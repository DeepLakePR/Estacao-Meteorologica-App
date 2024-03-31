import { useEffect } from 'react';
import { LogBox } from 'react-native';
import { router } from 'expo-router';
import { Stack } from 'expo-router/stack';

const isProductionMode = false;

export default function RootApp() {

  LogBox.ignoreAllLogs(isProductionMode);

  // User 
  const user = 'Admin Guilherme';

  async function userLogging(){
    setTimeout(()=>{
      if(user){ 
        router.push(`home?user=${user}`);

      }else{ 
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
