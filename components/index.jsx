var React = require('react');

module.exports = React.createClass({
	render: function() {
		return (
			<html>
				<head>
					<title>Instant Logo Search</title>
					<meta charSet="utf-8" />
					<link rel="stylesheet" type="text/css" href={this.props.cacheBuster('css/main.css')} />
				</head>
				<body>
					<div id="react-app" dangerouslySetInnerHTML={{ __html: this.props.markup }} />
					<script id="react-state" type="text/json" dangerouslySetInnerHTML={{ __html: JSON.stringify(this.props.state) }} />
					<script type="text/javascript" src="/socket.io/socket.io.js" />
					<script type="text/javascript" src={this.props.cacheBuster('js/main.js')} async />
				</body>
			</html>
		);
	}
});
