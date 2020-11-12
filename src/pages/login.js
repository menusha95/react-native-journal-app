import React, { useState } from 'react';
import {IconButton, Text, TextInput, View, StyleSheet, Button, Alert, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { useNavigation  } from '@react-navigation/native';
import firebase from '../../src/database/firebase';
import AsyncStorage from '@react-native-community/async-storage';



const LoginScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();
    var isEmailValid = false;
    var isPassValid = false;
    
    const getValueFunction = () => {
        // Function to get the value from AsyncStorage
        var item = AsyncStorage.getItem('uid').then(
            (value) =>
              // AsyncStorage returns a promise
              // Adding a callback to get the value
              console.log("ITEM===>",value)
              // Setting the value in Text
          );
      };

    const validates = () => {

        if (!email.trim()) {
            Alert.alert('Email required', 'Please enter your email!');
            return;
        } else {
            let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (reg.test(email) === false) {
                Alert.alert('Invalid email', 'Please enter a correct email!');
                return false;
            }else{
                isEmailValid = true;
            }
        }
        if (!password.trim()) {
            Alert.alert('Password required', 'Please enter your password!');
            return;
        }else{
            isPassValid = true;
        }

        if(isEmailValid && isPassValid){
            firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then((res) => {
                var uid = JSON.stringify(res.user.uid);
                AsyncStorage.setItem('uid', uid);

              Alert.alert('Login Successful!', "Start using your journal")
              navigation.navigate("Home");
            })
            .catch(error => { errorMessage: Alert.alert('Error!', error.message);

                 })
        }

        //Do your stuff if condition meet.
    }

    const navigateReg = () => {
        navigation.navigate("Register");
    }

    return (
        
        <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            style={{ flex: 1 }} >
                
            <View style={{ padding: 25, flex: 4 }}>
                <View style={{ flex: 1 }}/>
                <View style={{ flex: 3 }}>
                    <View style={styles.spacing}/>
                    <Text style={styles.textHeader}>
                        Login
        </Text>

                   
                    <View style={styles.spacing}/>
                    <TextInput
                        keyboardType='email-address'

                        style={styles.textInput}
                        placeholder="Email"
                        onChangeText={email => setEmail(email)}
                        defaultValue={email}
                    />
                    <View style={styles.spacing}/>
                    <TextInput
                        secureTextEntry={true}
                        style={styles.textInput}
                        placeholder="Password"
                        onChangeText={password => setPassword(password)}
                        defaultValue={password}
                    />
                    <View style={styles.spacing}/>
                    <LoginBtn title="Login" onPress={validates}/>
                    <View style={styles.spacing}/>
                    <Text style={styles.text}>Don't have an account?</Text>
                    <View style={styles.spacing}/>

                    <RegisterBtn title="Register" onPress={navigateReg}/>

                </View>
                <View style={{ flex: 1 }}></View>
            </View>
        </KeyboardAvoidingView>
    );

}



const LoginBtn = ({ onPress, title }) => (
    <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
        <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
);


const RegisterBtn = ({ onPress, title }) => (
    <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
        <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
);

const ForgotPasswordBtn = ({ onPress, title }) => (
    <TouchableOpacity onPress={onPress}>
        <Text style={styles.buttonTextBackNil}>{title}</Text>
    </TouchableOpacity>
);


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
        fontSize: 35,
        fontWeight: "bold",
        color: '#17202A'
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
    button: {
        fontSize: 11,
        color: "#ffffff",
        fontWeight: "bold",
        alignSelf: "center",
        justifyContent: 'center'
    },
    text:{
        fontSize: 14,
        color: "#17202A",
        alignSelf: "center",
        justifyContent: 'center'
    },
    buttonTextBackNil: {
        fontSize: 14,
        color: "#17202A",
        alignSelf: "center",
        justifyContent: 'center'
    },
});

export default LoginScreen;