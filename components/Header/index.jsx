var _          = require('underscore');
var classNames = require('classnames');
var React      = require('react');

module.exports = React.createClass({
	getInitialState: _.constant({}),
	render:          function() {
		return (
			<div className={classNames({
				header:          true,
				header_expanded: this.state.expanded
			})}>
				<div className="flex-spread">
					<div className="logo"></div>
					<div>
						<a className="social-action" href="">t tweet</a>
						<a className="social-action" href="">f share</a>
						<a className="social-action" href="">s star</a>
					</div>
				</div>
				<div className="header-content">
					<h1>{process.env.npm_package_title}</h1>
					<h2>{process.env.npm_package_description}</h2>
					<div className="search-container">
						<form onSubmit={_.partial(_.result, _, 'preventDefault')} >
							<label>
								<i className="search-icon" onClick={function() {
									this.refs.search.value = '';
									this.setState({ expanded: false });
									this.props.onFilter('');
									this.focus();
								}.bind(this)}></i>
								<input className="search-input" placeholder="What logo are you looking for?" ref="search" type="text" autoFocus onChange={function() {
									var filter = this.refs.search.value.trim();
									this.setState({ expanded: true });
									this.props.onFilter(filter);
								}.bind(this)} />
							</label>
						</form>
					</div>
				</div>
			</div>
		);
	},
	focus: function() {
		this.refs.search.select();
	}
});
