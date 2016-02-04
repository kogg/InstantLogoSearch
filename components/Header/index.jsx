var _          = require('underscore');
var classNames = require('classnames');
var React      = require('react');

module.exports = React.createClass({
	getInitialState:   _.constant({}),
	componentDidMount: function() {
		var keydown = function(e) {
			if (e.keyCode !== 27) {
				return;
			}
			e.preventDefault();
			this.refs.search.value = '';
			this.props.onFilters([]);
			this.focus();
		}.bind(this);
		document.addEventListener('keydown', keydown);
		this.cleanups = _.union([function() {
			document.removeEventListener('keydown', keydown);
		}], this.cleanups);
	},
	render: function() {
		return (
			<div className={classNames({
				header:          true,
				header_expanded: this.state.expanded
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
									this.setState({ expanded: false });
									this.props.onFilters([]);
									this.focus();
								}.bind(this)}></i>
								<input className="search-input" placeholder="What logo are you looking for?" ref="search" type="text" autoFocus onChange={function() {
									this.setState({ expanded: true });
									this.props.onFilters(_.chain(this.refs.search.value.trim().split(/\s+/))
										.invoke('toLowerCase')
										.invoke('replace', /[.\- ]/gi, '')
										.compact()
										.value());
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
	},
	componentWillUnmount: function() {
		_.each(this.cleanups, _.partial);
		this.cleanups = [];
	}
});
