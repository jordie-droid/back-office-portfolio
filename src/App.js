import { Link, NavLink, Route } from "react-router-dom";
import AddProject from "./AddProject";
import "semantic-ui-css/semantic.min.css";
import logo from "./images/logo.svg";
import DashBord from "./DashBord";

const App = () => {
  const BASEURI = "https://jp-backoffice.herokuapp.com/api/projects/";
  const CLOUDINARYURI =
    "https://api.cloudinary.com/v1_1/doxk0udlk/image/upload";
  return (
    <>
      <div className="header">
        <div className="left-side">
          <Link to="/">
            <img src={logo} alt="logo du back office"></img>
          </Link>
        </div>
        <div className="right-side">
          <input
            id="research"
            type="text"
            placeholder="Rechercher un projet"
            required
          />
          <i className="search icon"></i>
        </div>
      </div>

      <div className="main-container">
        <div className="aside-menu">
          <ul>
            <li>
              <NavLink exact to="/" activeClassName="actived">
                <i className="list icon"></i>Liste de projets
              </NavLink>
            </li>
            <li>
              <NavLink exact to="/addProject" activeClassName="actived">
                <i className="calendar alternate icon"></i>
                Ajouter projet
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="components-container">
          <Route
            exact
            path="/"
            component={() => (
              <DashBord BASEURI={BASEURI} CLOUDINARYURI={CLOUDINARYURI} />
            )}
          />
          <Route
            exact
            path="/addProject"
            component={() => (
              <AddProject BASEURI={BASEURI} CLOUDINARYURI={CLOUDINARYURI} />
            )}
          />
        </div>
      </div>
    </>
  );
};

export default App;
