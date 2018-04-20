import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import App from "./App";
import "./index.css";

// import testData from "./TEST_DATA.json";

let el = document.getElementById("app-props");
let props;
let data;
if (el) {
  props = el.textContent.replace("<![CDATA[", "").replace("]]>", "");
  data = JSON.parse(props);
// } else if (testData) {
  // data = testData;
}

const renderMethod = el
  ? ReactDOM.hydrate
  : ReactDOM.render;

renderMethod(
  <BrowserRouter>
    <I18nextProvider i18n={i18n} initialLanguage={(data && data.locale) || "en-US"}>
      <App {...data}/>
    </I18nextProvider>
  </BrowserRouter>,
  document.getElementById("ph-status")
);
