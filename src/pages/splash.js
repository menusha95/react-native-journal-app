import React, { useState,useEffect } from 'react';
import { Text, TextInput, View, StyleSheet, Dimensions, Button, ScrollView, Alert, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Asset } from 'expo-asset';
import firebase from '../database/firebase';
import AsyncStorage from '@react-native-community/async-storage';



const SplashScreen = ({ route }) => {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const navigation = useNavigation();

    const navigateHome = () => {
        navigation.navigate("Home");
    }

    const getValueFunction = () => {
        // Function to get the value from AsyncStorage
        AsyncStorage.getItem('uid').then(
            (value) =>
                {
                    setTimeout(() => {
                        if(value == null){
                            navigation.navigate("Login"); 
                        }else{
                            navigation.navigate("Home"); 
                        }
                      }, 3000);
                    
                }
          
        );
    }

    useEffect(() => {
     
        const unsubscribe = navigation.addListener('focus', () => {
            getValueFunction();
          });

        return unsubscribe;

    }, [navigation]);

    return (
       
                <View style={{ height:windowHeight, width:windowWidth, justifyContent: 'center',
                alignSelf: "center"}}>
                   <Text style={styles.textHeader}>My {"\n"}Journal</Text>

                    </View>
            
    );

}



const styles = StyleSheet.create({
    textInput: {
        height: 50,
        borderColor: '#BFC9CA',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        fontSize: 16
    },
    textHeader: {
        fontSize: 50,
        fontWeight: "bold",
        color: '#17202A',
        justifyContent: 'center',
        alignSelf: "center"
        
    },
    spacing: {
        backgroundColor: 'transparent',
        padding: 10
    },
    buttonContainer: {
        elevation: 8,
        backgroundColor: "#17202A",
        borderRadius: 10,
        height: 50,
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: 16,
        color: "#ffffff",
        fontWeight: "bold",
        alignSelf: "center",
        justifyContent: 'center'
    },
    backBtn: {
        width: 40,
        height: 40
    },
    preloader: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    cellText: {
        fontSize: 28,
        color: "#17202A",
        fontWeight: "bold",
    },
    cellTextDate: {
        fontSize: 16,
        color: "#17202A",
        fontWeight: "300",
    },
    cellDesc: {
        fontSize: 20,
        color: "#17202A",
        fontWeight: "normal",
    },
});

export default SplashScreen;