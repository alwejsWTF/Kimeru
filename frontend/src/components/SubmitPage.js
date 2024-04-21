import axios from 'axios';
import { useState, Suspense } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import CodeEditor from './CodeEditor';
import '../styles/SubmitPage.css';

function SubmitPage({ addAlert }) {
  const [language, setLanguage] = useState('c_cpp');
  const [editorContent, setEditorContent] = useState('');
  const { id } = useParams();

  const handleCodeChange = (newCode) => {
    setEditorContent(newCode);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        setEditorContent(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!editorContent) {
      addAlert("Upload solution", "Please upload file or edit code.", "info");
      return;
    }

    const payload = {
      code: editorContent,
      lang: language === 'c_cpp' ? 'c' : language
    };

    try {
      const response = await axios.post(`http://127.0.0.1:5000/problems/${id}/submit`, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      addAlert("Upload solution", response.data.message, "success");
    } catch (error) {
      console.log(error);
      addAlert("Upload solution", error.response?.data?.message || "Failed to upload code", "danger");
    }
  };

  return (
    <Container>
      <h1 className="my-3 text-center">Submit your solution</h1>
      <Form onSubmit={handleSubmit}>
        <Row className="my-4">
          <Col className="editorContainer">
            <h2 className="editorHeader">Code Editor</h2>
            <Row>
              <Col md={6}>
                <Form.Group controlId="formLanguageSelect">
                  <Form.Label>Select Language</Form.Label>
                  <Form.Control as="select" className="formControl" value={language} onChange={(e) => setLanguage(e.target.value)}>
                    <option value="c_cpp">C</option>
                    <option value="python">Python</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Choose File</Form.Label>
                  <Form.Control
                    type="file"
                    id={`fileUpload-${id}`}
                    label="Choose file"
                    onChange={handleFileChange}
                    accept=".py,.c"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Suspense fallback={<div>Loading...</div>}>
              <CodeEditor className="aceEditor" language={language} value={editorContent} onChange={handleCodeChange} />
            </Suspense>
            <Button variant="primary" type="submit" className="font mt-3 submitButton">
              Submit Solution
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

export default SubmitPage;
