var _                        = require('underscore');
var connect                  = require('react-redux').connect;
var createSelector           = require('reselect').createSelector;
var createStructuredSelector = require('reselect').createStructuredSelector;
var FeathersMixin            = require('feathers-react-redux').FeathersMixin;
var React                    = require('react');

module.exports = connect(createStructuredSelector({
	sources: createSelector(
		_.property('sources'),
		_.partial(_.pluck, _, 'data')
	)
}))(React.createClass({
	mixins:             [FeathersMixin],
	componentWillMount: function() {
		this.feathers('source');
	},
	render: function() {
		console.log(this.props.sources);
		return (
			<div className="footer">
				<div className="footer-top flex-spread">
					<div>
						<h4>Instant Logo Search</h4>
					</div>
					<div className="flex">
						<div className="contributors">
							<span>Contributors: </span>
							{this.props.sources.map(function(source) {
								return (
									<a href={source.url} key={source.id}>{source.name || source.shortname}</a>
								);
							})}
						</div>
						<div>
							<a className="social-icon social-icon-twitter"></a>
							<a className="social-icon social-icon-github"></a>
						</div>
					</div>
				</div>
				<div className="footer-bottom flex-spread">
					<div>
						<span>copyright 2016</span>
					</div>
					<div>
						<span>built by kogg</span>
					</div>
				</div>
			</div>
		);
	}
}));
