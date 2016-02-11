var _                        = require('underscore');
var connect                  = require('react-redux').connect;
var classNames               = require('classnames');
var createStructuredSelector = require('reselect').createStructuredSelector;
var React                    = require('react');

var actions = require('../../actions');

module.exports = connect(createStructuredSelector({
	collection: _.property('collection'),
	searching:  _.property('searching')
}))(React.createClass({
	getInitialState:    _.constant({}),
	componentWillMount: function() {
		if (this.props.location.query.q) {
			this.props.dispatch(actions.search(this.props.location.query.q));
		}
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
						<a className="social-action social-action-twitter" href="">tweet</a>
						<a className="social-action social-action-facebook" href="">share</a>
						<a className="social-action social-action-github" href="">star</a>
					</div>
				</div>
				<div className="header-content">
					<h1>{process.env.npm_package_title}</h1>
					<h2>{process.env.npm_package_description}</h2>
					<div className="search-container">
						<form method="GET" onSubmit={_.partial(_.result, _, 'preventDefault')} >
							<label>
								<i className="search-icon" onClick={function() {
									this.setState({ collapsed: false });
									this.props.dispatch(actions.search(''));
									this.refs.search.select();
									ga('send', 'event', 'Search', 'Clear', 'Search Icon');
								}.bind(this)}></i>
								<input className="search-input" defaultValue={this.props.searching} ref="search" type="text" autoFocus placeholder="What logo are you looking for?" name="q"
									onChange={function() {
										this.setState({ collapsed: true });
										this.props.dispatch(actions.search(this.refs.search.value));
									}.bind(this)} />
							</label>
						</form>
					</div>
				</div>
			</div>
		);
	},
	componentDidMount: function() {
		var keydown = function(e) {
			if (e.keyCode !== 27 && this.refs.search !== '') {
				return;
			}
			e.preventDefault();
			this.props.dispatch(actions.search(''));
			this.refs.search.select();
			ga('send', 'event', 'Search', 'Clear', 'Esc');
		}.bind(this);
		document.addEventListener('keydown', keydown);
		this.cleanup = function() {
			document.removeEventListener('keydown', keydown);
		};
	},
	componentDidUpdate: function(prevProps) {
		if (this.refs.search.value !== this.props.searching) {
			this.refs.search.value = this.props.searching;
		}
		if (this.props.collection !== prevProps.collection) {
			this.refs.search.select();
		}
	},
	componentWillUnmount: function() {
		this.cleanup();
	}
}));
