import { useRouter } from "expo-router";
import { useAuth } from "./context/AuthContext";
import { useEffect, useState } from "react";
import { TouchableOpacity, Text, View, StyleSheet, TextInput, ScrollView, Alert, Image } from "react-native";
import { toast } from "react-toastify";
import { updateProfile } from "firebase/auth";
import { auth } from "@/firebaseConfig";

export default function EditProfile() {
    const { user, updateUserData } = useAuth();
    const router = useRouter();
    const [formData, setFormData] = useState({
        displayName: '',
        phoneNumber: '',
        email: '',
        biography: '',
        language: 'es',
        profileImage: '',
        favorites: []
    });
    const [loading, setLoading] = useState(false);
    const [newFavorite, setNewFavorite] = useState('');

    useEffect(() => {
        if (!user) {
            router.replace("/login");
        } else {
            setFormData({
                displayName: user.displayName || '',
                phoneNumber: user.userData?.phoneNumber || '',
                email: user.userData?.email || '',
                biography: user.userData?.biography || '',
                language: user.userData?.language || 'es',
                profileImage: user.userData?.profileImage || user.photoURL || '',
                favorites: user.userData?.favorites || []
            });
        }
    }, [user]);

    const handleAddFavorite = () => {
        if (newFavorite.trim() && !formData.favorites.includes(newFavorite.trim())) {
            setFormData(prev => ({
                ...prev,
                favorites: [...prev.favorites, newFavorite.trim()]
            }));
            setNewFavorite('');
        }
    };

    const handleRemoveFavorite = (index: number) => {
        setFormData(prev => ({
            ...prev,
            favorites: prev.favorites.filter((_, i) => i !== index)
        }));
    };

    const handleInputChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const isValidUrl = (url: string | URL) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };
    const [errors, setErrors] = useState({
        displayName: '',
        phoneNumber: '',
        biography: '',
        profileImage: ''
    });

    const handleSubmit = async () => {
        if (!user) return;

        setErrors({
            displayName: '',
            phoneNumber: '',
            biography: '',
            profileImage: ''
        });

        let hasErrors = false;
        const newErrors = {
            displayName: '',
            phoneNumber: '',
            biography: '',
            profileImage: ''
        };

        if (!formData.displayName.trim()) {
            newErrors.displayName = 'El nombre de usuario es obligatorio';
            hasErrors = true;
        }

        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = 'El número de teléfono es obligatorio';
            hasErrors = true;
        } else if (!/^[0-9]{10,15}$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = 'Ingresa un número válido (10-15 dígitos)';
            hasErrors = true;
        }

        if (formData.profileImage && !isValidUrl(formData.profileImage)) {
            newErrors.profileImage = 'La URL de la imagen no es válida';
            hasErrors = true;
        }

        if (hasErrors) {
            setErrors(newErrors);
            return;
        }
        setLoading(true);
        try {
            const updates = {
                displayName: formData.displayName.trim(),
                phoneNumber: formData.phoneNumber.trim(),
                biography: formData.biography.trim(),
                language: formData.language,
                profileImage: formData.profileImage || null,
                favorites: formData.favorites,
                updatedAt: new Date().toISOString()
            };

            const authUpdates = {};
            if (formData.displayName !== user.displayName) {
                authUpdates.displayName = updates.displayName;
            }
            if (formData.profileImage !== (user.photoURL || user.userData?.profileImage)) {
                authUpdates.photoURL = updates.profileImage;
            }

            if (Object.keys(authUpdates).length > 0) {
                await updateProfile(auth.currentUser, authUpdates);

                // Actualiza el estado del usuario inmediatamente
                if (authUpdates.displayName) {
                    user.displayName = authUpdates.displayName;
                }
                if (authUpdates.photoURL) {
                    user.photoURL = authUpdates.photoURL;
                }
            }

            // Actualiza los datos adicionales en Firestore
            await updateUserData(user.uid, updates);

            // Forzar recarga del estado del usuario
            // Esto depende de cómo implementes tu AuthContext
            // Si tienes un método para refrescar el usuario, llámalo aquí
            // Ejemplo: await refreshUser();

            Alert.alert("Éxito", "Perfil actualizado correctamente");
            router.replace({
                pathname: '/profile',
                params: { refresh: Date.now() } // Parámetro para evitar caché
            });
        } catch (error) {
            Alert.alert("Error", error.message || "Ocurrió un error al actualizar");
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.title}>Editar perfil</Text>

                    {formData.profileImage && (
                        <Image
                            source={{ uri: formData.profileImage }}
                            style={styles.profileImagePreview}
                        />
                    )}

                    <Text style={styles.nombre}>{user?.displayName?.toUpperCase() || '--'}</Text>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Nombre de usuario</Text>
                        <TextInput
                            style={[styles.input, errors.displayName && styles.errorInput]}
                            value={formData.displayName}
                            onChangeText={(text) => {
                                handleInputChange('displayName', text);
                                if (errors.displayName) {
                                    setErrors(prev => ({ ...prev, displayName: '' }));
                                }
                            }}
                            placeholder="Ingresa tu nombre"
                            placeholderTextColor="#666"
                        />
                        {errors.displayName ? (
                            <Text style={styles.errorText}>{errors.displayName}</Text>
                        ) : null}
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>URL de imagen de perfil</Text>
                        <TextInput
                            style={[styles.input, errors.profileImage && styles.errorInput]}
                            value={formData.profileImage}
                            onChangeText={(text) => {
                                handleInputChange('profileImage', text);
                                if (errors.profileImage) {
                                    setErrors(prev => ({ ...prev, profileImage: '' }));
                                }
                            }}
                            placeholder="Ingresa una URL válida."
                            placeholderTextColor="#666"
                        />
                        {errors.profileImage ? (
                            <Text style={styles.errorText}>{errors.profileImage}</Text>
                        ) : null}
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Número de teléfono</Text>
                        <TextInput
                            style={[styles.input, errors.phoneNumber && styles.errorInput]}
                            value={formData.phoneNumber}
                            onChangeText={(text) => {
                                handleInputChange('phoneNumber', text);
                                if (errors.phoneNumber) {
                                    setErrors(prev => ({ ...prev, phoneNumber: '' }));
                                }
                            }}
                            placeholder="1234567890"
                            keyboardType="phone-pad"
                            placeholderTextColor="#666"
                        />
                        {errors.phoneNumber ? (
                            <Text style={styles.errorText}>{errors.phoneNumber}</Text>
                        ) : null}
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Correo:</Text>
                        <TextInput
                            style={[styles.input]}
                            value={formData.email}
                            aria-disabled={true}
                            editable={false}
                        />
                        <Text style={styles.noEdit}>El correo no es editable.</Text>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Biografía</Text>
                        <TextInput
                            style={[styles.input, styles.bioInput]}
                            value={formData.biography}
                            onChangeText={(text) => handleInputChange('biography', text)}
                            placeholder="Añade una descripción sobre ti."
                            multiline
                            numberOfLines={4}
                            placeholderTextColor="#666"
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Idioma preferido</Text>
                        <View style={styles.languageContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.languageButton,
                                    formData.language === 'es' && styles.languageActive
                                ]}
                                onPress={() => handleInputChange('language', 'es')}
                            >
                                <Text style={styles.languageText}>Español</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.languageButton,
                                    formData.language === 'en' && styles.languageActive
                                ]}
                                onPress={() => handleInputChange('language', 'en')}
                            >
                                <Text style={styles.languageText}>English</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Productos favoritos</Text>
                        <View style={styles.favoriteInputContainer}>
                            <TextInput
                                style={[styles.input, styles.favoriteInput]}
                                value={newFavorite}
                                onChangeText={setNewFavorite}
                                placeholder="Agregar producto favorito"
                                placeholderTextColor="#666"
                            />
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={handleAddFavorite}
                            >
                                <Text style={styles.addButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.favoritesList}>
                            {formData.favorites.map((favorite, index) => (
                                <View key={index} style={styles.favoriteItem}>
                                    <Text style={styles.favoriteText}>{favorite}</Text>
                                    <TouchableOpacity
                                        onPress={() => handleRemoveFavorite(index)}
                                        style={styles.removeButton}
                                    >
                                        <Text style={styles.removeButtonText}>×</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonRight]}
                            onPress={() => router.push('/profile')}
                            disabled={loading}
                        >
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button2, styles.buttonRight]}
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            <Text style={styles.buttonText2}>
                                {loading ? 'Guardando...' : 'Guardar cambios'}
                            </Text>
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
        marginVertical: 20,
    },
    title: {
        fontSize: 100,
        fontWeight: '100',
        color: '#F8E71C',
        marginBottom: 40,
        textShadowColor: '#F8E71C',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 8,
    },
    nombre: {
        color: '#fff',
        fontSize: 40,
        margin: 25,
        textShadowColor: '#F8E71C',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 8,
    },
    formGroup: {
        width: '100%',
        marginBottom: 20,
    },
    label: {
        color: '#F8E71C',
        fontSize: 16,
        marginBottom: 8,
        fontWeight: 'bold',
    },
    noEdit: {
        color: '#b6b4b4'
    },
    input: {
        backgroundColor: '#333',
        color: '#fff',
        borderRadius: 5,
        padding: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#555',
    },
    bioInput: {
        height: 200,
        textAlignVertical: 'top',
    },
    languageContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    languageButton: {
        backgroundColor: '#333',
        padding: 12,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#555',
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    languageActive: {
        backgroundColor: '#F8E71C',
        borderColor: '#F8E71C',
    },
    languageText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    button: {
        backgroundColor: '#FF007F',
        borderRadius: 5,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderWidth: 2,
        flex: 1,
        marginHorizontal: 5,
    },
    buttonLeft: {
        marginRight: 5,
    },
    buttonRight: {
        marginLeft: 5,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0D0D0D',
        textTransform: 'uppercase',
        textAlign: 'center',
    },
    button2: {
        backgroundColor: '#a400ff',
        borderRadius: 5,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderWidth: 2,
        flex: 1,
        marginHorizontal: 5,
        opacity: 1,
    },
    buttonText2: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        textTransform: 'uppercase',
        textAlign: 'center',
    },
    profileImagePreview: {
        width: 220,
        height: 220,
        borderRadius: '100%',
        marginBottom: 15,
        borderWidth: 2,
        borderColor: '#F8E71C'
    },
    imageInput: {
        backgroundColor: '#333',
        color: '#fff',
        borderRadius: 5,
        padding: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#555',
        marginBottom: 15,
    },
    errorText: {
        color: '#FF5252',
        fontSize: 12,
        marginTop: 4,
    },
    errorInput: {
        borderColor: '#FF5252',
    },
    favoriteInputContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    favoriteInput: {
        flex: 1,
        marginRight: 10,
    },
    addButton: {
        backgroundColor: '#F8E71C',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        color: '#0D0D0D',
        fontSize: 20,
        fontWeight: 'bold',
    },
    favoritesList: {
        width: '100%',
    },
    favoriteItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#333',
        padding: 10,
        borderRadius: 5,
        marginBottom: 5,
    },
    favoriteText: {
        color: '#fff',
        flex: 1,
    },
    removeButton: {
        backgroundColor: '#FF5252',
        width: 25,
        height: 25,
        borderRadius: 12.5,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    removeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});