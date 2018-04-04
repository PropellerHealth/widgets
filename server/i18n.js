const i18next = require("i18next");

const options = {
  fallbackLng: {
    ca       : ["ca-ES"],
    de       : ["de-DE"],
    "en-IE"  : ["en-GB"],
    es       : ["es-ES"],
    "es-419" : ["es-US"],
    "es-xl"  : ["es-US"],
    fr       : ["fr-FR"],
    ko       : ["ko-KR"],
    nl       : ["nl-NL"],
    ru       : ["ru-RU"],
    default  : ["en-US"]
  },
  ns        : ["translations", "patient-report"],
  defaultNS : "translations",
  debug     : false,

  interpolation: {
    escapeValue: false, // not needed for react!!
  },

  // react i18next special options (optional)
  react: {
    wait      : false,
    bindI18n  : "languageChanged loaded",
    bindStore : "added removed",
    nsMode    : "default"
  }
};

const i18nInstance = i18next;

if (!i18nInstance.isInitialized) i18nInstance.init(options);

const getInitialProps = (req, namespaces) => {
  if (!namespaces) namespaces = i18nInstance.options.defaultNS;
  if (typeof namespaces === "string") namespaces = [namespaces];

  req.i18n.toJSON = () => null; // do not serialize i18next instance and send to client

  const initialI18nStore = {};
  req.i18n.languages.forEach((l) => {
    initialI18nStore[l] = {};
    namespaces.forEach((ns) => {
      initialI18nStore[l][ns] = (req.i18n.services.resourceStore.data[l] || {})[ns] || {};
    });
  });

  return {
    i18n: req.i18n, // use the instance on req - fixed language on request (avoid issues in race conditions with lngs of different users)
    initialI18nStore,
    initialLanguage: req.i18n.language
  };
};

module.exports = {
  getInitialProps,
  i18nInstance,
  I18n: i18next.default
};