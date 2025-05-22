import { Tabs, useGlobalSearchParams } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { View, Platform } from 'react-native';

export default function TabsLayout() {
    
    const userParam = useGlobalSearchParams().user;
    const user = JSON.parse(Array.isArray(userParam) ? userParam[0] : userParam);
    const userIsAdministrator = user.isAdministrator;
    
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: '#38BDF8',
            tabBarInactiveTintColor: '#CCC',
            headerShown: false,
            tabBarHideOnKeyboard: true,
            tabBarStyle: {
                backgroundColor: 'transparent',
                position: 'absolute',
                bottom: 0,
                borderTopWidth: 0,        
                elevation: 0,
                paddingBottom: Platform.OS === 'ios' ? 15 : 15,
                height: Platform.OS === 'ios' ? 70 : 56,
                display: userIsAdministrator ? 'flex' : 'none',
            },
            tabBarBackground: () => (
                <View style={{ backgroundColor: 'transparent', flex: 1 }} />
            ),
            animation: 'shift',
        }}>

            <Tabs.Screen name="home/index"
                options={{
                    title: 'Início',
                    tabBarIcon: ({ color }) => <FontAwesome5 name="home" size={20} color={color} />,
                }}
            />
            <Tabs.Screen name="students/index"
                options={{
                    title: 'Estudantes',
                    tabBarIcon: ({ color }) => <FontAwesome5 name="users" size={20} color={color} />,
                }}
            />
            <Tabs.Screen name="announcements/index"
                options={{
                    title: 'Comunicados',
                    tabBarIcon: ({ color }) => <FontAwesome5 name="bullhorn" size={20} color={color} />,
                }}
            />

        </Tabs>
    );
}
