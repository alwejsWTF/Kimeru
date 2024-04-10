import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { NavLink } from 'react-router-dom'

export default function NavigationBar() {

  return (
    <>
      <Navbar className="bg-secondary">
        <Nav className="mx-3">
          <Nav.Link to="/auth" as={NavLink}>Login</Nav.Link>
        </Nav>
      </Navbar>
    </>
  )
}