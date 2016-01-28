var React      = require('react');

module.exports = React.createClass({
	render: function() {
		return (
			<div className="header">
				<input ref="search" type="text" autoFocus onChange={function() {
					this.setState({ filters: this.refs.search.value.toLowerCase().split(/\s+/) });
				}.bind(this)} />
			</div>
		);
	}
});
