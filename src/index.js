import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

let props = document.getElementById('app-props').textContent;
props = props.replace("<![CDATA[", "").replace("]]>", "");
const data = JSON.parse(props);
console.log(data);
console.log(props);

ReactDOM.render(<App {...data}/>, document.getElementById('ph-status'));
