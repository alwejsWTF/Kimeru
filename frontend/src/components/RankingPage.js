import { useState, useEffect } from 'react';
import { Container, Table } from 'react-bootstrap';
import '../styles/RankingPage.css';

function Ranking() {
  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    setRankings([
      { username: 'User1', points: 100 },
      { username: 'User2', points: 1200 }, 
      { username: 'User3', points: 1100 },
      { username: 'User4', points: 1100 },
      { username: 'User5', points: 10 }
    ]);

  }, []);

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
          {rankings.map((user, index) => (
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
