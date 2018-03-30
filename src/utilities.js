function checkStatus(response) {
  // console.log(response);
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    var error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

function extractJSON(response) {
  return response.json();
}

const headers = {
  "Content-Type": "application/json"
};

const HAS_WINDOW = "undefined" !== typeof window;

const isIE11 = HAS_WINDOW && !!window.MSInputMethodContext && !!document.documentMode;

const HAS_GEOLOCATE = HAS_WINDOW && window.navigator && "geolocation" in window.navigator;

const API_HEADER = {
  "Content-Type": "application/x-www-form-urlencoded"
};

// liberated from DTC
const checkResponse = response => response.ok ? response : Promise.reject(response);

const objectFromQueryString = queryString => {
  return queryString
    .substring(1)
    .split("&")
    .reduce((o, query) => {
      if (!!query) {
        let parts = query.split("=");
        o[parts[0]] = !o[parts[0]]
          ? decodeURIComponent(parts[1])
          : [].concat(o[parts[0]], decodeURIComponent(parts[1]));
      }
      return o;
    }, {});
};

const COLORS = {
  blue      : "#20C3F3",
  purple    : "#6b1671",
  green     : "#40AD00",
  deepRed   : "#D70000",
  red       : "#EE0037",
  yellow    : "yellow",
  orange    : "#FF7500",
  grey      : "#888B8D",
  darkGrey  : "#333",
  lightGrey : "#C0C0C0",
  lightestGrey : "#E0E0E0",
  brown     : "#823700"
};

const sortDates = (a, b) => {
  const _a = a.date,
    _b = b.date;
  return _a > _b ? 1 : _a < _b ? -1 : 0;
};

const precisionRound = function precisionRound(number, precision) {
  var factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
};

export {
  checkStatus,
  API_HEADER,
  checkResponse,
  extractJSON,
  headers,
  isIE11,
  HAS_GEOLOCATE,
  HAS_WINDOW,
  objectFromQueryString,
  COLORS,
  sortDates,
  precisionRound
};
