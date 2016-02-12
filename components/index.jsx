var fs    = require('fs');
var path  = require('path');
var React = require('react');

var HTMLDoc = React.createClass({
	statics: {
		cacheBuster: function(assetPath, assets_not_dist) {
			return assetPath + '?' + fs.statSync(path.join(__dirname, '..', assets_not_dist ? 'assets' : 'dist', assetPath)).mtime.getTime().toString(16);
		}
	},
	render: function() {
		return (
			<html>
				{/* Once https://github.com/facebook/react/issues/6029 is resolved, we can get rid of is="head" */}
				<head is="head" profile="http://a9.com/-/spec/opensearch/1.1/">
					{this.props.head.base.toComponent()}
					{this.props.head.title.toComponent()}
					<meta charSet="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					{this.props.head.meta.toComponent()}
					<link rel="stylesheet" type="text/css" href={HTMLDoc.cacheBuster('css/main.css')} />
					<link rel="search" type="application/opensearchdescription+xml" href={HTMLDoc.cacheBuster('opensearchdescription.xml', true)} title="Seach Instant Logo Search" />
					{this.props.head.link.toComponent()}
					{process.env.GOOGLE_ANALYTICS_ID && <script type="text/javascript" dangerouslySetInnerHTML={{
						__html: '(function(i,s,o,g,r,a,m){i[\'GoogleAnalyticsObject\']=r;i[r]=i[r]||function(){' +
							'(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),' +
							'm=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)' +
							'})(window,document,\'script\',\'//www.google-analytics.com/analytics.js\',\'ga\');' +
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
