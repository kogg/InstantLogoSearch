var _        = require('underscore');
var LazyLoad = require('react-lazy-load');
var React    = require('react');

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
									<LazyLoad height={140} offset={280}>
										<div className="brand-logo-image">
											<img src={logo.svg.url} />
										</div>
									</LazyLoad>
									<div className="brand-logo-ctas">
										<strong>{logo.name}</strong>
										<a href={logo.svg.url} download> Download SVG</a>
										<a href={logo.png ? logo.png.url : ('/png?id=' + logo.id)} download> Download PNG</a>
										{
											logo.in_collection ?
												<a href="" onClick={function(e) {
													e.preventDefault();
													this.props.onUncollectLogo(logo);
												}.bind(this)}> Remove from Collection</a> :
												<a href="" onClick={function(e) {
													e.preventDefault();
													this.props.onCollectLogo(logo);
												}.bind(this)}> Add to Collection</a>
										}
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
