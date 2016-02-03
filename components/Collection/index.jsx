var _              = require('underscore');
var axios          = require('axios');
var classNames     = require('classnames');
var createSelector = require('reselect').createSelector;
var error          = require('debug')(process.env.npm_package_name + ':application:error');
var saveAs         = process.browser && require('filesaverjs').saveAs;
var JSZip          = require('jszip');
var React          = require('react');

module.exports = React.createClass({
	collectedLogos: createSelector(
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
		function(collectedLogos, logos, considering) {
			if (_.isEmpty(considering)) {
				return collectedLogos;
			}
			var index = _.findIndex(collectedLogos, _.matcher({ id: considering }));
			if (index === -1) {
				return _.union([_.defaults({ considering: 'addition' }, logos[considering].data)], collectedLogos);
			}
			collectedLogos = _.clone(collectedLogos);
			collectedLogos[index] = _.defaults({ considering: 'removal' }, collectedLogos[index]);
			return collectedLogos;
		}
	),
	render: function() {
		var collectedLogos = this.collectedLogos(this.props);

		return (
			<div className={classNames({
				collection:             true,
				collection_empty:       _.isEmpty(collectedLogos),
				collection_untouchable: this.props.considering
			})}>
				<ul className="collection-row">
					{collectedLogos.map(function(logo) {
						return (
							<li key={logo.id} className={classNames({
								'collection-row-list':                      true,
								'collection-row-list_considering_addition': logo.considering === 'addition',
								'collection-row-list_considering_removal':  logo.considering === 'removal'
							})}>
								<img src={logo.svg} />
								<div className="collection-delete-item"
									onClick={function(e) {
										e.preventDefault();
										this.props.onUncollectLogo(logo);
										ga('send', 'event', 'UX', 'click', 'add to cart'); // FIXME
									}.bind(this)}></div>
							</li>
						);
					}.bind(this))}
				</ul>
				{Boolean(collectedLogos.length) && ((collectedLogos.length > 1) ?
					(
						<div className="ctas">
							<a href="" download onClick={function(e) {
								e.preventDefault();
								this.downloadAndZip(collectedLogos, 'svg').then(_.partial(this.downloadedLogos, collectedLogos, 'svg'));
							}.bind(this)}>Download SVGs</a>
							<a href="" download onClick={function(e) {
								e.preventDefault();
								this.downloadAndZip(collectedLogos, 'png').then(_.partial(this.downloadedLogos, collectedLogos, 'png'));
							}.bind(this)}>Download PNGs</a>
						</div>
					) : (
						<div className="ctas">
							<a href={collectedLogos[0].svg} download={collectedLogos[0].id + '.svg'} onClick={_.partial(this.downloadedLogo, collectedLogos[0], 'svg')}>Download SVG</a>
							<a href={collectedLogos[0].png} download={collectedLogos[0].id + '.png'} onClick={_.partial(this.downloadedLogo, collectedLogos[0], 'png')}>Download PNG</a>
						</div>
					))
				}
			</div>
		);
	},
	downloadAndZip: function(logos, filetype) {
		var zip = new JSZip();

		var promise = Promise.all(
			_.chain(logos)
				.map(function(logo) {
					if (!filetype) {
						return Promise.reject(new Error('No Logo type was provided'));
					}
					if (!logo[filetype]) {
						return Promise.reject(new Error('Logo ' + logo.id + ' does not have a ' + filetype));
					}
					return Promise.resolve(logo[filetype]);
				})
				.invoke('then', axios.get)
				.map(function(promise, i) {
					return promise.then(function(response) {
						zip.file(logos[i].id + '.' + filetype, response.data);
					});
				})
				.value()
		).then(function() {
			saveAs(zip.generate({ type: 'blob' }), 'logos.zip');
		});

		promise.catch(function(err) {
			error(err);
			if (err instanceof Error) {
				ga('send', 'exception', { exDescription: err.message, exFatal: true });
			} else {
				// Axios rejects promises but not with an Error when falling outside of 2xx
				ga('send', 'exception', { exDescription: err.status + ' - ' + err.data, exFatal: false });
			}
		});

		return promise;
	},
	downloadedLogo: function(logo, filetype) {
		this.props.onDownloadedLogo(logo, filetype);
		ga('send', 'event', 'UX', 'click', 'add to cart'); // FIXME
	},
	downloadedLogos: function(logos, filetype) {
		this.props.onDownloadedLogos(logos, filetype);
		ga('send', 'event', 'UX', 'click', 'add to cart'); // FIXME
	}
});
