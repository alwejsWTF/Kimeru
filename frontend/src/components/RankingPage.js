import { useState, useEffect } from 'react';
import { Container, Table } from 'react-bootstrap';
import '../styles/RankingPage.css';

function sortByPoints(rankings) {
  rankings.sort((a, b) => b.points - a.points);
  return rankings;
}

function Ranking() {
  const [rankings, setRankings] = useState([]);
  const sortedRankings = sortByPoints(rankings);

  useEffect(() => {
    setRankings([
      { username: 'User1', points: 100 },
      { username: 'User2', points: 1200 }, 
      { username: 'User3', points: 1100 },
      { username: 'User4', points: 1100 },
      { username: 'User5', points: 10 },
      { username: 'User6', points: 24 },
      { username: 'User7', points: 12 },
      { username: 'User8', points: 1865 },
      { username: 'User9', points: 101 },
      { username: 'User10', points: 88 }
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
