import { useEffect, useState } from "react";
// import "semantic-ui-css/semantic.min.css";
import "./index.css";
import { Button, Modal, Loader } from "semantic-ui-react";
import noImage from "./images/image.png";

const AddProject = () => {
  const databaseURL = "http://localhost:8000/api/projects/";
  const cloudinaryUrl =
    "https://api.cloudinary.com/v1_1/doxk0udlk/image/upload";

  const [projectFields, setProjectFields] = useState({});

  const [projectsArray, setProjectsArray] = useState([]);

  const [message, setMessage] = useState(null);

  const [open, setOpen] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  const editProject = (event) => {
    const currentFieldValue = event.target.value;
    const currentFieldName = event.target.id;

    if (currentFieldName === "image") {
      const fileChooser = event.target;
      setProjectFields({
        name: projectFields.name,
        description: projectFields.description,
        image: fileChooser.files[0],
      });
    } else if (currentFieldName === "name") {
      setProjectFields({
        name: currentFieldValue,
        description: projectFields.description,
        image: projectFields.image,
      });
    } else {
      setProjectFields({
        name: projectFields.name,
        description: currentFieldValue,
        image: projectFields.image,
      });
    }
  };

  useEffect(() => {
    (async function fetchProjects() {
      const response = await fetch(databaseURL);
      const data = await response.json();
      await setProjectsArray(data);
    })();
  }, []);

  const searchProject = () => {};

  const createProject = (event) => {
    event.preventDefault();
    const { name, description, image } = projectFields;
    if (
      (name === undefined || description === undefined, image === undefined)
    ) {
      setMessage("Veuillez remplir touts les chanmps");
      return setOpen(true);
    }
    (async function createProject() {
      setIsWaiting(true);
      setOpen(true);
      let data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "cmsporfolio_images");
      let response = await fetch(cloudinaryUrl, {
        method: "POST",
        body: data,
      });
      data = await response.json();
      const imageURL = data.secure_url;

      response = await fetch(databaseURL, {
        method: "POST",
        headers: {
          Accept: "Applicatin/json",
          "content-type": "Application/json",
        },
        body: JSON.stringify({ name, description, imageURL }),
      });
      data = await response.json();
      setIsWaiting(false);
      setMessage(data.message);
      resetProject();
      setProjectsArray(data.results);
    })();
  };

  const updateProject = (id) => {
    alert(id);
  };

  const deleteProject = (id) => {
    alert(id);
  };

  const resetProject = () => {
    setProjectFields({});
  };

  return (
    <>
      <div className="project-header">
        <h1 className="header-message">Espace d'administration</h1>
      </div>
      <form className="form">
        <h2>Enregistrer un nouveau project</h2>
        <div className="fields-container">
          <div className="left-side">
            <div className="field-group">
              <label htmlFor="name">Nom du projet</label>
              <br />
              <input
                id="name"
                type="text"
                value={projectFields.name || ""}
                onChange={editProject}
                required
              />
            </div>
            <div className="field-group">
              <label htmlFor="description">Description du projet</label>
              <br />
              <textarea
                id="description"
                value={projectFields.description || ""}
                onChange={editProject}
                required
              ></textarea>
            </div>
          </div>
          <div className="right-side">
            <div className="field-group">
              <img
                src={
                  projectFields.image
                    ? URL.createObjectURL(projectFields.image)
                    : noImage
                }
                alt="project"
              />
              <br />
              <label htmlFor="image">Télécharger l'mage</label>
              <br />
              <input id="image" type="file" onChange={editProject} required />
            </div>
          </div>
        </div>
        <div className="button-group">
          <button
            className="ui primary button"
            type="submit"
            onClick={createProject}
          >
            <i
              style={{
                color: "#ffffff",
                fontSize: "1.3rem",
              }}
              className="save icon"
            ></i>
          </button>
          <button
            className="ui negative button"
            type="reset"
            onClick={resetProject}
          >
            <i
              style={{
                color: "#ffffff",
                fontSize: "1.3rem",
              }}
              className="redo icon"
            ></i>
          </button>
        </div>
      </form>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {projectsArray.map((project) => {
              return (
                <tr key={project.id}>
                  <td>{project.id}</td>
                  <td>{project.name}</td>
                  <td>{project.description}</td>
                  <td>
                    <div className="project-image">
                      <img
                        src={project.image ? project.image : noImage}
                        alt={project.name}
                      ></img>
                    </div>
                  </td>
                  <td>
                    <button
                      id="update"
                      onClick={() => updateProject(project.id)}
                    >
                      <i
                        style={{
                          color: "#ffffff",
                          fontSize: "1.3rem",
                        }}
                        className="edit icon"
                      ></i>
                    </button>
                  </td>
                  <td>
                    <button
                      id="delete"
                      onClick={() => deleteProject(project.id)}
                    >
                      <i
                        style={{
                          color: "#ffffff",
                          fontSize: "1.3rem",
                        }}
                        className="trash icon"
                      ></i>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal
        centered={true}
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
      >
        {isWaiting ? (
          <Loader indeterminate>Veuillez patienter svp !!!</Loader>
        ) : (
          <>
            <Modal.Header>Message</Modal.Header>
            <Modal.Content>
              <Modal.Description>{message}</Modal.Description>
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={() => setOpen(false)}>OK</Button>
            </Modal.Actions>
          </>
        )}
      </Modal>
    </>
  );
};

export default AddProject;
