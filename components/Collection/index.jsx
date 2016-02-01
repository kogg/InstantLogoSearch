var _              = require('underscore');
var classNames     = require('classnames');
var createSelector = require('reselect').createSelector;
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
										this.props.onToggleCollectLogo(logo);
									}.bind(this)}></div>
							</li>
						);
					}.bind(this))}
				</ul>
				<div className="ctas">
					<a>Download SVGs</a>
					<a>Download PNGs</a>
				</div>
			</div>
		);
	}
});
