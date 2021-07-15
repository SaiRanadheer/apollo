import React, { useState } from 'react'
import Head from 'next/head'

import Modal from '../components/modal'
import styles from '../styles/Home.module.css'
import Doctors from '../public/assets/doctors.json'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function Home() {
  const [name, setName] = useState('')
  const [show, setShow] = useState(false)
  const [availability, setAvailability] = useState('')
  const [cost, setCost] = useState()

  const handleOnClick = (e, doctor) => {
    e.preventDefault()
    setShow(true)
    setName(doctor.name)
    setAvailability(doctor.availability)
    setCost(doctor.appointmentCost)
  }

  const doctorsList = Doctors.doctors
  return (
    <div className={styles.container}>
      <Head>
        <title>Appointment Management</title>
        <meta
          name='description'
          content='An Appointment Management application for Medical Clinics.'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href='#'>Our Clinic!</a>
        </h1>
        <p className={styles.description}>
          Please select a doctor of your requirement and choice
        </p>
        <div className={styles.grid}>
          {doctorsList.map((doctor) => {
            return (
              <div
                href='#'
                className={styles.card}
                key={doctor.id}
                onClick={(e) => handleOnClick(e, doctor)}
              >
                <h2>{doctor.name} &rarr;</h2>
                <p>Specialized in {doctor.speciality}</p>
              </div>
            )
          })}
        </div>
        <Modal
          show={show}
          title={name}
          availability={availability}
          cost={cost}
        />
      </main>

      <footer className={styles.footer}>
        <a href='#' target='_blank' rel='noopener noreferrer'>
          Powered by Our Clinic
        </a>
      </footer>
    </div>
  )
}
