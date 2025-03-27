import { useRouter } from "expo-router";
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";
import { TouchableOpacity, Text, View, StyleSheet, Image, ScrollView } from "react-native";

export default function ProfileScreen() {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.replace("/login");
        }
    }, [user]);

    const formatDate = (dateString?: string | number | Date) => {
        if (!dateString) return '--';

        try {
            let date: Date;

            if (typeof dateString === 'number') {
                date = new Date(dateString);
            } else {
                date = new Date(dateString);
            }

            if (isNaN(date.getTime())) return '--';
            return date.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true 
            });
        } catch (error) {
            console.error("Error formatting date:", error);
            return '--';
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <View style={styles.card}>
                    <View style={styles.profileHeader}>
                        <Image
                            source={{ uri: user?.photoURL || user?.userData?.profileImage || 'https://via.placeholder.com/150' }}
                            style={styles.profileImage}
                        />
                        <Text style={styles.nombre}>{user?.displayName?.toUpperCase() || 'USUARIO'}</Text>
                    </View>

                    <View style={styles.detailsContainer}>
                        <View style={styles.bioContainer}>
                            <Text style={styles.label}>Biografía:</Text>
                            <Text style={styles.bioValue}>{user?.userData?.biography || 'No hay biografía'}</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.label}>Teléfono:</Text>
                            <Text style={styles.value}>{user?.userData?.phoneNumber || 'No proporcionado'}</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.label}>Correo:</Text>
                            <Text style={styles.value}>{user?.userData?.email || 'No proporcionado'}</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.label}>Idioma:</Text>
                            <Text style={styles.value}>
                                {user?.userData?.language === 'es' ? 'Español' : 'English'}
                            </Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.label}>Actualizado:</Text>
                            <Text style={styles.value}>
                                {user?.userData?.updatedAt ? formatDate(user.userData.updatedAt) : '--'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>PRODUCTOS FAVORITOS</Text>
                        {user?.userData?.favorites?.length > 0 ? (
                            <View style={styles.favoritesContainer}>
                                {user.userData.favorites.map((favorite, index) => (
                                    <View key={index} style={styles.favoriteItem}>
                                        <Text style={styles.favoriteText}>{favorite}</Text>
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <Text style={styles.noFavoritesText}>No tienes productos favoritos aún</Text>
                        )}
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonLeft]}
                            onPress={() => router.push("./home")}
                        >
                            <Text style={styles.buttonText}>INICIO</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button2, styles.buttonRight]}
                            onPress={() => router.push("./editprofile")}
                        >
                            <Text style={styles.buttonText2}>EDITAR</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0D0D0D',
        padding: 15,
    },
    card: {
        backgroundColor: '#1A1A1A',
        borderRadius: 15,
        padding: 25,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#F8E71C',
        shadowColor: '#FF007F',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.8,
        shadowRadius: 12,
        width: '95%',
        maxWidth: 1000,
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 25,
    },
    profileImage: {
        width: 250,
        height: 250,
        borderRadius: '100%',
        borderWidth: 4,
        borderColor: '#F8E71C',
        marginBottom: 15,
        shadowColor: '#FF007F',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 8,
    },
    nombre: {
        color: '#fff',
        fontSize: 60,
        fontWeight: 'bold',
        textShadowColor: '#F8E71C',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 5,
        letterSpacing: 1,
    },
    detailsContainer: {
        width: '100%',
        marginBottom: 20,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#333',
        paddingVertical: 15,
    },
    bioContainer: {
        width: '100%',
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    bioValue: {
        fontSize: 16,
        color: '#00FFFF',
        marginTop: 5,
        padding: 10,
        backgroundColor: '#252525',
        borderRadius: 8,
        textAlign: 'left',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingHorizontal: 10,
    },
    label: {
        fontSize: 16,
        color: '#F8E71C',
        fontWeight: 'bold',
    },
    value: {
        fontSize: 16,
        color: '#00FFFF',
        textAlign: 'right',
        paddingLeft: 10,
    },
    section: {
        width: '100%',
        marginBottom: 25,
    },
    sectionTitle: {
        color: '#F8E71C',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        letterSpacing: 1,
    },
    favoritesContainer: {
        width: '100%',
        maxHeight: 200,
    },
    favoriteItem: {
        backgroundColor: '#252525',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        borderLeftWidth: 3,
        borderLeftColor: '#FF007F',
    },
    favoriteText: {
        color: '#fff',
        fontSize: 15,
    },
    noFavoritesText: {
        color: '#666',
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 15,
    },
    button: {
        backgroundColor: '#FF007F',
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderWidth: 2,
        borderColor: '#FF007F',
        flex: 1,
        marginHorizontal: 5,
        shadowColor: '#FF007F',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
    },
    buttonLeft: {
        marginRight: 5,
    },
    buttonRight: {
        marginLeft: 5,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0D0D0D',
        textAlign: 'center',
        letterSpacing: 1,
    },
    button2: {
        backgroundColor: '#a400ff',
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderWidth: 2,
        borderColor: '#a400ff',
        flex: 1,
        marginHorizontal: 5,
        shadowColor: '#a400ff',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
    },
    buttonText2: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        letterSpacing: 1,
    },
});