import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../components/DatePickerWeb.css'; // Ensure this CSS file exists and is properly imported

const DatePickerWeb = ({ selectedDate, onDateChange }) => {
  return (
    <div className="datepicker-container">
      <DatePicker
        selected={selectedDate}
        onChange={onDateChange}
        dateFormat="yyyy/MM/dd"
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        placeholderText="Select Date"
        maxDate={new Date()}
      />
    </div>
  );
};

export default DatePickerWeb;
