import { Tabs, useGlobalSearchParams } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { View } from 'react-native';

export default function TabsLayout() {
    
    const userParam = useGlobalSearchParams().user;
    const user = JSON.parse(Array.isArray(userParam) ? userParam[0] : userParam);
    const userIsAdministrator = user.isAdministrator;
    
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: '#38BDF8',
            tabBarInactiveTintColor: '#CCC',
            headerShown: false,
            tabBarStyle: {
                backgroundColor: 'transparent',
                position: 'absolute',
                borderTopWidth: 0,        
                elevation: 0,
                display: userIsAdministrator ? 'flex' : 'none',
            },
            tabBarBackground: () => (
                <View style={{ backgroundColor: 'transparent', flex: 1 }} />
            ),
        }}>

            <Tabs.Screen name="home/index"
                options={{
                    title: 'Home',
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
                    title: 'Avisos',
                    tabBarIcon: ({ color }) => <FontAwesome5 name="bullhorn" size={20} color={color} />,
                }}
            />

        </Tabs>
    );
}
