import React from 'react';
import { Container, Row, Col, Card, Button, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import toothImage from '../images/dental.jpeg';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="text-center shadow-sm p-3">
            {/* Hero Image */}
            <Image src={toothImage} style={{ maxWidth: '200px', width: '100%', height: 'auto' }} fluid rounded className="mb-3 d-block mx-auto"/>
            <Card.Body>
              <Card.Title className="mb-3 display-6">
                Welcome to Dental Office
              </Card.Title>
              <Card.Text className="mb-4 fs-5">
                Manage your dental practice efficiently with our all-in-one platform.
                <br />
                Schedule, reschedule, and track appointments with ease.
                <br />
                Keep patient and dentist information organized in one place.
              </Card.Text>
              <Button 
                variant="primary" 
                size="lg" 
                onClick={() => navigate('/register')}
              >
                Register Now
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
