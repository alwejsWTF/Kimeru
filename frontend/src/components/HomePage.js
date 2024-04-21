import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import '../styles/HomePage.css'

function HomePage() {

  return (
    <Container className="font home-container">
      <Row className="bannerRow">
        <Col md={4} className="bannerTextCol">
          <h1 className="bannerTitle">Welcome to SPOJ </h1>
          <p className="bannerSubtitle">The place to test your coding skills and compete with others.</p>
          <Button href="/problems" variant="primary" size="lg" className="bannerButton">Explore Problems</Button>
          <Button href="/ranking" variant="primary" size="lg" className="bannerButton mt-2">View Rankings</Button>
        </Col>
        <Col md={1}></Col>
        <Col md={7} className="container">
          <Card className="imageCard">
            <Card.Img src={`${process.env.PUBLIC_URL}/banner.jpg`}/>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;