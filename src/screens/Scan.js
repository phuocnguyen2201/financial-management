import { StatusBar } from 'expo-status-bar';
import React, { use, useRef, useState, useEffect } from "react";
import { Button, Text, View, Image, Pressable, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import styles from '../styles/Global-Style';
import uploadImage from '../services/connection';
import { ref, set } from 'firebase/database';
import { db } from '../services/firebase_config';
import uuid from 'react-native-uuid';
import { getUserID } from '../services/utility';
import Ionicons from '@expo/vector-icons/Ionicons';
import LoadingModal from '../components/LoadingModal';
import Toast from 'react-native-toast-message';

export default function Scan() {
  const [permission, requestPermission] = useCameraPermissions();
  const [flash, setFlash] = useState('off');
  const [flashIcon, setFlashIcon] = useState('flash-off');
  const [id, setId] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const openCamera = () => {
    
    if(!permission)
      return <View />;

    if(!permission.granted){
      return (
        <View style={styles.container}>
          <Text style={styles.message}>We need your permission to show the camera</Text>
          <Button onPress={requestPermission} title="Grant Permission" />
        </View>
      );
    }
    
  }

  //Generate a unique user id for each devices.
  const verifyUniqueUser = async () => {
      setId(await getUserID());
  }

  const camera = useRef(null);
  const takePhoto = async () => {
    setLoading(true);
    if(camera) {
      const photo = await camera.current.takePictureAsync({base64: true});

      uploadImage(photo.base64)
        .then(response => response.json())
        .then(data => {
          if(data.result === 'success'){
            const components    = data.data.components;

            const total_amount  = components.financial.total_amount;
            const currency      = components.financial.currency;
            const date          = components.financial.document_date;
            const merchant      = components.financial.merchant.brand_name;
            const items         = components.line_items.line_item_sections[0].items.map((item) => ({
                  name: item.title,
                  quantity: item.quantity,
                  price: item.amount_each,
            }));

            if (  components.financial.total_amount !== null && 
                  components.financial.merchant.brand_name !== null) {

                    set(ref(db, '/receipts/'+id+'/'+uuid.v4()), {
                        total_amount: total_amount,
                        currency: currency,
                        date: date,
                        merchant: merchant,
                        items: items
                    });
                    setSuccess(true);
            }
            else
              setSuccess(false);
          }
        }
        )
        .catch(error => console.error("Error from the uploadImage function: "+error))
        .finally(() => 
        {
          setLoading(false)
        }
      );

    }
  }

  const toggleFlash = () => {
    flash === 'off' ? setFlash('on') : setFlash('off');
    flashIcon === 'flash-off' ? setFlashIcon('flash') : setFlashIcon('flash-off');
    console.log(flash);
    
  }

  const notificationMessage = () => {
    if (success === true) {
      Toast.show({
        type: 'success',
        text1: 'Success!',
        text2: 'Operation completed successfully. 🎉',
      });
    } else if (success === false) {
      Toast.show({
        type: 'error',
        text1: 'Error!',
        text2: 'Something went wrong. ❌',
      });
    }
  };
  
  useEffect(() => {
    verifyUniqueUser();
    openCamera();
  }, []);

  useEffect(() => {
    notificationMessage();
  }, [success]);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.titleContainer}>
        <Text style={styles.textmd}>Adjust the document in the frame</Text>
      </View>

      <CameraView flash={flash} style={{ flex: 3, borderRadius:15, margin:5 }} ref={camera} />
      
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