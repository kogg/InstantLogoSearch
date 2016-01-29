var fs    = require('fs');
var path  = require('path');
var React = require('react');

module.exports = React.createClass({
	cacheBuster: function(assetPath) {
		return assetPath + '?' + fs.statSync(path.join(__dirname, '../dist', assetPath)).mtime.getTime().toString(16);
	},
	render: function() {
		return (
			<html>
				<head>
					<title>Base App</title>
					<meta charSet="utf-8" />
					<link rel="stylesheet" type="text/css" href={this.cacheBuster('css/main.css')} />
				</head>
				<body>
					<div id="react-app" dangerouslySetInnerHTML={{ __html: this.props.markup }} />
					<script id="react-state" type="text/json" dangerouslySetInnerHTML={{ __html: JSON.stringify(this.props.state) }} />
					<script type="text/javascript" src="/socket.io/socket.io.js" />
					<script type="text/javascript" src={this.cacheBuster('js/main.js')} async />
				</body>
			</html>
		);
	}
});
