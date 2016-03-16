var _                        = require('underscore');
var connect                  = require('react-redux').connect;
var classNames               = require('classnames');
var createStructuredSelector = require('reselect').createStructuredSelector;
var React                    = require('react');

var ShareButtons     = require('../ShareButtons');
var actions = require('../../actions');

module.exports = connect(createStructuredSelector({
	collection: _.property('collection'),
	searching:  _.property('searching')
}))(React.createClass({
	getInitialState:    _.constant({}),
	componentWillMount: function() {
		var searching = this.props.location.pathname.slice(1) || this.props.location.query.q;
		if (searching) {
			this.props.dispatch(actions.search(searching));
		}
	},
	render: function() {
		return (
			<div className={classNames({
				header:           true,
				header_collapsed: this.state.collapsed
			})}
				onClick={function(e) {
					if (!this.state.collapsed) {
						return;
					}
					e.preventDefault();
					this.refs.search.select();
				}.bind(this)}>
				<div className="content-container">
					<div className="flex-spread">
						<a href="/" className="logo" onClick={function(e) {
							if (!this.state.collapsed) {
								return;
							}
							e.preventDefault();
							this.setState({ collapsed: false });
							this.props.dispatch(actions.search(''));
							this.refs.search.select();
							ga('send', 'event', 'Search', 'Clear', 'Header Logo');
						}.bind(this)}></a>
						<ShareButtons />
					</div>
					<div className="header-content">
						<h1>{process.env.npm_package_title}</h1>
						<h2>{process.env.npm_package_description}</h2>
						<div className="search-container">
							<form method="GET" onSubmit={_.partial(_.result, _, 'preventDefault')} >
								<label>
									<i className="search-icon" onClick={function() {
										if (!this.state.collapsed) {
											return;
										}
										this.setState({ collapsed: false });
										this.props.dispatch(actions.search(''));
										this.refs.search.select();
										ga('send', 'event', 'Search', 'Clear', 'Search Icon');
									}.bind(this)}></i>
									<input className="search-input" defaultValue={this.props.searching} ref="search" type="text" autoFocus autoComplete="off" placeholder="What logo are you looking for?" name="q"
										onClick={function(e) {
											e.stopPropagation();
										}}
										onChange={function() {
											this.setState({ collapsed: true });
											this.props.dispatch(actions.search(this.refs.search.value));
										}.bind(this)} />
								</label>
							</form>
						</div>
					</div>
				</div>
			</div>
		);
	},
	componentDidMount: function() {
		var keydown = function(e) {
			if (e.keyCode === 70 && (e.ctrlKey || e.metaKey)) {
				e.preventDefault();
				this.refs.search.select();
				return;
			}
			if (e.keyCode !== 27 || this.refs.search.value === '') {
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
