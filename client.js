var ReactDOM = require('react-dom');

var app = require('./app');

var state = JSON.parse(document.getElementById('react-state').innerHTML);

ReactDOM.render(app(state), document.getElementById('react-app'));
