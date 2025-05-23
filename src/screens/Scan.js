import { StatusBar } from 'expo-status-bar';
import React, { use, useRef, useState, useEffect } from "react";
import { Button, Text, View, Image, Pressable, Alert } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import styles from '../styles/Global-Style';
import { uploadImage, categoryItem} from '../services/connection';
import { formatDate, getUserID } from '../services/utility';
import Ionicons from '@expo/vector-icons/Ionicons';
import LoadingModal from '../components/LoadingModal';
import Toast from 'react-native-toast-message';
import { set, ref } from 'firebase/database';
import { db } from '../services/firebase_config';
import uuid from 'react-native-uuid';
import { Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Scan({ navigation}) {

  const [permission, requestPermission] = useCameraPermissions();
  const [flash, setFlash] = useState('off');
  const [flashIcon, setFlashIcon] = useState('flash-off');
  const [id, setId] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [fail, setFail] = useState(null);
  const camera = useRef(null);

  const width = Dimensions.get('window').width;
  const screenWidth = width - 16;

  const openCamera = () => {

    if (!permission || !permission.granted) {
      // Camera permissions are still loading or not granted yet.
      return (
        <View style={styles.container}>
          <Text style={styles.message}>We need your permission to show the camera</Text>
          <Button onPress={requestPermission} title="grant permission" />
        </View>
      );
    }
    
  }

  //Generate a unique user id for each devices.
  const verifyUniqueUser = async () => {
     setId(await getUserID());
  }

  
  const takePhoto = async () => {
    setLoading(true);
    if(camera) {
      const photo = await camera.current.takePictureAsync({base64: true});
      
     
      uploadImage(photo.base64)
        .then(response => response.json())
        .then(data => {
          if(data.result === 'success'){
            const components    = data.data.components;

            const total_amount  = components.financial?.total_amount??0;
            const currency      = components.financial.currency;
            const date          = components.financial?.document_date??formatDate("",new Date("dd/MM/yyyy hh:mm"));
            const merchant      = components.financial.merchant?.brand_name??'Unknown';
            const items         = components.line_items.line_item_sections[0].items.map((item) => ({
                  name: item.title,
                  quantity: item.quantity,
                  price: item.amount_each,
            }));

            categoryItemAndUpload(photo, { total_amount: total_amount, currency: currency, date: date, merchant: merchant, items: items });
          }
        }
        )
        .catch(error => console.error("Error from the uploadImage function: "+error))

    }
  }

  const categoryItemAndUpload = async (photo, object) => {

    categoryItem(photo.base64)
    .then(response => response.json())
    .then(data => {
      if(data.result === 'success'){
        const category = data.data.components.prompt_builder;

        if (object != null && object.total_amount !== null && 
          object.merchant !== null && object.merchant !== 'Unknown') {
            object.category = category?.category??'Others';

            set(ref(db, '/receipts/'+id+'/'+uuid.v4()), object);
            setSuccess(true);
        }
    else
      setFail(true);
        
      }
    })
    .catch(error => console.error("Error from the categoryItem function: "+error))
    .finally(() => 
      {
        setLoading(false);
      });
  }

  const toggleFlash = () => {
    flash === 'off' ? setFlash('on') : setFlash('off');
    flashIcon === 'flash-off' ? setFlashIcon('flash') : setFlashIcon('flash-off');
  }

  const notificationMessage = () => {
    if (success === true) {
      Toast.show({
        type: 'success',
        text1: 'Success!',
        text2: 'Operation completed successfully. 🎉',
      });
      setSuccess(false);
    } else if (fail === true) {
      Toast.show({
        type: 'error',
        text1: 'Error!',
        text2: 'Something went wrong. ❌',
      });
      setFail(false);
    }
  };
  
  useEffect(() => {
    verifyUniqueUser();
    openCamera();
  }, []);

  useEffect(() => {
    notificationMessage();
  }, [success]);

  //Reason camera is not working on ios is because of the permission cannot be re-check, or it is already in-use of other apps but not yet un-mount.
  useEffect(() => {
    openCamera();
  }, [permission]);


  return (
    <View style={{ flex: 1 , backgroundColor: '#fff'}}>
      <View style={styles.titleContainer}>
        <Text style={styles.textmd}>Adjust the document in the frame</Text>
      </View>
      <SafeAreaView style={{flex:4}}>
        <CameraView 
        flash={
          flash
        }
        style={{ flex: 1, borderRadius:15, margin:5, minWidth: screenWidth }} 
        ref={camera} />
      </SafeAreaView>
      
      
      <Toast />
      <LoadingModal visible={loading}/>

      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
        <View style={{flex:1}}>
          <Pressable style={styles.flashPressable} onPress={toggleFlash}><Ionicons name={flashIcon} size={28}/></Pressable>
          </View>

        <View style={{flex:3}}>
          <Pressable style={styles.scanPressable} onPress={takePhoto}><Text style={styles.scanText}>Scan</Text></Pressable>
          </View>
          
      </View>
    </View>
  );
}