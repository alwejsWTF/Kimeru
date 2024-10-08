import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import '../styles/AuthenticationLayout.css';
import { setJWT } from '../utils/functions';
import * as routes from '../config/routes';

import { useToast } from './ToastProvider';

export default function AuthenticationLayout({ setLoggedIn, setUserID }) {

  let [nickname, setNickname] = useState("");
  let [password, setPassword] = useState("");
  let [authMode, setAuthMode] = useState("login");
  let [formTitle, setFormTitle] = useState("Sign in");
  let [authModeText, setAuthModeText] = useState("Still don't have an account?");
  let [authModeLink, setAuthModeLink] = useState("Sign up");

  const navigate = useNavigate();
  const showToast = useToast();

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
      const response = await axios.post(routes.SIGN_IN, credentials, { withCredentials: true });

      setJWT();
      showToast(response.data.message, "success");
      setLoggedIn(true);
      navigate("/");

      const res = await axios.get(routes.GET_USER_ID);
      setUserID(res.data.user_id);
      setJWT();
    } catch (err) {
      console.log(err);
      showToast(err.response.data.message, "danger")
    }
  }

  const registerUser = async () => {
    let credentials = {
      "nickname": nickname,
      "password": password
    }
    try {
      const response = await axios.post(routes.SIGN_UP, credentials);
      showToast(response.data.message, "success");
      loginUser();
    } catch (err) {
      showToast(err.response.data.message, "danger");
    }
  }

  const performAuthAction = async () => {
    return authMode === "login" ? loginUser() : registerUser();
  }

  return (
    <Container className="font auth-container mt-5">
      <Form className="d-flex flex-column border px-4 py-5 card-background">
        <h1 className="text-center mb-3">{formTitle}</h1>
        <Form.Group className="mb-3">
          <Form.Label>Nickname: </Form.Label>
          <Form.Control placeholder="Enter nickname" value={nickname}
            onChange={(e) => { setNickname(e.target.value) }} />
        </Form.Group>
        <Form.Group className="mb-5">
          <Form.Label>Password: </Form.Label>
          <Form.Control type="password" placeholder="Enter password" value={password}
            onChange={(e) => { setPassword(e.target.value) }} />
        </Form.Group>
        <Form.Text className="text-center mb-4">
          {authModeText} <span type="button" className="text-primary" onClick={changeAuthMode}>{authModeLink}</span>
        </Form.Text>
        <Button onClick={performAuthAction} className='bannerButton'>Submit</Button>
      </Form>
    </Container>
  )
}