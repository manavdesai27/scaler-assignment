import React, { useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { TextField } from '@mui/material';
import Toast from '../toast/Toast';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function TransitionsModal({ modalOpen, setModalOpen, room, checkInDate, checkOutDate }) {
    const { roomId, price } = room;
    const [toastOpen, setToastOpen] = React.useState(false);
    const [toastMessage, setToastMessage] = React.useState('');
    const [toastSeverity, setToastSeverity] = React.useState('success');
    const [email, setEmail] = useState('');

    const calculatePrice = (price) => {
        const hours = checkOutDate.diff(checkInDate, 'hours');
        return hours * price;
    }

    const handleClose = () => setModalOpen(false);

    const handleSubmit = (e) => {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/book/isEmpty/`, {
            params: {
                startDate: checkInDate.toISOString().split('T')[0],
                endDate: checkOutDate.toISOString().split('T')[0],
                roomId: roomId
            }
        }).then((res) => {
            if (res.data.available === true) {
                axios.post(`${import.meta.env.VITE_BACKEND_URL}/book/`, {
                    userEmail: email,
                    checkIn: checkInDate.toISOString().split('T')[0],
                    checkOut: checkOutDate.toISOString().split('T')[0],
                    roomId: roomId,
                    price: calculatePrice(price)
                }).then((res) => {
                    console.log(res);
                    setModalOpen(false);
                    setToastMessage('Room booked successfully');
                    setToastSeverity('success');
                    setToastOpen(true);
                    window.location.reload();
                }).catch(err => {
                    console.log(err);
                    setToastMessage(`Room booking failed: ${err.message}`);
                    setToastSeverity('error');
                    setToastOpen(true);
                })
            } else {
                // alert('Room is not available');
                setModalOpen(false);
                setToastMessage('Room is not available');
                setToastSeverity('warning');
                setToastOpen(true);
            }
        }).catch(err => {
            console.log(err);
            setToastMessage(`Room booking failed: ${err.message}`);
            setToastSeverity('error');
            setToastOpen(true);
        }).finally(() => {
            handleClose();
        });
    }

    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={modalOpen}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={modalOpen}>
                    <Box sx={style}>
                        <Typography id="transition-modal-title" variant="h6" component="h2" align="center" gutterBottom>
                            Room {roomId}
                        </Typography>
                        <Typography id="transition-modal-description" sx={{ mt: 2 }} align="center">
                            Price: ${calculatePrice(price)}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2 }}>
                            <TextField
                                type='email'
                                label="Email"
                                variant="outlined"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                            <Box sx={{
                                display: "flex",
                                flexDirection: 'row',
                                justifyContent: 'space-evenly',
                                width: '100%',
                            }}>
                                <Button variant="contained" onClick={handleSubmit} sx={{ mr: 2 }}>Book</Button>
                                <Button variant="outlined" onClick={handleClose}>Cancel</Button>
                            </Box>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
            {toastOpen && <Toast open={toastOpen} setOpen={setToastOpen} message={toastMessage} severity={toastSeverity} />}
        </div>
    );
}