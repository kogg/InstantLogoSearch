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
				{/* Once https://github.com/facebook/react/issues/6029 is resolved, we can get rid of is="head" */}
				<head is="head" profile="http://a9.com/-/spec/opensearch/1.1/">
					{this.props.head.base.toComponent()}
					{this.props.head.title.toComponent()}
					<meta charSet="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					{this.props.head.meta.toComponent()}
					<link rel="stylesheet" type="text/css" href={HTMLDoc.cacheBuster('css/main.css')} />
					<link rel="search" type="application/opensearchdescription+xml" href={this.props.domain + '/opensearchdescription.xml'} title={'Seach ' + process.env.npm_package_title} />
					{this.props.head.link.toComponent()}
					{process.env.GOOGLE_ANALYTICS_ID && <script type="text/javascript" dangerouslySetInnerHTML={{
						__html: '(function(i,s,o,g,r,a,m){i[\'GoogleAnalyticsObject\']=r;i[r]=i[r]||function(){' +
							'(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),' +
							'm=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)' +
							'})(window,document,\'script\',\'//www.google-analytics.com/analytics.js\',\'ga\');' +
							'ga(\'create\', \'' + process.env.GOOGLE_ANALYTICS_ID + '\', \'auto\');'
					}} />}
					<link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png" />
					<link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png" />
					<link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png" />
					<link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png" />
					<link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png" />
					<link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png" />
					<link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png" />
					<link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png" />
					<link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png" />
					<link rel="icon" type="image/png" sizes="192x192" href="/android-icon-192x192.png" />
					<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
					<link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
					<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
					<link rel="manifest" href="/manifest.json" />
					<meta name="msapplication-TileColor" content="#ffffff" />
					<meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
					<meta name="theme-color" content="#ffffff" />
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
