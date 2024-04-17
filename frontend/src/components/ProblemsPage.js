import { useState, useEffect } from 'react';
import { Container, ListGroup } from 'react-bootstrap';
import '../styles/ProblemsPage.css'

function Problems() {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    
    setProblems([
      { id: 1, title: 'Example Problem 1' },
      { id: 2, title: 'Example Problem 2' },
      { id: 3, title: 'Example Problem 3' },
      { id: 4, title: 'Example Problem 4' },
      { id: 5, title: 'Example Problem 5' }
    ]);
  }, []);

  return (
    <Container className="problems-container">
      <h1 className="mb-3">Problems</h1>
      <ListGroup variant="flush">
        {problems.map(problem => (
          <ListGroup.Item 
            action 
            href={`/problems/${problem.id}`} 
            key={problem.id} 
            className="problem-link"
          >
            {problem.title}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
}

export default Problems;