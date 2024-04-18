import { useState, Suspense } from 'react';
import CodeEditor from './CodeEditor';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import '../styles/ProgramingEnvironment.css';

function ProgrammingEnvironment() {
  const [language, setLanguage] = useState('c_cpp');

  return (
    <Container>
      <Row className="my-4">
        <Col className="editorContainer">
          <h2 className="editorHeader">Code Editor</h2>
          <Form>
            <Form.Group controlId="formLanguageSelect">
              <Form.Label>Select Language</Form.Label>
              <Form.Control as="select" className="formControl" value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="c_cpp">C</option>
                <option value="python">Python</option>
              </Form.Control>
            </Form.Group>
          </Form>
          <Suspense fallback={<div>Loading...</div>}>
            <CodeEditor className="aceEditor" language={language} />
          </Suspense>
          <Button className="mt-3 submitButton">Submit Code</Button>
        </Col>
      </Row>
    </Container>
  );
}

export default ProgrammingEnvironment;
