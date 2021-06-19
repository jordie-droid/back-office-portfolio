import { useEffect, useState } from "react";
import { Modal } from "semantic-ui-react";
import noImage from "./images/image.png";

const DashBord = ({ BASEURI, CLOUDINARYURI }) => {
  const [projectsArray, setProjectsArray] = useState([]);

  const [open, setOpen] = useState(false);

  const [projectImage, setProjectImage] = useState("");
  const [prevImage, setPrevImage] = useState("");
  const [message, setMessage] = useState("");

  const [fields, setFields] = useState({});

  useEffect(() => {
    (async function fetchProjects() {
      try {
        const response = await fetch(BASEURI);
        const data = await response.json();
        await setProjectsArray(data.result);
      } catch (error) {
        console.error(error.stack);
      }
    })();
  }, [BASEURI]);

  const loadingEdit = (ID, NAME, DESCRIPTION, IMAGE) => {
    setFields({ ID, NAME, DESCRIPTION });
    setProjectImage(IMAGE);
    setMessage("");
    setOpen(true);
    setPrevImage(IMAGE);
  };

  const edit = (event) => {
    event.target.id === "name"
      ? setFields({
          ID: fields.ID,
          NAME: event.target.value,
          DESCRIPTION: fields.DESCRIPTION,
        })
      : setFields({
          ID: fields.ID,
          NAME: fields.NAME,
          DESCRIPTION: event.target.value,
        });
  };

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

  const update = async (event) => {
    event.preventDefault();
    const { name, description } = event.target;
    let IMAGE = prevImage;
    if (prevImage !== projectImage) {
      IMAGE = cloudinaryUploader(event);
    }    
    const response = await fetch(`${BASEURI}${fields.ID}`, {
      method: "PUT",
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
    data.message && setMessage("Project modifié avec succès");
  };

  return (
    <div className="dash-bord__main-container">
      <div className="dash-bord__header">
        <h1>
          <span>{projectsArray.length > 0 && projectsArray.length}</span>{" "}
          {projectsArray.length > 1 ? "projets réalisés" : "project réalisé"}
        </h1>
      </div>
      <div className="dash-bord__grid">
        {projectsArray.length > 0 &&
          projectsArray.map(({ ID, NAME, DESCRIPTION, IMAGE }) => (
            <div key={ID} className="flex-column universal-shadow">
              <div className="dash-bord__techno">
                <div className="image-container">
                  <img src={IMAGE} alt={NAME}></img>
                </div>
                <h3>{NAME}</h3>
              </div>

              <div className="techo__controls">
                <p>
                  <button
                    id="update"
                    onClick={() => loadingEdit(ID, NAME, DESCRIPTION, IMAGE)}
                  >
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
      <Modal
        centered={true}
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
      >
        {message ? (
          <>
            <Modal.Header>Message</Modal.Header> <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <Modal.Content>
              <Modal.Description>{message}</Modal.Description>
            </Modal.Content>
          </>
        ) : (
          <Modal.Content>
            <form className="form" onSubmit={update}>
              <h2>Edition</h2>
              <div className="fields-container">
                <div className="left-side">
                  <div className="field-group">
                    <label htmlFor="name">Nom du projet</label>
                    <br />
                    <input
                      id="name"
                      type="text"
                      value={fields.NAME}
                      onChange={edit}
                      required
                    />
                  </div>
                  <div className="field-group">
                    <label htmlFor="description">Description du projet</label>
                    <br />
                    <textarea
                      id="description"
                      value={fields.DESCRIPTION}
                      onChange={edit}
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="right-side">
                  <div className="field-group">
                    <img
                      src={projectImage ? projectImage : noImage}
                      alt="project"
                    />
                    <br />
                    <label htmlFor="image">Télécharger l'mage</label>
                    <br />
                    <input id="image" type="file" onChange={loadPhoto} />
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
              </div>
            </form>
          </Modal.Content>
        )}
      </Modal>
    </div>
  );
};

export default DashBord;
