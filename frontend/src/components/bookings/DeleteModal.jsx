import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import dayjs from 'dayjs';
import axios from 'axios';
import Toast from '../toast/Toast';
import { Typography } from '@mui/material';

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

export default function DeleteModal({ modalOpen, setModalOpen, booking }) {
    const [price, setPrice] = React.useState(booking.price);
    const [checkInDate, setCheckInDate] = React.useState(dayjs(new Date(booking.checkIn)));
    const [id, setId] = React.useState(booking.id);
    const [toastOpen, setToastOpen] = React.useState(false);
    const [toastMessage, setToastMessage] = React.useState('');
    const [toastSeverity, setToastSeverity] = React.useState('success');

    React.useEffect(() => {
        setPrice(booking.price);
        setCheckInDate(dayjs(new Date(booking.checkIn)));
        setId(booking.id);
    }, [booking])

    const calculateRefund = () => {
        const hours = checkInDate.diff(dayjs(), "hours");
        let refund = 0;
        if (hours > 48) refund = price;
        else if (hours > 24) refund = price * 0.5;
        else refund = 0;
        return refund;
    }

    const handleClose = () => setModalOpen(false);

    const handleSubmit = () => {
        if (checkInDate.diff(dayjs(), "hours") <= 0) {
            setToastMessage('Cannot delete past bookings')
            setToastSeverity('warning');
            setToastOpen(true);
            setModalOpen(false);
            return;
        }
        axios.delete(`${import.meta.env.VITE_BACKEND_URL}/book/${id}`)
            .then((res) => {
                window.location.reload();
                setToastMessage('Room deleted successfully');
                setToastSeverity('success');
                setToastOpen(true);
            }).catch((err) => {
                setToastMessage(`Room deleting failed: ${err.message}`);
                setToastSeverity('error');
                setToastOpen(true);
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
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column"
                        }}>
                            <Typography align='center' variant='h5' component="h1">Price to be refunded:</Typography>
                            <Typography align='center' margin={4} variant='h5' component="h2">${calculateRefund()}</Typography>
                            <Box sx={{
                                display: "flex",
                                flexDirection: 'row',
                                justifyContent: 'space-evenly',
                                width: '100%',
                            }}>
                                <Button variant="contained" size='small' onClick={handleSubmit} sx={{ mr: 2 }}>Confirm</Button>
                                <Button variant="outlined" size='small' onClick={handleClose}>Cancel</Button>
                            </Box>
                        </Box>

                    </Box>
                </Fade>
            </Modal>
            {toastOpen && <Toast open={toastOpen} setOpen={setToastOpen} message={toastMessage} severity={toastSeverity} />}
        </div>
    );
}
