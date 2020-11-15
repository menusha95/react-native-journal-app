import React, { useState, useEffect } from 'react';
import { Text, TextInput, View, StyleSheet,Modal,TouchableHighlight,  ScrollView, TouchableOpacity, KeyboardAvoidingView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firebase from '../database/firebase';
import Spinner from 'react-native-loading-spinner-overlay';
import * as Network from 'expo-network';
import AsyncStorage from '@react-native-community/async-storage';



const ItemScreen = ({ route }) => {

    const navigation = useNavigation();

    var date = route.params.item.date;
    var key = route.params.item.key;
    const [loading, setLoading] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [userId, setUserId] = useState('');
    const [title, setTitle] = useState(route.params.item.title);
    const [description, setDesc] = useState(route.params.item.description);
    const [titleAlert, setTitleAlert] = useState('');
    const [colorHeader, setColorHeader] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            checkInternet();
        });

        return unsubscribe;

    }, [navigation]);

    const navigateHome = () => {
        navigation.navigate("Home");
    }

    const openAlert = (open,title,color) =>{
        setModalVisible(open);
            setTitleAlert(title);
            setColorHeader(color)
    }


    const checkInternet = async () => {
        await Network.getNetworkStateAsync();
        setIsConnected((await Network.getNetworkStateAsync()).isConnected);
    }

    //function to delete an item from firestore database
    const deleteItem = () => {
        setLoading(true)
        if (isConnected) {
            AsyncStorage.getItem('uid').then(
                (value) => {
                    setUserId(value)

                    setTimeout(() => {
                        firebase.firestore()
                            .collection(value)
                            .doc(key)
                            .delete()
                            .then(() => {
                                setLoading(false);
                                openAlert(true,'Item deleted!','#00e600');

                                // Alert.alert("Record deleted!", 'Record successfully deleted!');

                               
                            });
                    },2000)
                }
            );

        } else {
            setLoading(false)
        }
    }

    const editItem = () => {
        setLoading(true)
        if (isConnected) {
            AsyncStorage.getItem('uid').then(
                (value) => {
                    setUserId(value)

                    setTimeout(() => {
                        firebase.firestore()
                            .collection(value)
                            .doc(key)
                            .update(
                                {
                                    title: title,
                                    description: description,
                                }
                            )
                            .then(() => {
                                setLoading(false)
                                openAlert(true,'Item updated!','#00e600');

                             
                            });
                    },2000)
                }
            );

        } else {
            setLoading(false)
        }
    }
    //function to custom alert
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
                  navigation.navigate("Home");
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
                        <BackBtn onPress={navigateHome} />
                        <View style={styles.spacing} />
                        <View style={styles.spacing} />

                        <View style={styles.cellDateBack}>
                            <Text style={styles.cellTextDate}> {date}  </Text>
                        </View>
                        <View style={styles.spacing} />

                        <TextInput
                            style={styles.cellText}
                            placeholder={title}
                            onChangeText={title => setTitle(title)}
                            defaultValue={title}
                        />
                        <View style={styles.spacing} />

                        <View style={styles.cellDescBack}>
                            <TextInput
                                style={styles.cellDesc}
                                placeholder={description}
                                multiline={true}
                                onChangeText={description => setDesc(description)}
                                defaultValue={description}
                            />                        
                            </View>
                        <View style={styles.spacing} />
                        <View style={styles.spacing} />
                        <View style={{ flexDirection: 'row', justifyContent:'space-evenly'}}>
                        <DeleteBtn title="Delete Item" onPress={deleteItem}></DeleteBtn>
                        <View style={styles.spacing} />

                        <UpdateBtn title="Update Item" onPress={editItem}></UpdateBtn>

                            </View>
                        <View style={styles.spacing} />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </ScrollView>
    );

}


const BackBtn = ({ onPress }) => (
    <TouchableOpacity onPress={onPress}>
        <View style={{ paddingTop: 20 }} >
            <Image style={styles.backBtn} source={require('../../assets/back_click.png')} />
        </View>
    </TouchableOpacity>
);


const DeleteBtn = ({ onPress, title }) => (
    <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
        <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
);
const UpdateBtn = ({ onPress, title }) => (
    <TouchableOpacity onPress={onPress} style={styles.buttonContainerUpdate}>
        <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({

    spacing: {
        backgroundColor: 'transparent',
        padding: 10
    },
    buttonContainer: {
        elevation: 8,
        backgroundColor: "#cc0000",
        borderRadius: 10,
        height: 50,
        justifyContent: 'center',
        flex:1
    },
    buttonContainerUpdate: {
        elevation: 8,
        backgroundColor: "#002966",
        borderRadius: 10,
        height: 50,
        justifyContent: 'center',
        flex:1
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
    cellText: {
        fontSize: 28,
        color: "#17202A",
        fontWeight: "bold",
    },
    cellTextDate: {
        fontSize: 16,
        color: "#FFF",
        fontWeight: "300",
    },
    cellDateBack: {
        padding: 5,
        borderRadius: 5,
        backgroundColor: '#17202A',
        alignSelf: 'flex-start'
    },
    cellDesc: {
        fontSize: 20,
        color: "#17202A",
        fontWeight: "normal",
    },
    cellDescBack: {
        padding: 5,
        borderRadius: 5,
        backgroundColor: '#e6e6e6',
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

export default ItemScreen;