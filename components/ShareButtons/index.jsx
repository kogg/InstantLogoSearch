var React = require('react');

module.exports = React.createClass({
	render: function() {
		return (
			<div className="ShareButtons">
				<a className="social-action social-action-twitter">tweet</a>
				<a className="social-action social-action-facebook">share</a>
				<a className="social-action social-action-github">star</a>
			</div>
		);
	}
});
