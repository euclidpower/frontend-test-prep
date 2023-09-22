import { useEffect, useRef, useState } from 'react'
import './App.css'
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Typography, Button, FormHelperText } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { DateTime } from 'luxon'

function App() {
  const [selectedDay] = useState(DateTime.now().toISODate())
  const [slots, setSlots] = useState<Slot[]>([])
  const [helperText, setHelperText] = useState('');

  useEffect(() => {
    fetchSlots()
  }, [])

  const fetchSlots = () => {
    return fetch(`/slots?day=${selectedDay}`, { method: 'GET' })
    .then((response) => response.json())
    .then((json) => setSlots(json))
    .catch((error) => setHelperText(String(error)))
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    setHelperText('')

    const formData = new FormData(event.target as HTMLFormElement)
    if (!formData.get('starts')) {
      setHelperText('You need to pick a time before continuing')
      return
    }

    fetchSlots()
  }

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid xs={4}>
          Jacob Sandry
          <Typography variant="h2" gutterBottom>Product chat</Typography>
          <p>80 min</p>
          <p>Let's chat about how we can make the app better for you</p>

          <Button type="submit" disabled={false}>
            Request meeting
          </Button>
        </Grid>
        <Grid container xs={8}>
          <Grid xs={12}>
            Please pick a time and date
          </Grid>
          <Grid xs={12}>
            <fieldset>
              <legend>{DateTime.fromISO(selectedDay).toLocaleString(DateTime.DATE_FULL)}</legend>
              <FormControl sx={{ maxHeight: '90vh', overflowY: 'auto' }} required>
                <FormLabel id="starts-group-label">Time</FormLabel>
                  <RadioGroup
                    aria-labelledby="starts-group-label"
                    name="starts"
                  >
                    {slots.map((slot) => <FormControlLabel key={slot.starts} value={slot.starts} control={<Radio />} label={getTimeLabel(slot)} />)}
                  </RadioGroup>
              </FormControl>
            </fieldset>
          </Grid>
          <Grid xs={12}>
            <FormHelperText>{helperText}</FormHelperText>
          </Grid>
        </Grid>
      </Grid>
    </form>
  )
}

function getTimeLabel(slot: Slot) {
  return DateTime.fromISO(slot.starts).toLocaleString(DateTime.TIME_SIMPLE)
}

export default App
