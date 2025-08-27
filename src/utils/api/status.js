import API from '../api'; // adjust the import if needed

export const fetchStatus = async () => {
  const token = localStorage.getItem('token');
  const response = await API.get('/status', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};