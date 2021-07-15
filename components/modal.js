import React, { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import moment from 'moment'

import styles from '../styles/Modal.module.css'
import 'react-calendar/dist/Calendar.css'

export default function Modal(props) {
  const { show, title, availability, cost } = props

  const [date, setDate] = useState(new Date())
  const [showState, setShowState] = useState(show)
  const [availabilityDays, setAvailabilityDays] = useState(availability.days)
  const [slotSelected, setSlotSelected] = useState(false)
  const [slot, setSlot] = useState('')
  const [appointmentsData, setAppointmentsData] = useState([])
  const [showSchedules, setShowSchedules] = useState(false)

  useEffect(() => {
    setShowState(show)
    setDate(new Date())
    setAvailabilityDays(availability.days)
    setAvailableSlots(slots())
    setSlotSelected(false)
    setShowSchedules(false)
  }, [props])

  useEffect(() => {
    if (date) {
      setAvailableSlots(slots(date))
    } else {
      setAvailableSlots(slots())
    }
    setSlotSelected(false)
  }, [date])

  const handleClose = (e) => {
    setShowState(false)
    e.preventDefault()
  }

  const handleSlotClick = (e, slot) => {
    setSlotSelected(true)
    setSlot(slot)
    const appointmentDetails = {}
    appointmentDetails.doctor = title
    appointmentDetails.slotTime = slot
    appointmentDetails.slotDates = moment(date).format('DD/MM/yyyy')
    let appointmentsList = localStorage.getItem('appointments')
      ? JSON.parse(localStorage.getItem('appointments'))
      : []
    appointmentsList.push(appointmentDetails)
    localStorage.setItem('appointments', JSON.stringify(appointmentsList))
    setAvailableSlots(availableSlots.filter((item) => item !== slot))
    e.preventDefault()
  }

  const handleShowSchedules = (e) => {
    e.preventDefault()
    setAppointmentsData(
      localStorage.getItem('appointments')
        ? JSON.parse(localStorage.getItem('appointments')).filter(
            (item) => item.doctor === title
          )
        : []
    )
    setShowSchedules(true)
  }

  const slots = (date) => {
    let startTime = ''
    let endTime = ''
    let slotsList = []

    if (moment(date).format('DD/MM/yyyy') === moment().format('DD/MM/yyyy')) {
      date = null
    }

    if (
      moment(date ? new Date(date) : new Date(), 'HH:mm').isSameOrBefore(
        moment(
          moment(
            date
              ? moment(date).format('DD/MM/yyyy') + ' ' + availability.start
              : availability.start,
            date ? 'DD/MM/yyyy HH:mm' : 'HH:mm'
          ),
          'HH:mm'
        )
      )
    ) {
      startTime = moment(
        date
          ? moment(date).format('DD/MM/yyyy') + ' ' + availability.start
          : availability.start,
        date ? 'DD/MM/yyyy HH:mm' : 'HH:mm'
      )
      endTime = moment(
        date
          ? moment(date).format('DD/MM/yyyy') + ' ' + availability.end
          : availability.end,
        date ? 'DD/MM/yyyy HH:mm' : 'HH:mm'
      )
      let temp = startTime
      while (temp < endTime) {
        slotsList.push(moment(temp).format('HH:mm'))
        temp.add('m', 20, 1)
      }
    } else if (
      moment(date ? new Date(date) : new Date(), 'HH:mm').isSameOrAfter(
        moment(
          moment(
            date
              ? moment(date).format('DD/MM/yyyy') + ' ' + availability.end
              : availability.end,
            date ? 'DD/MM/yyyy HH:mm' : 'HH:mm'
          ).subtract('m', 20, 1),
          'HH:mm:ss'
        )
      )
    ) {
      slotsList = []
      // console.log('Display the messsage no solts available')
    } else {
      startTime = moment().add('m', 20 - (moment().minute() % 20), 1)
      endTime = moment(
        date
          ? moment(date).format('DD/MM/yyyy') + ' ' + availability.end
          : availability.end,
        date ? 'DD/MM/yyyy HH:mm' : 'HH:mm'
      )

      let temp = startTime
      while (temp < endTime) {
        slotsList.push(moment(temp).format('HH:mm'))
        temp.add('m', 20, 1)
      }
    }

    return slotsList
  }

  const disableUnavailable = (date) => {
    if (
      moment(moment(new Date(), 'dd-MM-yyyy').subtract('d', 1, 1)).isAfter(
        moment(date.date, 'dd-MM-yyyy')
      )
    ) {
      return true
    }
    const availabilityDaysValue = availabilityDays
      .split('')
      .map((value) => parseInt(value))

    return !availabilityDaysValue[date.date.getDay()]
  }

  const [availableSlots, setAvailableSlots] = useState(slots())

  return (
    showState && (
      <div className={styles.modal}>
        <div className={styles.content}>
          <div className={styles.header}>
            <div> {title} </div>
            <div className={styles.close} onClick={handleClose}>
              X
            </div>
          </div>
          {!showSchedules && (
            <div className={styles.main}>
              <div>
                <p>Please select an appointment</p>
                <div>
                  <Calendar
                    onChange={setDate}
                    value={date}
                    tileDisabled={disableUnavailable}
                  />
                </div>
              </div>

              <div className={styles.slots}>
                {availableSlots &&
                  availableSlots.length > 0 &&
                  availableSlots.map((slot, index) => (
                    <div
                      className={styles.chip}
                      key={index}
                      onClick={(e) => handleSlotClick(e, slot)}
                    >
                      {slot}
                    </div>
                  ))}

                <div>
                  <button
                    className={styles.button}
                    onClick={handleShowSchedules}
                  >
                    Show scheduled appointments
                  </button>
                </div>

                {availableSlots.length === 0
                  ? 'Appointments not available'
                  : ''}
              </div>
              {slotSelected && (
                <div>
                  <p>
                    Selected slot at {slot} on{' '}
                    {moment(date).format('DD-MMM-yyyy')}
                  </p>
                  Total appointment cost : {cost}
                </div>
              )}
            </div>
          )}
          {showSchedules && (
            <div className={styles.main}>
              {appointmentsData.map((appointment, index) => (
                <div className={styles.chip} key={index}>
                  Appointment on {appointment.slotDate} at{' '}
                  {appointment.slotTime}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  )
}
