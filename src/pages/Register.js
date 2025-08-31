import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, Card, Spinner, Image, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import toothImage from '../images/dental.jpeg';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await API.post('/register', formData);
      setFormData({ name: '', email: '', password: '' });
      setShowModal(true); // show confirmation modal
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRedirect = () => {
    setShowModal(false);
    navigate('/login');
  };

  return (
    <Container className="d-flex vh-100 justify-content-center align-items-center">
      <Row>
        <Col>
          <Card style={{ width: '500px' }} className="p-4 shadow-sm">
            <Image
              src={toothImage}
              style={{ maxWidth: '200px', width: '100%', height: 'auto' }}
              fluid
              rounded
              className="mb-3 d-block mx-auto"
            />
            <Card.Body>
              <h3 className="text-center mb-4">Register</h3>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter a password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" /> Registering...
                    </>
                  ) : (
                    'Register'
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Normal Bootstrap Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Registration Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Your account has been created successfully. Click below to login.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleRedirect}>
            Go to Login
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Register;
