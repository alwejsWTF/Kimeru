import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import '../styles/auth.css';
import getCookie from '../utils/functions';
import * as routes from '../config/routes';

export default function AuthenticationLayout({setLoggedIn, addAlert}) {

  let [nickname, setNickname] = useState("");
  let [password, setPassword] = useState("");
  let [authMode, setAuthMode] = useState("login");
  let [formTitle, setFormTitle] = useState("Sign in");
  let [authModeText, setAuthModeText] = useState("Still don't have an account?");
  let [authModeLink, setAuthModeLink] = useState("Sign up");

  const navigate = useNavigate();

  const changeAuthMode = () => {
    setFormTitle(authMode === "login" ? "Sign up" : "Sign in");
    setAuthModeText(authMode === "login" ? "Already have an account?" 
                                          : "Still don't have an account?");
    setAuthModeLink(authMode === "login" ? "Sign in" : "Sign up");
    setAuthMode(authMode === "login" ? "register" : "login");
  }

  const loginUser = async () => {
    let credentials = {
      "nickname": nickname,
      "password": password
    }
    try {
      const response = await axios.post(routes.SIGN_IN, credentials, {withCredentials: true});

      //change axios settings for POST so it always includes X-CSRF-TOKEN and JWT cookie
      axios.defaults.headers.post["X-CSRF-TOKEN"] = getCookie("csrf_access_token");
      axios.defaults.withCredentials = true;
      addAlert("Login", response.data.message, "success");
      setLoggedIn(true);
      navigate("/");
    } catch(err) {
      console.log(err);
      addAlert("Login", err.response.data.message, "danger")
    }
  }

  const registerUser = async () => {
    let credentials = {
      "nickname": nickname,
      "password": password
    }
    try {
      const response = await axios.post(routes.SIGN_UP, credentials);
      addAlert("Login", response.data.message, "success");
      loginUser();
    } catch(err) {
      addAlert("Register", err.response.data.message, "danger");
    }
  }

  const performAuthAction = async() => {
    return authMode === "login" ? loginUser() : registerUser();
  }

  return (
    <Container className="auth-container mt-5">
      <Form className="d-flex flex-column border px-4 py-5">
        <h1 className="text-center mb-3">{formTitle}</h1>
        <Form.Group className="mb-3">
          <Form.Label>Nickname: </Form.Label>
          <Form.Control placeholder="Enter nickname" value={nickname}
           onChange={(e) => {setNickname(e.target.value)}} />
        </Form.Group>
        <Form.Group className="mb-5">
          <Form.Label>Password: </Form.Label>
          <Form.Control type="password" placeholder="Enter password" value={password}
           onChange={(e) => {setPassword(e.target.value)}} />
        </Form.Group>
        <Form.Text className="text-center mb-4">
          {authModeText} <span type="button" className="text-primary" onClick={changeAuthMode}>{authModeLink}</span>
        </Form.Text>
        <Button onClick={performAuthAction}>Submit</Button>
      </Form>
    </Container>
  )
}