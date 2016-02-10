var React = require('react');

module.exports = React.createClass({
	render: function() {
		return (
			<div className="footer">
				<div className="footer-top flex-spread">
					<div>
						<h4>Instant Logo Search</h4>
					</div>
					<div className="flex">
						<div className="contributors">
							<span>Contributors: </span>
							<a>svg porn</a>
							<a>LogoMono</a>
							<a>flag-icon</a>
						</div>
						<div>
							<a className="social-icon social-icon-twitter"></a>
							<a className="social-icon social-icon-github"></a>
						</div>
					</div>
				</div>
				<div className="footer-bottom flex-spread">
					<div>
						<span>copyright 2016</span>
					</div>
					<div>
						<span>built by kogg</span>
					</div>
				</div>
			</div>
		);
	}
});
