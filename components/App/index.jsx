var _                        = require('underscore');
var connect                  = require('react-redux').connect;
var createStructuredSelector = require('reselect').createStructuredSelector;
var FeathersMixin            = require('feathers-react-redux').FeathersMixin;
var Helmet                   = require('react-helmet');
var React                    = require('react');

var actions    = require('../../actions');
var Collection = require('../Collection');
var Header     = require('../Header');
var Logos      = require('../Logos');

module.exports = connect(createStructuredSelector({
	logos:      _.property('logos'),
	collection: _.property('collection')
}))(React.createClass({
	mixins:             [FeathersMixin],
	getInitialState:    _.constant({}),
	componentWillMount: function() {
		this.feathers('logo');
	},
	componentDidMount: function() {
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
				<Header ref="header" onFilter={function(filter) {
					this.setState({ filter: filter });
				}.bind(this)} />
				<Logos logos={this.props.logos} collection={this.props.collection} filter={this.state.filter}
					onToggleCollectLogo={this.toggleCollectLogo}
					onConsiderCollectLogo={function(logo) {
						this.setState({ considering: logo.id });
					}.bind(this)}
					onUnconsiderCollectLogo={function(logo) {
						if (this.state.considering !== logo.id) {
							return;
						}
						this.setState({ considering: null });
					}.bind(this)} />
				<Collection logos={this.props.logos} collection={this.props.collection} considering={this.state.considering}
					onToggleCollectLogo={this.toggleCollectLogo} />
			</div>
		);
	},
	toggleCollectLogo: function(logo) {
		this.props.dispatch(actions[this.props.collection[logo.id] ? 'removeFromCollection' : 'addToCollection'](logo));
		this.refs.header.focus();
	}
}));
