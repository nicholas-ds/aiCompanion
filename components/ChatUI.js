import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity, KeyboardAvoidingView, ScrollView, StatusBar } from 'react-native';
import universalStyles from '../styles/universalStyles.js'; // Adjust the path as necessary

import { REACT_APP_SERVER_IP } from '@env'

const serverIP = REACT_APP_SERVER_IP ;

const ChatUI = () => {
    const [inputText, setInputText] = useState(''); // Initialize the state for input text
    const [conversation, setConversation] = useState([]);
    const [error, setError] = useState(''); // Initialize the error state

    const moveConversations = async () => {
      try {
          const response = await fetch(`http://${serverIP}:3000/move-conversations`, { method: 'POST' });
  
          if (!response.ok) throw new Error('Network response was not ok');
          console.log('Conversations moved successfully');
      } catch (error) {
          console.error('There has been a problem with your fetch operation: ', error);
      }
  };

    const sendUserInputToAPI = async () => {
      try {

          // Prepare the request data
          const requestData = {
              message: inputText,
          };

          // Make an HTTP POST request to the API
          const response = await fetch(`http://${serverIP}:3000/api/chat`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestData),
          });

          if (response.ok) {
            //If the response is successful, parse the JSON response data. 
            const responseData = await response.json();
            const reply = responseData.reply;

            // Add user's input to the convo
            setConversation(convo => [...convo, {text: inputText, sender: 'user', timestamp: responseData.usermessageTimestamp}]);

            
            setConversation(convo => [...convo, {text: reply, sender: 'ai', timestamp: responseData.aiResponseTimestamp}]);


            console.log(responseData);

          } else {
            //Handle errors here
            setError('Error connecting to the server.'); // Set error message
            console.error('Error:', response.statusText);
          }
      } catch (error) {
        console.error('Error:', error.message);
        setError(`An error occurred: ${error.message}`); // Set error message

      }
      setInputText('');
    };



    return (
      <KeyboardAvoidingView 
            style={[styles.parentContainer, universalStyles.universalBackground]}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.select({ ios: 60, android: 80 })} // Adjust as needed
        >
            {/* The interfaceContainer is now the first child inside the KeyboardAvoidingView */}
            <StatusBar barStyle="light-content" backgroundColor="#5A55CA" />

            <View style={styles.interfaceContainer}>
                <View style={styles.header}>
                <TouchableOpacity 
                        // style={styles.submitButton}
                        onPress={moveConversations}
                    >
                        <Text>Clear Daily Conversation Memory</Text>
                    </TouchableOpacity>
                </View>


                  <ScrollView 
                    style={styles.conversation}
                    contentContainerStyle={styles.conversationContent}
                  >
                      {/* Mapping through the conversation state to display messages */}
                      {conversation.map((message, index) => (
                          <Text 
                              key={index} 
                              style={message.sender === 'user' ? styles.userMessage : styles.aiMessage}
                          >  
                              {message.text}
                          </Text>
                      ))}
                      {/* Displaying any error messages */}
                      {error && <Text style={styles.errorText}>{error}</Text>}
                      <View style={styles.footer}></View>
                  </ScrollView>

                {/* Footer section with TextInput and Submit button */}
                <View style={styles.footer}>
                    <TextInput
                        placeholder="Type your prompt here!"
                        style={styles.input}
                        onChangeText={text => setInputText(text)}
                        value={inputText}
                    />
                    <TouchableOpacity 
                        style={styles.submitButton}
                        onPress={sendUserInputToAPI}
                    >
                        <Text>Submit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    parentContainer: {
      flex: 1,
      flexGrow: 1,
      backgroundColor: 'rgb(75, 201, 161)',
      alignItems: 'center',
    },
    interfaceContainer: {
      flex: 1,
      borderColor: 'black',
      borderRadius: 25,
      width: '97%',
      marginTop: 5,
      marginBottom: 20,
      // paddingBottom: 60,
      borderWidth: 1,
      borderColor: 'black',
      backgroundColor: 'rgb(75, 201, 161)',
      alignItems: 'center',
    },
    footer: {
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'space-around', 
      marginLeft: 20,
      marginRight: 20,
      marginBottom: 10,
      marginTop: 5,
      flexShrink: 0,
    },
    input: {
      height: 40,
      borderWidth: 1,
      borderRadius: 25,
      width: '80%', 
      marginRight: 25,
      backgroundColor: 'white',
      padding: 10
    },
    submitButton: {
      backgroundColor: '#C94B73',
      borderRadius: 25,
      borderColor: "black",
      borderWidth: 1,
      padding: 10
    },
    header: {
      borderWidth: 1,
      width: '95%',
      paddingTop: 1,
      paddingBottom: 1,
      marginTop: 5,
      marginBottom: 5,
      backgroundColor: "#C94B73",
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'space-between',

    },

    conversationContent: {
      alignItems: 'flex-end', // or any other layout styles for children
      justifyContent: 'flex-end',
      flexGrow: 1,
      marginTop: 30,
      paddingBottom: 50,
      },

    // conversationContainer: {
    //   alignItems: 'flex-end', // Aligns children of ScrollView
    //   justifyContent: 'flex-end', 
    //   flex: 1,
    // },

    conversation: {
      flex: 1,
      borderWidth: 1,
      borderColor: 'black',
      // borderRadius: 25,
      backgroundColor: "#B2C94B",
      width: '95%',
      marginBottom: 10,
      marginTop: 10,
      // paddingBottom: 50,
      // justifyContent: 'flex-end',
      // alignItems: 'flex-end',
    },
    userMessage: {
      borderWidth: 1,
      borderRadius: 25,
      padding: 7,
      marginBottom: 5,
      marginRight: 5,
      marginLeft: 2,
      backgroundColor: '#DCC9FB',
      alignSelf: 'flex-end',
    },
    aiMessage:{
      borderWidth: 1,
      borderRadius: 25,
      padding: 7,
      marginBottom: 5,
      marginRight: 2,
      backgroundColor: '#F4C2D7',
      marginLeft: 5,
      alignSelf: 'flex-start'

    },
    
    
  });
  


export default ChatUI;