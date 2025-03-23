import { StyleSheet, Text, View, Pressable } from 'react-native';
import styles from '../styles/Global-Style';
import { ref, onValue } from 'firebase/database';
import { db } from '../services/firebase_config';
import { use, useEffect, useState } from 'react';
import { formatDate, getUserID } from '../services/utility';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

export default function Extract() {
  
  const [data, setData] = useState([{}]);
  const [Id, setId] = useState('');
  const [expanded, setExpanded] = useState(null);

  const handlePress = (index) => setExpanded(expanded === index ? null : index);
  const tableHead = ['Name', 'Quantity', 'Price'];
  const retrieveData = () => {
    onValue(ref(db, '/receipts/'+Id), (snapshot) => {
        const rawData = snapshot.val();
        if(rawData) {
          setData(Object.values(rawData));
        }
        else
          setData(null);
    });
  }
  const fetchUserId = async () => {
    const userId = await getUserID();
    setId(userId);
  };

  useEffect(() => {
    fetchUserId();
  }, []);

  useEffect(() => {
    if(Id)
      retrieveData();
  }, [Id]);

  return (
    <View>
      {data != null && data && data.length > 0 ?  
        
        data.map((item, index) => {
            return (
            <View key={`row-${index}`} style={{ marginVertical: 10 }}>
              <Pressable key={`item-${item.date}-${index}`} style={styles.pressable} onPress={() => handlePress(`row-${index}`)}>
                <Text style={styles.text}>{item.merchant}</Text>

                <View style={styles.rightSide}>                
                  <Text style={styles.amountText}>{item.total_amount +' '+item.currency}</Text>
                  <Text style={styles.dateText}>{formatDate('dd/MM/yyyy hh:mm',item.date)}</Text>
                  <Text style={styles.amountText}>{item.category}</Text>
                </View>

              </Pressable>
             {  expanded == `row-${index}` && 
                  <View>
                    <Table style={styles.table}>
                      <Row data={tableHead} style={styles.head} textStyle={styles.text}/>
                      <Rows data={item.items.map((item, index) => [
                        item.name,
                        item.quantity,
                        item.price
                      ])} textStyle={styles.text}/>
                    </Table>

                  </View>
              }
            </View>
            );
        })
       : <View style={styles.container}>
          <Pressable style={styles.pressable}>
            <Text style={styles.text}>Wow ~ such empty</Text>
          </Pressable>
          </View>
          }
    </View>
  );
}