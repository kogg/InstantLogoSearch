var _     = require('underscore');
var React = require('react');

module.exports = React.createClass({
	render: function() {
		var logos = _.filter(this.props.logos, function(logo) {
			return _.every(this.props.filters, function(filter) {
				return _.some(logo.name.split(/\s+/), function(name_part) {
					return name_part.toLowerCase().includes(filter);
				});
			});
		}.bind(this));

		return (
			<div className="logos">
				<div className="logos-container">
					<div className="logos-title">
						<h3>Most Popular Logos</h3>
					</div>
					<ul className="flex-grid">
						{logos.map(function(logo) {
							return (
								<li className="brand-logo" key={logo.id}>
									<div className="brand-logo-image">
										<img src={logo.svg_url} />
									</div>
									<div className="brand-logo-ctas">
										<div>
											<strong>{logo.name}</strong>
										</div>
										<div>
											<a href={logo.svg_url} download={logo.name + '.svg'}> [Download SVG]</a>
										</div>
										<div>
											<a href={logo.png_url} download={logo.name + '.png'}> [Download PNG]</a>
										</div>
										<div>
											{
												logo.in_collection ?
													<a href="" onClick={function(e) {
														e.preventDefault();
														this.props.onUncollectLogo(logo);
													}.bind(this)}> [Remove from Collection]</a> :
													<a href="" onClick={function(e) {
														e.preventDefault();
														this.props.onCollectLogo(logo);
													}.bind(this)}> [Add to Collection]</a>
											}
										</div>
									</div>
								</li>
							);
						}.bind(this))}
					</ul>
				</div>
			</div>
		);
	}
});
