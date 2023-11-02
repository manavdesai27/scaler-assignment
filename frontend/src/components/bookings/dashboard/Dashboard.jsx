import axios from 'axios';
import React, { useEffect, useState } from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import FormControl from '@mui/material/FormControl';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TransitionsModal from '../Modal';
import DeleteModal from '../DeleteModal';

const BookingDashboard = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [booking, setBooking] = useState({});
  const [id, setId] = useState(0);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [roomNum, setRoomNum] = useState('');
  const [roomType, setRoomType] = useState('');
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);

  const filterData = () => {
    let tempFilteredBookings = JSON.parse(JSON.stringify(bookings));
    if (roomNum) {
      tempFilteredBookings = tempFilteredBookings.filter(booking => booking.room.roomNumber == roomNum);
    }
    if (roomType) {
      tempFilteredBookings = tempFilteredBookings.filter(booking => booking.room.roomType.name == roomType);
    }
    if (checkInDate !== null) {
      const isoCheckInDate = checkInDate.toISOString().split('T')[0];
      tempFilteredBookings = tempFilteredBookings.filter(booking => booking.checkIn === isoCheckInDate);
    }
    if (checkOutDate !== null) {
      const isoCheckOutDate = checkOutDate.toISOString().split('T')[0];
      tempFilteredBookings = tempFilteredBookings.filter(booking => booking.checkOut === isoCheckOutDate);
    }
    setFilteredBookings(tempFilteredBookings);
  }

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/book/`).then((res) => {
      setBookings(res.data)
      setFilteredBookings(res.data);
    }).catch(err => {
      console.log(err);
    })

    axios.get(`${import.meta.env.VITE_BACKEND_URL}/rooms/types/`).then((res) => {
      setRoomTypes(res.data.map(el => el.name));
    })

    axios.get(`${import.meta.env.VITE_BACKEND_URL}/rooms/rooms/`).then((res) => {
      setRooms(res.data.map(el => el.roomNumber));
    })
  }, []);

  useEffect(() => {
    filterData();
  }, [roomNum, roomType, checkInDate, checkOutDate])

  const handleDelete = (booking) => {
    setId(1);
    setBooking(booking)
    setModalOpen(true);
  }

  const handleEdit = (booking) => {
    setId(2);
    setBooking(booking);
    setModalOpen(true);
  }

  return (
    <div>
      <div className='flex gap-4 m-auto w-fit flex-wrap my-4'>
        <Box sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
          flexWrap: "wrap"
        }}>
          <FormControl sx={{ m: 1, minWidth: 150, width: { xs: "100%", sm: "auto" } }}>
            <InputLabel>Room</InputLabel>
            <Select value={roomNum} label="Room" onChange={e => setRoomNum(e.target.value)}>
              <MenuItem value={''}>All</MenuItem>
              {
                rooms.map((room, index) => {
                  return (
                    <MenuItem key={index} value={room}>{room}</MenuItem>
                  )
                })
              }
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 150, width: { xs: "100%", sm: "auto" } }}>
            <InputLabel>Room Type</InputLabel>
            <Select value={roomType} label="Room Type" onChange={e => setRoomType(e.target.value)}>
              <MenuItem value={''}>All</MenuItem>
              {
                roomTypes.map((room, index) => {
                  return (
                    <MenuItem key={index} value={room}>{room}</MenuItem>
                  )
                })
              }
            </Select>
          </FormControl>
        </Box>

        <Box sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
          flexWrap: "wrap"
        }}>
          <DatePicker value={checkInDate} sx={{ m: 1, width: { xs: "100%", sm: "auto" } }} onChange={(newValue) => setCheckInDate(newValue)} label="Check-In date" />
          <DatePicker value={checkOutDate} sx={{ m: 1, marginTop: 'auto', marginBottom: 'auto', width: { xs: "100%", sm: "auto" } }} onChange={(newValue) => setCheckOutDate(newValue)} label="Check-Out date" />
        </Box>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Room Number</TableCell>
              <TableCell>Room Type</TableCell>
              <TableCell>Check In</TableCell>
              <TableCell>Check Out</TableCell>
              <TableCell>Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.id}</TableCell>
                <TableCell>{booking.email}</TableCell>
                <TableCell>{booking.room.roomNumber}</TableCell>
                <TableCell>{booking.room.roomType.name}</TableCell>
                <TableCell>{booking.checkIn}</TableCell>
                <TableCell>{booking.checkOut}</TableCell>
                <TableCell>{booking.price}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(booking)}
                  >
                    Delete
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="info"
                    onClick={() => handleEdit(booking)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {
        Object.keys(booking).length
          ? <>
            {id === 1 && <DeleteModal booking={booking} modalOpen={modalOpen} setModalOpen={setModalOpen} />}
            {id === 2 && <TransitionsModal booking={booking} modalOpen={modalOpen} setModalOpen={setModalOpen} />}
          </> : <></>
      }
    </div>
  )
}

export default BookingDashboard