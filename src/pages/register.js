import React, { useState, useEffect } from 'react';
import { Text, TextInput, View, StyleSheet,Modal,TouchableHighlight,Dimensions, Button, ScrollView, Alert, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, Image } from 'react-native';
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
    const [titleAlert, setTitleAlert] = useState('');
    const [colorHeader, setColorHeader] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            checkInternet();
        });

        return unsubscribe;

    }, [navigation]);

    const navigateReg = () => {
        navigation.navigate("Login");
    }

    const openAlert = (open,title,color) =>{
        setModalVisible(open);
            setTitleAlert(title);
            setColorHeader(color)
    }

    //check for internet connection
    const checkInternet = async () => {
        await Network.getNetworkStateAsync();
        setIsConnected((await Network.getNetworkStateAsync()).isConnected);
    }
    
    //validation for text input fields
    const validates = () => {

        if (!name.trim()) {
            openAlert(true,'Name required!','#cc0000');

            return;
        } else {
            isNameValid = true;
        }

        if (!email.trim()) {
            openAlert(true,'Email required!','#cc0000');

            return;
        } else {
            let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (reg.test(email) === false) {
                openAlert(true,'Invalid email!','#cc0000');

                return false;
            } else {
                isEmailValid = true;
            }
        }
        if (!password.trim()) {
            openAlert(true,'Password required!','#cc0000');

            return;
        } else {
            if (password.length < 6) {
                openAlert(true,'Password too short! Please enter a password more than 6 letters','#cc0000');

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
                        openAlert(true,'Registration Successful! please login','#00e600');
                        setTimeout(() => {
                           
                            navigation.navigate("Login");

                        }, 2000);
                    })
                    .catch(error => {
                        openAlert(true,error.message,'#cc0000');
                    })
            }
        } else {
            openAlert(true,'No connection!','#cc0000');
            navigation.navigate("Splash");

        }


        //Do your stuff if condition meet.
    }

    const ModalView = ({modalVisible,title}) => (
    
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
                style={{ flex: 1 }}
            >

                <Spinner
                    color='#17202A'
                    visible={loading}
                />
                                            <ModalView modalVisible={modalVisible} title={titleAlert}></ModalView>

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
    backBtn: {
        width: 40,
        height: 40
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
        width:200,
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
        width:70,
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
        fontSize:16,
        textAlign: 'center',
      },
});

export default RegisterScreen;