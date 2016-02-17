var _                        = require('underscore');
var classNames               = require('classnames');
var connect                  = require('react-redux').connect;
var createSelector           = require('reselect').createSelector;
var createStructuredSelector = require('reselect').createStructuredSelector;
var error                    = require('debug')(process.env.npm_package_name + ':application:error');
var saveAs                   = process.browser && require('filesaverjs').saveAs;
var JSZip                    = require('jszip');
var React                    = require('react');

var actions = require('../../actions');
var Popup   = require('../Popup');

var FILETYPES = ['svg', 'png'];

var Collection = module.exports = connect(createStructuredSelector({
	logos: createSelector(
		createSelector(
			_.property('logos'),
			createSelector(_.property('collection'), _.keys),
			function(logos, collectionAsArray) {
				return _.chain(collectionAsArray)
					.map(_.propertyOf(logos))
					.pluck('data')
					.reverse()
					.value();
			}
		),
		_.property('logos'),
		_.property('considering'),
		function(logos, originalLogos, considering) {
			if (_.isEmpty(considering)) {
				return logos;
			}
			var index = _.findIndex(logos, _.matcher({ id: considering }));
			if (index === -1) {
				return _.union([_.defaults({ considering: 'addition' }, originalLogos[considering].data)], logos);
			}
			logos = _.clone(logos);
			logos[index] = _.defaults({ considering: 'removal' }, logos[index]);
			return logos;
		}
	),
	considering: _.property('considering')
}))(React.createClass({
	statics: {
		fetches: _.object(FILETYPES, _.map(FILETYPES, function() {
			return {};
		}))
	},
	getInitialState:           _.constant({ popup: false }),
	componentWillReceiveProps: function(nextProps) {
		if (_.isEqual(
			_.chain(this.props.logos).reject(_.matcher({ considering: 'addition' })).sortBy('id').pluck('id').value(),
			_.chain(nextProps.logos).reject(_.matcher({ considering: 'addition' })).sortBy('id').pluck('id').value()
		)) {
			return;
		}
		this.setZips(nextProps.logos);
	},
	render: function() {
		var is_safari = window && /Version\/[\d\.]+.*Safari/.test(window.navigator.userAgent);

		return (
			<div className={classNames({
				collection:             true,
				collection_empty:       _.isEmpty(this.props.logos),
				collection_untouchable: this.props.considering
			})}>
				{this.state.popup && <Popup onClose={function() {
					this.setState({ popup: false });
				}.bind(this)} />}
				<ul className="collection__logos">
					{this.props.logos.map(function(logo) {
						return (
							<li key={logo.id} className={classNames({
								collection__logo:                      true,
								collection__logo_considering_addition: logo.considering === 'addition',
								collection__logo_considering_removal:  logo.considering === 'removal'
							})}>
								<img src={logo.svg} alt={logo.name + ' (' + logo.id + ')'} />
								<div className="collection__delete-logo"
									onClick={function(e) {
										e.preventDefault();
										this.uncollectLogo(logo);
									}.bind(this)}></div>
							</li>
						);
					}.bind(this))}
				</ul>
				{Boolean(this.props.logos.length) && ((this.props.logos.length > 1) ?
					(
						<div className="collection__ctas">
							{FILETYPES.map(function(filetype) {
								var zip = this.state[filetype + '_zip'];
								return (
									<a key={filetype} className="collection__cta" download="logos.zip"
										href={zip && (is_safari ? 'data:application/octet-stream;base64,' + zip.generate({ type: 'base64' }) : 'logos.zip')}
										onClick={function(e) {
											if (!zip) {
												return e.preventDefault();
											}
											if (!is_safari) {
												e.preventDefault();
												saveAs(zip.generate({ type: 'blob' }), 'logos.zip');
											}
											this.setState({ popup: true });
											this.downloadedLogos(this.props.logos, filetype);
										}.bind(this)}>Download {filetype.toUpperCase()}s</a>
								);
							}.bind(this))}
						</div>
					) : (
						<div className="collection__ctas">
							{FILETYPES.map(function(filetype) {
								return (
									<a key={filetype} className="collection__cta" download={this.props.logos[0].id + '.' + filetype}
										href={this.props.logos[0][filetype]}
										onClick={_.partial(this.downloadedLogos, [this.props.logos[0]], filetype)}>Download {filetype.toUpperCase()}</a>
								);
							}.bind(this))}
						</div>
					))
				}
			</div>
		);
	},
	componentDidMount: function() {
		this.setZips(this.props.logos);
	},
	componentWillUnmount: function() {
		this.promises = null;
	},
	downloadedLogos: function(logos, filetype) {
		_.each(logos, function(logo) {
			ga(
				'ec:addProduct',
				_.chain(logo)
					.pick('id', 'name')
					.extend({ variant: filetype, quantity: 1 })
					.value()
			);
		});
		ga('ec:setAction', 'purchase', { id: _.times(20, _.partial(_.sample, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-.=+/@#$%^&*_', null)).join('') });
		ga('send', 'event', 'Collection', 'Download ' + filetype.toUpperCase(), null, logos.length);
		this.props.dispatch(actions.clearCollection());
	},
	setZips: function(logos) {
		logos = _.reject(logos, _.matcher({ considering: 'addition' }));

		this.setState(
			_.chain(FILETYPES)
				.map(function(filetype) {
					return filetype + '_zip';
				})
				.object(_.map(FILETYPES, _.constant(null)))
				.value()
		);

		var promises = this.promises = _.map(FILETYPES, function(filetype) {
			return Promise.all(_.map(logos, function(logo) {
				Collection.fetches[filetype][logo.id] = Collection.fetches[filetype][logo.id] || fetch(logo[filetype])
					.then(function(response) {
						if (response.status < 200 || response.status >= 300) {
							var error = new Error(response.statusText);
							error.response = response;
							throw error;
						}
						return response.arrayBuffer();
					})
					.catch(function(err) {
						error(err);
						ga('send', 'exception', { exDescription: err.message, exFatal: true });
						throw err;
					});
				return Collection.fetches[filetype][logo.id];
			})).then(function(results) {
				if (promises !== this.promises) {
					return;
				}
				var zip = new JSZip();
				_.each(logos, function(logo, i) {
					var name;
					var h = 1;
					do {
						name = logo.name + ((h === 1) ? '' : ' (' + h + ')') + '.' + filetype;
						h++;
					} while (zip.file(name));
					zip.file(name, results[i]);
				});
				var obj = {};
				obj[filetype + '_zip'] = zip;
				this.setState(obj);
			}.bind(this));
		}.bind(this));
	},
	uncollectLogo: function(logo) {
		ga(
			'ec:addProduct',
			_.chain(logo)
				.pick('id', 'name')
				.extend({ quantity: 1 })
				.value()
		);
		ga('ec:setAction', 'remove');
		ga('send', 'event', 'Collection', 'Remove from Collection', logo.id);
		this.props.dispatch(actions.removeFromCollection(logo));
	}
}));
