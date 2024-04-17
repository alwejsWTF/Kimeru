import axios from 'axios';
import { Navbar, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import * as routes from '../config/routes';
import '../styles/NavigationBar.css'

export default function NavigationBar({addAlert}) {

  const navigate = useNavigate();

  const logOut = async () => {
    try {
      const response = await axios.post(routes.SIGN_OUT, {});
      addAlert("Logout", response.data.message, "success");
      navigate("/");
    } catch(err) {
      addAlert("Logout", err.response.data.message, "danger");
    }
  }

  return (
    <>
      <Navbar expand="md">
        <Navbar.Brand href="/" className="ms-4">SPOJ</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-3 container-fluid">
            <Nav.Link to="/problems" as={NavLink}>Problems</Nav.Link>
            <Nav.Link to="/ranking" as={NavLink}>Ranking</Nav.Link>
            <Nav.Link to="/profile" as={NavLink}>Profile</Nav.Link>
            <Nav.Link to="/environment" as={NavLink}>Code Editor</Nav.Link>
            <Nav.Link className="ms-auto" to="/auth" as={NavLink}>Sign in</Nav.Link>
            <Nav.Link className="ms-auto" onClick={logOut}>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  )
}