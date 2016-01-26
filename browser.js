var ReactDOM = require('react-dom');

var Root  = require('./components/Root');
var Store = require('./store');

ReactDOM.render(Root(Store(JSON.parse(document.getElementById('react-state').innerHTML))), document.getElementById('react-app'));
