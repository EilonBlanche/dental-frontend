import API from '../api';

// Fetch all users
export const fetchUsers = async () => {
  const token = localStorage.getItem('token');
  const response = await API.get('/users', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Create a new user
export const createUser = async (userData) => {
  const token = localStorage.getItem('token');
  const response = await API.post('/users', userData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Update an existing user
export const updateUser = async (id, userData) => {
  const token = localStorage.getItem('token');
  const response = await API.put(`/users/${id}`, userData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Delete a user
export const deleteUser = async (id) => {
  const token = localStorage.getItem('token');
  const response = await API.delete(`/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
