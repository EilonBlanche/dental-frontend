import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Table, Button, Container, Spinner, Alert, OverlayTrigger, Tooltip, Modal, Form } from 'react-bootstrap';
import { FiEdit, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import { fetchAppointments, createAppointment, updateAppointment, deleteAppointment, fetchAppointmentsByDentist } from '../utils/api/appointments';
import { fetchDentists } from '../utils/api/dentists';
import { formatTimeLabel, generateTimeSlots, formatDate } from '../utils/time';
import { useNavigate } from 'react-router-dom';
import { ConfirmModal } from '../components/FormModal';

const Dashboard = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dentists, setDentists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editAppt, setEditAppt] = useState(null);
  const [formData, setFormData] = useState({ dentist_id: '', date: '', timeFrom: '', timeTo: '' });
  const [timeFiltered, setTimeFiltered] = useState([]);
  const [modalError, setModalError] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [apptToCancel, setApptToCancel] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [apptToDelete, setApptToDelete] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const minDate = `${yyyy}-${mm}-${dd}`; // YYYY-MM-DD

  // Memoize current date/time so it's stable across renders
  const now = useMemo(() => new Date(), []);
  const currentTimeStr = now.toTimeString().slice(0, 5);

  // Load appointments
  const loadAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAppointments();
      setAppointments(data);
    } catch (err) {
      if (err.response?.status === 401) navigate('/login', { replace: true });
      else setError(err.response?.data?.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const loadDentists = async () => {
    try {
      const data = await fetchDentists();
      setDentists(data);
    } catch {
      console.error('Failed to load dentists');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('user');
    if (!token) navigate('/login', { replace: true });
    loadDentists();
  }, [navigate]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  useEffect(() => {
    if (formData.dentist_id && formData.date) {
      fetchAppointmentsByDentist(formData.dentist_id, formData.date)
        .then(data =>
          setTimeFiltered(
            data.filter(a => !editAppt || a.id !== editAppt.id).map(a => [a.timeFrom, a.timeTo])
          )
        )
        .catch(err => console.error(err));
    } else setTimeFiltered([]);
  }, [formData.dentist_id, formData.date, editAppt]);

  useEffect(() => {
    if (editAppt)
      setFormData({
        dentist_id: editAppt.dentist_id || '',
        date: editAppt.date || '',
        timeFrom: editAppt.timeFrom || '',
        timeTo: editAppt.timeTo || '',
      });
    else setFormData({ dentist_id: '', date: '', timeFrom: '', timeTo: '' });
  }, [editAppt]);

  useEffect(() => {
    if (formData.timeFrom && formData.timeTo && formData.timeFrom >= formData.timeTo) {
      setFormData(prev => ({ ...prev, timeFrom: '', timeTo: '' }));
    }
  }, [formData.timeFrom, formData.timeTo]);

  const selectedDentist = useMemo(
    () => dentists.find(d => d.id === Number(formData.dentist_id)),
    [dentists, formData.dentist_id]
  );
  const timeSlots = useMemo(
    () =>
      selectedDentist
        ? generateTimeSlots(selectedDentist.availableStart || '09:00', selectedDentist.availableEnd || '17:00', 30)
        : [],
    [selectedDentist]
  );

  const availableTimeFrom = useMemo(() => {
    if (!formData.date || !formData.dentist_id) return [];
    return timeSlots.filter(t => {
      if (formData.date === now.toISOString().split('T')[0] && t.value < currentTimeStr) return false;
      return !timeFiltered.some(([start, end]) => t.value >= start && t.value < end);
    });
  }, [timeSlots, timeFiltered, formData, now, currentTimeStr]);

  const availableTimeTo = useMemo(() => {
    if (!formData.timeFrom) return [];
    return timeSlots.filter(
      t => t.value > formData.timeFrom && !timeFiltered.some(([start, end]) => formData.timeFrom < end && t.value > start)
    );
  }, [timeSlots, timeFiltered, formData.timeFrom]);

  // Clear form without closing modal
  const clearForm = () => {
    setEditAppt(null);
    setFormData({ dentist_id: '', date: '', timeFrom: '', timeTo: '' });
    setModalError('');
  };

  const handleModalSubmit = async () => {
    setModalError('');

    // Ensure all fields are filled
    if (!formData.dentist_id || !formData.date || !formData.timeFrom || !formData.timeTo) {
      setModalError('Please fill in all fields.');
      return;
    }

    // Prevent selecting a past date
    const selectedDate = new Date(formData.date);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0); // reset time portion
    if (selectedDate < todayDate) {
      setModalError('Cannot select a past date.');
      return;
    }

    // Prevent selecting past time if the date is today
    const currentTimeStr = new Date().toTimeString().slice(0, 5);
    if (formData.date === minDate && formData.timeFrom < currentTimeStr) {
      setModalError('Start time cannot be in the past.');
      return;
    }

    // Ensure timeFrom < timeTo
    if (formData.timeFrom >= formData.timeTo) {
      setModalError('End time must be later than start time.');
      return;
    }

    // Check for overlapping appointments
    const overlaps = timeFiltered.some(([start, end]) => formData.timeFrom < end && formData.timeTo > start);
    if (overlaps) {
      setModalError('Selected time conflicts with an existing appointment.');
      return;
    }

    try {
      if (editAppt) {
        // Only mark as RESCHEDULED if dentist, date, or time changed
        const isChanged =
          editAppt.dentist_id !== Number(formData.dentist_id) ||
          editAppt.date !== formData.date ||
          editAppt.timeFrom !== formData.timeFrom ||
          editAppt.timeTo !== formData.timeTo;

        const updatedData = { ...formData };
        if (isChanged) updatedData.status_id = 3; // RESCHEDULED
        else delete updatedData.status_id; // keep original status

        await updateAppointment(editAppt.id, updatedData);
      } else {
        await createAppointment(formData);
      }

      setShowModal(false);
      setEditAppt(null);
      setFormData({ dentist_id: '', date: '', timeFrom: '', timeTo: '' });
      setSuccessMsg('Appointment saved successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
      loadAppointments();
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to save appointment');
    }
  };

  const filteredAppointments = useMemo(
    () =>
      appointments.filter(
        a =>
          a.dentist?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.status?.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.date?.includes(searchQuery)
      ),
    [appointments, searchQuery]
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAppointments = filteredAppointments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

  if (loading) return <Spinner animation="border" />;

  return (
    <Container className="mt-4">
      <h3 className="mb-3">My Appointments</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      {successMsg && <Alert variant="success">{successMsg}</Alert>}

      <div className="d-flex justify-content-between mb-3">
        <Button variant="outline-secondary" onClick={() => { setShowModal(true); clearForm(); }}>
          <FiPlus size={20} /> Schedule Appointment
        </Button>
        <input
          type="text"
          className="form-control w-25"
          placeholder="Search by dentist, status"
          value={searchQuery}
          onChange={e => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>
      <div className="table-responsive">
        <Table hover>
          <thead className="text-center">
            <tr>
              <th>Dentist</th>
              <th>Specialization</th>
              <th>Email</th>
              <th>Status</th>
              <th>Date</th>
              <th colSpan="2">Schedule</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {currentAppointments.length === 0 ? (
              <tr>
                <td colSpan="7">No appointments found</td>
              </tr>
            ) : (
              currentAppointments.map(appt => {
                const rowClass =
                  appt.status?.description === 'RESCHEDULED'
                    ? 'table-primary'
                    : appt.status?.description === 'CANCELLED'
                    ? 'table-secondary'
                    : 'table-light';
                return (
                  <tr key={appt.id} className={rowClass}>
                    <td>{appt.dentist?.name}</td>
                    <td>{appt.dentist?.specialization}</td>
                    <td>{appt.dentist?.email}</td>
                    <td>{appt.status?.description || 'Unknown'}</td>
                    <td>{formatDate(appt.date)}</td>
                    <td colSpan="2">
                      {formatTimeLabel(appt.timeFrom)} - {formatTimeLabel(appt.timeTo)}
                    </td>
                    <td className="d-flex flex-wrap justify-content-center gap-2">
                      {appt.status?.description !== 'CANCELLED' && (
                        <OverlayTrigger placement="top" overlay={<Tooltip>Edit Appointment</Tooltip>}>
                          <Button
                            variant="link"
                            size="sm"
                            onClick={() => {
                              setEditAppt(appt);
                              setShowModal(true);
                              setModalError('');
                            }}
                          >
                            <FiEdit size={20} />
                          </Button>
                        </OverlayTrigger>
                      )}
                      {appt.status_id !== 2 && (
                        <OverlayTrigger placement="top" overlay={<Tooltip>Cancel Appointment</Tooltip>}>
                          <Button
                            variant="link"
                            size="sm"
                            className="text-warning"
                            onClick={() => {
                              setApptToCancel(appt);
                              setShowCancelModal(true);
                            }}
                          >
                            <FiX size={22} />
                          </Button>
                        </OverlayTrigger>
                      )}
                      <OverlayTrigger placement="top" overlay={<Tooltip>Delete Appointment</Tooltip>}>
                        <Button
                          variant="link"
                          size="sm"
                          className="text-danger"
                          onClick={() => {
                            setApptToDelete(appt);
                            setShowDeleteModal(true);
                          }}
                        >
                          <FiTrash2 size={20} />
                        </Button>
                      </OverlayTrigger>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>  
      </div>


      <div className="d-flex justify-content-center mt-3">
        <Button
          variant="secondary"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(p => p - 1)}
        >
          Prev
        </Button>
        <span className="mx-3">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="secondary"
          size="sm"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage(p => p + 1)}
        >
          Next
        </Button>
      </div>

      {/* Inline Form Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editAppt ? 'Edit Appointment' : 'Add Appointment'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalError && <Alert variant="danger">{modalError}</Alert>}
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Dentist</Form.Label>
              <Form.Select
                value={formData.dentist_id}
                onChange={e => setFormData(prev => ({ ...prev, dentist_id: e.target.value }))}
              >
                <option value="">Select dentist</option>
                {dentists.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} - {d.specialization}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                min={minDate} 
                value={formData.date}
                onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  onKeyDown={e => { if (e.key === 'ArrowUp' || e.key === 'ArrowDown') e.preventDefault(); }}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Schedule</Form.Label>
              <div className="d-flex gap-2">
                <Form.Select
                  value={formData.timeFrom}
                  onChange={e => setFormData(prev => ({ ...prev, timeFrom: e.target.value, timeTo: '' }))}
                >
                  <option value="">Select Time From</option>
                  {availableTimeFrom.map(t => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </Form.Select>
                <Form.Select
                  value={formData.timeTo}
                  onChange={e => setFormData(prev => ({ ...prev, timeTo: e.target.value }))}
                >
                  <option value="">Select Time To</option>
                  {availableTimeTo.map(t => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </Form.Select>
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={clearForm}>
            Clear Form
          </Button>
          <Button variant="primary" onClick={handleModalSubmit}>
            {editAppt ? 'Update' : 'Save'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Cancel & Delete Modals */}
      <ConfirmModal
        show={showCancelModal}
        handleClose={() => setShowCancelModal(false)}
        title="Cancel Appointment"
        body="Are you sure you want to cancel this appointment?"
        confirmText="Confirm Cancel"
        variant="warning"
        onConfirm={async () => {
          if (!apptToCancel) return;
          await updateAppointment(apptToCancel.id, { ...apptToCancel, status_id: 2 });
          setShowCancelModal(false);
          setApptToCancel(null);
          loadAppointments();
        }}
      />
      <ConfirmModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        title="Delete Appointment"
        body="Are you sure you want to delete this appointment?"
        confirmText="Confirm Delete"
        variant="danger"
        onConfirm={async () => {
          if (!apptToDelete) return;
          await deleteAppointment(apptToDelete.id);
          setShowDeleteModal(false);
          setApptToDelete(null);
          loadAppointments();
        }}
      />
    </Container>
  );
};

export default Dashboard;
