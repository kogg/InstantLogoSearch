var _              = require('underscore');
var connect        = require('react-redux').connect;
var createSelector = require('reselect').createSelector;
var FeathersMixin  = require('feathers-react-redux').FeathersMixin;
var React          = require('react');

var actions     = require('../../actions');
var MessageForm = require('../MessageForm');

module.exports = connect(createSelector(
	_.property('messages'),
	function(messages) {
		return {
			messages: _.chain(messages)
				.values()
				.pluck('data')
				.sortBy('date')
				.value()
		};
	}
))(React.createClass({
	mixins:          [FeathersMixin],
	getInitialState: function() {
		return {};
	},
	componentWillMount: function() {
		this.feathers('message', { client_load: true, realtime: true });
	},
	render: function() {
		return <ul>
			{this.props.messages.map(function(message) {
				return (
					<li key={message.id}>
						{(this.state.editing === message.id) ?
							<MessageForm message={message} onSubmit={function(e, message) {
								return this.props.dispatch(actions.patchMessage(message.id, message)).then(function() {
									if (this.isMounted()) {
										this.setState({ editing: null });
										this.refs.create_form.refs.text_field.focus();
									}
								}.bind(this));
							}.bind(this)} /> :
							<span>
								<span onClick={function() {
									this.setState({ editing: message.id });
								}.bind(this)}>{message.text}</span>
								<a href="#" onClick={function(e) {
									e.preventDefault();
									return this.props.dispatch(actions.removeMessage(message.id));
								}.bind(this)}> X</a>
							</span>}
					</li>
				);
			}.bind(this))}
			<MessageForm ref="create_form" onSubmit={function(e, message) {
				return this.props.dispatch(actions.createMessage(message)).then(function() {
					if (this.isMounted()) {
						this.refs.create_form.refs.text_field.focus();
					}
				}.bind(this));
			}.bind(this)} />
		</ul>;
	}
}));
