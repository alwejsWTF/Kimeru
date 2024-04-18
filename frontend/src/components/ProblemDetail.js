import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Button, Form } from 'react-bootstrap';

function ProblemDetail({ addAlert }) {
  const [selectedFile, setSelectedFile] = useState('');
  const { id } = useParams();
  const [problem, setProblem] = useState('');

  useEffect(() => {
    setProblem({
      title: 'Problem 1',
      description: 'Description 1',
    });
  }, [id]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      addAlert("Upload solution", "Please select a file to upload.", "info");
      return;
    }

    const formData = new FormData();
    formData.append('sourceCode', selectedFile);
    formData.append('problemId', id);
    console.log(formData)

    try {
      const response = await axios.post(`http://127.0.0.1:5000/problems/${id}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      addAlert("Upload solution", response.data.message, "success");
    } catch (error) {
      console.log(error);
      addAlert("Upload solution", error.response.data.message, "danger");
    }
  };

  return (
    <Container>
      <h1>{problem.title}</h1>
      <p>{problem.description}</p>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Control
            type="file"
            id={`fileUpload-${id}`}
            label="Choose file"
            onChange={handleFileChange}
            accept=".py,.c"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit Solution
        </Button>
      </Form>
    </Container>
  );
}

export default ProblemDetail;
