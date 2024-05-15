import React, { useState, useEffect } from 'react';
import { Container, ListGroup, Collapse, Button, Tooltip, OverlayTrigger, Card, CardBody, CardFooter } from 'react-bootstrap';
import axios from 'axios';

import * as routes from '../config/routes';
import { useToast } from './ToastProvider';
import '../styles/ProblemsPage.css'

import { FaChevronUp, FaChevronDown } from "react-icons/fa";

function ProblemsPage() {
  const showToast = useToast();
  const [problems, setProblems] = useState([]);
  const [openId, setOpenId] = useState('');

  useEffect(() => {
    axios.get(routes.GET_ALL_TASKS).then(response => {
      setProblems(response.data);
    })
    .catch(error => {
      showToast(`Error fetching problems: ${error}`, "danger");
    })
  }, [showToast]);

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
              {problem.name}
              {openId === problem.id ? (
                <FaChevronUp className="float-right" />
              ) : (
                <FaChevronDown className="float-right" />
              )}
            </ListGroup.Item>
            <Collapse in={openId === problem.id}>
              <ListGroup.Item className='trans-bg'>
                <Card className="text-center">
                  <CardBody>
                    <Card.Header>{problem.name}</Card.Header>
                    <Card.Subtitle className="my-2">Points: {problem.points} , Tags: {problem.tag}</Card.Subtitle>
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
            </Collapse>
          </React.Fragment>
        ))}
      </ListGroup>
    </Container>
  );
}

export default ProblemsPage;