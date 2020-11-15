import React, { useState, useEffect } from 'react';
import { IconButton, Text, TextInput, Dimensions, View,Modal, StyleSheet, ScrollView, Button, Alert, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firebase from '../../src/database/firebase';
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import * as Network from 'expo-network';



function CustomAlert(props) {

    const [modalVisible, setModalVisible] = useState(true);
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const [titleAlert, setTitleAlert] = useState(props.titleAlert);
    const [msgAlert, setMsgAlert] = useState(props.msgAlert);
    const [colorHeader, setColorHeader] = useState(props.colorHeader);

    
    const modalHeader=(
      <View style={{backgroundColor:colorHeader, borderTopLeftRadius:10,
        borderTopRightRadius:10}}>
        <Text style={styles.title}>{titleAlert}</Text>
        <View style={styles.divider}></View>
      </View>
    )
  
    const modalBody=(
      <View style={styles.modalBody}>
        <Text style={styles.bodyText}>{msgAlert}</Text>
      </View>
    )
  
    const modalFooter=(
      <View style={styles.modalFooter}>
        <View style={styles.divider}></View>
        <View style={{flexDirection:"row-reverse",margin:10}}>
          <TouchableOpacity style={{...styles.actions,backgroundColor:"#17202A"}} 
            onPress={() => {
              setModalVisible(false);
            }}>
            <Text style={styles.actionText}>Okay</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={{...styles.actions,backgroundColor:"#21ba45"}}>
            <Text style={styles.actionText}>Yes</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    )
  
    const modalContainer=(
      <View style={styles.modalContainer,{width:windowWidth/1.5}}>
        {modalHeader}
        {modalBody}
        {modalFooter}
      </View>
    )
  
    const modal = (
      <Modal
      backdropColor="transparent"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
        }}>
        <View style={styles.modal}>
          <View>
            {modalContainer}
          </View>
        </View>
      </Modal>
  )
  
    return (
      <View style={styles.container}>
        
        {modal}
  
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true);
          }}>
        </TouchableOpacity>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    modal:{
      backgroundColor:"#00000099",
      flex:1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalContainer:{
      backgroundColor:"#f9fafb",
      width:250,
      borderRadius:10
    },
    modalHeader:{
       

    },
    title:{
      fontWeight:"500",
      fontSize:20,
      padding:15,
      color:"#fff",
      textAlign:'center'
    },
    divider:{
      width:"100%",
      height:1,
      backgroundColor:"lightgray"
    },
    modalBody:{
      backgroundColor:"#fff",
      paddingVertical:20,
      paddingHorizontal:10
    },
    modalFooter:{
        backgroundColor:"#fff",
        borderBottomRightRadius:10,
        borderBottomLeftRadius:10
    },
    actions:{
      borderRadius:20,
      marginHorizontal:10,
      paddingVertical:10,
      paddingHorizontal:20
    },
    actionText:{
      color:"#fff"
    }
  });

  export default CustomAlert;
