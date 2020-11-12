import React, { useState } from 'react';
import { IconButton, Text, TextInput, View, StyleSheet, Button, Alert, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firebase from '../../src/database/firebase';
import AsyncStorage from '@react-native-community/async-storage';

const HomeScreen = () => {
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
                console.log("ITEM===>", value)
            // Setting the value in Text
        );
    };

    const addItem = () => {
        firebase.firestore()
        .collection('journallist')
        .add({
          title: 'Adas Lovelace',
          description: 'menushaasas',
          id:'1234sasas',
          date:'2020-02-20sss'
        })
        .then(() => {
          console.log('User added!');
        });
    }

    const getItems = () => {
        firebase.firestore()
        .collection('journallist')
        .get()
  .then(querySnapshot => {
    console.log('Total users: ', querySnapshot.size);

    querySnapshot.forEach(documentSnapshot => {
      console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
    });
  });
    }

    const navigateReg = () => {
        navigation.navigate("Register");
    }

    const CustomRow = ({ title, description, image_url }) => (
        <View style={styles.container}>
            <Image source={{ uri: image_url }} style={styles.photo} />
            <View style={styles.container_text}>
                <Text style={styles.title}>
                    {title}
                </Text>
                <Text style={styles.description}>
                    {description}
                </Text>
            </View>
    
        </View>
    );

    const CustomListview = ({ itemList }) => (
        <View style={styles.container}>
            <FlatList
                    data={itemList}
                    renderItem={({ item }) => <CustomRow
                        title={item.title}
                        description={item.description}
                        image_url={item.image_url}
                    />}
                />
    
        </View>
    );


    return (

        <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            style={{ flex: 1 }} >

            <View style={{ padding: 25, flex: 4 }}>
                <View style={{ flex: 3 }}>
                    <View style={styles.spacing} />
                    <Text style={styles.textHeader}>
                        My journal</Text>

                        <Button title="add user" onPress={addItem}></Button>
                        <Button title="get user" onPress={getItems}></Button>
                </View>
                <View style={{ flex: 1 }}></View>
            </View>
        </KeyboardAvoidingView>
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
        marginLeft:16,
        marginRight:16,
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

