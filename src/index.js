import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

let el = document.getElementById("app-props");
let props;
let data;
if (el) {
  props = el.textContent.replace("<![CDATA[", "").replace("]]>", "");
  data = JSON.parse(props);
}

ReactDOM.render(
  <BrowserRouter>
    <App {...data}/>
  </BrowserRouter>,
  document.getElementById("ph-status")
);
