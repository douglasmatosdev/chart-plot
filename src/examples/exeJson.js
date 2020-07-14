import React from "react";
import Warper from "../Warper";
import Popup from "reactjs-popup";
const contentStyle = {
  maxWidth: "600px",
  width: "90%"
};

const exampleJSON = () => (
  <Popup
    trigger={<button className="button"> Generate chart </button>}
    modal
    contentStyle={contentStyle}
  >
    {close => (
      <div className="modal">
        <a href className="close" onClick={close}>
          &times;
        </a>
        <div className="header"> Please insert data into JSON on the console </div>
        <div className="content">
          {" "}
          This App was developed to plot graphs from JSON data entered manually by the user.
        </div>
        <div className="actions">
          <Popup
            trigger={<button className="button"> Menu example JSON</button>}
            position="top center"
            closeOnDocumentClick
            contentStyle={{ padding: "0px", border: "none" }}
          >
            <div className="menu">
              <div className="menu-item"><exampleJSON /> </div>
              <div className="menu-item"> </div>
            </div>
          </Popup>
          <button className="button"
            onClick={() => {
              console.log("modal closed ");
              close();
            }}
          >
            Close
          </button>
        </div>
      </div>
    )}
  </Popup>
);

export default Warper(exampleJSON);
