var _                        = require('underscore');
var connect                  = require('react-redux').connect;
var classNames               = require('classnames');
var createStructuredSelector = require('reselect').createStructuredSelector;
var React                    = require('react');

var actions = require('../../actions');

module.exports = connect(createStructuredSelector({
	collection: _.property('collection')
}))(React.createClass({
	getInitialState:   _.constant({}),
	componentDidMount: function() {
		var keydown = function(e) {
			if (e.keyCode !== 27 && this.refs.search !== '') {
				return;
			}
			e.preventDefault();
			this.refs.search.value = '';
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
									this.refs.search.value = '';
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
	componentDidUpdate: function(nextProps) {
		if (this.props.collection === nextProps.collection) {
			return;
		}
		this.refs.search.select();
	},
	componentWillUnmount: function() {
		_.each(this.cleanups, _.partial);
		this.cleanups = [];
	}
}));
