import React from 'react';
import { View, Button, StyleSheet, TouchableOpacity, Text, Linking } from 'react-native';


const SettingsMenu = ({ onClose }) => {
    return (
        <View style={styles.settingsContainer}>
            <TouchableOpacity onPress={onClose}>
                <Text style={styles.closeButton}>X</Text>
            </TouchableOpacity>
            <Button style={styles.settingsButton} title="Log in with Spotify" onPress={() => Linking.openURL('http://192.168.1.185:3000/auth/spotify')} />
        </View>
    );
};



const styles = StyleSheet.create({
    settingsContainer: {
        position: 'absolute',
        top: 10,
        left: 0,
        right: 0,
        width: '50%',
        height: '98%',
        padding: 5,
        backgroundColor: 'rgb(75, 201, 161)',
        zIndex: 1,
    },
    closeButton: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'right',
        padding: 8,
    },
    settingsButton: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 10,
    },
    
});

export default SettingsMenu;