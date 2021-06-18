import { useEffect, useState } from "react";
import logo from "./images/logo.svg";

const DashBord = () => {
  const databaseURL = "https://jp-backoffice.herokuapp.com/api/projects/";
  // const databaseURL = "http://localhost:4000/api/projects";

  const [projectsArray, setProjectsArray] = useState([]);

  useEffect(() => {
    (async function fetchProjects() {
      try {
        const response = await fetch(databaseURL);
        const data = await response.json();
        await setProjectsArray(data.result);
      } catch (error) {
        console.error(error.stack);
      }
    })();
  }, []);

  return (
    <div className="dash-bord__main-container">
      <div className="dash-bord__header">
        <h1>
          Liste de projets{" "}
          <span>{projectsArray.length > 0 && projectsArray.length}</span>
        </h1>
      </div>
      <div className="dash-bord__grid">
        {projectsArray.length > 0 &&
          projectsArray.map(({ ID, NAME, IMAGE }) => (
            <div key={ID} className="flex-column universal-shadow">
              <div className="dash-bord__techno">
                <div className="image-container">
                  <img src={IMAGE} alt={NAME}></img>
                </div>
                <h3>{NAME}</h3>
              </div>

              <div className="techo__controls">
                <p>
                  <button id="update">
                    <i
                      style={{
                        color: "#ffffff",
                        fontSize: "1.3rem",
                      }}
                      className="edit icon"
                    ></i>
                  </button>
                </p>
                <p>
                  <button id="delete">
                    <i
                      style={{
                        color: "#ffffff",
                        fontSize: "1.3rem",
                      }}
                      className="trash icon"
                    ></i>
                  </button>
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default DashBord;
