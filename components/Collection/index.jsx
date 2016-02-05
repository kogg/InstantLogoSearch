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
	componentDidMount: function() {
		this.props.dispatch(actions.loadCollection());
	},
	render: function() {
		return (
			<div className={classNames({
				collection:             true,
				collection_empty:       _.isEmpty(this.props.logos),
				collection_untouchable: this.props.considering
			})}>
				<ul className="collection-row">
					{this.props.logos.map(function(logo) {
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
										ga('ec:addProduct', _.pick(logo, 'id', 'name'));
										ga('ec:setAction', 'remove');
										ga('send', 'event', 'Dummy', 'Dummy', 'Dummy'); // FIXME
										this.props.dispatch(actions.removeFromCollection(logo));
									}.bind(this)}></div>
							</li>
						);
					}.bind(this))}
				</ul>
				{Boolean(this.props.logos.length) && ((this.props.logos.length > 1) ?
					(
						<div className="ctas">
							<a href="" download onClick={function(e) {
								e.preventDefault();
								this.downloadAndZip(this.props.logos, 'svg').then(_.partial(this.downloadedLogos, this.props.logos, 'svg'));
							}.bind(this)}>Download SVGs</a>
							<a href="" download onClick={function(e) {
								e.preventDefault();
								this.downloadAndZip(this.props.logos, 'png').then(_.partial(this.downloadedLogos, this.props.logos, 'png'));
							}.bind(this)}>Download PNGs</a>
						</div>
					) : (
						<div className="ctas">
							<a href={this.props.logos[0].svg} download={this.props.logos[0].id + '.svg'} onClick={_.partial(this.downloadedLogos, [this.props.logos[0]], 'svg')}>Download SVG</a>
							<a href={this.props.logos[0].png} download={this.props.logos[0].id + '.png'} onClick={_.partial(this.downloadedLogos, [this.props.logos[0]], 'png')}>Download PNG</a>
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
				.map(function(promise, i) {
					return promise
						.then(fetch)
						.then(function(response) {
							if (response.status < 200 || response.status >= 300) {
								var error = new Error(response.statusText);
								error.response = response;
								throw error;
							}
							return response.text();
						})
						.then(function(data) {
							zip.file(logos[i].id + '.' + filetype, data);
						});
				})
				.value()
		).then(function() {
			saveAs(zip.generate({ type: 'blob' }), 'logos.zip');
		});

		promise.catch(function(err) {
			error(err);
			ga('send', 'exception', { exDescription: err.message, exFatal: true });
		});

		return promise;
	},
	downloadedLogos: function(logos, filetype) {
		_.each(logos, function(logo) {
			ga('ec:addProduct', _.chain(logo).pick('id', 'name').extend({ variant: filetype }).value());
		});
		ga('ec:setAction', 'purchase', { id: _.times(20, _.partial(_.sample, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-.=+/@#$%^&*_', null)).join('') });
		ga('send', 'event', 'Dummy', 'Dummy', 'Dummy'); // FIXME
		this.props.dispatch(actions.clearCollection());
	}
}));
