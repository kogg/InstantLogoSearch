var _              = require('underscore');
var connect        = require('react-redux').connect;
var createSelector = require('reselect').createSelector;
var FeathersMixin  = require('feathers-react-redux').FeathersMixin;
var React          = require('react');

module.exports = connect(createSelector(
	_.property('logos'),
	function(logos) {
		return {
			logos: _.chain(logos)
				.values()
				.pluck('data')
				.sortBy('name')
				.value()
		};
	}
))(React.createClass({
	mixins:          [FeathersMixin],
	getInitialState: function() {
		return {};
	},
	componentWillMount: function() {
		this.feathers('logo');
	},
	render: function() {
		return (
			<ul>
				{this.props.logos.map(function(logo) {
					return <li key={logo.id}>{logo.name}</li>;
				})}
			</ul>
		);
	}
}));
