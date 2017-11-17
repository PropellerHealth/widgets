if (typeof window === "undefined") {
  global.window = {};
}

if (typeof document === "undefined") {
  global.document = {};
}

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

const isIE11 = !!window.MSInputMethodContext && !!document.documentMode;

const API_HEADER = {
  "Content-Type": "application/x-www-form-urlencoded"
};

// liberated from DTC
const checkResponse = response => response.ok ? response : Promise.reject(response);

export {
  checkStatus,
  API_HEADER,
  checkResponse,
  extractJSON,
  headers,
  isIE11
};