import { StatusBar } from 'expo-status-bar';
import React, { use, useRef, useState, useEffect } from "react";
import { Button, Text, View, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import styles from '../styles/Global-Style';
import uploadImage from '../services/connection';
import { ref, set } from 'firebase/database';
import { db } from '../services/firebase_config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

export default function Scan() {
  const [photoBase64, setPhotoBase64] = useState('');
  const [permission, requestPermission] = useCameraPermissions();
  const [data, setData] = useState({});
  const [id, setId] = useState('');

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
    const user = await AsyncStorage.getItem('user');
    if(!user){
      const newUser = await AsyncStorage.setItem('user', uuid.v4());
      setId(newUser);
    }
    else
      setId(user);
  }

  const camera = useRef(null);
  const takePhoto = async () => {
    if(camera) {
      const photo = await camera.current.takePictureAsync({base64: true});

      setPhotoBase64(photo.base64);

      uploadImage(photo.base64)
        .then(response => response.json())
        .then(data => {
          if(data.result === 'success'){
            const components    = data.data.components;
            console.log(components);

            const total_amount  = components.financial.total_amount;
            const currency      = components.financial.currency;
            const date          = components.financial.document_date;
            const merchant      = components.financial.merchant.brand_name;
            const items         = components.line_items.line_item_sections[0].items.map((item) => ({
                  name: item.title,
                  quantity: item.quantity,
                  price: item.amount_each,
            }));

            set(ref(db, '/receipts/'+id+'/'+uuid.v4()), {
                total_amount: total_amount,
                currency: currency,
                date: date,
                merchant: merchant,
                items: items
            });

          }
        }
        )
        .catch(error => console.error("Error from the uploadImage function: "+error));

    }
  }

  useEffect(() => {
    verifyUniqueUser();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <CameraView style={{ flex: 1, minWidth: "100%" }} ref={camera} />
      <Button title="Take Photo" onPress={takePhoto} />
      <View style={{ flex: 1 }}>
        { photoBase64 ? (
          <>
            <Image style={{ flex: 1 }} source={{ uri: `data:image/jpg;base64,${photoBase64}` }} />
          </>
        ) : (
          <Text>No photo taken yet.</Text>
        )}      
      </View>
    </View>
  );  
}