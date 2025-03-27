import { useRouter } from "expo-router";
import { useAuth } from "./context/AuthContext";
import { useEffect, useState } from "react";
import {
    TouchableOpacity,
    Text,
    View,
    StyleSheet,
    Image,
    Animated,
    Easing
} from "react-native";

export default function HomeScreen() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [glitchEffect] = useState(new Animated.Value(0));
    const [scanLinePosition] = useState(new Animated.Value(0));

    useEffect(() => {
        if (!user) {
            router.replace("/login");
        }

        // Glitch animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(glitchEffect, {
                    toValue: 1,
                    duration: 50,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(glitchEffect, {
                    toValue: 0,
                    duration: 50,
                    delay: 100,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
            ]),
            { iterations: 3 }
        ).start();

        // Scan line animation
        Animated.loop(
            Animated.timing(scanLinePosition, {
                toValue: 1,
                duration: 3000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, [user]);

    const glitchTranslateX = glitchEffect.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, -5, 5]
    });

    const scanLineTranslateY = scanLinePosition.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 500]
    });

    return (
        <View style={styles.container}>
            {/* Background grid pattern */}
            <View style={styles.gridOverlay} />

            {/* Scan line effect */}
            <Animated.View
                style={[
                    styles.scanLine,
                    { transform: [{ translateY: scanLineTranslateY }] }
                ]}
            />

            {/* Main card with glitch effect */}
            <Animated.View style={[
                styles.card,
                { transform: [{ translateX: glitchTranslateX }] }
            ]}>
                {/* Cyberpunk logo/badge */}
                <View style={styles.logoContainer}>
                    <View style={styles.logo}>
                        <Text style={styles.logoText}>NET</Text>
                        <Text style={styles.logoText}>RUNNER</Text>
                    </View>
                    <View style={styles.logoCorner} />
                    <View style={[styles.logoCorner, { right: 0, borderRightWidth: 0, borderLeftWidth: 2 }]} />
                </View>

                {/* User info with cyberpunk style */}
                <View style={styles.userInfo}>
                    <Text style={styles.userLabel}>USER_ID</Text>
                    <Text style={styles.welcomeText}>{user?.displayName?.toUpperCase() || 'ANONYMOUS'}</Text>
                    <Text style={styles.userStatus}>STATUS: <Text style={{ color: '#00FF41' }}>CONNECTED</Text></Text>
                </View>

                {/* Binary code decoration */}
                <Text style={styles.binaryCode}>01001001 01101110 01110100 01100101 01110010 01100110 01100001 01100011 01100101 00100000 01000001 01100011 01110100 01101001 01110110 01100001 01110100 01100101 01100100</Text>

                {/* Buttons with cyberpunk style */}
                <View style={styles.buttonGroup}>
                    <TouchableOpacity
                        style={[styles.button, styles.profileButton]}
                        onPress={() => router.push("./profile")}
                    >
                        <Text style={styles.buttonText}>ACCESS PROFILE</Text>
                        <View style={styles.buttonGlow} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.logoutButton]}
                        onPress={() => { logout(); router.replace("./login") }}
                    >
                        <Text style={styles.buttonText}>TERMINATE SESSION</Text>
                        <View style={styles.buttonGlow} />
                    </TouchableOpacity>
                </View>

                {/* System info footer */}
                <View style={styles.systemInfo}>
                    <Text style={styles.systemText}>SYSTEM: OPERATIONAL</Text>
                    <Text style={styles.systemText}>VERSION: 2.4.7</Text>
                    <Text style={styles.systemText}>SECURITY: LEVEL 3</Text>
                </View>
            </Animated.View>

            {/* Corner decorations */}
            <View style={styles.cornerTL} />
            <View style={styles.cornerTR} />
            <View style={styles.cornerBL} />
            <View style={styles.cornerBR} />
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
        overflow: 'hidden',
    },
    gridOverlay: {
        position: 'absolute',
        width: '200%',
        height: '200%',
        backgroundColor: 'transparent',
        opacity: 0.05,
        backgroundImage: 'linear-gradient(to right, #00FF41 1px, transparent 1px), linear-gradient(to bottom, #00FF41 1px, transparent 1px)',
        backgroundSize: '20px 20px',
    },
    scanLine: {
        position: 'absolute',
        width: '100%',
        height: 2,
        backgroundColor: 'rgba(0, 255, 65, 0.3)',
        zIndex: 10,
    },
    card: {
        backgroundColor: 'rgba(13, 13, 13, 0.85)',
        borderRadius: 4,
        padding: 30,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FF007F',
        width: '90%',
        maxWidth: 400,
        shadowColor: '#FF007F',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
        position: 'relative',
        overflow: 'hidden',
    },
    logoContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 80,
        height: 80,
    },
    logo: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: '#0D0D0D',
        borderWidth: 1,
        borderColor: '#FF007F',
        padding: 5,
        zIndex: 2,
    },
    logoText: {
        color: '#F8E71C',
        fontSize: 12,
        fontWeight: 'bold',
        lineHeight: 14,
    },
    logoCorner: {
        position: 'absolute',
        width: 20,
        height: 20,
        borderWidth: 2,
        borderRightWidth: 2,
        borderColor: '#00FFFF',
        borderBottomWidth: 0,
        zIndex: 1,
    },
    userInfo: {
        marginTop: 30,
        marginBottom: 40,
        alignItems: 'center',
    },
    userLabel: {
        color: '#00FFFF',
        fontSize: 12,
        letterSpacing: 2,
        marginBottom: 5,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#F8E71C',
        marginBottom: 10,
        textShadowColor: '#F8E71C',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
        letterSpacing: 1,
    },
    userStatus: {
        color: '#FF007F',
        fontSize: 12,
        letterSpacing: 1,
    },
    binaryCode: {
        color: 'rgba(0, 255, 65, 0.3)',
        fontSize: 10,
        marginBottom: 30,
        letterSpacing: 1,
        textAlign: 'center',
        lineHeight: 14,
    },
    buttonGroup: {
        width: '100%',
        marginBottom: 30,
    },
    button: {
        width: '100%',
        paddingVertical: 15,
        borderRadius: 0,
        alignItems: 'center',
        marginVertical: 10,
        borderWidth: 1,
        borderColor: 'transparent',
        position: 'relative',
        overflow: 'hidden',
    },
    profileButton: {
        backgroundColor: 'rgb(255, 0, 128)',
        borderColor: '#FF007F',
    },
    logoutButton: {
        backgroundColor: 'rgb(0, 255, 255)',
        borderColor: '#00FFFF',
    },
    buttonGlow: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: 'transparent',
        opacity: 0.5,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    systemInfo: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderColor: 'rgba(0, 255, 65, 0.3)',
        paddingTop: 10,
    },
    systemText: {
        color: '#00FF41',
        fontSize: 8,
        letterSpacing: 1,
    },
    cornerTL: {
        position: 'absolute',
        top: 20,
        left: 20,
        width: 30,
        height: 30,
        borderLeftWidth: 2,
        borderTopWidth: 2,
        borderColor: '#FF007F',
    },
    cornerTR: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 30,
        height: 30,
        borderRightWidth: 2,
        borderTopWidth: 2,
        borderColor: '#00FFFF',
    },
    cornerBL: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        width: 30,
        height: 30,
        borderLeftWidth: 2,
        borderBottomWidth: 2,
        borderColor: '#00FFFF',
    },
    cornerBR: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 30,
        height: 30,
        borderRightWidth: 2,
        borderBottomWidth: 2,
        borderColor: '#FF007F',
    },
});