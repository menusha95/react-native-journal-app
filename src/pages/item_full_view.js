import React, { useState } from 'react';
import { Text, TextInput, View, StyleSheet, Dimensions, Button, ScrollView, Alert, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Asset } from 'expo-asset';
import firebase from '../database/firebase';
import Spinner from 'react-native-loading-spinner-overlay';



const ItemScreen = ({ route }) => {

    const navigation = useNavigation();
    var title = route.params.item.title;
    var description = route.params.item.description;
    var date = route.params.item.date;
    var key = route.params.item.key;
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const [loading, setLoading] = useState(false);

    const navigateHome = () => {
        navigation.navigate("Home");
    }


    const deleteItem = () => {
        setLoading(true)
        firebase.firestore()
            .collection('journallist')
            .doc(key)
            .delete()
            .then(() => {
                Alert.alert("Record deleted!", 'Record successfully deleted!');

                setTimeout(() => {
                    navigateHome()
                    setLoading(false)

                  }, 2000);
            });

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
                        <BackBtn onPress={navigateHome} />
                        <View style={styles.spacing} />
                        <View style={styles.spacing} />

                        <Text style={styles.cellTextDate}> {date}  </Text>
                        <View style={styles.spacing} />

                        <Text style={styles.cellText}> {title}  </Text>
                        <View style={styles.spacing} />

                        <Text style={styles.cellDesc}> {description}  </Text>
                        <View style={styles.spacing} />
                        <View style={styles.spacing} />

                        <DeleteBtn title="Delete record" onPress={deleteItem}></DeleteBtn>

                    </View>
                </View>

            </KeyboardAvoidingView>
        </ScrollView>
    );

}




const BackBtn = ({ onPress }) => (
    <TouchableOpacity onPress={onPress}>
        <View >
            <Image style={styles.backBtn} source={require('../../assets/back_click.png')} />
        </View>
    </TouchableOpacity>
);


const DeleteBtn = ({ onPress, title }) => (
    <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
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

export default ItemScreen;