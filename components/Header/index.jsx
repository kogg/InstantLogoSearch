var classNames = require('classnames');
var React      = require('react');

module.exports = React.createClass({
	getInitialState: function() {
		return { expanded: false };
	},
	render: function() {
		var headerClasses = classNames({
			header:          true,
			header_expanded: this.state.expanded
		});

		return (
			<div className={headerClasses}>
				<div className="header-content">
					<h1>Instant Logo Search</h1>
					<h2>Search and download thousands of logos  svg or png</h2>
					<input ref="search" type="text" autoFocus onChange={function() {
						this.setState({ expanded: true });
						this.props.onFilter(this.refs.search.value.toLowerCase().split(/\s+/));
					}.bind(this)} />
				</div>
			</div>
		);
	}
});
