import API from '../api';

// Fetch all appointments
export const fetchAppointments = async () => {
  const token = localStorage.getItem('token');
  const response = await API.get('/appointments', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Create a new appointment
export const createAppointment = async (data) => {
  const token = localStorage.getItem('token');
  const response = await API.post('/appointments', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Update an appointment
export const updateAppointment = async (id, data) => {
  const token = localStorage.getItem('token');
  const response = await API.put(`/appointments/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Delete an appointment
export const deleteAppointment = async (id) => {
  const token = localStorage.getItem('token');
  const response = await API.delete(`/appointments/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchAppointmentsByDentist = async (id, date) => {
  const token = localStorage.getItem('token');
  const data = { dentistId: id, date : date };
  const response = await API.post(`/appointments/dentist`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};


