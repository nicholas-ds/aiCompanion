import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import RobotFace from '../assets/robot-face.svg';
import universalStyles from '../styles/universalStyles.js'; // Adjust the path as necessary

import Svg, { Path } from 'react-native-svg'; // Import the necessary components

import { useNavigation } from '@react-navigation/native';


const LaunchPage = () => {

  const navigation = useNavigation();

    return (
      <View style={{...styles.container, ...universalStyles.universalBackground }}>
        {/* Menu Bar */}
        <View style={styles.menuBar}>
        <Svg height="24" width="24" viewBox="0 0 18 12">
          <Path d="M0,0 L18,0 L18,2 L0,2 L0,0 Z M0,5 L18,5 L18,7 L0,7 L0,5 Z M0,10 L18,10 L18,12 L0,12 L0,10 Z" fill="#FFF" />
        </Svg>
        <Text style={styles.title}>Memories</Text>
        </View>
  
        {/* Robot SVG as a background */}
        <View style={styles.robotContainer}>
          <RobotFace width="100%" height="100%" preserveAspectRatio="xMidYMid meet" />
        </View>

  
        {/* Commence Button */}
        <TouchableOpacity 
          style={styles.commenceButton}
          onPress={() => navigation.navigate('ChatUI')} // This should be a prop, not nested inside the tag

          >
          <Text style={styles.commenceButtonText}>COMMENCE</Text>
        </TouchableOpacity>
      </View>
    );
  };
  


  const styles = StyleSheet.create({
    // ... other styles
    robotContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: -1, // Make sure it's behind all other content
    },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#5A55CA', // You would use a gradient background here
  },
  menuBar: {
    marginTop: 50,
    paddingHorizontal: 20, // Add padding horizontally
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // This will position the elements on either end
    width: '100%', // Ensure the menuBar takes full width
  },
  menuIcon: {
    fontSize: 24,
    color: '#fff',
  },
  title: {
    marginLeft: 20,
    fontSize: 24,
    color: '#fff',
    textAlign: "right",
    
  },
  characterContainer: {
    // Styles for character/logo, position it center
  },
  commenceButton: {
    marginBottom: 30,
    marginHorizontal: 50,
    backgroundColor: '#8E44AD',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commenceButtonText: {
    fontSize: 20,
    color: '#fff',
    textTransform: 'uppercase',
  },
});

export default LaunchPage;