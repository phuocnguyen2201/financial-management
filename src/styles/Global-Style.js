
import { StyleSheet } from 'react-native';

const spacing = {
  xs: 5,
  sm: 10,
  md: 15,
  lg: 20,
  xl: 30,
}
const fontSizes = {
  sm: 12,
  md: 18,
  lg: 28,
  xl: 35,
}
const colors = {
  primary: '#f7287b',
  secondary: '#c717fc',
  lightgreen: '#6fcaba',
  accent: '#f7287b',
  white: '#fff',
  black: '#000',
  grey: '#ccc',
  lightGrey: '#eee',
  darkGrey: '#444',
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row:{
    flexDirection: 'row',
    backgroundColor: colors.white,
    justifyContent: 'space-around',
    marginBottom: 10,
    padding: 10,
  },
  button:{
    backgroundColor: colors.grey,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    margin: 5,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.grey,
    },
    pressable:({ pressed }) => [
        styles.button,
        { backgroundColor: pressed ? colors.white : colors.grey },
    ],
    viewPosition:{
      alignItems:'flex-end', 
      justifyContent:'flex-end', 
      flex: 1,
    },
    text:{
      fontSize: fontSizes.md,
      fontWeight: 'bold',
      color: colors.black,
      textAlign: 'left',
    },
    textmd:{
      fontSize: fontSizes.md,
      color: colors.black,
      textAlign: 'left',
    },

    rightSide: {
      alignItems: "flex-end", // Align text to the right
    },
    dateText: {
      fontSize: 14,
      color: "#555", // Lighter color for date
    },
    amountText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#000", // Dark color for total amount
      marginTop: 5, // Space between date and amount
    },
    chartContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fff",
      padding: 20,
    },
    
    scanButton: {
      backgroundColor: colors.lightgreen,
      padding: spacing.md,
      fontSize: fontSizes.lg,
      color: colors.white,
      borderRadius: 10,
      margin: spacing.md,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.lightgreen,
    },
    scanText:{
      fontSize: fontSizes.xl,
      fontWeight: 'bold',
      textAlign: 'left',
    },
    scanPressable:({ pressed }) => [
      styles.scanButton,
      { backgroundColor: pressed ? colors.lightGrey : colors.lightgreen},
    ],
    flashButton: {
      padding: spacing.md,
      fontSize: fontSizes.lg,
      color: colors.white,
      borderRadius: 60,
      margin: spacing.md,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.lightgreen,
    },
    flashPressable:({ pressed }) => [
      styles.flashButton,
      { backgroundColor: pressed ? colors.lightGrey : colors.white},
    ],
    modalBackground: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      backgroundColor: '#333',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
    },
    loadingText: {
      color: '#fff',
      marginTop: 10,
      fontSize: 16,
    },
    titleContainer:{
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
    },
    itemText: {
      fontSize: fontSizes.md,
      color: "#000",
      marginTop: 5,
      fontStyle: 'italic',
    },
    itemContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'flex-end',
      paddingVertical: 5,
      paddingHorizontal: 10,
    },
    head: { height: 40, backgroundColor: '#f1f8ff', fontWeight: '700' },
    textRow: { textAlign: 'right', margin: 6 },
    table:{
      borderWidth: 0, borderColor: '#c8e1ff',
      margin: 10,
    }
    
});


export default styles;