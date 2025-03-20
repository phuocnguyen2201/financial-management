import AsyncStorage from '@react-native-async-storage/async-storage';

  const formatDate = (dateString) => {
    const date = new Date(dateString); // Parse the ISO string into a Date object
  
    // Get individual components of the date
    const day = String(date.getDate()).padStart(2, '0'); // Pad with leading zero if single digit
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based, so +1
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0'); // Pad with leading zero if single digit
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Pad with leading zero if single digit
    
    // Return formatted date in dd/MM/yyyy hh:mm format
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };
  const getUserID = async () => {

    const user = await AsyncStorage.getItem('user');
    const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

    if(!user || user === null || user === undefined || guidRegex.test(user) === false){ 
      const newUser = await AsyncStorage.setItem('user', uuid.v4());
      user = newUser;
    }
    return await user;
  };

export { formatDate, getUserID };  