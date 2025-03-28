import { useRouter } from "expo-router";
import { useAuth } from "./context/AuthContext";
import React, { useState } from "react";
import { Alert, Text, TextInput, View, StyleSheet, TouchableOpacity } from "react-native";
import { Slide, toast, ToastContainer } from 'react-toastify';
import { navigate } from "expo-router/build/global-state/routing";

export default function LoginScreen() {
    const { login, register } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert("Error", "Todos los campos son obligatorios.");
            toast.error("Todos los campos son obligatorios.");
            return;
        }

        if (password.length < 6) {
            Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres.");
            toast.warning("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        const success = await login(email, password);
        if (success) {
            toast.success('Iniciando sesión.');
            router.replace("/home");
        } else {
            toast.error('Datos incorrectos.');
            Alert.alert("Error", "Datos incorrectos.");
        }
    };


    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.titulo}>Iniciar sesión</Text>
                <ToastContainer
                    position='top-left'
                    autoClose={2000}
                    closeOnClick={true}
                    transition={Slide}
                    theme='dark'
                    style={{ marginTop: 10}}
                />
                <TextInput
                    placeholder="Correo"
                    placeholderTextColor="#009393"
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    placeholder="Contraseña"
                    placeholderTextColor="#009393"
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Iniciar sesión</Text>
                </TouchableOpacity>
                <Text style={styles.no}>¿No tienes cuenta?</Text>
                <TouchableOpacity style={styles.button} onPress={() => router.push("/register")}>
                    <Text style={styles.buttonText}>Registrarse</Text>
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
    },
    no: {
        color: '#fff',
        fontSize: 15,
        textAlign: 'center',
        marginTop: 40,
    },
});
