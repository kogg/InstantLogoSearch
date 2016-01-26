var _              = require('underscore');
var connect        = require('react-redux').connect;
var createSelector = require('reselect').createSelector;
var FeathersMixin  = require('feathers-react-redux').FeathersMixin;
var React          = require('react');

var actions = require('../../actions');

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
						return (
							<li key={logo.id}>
								{logo.name}
								{
									logo.in_collection ?
										<a href="" onClick={function(e) {
											e.preventDefault();
											this.props.dispatch(actions.removeFromCollection(logo));
										}.bind(this)}> Remove from Collection</a> :
										<a href="" onClick={function(e) {
											e.preventDefault();
											this.props.dispatch(actions.addToCollection(logo));
										}.bind(this)}> Add to Collection</a>
								}
							</li>
						);
					}.bind(this))}
				</ul>
			</div>
		);
	}
}));
