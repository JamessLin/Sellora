import { Tabs } from "expo-router";
import Icons from '@expo/vector-icons/Ionicons';
import Iconss from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS } from "../../constants";


export default function AppLayout() {
    return (
        <Tabs screenOptions={{ tabBarShowLabel: false, tabBarActiveTintColor: COLORS.theme1 }}>

      
            <Tabs.Screen
                name="home"

                options={{
                    headerShown: false,
                    tabBarIcon({ focused, color, size }) {
                        return <Icons name={focused ? "ios-person" : "ios-person-outline"} color={color} size={size} />;
                    },
                    tabBarLabel: ({ focused, color }) => {
                        return focused ? <Text style={{ color }}>Home</Text> : null;
                    }
                }} />
            <Tabs.Screen
                name="explore"

                options={{
                    headerShown: false,
                    tabBarIcon({ focused, color, size }) {
                        return <Iconss name={focused ? "shopping" : "shopping-outline"} color={color} size={size} />;
                    },
                    tabBarLabel: ({ focused, color }) => {
                        return focused ? <Text style={{ color }}>Map</Text> : null;
                    }
                }} />
            <Tabs.Screen
                name="groups"

                options={{
                    headerShown: false,
                    tabBarIcon({ focused, color, size }) {
                        return <Icons name={focused ? "ios-chatbubbles" : "ios-chatbubbles-outline"} color={color} size={size} />;
                    },
                    tabBarLabel: ({ focused, color }) => {
                        return focused ? <Text style={{ color }}>Map</Text> : null;
                    }
                }} />


        </Tabs>

    )
}

