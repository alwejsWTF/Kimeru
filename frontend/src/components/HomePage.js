import { Container, Button } from 'react-bootstrap';
import '../styles/HomePage.css'

function HomePage() {
  return (
    <Container className="home-container">
      <h1 className="header">Welcome to SPOJ</h1>
      <p className="text">The place to test your coding skills and compete with others.</p>
      <Button href="/problems" variant="primary" className="link">Explore Problems</Button>
      <Button href="/ranking" variant="primary" className="link">View Rankings</Button>
    </Container>
  );
}

export default HomePage;