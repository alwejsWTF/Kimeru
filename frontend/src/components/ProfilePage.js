import axios from 'axios';
import { useState, useEffect } from 'react';
import { Container, Card } from 'react-bootstrap';
import * as routes from '../config/routes';
import '../styles/ProfilePage.css';
import { useToast } from './ToastProvider';
import { FaCheck, FaXmark } from "react-icons/fa6";

function StatusMark({status}) {
  if (status) {
    return <FaCheck />
  }
  return <FaXmark />

}

function Profile({loggedIn}) {
  const showToast = useToast();
  const [userProfile, setUserProfile] = useState('');
  const [startedTasks, setStartedTasks] = useState([]);

  useEffect(() => {
    axios.get(routes.GET_PROFILE_INFO).then((res) => {
      setUserProfile({ id: res.data.id, username: res.data.username, email: 'user1@example.com' });
    }).catch((err) => {
      showToast(err.response.data.message, "danger");
    })
  }, [loggedIn]);

  useEffect(() => {
    if (userProfile) {
      axios.get(routes.GET_USER_STARTED_TASKS + String(userProfile.id)).then((res) => {
        setStartedTasks(res.data);
      }).catch((err) => {
        showToast(err.response.data.message, "danger");
      })
    }
  }, [userProfile]);


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
      <Card className="profile-card">
        <Card.Header>Started Tasks</Card.Header>
        <Card.Body>
          {startedTasks.map(task => 
            <Container key={task.task_id} className="my-4">
              <Card.Title>Problem name</Card.Title>
              <Container className="d-flex">
                <Card.Text className="w-75"><strong>Description:</strong> {task.description}</Card.Text>
                <Card.Text className="w-25"><strong>Status:</strong> <StatusMark status={task.solve_status} /></Card.Text>
              </Container>
            </Container>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Profile;