const path    = require('path');
const fs      = require('fs');
const request = require('request');
const geoip   = require("geoip-lite");

const React = require('react');
const { renderToString } = require('react-dom/server');
const { StaticRouter }   = require('react-router-dom');

const { default: App } = require('../src/App');

const FORECAST_URL = "https://open.propellerhealth.com/prod/forecast";

const propsForRequest = (req, cb) => {
  const geo = geoip.lookup(req.ip);
  if (req.path === "/asthma-conditions") {
    if (geo && geo !== null) {
      const lat = geo.ll[0];
      const lng = geo.ll[1];

      let props = {
        latitude         : lat,
        longitude        : lng,
        forecastLocation : `${geo.city}, ${geo.region}, ${geo.country}`
      };
      request.get(`${FORECAST_URL}?latitude=${lat}&longitude=${lng}`, (err, resp, body) => {
        if (err) return cb(undefined, props);
        const data = JSON.parse(body);

        return cb(undefined, Object.assign({}, props, {
          score: data.properties.value,
          status: data.properties.code.toLowerCase()
        }));
      });
    } else {
      return cb(undefined, {});
    }
  }
  else if (req.path === "/find-my-doctor"){
    if (geo && geo !== null) {
      const lat = geo.ll[0];
      const lng = geo.ll[1];

      let props = {
        latitude  : lat,
        longitude : lng,
        location  : geo.city,
        city      : geo.city
      };
    } else {
      return cb(undefined, {});
    }
  }
  else {
    return cb(undefined, {});
  }
}

module.exports = function universalLoader(req, res) {
  const filePath = path.resolve(__dirname, '..', 'build', 'index.html');

  fs.readFile(filePath, 'utf8', (err, htmlData) => {
    if (err) {
      console.error('read err', err);
      return res.status(404).end();
    }

    propsForRequest(req, (err, props) => {
      const dataProps = JSON.stringify(props);
      const context   = {};

      const markup = (
        `<div>` +
          `<script id='app-props' type='application/json'>` +
            `<![CDATA[${dataProps}]]>` +
          `</script>` +
          `<div>` + renderToString(
            <StaticRouter location={req.url} context={context}>
              <App {...props}/>
            </StaticRouter>
          ) + `</div>` +
        `</div>`
      );

      if (context.url) {
        // Somewhere a `<Redirect>` was rendered
        res.redirect(301, context.url);
      } else {
        // we're good, send the response
        const RenderedApp = htmlData.replace('{{SSR}}', markup);
        res.send(RenderedApp);
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