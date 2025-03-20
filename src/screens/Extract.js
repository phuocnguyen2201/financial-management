import { StyleSheet, Text, View, Pressable } from 'react-native';
import styles from '../styles/Global-Style';
import { ref, onValue, set } from 'firebase/database';
import { db } from '../services/firebase_config';
import { use, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatDate } from '../services/utility';

export default function Extract() {
  const [data, setData] = useState([{}]);
  const [Id, setId] = useState('');
  const [expanded, setExpanded] = useState(true);

  const handlePress = () => setExpanded(!expanded);
  const getUserID = async () => {
    const user = await AsyncStorage.getItem('user');
    setId(user);
  };

  const retrieveData = () => {
    if(!Id) return;
    onValue(ref(db, '/receipts/'+Id), (snapshot) => {
        const data = snapshot.val();
        if(data) {
          setData(Object.values(data));
        }
    });
  }

  useEffect(() => {
    getUserID();

  }, []);

  useEffect(() => {
    if(Id)
      retrieveData();
  }, [Id]);

  return (
    <View style={styles.container}>
      <Text>This is Extracting screen!</Text>
      {data!=null&& data && data.length > 0 ?  
       
        data.map((item, index) => {
            return (
            <View key={`row-${index}`} style={{ marginVertical: 10 }}>
              <Pressable key={`item-${item}`} style={styles.pressable} onPress={handlePress}>
                <Text style={styles.text}>{item.merchant}</Text>

                <View style={styles.rightSide}>                
                  <Text style={styles.amountText}>{item.total_amount +' '+item.currency}</Text>
                  <Text style={styles.dateText}>{formatDate(item.date)}</Text>
                </View>

              </Pressable>
            </View>
            );
        })
       : <Text>There are no receipts</Text>}
    </View>
  );
}