import * as React from 'react';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';

const Toast =({open, setOpen, message, severity}) => {
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Box sx={{ width: 500 }}>
            <Snackbar
                autoHideDuration={6000}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={open}
                onClose={handleClose}
                >
                <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>{message}</Alert>
            </Snackbar>
        </Box>
    );
}

export default Toast;