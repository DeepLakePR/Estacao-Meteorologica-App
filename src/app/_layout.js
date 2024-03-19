import { Stack } from 'expo-router/stack';

export default function Layout(){

    return(

        <Stack screenOptions={{ headerShown: false }}>

            <Stack.Screen name="index" options={{ title: "Root" }} />

            <Stack.Screen name="login/index" options={{ title: "Login" }} />

            <Stack.Screen name="home/index" options={{ title: "Home" }} />

        </Stack>

    );

}
