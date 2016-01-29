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
			<ul className="logos">
				{logos.map(function(logo) {
					return (
						<li key={logo.id}>
							{logo.name}
							<a href={logo.svg_url} download={logo.name + '.svg'}> [Download SVG]</a>
							<a href={logo.png_url} download={logo.name + '.png'}> [Download PNG]</a>
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
						</li>
					);
				}.bind(this))}
			</ul>
		);
	}
});
