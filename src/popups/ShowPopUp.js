import React from "react";
import Warper from "../Warper";
import Popup from "reactjs-popup";
import Json from "../Json.json" // importando o modelo de JSON para ser usado para plotar um grafico
import './style.css'
const txtJson =JSON.stringify(Json, null, 1, 't');

const contentStyle = {
  maxWidth: "500px",
  width: "100%"
};

const CustomModal = () => (
  <Popup
    trigger={<button className="button"> Generate chart </button>}
    modal
    contentStyle={contentStyle}
  >

  {close => (
    <div className="modal">
      <a href="true" className="close" onClick={close}> &times; </a>

      <div className="header"> Please copy and paste this code into the console to plot a graph. </div>
      <div className="content" >
        {" "}
        <textarea  style={contentStyle} defaultValue={txtJson}  readOnly rows='30' cols='50'>
          
        </textarea>
      </div>
       
    </div>
  )}

  </Popup>
);

export default Warper(CustomModal);
