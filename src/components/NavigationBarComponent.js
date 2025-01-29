import { NavLink } from "react-router-dom";
import tailmatelogo from '../assets/tailmate_logo.png'

const NavigationBarComponent = ({ links = [] }) => {
  return (
    <nav className="tailmate-nav navbar navbar-expand-lg navbar-light bg-light px-4">
      <div className="container">
        <NavLink className="tailmate-logo d-flex align-items-center" to="/">
          <img src={tailmatelogo} alt="Tailmate Logo" />
          TailMate
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        > <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            {links.map(({ to, label }, index) => (
              <li className="nav-item" key={index}>
                <NavLink
                  className="nav-link"
                  to={to}
                  activeClassName="active-link"
                > {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBarComponent;
