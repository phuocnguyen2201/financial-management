import { StyleSheet, Text, View, ScrollView, Pressable, OptionButton  } from 'react-native';
import PieChart from 'react-native-pie-chart'
import styles from '../styles/Global-Style';
import { ref, onValue, set } from 'firebase/database';
import { db } from '../services/firebase_config';
import { use, useEffect, useState } from 'react';
import { getUserID, randomColor, fixString, formatDate } from '../services/utility';
import { BarChart, ContributionGraph } from "react-native-chart-kit";
import RNPickerSelect from "react-native-picker-select";

export default function Report() {

  const [data, setData] = useState([]);
  const [Id, setId] = useState('');
  const [Series, setSeries] = useState([]);
  const [Percentage, setPercentage] = useState([]);
  const [CommitsData, setCommitsData] = useState([{}]);
  const [selectedValue, setSelectedValue] = useState('30');
  const widthAndHeight = 250;

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

  const chartConfig = {
    backgroundGradientFrom: "#f3f3f3",
    backgroundGradientTo: "#d3d3d3",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Text & grid color
    strokeWidth: 2, // Optional, default is 3
    barPercentage: 0.5, // Optional, adjusts bar width
    decimalPlaces: 0, // No decimals in values
  };

  const dataByMerchant = () => {

    if(data) {
      // Reset the series, prevent duplicate data
      setSeries([]);

      data.forEach((item) => {
        setSeries(prevSeries => [
          ...prevSeries, 
          { value: item.total_amount, color: randomColor(), label: { text: fixString(item.merchant), fontSize: 22, fontStyle: 'italic', outline: 'white' } }
        ]);
      });
    }
  };

  const dataByPercentage = () => {
    let total = 0;
    // Reset the series, prevent duplicate data
    setPercentage([]);

    data.forEach((item) => {
      total += item.total_amount;
    });

    data.forEach((item) => {
    
      const percentage = ((item.total_amount / total) * 100).toFixed(1) + '%';
      setPercentage(prevPercentage => [
        ...prevPercentage, 
        { value: item.total_amount, color: randomColor(), label: { text: percentage, fontSize: 22, fontStyle: 'italic', outline: 'white' } }
      ]);
    });
  };

  const dataByCategory = () => {
    let total = 0;
    // Reset the series, prevent duplicate data
    setSeries([]);

    data.forEach((item) => {
      total += item.total_amount;
    });

    data.forEach((item) => {
    
      const percentage = ((item.total_amount / total) * 100).toFixed(1) + '%';
      setSeries(prevSeries => [
        ...prevSeries, 
        { value: item.total_amount, color: randomColor(), label: { text: percentage, fontSize: 22, fontStyle: 'italic', outline: 'white' } }
      ]);
    });
  };

  const dataByPurchaseDate = () => {

    setCommitsData([]);

    data.forEach((item) => {
      setCommitsData(prevCommitsData => [
        ...prevCommitsData, 
        { date: formatDate('yyyy-MM-dd', item.date), count: Object.keys(item.items).length }
      ]);

    });
  };


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
      dataByPercentage();
      dataByMerchant();
      dataByPurchaseDate();
    }
  }
  , [data]);

  useEffect(() => {

  }, [selectedValue]);

  return (
    <ScrollView style={{ flex: 1 }}>
      { 
        data != null && data && data.length > 0 && Series.some(item => item.value > 0) ?
        <View style={styles.chartContainer}>
          <View style={styles.row}> 
            <Text style={styles.title}>By Merchant</Text>
            <PieChart widthAndHeight={widthAndHeight} series={Series} />
          </View>
        
          <View style={styles.row}>
            <PieChart widthAndHeight={widthAndHeight} series={Percentage} cover={0.45} />
            <Text style={styles.title}>By Percentage</Text>
          </View>
          
        </View> 
        : 
        <View style={styles.chartContainer}>
          <Pressable style={styles.pressable}>
            <Text style={styles.text}>Wow ~ such empty</Text>
          </Pressable>
        </View>
      }
      <View style={styles.container}>
        <Text style={styles.title}>Purchase dates</Text>
        <RNPickerSelect
          onValueChange={(value) => setSelectedValue(value)}
          items={[
            { label: "1 month", value: "30" },
            { label: "3 months", value: "105" },
          ]}
          placeholder={{ label: "Select a period...", value: null }}
        />
      </View>
      
      
      <ContributionGraph
        values={CommitsData}
        endDate={new Date().toISOString().split('T')[0]}
        numDays={selectedValue}
        width={'100%'}
        height={220}
        chartConfig={chartConfig}
      />
    </ScrollView>
      
  );
}