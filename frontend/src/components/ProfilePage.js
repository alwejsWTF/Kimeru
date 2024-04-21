import axios from 'axios';
import { useState, useEffect } from 'react';
import { Container, Card } from 'react-bootstrap';
import * as routes from '../config/routes';
import '../styles/ProfilePage.css';
import { useToast } from './ToastProvider';


function Profile({loggedIn}) {
  const showToast = useToast();
  const [userProfile, setUserProfile] = useState('');

  const getUserInfo = async () => {
    try {
      const response = await axios.get(routes.GET_PROFILE_INFO);
      setUserProfile({ username: response.data.username, email: 'user1@example.com' });
    } catch(err) {
      showToast(err.response.data.message, "danger");
    }
  }

  useEffect(() => {
    getUserInfo();
  }, [loggedIn]);

  return (
    <Container className="font profile-container">
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