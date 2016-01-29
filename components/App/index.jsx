var Helmet = require('react-helmet');
var React  = require('react');

var Messages = require('../Messages');

module.exports = React.createClass({
	render: function() {
		return (
			<div>
				{/* https://github.com/nfl/react-helmet */}
				<Helmet title="Boilerplate" />
				<Messages />
			</div>
		);
	}
});
