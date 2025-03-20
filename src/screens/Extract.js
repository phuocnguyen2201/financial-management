import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import styles from '../styles/Global-Style';
import { DataTable, List } from 'react-native-paper';
import { ref, onValue, set } from 'firebase/database';
import { db } from '../services/firebase_config';
import { use, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';



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

    onValue(ref(db, '/receipts/'+Id), (snapshot) => {
        const data = snapshot.val();
        if(data) {
          setData(Object.values(data));
          
        }
    });
  }

  useEffect(() => {
    getUserID();
    retrieveData();

  }, []);
  return (
    <View>
      <Text>This is Extracting screen!</Text>
      {data && data.length > 0 ?  
      <List.Section title="Accordions">
        {data.map((item) => {
          return (
            <List.Accordion
              title={item.merchant+" - "+item.total_amount+" "+item.currency}
              left={props => <List.Icon {...props} icon="folder" />}
              expanded={expanded}
              onPress={handlePress}>
                {item.items && item.items.length > 0 ? (
                  item.items.map((element, index) => (
                    <List.Item key={index} title={element.name +" - " + element.price} />
                  ))
                ) : (
                  <List.Item title="No items available" />
                )}
            </List.Accordion>
          )
        })}
    </List.Section> : <Text>There are no receipts</Text>}
     
    </View>
  );
}