import React, { useState, useEffect } from 'react';
import { Text, TextInput, View, StyleSheet, Dimensions, Button, ScrollView, Alert, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Asset } from 'expo-asset';
import firebase from '../../src/database/firebase';
import Spinner from 'react-native-loading-spinner-overlay';
import * as Network from 'expo-network';



const RegisterScreen = () => {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    var isNameValid = false;
    var isEmailValid = false;
    var isPassValid = false;

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            checkInternet();
        });

        return unsubscribe;

    }, [navigation]);

    const navigateReg = () => {
        navigation.navigate("Login");
    }

    //check for internet connection
    const checkInternet = async () => {
        await Network.getNetworkStateAsync();
        setIsConnected((await Network.getNetworkStateAsync()).isConnected);
    }
    
    //validation for text input fields
    const validates = () => {

        if (!name.trim()) {
            Alert.alert('Name required', 'Please enter your name!');
            return;
        } else {
            isNameValid = true;
        }

        if (!email.trim()) {
            Alert.alert('Email required', 'Please enter your email!');
            return;
        } else {
            let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (reg.test(email) === false) {
                Alert.alert('Invalid email', 'Please enter a correct email!');
                return false;
            } else {
                isEmailValid = true;
            }
        }
        if (!password.trim()) {
            Alert.alert('Password required', 'Please enter your password!');
            return;
        } else {
            if (password.length < 6) {
                Alert.alert('Password too short!', 'Please enter a password more than 6 letters');
            } else {
                isPassValid = true;
            }
        }
        if (isConnected) {
            if (isNameValid && isEmailValid && isPassValid) {
                setLoading(true);
                firebase
                    .auth()
                    .createUserWithEmailAndPassword(email, password)
                    .then((res) => {
                        res.user.updateProfile({
                            name: name
                        })
                        setLoading(false);

                        setTimeout(() => {
                            Alert.alert('Registration successful!', 'Please Login');
                            navigation.navigate("Login");

                        }, 2000);
                    })
                    .catch(error => {
                        errorMessage: Alert.alert('Error!', error.message);
                    })
            }
        } else {
            Alert.alert("No connection!", "Please connect to a working internet connection");
            navigation.navigate("Splash");

        }


        //Do your stuff if condition meet.
    }


    return (
        <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>

            <KeyboardAvoidingView
                behavior={Platform.OS == "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >

                <Spinner
                    color='#17202A'
                    visible={loading}
                />
                <View style={{ padding: 25, flex: 5 }}>
                    <View style={{ flex: 1 }}>
                        <BackBtn onPress={navigateReg} />

                    </View>
                    <View style={{ flex: 3 }}>
                        <View style={styles.spacing}></View>
                        <Text style={styles.textHeader}>
                            Register
        </Text>
                        <View style={styles.spacing}></View>

                        <TextInput
                            style={styles.textInput}
                            placeholder="Name"
                            onChangeText={name => setName(name)}
                            defaultValue={name}
                        />
                        <View style={styles.spacing}></View>
                        <TextInput
                            keyboardType='email-address'

                            style={styles.textInput}
                            placeholder="Email"
                            onChangeText={email => setEmail(email)}
                            defaultValue={email}
                        />
                        <View style={styles.spacing}></View>
                        <TextInput
                            secureTextEntry={true}
                            style={styles.textInput}
                            placeholder="Password"
                            onChangeText={password => setPassword(password)}
                            defaultValue={password}
                        />
                        <View style={styles.spacing}></View>
                        <RegisterBtn title="Register" onPress={validates} />

                    </View>
                    <View style={{ flex: 1 }}></View>
                </View>
            </KeyboardAvoidingView>
        </ScrollView>
    );

}



const RegisterBtn = ({ onPress, title }) => (
    <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
        <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
);

const BackBtn = ({ onPress }) => (
    <TouchableOpacity onPress={onPress}>
        <View style={{paddingTop:20}} >
            <Image style={styles.backBtn} source={require('../../assets/back_click.png')} />
        </View>
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
    backBtn: {
        width: 40,
        height: 40
    },
});

export default RegisterScreen;