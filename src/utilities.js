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
  console.log(queryString);
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


export {
  checkStatus,
  API_HEADER,
  checkResponse,
  extractJSON,
  headers,
  isIE11,
  HAS_GEOLOCATE,
  HAS_WINDOW,
  objectFromQueryString
};