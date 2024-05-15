import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Collapse, ListGroup, Button, Tooltip, OverlayTrigger, Card, CardBody, CardFooter, Form, FormGroup, FormCheck, CardHeader, CardText } from 'react-bootstrap';
import axios from 'axios';

import * as routes from '../config/routes';
import { useToast } from './ToastProvider';
import '../styles/ProblemsPage.css'

import { FaChevronUp, FaChevronDown } from "react-icons/fa";

function ProblemsPage() {
  const showToast = useToast();
  const [problems, setProblems] = useState([]);
  const [tags, setTags] = useState([]);
  const [chosenTags, setChosenTags] = useState([]);
  const [openId, setOpenId] = useState('');

  useEffect(() => {
    axios.get(routes.GET_ALL_TASKS_TAGS).then(response => {
      setProblems(response.data);
    })
    .catch(error => {
      showToast(`Error fetching problems: ${error}`, "danger");
    })
    axios.get(routes.GET_ALL_TAGS).then(response => {
      setTags(response.data);
    })
    .catch(error => {
      showToast(`Error fetching tags: ${error}`, "danger");
    })
  }, [showToast]);

  const toggleOpen = (id) => {
    if (openId === id) {
      setOpenId('');
    } else {
      setOpenId(id);
    }
  };

  const handleTagChange = (tagId) => {
    if (chosenTags.includes(tagId)) {
      setChosenTags(chosenTags.filter(tag => tag !== tagId));
    } else {
      setChosenTags([...chosenTags, tagId]);
    }
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Click to submit your solution for this problem.
    </Tooltip>
  );

  return (
    <Container className="font problems-container">
      <Row>
        <Col md={4}>
          <Card className="card-tags">
            <CardBody className='card-tags-body'>
              <Card.Header className="card-tags-title text-center">Tags</Card.Header>
              <Form className="card-tags-form">
                <Form.Group controlId="tagsForm">
                  {tags.map(tag => (
                    <Form.Check
                      key={tag.id}
                      id={tag.id}
                      type="checkbox"
                      label={tag.name}
                      checked={chosenTags.includes(tag.id)}
                      onChange={() => handleTagChange(tag.id)}
                    />
                  ))}
                </Form.Group>
              </Form>
              <Card.Footer className='card-tags-footer'>
                <Button variant="success" className="bannerButton">
                  Apply Filters
                </Button>
              </Card.Footer>
            </CardBody>
          </Card>
        </Col>
        <Col md={8}>
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
                        <Card.Subtitle className="my-2">Points: {problem.points} , Tags: {problem.tags}</Card.Subtitle>
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
        </Col>
      </Row>
    </Container>
  );
}

export default ProblemsPage;