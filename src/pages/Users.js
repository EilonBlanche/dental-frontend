import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Spinner, Alert } from 'react-bootstrap';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import { fetchUsers, createUser, updateUser, deleteUser } from '../utils/api/users';
import { FormModal, ConfirmModal } from '../components/FormModal';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', isAdmin: false });
  const [formError, setFormError] = useState('');

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const openForm = (user = null) => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',       // password empty when editing
        isAdmin: !!user.isAdmin
      });
      setEditUser(user);
    } else {
      setFormData({ name: '', email: '', password: '', isAdmin: false });
      setEditUser(null);
    }
    setFormError('');
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || (!editUser && !formData.password)) {
      setFormError('Fill all required fields');
      return;
    }

    try {
      if (editUser) {
        const dataToUpdate = { ...formData };
        delete dataToUpdate.password; // don’t update password if empty
        await updateUser(editUser.id, dataToUpdate);
        setSuccessMessage('User updated successfully!');
      } else {
        console.log(formData);
        await createUser(formData);
        setSuccessMessage('User created successfully!');
      }

      setShowForm(false);
      setEditUser(null);
      setFormData({ name: '', email: '', password: '', isAdmin: false });
      setFormError('');
      setTimeout(() => setSuccessMessage(''), 3000);
      loadUsers();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save user');
    }
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete.id);
      setShowDeleteModal(false);
      setUserToDelete(null);
      setSuccessMessage('User deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
      setTimeout(() => setError(''), 3000);
    }
  };

  const formFields = [
    { label: 'Name', name: 'name', type: 'text', required: true },
    { label: 'Email', name: 'email', type: 'email', required: true },
    ...(!editUser ? [{ label: 'Password', name: 'password', type: 'password', required: true }] : []),
    ...(editUser ? [{ label: 'Admin', name: 'isAdmin', type: 'checkbox' }] : []),
  ];

  if (loading) return <Spinner animation="border" />;

  return (
    <Container className="mt-4">
      <h3 className="mb-3">Users</h3>

      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <Button variant="outline-secondary" onClick={() => openForm()}>
        <FiPlus /> Create User
      </Button>

      <Table hover className="mt-3">
        <thead>
          <tr><th>Name</th><th>Email</th><th>Admin</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr><td colSpan="4" className="text-center">No users found</td></tr>
          ) : (
            users.map(u => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.isAdmin ? '✓' : '✗'}</td>
                <td>
                  <Button variant="link" onClick={() => openForm(u)}><FiEdit size={20} /></Button>
                  <Button variant="link" onClick={() => { setUserToDelete(u); setShowDeleteModal(true); }}>
                    <FiTrash2 size={20} className="text-danger" />
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <FormModal
        show={showForm}
        handleClose={() => { setShowForm(false); setEditUser(null); setFormError(''); }}
        title={editUser ? 'Edit User' : 'Add User'}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        errorMessage={formError}
        formFields={formFields}
      />

      <ConfirmModal
        show={showDeleteModal}
        handleClose={() => { setShowDeleteModal(false); setUserToDelete(null); }}
        title="Delete User"
        body="Are you sure you want to delete this user?"
        confirmText="Delete"
        variant="danger"
        onConfirm={handleDelete}
      />
    </Container>
  );
};

export default Users;
