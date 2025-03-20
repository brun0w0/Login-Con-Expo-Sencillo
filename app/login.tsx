import { useRouter } from "expo-router";
import { useAuth } from "./context/AuthContext";
import { useState } from "react";
import { Alert, Button, Text, TextInput, View, StyleSheet, TouchableOpacity } from "react-native";

export default function LoginScreen() {
    const { login } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        if (login(email, password)) {
            router.replace("/home");
        } else {
            Alert.alert("Error", "Datos incorrectos.");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.titulo}>Inicia sesión</Text>
                <TextInput
                    placeholder="Ingresa tu email"
                    placeholderTextColor="#009393"
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    placeholder="Ingresa tu contraseña"
                    placeholderTextColor="#009393"
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Iniciar sesión</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    card: {
        backgroundColor: '#111', 
        padding: 20,
        borderRadius: 10,
        shadowColor: '#0ff',
        shadowOpacity: 0.9,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 0 },
        width: '70%',
    },
    titulo: {
        textAlign: 'center',
        fontSize: 30,
        fontWeight: 'bold',
        color: '#ff0',
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#222',
        color: '#0ff',
        padding: 10,
        marginBottom: 15,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#0ff',
    },
    button: {
        backgroundColor: '#ff0',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#ff0',
        shadowOpacity: 1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 0 },
    },
    buttonText: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
    }
});
