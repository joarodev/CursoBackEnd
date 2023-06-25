import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { NavLink, } from 'react-router-dom';
import NavItem from './NavItem';
import ButtonLogin from '../Buttons/ButtonLogin';


function NavBar() {
  return (
    <>
        <Navbar  key={'sm'} expand={'sm'} className="contNavBar bg-body-tertiary mb-3">
          <Container fluid>
            <NavLink to="/">
                <Navbar.Brand>LOGO</Navbar.Brand>
            </NavLink>
            
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${'sm'}`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${'sm'}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${'sm'}`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${'sm'}`}>
                    Menú
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  <NavItem to="/" name="Home" />
                  <NavItem to="/products" name="Products" />
                  <NavItem to="/cart" name="🛒" />
                </Nav>
                <ButtonLogin />
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
    </>
  );
}

export default NavBar;