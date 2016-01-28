var classNames = require('classnames');
var React      = require('react');

module.exports = React.createClass({
	getInitialState: function() {
		return {
			expanded: false,
			filters:  []
		};
	},
	render: function() {
		var headerClasses = classNames({
			header:          true,
			header_expanded: this.state.expanded
		});

		return (
			<div className={headerClasses}>
				<input ref="search" type="text" autoFocus onChange={function() {
					this.setState({
						expanded: true,
						filters:  this.refs.search.value.toLowerCase().split(/\s+/)
					});
				}.bind(this)} />
			</div>
		);
	}
});
