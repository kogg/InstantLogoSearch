var connect       = require('react-redux').connect;
var FeathersMixin = require('feathers-react-redux').FeathersMixin;
var Helmet        = require('react-helmet');
var React         = require('react');

var actions    = require('../../actions');
var app        = require('../../application');
var Collection = require('../Collection');
var Footer     = require('../Footer');
var Header     = require('../Header');

FeathersMixin.setFeathersApp(app);
FeathersMixin.setFeathersActions(actions);

module.exports = connect()(React.createClass({
	mixins:             [FeathersMixin],
	componentWillMount: function() {
		this.feathers('logo');
	},
	render: function() {
		return (
			<div>
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
				<Collection />
			</div>
		);
	}
}));
