var _              = require('underscore');
var classNames     = require('classnames');
var createSelector = require('reselect').createSelector;
var React          = require('react');

var PAGE_SIZE = 20;

function props_filter_to_filters(props) {
	return _.chain(props.filter.split(/\s+/))
		.invoke('toLowerCase')
		.invoke('replace', /[.\- ]/gi, '')
		.compact()
		.value();
}

module.exports = React.createClass({
	getInitialState: _.constant({ pages: 1 }),
	logos:           createSelector(
		_.property('logos'),
		props_filter_to_filters,
		function(logos, filters) {
			if (_.isEmpty(filters)) {
				return _.pluck(logos, 'data');
			}
			return _.chain(logos)
				.mapObject(function(logo) {
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
	componentWillReceiveProps: function(nextProps) {
		if (_.isEqual(props_filter_to_filters(nextProps), props_filter_to_filters(this.props))) {
			return;
		}
		this.setState({ pages: 1 });
	},
	render: function() {
		var timeout;
		var logos   = this.logos(this.props);
		var filters = props_filter_to_filters(this.props);

		return (
			<div className={classNames({
				'logos':              true,
				'logos_extra-bottom': !_.isEmpty(this.props.collection)
			})}>
				<div className="logos-container">
					<div className="logos-title">
						<h3>{_.isEmpty(filters) ? 'Most Popular Logos' : ('Search Results for "' + this.props.filter + '"')}</h3>
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
					{((this.state.pages * PAGE_SIZE) < logos.length) && (
						<div className="load-more">
							<a href="" className="load-more-cta" onClick={function(e) {
								e.preventDefault();
								this.setState({ pages: this.state.pages + 1 });
							}.bind(this)}>Show More</a>
						</div>
					)}
				</div>
			</div>
		);
	}
});
