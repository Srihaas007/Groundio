import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Appearance } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DatePickerNative = ({ selectedDate, onDateChange }) => {
  const [show, setShow] = useState(false);

  const handleChange = (event, date) => {
    setShow(false);
    if (date) {
      onDateChange(date);
    }
  };

  const showDatePicker = () => {
    setShow(true);
  };

  const isDarkMode = Appearance.getColorScheme() === 'dark';

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.input} onPress={showDatePicker}>
        <Text style={styles.text}>
          {selectedDate ? selectedDate.toDateString() : 'Select Date'}
        </Text>
      </TouchableOpacity>
      {show && Platform.OS === 'ios' && (
        <View style={styles.dateTimePickerContainer}>
          <DateTimePicker
            value={selectedDate || new Date()}
            mode="date"
            display="inline"
            onChange={handleChange}
            maximumDate={new Date()}
            textColor="#666" // Sets text color in the picker to #666
          />
        </View>
      )}
      {show && Platform.OS !== 'ios' && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display="default"
          onChange={handleChange}
          maximumDate={new Date()}
          textColor={isDarkMode ? '#fff' : '#666'}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    justifyContent: 'center',
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  text: {
    color: '#333',
    fontSize: 16,
  },
  dateTimePickerContainer: {
    backgroundColor: '#666',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    borderColor: '#666', // Dark border around the picker for better contrast
    borderWidth: 1,
  },
});

export default DatePickerNative;
