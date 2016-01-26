var _     = require('underscore');
var React = require('react');

module.exports = React.createClass({
	getInitialState: function() {
		return {};
	},
	render: function() {
		return <form onSubmit={function(e) {
			e.preventDefault();
			if (_.isEmpty(this.refs.text_field.value.trim())) {
				return null;
			}
			this.refs.text_field.disabled = true;
			this.setState({ error: null });

			return this.props.onSubmit(e, _.defaults({ text: this.refs.text_field.value }, this.props.message, { date: Date.now() })).then(
				function() {
					if (this.isMounted()) {
						this.refs.text_field.disabled = false;
						this.refs.text_field.value = this.props.message ? this.props.message.text : '';
					}
				}.bind(this),
				function(err) {
					if (this.isMounted()) {
						this.refs.text_field.disabled = false;
						this.setState({ error: err });
					}
				}.bind(this)
			);
		}.bind(this)}>
			{this.state.error && <span>Error: {this.state.error.message}</span>}
			<input type="text" defaultValue={(this.props.message || {}).text} ref="text_field" />
		</form>;
	}
});
