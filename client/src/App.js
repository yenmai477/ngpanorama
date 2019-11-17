import React, { useState, useEffect } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Spinner from "./component/layout/Spinner";
import Particles from "react-particles-js";
//import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import axios from "axios";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";
import "filepond/dist/filepond.min.css";
import NavBar from "./component/layout/NavBar";
import Alert from "./component/layout/Alert";
import About from "./component/pages/About";
import "./App.css";
import "./animate.css";
import GalleryImage from "./component/pages/GalleryImage";
import Footer from "./component/layout/Footer";

registerPlugin(FilePondPluginFileValidateType);

function App() {
  const [items, setItems] = useState([]);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sourceImg, setSourceImg] = useState("");
  const [photos, setPhotos] = useState([]);

  let pond = React.createRef();

  useEffect(() => {
    axios.delete("http://localhost:8000/");

    //eslint-disable-next-line
  }, []);

  const handleOnUpdateFile = fileItems => {
    setItems(fileItems.map(fileItem => fileItem.file.name));
    console.log(fileItems.map(fileItem => fileItem.file.name));
    setAlert(null);
  };
  const handleOnGetPhotos = async () => {
    setLoading(true);
    const { data } = await axios.get("http://localhost:8000/all");
    setPhotos(data);
    setLoading(false);
  };

  const handleOnClick = async () => {
    if (!items.length) {
      setAlert({
        msg: "Please upload images to create panorama",
        type: "danger",
      });
      return;
    } else {
      setLoading(true);

      axios
        .get("http://localhost:8000/result")
        .then(response => {
          let { data, status } = response;
          console.log(status);

          setLoading(false);
          setAlert({
            msg: "Created panorama image sucessfully!",
            type: "success",
          });
          console.log(data);
          setSourceImg(data);
        })
        .catch(err => {
          setAlert({ msg: "Error! Please check images input", type: "danger" });
          setLoading(false);
        });
    }
  };

  const handleOnDelete = (error, item) => {
    const { name: fileName } = item.file;
    axios.delete(`http://localhost:8000/upload/${fileName}`);
  };

  const handleOnClear = () => {
    if (pond && pond.removeFiles) {
      console.log(pond);
      pond.removeFiles();
    }
    setSourceImg("");
    setAlert(null);
    setLoading(false);
    setItems([]);
    axios.delete("http://localhost:8000/");
  };
  return (
    <Router>
      <div className="App">
        <NavBar changeRoute={handleOnClear} />
        <Switch>
          <Route
            exact
            path="/"
            render={props => (
              <div className="site-container text-center mt-5">
                {/* <React.Fragment> */}
                {alert !== null && <Alert alert={alert} />}
                <FilePond
                  className="animated fadeIn"
                  acceptedFileTypes={["image/*"]}
                  ref={ref => (pond = ref)}
                  allowMultiple={true}
                  server={{
                    url: "http://127.0.0.1:8000/",
                    process: "./upload",
                    revert: null,
                  }}
                  onupdatefiles={handleOnUpdateFile}
                  onremovefile={handleOnDelete}
                  //     labelIdle='Drag & Drop your files
                  //   or
                  //  <div><span class="filepond--label-action">Browse</span></div>'
                />
                <button
                  onClick={handleOnClick}
                  className="btn btn-dark mt-2 fix-size-btn animated fadeIn"
                >
                  Create panorama
                </button>
                {(items.length > 0 || sourceImg !== "") && (
                  <button
                    onClick={handleOnClear}
                    className="btn btn-light mt-2 fix-size-btn animated fadeIn "
                  >
                    Clear
                  </button>
                )}
                {loading ? (
                  <Spinner />
                ) : (
                  <img
                    className="mt-5 animated fadeIn img-100"
                    src={sourceImg ? sourceImg : ""}
                    alt=""
                  />
                )}
              </div>
            )}
          />
          <Route exact path="/about" component={About} />
          <Route
            exact
            path="/gallery"
            render={props => (
              <GalleryImage photos={photos} getPhotos={handleOnGetPhotos} />
            )}
          />
        </Switch>
        <Footer />
        <Particles params={particleOpt} />
      </div>
    </Router>
  );
}

const particleOpt = {
  particles: {
    number: {
      value: 500,
      density: {
        enable: false,
      },
    },
    size: {
      value: 3,
      random: true,
      anim: {
        speed: 4,
        size_min: 0.3,
      },
    },
    line_linked: {
      enable: false,
    },
    move: {
      random: true,
      speed: 1,
      direction: "top",
      out_mode: "out",
    },
  },
  interactivity: {
    events: {
      onhover: {
        enable: true,
        mode: "bubble",
      },
      onclick: {
        enable: true,
        mode: "repulse",
      },
    },
    modes: {
      bubble: {
        distance: 250,
        duration: 2,
        size: 0,
        opacity: 0,
      },
      repulse: {
        distance: 400,
        duration: 4,
      },
    },
  },
};

export default App;
