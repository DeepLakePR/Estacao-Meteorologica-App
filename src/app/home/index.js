import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TextInput,
    TouchableOpacity
} from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets
} from "react-native-safe-area-context";
import { Link, router, Navigator, useLocalSearchParams } from "expo-router";

// Style
import HomeStyle from "./home-style.js";

// XLSX
import * as XLSX from "xlsx";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

// Home Function
export default function Home() {

    // SafeArea
    const safeAreaInsets = useSafeAreaInsets();

    // User
    const { user } = useLocalSearchParams();

    // Generate Excel
    const generateExcel = () => {

        let wb = XLSX.utils.book_new();
        let ws = XLSX.utils.aoa_to_sheet([
            ["Temperatura C°", "Umidade", "Pressão Atmosférica", "Índice UV"],
            ["28 Cº", "86%", "1015.2 mb", "0 de 11"],
        ]);

        XLSX.utils.book_append_sheet(wb, ws, "EstacaoMeteorologica", true);

        const base64 = XLSX.write(wb, { type: "base64" });
        const filename = FileSystem.documentDirectory + "EstacaoMeteorologica.xlsx";

        FileSystem.writeAsStringAsync(filename, base64, {
            encoding: 'base64',

        }).then(() => {
            Sharing.shareAsync(filename);

        });

    };

    // Return
    return (

        <View style={{ ...HomeStyle.mainContainer, paddingTop: safeAreaInsets.top }}>

            <StatusBar style="light" backgroundColor="#262626" />

            <View style={HomeStyle.homeHeader}>
                <Text style={HomeStyle.headerText}>Bom dia, <Text style={{ color: "#1195f2", fontWeight: "bold" }}>{user}</Text></Text>
            </View>

            <View style={HomeStyle.homeExcelGeneratorView}>

                <Text style={{ fontSize: 17, textAlign: "center", marginBottom: 7 }}>Insira as informações da Estação Meteorológica</Text>

                <TextInput style={HomeStyle.homeInput} placeholder={"Temperatura C°"} placeholderTextColor={"#c9c9c9"} />

                <TextInput style={HomeStyle.homeInput} placeholder={"Umidade"} placeholderTextColor={"#c9c9c9"} />

                <TextInput style={HomeStyle.homeInput} placeholder={"Pressão Atmosférica"} placeholderTextColor={"#c9c9c9"} />

                <TextInput style={{ ...HomeStyle.homeInput, marginBottom: 25 }} placeholder={"Índice UV"} placeholderTextColor={"#c9c9c9"} />

                <TouchableOpacity style={HomeStyle.homeGenerateExcel} onPress={(e) => generateExcel()} activeOpacity={0.6}>
                    <Text style={{ color: "white", fontSize: 17 }}>Gerar Planilha no Excel</Text>
                </TouchableOpacity>

            </View>

            <View style={{ flex: 0.2, alignItems: "center", justifyContent: "flex-end", padding: 20 }}>
                <Text style={{ color: "#919191" }}>© 2024 Todos os direitos reservados - Szymanski</Text>
            </View>

        </View>

    );

}
