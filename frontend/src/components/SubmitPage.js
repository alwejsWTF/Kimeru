import axios from 'axios';
import { useState, Suspense, useCallback } from 'react';
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import ProblemDifficultyBar from './ProblemDifficultyBar';

import { useToast } from './ToastProvider';
import CodeEditor from './CodeEditor';
import '../styles/SubmitPage.css';
import { setJWT } from '../utils/functions';

function SubmitPage({userID}) {
  const showToast = useToast();
  const location = useLocation();
  const { problem } = location.state || {};
  const [language, setLanguage] = useState('c_cpp');
  const [editorContent, setEditorContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleCodeChange = useCallback((newCode) => {
    setEditorContent(newCode);
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const validExtensions = ['.c', '.cpp', '.py'];
      const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
      if (!validExtensions.includes(fileExtension)) {
        showToast('Invalid file type. Only C and Python files are allowed.', 'danger');
        return;
      }
      const reader = new FileReader();
      reader.onload = function (e) {
        setEditorContent(e.target.result);
      };
      reader.onerror = function () {
        showToast('Error reading file.', 'danger');
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!editorContent) {
      showToast("Please upload file or edit code.", "info");
      return;
    }

    const payload = {
      code: editorContent,
      lang: language === 'c_cpp' ? 'c' : language
    };

    setIsLoading(true); 
    try {
      const response = await axios.post(`http://127.0.0.1:5000/problems/${problem.id}/submit`, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const passedTests = response.data.test_results.filter(result => result).length;
      const totalTests = response.data.test_results.length;
      const passedPercentage = (passedTests / totalTests) * 100;

      let alertType = "success";
      let message = `Great job! All ${passedTests} out of ${totalTests} tests passed.`;

      if (passedPercentage < 100) {
        if (passedPercentage >= 50) {
          alertType = "warning";
          message = `Almost there! ${passedTests} out of ${totalTests} tests passed.`;
        } else {
          alertType = "danger";
          message = `Keep trying! ${passedTests} out of ${totalTests} tests passed.`;
        }
      }
      await axios.post(`http://127.0.0.1:5000/started_tasks/add`, {
          "user_id": userID,
          "task_id": problem.id,
          "status": passedPercentage === 100
      })
      setJWT();

      showToast('(☞ﾟヮﾟ)☞ ' + message, alertType);
    } catch (error) {
      console.log(error);
      showToast(error.response?.data?.message || "Failed to upload code", "danger");
    }
    setIsLoading(false);
  };

  return (
    <Container>
      <h1 className="my-3 text-center">Submit your solution to {problem.name}</h1>
      <Form onSubmit={handleSubmit}>
        <Row className="my-4">
          <Col className="editorContainer">
            <Row>
              <Col md={4}>
                <h2 className="editorHeader">Code Editor</h2>
                <Form.Group controlId="formLanguageSelect">
                  <Form.Label>Select Language</Form.Label>
                  <Form.Control as="select" className="formControl" value={language} onChange={(e) => setLanguage(e.target.value)}>
                    <option value="c_cpp">C</option>
                    <option value="python">Python</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group style={{marginBottom: 25}}>
                  <Form.Label>Choose File</Form.Label>
                  <Form.Control
                    type="file"
                    id={`fileUpload-${problem.id}`}
                    label="Choose file"
                    onChange={handleFileChange}
                    accept=".py,.c"
                  />
                </Form.Group>
              </Col>
              <Col md={1}>
              </Col>
              <Col md={7}>
                <h2 className="editorHeader">Description</h2>
                <p className="description">{problem.description}</p>
                <div className="d-flex align-items-center">
                  <h2 className="editorPoints">Points:</h2>
                  <ProblemDifficultyBar points={problem.points} width={25} height={25} mb={8}/>
                </div>
              </Col>
            </Row>
            <Suspense fallback={<div>Loading...</div>}>
              <CodeEditor className="aceEditor" language={language} value={editorContent} onChange={handleCodeChange} />
            </Suspense>
            {typeof userID !== 'undefined' ? (
              <Button variant="primary" type="submit" className="font mt-3 submitButton" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    <span className="ms-3 sr-only">Submitting...</span>
                  </>
                ) : "Submit Code"}  
              </Button>
            ) : 
              <h4 style={{float: 'right', marginTop: '15px', marginBottom: '0px'}}>
                <strong>Please log in to submit your answer</strong>
              </h4>
            }
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

export default SubmitPage;
