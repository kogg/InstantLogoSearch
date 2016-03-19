var _                        = require('underscore');
var classNames               = require('classnames');
var connect                  = require('react-redux').connect;
var createStructuredSelector = require('reselect').createStructuredSelector;
var React                    = require('react');

var actions        = require('../../actions');
var CarbonAd       = require('../CarbonAd');
var LogoSuggestion = require('../LogoSuggestion');
var Popup          = require('../Popup');

var CDN      = process.env.CDN_URL || '';
var SUGGEST  = 1;
var CARBONAD = 2;

module.exports = connect(createStructuredSelector({
	collection: _.property('collection'),
	untilPopup: _.property('untilPopup')
}))(React.createClass({
	getInitialState: _.constant({ considering: null, popup: false }),
	render:          function() {
		var logosChain = _.chain(this.props.logos).clone();
		if (this.props.suggest) {
			logosChain.push(SUGGEST);
		}
		if (this.props.carbonad) {
			logosChain.splice(3, 0, CARBONAD);
		}

		return (
			<div className="logos">
				<div className="content-container">
					{this.state.popup && <Popup onClose={function() {
						this.setState({ popup: false });
					}.bind(this)} />}
					<div>
						{this.props.heading && (
							<div className="logos__title">
								<h3>{this.props.heading}</h3>
							</div>
						)}
						<ul>
							{logosChain.map(function(logo, i) {
								if (logo === CARBONAD) {
									return <CarbonAd key="carbonad" />;
								}
								if (logo === SUGGEST) {
									return <LogoSuggestion value={this.props.suggest} dispatch={this.props.dispatch} active={!this.props.logos.length} key="suggest" />;
								}
								return (
									<li className={classNames({
										'brand-logo':             true,
										'brand-logo_collected':   this.props.collection && this.props.collection[logo.id],
										'brand-logo_considering': _.isEmpty(this.props.collection) && (this.state.considering === logo.id)
									})} key={logo.id}>
										<div className="brand-logo__image flex-center">
											<img src={CDN + logo.svg} alt={logo.name + ' (' + logo.id + ')'} />
										</div>
										<div className="brand-logo__ctas">
											<strong>{logo.name}</strong>
											<div className="brand-logo__download-ctas">
												<a href={CDN + logo.svg} download={logo.name + '.svg'} onClick={_.partial(this.downloadedLogo, logo, i, 'svg')}>SVG</a>
												<a href={CDN + logo.png} download={logo.name + '.png'} onClick={_.partial(this.downloadedLogo, logo, i, 'png')}>PNG</a>
											</div>
											{this.props.collection && (
												<a className="brand-logo__collection-ctas" href={'/' + logo.shortname}
													onClick={function(e) {
														e.preventDefault();
														this.toggleCollected(logo, i);
													}.bind(this)}
													onMouseMove={_.partial(this.toggleConsiderLogo, logo, true)}
													onMouseLeave={_.partial(this.toggleConsiderLogo, logo, false)}>
													{this.props.collection[logo.id] ? 'Remove from' : 'Add to'} Bucket
												</a>
											)}
										</div>
									</li>
								);
							}.bind(this)).value()}
						</ul>
						{(this.props.loadmore === 'cta') && (
							<div className="logos__load-more">
								<a href="" className="logos__load-more-cta" onClick={function(e) {
									e.preventDefault();
									this.props.onLoadMore('CTA');
								}.bind(this)}>Show More</a>
							</div>
						)}
					</div>
				</div>
			</div>
		);
	},
	componentDidMount: function() {
		if (this.props.loadmore === 'infinite') {
			this.startInfiniteScroll();
		}
	},
	componentDidUpdate: function(prevProps) {
		if ((this.props.loadmore === 'infinite') !== (prevProps.loadmore === 'infinite')) {
			if (this.props.loadmore === 'infinite') {
				this.startInfiniteScroll();
			} else {
				this.stopInfiniteScroll();
			}
		}
	},
	componentWillUnmount: function() {
		clearTimeout(this.timeout);
	},
	downloadedLogo: function(logo, i, filetype) {
		ga(
			'ec:addProduct',
			_.chain(logo)
				.pick('id', 'name')
				.extend({ list: this.props.heading, position: i + 1, variant: filetype, quantity: 1 })
				.value()
		);
		ga('ec:setAction', 'purchase', {
			id:   _.times(20, _.partial(_.sample, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-.=+/@#$%^&*_', null)).join(''),
			list: this.props.heading
		});
		ga('send', 'event', 'Logos', 'Download ' + filetype.toUpperCase(), logo.id, 1);
		this.props.dispatch(actions.downloaded());
		setTimeout(function() {
			if (this.props.untilPopup > 0) {
				return;
			}
			this.setState({ popup: true });
			this.props.dispatch(actions.resetDownloaded());
		}.bind(this));
	},
	startInfiniteScroll: function() {
		var listener = _.throttle(function() {
			if (document.body.scrollTop + window.innerHeight + 20 < document.body.scrollHeight) {
				return;
			}
			this.props.onLoadMore('Infinite Scroll');
		}.bind(this), 500);
		window.addEventListener('scroll', listener);
		window.addEventListener('resize', listener);
		this.stopInfiniteScroll = function() {
			this.stopInfiniteScroll = _.noop;
			window.removeEventListener('scroll', listener);
			window.removeEventListener('resize', listener);
		};
	},
	stopInfiniteScroll: _.noop,
	toggleCollected:    function(logo, i) {
		ga(
			'ec:addProduct',
			_.chain(logo)
				.pick('id', 'name')
				.extend({ list: this.props.heading, position: i + 1, quantity: 1 })
				.value()
		);
		if (this.props.collection[logo.id]) {
			ga('ec:setAction', 'remove', { list: this.props.heading });
			ga('send', 'event', 'Logos', 'Remove from Collection', logo.id);
			this.props.dispatch(actions.removeFromCollection(logo));
		} else {
			ga('ec:setAction', 'add', { list: this.props.heading });
			ga('send', 'event', 'Logos', 'Add to Collection', logo.id);
			this.props.dispatch(actions.addToCollection(logo));
		}
		this.toggleConsiderLogo(logo, false);
	},
	toggleConsiderLogo: function(logo, consider) {
		if (consider && (this.state.considering === logo.id)) {
			return;
		}
		clearTimeout(this.timeout);
		if (consider) {
			this.timeout = setTimeout(function() {
				this.setState({ considering: logo.id });
				this.props.dispatch(actions.considerLogo(logo));
			}.bind(this), 50);
		} else {
			this.timeout = setTimeout(function() {
				this.setState({ considering: null });
				this.props.dispatch(actions.unconsiderLogo(logo));
			}.bind(this), 50);
		}
	}
}));
