import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

let el = document.getElementById('app-props');
let props;
let data;
if (el) {
  props = el.textContent.replace("<![CDATA[", "").replace("]]>", "");
  data = JSON.parse(props);
}

ReactDOM.render(<App {...data}/>, document.getElementById('ph-status'));
