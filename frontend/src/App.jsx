import './App.css'
import Navbar from './components/navbar/Navbar'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import DatePickerComponent from './components/rooms/DatePicker';

function App() {

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Navbar />
    </LocalizationProvider>
  )
}

export default App
