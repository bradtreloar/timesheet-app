import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import { useAuth } from "../context/auth";

const NavbarWrapper: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="navbar-wrapper">
      <Navbar expand="lg">
        <Navbar.Collapse>
          <Nav>
            {isAuthenticated && (
              <Nav.Item>
                <a className="nav-link" onClick={(event) => {
                  event.preventDefault();
                  logout()
                }}>Log out</a>
              </Nav.Item>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default NavbarWrapper;
