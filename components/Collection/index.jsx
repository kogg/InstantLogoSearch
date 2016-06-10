var _                        = require('underscore');
var classNames               = require('classnames');
var connect                  = require('react-redux').connect;
var createSelector           = require('reselect').createSelector;
var createStructuredSelector = require('reselect').createStructuredSelector;
var saveAs                   = process.browser && require('filesaverjs').saveAs;
var JSZip                    = require('jszip');
var React                    = require('react');

var actions = require('../../actions');
var rollbar = require('../../rollbar');
var Popup   = require('../Popup');

var CDN       = process.env.CDN_URL || '';
var FILETYPES = ['svg', 'png'];
var IS_SAFARI = global.window && /Version\/[\d\.]+.*Safari/.test(global.navigator.userAgent);

module.exports = connect(createStructuredSelector({
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
	getInitialState: _.constant({ popup: false }),
	render:          function() {
		return (
			<div className={classNames({
				collection:             true,
				collection_empty:       _.isEmpty(this.props.logos),
				collection_untouchable: this.props.considering
			})}>
				<div className="content-container">
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
									<img src={CDN + logo.svg} alt={logo.name + ' (' + logo.id + ')'} />
									<div className="collection__delete-logo"
										onClick={function(e) {
											e.preventDefault();
											this.uncollectLogo(logo);
										}.bind(this)}></div>
								</li>
							);
						}.bind(this))}
					</ul>
					<div className={classNames({
						collection__ctas:                 true,
						collection__ctas_downloading:     this.state.downloading,
						collection__ctas_downloading_svg: this.state.downloading === 'svg',
						collection__ctas_downloading_png: this.state.downloading === 'png'
					})}>
						{(function() {
							if (!this.props.logos.length) {
								return false;
							}
							if (this.props.logos.length === 1) {
								return _.map(FILETYPES, function(filetype) {
									return (
										<a key={filetype} href={CDN + this.props.logos[0][filetype]} download={this.props.logos[0].name + '.' + filetype} onClick={_.partial(this.downloadedLogos, [this.props.logos[0]], filetype)}>Download {filetype.toUpperCase()}</a>
									);
								}.bind(this));
							}
							return _.map(FILETYPES, function(filetype) {
								return (
									<a key={filetype} download="logos.zip" href={CDN + '/zip?filetype=' + filetype + '&ids[]=' + _.pluck(this.props.logos, 'id').join('&ids[]=')} onClick={function(e) {
										if (IS_SAFARI) {
											return this.downloadedLogos(this.props.logos, filetype);
										}
										e.preventDefault();
										this.setState({ downloading: filetype });
										this.zipAndDownload(this.props.logos, filetype).then(_.partial(this.downloadedLogos, this.props.logos, filetype));
									}.bind(this)}>Download {filetype.toUpperCase()}s</a>
								);
							}.bind(this));
						}.bind(this))()}
					</div>
				</div>
			</div>
		);
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
		this.setState({ downloading: null });
		this.props.dispatch(actions.clearCollection());
		if (logos.length === 1) {
			return this.props.dispatch(actions.downloaded(logos.length));
		}
		this.setState({ popup: true });
		this.props.dispatch(actions.resetDownloaded());
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
	},
	zipAndDownload: function(logos, filetype) {
		var zip = new JSZip();

		return Promise.all(_.map(logos, function(logo) {
			if (!filetype) {
				return Promise.reject(new Error('No Logo type was provided'));
			}
			if (!logo[filetype]) {
				return Promise.reject(new Error('Logo ' + logo.id + ' does not have a ' + filetype));
			}
			return fetch(CDN + logo[filetype])
				.then(function(response) {
					if (response.status < 200 || response.status >= 300) {
						var error = new Error(response.statusText);
						error.response = response;
						throw error;
					}
					return response.arrayBuffer();
				})
				.then(function(data) {
					var h = 0;
					var name;
					do {
						h++;
						name = logo.name + (h === 1 ? '' : ' (' + h + ')') + '.' + filetype;
					} while (zip.file(name));
					zip.file(name, data);
				});
		}))
			.then(function() {
				return zip.generateAsync({ type: 'blob' });
			})
			.then(function(zipContent) {
				saveAs(zipContent, 'logos.zip');
			})
			.catch(function(err) {
				(rollbar.handleError || rollbar.error)(err);
				ga('send', 'exception', { exDescription: err.message, exFatal: true });
				throw err;
			});
	}
}));
