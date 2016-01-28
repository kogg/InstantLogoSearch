var _              = require('underscore');
var connect        = require('react-redux').connect;
var createSelector = require('reselect').createSelector;
var FeathersMixin  = require('feathers-react-redux').FeathersMixin;
var React          = require('react');

var actions = require('../../actions');
var Header  = require('../Header');
var Logos   = require('../Logos');

module.exports = connect(createSelector(
	_.property('logos'),
	_.property('collection'),
	function(logos, collection) {
		return {
			logos: _.chain(logos)
				.values()
				.pluck('data')
				.map(function(logo) {
					return _.defaults({ in_collection: collection[logo.id] }, logo);
				})
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
	componentDidMount: function() {
		this.props.dispatch(actions.loadCollection());
	},
	render: function() {
		return (
			<div className="hero">
				<Header onFilter={function(filters) {
					this.setState({ filters: filters });
				}.bind(this)} />
				<Logos logos={this.props.logos} filters={this.state.filters} />
			</div>
		);
	}
}));
