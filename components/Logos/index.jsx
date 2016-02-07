var _                        = require('underscore');
var classNames               = require('classnames');
var connect                  = require('react-redux').connect;
var createSelector           = require('reselect').createSelector;
var createStructuredSelector = require('reselect').createStructuredSelector;
var routeActions             = require('react-router-redux').routeActions;
var React                    = require('react');

var actions = require('../../actions');

var PAGE_SIZE = 20;

module.exports = connect(createStructuredSelector({
	routing: _.property('routing'),
	logos:   createSelector(
		_.property('logos'),
		createSelector(
			_.property('searching'),
			function(searching) {
				return _.chain(searching.trim().split(/\s+/))
					.invoke('toLowerCase')
					.invoke('replace', /[.\- ]/gi, '')
					.compact()
					.value();
			}
		),
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
				.sortBy(function(logo) {
					return 1000 * logo.pos - logo.data.downloads;
				})
				.pluck('data')
				.value();
		}
	),
	collection:  _.property('collection'),
	considering: _.property('considering'),
	searching:   _.property('searching')
}))(React.createClass({
	getInitialState:   _.constant({ pages: 1 }),
	componentDidMount: function() {
		this.sendPageView();
	},
	componentWillReceiveProps: function(nextProps) {
		if (this.props.logos === nextProps.logos) {
			return;
		}
		this.setState({ pages: 1 });
	},
	render: function() {
		return (
			<div className={classNames({
				'logos':              true,
				'logos_extra-bottom': !_.isEmpty(this.props.collection)
			})}>
				<div className="logos-container">
					<div className="logos-title">
						<h3>{this.props.searching ? 'Search Results' : 'Popular Logos'}</h3>
					</div>
					<ul className="flex-grid">
						{_.first(this.props.logos, this.state.pages * PAGE_SIZE).map(function(logo, i) {
							return (
								<li className={classNames({
									'brand-logo':             true,
									'brand-logo_collected':   this.props.collection[logo.id],
									'brand-logo_considering': _.isEmpty(this.props.collection) && (this.props.considering === logo.id)
								})} key={logo.id}>
									<div className="brand-logo-image flex-center">
										<img src={logo.svg} />
									</div>
									<div className="brand-logo-ctas">
										<strong>{logo.name}</strong>
										<a href={logo.svg} download={logo.id + '.svg'} onClick={_.partial(this.downloadedLogo, logo, i + 1, 'svg')}>Download SVG</a>
										<a href={logo.png} download={logo.id + '.png'} onClick={_.partial(this.downloadedLogo, logo, i + 1, 'png')}>Download PNG</a>
										<a href=""
											onClick={function(e) {
												e.preventDefault();
												this[this.props.collection[logo.id] ? 'uncollectLogo' : 'collectLogo'](logo, i + 1);
											}.bind(this)}
											onMouseMove={_.partial(this.considerLogo, logo)}
											onMouseLeave={_.partial(this.unconsiderLogo, logo)}>
											{this.props.collection[logo.id] ? 'Remove from' : 'Add to'} Collection
										</a>
									</div>
								</li>
							);
						}.bind(this))}
					</ul>
					{((this.state.pages * PAGE_SIZE) < this.props.logos.length) && (
						<div className="load-more">
							<a href="" className="load-more-cta" onClick={function(e) {
								e.preventDefault();
								_.chain(this.props.logos)
									.rest((this.state.pages + 1) * PAGE_SIZE)
									.first(PAGE_SIZE)
									.each(function(logo, i) {
										ga(
											'ec:addImpression',
											_.chain(logo)
												.pick('id', 'name')
												.extend({
													list:     this.props.searching ? 'Search Results' : 'Popular Logos',
													position: (this.state.pages + 1) * PAGE_SIZE + i + 1
												})
												.value()
										);
									}.bind(this));
								ga('send', 'event', 'Dummy', 'Dummy', 'Dummy'); // FIXME
								this.setState({ pages: this.state.pages + 1 });
							}.bind(this)}>Show More</a>
						</div>
					)}
				</div>
			</div>
		);
	},
	componentDidUpdate: function(prevProps) {
		if (this.props.searching !== prevProps.searching) {
			this.updatePageView();
		}
	},
	componentWillUnmount: function() {
		clearTimeout(this.timeout);
	},
	considerLogo: function(logo) {
		clearTimeout(this.timeout);
		this.timeout = setTimeout(_.partial(_.compose(this.props.dispatch, actions.considerLogo), logo), 50);
	},
	unconsiderLogo: function(logo) {
		clearTimeout(this.timeout);
		this.timeout = setTimeout(_.partial(_.compose(this.props.dispatch, actions.unconsiderLogo), logo), 50);
	},
	collectLogo: function(logo, i) {
		ga(
			'ec:addProduct',
			_.chain(logo)
				.pick('id', 'name')
				.extend({ list: this.props.searching ? 'Search Results' : 'Popular Logos', position: i, quantity: 1 })
				.value()
		);
		ga('ec:setAction', 'add');
		ga('send', 'event', 'Dummy', 'Dummy', 'Dummy'); // FIXME
		clearTimeout(this.timeout);
		this.props.dispatch(actions.addToCollection(logo));
		this.props.dispatch(actions.unconsiderLogo(logo));
	},
	uncollectLogo: function(logo, i) {
		ga(
			'ec:addProduct',
			_.chain(logo)
				.pick('id', 'name')
				.extend({ list: this.props.searching ? 'Search Results' : 'Popular Logos', position: i, quantity: 1 })
				.value()
		);
		ga('ec:setAction', 'remove');
		ga('send', 'event', 'Dummy', 'Dummy', 'Dummy'); // FIXME
		clearTimeout(this.timeout);
		this.props.dispatch(actions.removeFromCollection(logo));
		this.props.dispatch(actions.unconsiderLogo(logo));
	},
	downloadedLogo: function(logo, i, filetype) {
		ga(
			'ec:addProduct',
			_.chain(logo)
				.pick('id', 'name')
				.extend({ list: this.props.searching ? 'Search Results' : 'Popular Logos', position: i, variant: filetype, quantity: 1 })
				.value()
		);
		ga('ec:setAction', 'purchase', { id: _.times(20, _.partial(_.sample, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-.=+/@#$%^&*_', null)).join('') });
		ga('send', 'event', 'Dummy', 'Dummy', 'Dummy'); // FIXME
	},
	updatePageView: _.debounce(function() {
		this.props.dispatch(routeActions.replace(this.props.routing.location.pathname + (this.props.searching ? '?q=' + this.props.searching : '')));
		ga('set', { location: document.location.href, title: document.title });
		this.sendPageView();
	}, 500),
	sendPageView: function() {
		_.chain(this.props.logos)
			.first(this.state.pages * PAGE_SIZE)
			.each(function(logo, i) {
				ga(
					'ec:addImpression',
					_.chain(logo)
						.pick('id', 'name')
						.extend({ list: this.props.searching ? 'Search Results' : 'Popular Logos', position: i })
						.value()
				);
			}.bind(this));
		ga('send', 'pageview');
	}
}));
