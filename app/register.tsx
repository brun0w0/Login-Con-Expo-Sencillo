import { useRouter } from "expo-router";
import { useAuth } from "./context/AuthContext";
import React, { useState } from "react";
import { Alert, Text, TextInput, View, StyleSheet, TouchableOpacity } from "react-native";
import { Slide, toast, ToastContainer } from 'react-toastify';

export default function RegisterScreen() {
    const { login, register } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState(""); // Estado para el nombre de usuario

    const handleRegister = async () => {
        if (!email.trim() || !password.trim() || !username.trim()) {
            Alert.alert("Error", "Todos los campos son obligatorios.");
            toast.error("Todos los campos son obligatorios.");
            return;
        }

        if (password.length < 6) {
            Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres.");
            toast.warning("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        const success = await register(email, password, username);
        if (success) {
            toast.success('Usuario creado correctamente.', {
                onClose: () => window.location.reload()
            });
            toast.success('Usuario creado correctamente.');
            Alert.alert("Usuario creado con éxito.");
            router.replace("/login");
        } else {
            Alert.alert("Error", "No se creó el usuario.");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.titulo}>Registrarse</Text>
                <ToastContainer
                    position='top-left'
                    autoClose={2000}
                    closeOnClick={true}
                    transition={Slide}
                    theme='dark'
                    style={{ marginTop: 10 }}
                />
                <TextInput
                    placeholder="Ingresa tu correo"
                    placeholderTextColor="#009393"
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    placeholder="Ingresa tu nombre de usuario"
                    placeholderTextColor="#009393"
                    style={styles.input}
                    value={username}
                    onChangeText={setUsername}
                />
                <TextInput
                    placeholder="Ingresa una contraseña"
                    placeholderTextColor="#009393"
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Registrarse</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button2} onPress={() => router.push("/login")}>
                    <Text style={styles.buttonText2}>Volver</Text>
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
        color: '#fff',
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
    button2: {
        backgroundColor: '#ff0000',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#ff0000',
        shadowOpacity: 1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 0 },
    },
    buttonText: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonText2: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
