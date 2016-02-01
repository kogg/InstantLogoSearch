var _              = require('underscore');
var classNames     = require('classnames');
var createSelector = require('reselect').createSelector;
var React          = require('react');

module.exports = React.createClass({
	collectedLogos: createSelector(
		_.property('logos'),
		createSelector(
			_.property('collection'),
			_.keys
		),
		function(logos, collectionAsArray) {
			return _.chain(collectionAsArray)
				.map(_.propertyOf(logos))
				.pluck('data')
				.reverse()
				.value();
		}
	),
	render: function() {
		var collectedLogos = this.collectedLogos(this.props);

		return (
			<div className={classNames({
				collection:       true,
				collection_empty: _.isEmpty(collectedLogos)
			})}>
				<ul className="collection-row">
					{collectedLogos.map(function(logo) {
						return (
							<li className="collection-row-list" key={logo.id}>
								<img src={logo.svg} />
								<div className="collection-delete-item" onClick={function(e) {
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
