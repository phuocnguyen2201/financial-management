import { StyleSheet, Text, View, ScrollView, Pressable  } from 'react-native';
import PieChart from 'react-native-pie-chart'
import styles from '../styles/Global-Style';
import { ref, onValue, set } from 'firebase/database';
import { db } from '../services/firebase_config';
import { use, useEffect, useState } from 'react';
import { getUserID, randomColor, fixString } from '../services/utility';

export default function Report() {

  const [data, setData] = useState([{}]);
  const [Id, setId] = useState('');
  const [Series, setSeries] = useState([]);

  const fetchUserId = async () => {
    const userId = await getUserID();
    setId(userId);
  };

  const retrieveData = () => {
    onValue(ref(db, '/receipts/'+Id), (snapshot) => {
      const data = snapshot.val();
      if(data) {
        setData(Object.values(data));
      }
      else
        setData(null);
  });
  }

  const analyzeDataByMerchant = () => {
    if(data) {
      data.forEach((item) => {
        setSeries(prevSeries => [
          ...prevSeries, 
          { value: item.total_amount, color: randomColor(), label: { text: fixString(item.merchant), fontSize: 22, fontStyle: 'italic', outline: 'white' } }
        ]);
      });
    }
  };

  const widthAndHeight = 250


  useEffect(() => {
    fetchUserId();
  }, []);

  useEffect(() => {
    if(Id){
      retrieveData();
    }
    
  }, [Id]);

  useEffect(() => {
    if(data) {
      analyzeDataByMerchant();
    }
  }, [data]);


  return (
    <ScrollView style={{ flex: 1 }}>
      { 
      data != null && data && data.length > 0 && Series.some(item => item.value > 0) ?
      <View style={styles.container}>
        <Text style={styles.title}>By Merchant</Text>
        <PieChart widthAndHeight={widthAndHeight} series={Series} />

        <Text style={styles.title}>Doughnut</Text>
        <PieChart widthAndHeight={widthAndHeight} series={Series} cover={0.45} />
      </View> 
      : 
      <View style={styles.container}>
        <Pressable style={styles.pressable}>
          <Text style={styles.text}>Wow ~ such empty</Text>
        </Pressable>
      </View>
    }
    </ScrollView>
  );
}