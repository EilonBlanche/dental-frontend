import { Form, Button, Container, Row, Col, Alert, Card, Spinner, Image } from 'react-bootstrap';
import { useState } from 'react';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';
import toothImage from '../images/dental.jpeg';
import CryptoJS from 'crypto-js';


export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const hashedPassword = CryptoJS.SHA256(formData.password).toString();

            const response = await API.post('/login', {
                email: formData.email,
                password: hashedPassword
            });
            
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex vh-100 justify-content-center align-items-center">
        <Row>
            <Col>
                <Card className="p-4 shadow-sm" style={{ width: '500px' }}>
                    <Image src={toothImage} style={{ maxWidth: '200px', width: '100%', height: 'auto' }} fluid rounded className="mb-3 d-block mx-auto"/>
                    <Card.Body>
                    <h3 className="text-center mb-4">Login</h3>

                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
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
                            placeholder="Enter your password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                        {loading ? (
                            <>
                            <Spinner animation="border" size="sm" /> Logging in...
                            </>
                        ) : (
                            'Login'
                        )}
                        </Button>
                    </Form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
        </Container>
    );
}