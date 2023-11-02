import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import DatePickerComponent from '../rooms/DatePicker';
import { TextField } from '@mui/material';
import dayjs from 'dayjs';
import axios from 'axios';
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

export default function TransitionsModal({ modalOpen, setModalOpen, booking }) {
    const [checkInDate, setCheckInDate] = React.useState(dayjs(new Date(booking.checkIn)));
    const [checkOutDate, setCheckOutDate] = React.useState(dayjs(new Date(booking.checkOut)));
    const [email, setEmail] = React.useState(booking.email);
    const [price, setPrice] = React.useState(booking.price);
    const [toastOpen, setToastOpen] = React.useState(false);
    const [toastMessage, setToastMessage] = React.useState('');
    const [toastSeverity, setToastSeverity] = React.useState('success');

    React.useEffect(() => {
        setCheckInDate(dayjs(new Date(booking.checkIn)));
        setCheckOutDate(dayjs(new Date(booking.checkOut)));
        setEmail(booking.email);
        setPrice(booking.price);
    }, [booking])

    const PRICE_PER_HR = booking.room.roomType.price;

    const calculatePrice = (checkInDate, checkOutDate, PRICE_PER_HR) => {
        const hours = checkOutDate.diff(checkInDate, 'hours');
        return hours * PRICE_PER_HR;
    }

    const handleClose = () => setModalOpen(false);

    const handleSubmit = () => {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/book/isEmpty/`, {
            params: {
                startDate: checkInDate.toISOString().split('T')[0],
                endDate: checkOutDate.toISOString().split('T')[0],
                roomId: booking.room.id
            }
        }).then((res) => {
            if (res.data.available === true) {
                axios.put(`${import.meta.env.VITE_BACKEND_URL}/book/${booking.id}`, {
                    email,
                    checkIn: checkInDate,
                    checkOut: checkOutDate,
                    price: calculatePrice(checkInDate, checkOutDate, PRICE_PER_HR)
                }).then((res) => {
                    console.log(res);
                    setModalOpen(false);
                    setToastMessage('Room edited successfully');
                    setToastSeverity('success');
                    setToastOpen(true);
                    window.location.reload();
                    axios.post(`${import.meta.env.VITE_BACKEND_URL}/email/`, {
                        to: email,
                        message: res
                    }).then((res) => {
                        console.log(res);
                    }).catch((error) => {
                        console.log(error);
                    })
                }).catch((err) => {
                    console.log(err);
                    setToastMessage(`Room editing failed: ${err.message}`);
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
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            handleClose();
        })

    };

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
                        <DatePickerComponent checkInDate={checkInDate} checkOutDate={checkOutDate} setCheckInDate={setCheckInDate} setCheckOutDate={setCheckOutDate} />
                        <TextField
                            label="Email"
                            variant="outlined"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Price"
                            variant="outlined"
                            value={calculatePrice(checkInDate, checkOutDate, PRICE_PER_HR)}
                            InputProps={{
                                readOnly: true,
                            }} disabled
                            fullWidth
                            margin="normal"
                        />
                        <Box sx={{
                            display: "flex",
                            flexDirection: 'row',
                            justifyContent: 'space-evenly',
                            width: '100%',
                        }}>
                            <Button variant="contained" onClick={handleSubmit} sx={{ mr: 2 }}>Update</Button>
                            <Button variant="outlined" onClick={handleClose}>Cancel</Button>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
            {toastOpen && <Toast open={toastOpen} setOpen={setToastOpen} message={toastMessage} severity={toastSeverity} />}
        </div>
    );
}
