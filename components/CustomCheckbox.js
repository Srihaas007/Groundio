import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CustomCheckbox = ({ value, onValueChange }) => {
  return (
    <TouchableOpacity onPress={() => onValueChange(!value)} style={styles.checkboxContainer}>
      <Icon
        name={value ? 'check-box' : 'check-box-outline-blank'}
        size={24}
        color={value ? '#1e90ff' : '#ccc'}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
});

export default CustomCheckbox;
