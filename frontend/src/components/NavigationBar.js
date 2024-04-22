import axios from 'axios';
import { Navbar, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import * as routes from '../config/routes';
import { GiPodiumWinner } from "react-icons/gi";
import { FaListUl } from "react-icons/fa6";
import { MdAccountCircle } from "react-icons/md";
import { FiLogIn } from "react-icons/fi";
import { FiLogOut } from "react-icons/fi";

import '../styles/NavigationBar.css'
import { useToast } from './ToastProvider';

export default function NavigationBar({ loggedIn, setLoggedIn }) {

  const navigate = useNavigate();
  const showToast = useToast();

  const logOut = async () => {
    try {
      const response = await axios.post(routes.SIGN_OUT, {});
      showToast(response.data.message, "success");
      setLoggedIn(false);
      navigate("/");
    } catch (err) {
      showToast(err.response.data.message, "danger");
    }
  }

  return (
    <>
      <Navbar expand="md" className="font">
        <Navbar.Brand href="/" className="ms-4">SPOJ</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-3 container-fluid">
            <Nav.Link to="/problems" as={NavLink}>
              <div className="d-flex align-items-center">
                <FaListUl className="d-inline-block me-2" style={{ width: '40px', height: '40px' }} />
                <span>Problems</span>
              </div>
            </Nav.Link>
            <Nav.Link to="/ranking" as={NavLink}>
              <div className="d-flex align-items-center">
                <GiPodiumWinner className="d-inline-block me-2" style={{ width: '40px', height: '40px' }} />
                <span>Ranking</span>
              </div>
            </Nav.Link>
            <Nav.Link to="/profile" as={NavLink} hidden={!loggedIn}>
              <div className="d-flex align-items-center">
                <MdAccountCircle className="d-inline-block me-2" style={{ width: '40px', height: '40px' }} />
                <span>Profile</span>
              </div>
            </Nav.Link>
            <Nav.Link className="ms-auto" hidden={loggedIn} to="/auth" as={NavLink}>
              <div className="d-flex align-items-center">
                <FiLogIn className="d-inline-block me-2" style={{ width: '40px', height: '40px' }} />
                <span>Sign in</span>
              </div>
            </Nav.Link>
            <Nav.Link className="ms-auto" hidden={!loggedIn} onClick={logOut}>
              <div className="d-flex align-items-center">
                <FiLogOut className="d-inline-block me-2" style={{ width: '40px', height: '40px' }} />
                <span>Logout</span>
              </div>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  )
}