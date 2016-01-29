var _          = require('underscore');
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
				<div className="logo"></div>
				<div className="header-content">
					<h1>{process.env.npm_package_title}</h1>
					<h2>{process.env.npm_package_description}</h2>
					<div className="search-container">
						<form>
							<input className="search-input" placeholder="What logo are you looking for?" ref="search" type="text" autoFocus onChange={_.debounce(function() {
								this.setState({ expanded: true });
								this.props.onFilter(this.refs.search.value.toLowerCase().split(/\s+/));
							}.bind(this), 25)} />
							<i className="search-icon"></i>
						</form>
					</div>
				</div>
			</div>
		);
	}
});
