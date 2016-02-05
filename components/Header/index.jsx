var _                        = require('underscore');
var connect                  = require('react-redux').connect;
var classNames               = require('classnames');
var createStructuredSelector = require('reselect').createStructuredSelector;
var routeActions             = require('react-router-redux').routeActions;
var React                    = require('react');

var actions = require('../../actions');

module.exports = connect(createStructuredSelector({
	routing:    _.property('routing'),
	collection: _.property('collection'),
	searching:  _.property('searching')
}))(React.createClass({
	getInitialState:   _.constant({}),
	componentDidMount: function() {
		var keydown = function(e) {
			if (e.keyCode !== 27 && this.refs.search !== '') {
				return;
			}
			e.preventDefault();
			this.props.dispatch(actions.search(''));
			this.refs.search.select();
			ga('send', 'event', 'Dummy', 'Dummy', 'Dummy'); // FIXME
		}.bind(this);
		document.addEventListener('keydown', keydown);
		this.cleanups = _.union([function() {
			document.removeEventListener('keydown', keydown);
		}], this.cleanups);
	},
	render: function() {
		return (
			<div className={classNames({
				header:           true,
				header_collapsed: this.state.collapsed
			})}>
				<div className="flex-spread">
					<div className="logo"></div>
					<div>
						<a className="social-action" href=""><img className="social-action-icon" src="/svg/logomono/twitter.svg" />tweet</a>
						<a className="social-action" href=""><img className="social-action-icon" src="/svg/svgporn/facebook.svg" />share</a>
						<a className="social-action" href=""><img className="social-action-icon" src="/svg/svgporn/github-icon.svg" />star</a>
					</div>
				</div>
				<div className="header-content">
					<h1>{process.env.npm_package_title}</h1>
					<h2>{process.env.npm_package_description}</h2>
					<div className="search-container">
						<form onSubmit={_.partial(_.result, _, 'preventDefault')} >
							<label>
								<i className="search-icon" onClick={function() {
									this.setState({ collapsed: false });
									this.props.dispatch(actions.search(''));
									this.refs.search.select();
									ga('send', 'event', 'Dummy', 'Dummy', 'Dummy'); // FIXME
								}.bind(this)}></i>
								<input className="search-input" placeholder="What logo are you looking for?" ref="search" type="text" autoFocus onChange={function() {
									this.setState({ collapsed: true });
									this.props.dispatch(actions.search(this.refs.search.value.trim()));
								}.bind(this)} />
							</label>
						</form>
					</div>
				</div>
			</div>
		);
	},
	componentDidUpdate: function(prevProps) {
		if (this.refs.search.value !== this.props.searching) {
			this.refs.search.value = this.props.searching;
		}
		if (this.props.collection !== prevProps.collection) {
			this.refs.search.select();
		}
		if (this.props.searching !== prevProps.searching) {
			this.updateQuery();
		}
	},
	componentWillUnmount: function() {
		_.each(this.cleanups, _.partial);
		this.cleanups = [];
	},
	updateQuery: _.debounce(function() {
		this.props.dispatch(routeActions.replace(this.props.routing.location.pathname + (this.props.searching ? '?q=' + this.props.searching : '')));
	}, 500)
}));
