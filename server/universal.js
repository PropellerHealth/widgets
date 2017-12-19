const path    = require('path');
const fs      = require('fs');
const request = require('request');
const geoip   = require("geoip-lite");

const React = require('react');
const { renderToString } = require('react-dom/server');
const { StaticRouter }   = require('react-router-dom');

const { default: App } = require('../src/App');

const FILE_PATH = path.resolve(__dirname, '..', 'build', 'index.html');

const FORECAST_URL = "https://open.propellerhealth.com/prod/forecast";
const API_HOST     = "http://localhost:8081";

// consider moving this into utilities, only use geoip if going down certain rabbit holes
const returnLocationFromIp = ip => {
  if ( ip ) {
    const geo = geoip.lookup(ip);
    if ( geo ) {
      const latitude          = geo.ll[0];
      const longitude         = geo.ll[1];
      const forecastLocation  = `${geo.city}, ${geo.region}, ${geo.country}`;

      return { latitude, longitude, forecastLocation };
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
};

const propsForRequest = (req, cb) => {
  if (req.path.indexOf("[object%20Object]") > -1) {
    return cb(new Error("Invalid request"));
  }

  if ( req.path === "/asthma-conditions") {
    const props = returnLocationFromIp(req.ip);
    if ( props ) {
      request.get(`${FORECAST_URL}?latitude=${props.latitude}&longitude=${props.longitude}`, (err, resp, body) => {
        if (err) return cb(undefined, props);
        const data = JSON.parse(body);

        return cb(undefined, Object.assign({}, props, {
          score   : data.properties.value,
          status  : data.properties.code.toLowerCase()
        }));
      });
    } else {
      return cb(undefined, {});
    }
  } else if (req.path.substring(0,15) === "/find-my-doctor"){
    const props = returnLocationFromIp(req.ip);

    if ( props ) {
      return cb(undefined, props);
    } else {
      return cb(undefined, {});
    }
  } else if (req.path.indexOf("/patient-summary") === 0) {
    let options = {
      url     : `${API_HOST}/api/reports/${req.params.reportId}/data?accessToken=${req.query.accessToken}`,
      method  : "GET",
      json    : true,
      headers : {
        "x-ph-api-version": "3.25.0"
      }
    };

    request(options, (err, resp, body) => {
      if (err) {
        return cb(err);
      }

      let statusCode = resp && resp.statusCode;

      if (statusCode && (statusCode >= 400 || statusCode < 200)) {
        return cb(new Error(resp.statusMessage || "Server returned an error"));
      }

      return cb(undefined, body);
    });
  } else {
    return cb(undefined, {});
  }
};

module.exports = function universalLoader(req, res) {
  fs.readFile(FILE_PATH, 'utf8', (err, htmlData) => {
    if (err) {
      console.error('read err', err);
      return res.status(500).end();
    }

    propsForRequest(req, (err2, props) => {
      if (err2) return res.status(500).end();

      try {
        const dataProps = JSON.stringify(props);
        const context   = {};

        const markup = (
          `<div>
             <script id='app-props' type='application/json'>
              <![CDATA[${dataProps}]]>
            </script>
            <div>${renderToString(
              <StaticRouter location={req.url} context={context}>
                <App {...props}/>
              </StaticRouter>
            )}</div>
          </div>`
        );

        if (context.url) {
          // Somewhere a `<Redirect>` was rendered
          res.redirect(301, context.url);
        } else {
          // we're good, send the response
          const RenderedApp = htmlData.replace('{{SSR}}', markup);
          res.send(RenderedApp);
        }
      } catch (error) {
        res.status(500).end();
      }
    });
  });
}


// const propsForRequest = (req, cb) => {
//   switch (req.path) {
//     case "/asthma-conditions":
//       // const geo = geoip.lookup("172.102.4.178");
//       const geo = geoip.lookup(req.ip);
//       if (geo) {
//         const lat = geo.ll[0];
//         const lng = geo.ll[1];

//         let props = {
//           latitude         : lat,
//           longitude        : lng,
//           forecastLocation : `${geo.city}, ${geo.region}, ${geo.country}`
//         };
//         request.get(`${FORECAST_URL}?latitude=${lat}&longitude=${lng}`, (err, resp, body) => {
//           if (err) return cb(undefined, props);
//           const data = JSON.parse(body);

//           return cb(undefined, Object.assign({}, props, {
//             score: data.properties.value,
//             status: data.properties.code.toLowerCase()
//           }));
//         });
//       } else {
//         return cb(undefined, {});
//       }
//       break;

//     default:
//       return cb(undefined, {});
//   }
// }