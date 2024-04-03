import axios from 'axios'
import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

export default function LoginLayout() {

  let [nickname, setNickname] = useState("");
  let [password, setPassword] = useState("");

  const loginUser = async () => {
    let credentials = {
      "nickname": nickname,
      "password": password
    }
    try {
      const response = await axios.post("http://127.0.0.1:5000/login", credentials);
      let token = response.data.token;
      const get = await axios.get("http://localhost:5000/", { headers: {"Authorization": `Bearer ${token}`} });
      console.log(get);
    } catch(err) {
      console.log(err);
    }
  }

  return (
    <>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Nickname: </Form.Label>
          <Form.Control placeholder="Enter nickname" value={nickname}
           onChange={(e) => {setNickname(e.target.value)}} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password: </Form.Label>
          <Form.Control type="password" placeholder="Enter password" value={password}
           onChange={(e) => {setPassword(e.target.value)}} />
        </Form.Group>
      <Button onClick={loginUser}>Submit</Button>
      </Form>
    </>
  )
}