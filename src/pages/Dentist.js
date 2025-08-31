import React, { useEffect, useState, useMemo } from 'react';
import { Table, Button, Container, Spinner, Alert } from 'react-bootstrap';
import { FiEdit, FiTrash2, FiPlus, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { fetchDentists, createDentist, updateDentist, deleteDentist } from '../utils/api/dentists';
import { FormModal, ConfirmModal } from '../components/FormModal';
import { generateTimeSlots, formatTimeLabel } from '../utils/time';

const Dentists = () => {
  const [dentists, setDentists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editDentist, setEditDentist] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', specialization: '', availableStart: '', availableEnd: '' });
  const [formError, setFormError] = useState('');

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [dentistToDelete, setDentistToDelete] = useState(null);

  // Sorting state
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  // Load dentists
  const loadDentists = async () => {
    setLoading(true);
    try {
      const data = await fetchDentists();
      setDentists(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dentists');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDentists(); }, []);

  // Open form (create or edit)
  const openForm = (dentist = null) => {
    if (dentist) {
      setFormData({
        name: dentist.name || '',
        email: dentist.email || '',
        specialization: dentist.specialization || '',
        availableStart: dentist.availableStart || '',
        availableEnd: dentist.availableEnd || ''
      });
      setEditDentist(dentist);
    } else {
      setFormData({ name: '', email: '', specialization: '', availableStart: '', availableEnd: '' });
      setEditDentist(null);
    }
    setFormError('');
    setShowForm(true);
  };

  // Submit form
  const handleSubmit = async () => {
    if (!formData.name || !formData.availableStart || !formData.availableEnd) {
      setFormError('Fill all required fields');
      return;
    }

    try {
      if (editDentist) {
        await updateDentist(editDentist.id, formData);
        setSuccessMessage('Dentist updated successfully');
      } else {
        await createDentist(formData);
        setSuccessMessage('Dentist added successfully');
      }

      setShowForm(false);
      setEditDentist(null);
      setFormData({ name: '', email: '', specialization: '', availableStart: '', availableEnd: '' });
      setFormError('');
      loadDentists();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save dentist');
    }
  };

  // Delete dentist
  const handleDelete = async () => {
    if (!dentistToDelete) return;
    try {
      await deleteDentist(dentistToDelete.id);
      setShowDeleteModal(false);
      setDentistToDelete(null);
      loadDentists();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete dentist');
    }
  };

  // Time options
  const timeOptions = useMemo(() => generateTimeSlots('00:00', '23:30', 30).map(t => ({ value: t.value, label: t.label })), []);
  const availableEndTimes = useMemo(() => {
    if (!formData.availableStart) return timeOptions;
    return timeOptions.filter(t => t.value > formData.availableStart);
  }, [formData.availableStart, timeOptions]);

  const formFields = [
    { label: 'Name', name: 'name', type: 'text', required: true },
    { label: 'Email', name: 'email', type: 'email' },
    { label: 'Specialization', name: 'specialization', type: 'text' },
    { label: 'Schedule', type: 'schedule', subFields: [
        { name: 'availableStart', type: 'select', options: timeOptions, required: true },
        { name: 'availableEnd', type: 'select', options: availableEndTimes, required: true }
      ] 
    }
  ];

  // Handle sorting
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedDentists = useMemo(() => {
    const sortable = [...dentists];
    sortable.sort((a, b) => {
      const valA = a[sortConfig.key] || '';
      const valB = b[sortConfig.key] || '';
      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sortable;
  }, [dentists, sortConfig]);

  if (loading) return <Spinner animation="border" />;

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />;
  };

  return (
    <Container className="mt-4">
      <h3 className="mb-3">Dentists</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <Button variant="outline-secondary" onClick={() => openForm()}>
        <FiPlus /> Create Dentist
      </Button>

      <div className="table-responsive mt-3">
        <Table hover className="text-center">
          <thead>
            <tr>
              <th onClick={() => requestSort('name')} style={{ cursor: 'pointer' }}>
                Name {renderSortIcon('name')}
              </th>
              <th onClick={() => requestSort('email')} style={{ cursor: 'pointer' }}>
                Email {renderSortIcon('email')}
              </th>
              <th onClick={() => requestSort('specialization')} style={{ cursor: 'pointer' }}>
                Specialization {renderSortIcon('specialization')}
              </th>
              <th>Schedule</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedDentists.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">No dentists found</td>
              </tr>
            ) : (
              sortedDentists.map(d => (
                <tr key={d.id}>
                  <td className="align-middle">{d.name}</td>
                  <td className="align-middle">{d.email || '-'}</td>
                  <td className="align-middle">{d.specialization || '-'}</td>
                  <td className="align-middle">
                    {d.availableStart && d.availableEnd
                      ? `${formatTimeLabel(d.availableStart)} - ${formatTimeLabel(d.availableEnd)}`
                      : '-'}
                  </td>
                  <td className="align-middle">
                    <div className="d-flex justify-content-center gap-2">
                      <Button variant="link" onClick={() => openForm(d)}>
                        <FiEdit size={20} />
                      </Button>
                      <Button variant="link" onClick={() => { setDentistToDelete(d); setShowDeleteModal(true); }}>
                        <FiTrash2 size={20} className="text-danger" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      <FormModal
        show={showForm}
        handleClose={() => { setShowForm(false); setEditDentist(null); setFormError(''); }}
        title={editDentist ? 'Edit Dentist' : 'Add Dentist'}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        errorMessage={formError}
        formFields={formFields}
      />

      <ConfirmModal
        show={showDeleteModal}
        handleClose={() => { setShowDeleteModal(false); setDentistToDelete(null); }}
        title="Delete Dentist"
        body="Are you sure you want to delete this dentist?"
        confirmText="Delete"
        variant="danger"
        onConfirm={handleDelete}
      />
    </Container>
  );
};

export default Dentists;
