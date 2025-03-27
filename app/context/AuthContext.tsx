import { auth, db } from "@/firebaseConfig";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Obtener datos adicionales de Firestore
                const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
                setUser({
                    ...firebaseUser,
                    userData: userDoc.exists() ? userDoc.data() : null
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const login = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return true;
        } catch (error) {
            console.log('Error al iniciar sesión:', error.message);
            return false;
        }
    };

    const register = async (email, password, username) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const newUser = userCredential.user;

            // URL de imagen por defecto
            const defaultProfileImage = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';

            // Actualizar perfil con nombre y foto
            await updateProfile(newUser, {
                displayName: username,
                photoURL: defaultProfileImage
            });

            // Crear documento en Firestore
            await setDoc(doc(db, "users", newUser.uid), {
                displayName: username,
                email: newUser.email,
                profileImage: defaultProfileImage,
                createdAt: serverTimestamp()
            });

            // Actualizar estado local
            setUser({
                ...newUser,
                displayName: username,
                photoURL: defaultProfileImage,
                userData: {
                    displayName: username,
                    email: newUser.email,
                    profileImage: defaultProfileImage
                }
            });

            return true;
        } catch (error) {
            console.log('Error al registrar usuario:', error.message);
            return false;
        }
    };
    // En tu AuthContext
    const refreshUser = async () => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            // Recarga los datos del usuario desde Firebase Auth
            await currentUser.reload();

            // Actualiza el estado con los nuevos datos
            setUser({
                ...currentUser,
                userData: userData // Mantén los datos adicionales que ya tenías
            });
        }
    };
    const logout = async () => {
        await signOut(auth);
        setUser(null);
    };

    const updateUserData = async (userId: string, newData: any) => {
        try {
            const userDocRef = doc(db, "users", userId);
            await setDoc(userDocRef, {
                ...newData,
                updatedAt: serverTimestamp()
            }, { merge: true });

            setUser(prev => ({
                ...prev,
                userData: {
                    ...prev?.userData,
                    ...newData
                }
            }));

            return true;
        } catch (error) {
            console.error("Error updating user data:", error);
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            register,
            loading,
            updateUserData
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}