import { useState } from "react";
import "./index.css";
import { Button, Modal, Loader } from "semantic-ui-react";
import noImage from "./images/image.png";

const AddProject = ({ BASEURI, CLOUDINARYURI }) => {
  const [projectImage, setProjectImage] = useState("");
  const [message, setMessage] = useState("");

  const [open, setOpen] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  const loadPhoto = (event) => {
    const choice = event.target.files;
    if (choice && choice[0]) {
      setProjectImage(URL.createObjectURL(choice[0]));
    }
  };

  const cloudinaryUploader = async (event) => {
    const image = event.target.image.files[0];
    let dataForm = new FormData();
    dataForm.append("file", image);
    dataForm.append("upload_preset", "cmsporfolio_images");
    const response = await fetch(CLOUDINARYURI, {
      method: "POST",
      body: dataForm,
    });
    const data = await response.json();
    return data.secure_url;
  };

  const addProject = async (event) => {
    event.preventDefault();
    setIsWaiting(true);
    setOpen(true);
    const { name, description } = event.target;
    const IMAGE = await cloudinaryUploader(event);
    const response = await fetch(BASEURI, {
      method: "POST",
      headers: {
        Accept: "Applicatin/json",
        "content-type": "Application/json",
      },
      body: JSON.stringify({
        NAME: name.value,
        DESCRIPTION: description.value,
        IMAGE,
      }),
    });
    const data = await response.json();
    setIsWaiting(false);
    data.message && setMessage("Project ajouté avec succès");
    resetProject();
  };

  const resetProject = () => {
    setProjectImage("");
    document.querySelector("#name").value = "";
    document.querySelector("#description").value = "";
    document.querySelector("#image").value = "";
  };

  return (
    <>
      <div className="project-header">
        <h1 className="header-message">Espace d'administration</h1>
      </div>
      <form className="form" onSubmit={addProject}>
        <h2>Enregistrer un nouveau project</h2>
        <div className="fields-container">
          <div className="left-side">
            <div className="field-group">
              <label htmlFor="name">Nom du projet</label>
              <br />
              <input id="name" type="text" required />
            </div>
            <div className="field-group">
              <label htmlFor="description">Description du projet</label>
              <br />
              <textarea id="description" required></textarea>
            </div>
          </div>
          <div className="right-side">
            <div className="field-group">
              <img src={projectImage ? projectImage : noImage} alt="project" />
              <br />
              <label htmlFor="image">Télécharger l'mage</label>
              <br />
              <input id="image" type="file" onChange={loadPhoto} required />
            </div>
          </div>
        </div>
        <div className="button-group">
          <button className="ui primary button" type="submit">
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
      {isWaiting ? (
        <Loader indeterminate>Veuillez patienter svp !!!</Loader>
      ) : (
        <Modal
          centered={true}
          open={open}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
        >
          <Modal.Header>Message</Modal.Header>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <Modal.Content>
            <Modal.Description>{message}</Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={() => setOpen(false)}>OK</Button>
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
};

export default AddProject;
