import React, { useState, useRef, useEffect } from 'react';
import { IconButton, FlatList, ActivityIndicator, Text, Animated, Keyboard, TextInput, ScrollView, View, StyleSheet, Button, Image, Alert, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firebase from '../../src/database/firebase';
import AsyncStorage from '@react-native-community/async-storage';

const HomeScreen = () => {
    const [title, setTitle] = useState('');
    const [description, setDesc] = useState('');
    const [isEditClick, setisEditClick] = useState(false);
    const [currentDate, setCurrentDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]); // Initial empty array of users
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
    useEffect(() => {
        var date = new Date().getDate(); //Current Date
        var month = new Date().getMonth(); //Current Month
        var year = new Date().getFullYear(); //Current Year

        setCurrentDate(
            year + ' ' + monthNames[month] + ' ' + date

        );

        if (loading) {
            return <ActivityIndicator />;
        }

        getUserFire();
       
    }, []);

    const getUserFire = () => {
        firebase.firestore()
        .collection('journallist')
        .get()
        .then(querySnapshot => {
            const users = [];
            querySnapshot.forEach(documentSnapshot => {
                users.push({
                    ...documentSnapshot.data(),
                    key: documentSnapshot.title,
                });
            });
            setUsers(users);
            setLoading(false);

        });

    }

    const navigation = useNavigation();

    const getValueFunction = () => {
        // Function to get the value from AsyncStorage
        var item = AsyncStorage.getItem('uid').then(
            (value) =>
                // AsyncStorage returns a promise
                // Adding a callback to get the value
                console.log("ITEM===>", value)
            // Setting the value in Text
        );
    };

    const addItem = () => {
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
                setisEditClick(false);
                getUserFire();
                Alert.alert(title, 'Successfully saved!');
            });
    }


    const navigateReg = () => {
        navigation.navigate("Register");
    }

    const addTojournalBtn = () => {
        isAddToJournalBtnClick = true;
    }

    const closeEdit = () => {
        setisEditClick(false);

    }
    const openEdit = () => {
        setisEditClick(true);

    }
   
    const getDataJournal = (item) =>{
        var title = item.title;
        var description = item.description;
        Alert.alert(title,description);
    }

    return (
        <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>

            <KeyboardAvoidingView
                behavior={Platform.OS == "ios" ? "padding" : "height"}
                style={{ flex: 1 }} >

                <View style={{ padding: 25, flex: 4 }}>
                    <View style={{ flex: 3 }}>
                        <View style={styles.spacing} />
                        <Text style={styles.textHeader}>
                            My journal</Text>
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
                                <TouchableOpacity style={styles.cellContainer} onPress={getDataJournal.bind(this,item)}>
                                <View  style={{ height: 60, flex: 1,padding:10 }}>
                                    <Text style={styles.cellText} >{item.title}</Text>
                                </View>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item) => console.log("HIIII",item.title)}
                            ItemSeparatorComponent = {ItemSeprator}

                        />

                    </View>
                    <View style={{ flex: 1 }}></View>
                </View>
            </KeyboardAvoidingView>
        </ScrollView>
    );

}
const getListViewItem = (item) => {  
    Alert.alert(item.title, 'Successfully saved!')
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
    backgroundColor:'transparent'
  }} />


const EditBtn = ({ onPress }) => (
    <TouchableOpacity onPress={onPress}>
        <View >
            <Image style={styles.backBtn} source={require('../../assets/edit_icon.png')} />
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
    button: {
        fontSize: 11,
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
    title: {
        fontSize: 16,
        color: '#000',
    },
    container_text: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: 12,
        justifyContent: 'center',
    },
    description: {
        fontSize: 11,
        fontStyle: 'italic',
    },
    photo: {
        height: 50,
        width: 50,
    },
});

export default HomeScreen;

