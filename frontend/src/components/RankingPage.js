import { useState, useEffect } from 'react';
import { Container, Table } from 'react-bootstrap';
import '../styles/RankingPage.css';
import * as routes from '../config/routes';
import axios from 'axios';
import { useToast } from './ToastProvider';

function sortByPoints(rankings) {
  rankings.sort((a, b) => b.points - a.points);
  return rankings;
}

function Ranking() {
  const [rankings, setRankings] = useState([]);
  const sortedRankings = sortByPoints(rankings);
  const showToast = useToast();

  useEffect(() => {
    axios.get(routes.GET_RANKING).then((res) => {
      setRankings(res.data);
    }).catch((err) => {
      showToast(err, "danger");
    })
  }, [showToast]);

  return (
    <Container className="ranking-container">
      <h1>Ranking</h1>
      <Table striped bordered hover variant="dark" className="ranking-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {sortedRankings.map((user, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{user.username}</td>
              <td>{user.points}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default Ranking;
