import React, { useEffect, useState } from 'react'
import DatePicker from '../DatePicker'
import dayjs from 'dayjs';
import axios from 'axios';
import { Box } from '@mui/material';
import { Grid } from '@mui/material';
import TransitionsModal from '../Modal';


const RoomDashboard = () => {
    const [checkInDate, setCheckInDate] = useState(dayjs(new Date()));
    const [checkOutDate, setCheckOutDate] = useState(dayjs(new Date()).add(1, 'day'));
    const [rooms, setRooms] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [room, setRoom] = useState({});

    const handleClick = (room) => {
        setRoom({
            roomId: room.id,
            price: room.roomType.price
        })
        setModalOpen(true);
    }

    useEffect(() => {
        if (checkInDate >= checkOutDate) {
            return;
        }

        axios.get('http://localhost:8080/book/available/',
            {
                params: {
                    startDate: checkInDate,
                    endDate: checkOutDate
                }
            }
        ).then((res) => {
            setRooms(res.data)
        }).catch(err => {
            console.log(err)
        })
    }, [checkInDate, checkOutDate])

    return (
        <Box>
            <DatePicker checkInDate={checkInDate} checkOutDate={checkOutDate} setCheckInDate={setCheckInDate} setCheckOutDate={setCheckOutDate} />

            <Box marginTop={2}>
                {rooms.length === 0 ? 
                    <h1>No rooms available</h1> :
                    <Grid container spacing={2}>
                        {rooms.map((room, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Box sx={{ border: '1px solid grey', borderRadius: '5px', p: 2, '&:hover': {
                                    backgroundColor: 'grey',
                                    color: 'white',
                                    cursor: 'pointer'
                                } }} onClick = {() => handleClick(room)}>
                                    <h3>Room Number: {room.roomType.name}:{room.roomNumber}</h3>
                                    <p>Price: $ {room.roomType.price}/hr</p>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                }
                {
                    <TransitionsModal checkInDate={checkInDate} checkOutDate={checkOutDate} modalOpen={modalOpen} room = {room} setModalOpen={setModalOpen} />
                }
            </Box>

        </Box>
    )
}

export default RoomDashboard;