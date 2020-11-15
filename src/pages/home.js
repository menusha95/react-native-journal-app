import React, { useState, useRef, useEffect } from 'react';
import {  FlatList,Modal,TouchableHighlight, Text, Animated, TextInput, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firebase from '../../src/database/firebase';
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import * as Network from 'expo-network';

const HomeScreen = () => {
    const navigation = useNavigation();
    const [title, setTitle] = useState('');
    const [description, setDesc] = useState('');
    const [isEditClick, setisEditClick] = useState(false);
    const [currentDate, setCurrentDate] = useState('');
    const [users, setUsers] = useState([]); // Initial empty array of users
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    const [loading, setLoading] = useState(false);
    var isTitleValid = false;
    var isDescValid = false;
    const [isConnected, setIsConnected] = useState(false);
    const [isAlert, setIsAlert] = useState(false);
    const [userId, setUserId] = useState('');
    const [titleAlert, setTitleAlert] = useState('');
    const [colorHeader, setColorHeader] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    //check for internet connection
    const checkInternet = async () => {
        await Network.getNetworkStateAsync();
        setIsConnected((await Network.getNetworkStateAsync()).isConnected);
    }

    useEffect(() => {
        var date = new Date().getDate();
        var month = new Date().getMonth();
        var year = new Date().getFullYear();
        const unsubscribe = navigation.addListener('focus', () => {
            checkInternet();
            getUserFire();
        });
        //get current date 
        setCurrentDate(
            year + ' ' + monthNames[month] + ' ' + date

        );

        return unsubscribe;

    }, [navigation]);


    //get items from firestore databse
    const getUserFire = () => {
        AsyncStorage.getItem('uid').then(
            (value) => {
                setUserId(value)

                setTimeout(() => {
                    firebase.firestore()
                        .collection(value)
                        .get()
                        .then(querySnapshot => {
                            const users = [];
                            querySnapshot.forEach(documentSnapshot => {
                                //adding items to users array
                                users.push({
                                    ...documentSnapshot.data(),
                                    key: documentSnapshot.id,
                                });
                            });
                            setUsers(users);
                            setLoading(false);

                        }, 2000);
                })
            }
        );
    }

    //adding an item to the firestore databse
    const addItem = () => {


        if (!title.trim()) {
            openAlert(true,'Title required!','#cc0000');
           
            return;
        } else {
            isTitleValid = true;
        }

        if (!description.trim()) {
            openAlert(true,'Description required!','#cc0000');
            return;
        } else {
            isDescValid = true;
        }

        if (isConnected) {
            setLoading(true);

            if (isTitleValid && isDescValid) {
                firebase.firestore()
                    .collection(userId)
                    .add({
                        title: title,
                        description: description,
                        date: currentDate
                    })
                    .then(() => {
                        setTitle('');
                        setDesc('');
                        setLoading(false);
                        setisEditClick(false);
                        getUserFire();
                    });
            }
        } else {
            setLoading(false);
            openAlert(true,'No connection!','#cc0000');
            navigation.navigate("Splash");
        }
    }

    const closeEdit = () => {
        setisEditClick(false);
        setIsAlert(false);
    }

    const openEdit = () => {
        // openAlert(true,'hiii','meyaaa','green');
        setisEditClick(true);
    }

    const closeAlert = (close) => {
        setIsAlert(close);
    }

    const openAlert = (open,title,color) =>{
        setModalVisible(open);
            setTitleAlert(title);
            setColorHeader(color)
    }

    const logOutClick = () => {
        navigateItem();
    }

    //function to navigate to full view with the item object
    const getDataJournal = (item) => {
        navigation.navigate("Item", {
            item: item
        });
    }

    //logout funtion
    const navigateItem = async () => {
        setLoading(true);
        try {
            setLoading(false);
            await AsyncStorage.removeItem('uid');
            navigation.navigate("Splash");

            return true;
        }
        catch (exception) {
            return false;
        }
    }
    const getHeader = () => {
        return <View>
            <Spinner
                color='#17202A'
                visible={loading}
            />
            <View style={{ padding: 25, flex: 4 }}>
                <View style={{ flex: 3 }}>
                    <View style={styles.spacing} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.textHeader}>
                            My Journal</Text>

                        <LogoutBtn onPress={logOutClick} />
                    </View>


                    <View style={styles.spacing} />

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.text}>Add items to Journal</Text>

                        {isEditClick ? (
                            <CloseBtn onPress={closeEdit} />

                        ) : (
                                <>
                                    <EditBtn onPress={openEdit} />
                                </>
                            )}

                    </View>

                    <View style={styles.spacing} />

                    {!isEditClick ? (
                        <View />
                    ) : (
                            <>
                                <FadeInView style={{ flex: 1 }}>
                                    <Text style={styles.textDate}>{currentDate}</Text>
                                    <View style={styles.spacing} />

                                    <TextInput
                                        style={styles.textInput}
                                        placeholder="Title"
                                        onChangeText={title => setTitle(title)}
                                        defaultValue={title}
                                    />
                                    <View style={styles.spacing} />

                                    <TextInput
                                        style={styles.textInputMultiline}
                                        placeholder="Start Writing.."
                                        multiline={true}
                                        onChangeText={description => setDesc(description)}
                                        defaultValue={description}
                                    />
                                    <View style={styles.spacing} />

                                    <AddToJournalBtn title="Add to Journal" onPress={addItem} />

                                </FadeInView>

                            </>
                        )}
                </View>
                <View style={{ flex: 1 }}></View>
            </View>
        </View>
    };

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
            }}>
            <Text style={styles.textStyle}>Okay</Text>
          </TouchableHighlight>
        </View>
      </View>
    </Modal>
  </View>
);


    return (
        <View>
            <ModalView modalVisible={modalVisible} title={titleAlert}></ModalView>
            <FlatList

                data={users}
                renderItem={({ item }) => (
                    <View style={{ paddingLeft: 25, paddingRight: 25 }}>
                        <TouchableOpacity style={styles.cellContainer} onPress={getDataJournal.bind(this, item)}>
                            <View style={{ height: 60, flex: 1, padding: 10, justifyContent: 'center' }}>
                                <Text style={styles.cellText} >{item.title}</Text>
                                <Text style={styles.cellTextDate} >{item.date}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
                ListHeaderComponent={getHeader()}
                ItemSeparatorComponent={ItemSeprator}
            />
        </View>
    );
}

//function to animate input view
const FadeInView = (props) => {
    const fadeAnim = useRef(new Animated.Value(0)).current  // Initial value for opacity: 0

    React.useEffect(() => {
        Animated.timing(
            fadeAnim,
            {
                toValue: 1,
                duration: 300,
                useNativeDriver: true
            }
        ).start();
    }, [fadeAnim])

    return (
        <Animated.View                 // Special animatable View
            style={{
                ...props.style,
                opacity: fadeAnim,
                padding: 15,
                borderRadius: 10,
                backgroundColor: '#e6e6e6'         // Bind opacity to animated value
            }}
        >
            {props.children}
        </Animated.View>
    );
}

const AddToJournalBtn = ({ onPress, title }) => (
    <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
        <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
);

const ShowAlert = ({ click }) => (
    <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
        <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
);

const ItemSeprator = () => <View style={{
    height: 7,
    width: "100%",
    backgroundColor: 'transparent'
}} />

const EditBtn = ({ onPress }) => (
    <TouchableOpacity onPress={onPress}>
        <View >
            <Image style={styles.backBtn} source={require('../../assets/add_icon.png')} />
        </View>
    </TouchableOpacity>
);

const LogoutBtn = ({ onPress }) => (
    <TouchableOpacity style={{ paddingTop: 5, paddingBottom: 5 }} onPress={onPress}>
        <View style={styles.logoutBtnText}>
            <Text style={{ color: 'white' }}>Logout</Text>
        </View>
    </TouchableOpacity>
);

const CloseBtn = ({ onPress }) => (
    <TouchableOpacity onPress={onPress}>
        <View >
            <Image style={styles.backBtn} source={require('../../assets/close_icon.png')} />
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
    textInputMultiline: {
        height: 50,
        borderColor: '#BFC9CA',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        height: 100
    },
    textHeader: {
        flex: 1,
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
    cellContainer: {
        elevation: 8,
        backgroundColor: "#17202A",
        borderRadius: 10,
        height: 110,
    },
    cellText: {
        fontSize: 28,
        color: "#ffffff",
        fontWeight: "bold",
    },
    cellTextDate: {
        fontSize: 16,
        color: "#ffffff",
        fontWeight: "300",
    },
    backBtn: {
        width: 37,
        height: 37
    },
    logoutBtnText: {
        backgroundColor: '#cc0000',
        padding: 5,
        borderRadius: 5,
        flex: 1,
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
        fontSize: 20,
        color: "#17202A",
        alignSelf: "center",
        justifyContent: 'center'
    },
    textDate: {
        fontSize: 18,
        color: "#17202A",
        fontWeight: 'bold'
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

export default HomeScreen;

