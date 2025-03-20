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
    return await AsyncStorage.getItem('user');
  };
export { formatDate, getUserID };  