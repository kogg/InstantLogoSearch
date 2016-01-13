var ReactDOM = require('react-dom');

var Root  = require('./components/Root');
var Store = require('./store');

var store = Store(JSON.parse(document.getElementById('react-state').innerHTML));

ReactDOM.render(Root(store), document.getElementById('react-app'));
