import React, { useState, useEffect } from 'react';
import { Container, ListGroup, Collapse, Button, Tooltip, OverlayTrigger, Card, CardBody, CardFooter } from 'react-bootstrap';

import '../styles/ProblemsPage.css'

function ProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [openId, setOpenId] = useState('');
  const problemDescription = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis commodo risus ac dapibus venenatis. Aliquam vulputate mollis nulla ut egestas. Aliquam erat volutpat. Etiam maximus enim elit, sit amet bibendum magna facilisis ut. In tristique odio mi, eget elementum magna fringilla sed. Nunc id massa gravida, consectetur felis id, rhoncus leo. Phasellus placerat, magna et sollicitudin imperdiet, eros nunc dignissim est, dictum tempor odio nibh sit amet quam. Integer luctus risus sapien, luctus dapibus orci convallis ut. Morbi in dignissim turpis. Suspendisse ante nisi, pulvinar ut dolor ac, efficitur lobortis massa. Vivamus ipsum lacus, malesuada at tristique ac, dignissim ac ante. Sed luctus, orci pharetra cursus pharetra, nibh diam euismod dui, non dignissim mauris justo in elit. Etiam arcu turpis, tristique vitae odio a, volutpat vulputate risus. Sed ut ullamcorper augue, sed pretium turpis.';

  useEffect(() => {
    
    setProblems([
      { id: 1, title: 'Example Problem 1', description: problemDescription, tag: 'tag1' },
      { id: 2, title: 'Example Problem 2', description: problemDescription, tag: 'tag2' },
      { id: 3, title: 'Example Problem 3', description: problemDescription, tag: 'tag3' },
      { id: 4, title: 'Example Problem 4', description: problemDescription, tag: 'tag4' },
      { id: 5, title: 'Example Problem 5', description: problemDescription, tag: 'tag5' },
      { id: 6, title: 'Example Problem 6', description: problemDescription, tag: 'tag6' },
      { id: 7, title: 'Example Problem 7', description: problemDescription, tag: 'tag7' },
      { id: 8, title: 'Example Problem 8', description: problemDescription, tag: 'tag8' },
      { id: 9, title: 'Example Problem 9', description: problemDescription, tag: 'tag9' },
      { id: 10, title: 'Example Problem 10', description: problemDescription, tag: 'tag10' }
    ]);
  }, []);

  const toggleOpen = (id) => {
    if (openId === id) {
      setOpenId('');
    } else {
      setOpenId(id);
    }
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Click to submit your solution for evaluation.
    </Tooltip>
  );

  return (
    <Container className="font problems-container">
      <h1 className="mb-3">Problems</h1>
      <ListGroup variant="flush">
        {problems.map(problem => (
          <React.Fragment key={problem.id}>
            <ListGroup.Item action onClick={() => toggleOpen(problem.id)} className="problem-link">
              {problem.title}
              <Button variant="link" className="float-right">Toggle</Button>
            </ListGroup.Item>
            <Collapse in={openId === problem.id}>
            <div>
              <ListGroup.Item className='trans-bg'>
                <Card className="text-center">
                  <CardBody>
                    <Card.Header>{problem.title}</Card.Header>
                    <Card.Subtitle className="my-2">Tag: {problem.tag}</Card.Subtitle>
                    <Card.Text className="my-4">{problem.description}</Card.Text>
                  </CardBody>
                  <CardFooter>
                    <OverlayTrigger
                      placement="right"
                      delay={{ show: 250, hide: 400 }}
                      overlay={renderTooltip}
                    >
                      <Button variant="success" className='bannerButton' href={`/problems/${problem.id}/submit`}>
                        Submit Solution
                      </Button>
                    </OverlayTrigger>
                  </CardFooter>
                </Card>
              </ListGroup.Item>
            </div>
          </Collapse>
        </React.Fragment>
        ))}
      </ListGroup>
    </Container>
  );
}

export default ProblemsPage;