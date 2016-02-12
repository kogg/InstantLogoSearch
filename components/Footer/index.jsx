var _                        = require('underscore');
var connect                  = require('react-redux').connect;
var createSelector           = require('reselect').createSelector;
var createStructuredSelector = require('reselect').createStructuredSelector;
var FeathersMixin            = require('feathers-react-redux').FeathersMixin;
var React                    = require('react');

module.exports = connect(createStructuredSelector({
	sources: createSelector(
		_.property('sources'),
		function(sources) {
			return _.chain(sources)
				.pluck('data')
				.reject(function(source) {
					return source.id === 'instantlogosearch';
				})
				.sortBy(function(source) {
					return -source.count;
				})
				.value();
		}
	)
}))(React.createClass({
	mixins:             [FeathersMixin],
	componentWillMount: function() {
		this.feathers('source');
	},
	render: function() {
		return (
			<div className="footer">
				<div className="footer__top flex-spread">
					<div>
						<h4>Instant Logo Search</h4>
					</div>
					<div className="flex">
						<div className="footer__contributors">
							<span>Contributors: </span>
							{this.props.sources.map(function(source) {
								return (
									<a href={source.url} key={source.id} target="_blank">{source.name || source.shortname}</a>
								);
							})}
						</div>
						<div>
							<a className="footer__social-icon footer__social-icon_twitter"></a>
							<a className="footer__social-icon footer__social-icon_github"></a>
						</div>
					</div>
				</div>
				<div className="footer__bottom flex-spread">
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
