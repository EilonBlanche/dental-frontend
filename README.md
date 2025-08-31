# Dental Appointment Frontend

## Overview
This is the **frontend application** for a dental appointment booking system. Built with **React** and **Bootstrap**, it provides a responsive and intuitive interface for users to schedule dental checkups easily.

**Live Demo:** [https://genuine-piroshki-e21886.netlify.app/](https://genuine-piroshki-e21886.netlify.app/)

## Features
- Book dental appointments through a clean, user-friendly interface
- View available dates and time slots
- Responsive design for desktop and mobile devices
- Form validation for appointment details
- Integration-ready for backend APIs

## Technologies Used
- **Framework/Library:** React
- **Styling:** Bootstrap
- **Routing:** React Router
- **Other Tools:** Axios, ESLint

## Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/EilonBlanche/dental-frontend.git
    ```
2. Navigate to the project directory:
    ```bash
    cd dental-frontend
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Run the application:
    ```bash
    npm start
    ```


## Login Page
<img width="1900" height="947" alt="image" src="https://github.com/user-attachments/assets/07a5a18f-bb49-4795-8951-75de39ae9244" />

- Users can log in with their email and password using this form.
- Use these test credentials to log in:

| Role  | Email             | Password   |
|-------|-----------------|------------  |
| Admin | test@admin.com   | Test12345.  |
| User  | test@user.com    | Test12345.  |

## Register Page
<img width="1903" height="945" alt="image" src="https://github.com/user-attachments/assets/4eac7372-7bb0-43f1-9e93-a5b44845a1f3" />

- This page handles user registration, allowing new users to create an account with their name, email and password.

## Dashboard Page
<img width="1919" height="946" alt="image" src="https://github.com/user-attachments/assets/504ecc73-7570-4096-9391-386281580e48" />

- Allows users to **view**, **create**, **update**, and **delete** appointments with specific dentists based on their availability for the day.
- Click the **Schedule Appointment** button to create a new appointment.
- Click the **pencil** icon to edit an appointment.
- Click the **x** icon to cancel an appointment.
- Click the **trash** to delete an appointment.

### Creating Appointments
<img width="1919" height="942" alt="image" src="https://github.com/user-attachments/assets/28649841-a43f-44c5-ae8c-217df50d6f08" />

- Fill in fields such as *Dentist*, *Date* and *Schedule* to create appointment details.
- Click **Save** to save appointment.
- Click **Clear Form** to clear all input fields.

### Updating Appointments
<img width="1919" height="940" alt="image" src="https://github.com/user-attachments/assets/6baa35f9-3040-4030-9559-7f8671919476" />

- Update fields such as *Dentist*, *Date* and *Schedule* to update appointment details.
- Click **Save** to save appointment.
- Click **Clear Form** to clear all input fields.
- Allows rescheduling and **cancelling** of appointments.
  	- Appointment is automatically **CONFIRMED** once it is created successfully. The updated scheduled booked can't be booked by another user.
  	- Appointment becomes **RESCHEDULED** once date and time has been changed. The updated scheduled booked can't be booked by another user.
  	- Appointment can be **CANCELLED**. Once an appointment is cancelled or deleted, timeslot for the cancelled appointment becomes available for other users.
