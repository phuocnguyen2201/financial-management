import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import PieChart from 'react-native-pie-chart'

export default function Report() {
  const widthAndHeight = 250

  const series = [
    { value: 10.80, color: '#fbd203' },
    { value: 5.55, color: '#ffb300', label:{ text: '%22', fontSize: 22, fontStyle: 'italic', outline: 'white' } },
  ]
  
  return (
    <ScrollView style={{ flex: 1 }}>
    <View style={styles.container}>
      <Text style={styles.title}>Basic</Text>
      <PieChart widthAndHeight={widthAndHeight} series={series} />

      <Text style={styles.title}>Doughnut</Text>
      <PieChart widthAndHeight={widthAndHeight} series={series} cover={0.45} />
    </View>
  </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    margin: 10,
  },
})
