# Dental Appointment Frontend

This is the **frontend application** for a **Dental Office** appointment booking system. Built with **React** and **Bootstrap**, it provides a responsive and intuitive interface for users to schedule dental checkups easily.

**Live Demo:** [https://genuine-piroshki-e21886.netlify.app/](https://genuine-piroshki-e21886.netlify.app/)

Download this [file](https://drive.google.com/file/d/18jSe61EJXPABPthi_A3j-IEBWnmX6SbF/view?usp=drive_link) for a walkthrough of the system.

## Table of Contents

- [Features](#features)  
- [Technologies Used](#technologies-used)  
- [Installation](#installation)  
- [Login Page](#login-page)  
- [Register Page](#register-page)  
- [Dashboard Page](#dashboard-page)  
  - [Creating Appointments](#creating-appointments)  
  - [Updating Appointments](#updating-appointments)  
- [Dentist Page - (Admin Only)](#dentist-page---admin-only)  
  - [Adding a Dentist](#adding-a-dentist)  
  - [Updating Dentist Details](#updating-dentist-details)  
- [Users Page - (Admin Only)](#users-page---admin-only)  
  - [Creating a New User](#creating-a-new-user)  
  - [Editing User Details](#editing-user-details)  
- [Test Credentials](#test-credentials)

## Features
- Book dental appointments through a clean, user-friendly interface.
- View available dates and time slots for each dentist.
- Responsive design for both desktop and mobile devices.
- Form validation for all appointment and user input fields.
- Ready for backend API integration.

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
4. Start the application:
    ```bash
    npm start
    ```

## Login Page
<img width="1900" height="947" alt="Login Page" src="https://github.com/user-attachments/assets/07a5a18f-bb49-4795-8951-75de39ae9244" />

- Users can log in using their email and password.
- **Note:** Use the test credentials below to explore the application.

| Role  | Email             | Password   |
|-------|-----------------|------------|
| Admin | test@admin.com   | Test12345  |
| User  | test@user.com    | Test12345  |

## Register Page
<img width="1903" height="945" alt="Register Page" src="https://github.com/user-attachments/assets/4eac7372-7bb0-43f1-9e93-a5b44845a1f3" />

- Allows new users to create an account by entering their name, email, and password.

## Dashboard Page
<img width="1919" height="946" alt="Dashboard Page" src="https://github.com/user-attachments/assets/504ecc73-7570-4096-9391-386281580e48" />

- Users can **view**, **create**, **update**, and **delete** appointments with specific dentists based on their availability.
- Click the **Schedule Appointment** button to book a new appointment.
- Click the **pencil** icon to edit an appointment.
- Click the **x** icon to cancel an appointment.
- Click the **trash** icon to permanently delete an appointment.

### Creating Appointments
<img width="1919" height="942" alt="Creating Appointments" src="https://github.com/user-attachments/assets/28649841-a43f-44c5-ae8c-217df50d6f08" />

- Select the *Dentist*, *Date*, and *Time Slot* to create an appointment.
- Click **Save** to confirm the appointment.
- Click **Clear Form** to reset all input fields.

### Updating Appointments
<img width="1919" height="940" alt="Updating Appointments" src="https://github.com/user-attachments/assets/6baa35f9-3040-4030-9559-7f8671919476" />

- Modify fields such as *Dentist*, *Date*, and *Time Slot* to update an appointment.
- Click **Save** to save changes.
- Click **Clear Form** to reset the fields.
- Appointment Status:
  - **CONFIRMED:** When created successfully; the slot is reserved.
  - **RESCHEDULED:** When date or time is changed; the new slot is reserved.
  - **CANCELLED:** When deleted or canceled; the slot becomes available for others.

## Dentist Page - (Admin Only)
<img width="1919" height="943" alt="Dentist Page" src="https://github.com/user-attachments/assets/b3f769df-c4dd-421b-9f06-4397ebd483c3" />

- Admins can **view**, **create**, **update**, and **delete** dentists along with their available time slots.
- Click the **Create Dentist** button to add a new dentist.
- Click the **pencil** icon to edit dentist information.
- Click the **trash** icon to delete a dentist.

### Adding a Dentist
<img width="1919" height="940" alt="Adding Dentist" src="https://github.com/user-attachments/assets/cd725a74-c488-4868-b2cd-58a9f61b41b5" />

- Enter *Name*, *Email*, *Specialization*, and *Schedule* for the dentist.
- The schedule determines the available time slots for appointments.
- Click **Save** to add the dentist.

### Updating Dentist Details
<img width="1919" height="945" alt="Update Dentist" src="https://github.com/user-attachments/assets/c8128cf9-0453-43c1-9af2-1e6b75f175a8" />

- Update fields such as *Name*, *Email*, *Specialization*, and *Schedule*.
- Click **Save** to save changes.

## Users Page - (Admin Only)
<img width="1919" height="939" alt="Users Page" src="https://github.com/user-attachments/assets/7a9da705-cc03-4a57-9c19-34db5b0a35ee" />

- Admins can **view**, **create**, **update**, and **delete** users.
- Click the **Create User** button to add a new user.
- Click the **pencil** icon to edit user information.
- Click the **trash** icon to delete a user.

### Creating a New User
<img width="1918" height="941" alt="Creating User" src="https://github.com/user-attachments/assets/1329ee12-6abe-4862-8f7c-d8cb1c84ce49" />

- Enter *Name*, *Email*, and *Password* to add a new user.
- Click **Save** to create the user.

### Editing User Details
<img width="1918" height="941" alt="Edit User" src="https://github.com/user-attachments/assets/c6f5a271-d6e6-42b2-b5c2-90cfb70ffa63" />

- Update *Name*, *Email*, and *User Type (Admin or User)*.
- Click **Save** to apply changes.

## Test Credentials

| Role  | Email             | Password   |
|-------|-----------------|------------|
| Admin | test@admin.com   | Test12345.  |
| User  | test@user.com    | Test12345.  |
