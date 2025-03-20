import { useRouter } from "expo-router";
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";

export default function ProfileScreen() {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.replace("/login");
        }
    }, [user]);

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Perfil de {user?.name}</Text>
                <Text style={styles.email}>Email: {user?.email}</Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.push("./home")}
                >
                    <Text style={styles.buttonText}>Volver al Inicio</Text>
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
        borderColor: '#F8E71C',
        shadowColor: '#FF007F',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 10,
        width: '90%',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#F8E71C',
        marginBottom: 10,
        textShadowColor: '#F8E71C',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 8,
    },
    email: {
        fontSize: 18,
        color: '#00FFFF', 
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#FF007F', 
        borderRadius: 5,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderWidth: 2,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0D0D0D',
        textTransform: 'uppercase',
    },
});
