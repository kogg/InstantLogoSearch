var _                        = require('underscore');
var createSelector           = require('reselect').createSelector;
var createStructuredSelector = require('reselect').createStructuredSelector;
var LazyLoad                 = require('react-lazy-load');
var React                    = require('react');

module.exports = React.createClass({
	massageProps: createStructuredSelector({
		logos: createSelector(
			_.property('logos'),
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
		collectionById: createSelector(
			_.property('collection'),
			function(collection) {
				return _.indexBy(collection, _.identity);
			}
		)
	}),
	render: function() {
		var props = this.massageProps(this.props);

		return (
			<div className="logos">
				<div className="logos-container">
					<div className="logos-title">
						<h3>Most Popular Logos</h3>
					</div>
					<ul className="flex-grid">
						{props.logos.map(function(logo) {
							return (
								<li className="brand-logo" key={logo.id}>
									<LazyLoad height={140} offset={280}>
										<div className="brand-logo-image flex-center">
											<img src={logo.svg} />
										</div>
									</LazyLoad>
									<div className="brand-logo-ctas">
										<strong>{logo.name}</strong>
										<a href={logo.svg} download> Download SVG</a>
										<a href={logo.png ? logo.png.url : ('/png?id=' + logo.id)} download> Download PNG</a>
										<a href="" onClick={function(e) {
											e.preventDefault();
											if (props.collectionById[logo.id]) {
												this.props.onUncollectLogo(logo);
											} else {
												this.props.onCollectLogo(logo);
											}
										}.bind(this)}> {props.collectionById[logo.id] ? 'Remove from' : 'Add to'} Collection</a>
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
