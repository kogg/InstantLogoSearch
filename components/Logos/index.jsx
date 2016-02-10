var _                        = require('underscore');
var classNames               = require('classnames');
var connect                  = require('react-redux').connect;
var createStructuredSelector = require('reselect').createStructuredSelector;
var error                    = require('debug')(process.env.npm_package_name + ':application:error');
var React                    = require('react');

var actions = require('../../actions');

module.exports = connect(createStructuredSelector({
	collection: _.property('collection')
}))(React.createClass({
	getInitialState: _.constant({ considering: null }),
	render:          function() {
		return (
			<div className={classNames({
				'logos':              true,
				'logos_extra-bottom': !_.isEmpty(this.props.collection)
			})}>
				<div className="logos-container">
					{this.props.heading && (
						<div className="logos-title">
							<h3>{this.props.heading}</h3>
						</div>
					)}
					<ul>
						{_.map(this.props.logos, function(logo, i) {
							return (
								<li className={classNames({
									'brand-logo':             true,
									'brand-logo_collected':   this.props.collection[logo.id],
									'brand-logo_considering': _.isEmpty(this.props.collection) && (this.state.considering === logo.id)
								})} key={logo.id}>
									<div className="brand-logo-image flex-center">
										<img src={logo.svg} alt={logo.name + ' (' + logo.id + ')'} />
									</div>
									<div className="brand-logo-ctas">
										<strong>{logo.name}</strong>
										<div className="brand-logo-ctas-download">
											<a href={logo.svg} download={logo.id + '.svg'} onClick={_.partial(this.downloadedLogo, logo, i, 'svg')}>SVG</a>
											<a href={logo.png} download={logo.id + '.png'} onClick={_.partial(this.downloadedLogo, logo, i, 'png')}>PNG</a>
										</div>
										<a className="brand-logo-ctas-collection" href={'/' + logo.shortname}
											onClick={function(e) {
												e.preventDefault();
												this.toggleCollected(logo, i);
											}.bind(this)}
											onMouseMove={_.partial(this.toggleConsiderLogo, logo, true)}
											onMouseLeave={_.partial(this.toggleConsiderLogo, logo, false)}>
											{this.props.collection[logo.id] ? 'Remove from' : 'Add to'} Bucket
										</a>
									</div>
								</li>
							);
						}.bind(this))}
						{this.props.suggest && (
							<li className="brand-logo missing-logo">
								<div className="brand-logo-image"></div>
								<div className="pop-over">
									<div className="suggest">
										<strong>Suggest or Upload a logo</strong>
										<p>What logo or logo variation were you wanting?</p>
										<form className="submit-logo-form" onSubmit={function(e) {
											e.preventDefault();
											ga('send', 'event', 'Logos', 'Suggest Logo', this.refs.suggest_name.value);
											this.suggestLogo(this.refs.suggest_name.value).then(function() {
												this.refs.suggest_name.value = '';
											}.bind(this));
										}.bind(this)}>
											<input className="submit-logo-form-input" placeholder="i.e: facebook circle" type="text" ref="suggest_name" defaultValue={this.props.suggest}/>
											<label htmlFor="file-upload" className="custom-file-upload">Upload SVG*</label>
											<input className="file-upload" id="file-upload" type="file" ref="suggest_file" accept="image/" />
											<input className="submit-logo submit-logo-success" type="submit" />
											<span className="footnote">*Optional but appreciated 😇</span>
										</form>
									</div>
									<div className="success">
										<strong>Success!</strong>
										<p>Thank you so much! We will quickly review your request and try to get something up later today!</p>
										<span className="emoji">😍</span>
										<a className="another-one">submit another one</a>
									</div>
									<div className="error">
										<strong>Error! Error!</strong>
										<p>We're sorry but something went terribly wrong something about what went wrong!</p>
										<span className="emoji">😓</span>
										<a className="another-one">let's try again!</a>
									</div>
								</div>
								<div className="flex-center">
									<div className="">
										<span>Can't find quite what you're looking for? </span>
										<u className="activate-pop-over">Suggest</u>
										<span> a logo or </span>
										<u className="activate-pop-over">upload</u>
										<span> something yourself!</span>
									</div>
								</div>
							</li>
						)}
					</ul>
					{(this.props.loadmore === 'cta') && (
						<div className="load-more">
							<a href="" className="load-more-cta" onClick={function(e) {
								e.preventDefault();
								this.props.onLoadMore('CTA');
							}.bind(this)}>Show More</a>
						</div>
					)}
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
		if ((this.props.suggest !== prevProps.suggest) && this.refs.suggest_name) {
			this.refs.suggest_name.value = this.props.suggest;
		}
		if ((this.props.loadmore === 'infinite') !== (this.props.prevProps === 'infinite')) {
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
		ga('ec:setAction', 'purchase', { id: _.times(20, _.partial(_.sample, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-.=+/@#$%^&*_', null)).join('') });
		ga('send', 'event', 'Logos', 'Download ' + filetype.toUpperCase(), logo.id, 1);
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
	suggestLogo:        function(name) {
		var promise = this.props.dispatch(actions.createSuggestion({ name: name }, {}));

		promise.catch(function(err) {
			error(err);
			ga('send', 'exception', { exDescription: err.message, exFatal: true });
		});

		return promise;
	},
	toggleCollected: function(logo, i) {
		ga(
			'ec:addProduct',
			_.chain(logo)
				.pick('id', 'name')
				.extend({ list: this.props.heading, position: i + 1, quantity: 1 })
				.value()
		);
		if (this.props.collection[logo.id]) {
			ga('ec:setAction', 'remove');
			ga('send', 'event', 'Logos', 'Remove from Collection', logo.id);
			this.props.dispatch(actions.removeFromCollection(logo));
		} else {
			ga('ec:setAction', 'add');
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
