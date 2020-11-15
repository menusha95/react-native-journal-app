import React, { useState, useEffect } from 'react';
import { IconButton, Text, TextInput, Modal, TouchableHighlight, Dimensions, View, StyleSheet, ScrollView, Button, Alert, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firebase from '../../src/database/firebase';
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import * as Network from 'expo-network';



const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();
    var isEmailValid = false;
    var isPassValid = false;
    const [loading, setLoading] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [titleAlert, setTitleAlert] = useState('');
    const [colorHeader, setColorHeader] = useState('');
    const [modalVisible, setModalVisible] = useState(false);


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            checkInternet();
        });

        return unsubscribe;

    }, [navigation]);

    //check for internet connection
    const checkInternet = async () => {
        await Network.getNetworkStateAsync();
        setIsConnected((await Network.getNetworkStateAsync()).isConnected);
    }

    const openAlert = (open, title, color) => {
        setModalVisible(open);
        setTitleAlert(title);
        setColorHeader(color)
    }

    //validation for text input fields
    const validates = () => {
        if (!email.trim()) {
            openAlert(true, 'Email required!', '#cc0000');

            return;
        } else {
            let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (reg.test(email) === false) {
                openAlert(true, 'Invalid email!', '#cc0000');

                return false;
            } else {
                isEmailValid = true;
            }
        }
        if (!password.trim()) {
            openAlert(true, 'Password required!', '#cc0000');

            return;
        } else {
            isPassValid = true;
        }

        if (isConnected) {
            if (isEmailValid && isPassValid) {
                setLoading(true);
                firebase
                    .auth()
                    .signInWithEmailAndPassword(email, password)
                    .then((res) => {
                        var uid = res.user.uid;
                        AsyncStorage.setItem('uid', uid);
                        setLoading(false);

                        openAlert(true, 'Login Successful!', '#00e600');
                        setTimeout(() => {
                            navigation.navigate("Home");
                        }, 2000);
                    })
                    .catch(error => {
                        errorMessage:
                        setLoading(false);

                        setTimeout(() => {
                            openAlert(true, error.message, '#cc0000');

                        }, 700);
                    })
            }
        } else {
            Alert.alert("No connection!", "Please connect to a working internet connection");
            navigation.navigate("Splash");

        }
    }

    const navigateReg = () => {
        navigation.navigate("Register");
    }

    const ModalView = ({ modalVisible, title }) => (

        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>{title}</Text>

                        <TouchableHighlight
                            style={{ ...styles.openButton, backgroundColor: colorHeader }}
                            onPress={() => {
                                setModalVisible(!modalVisible);
                                //   navigation.navigate("Home");
                            }}>
                            <Text style={styles.textStyle}>Okay</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        </View>
    );


    return (
        <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
            <KeyboardAvoidingView
                behavior={Platform.OS == "ios" ? "padding" : "height"}
                style={{ flex: 1 }} >


                <ModalView modalVisible={modalVisible} title={titleAlert}></ModalView>

                <View style={{ padding: 25, flex: 5 }}>
                    <View style={{ flex: 1 }} />
                    <View style={{ flex: 3 }}>
                        <View style={styles.spacing} />
                        <Text style={styles.textHeader}>
                            Login
        </Text>


                        <View style={styles.spacing} />
                        <TextInput
                            keyboardType='email-address'
                            style={styles.textInput}
                            placeholder="Email"
                            onChangeText={email => setEmail(email)}
                            defaultValue={email}
                        />
                        <View style={styles.spacing} />
                        <TextInput
                            secureTextEntry={true}
                            style={styles.textInput}
                            placeholder="Password"
                            onChangeText={password => setPassword(password)}
                            defaultValue={password}
                        />
                        <View style={styles.spacing} />
                        <LoginBtn title="Login" onPress={validates} />
                        <View style={styles.spacing} />
                        <Text style={styles.text}>Don't have an account?</Text>
                        <View style={styles.spacing} />

                        <RegisterBtn title="Register" onPress={navigateReg} />

                    </View>
                    <View style={{ flex: 1 }}></View>
                </View>
                <Spinner
                    color='#17202A'
                    visible={loading}
                />
            </KeyboardAvoidingView>
        </ScrollView>
    );

}

const LoginBtn = ({ onPress, title }) => (
    <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
        <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
);


const RegisterBtn = ({ onPress, title }) => (
    <TouchableOpacity onPress={onPress} style={styles.buttonContainerReg}>
        <Text style={styles.buttonText}>{title}</Text>
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
    buttonContainerReg: {
        elevation: 8,
        backgroundColor: "#003d99",
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
    text: {
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
    container: {
        flex: 1,
        flexDirection: 'row',
        padding: 10,
        marginLeft: 16,
        marginRight: 16,
        marginTop: 8,
        marginBottom: 8,
        borderRadius: 5,
        backgroundColor: '#FFF',
        elevation: 2,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    modalView: {
        margin: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 30,
        width: 200,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    openButton: {
        backgroundColor: '#F194FF',
        borderRadius: 20,
        width: 70,
        padding: 10,
        elevation: 2,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        fontSize: 16,
        textAlign: 'center',
    },
});

export default LoginScreen;