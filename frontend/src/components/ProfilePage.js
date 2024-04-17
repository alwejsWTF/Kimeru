import { useState, useEffect } from 'react';
import { Container, Card } from 'react-bootstrap';
import '../styles/ProfilePage.css';

function Profile() {
  const [userProfile, setUserProfile] = useState('');

  useEffect(() => {
    setUserProfile({ username: 'User1', email: 'user1@example.com' });
  }, []);

  return (
    <Container className="profile-container">
      <h1>Your Profile</h1>
      <p>View your past submissions and performance statistics here.</p>
      <Card className="profile-card">
        <Card.Header>Profile Details</Card.Header>
        <Card.Body>
          <Card.Text><strong>Username:</strong> {userProfile.username}</Card.Text>
          <Card.Text><strong>Email:</strong> {userProfile.email}</Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Profile;