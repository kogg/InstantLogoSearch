var React = require('react');

var CarbonAd = module.exports = React.createClass({
	statics: {
		carbonadsDom: null
	},
	render: function() {
		return (
			<li className="ad brand-logo">
				<script async type="text/javascript" src="//cdn.carbonads.com/carbon.js?zoneid=1696&serve=CVYD42T&placement=instantlogosearchcom" id="_carbonads_js" ref="carbonadsjs"></script>
			</li>
		);
	},
	componentDidMount: function() {
		if (CarbonAd.carbonadsDom) {
			this.refs.carbonadsjs.parentNode.insertBefore(CarbonAd.carbonadsDom, this.refs.carbonadsjs.nextSibling);
			CarbonAd.carbonadsDom = null;
		}
	},
	componentWillUnmount: function() {
		CarbonAd.carbonadsDom = document.getElementById('carbonads');
	}
});
