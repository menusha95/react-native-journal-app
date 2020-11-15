import React, { useState, useRef, useEffect } from 'react';
import { IconButton, FlatList, ActivityIndicator, Text, Animated, Keyboard, TextInput, ScrollView, View, StyleSheet, Button, Image, Alert, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
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
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const [loading, setLoading] = useState(false);
    var isTitleValid = false;
    var isDescValid = false;
    const [isConnected, setIsConnected] = useState(false);

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
        setCurrentDate(
            year + ' ' + monthNames[month] + ' ' + date

        );
        return unsubscribe;

    }, [navigation]);



    const getUserFire = () => {
        firebase.firestore()
            .collection('journallist')
            .get()
            .then(querySnapshot => {
                const users = [];
                querySnapshot.forEach(documentSnapshot => {
                    users.push({
                        ...documentSnapshot.data(),
                        key: documentSnapshot.id,
                    });
                });
                setUsers(users);
                setLoading(false);

            });
        console.log(users);

    }

    const addItem = () => {

        if (!title.trim()) {
            Alert.alert('Title required', 'Please enter a title!');
            return;
        } else {
            isTitleValid = true;
        }

        if (!description.trim()) {
            Alert.alert('Description required', 'Please enter a description!');
            return;
        } else {
            isDescValid = true;
        }

        if (isConnected) {
            setLoading(true);

            if (isTitleValid && isDescValid) {
                firebase.firestore()
                    .collection('journallist')
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

            Alert.alert("No connection!", "Please connect to a working internet connection");
            navigation.navigate("Splash");

        }
    }


    const closeEdit = () => {
        setisEditClick(false);

    }
    const openEdit = () => {
        setisEditClick(true);

    }
    const logOutClick = () => {
        navigateItem();
    }

    const getDataJournal = (item) => {
        navigation.navigate("Item", {
            item: item
        });
    }

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

    return (
        <ScrollView nestedScrollEnabled={true} keyboardShouldPersistTaps='handled' contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>

            <KeyboardAvoidingView
                behavior={Platform.OS == "ios" ? "padding" : "height"}
                style={{ flex: 1 }} >
                <Spinner
                    color='#17202A'
                    visible={loading}
                />
                <View style={{ padding: 25, flex: 4 }}>
                    <View style={{ flex: 3 }}>
                        <View style={styles.spacing} />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={styles.textHeader}>
                                My journal</Text>

                            <LogoutBtn onPress={logOutClick} />
                        </View>


                        <View style={styles.spacing} />

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={styles.text}>Add items to journal</Text>
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

                                        <AddToJournalBtn title="Add to journal" onPress={addItem} />
                                        <View style={styles.spacing} />

                                    </FadeInView>

                                </>
                            )}
                        <FlatList
                            data={users}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.cellContainer} onPress={getDataJournal.bind(this, item)}>
                                    <View style={{ height: 60, flex: 1, padding: 10, justifyContent: 'center' }}>
                                        <Text style={styles.cellText} >{item.title}</Text>
                                        <Text style={styles.cellTextDate} >{item.date}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item, index) => {
                                return item.key;
                            }}
                            ItemSeparatorComponent={ItemSeprator}

                        />

                    </View>
                    <View style={{ flex: 1 }}></View>
                </View>
            </KeyboardAvoidingView>
        </ScrollView>
    );

}


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
                opacity: fadeAnim,         // Bind opacity to animated value
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


const ItemSeprator = () => <View style={{
    height: 7,
    width: "100%",
    backgroundColor: 'transparent'
}} />


const EditBtn = ({ onPress }) => (
    <TouchableOpacity onPress={onPress}>
        <View >
            <Image style={styles.backBtn} source={require('../../assets/edit_icon.png')} />
        </View>
    </TouchableOpacity>
);

const LogoutBtn = ({ onPress }) => (
    <TouchableOpacity onPress={onPress}>
        <View >
            <Image style={styles.backBtn} source={require('../../assets/log_out_icon.png')} />
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
        height: 100,
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
        width: 40,
        height: 40
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



});

export default HomeScreen;

