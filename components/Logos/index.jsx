var _              = require('underscore');
var classNames     = require('classnames');
var createSelector = require('reselect').createSelector;
var React          = require('react');

module.exports = React.createClass({
	logos: createSelector(
		createSelector(
			_.property('logos'),
			_.partial(_.pluck, _, 'data')
		),
		function(props) {
			return props.filter.toLowerCase().split(/\s+/);
		},
		function(logos, filters) {
			return _.filter(logos, function(logo) {
				return _.every(filters, function(filter) {
					return _.some(logo.name.split(/\s+/), function(name_part) {
						return name_part.toLowerCase().includes(filter);
					});
				});
			});
		}
	),
	render: function() {
		return (
			<div className="logos">
				<div className="logos-container">
					<div className="logos-title">
						<h3>Most Popular Logos</h3>
					</div>
					<ul className="flex-grid">
						{_.first(this.logos(this.props), 20).map(function(logo) {
							return (
								<li className={classNames({
									'brand-logo':           true,
									'brand-logo_collected': this.props.collection[logo.id]
								})} key={logo.id}>
									<div className="brand-logo-image flex-center">
										<img src={logo.svg} />
									</div>
									<div className="brand-logo-ctas">
										<strong>{logo.name}</strong>
										<a href={logo.svg} download>Download SVG</a>
										<a href={logo.png ? logo.png.url : ('/png?id=' + logo.id)} download>Download PNG</a>
										<a href="" onClick={function(e) {
											e.preventDefault();
											this.props.onToggleCollectLogo(logo);
										}.bind(this)}>{this.props.collection[logo.id] ? 'Remove from' : 'Add to'} Collection</a>
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
