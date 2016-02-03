var _                        = require('underscore');
var connect                  = require('react-redux').connect;
var createStructuredSelector = require('reselect').createStructuredSelector;
var FeathersMixin            = require('feathers-react-redux').FeathersMixin;
var Helmet                   = require('react-helmet');
var React                    = require('react');

var actions    = require('../../actions');
var app        = require('../../application');
var Collection = require('../Collection');
var Header     = require('../Header');
var Logos      = require('../Logos');

FeathersMixin.setFeathersApp(app);
FeathersMixin.setFeathersActions(actions);

module.exports = connect(createStructuredSelector({
	logos:      _.property('logos'),
	collection: _.property('collection')
}))(React.createClass({
	mixins:             [FeathersMixin],
	getInitialState:    _.constant({ filters: [] }),
	componentWillMount: function() {
		this.feathers('logo');
	},
	componentDidMount: function() {
		ga('send', 'pageview');
		this.props.dispatch(actions.loadCollection());
	},
	render: function() {
		return (
			<div className="hero">
				<Helmet
					title={process.env.npm_package_title}
					meta={[
						{ name: 'description', content: process.env.npm_package_description },
						{ property: 'og:site_name', content: process.env.npm_package_title },
						{ property: 'og:title', content: process.env.npm_package_title },
						{ property: 'og:description', content: process.env.npm_package_description },
						{ name: 'twitter:title', content: process.env.npm_package_title },
						{ name: 'twitter:description', content: process.env.npm_package_description }
					]}
				/>
				<Header ref="header" onFilters={this.filterLogos} />
				<Logos logos={this.props.logos} collection={this.props.collection} filters={this.state.filters}
					onConsiderCollectingLogo={this.considerCollectingLogo}
					onUnconsiderCollectingLogo={this.unconsiderCollectingLogo}
					onCollectLogo={this.collectLogo}
					onUncollectLogo={this.uncollectLogo}
					onDownloadedLogo={this.downloadedLogo} />
				<Collection logos={this.props.logos} collection={this.props.collection} considering={this.state.considering}
					onUncollectLogo={this.uncollectLogo}
					onDownloadedLogo={this.clearCollection}
					onDownloadedLogo={function(logo, filetype) {
						this.clearCollection();
						this.downloadedLogo(logo, filetype);
					}.bind(this)}
					onDownloadedLogos={function(logos, filetype) {
						this.clearCollection();
						this.downloadedLogos(logos, filetype);
					}.bind(this)} />
			</div>
		);
	},
	filterLogos: function(filters) {
		this.setState({ filters: filters });
	},
	considerCollectingLogo: function(logo) {
		this.setState({ considering: logo.id });
	},
	unconsiderCollectingLogo: function(logo) {
		if (this.state.considering !== logo.id) {
			return;
		}
		this.setState({ considering: null });
	},
	collectLogo: function(logo) {
		this.props.dispatch(actions.addToCollection(logo));
		this.refs.header.focus();
		global.ga('ec:addProduct', _.pick(logo, 'id', 'name'));
		global.ga('ec:setAction', 'add');
	},
	uncollectLogo: function(logo) {
		this.props.dispatch(actions.removeFromCollection(logo));
		this.refs.header.focus();
		global.ga('ec:addProduct', _.pick(logo, 'id', 'name'));
		global.ga('ec:setAction', 'remove');
	},
	downloadedLogo: function(logo, filetype) {
		return this.downloadedLogos([logo], filetype);
	},
	downloadedLogos: function(logos, filetype) {
		_.each(logos, function(logo) {
			global.ga('ec:addProduct', _.chain(logo).pick('id', 'name').extend({ variant: filetype }).value());
		});
		global.ga('ec:setAction', 'purchase', { id: 'uhhh' });
	},
	clearCollection: function() {
		this.props.dispatch(actions.clearCollection());
	}
}));
