import { useEffect, useState } from "react";
import logo from "./images/logo.svg";

const DashBord = () => {
  const databaseURL = "http://localhost:8000/api/projects/";

  const [projectsArray, setProjectsArray] = useState([]);

  useEffect(() => {
    (async function fetchProjects() {
      const response = await fetch(databaseURL);
      const data = await response.json();
      await setProjectsArray(data);
    })();
  }, []);

  return (
    <div className="dash-bord__main-container">
      <div className="dash-bord__header">
        <h1>Liste de projets</h1>
      </div>
      <div className="dash-bord__grid">
        {projectsArray.length > 0 &&
          projectsArray.map(({ id, name, image }) => (
            <div key={id} className="dash-bord__techno-stat">
              <div className="image-container">
                <img src={image} alt={name}></img>
              </div>
              <h3>{name}</h3>
            </div>
          ))}
      </div>
    </div>
  );
};

export default DashBord;
