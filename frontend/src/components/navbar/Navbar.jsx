import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import RoomDashboard from '../rooms/dashboard/Dashboard';
import BookingDashboard from '../bookings/dashboard/Dashboard';

const Navbar = () => {
    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        event.preventDefault();
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList centered onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label="Book a room" value="1" />
                        <Tab label="Bookings" value="2" />
                    </TabList>
                </Box>
                <TabPanel value="1"><RoomDashboard /></TabPanel>
                <TabPanel value="2"><BookingDashboard /></TabPanel>
            </TabContext>
        </Box>
    );
}

export default Navbar;
