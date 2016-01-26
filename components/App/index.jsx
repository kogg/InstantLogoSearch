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
		return { filters: [''] };
	},
	componentWillMount: function() {
		this.feathers('logo');
	},
	render: function() {
		var logos = _.filter(this.props.logos, function(logo) {
			return _.every(this.state.filters, function(filter) {
				return _.some(logo.name.split(/\s+/), function(name_part) {
					return name_part.toLowerCase().includes(filter);
				});
			});
		}.bind(this));

		return (
			<div>
				<input ref="search" type="text" autoFocus onChange={function() {
					this.setState({ filters: this.refs.search.value.toLowerCase().split(/\s+/) });
				}.bind(this)} />

				<ul>
					{logos.map(function(logo) {
						return <li key={logo.id}>{logo.name}</li>;
					})}
				</ul>
			</div>
		);
	}
}));
