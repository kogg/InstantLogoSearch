var _              = require('underscore');
var classNames     = require('classnames');
var createSelector = require('reselect').createSelector;
var React          = require('react');

var PAGE_SIZE = 20;

module.exports = React.createClass({
	getInitialState: _.constant({ pages: 1 }),
	logos:           createSelector(
		_.property('logos'),
		_.property('filters'),
		function(logos, filters) {
			if (_.isEmpty(filters)) {
				return _.chain(logos)
					.pluck('data')
					.sortBy(function(logo) {
						return -logo.downloads;
					})
					.value();
			}
			return _.chain(logos)
				.map(function(logo) {
					var name = logo.data.name.toLowerCase().replace(/[.\- ]/gi, '');

					return _.defaults({
						pos: _.chain(filters)
							.map(function(filter) {
								return name.indexOf(filter, 0);
							})
							.min()
							.value()
					}, logo);
				})
				.reject(_.matcher({ pos: -1 }))
				.sortBy('pos')
				.pluck('data')
				.value();
		}
	),
	componentDidMount: function() {
		ga('send', 'pageview');
	},
	componentWillReceiveProps: function(nextProps) {
		if (_.isEqual(nextProps.filters, this.props.filters)) {
			return;
		}
		this.setState({ pages: 1 });
	},
	render: function() {
		var logos = this.logos(this.props);

		return (
			<div className={classNames({
				'logos':              true,
				'logos_extra-bottom': !_.isEmpty(this.props.collection)
			})}>
				<div className="logos-container">
					<div className="logos-title">
						<h3>{_.isEmpty(this.props.filters) ? 'Most Popular Logos' : ('Searching for "' + this.props.filters.join('" and "') + '"')}</h3>
					</div>
					<ul className="flex-grid">
						{_.first(logos, this.state.pages * PAGE_SIZE).map(function(logo) {
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
										<a href={logo.svg} download={logo.id + '.svg'} onClick={_.partial(this.downloadedLogo, logo, 'svg')}>Download SVG</a>
										<a href={logo.png} download={logo.id + '.png'} onClick={_.partial(this.downloadedLogo, logo, 'png')}>Download PNG</a>
										<a href=""
											onClick={function(e) {
												e.preventDefault();
												this[this.props.collection[logo.id] ? 'uncollectLogo' : 'collectLogo'](logo);
											}.bind(this)}
											onMouseMove={_.partial(this.replaceTimeout, _.partial(this.props.onConsiderCollectingLogo, logo))}
											onMouseLeave={_.partial(this.replaceTimeout, _.partial(this.props.onUnconsiderCollectingLogo, logo))}>
											{this.props.collection[logo.id] ? 'Remove from' : 'Add to'} Collection
										</a>
									</div>
								</li>
							);
						}.bind(this))}
					</ul>
					{((this.state.pages * PAGE_SIZE) < logos.length) && (
						<div className="load-more">
							<a href="" className="load-more-cta" onClick={function(e) {
								e.preventDefault();
								this.setState({ pages: this.state.pages + 1 });
								ga('send', 'event', 'Dummy', 'Dummy', 'Dummy'); // FIXME
							}.bind(this)}>Show More</a>
						</div>
					)}
				</div>
			</div>
		);
	},
	componentWillUnmount: function() {
		clearTimeout(this.timeout);
	},
	collectLogo: function(logo) {
		clearTimeout(this.timeout);
		this.props.onCollectLogo(logo);
		this.props.onUnconsiderCollectingLogo(logo);
		ga('send', 'event', 'Dummy', 'Dummy', 'Dummy'); // FIXME
	},
	uncollectLogo: function(logo) {
		clearTimeout(this.timeout);
		this.props.onUncollectLogo(logo);
		this.props.onUnconsiderCollectingLogo(logo);
		ga('send', 'event', 'Dummy', 'Dummy', 'Dummy'); // FIXME
	},
	downloadedLogo: function(logo, filetype) {
		this.props.onDownloadedLogo(logo, filetype);
		ga('send', 'event', 'Dummy', 'Dummy', 'Dummy'); // FIXME
	},
	replaceTimeout: function(func) {
		clearTimeout(this.timeout);
		this.timeout = setTimeout(func, 50);
	}
});
