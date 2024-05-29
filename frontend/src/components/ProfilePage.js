import axios from 'axios';
import { useState, useEffect } from 'react';
import { Container, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import * as routes from '../config/routes';
import '../styles/ProfilePage.css';
import { useToast } from './ToastProvider';
import { FaCheck, FaXmark } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { setJWT } from '../utils/functions';

function StatusMark({status}) {
  if (status) {
    return <FaCheck style={{ color: 'green' }} />
  }
  return <FaXmark style={{ color: 'red' }} />

}

function Profile({loggedIn}) {
  const showToast = useToast();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState('');
  const [startedTasks, setStartedTasks] = useState([]);

  useEffect(() => {
    if (loggedIn) {
      axios.get(routes.GET_PROFILE_INFO).then((res) => {
        setUserProfile({ id: res.data.id, username: res.data.username, email: 'user1@example.com' });
        setJWT();
      }).catch((err) => {
        showToast(err.response.data.message, "danger");
      })
    }
  }, [loggedIn, showToast]);

  useEffect(() => {
    if (userProfile) {
      axios.get(routes.GET_USER_STARTED_TASKS + String(userProfile.id)).then((res) => {
        setStartedTasks(res.data);
      }).catch((err) => {
        showToast(err.response.data.message, "danger");
      })
    }
  }, [userProfile, showToast]);

  const handleRedirect = (task_id) => {
    axios.get(routes.GET_PROBLEM + `/${task_id}`).then(response => {
      const problem = response.data;
      navigate(`/problems/${problem.id}/submit`, { state: { problem } });
    })
    .catch(error => {
      showToast(`Error fetching problems: ${error}`, "danger");
    })
  };

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
              <Container className="d-flex">
                <Card.Text className="w-75"><Link><strong onClick={() => handleRedirect(task.task_id)}>{task.name}</strong></Link></Card.Text>
                <Card.Text className="w-25"><strong>Done:</strong> <StatusMark status={task.solve_status} /></Card.Text>
              </Container>
            </Container>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Profile;