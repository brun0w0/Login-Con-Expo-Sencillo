import { useRouter } from "expo-router";
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";
import { TouchableOpacity, Text, View, StyleSheet, Image } from "react-native";

export default function HomeScreen() {
    const { user, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.replace("/login");
        }
    }, [user]);

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.welcomeText}>Bienvenido, {user?.name}</Text>
                <Image 
                    source={{ uri: 'https://i.ytimg.com/vi/C8UsdDiw1U8/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLC24HzUVY4tVLi_x40oNdpMXdM26Q' }}
                    style={styles.image} 
                />

                <TouchableOpacity
                    style={[styles.button, styles.profileButton]}
                    onPress={() => router.push("./profile")}
                >
                    <Text style={styles.buttonText}>Ir a Perfil</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.logoutButton]}
                    onPress={() => { logout(); router.replace("./login") }}
                >
                    <Text style={styles.buttonText}>Logout</Text>
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
        backgroundColor: '#0D0D0D',
        padding: 20,
    },
    card: {
        backgroundColor: '#1A1A1A',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FF007F',
        shadowColor: '#FF007F',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 10,
        width: '60%',
    },
    welcomeText: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#F8E71C',
        marginBottom: 20,
        textShadowColor: '#F8E71C',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 8,
    },
    button: {
        width: 200,
        paddingVertical: 12,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10,
    },
    profileButton: {
        backgroundColor: '#FF007F',
        borderWidth: 2,
    },
    logoutButton: {
        backgroundColor: '#00FFFF',
        borderWidth: 2,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0D0D0D',
        textTransform: 'uppercase',
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: '90%',
        margin: 23,
    }
});

