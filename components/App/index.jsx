var _                        = require('underscore');
var connect                  = require('react-redux').connect;
var createStructuredSelector = require('reselect').createStructuredSelector;
var FeathersMixin            = require('feathers-react-redux').FeathersMixin;
var Helmet                   = require('react-helmet');
var React                    = require('react');

var actions    = require('../../actions');
var app        = require('../../application');
var Collection = require('../Collection');
var Footer     = require('../Footer');
var Header     = require('../Header');
var Popup     = require('../Popup');

FeathersMixin.setFeathersApp(app);
FeathersMixin.setFeathersActions(actions);

module.exports = connect(createStructuredSelector({
	collection: _.property('collection')
}))(React.createClass({
	mixins:             [FeathersMixin],
	componentWillMount: function() {
		this.feathers('logo');
	},
	render: function() {
		return (
			<div>
				<Popup>
					hello world
				</Popup>
				<Helmet
					title={process.env.npm_package_title}
					meta={[
						{ name: 'description', content: process.env.npm_package_description },
						{ property: 'og:site_name', content: process.env.npm_package_title },
						{ property: 'og:title', content: process.env.npm_package_title },
						{ property: 'og:description', content: process.env.npm_package_description },
						{ name: 'twitter:title', content: process.env.npm_package_title },
						{ name: 'twitter:description', content: process.env.npm_package_description }
					]} />
				<Header location={this.props.location} />
				{this.props.children}
				<Footer />
				{this.props.collection && <Collection />}
			</div>
		);
	},
	componentDidMount: function() {
		this.props.dispatch(actions.loadCollection());
	}
}));
