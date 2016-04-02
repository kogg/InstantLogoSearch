var _     = require('underscore');
var React = require('react');

var CarbonAd = module.exports = React.createClass({
	statics: {
		loaded: 0
	},
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},
	render: function() {
		return (
			<li className="ad brand-logo">
				<script async type="text/javascript" src="//cdn.carbonads.com/carbon.js?zoneid=1696&serve=CVYD42T&placement=instantlogosearchcom" id="_carbonads_js" ref="carbonadsjs"></script>
			</li>
		);
	},
	componentDidMount: function() {
		this.unregisterRouteListener = this.context.router.listen(function() {
			CarbonAd.loaded++;
			if (CarbonAd.loaded === 1) {
				global._carbonads_go = _.wrap(global._carbonads_go, function(_carbonads_go, b) {
					global._carbonads.remove(document.getElementById('carbonads'));
					// Double check there's no stray carbonads, they do that sometimes
					for (var i = 2; i < 10; i++) {
						global._carbonads.remove(document.getElementById('carbonads_' + i));
					}
					_carbonads_go(b);
				});
				return;
			}
			this.reloading = setTimeout(function() {
				if (!global._carbonads) {
					return;
				}
				global._carbonads.reload();
			});
		}.bind(this));
	},
	componentWillUnmount: function() {
		clearTimeout(this.reloading);
		this.unregisterRouteListener();
	}
});
