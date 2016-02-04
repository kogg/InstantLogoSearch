var fs    = require('fs');
var path  = require('path');
var React = require('react');

var HTMLDoc = React.createClass({
	statics: {
		cacheBuster: function(assetPath) {
			return assetPath + '?' + fs.statSync(path.join(__dirname, '../dist', assetPath)).mtime.getTime().toString(16);
		}
	},
	render: function() {
		return (
			<html>
				<head>
					{this.props.head.base.toComponent()}
					{this.props.head.title.toComponent()}
					<meta charSet="utf-8" />
					{this.props.head.meta.toComponent()}
					<link rel="stylesheet" type="text/css" href={HTMLDoc.cacheBuster('css/main.css')} />
					{this.props.head.link.toComponent()}
					{process.env.GOOGLE_ANALYTICS_ID && <script type="text/javascript" dangerouslySetInnerHTML={{
						__html: '(function(i,s,o,g,r,a,m){i[\'GoogleAnalyticsObject\']=r;i[r]=i[r]||function(){\n' +
							'(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),\n' +
							'm=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)\n' +
							'})(window,document,\'script\',\'//www.google-analytics.com/analytics.js\',\'ga\');\n' +
							'ga(\'create\', \'' + process.env.GOOGLE_ANALYTICS_ID + '\', \'auto\');'
					}} />}
				</head>
				<body>
					<div id="react-app" dangerouslySetInnerHTML={{ __html: this.props.markup }} />
					<script id="react-state" type="text/json" dangerouslySetInnerHTML={{ __html: JSON.stringify(this.props.state) }} />
					{process.env.npm_package_feathersjs_socket && <script type="text/javascript" src="/socket.io/socket.io.js" />}
					<script type="text/javascript" src={HTMLDoc.cacheBuster('js/main.js')} async />
					{this.props.head.script.toComponent()}
				</body>
			</html>
		);
	}
});

module.exports = HTMLDoc;
