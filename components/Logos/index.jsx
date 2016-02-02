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
		var timeout;

		return (
			<div className={classNames({
				'logos':              true,
				'logos_extra-bottom': !_.isEmpty(this.props.collection)
			})}>
				<div className="logos-container">
					{_.isEmpty(this.props.filter) && <div className="logos-title">
						<h3>Most Popular Logos</h3>
					</div>}
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
										<a href={logo.svg} download={logo.id + '.svg'}>Download SVG</a>
										<a href={logo.png} download={logo.id + '.png'}>Download PNG</a>
										<a href=""
											onClick={function(e) {
												e.preventDefault();
												clearTimeout(timeout);
												timeout = null;
												this.props.onToggleCollectLogo(logo);
												this.props.onUnconsiderCollectLogo(logo);
											}.bind(this)}
											onMouseMove={function() {
												clearTimeout(timeout);
												timeout = setTimeout(_.partial(this.props.onConsiderCollectLogo, logo), 50);
											}.bind(this)}
											onMouseLeave={function() {
												clearTimeout(timeout);
												timeout = setTimeout(_.partial(this.props.onUnconsiderCollectLogo, logo), 50);
											}.bind(this)}>
											{this.props.collection[logo.id] ? 'Remove from' : 'Add to'} Collection
										</a>
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
