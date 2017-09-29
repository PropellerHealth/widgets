const path = require('path');
const fs = require('fs');

const React = require('react');
const { renderToString } = require('react-dom/server')
const geoip = require("geoip-lite");

const { default: App } = require('../src/App');

module.exports = function universalLoader(req, res) {
  const filePath = path.resolve(__dirname, '..', 'build', 'index.html');

  fs.readFile(filePath, 'utf8', (err, htmlData) => {
    if (err) {
      console.error('read err', err);
      return res.status(404).end();
    }
    const demoIp = "75.100.60.222";
    const geo = geoip.lookup(demoIp); // req.ip
    const props = {
      latitude: geo && geo.ll[0],
      longitude: geo && geo.ll[1],
      location: geo && `${geo.city}, ${geo.region}, ${geo.country}`
    };
    // const markup = renderToString(
    //   <div>
    //     <script id='app-props' type='application/json'>
    //       <![CDATA[${dataProps}]]>
    //     </script>
    //     <App {...props} />
    //   </div>
    // );

    const dataProps = JSON.stringify(props);

    const markup = (
      `<div>` +
        `<script id='app-props' type='application/json'>` +
          `<![CDATA[${dataProps}]]>` +
        `</script>` +
        `<div>` + renderToString(<App {...props}/>) + `</div>` +
      `</div>`
    );

    // we're good, send the response
    const RenderedApp = htmlData.replace('{{SSR}}', markup);
    res.send(RenderedApp);
  });
}