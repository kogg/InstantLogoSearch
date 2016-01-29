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
					{this.props.head.base.toComponent()}
					{this.props.head.title.toComponent()}
					<meta charSet="utf-8" />
					{this.props.head.meta.toComponent()}
					<link rel="stylesheet" type="text/css" href={this.cacheBuster('css/main.css')} />
					{this.props.head.link.toComponent()}
				</head>
				<body>
					<div id="react-app" dangerouslySetInnerHTML={{ __html: this.props.markup }} />
					<script id="react-state" type="text/json" dangerouslySetInnerHTML={{ __html: JSON.stringify(this.props.state) }} />
					<script type="text/javascript" src="/socket.io/socket.io.js" />
					<script type="text/javascript" src={this.cacheBuster('js/main.js')} async />
					{this.props.head.script.toComponent()}
				</body>
			</html>
		);
	}
});
