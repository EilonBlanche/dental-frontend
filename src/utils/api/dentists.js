import API from '../api';

// Fetch all dentists
export const fetchDentists = async () => {
  const token = localStorage.getItem('token');
  const response = await API.get('/dentists', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Create a new dentist
export const createDentist = async (dentistData) => {
  const token = localStorage.getItem('token');
  const response = await API.post('/dentists', dentistData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Update an existing dentist
export const updateDentist = async (id, dentistData) => {
  const token = localStorage.getItem('token');
  const response = await API.put(`/dentists/${id}`, dentistData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Delete a dentist
export const deleteDentist = async (id) => {
  const token = localStorage.getItem('token');
  const response = await API.delete(`/dentists/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};