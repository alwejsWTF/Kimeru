import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Collapse, ListGroup, Button, Tooltip, OverlayTrigger, Card, CardBody, CardFooter, Form } from 'react-bootstrap';
import axios from 'axios';

import ProblemDifficultyBar from './ProblemDifficultyBar';
import * as routes from '../config/routes';
import { useToast } from './ToastProvider';
import '../styles/ProblemsPage.css'
import { PiSortAscendingBold, PiSortDescendingBold } from "react-icons/pi";
import { TbSortAscendingLetters,TbSortDescendingLetters  } from "react-icons/tb";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

function ProblemsPage() {
  const showToast = useToast();
  const [problems, setProblems] = useState([]);
  const [allProblems, setAllProblems] = useState([]);
  const [tags, setTags] = useState([]);
  const [chosenTags, setChosenTags] = useState([]);
  const [openId, setOpenId] = useState('');
  const [sortPt, setSortPt] = useState('');
  const [sortName, setSortName] = useState('');

  useEffect(() => {
    axios.get(routes.GET_ALL_TASKS_TAGS).then(response => {
      setAllProblems(response.data);
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

  const handleTagChange = (tagName) => {
    if (chosenTags.includes(tagName)) {
      setChosenTags(chosenTags.filter(tag => tag !== tagName));
    } else {
      setChosenTags([...chosenTags, tagName]);
    }
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Click to submit your solution for this problem.
    </Tooltip>
  );

  const applyFilters = () => {
    if (chosenTags.length === 0) {
      setProblems(allProblems);
    } else {
      const filteredProblems = allProblems.filter(problem => {
        const problemTagsArray = problem.tags.split(',').map(tag => tag.trim());
        return chosenTags.every(tagName => problemTagsArray.includes(tagName));
      });
      setProblems(filteredProblems);
    }
  };

  const clearFilters = () => {
    setChosenTags([]);
    setProblems(allProblems);
  };

  const toggleSortPt = () => {
    const order = sortPt === 'asc' ? 'desc' : 'asc';
    const sortedProblems = [...problems].sort((a, b) => {
      return order === 'asc' ? a.points - b.points : b.points - a.points;
    });
    setSortPt(order);
    setSortName('asc');
    setProblems(sortedProblems);
  };

  const toggleSortName = () => {
    const order = sortName === 'asc' ? 'desc' : 'asc';
    const sortedProblems = [...problems].sort((a, b) => {
      return order === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    });
    setSortPt('desc');
    setSortName(order);
    setProblems(sortedProblems);
  };

  return (
    <Container className="font problems-container">
      <Row>
        <Col md={4}>
          <Card className="card-tags">
            <CardBody className='card-tags-body'>
              <Card.Header className="card-tags-title text-center">Tags</Card.Header>
              <Form className='card-tags-form'>
                <Form.Group controlId="tagsForm">
                  {tags.map(tag => (
                    <Form.Check
                      key={tag.id}
                      id={tag.id}
                      type="checkbox"
                      label={tag.name}
                      checked={chosenTags.includes(tag.name)}
                      onChange={() => handleTagChange(tag.name)}
                    />
                  ))}
                </Form.Group>
              </Form>
              <Card.Footer className='card-tags-footer'>
                <Button variant="success" className="bannerButton" style={{ margin: '5px' }} onClick={clearFilters}>
                  Clear Filters
                </Button>
                <Button variant="success" className="bannerButton" style={{ margin: '5px' }} onClick={applyFilters}>
                  Apply Filters
                </Button>
              </Card.Footer>
            </CardBody>
          </Card>
        </Col>
        <Col md={8}>
          <h1 className="mb-3">Problems</h1>
          <ListGroup.Item className="problems-header d-flex justify-content-between align-items-center">
            <span style={{ marginLeft: '10px' }} onClick={toggleSortName}>
              Name
              {sortName === 'asc' ? <TbSortAscendingLetters/> : <TbSortDescendingLetters/>}
            </span>
            <span style={{ marginRight: '90px' }} onClick={toggleSortPt}>
              Points
              {sortPt === 'desc' ? <PiSortAscendingBold/> : <PiSortDescendingBold/>}
            </span>
          </ListGroup.Item>
          <ListGroup variant="flush">
            {problems.map(problem => (
              <React.Fragment key={problem.id}>
                <ListGroup.Item 
                  action onClick={() => toggleOpen(problem.id)} 
                  className="problem-link d-flex align-items-center justify-content-between"
                >
                  <span>{problem.name}</span>
                  <div className="d-flex align-items-center">
                    <ProblemDifficultyBar points={problem.points}/>
                    {openId === problem.id ? (
                      <FaChevronUp className="ml-2" />
                    ) : (
                      <FaChevronDown className="ml-2" />
                    )}
                  </div>
                </ListGroup.Item>
                <Collapse in={openId === problem.id}>
                  <ListGroup.Item className='trans-bg'>
                    <Card className="text-center">
                      <CardBody>
                        <Card.Header>{problem.name}</Card.Header>
                        <Card.Subtitle className="my-2"><strong>Tags:</strong> {problem.tags}</Card.Subtitle>
                        <Card.Text className="my-4"><strong>Description:</strong> {problem.description}</Card.Text>
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

