import React, {useState} from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Box } from '@mui/material';

const DatePickerComponent = ({checkInDate, checkOutDate, setCheckInDate, setCheckOutDate}) => {

    return (
        <Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                width: '100%',
            }}>
                <DatePicker disablePast value={checkInDate} onChange={(newValue) => setCheckInDate(newValue)} label="Check-In date" />
                <DatePicker disablePast minDate={checkInDate} value={checkOutDate} onChange={(newValue) => setCheckOutDate(newValue)} label="Check-Out date" />
            </Box>
        </Box>
        
    );
}

export default DatePickerComponent;