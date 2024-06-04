import axios from 'axios';
import { useState, useEffect } from 'react';
import { Container, Col, Card, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import * as routes from '../config/routes';
import '../styles/ProfilePage.css';
import { useToast } from './ToastProvider';
import { FaCheck, FaXmark } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { setJWT } from '../utils/functions';
import ProgressBar from 'react-bootstrap/ProgressBar';

function StatusMark({ status }) {
  return status ? <FaCheck style={{ color: 'green' }} /> : <FaXmark style={{ color: 'red' }} />;
}

function Profile({ loggedIn }) {
  const showToast = useToast();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState('');
  const [startedTasks, setStartedTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [taskDetails, setTaskDetails] = useState([]);
  const [progress, setProgress] = useState(0);
  const [recommendedTasks, setRecommendedTasks] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);


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
    if (userProfile.id) {
      axios.get(routes.GET_USER_STARTED_TASKS + String(userProfile.id)).then((res) => {
        setStartedTasks(res.data);
        getProgress(res.data);
      }).catch((err) => {
        showToast(err.response.data.message, "danger");
      })
    }
  }, [userProfile, showToast]);

  useEffect(() => {
    if (userProfile.id) {
      axios.get(routes.GET_ALL_TASKS_TAGS).then((res) => {
        setAllTasks(res.data);
      }).catch((err) => {
        showToast(err.response.data.message, "danger");
      })
    }
  }, [userProfile, showToast]);

  useEffect(() => {
    if (startedTasks.length > 0) {
      fetchTaskDetails();
    }
  }, [startedTasks]);

  useEffect(() => {
    if (taskDetails.length > 0 && allTasks.length > 0) {
      getTotalPoints();
      getRecommendations();
    }
  }, [taskDetails, allTasks]);

  const fetchTaskDetails = async () => {
    try {
      const p = startedTasks.map(item => axios.get(routes.GET_PROBLEM + `/${item.task_id}`));
      const responses = await Promise.all(p);
      const details = responses.map(res => res.data);
      setTaskDetails(details);
    } catch (error) {
      showToast('Error fetching task details', 'danger');
    }
  }

  const handleRedirect = (task_id) => {
    axios.get(routes.GET_PROBLEM + `/${task_id}`).then(response => {
      const problem = response.data;
      navigate(`/problems/${problem.id}/submit`, { state: { problem } });
    })
      .catch(error => {
        showToast(`Error fetching problems: ${error}`, "danger");
      })
  };

  const getProgress = (data) => {
    const totalTasks = data.length;
    const completedTasks = data.filter(task => task.solve_status).length;
    const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    setProgress(progressPercentage);
  };

  const getTotalPoints = () => {
    const completedTasks = startedTasks.filter(task => task.solve_status);
    const points = completedTasks.reduce((acc, task) => {
      const taskDetail = taskDetails.find(detail => detail.id === task.task_id);
      return acc + (taskDetail ? taskDetail.points : 0);
    }, 0);
    setTotalPoints(points);
  };

  const parseTags = (tagString) => {
    return tagString.split(',').map(tag => tag.trim());
  };

  const getRecommendations = () => {
    const startedTags = taskDetails.flatMap(task => parseTags(task.tags));
    const taskScores = allTasks.map(task => {
      const taskTags = parseTags(task.tags);
      const matchingTags = taskTags.filter(tag => startedTags.includes(tag));
      return { ...task, score: matchingTags.length };
    });
    const filteredTasks = taskScores
      .filter(task => task.score > 0 && !startedTasks.map(item => item.task_id).includes(task.id))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    setRecommendedTasks(filteredTasks);
  };

  return (
    <Container className="font profile-container">
      <h1>Your Profile</h1>
      <p>View your past submissions and performance statistics here.</p>
      <Row>
        <Col md={6}>
          <Card className="profile-card" style={{ minHeight: '300px', display: 'flex', flexDirection: 'column'}}>
            <Card.Header>Profile Details</Card.Header>
            <Card.Body style={{ flex: '1 0 auto' }}>
              <Card.Text><strong>Username:</strong> {userProfile.username}</Card.Text>
              <Card.Text><strong>Points:</strong> {totalPoints}</Card.Text>
            </Card.Body>
            <Card.Subtitle>Percentage of finished tasks to started tasks</Card.Subtitle>
            <Card.Footer>
              <ProgressBar animated now={progress} label={`${parseFloat(progress).toFixed(2)}%`}/>
            </Card.Footer>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="profile-card " style={{ minHeight: '300px', display: 'flex', flexDirection: 'column'}}>
            <Card.Header>Recommended Tasks</Card.Header>
            <Card.Body style={{ flex: '1 0 auto' }}>
              <ul className="recommendation-list">
                {recommendedTasks.map(task => (
                  <li key={task.id} className="recommendation-list-item">
                    <Link onClick={() => handleRedirect(task.id)}><strong>{task.name}</strong></Link>
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>

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