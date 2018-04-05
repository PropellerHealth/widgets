require("ignore-styles");
const i18nextMiddleware = require("i18next-express-middleware");
const Backend = require("i18next-node-fs-backend");
const { i18nInstance } = require("./i18n");
const bodyParser = require("body-parser");
const compression = require("compression");
const express = require("express");
const path = require("path");
// const fs = require("fs");

require("babel-register")({
  ignore: /\/(build|node_modules)\//,
  presets: ["env", "react-app"]
});

const index = require("./routes/index");
const api   = require("./routes/api");
const universalLoader = require("./universal");

function initialize(cb){
  i18nInstance
    .use(Backend)
    .use(i18nextMiddleware.LanguageDetector)
    .init({
      preload: [
        "ca-ES",
        "de-DE",
        "en-AU",
        "en-GB",
        "en-US",
        "es-AR",
        "es-ES",
        "es-MX",
        "es-US",
        "fr-CA",
        "fr-FR",
        "it-IT",
        "ko-KR",
        "nl-NL",
        "ru-RU"
      ],
      ns: ["translations", "patient-report"],
      backend: {
        loadPath: path.join(__dirname, "..", "public", "/locales/{{lng}}/{{ns}}.json")
      }
    },
    () => {
      const app = express();
      app.set("trust proxy", true);
      app.use(compression());
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: false }));
      app.use(i18nextMiddleware.handle(i18nInstance));
      app.use("/", index);
      app.use(express.static(path.resolve(__dirname, "..", "build")));
      app.use("/api", api);
      app.use("/", universalLoader);

      return cb(app);
    });
}

module.exports = {
  initialize
};
