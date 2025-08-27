import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BsNavBar, Nav, Container, Button } from 'react-bootstrap';


export default function Navbar() {
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <BsNavBar bg="dark" data-bs-theme="dark" expand="lg" className="shadow-sm mb-4">
            <Container>
                <BsNavBar.Brand as={Link} to="/">Dental Office</BsNavBar.Brand>
                <BsNavBar.Toggle aria-controls="basic-BsNavBar-nav" />
                <BsNavBar.Collapse id="basic-BsNavBar-nav">
                <Nav className="ms-auto">
                    {!user ? (
                        <>
                            <Nav.Link as={Link} to="/login">Login</Nav.Link>
                            <Nav.Link as={Link} to="/register">Register</Nav.Link>
                            <Nav.Link as={Link} to="/home">Home</Nav.Link>
                        </>
                        ) : (
                        <>
                            <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                            {user.isAdmin && (
                            <>
                                <Nav.Link as={Link} to="/dentists">Dentists</Nav.Link>
                                <Nav.Link as={Link} to="/users">Users</Nav.Link>
                            </>
                            )}
                            <Button variant="outline-secondary" className="ms-2" onClick={handleLogout}>Logout</Button>
                        </>
                    )}
                </Nav>
                </BsNavBar.Collapse>
            </Container>
        </BsNavBar>
    );
}