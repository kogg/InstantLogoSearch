var React      = require('react');

module.exports = React.createClass({
	getInitialState: function() {
		return {
			expanded: false,
			filters:  []
		};
	},
	render: function() {
		return (
			<div className={'header' + (this.state.expanded ? ' header_expanded' : '')}>
				<div className="header-content">
					<h1>Instant Logo Search</h1>
					<h2>Search and download thousands of logos in svg or png</h2>
					<input ref="search" type="text" autoFocus onChange={function() {
						this.setState({
							expanded: true,
							filters:  this.refs.search.value.toLowerCase().split(/\s+/)
						});
					}.bind(this)} />
				</div>
			</div>
		);
	}
});
