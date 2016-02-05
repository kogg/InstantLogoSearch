var _                        = require('underscore');
var classNames               = require('classnames');
var connect                  = require('react-redux').connect;
var createSelector           = require('reselect').createSelector;
var createStructuredSelector = require('reselect').createStructuredSelector;
var React                    = require('react');

var actions = require('../../actions');

var PAGE_SIZE = 20;

module.exports = connect(createStructuredSelector({
	logos:       _.property('logos'),
	collection:  _.property('collection'),
	considering: _.property('considering'),
	searching:   _.property('searching')
}))(React.createClass({
	getInitialState: _.constant({ pages: 1 }),
	logos:           createSelector(
		_.property('logos'),
		createSelector(
			_.property('searching'),
			function(searching) {
				return _.chain(searching.split(/\s+/))
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
	componentDidMount: function() {
		ga('send', 'pageview');
	},
	componentWillReceiveProps: function(nextProps) {
		if (this.props.searching === nextProps.searching) {
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
						<h3>{_.isEmpty(this.props.searching) ? 'Popular Logos' : ('Searching for "' + this.props.searching + '"')}</h3>
					</div>
					<ul className="flex-grid">
						{_.first(logos, this.state.pages * PAGE_SIZE).map(function(logo) {
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
										<a href={logo.svg} download={logo.id + '.svg'} onClick={_.partial(this.downloadedLogo, logo, 'svg')}>Download SVG</a>
										<a href={logo.png} download={logo.id + '.png'} onClick={_.partial(this.downloadedLogo, logo, 'png')}>Download PNG</a>
										<a href=""
											onClick={function(e) {
												e.preventDefault();
												this[this.props.collection[logo.id] ? 'uncollectLogo' : 'collectLogo'](logo);
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
	considerLogo: function(logo) {
		clearTimeout(this.timeout);
		this.timeout = setTimeout(_.partial(_.compose(this.props.dispatch, actions.considerLogo), logo), 50);
	},
	unconsiderLogo: function(logo) {
		clearTimeout(this.timeout);
		this.timeout = setTimeout(_.partial(_.compose(this.props.dispatch, actions.unconsiderLogo), logo), 50);
	},
	collectLogo: function(logo) {
		ga('ec:addProduct', _.pick(logo, 'id', 'name'));
		ga('ec:setAction', 'add');
		ga('send', 'event', 'Dummy', 'Dummy', 'Dummy'); // FIXME
		clearTimeout(this.timeout);
		this.props.dispatch(actions.addToCollection(logo));
		this.props.dispatch(actions.unconsiderLogo(logo));
	},
	uncollectLogo: function(logo) {
		ga('ec:addProduct', _.pick(logo, 'id', 'name'));
		ga('ec:setAction', 'remove');
		ga('send', 'event', 'Dummy', 'Dummy', 'Dummy'); // FIXME
		clearTimeout(this.timeout);
		this.props.dispatch(actions.removeFromCollection(logo));
		this.props.dispatch(actions.unconsiderLogo(logo));
	},
	downloadedLogo: function(logo, filetype) {
		ga('ec:addProduct', _.chain(logo).pick('id', 'name').extend({ variant: filetype }).value());
		ga('ec:setAction', 'purchase', { id: _.times(20, _.partial(_.sample, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-.=+/@#$%^&*_', null)).join('') });
		ga('send', 'event', 'Dummy', 'Dummy', 'Dummy'); // FIXME
	}
}));
