var ReactDOM = require('react-dom');

var webapp = require('./webapp');

var state = JSON.parse(document.getElementById('react-state').innerHTML);

ReactDOM.render(webapp(state), document.getElementById('react-app'));
