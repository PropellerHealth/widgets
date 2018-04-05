import i18n from "i18next";
import XHR from "i18next-xhr-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import moment from "moment";
import { timeFormatLocale } from "d3-time-format";
import d3Locales from "./d3Locales";

// is there a way to disable trying to load language-only resources? eg. `en`?
i18n
  .use(XHR)
  .use(LanguageDetector)
  .init({
    fallbackLng: {
      ca       : ["ca-ES"],
      de       : ["de-DE"],
      en       : ["en-US"],
      "en-IE"  : ["en-GB"],
      es       : ["es-ES"],
      "es-419" : ["es-US"],
      "es-XL"  : ["es-US"],
      fr       : ["fr-FR"],
      ko       : ["ko-KR"],
      nl       : ["nl-NL"],
      ru       : ["ru-RU"],
      default  : ["en-US"]
    },
    ns: ["translations", "patient-report"],
    defaultNS: "translations",
    debug: false,

    interpolation: {
      escapeValue: false, // not needed for react!!
    },

    // react i18next special options (optional)
    react: {
      wait: false,
      bindI18n: "languageChanged loaded",
      bindStore: "added removed",
      nsMode: "default"
    }
  });

i18n.on("languageChanged", function(lng) {
  moment.locale(lng);
  timeFormatLocale(d3Locales[lng] || d3Locales["en-US"]);
});

export default i18n;
