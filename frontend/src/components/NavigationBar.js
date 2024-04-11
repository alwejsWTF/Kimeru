import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { NavLink } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import axios from 'axios'

export default function NavigationBar({token, setToken, addAlert}) {

  const navigate = useNavigate();

  const logOut = async () => {
    const config = {
      headers: {
        Authorization: "Bearer " + token
      }
    }
    try {
      const response = await axios.delete("http://127.0.0.1:5000/logout", config);
      setToken(null);
      console.log(response);
      addAlert("Logout", response.data.message, "success");
      navigate("/");
    } catch(err) {
      addAlert("Logout", err.response.data.message, "danger");
    }
  }

  return (
    <>
      <Navbar className="bg-secondary">
        <Nav className="mx-3 container-fluid">
          <Nav.Link to="/" as={NavLink}>Home</Nav.Link>
          <Nav.Link to="/problems" as={NavLink}>Problems</Nav.Link>
          <Nav.Link to="/ranking" as={NavLink}>Ranking</Nav.Link>
          <Nav.Link to="/profile" as={NavLink}>Profile</Nav.Link>
          <Nav.Link className="ms-auto" hidden={token} to="/auth" as={NavLink}>Sign in</Nav.Link>
          <Nav.Link className="ms-auto" hidden={!token} onClick={logOut}>Logout</Nav.Link>
        </Nav>
      </Navbar>
    </>
  )
}