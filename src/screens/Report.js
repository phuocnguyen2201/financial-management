import { StyleSheet, Text, View, ScrollView, Pressable, Dimensions  } from 'react-native';
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
  const [Category, setCategory] = useState({labels:[],datasets:[{}]});
  const [CommitsData, setCommitsData] = useState([{}]);
  const [selectedValue, setSelectedValue] = useState('30');
  const widthAndHeight = 180;

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

  const graphStyle = {
    marginVertical: 8,
    borderRadius: 16,
  };
  
  const width = Dimensions.get('window').width;
  const chartWidth = width - 20;

  const barChartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0.9,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.8,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Green bars
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // White labels
    strokeWidth: 2, // Line thickness
    barPercentage: 0.5, // Adjust bar width
    useShadowColorFromDataset: false, // Optional
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

    if(data){

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
    }
   
  };

  const dataByPurchaseDate = () => {

    setCommitsData([]);

    if(data)
    {
      data.forEach((item) => {
        setCommitsData(prevCommitsData => [
          ...prevCommitsData, 
          { date: formatDate('yyyy-MM-dd', item.date), count: Object.keys(item.items).length }
        ]);

      });
    }
  };

  const dataByCategory = () => {
    if(data){

      const formattedData = {
        labels: data.map(item => item.category),
        datasets: [{ data: data.map(item => item.total_amount) }]
      };
      console.log(formattedData);

      setCategory(formattedData);
    }
  }

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
      dataByCategory();
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
      <View style={{margin:10}}>
        <Text>By Categories</Text>
        <BarChart
          style={graphStyle}
          data={Category}
          width={chartWidth}
          height={280}
          yAxisLabel="$"
          chartConfig={barChartConfig}
          verticalLabelRotation={0}
        />
      </View>


      <View style={styles.container}>
        <Text style={{marginTop:10}}>Purchase dates</Text>
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