import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function Loader() {
    return (
        <Box sx={{ 
            display: 'flex',
            flexDirection: "column",
            alignItems: "center",
            marginTop: "4rem"
        }}>
            <CircularProgress />
        </Box>
    );
}