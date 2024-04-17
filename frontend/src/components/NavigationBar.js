import axios from 'axios';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import * as routes from '../config/routes';

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
      <Navbar className="bg-secondary">
        <Nav className="mx-3 container-fluid">
          <Nav.Link to="/" as={NavLink}>Home</Nav.Link>
          <Nav.Link to="/problems" as={NavLink}>Problems</Nav.Link>
          <Nav.Link to="/ranking" as={NavLink}>Ranking</Nav.Link>
          <Nav.Link to="/profile" as={NavLink}>Profile</Nav.Link>
          <Nav.Link className="ms-auto" to="/auth" as={NavLink}>Sign in</Nav.Link>
          <Nav.Link className="ms-auto" onClick={logOut}>Logout</Nav.Link>
        </Nav>
      </Navbar>
    </>
  )
}