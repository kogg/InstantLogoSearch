var fs    = require('fs');
var path  = require('path');
var React = require('react');

var ShareButtons     = require('../ShareButtons');

var HTMLDoc = React.createClass({
	statics: {
		cacheBuster: function(assetPath) {
			return assetPath + '?' + fs.statSync(path.join(__dirname, '../dist', assetPath)).mtime.getTime().toString(16);
		}
	},
	render: function() {
		return (
			<div className="popup flex">
				<div className="popup__container">
					<div className="popup__messaging">
						{this.props.children}
						<div>
							<strong>Wow! Thank you for using Instant Logo Search</strong>
						</div>
						<span>You should share us with your friends (but like no pressure)</span>
						<ShareButtons />
					</div>
					<div className="popup__contributors-container">
						<h4>A big thank you to all our contributors</h4>
						<ul className="popup__contributors">
							<li>
								<a href="http://svgporn.com/" target="_blank">SVG Porn</a>
							</li>
							<li>
								<a href="http://logomono.com/" target="_blank">Logomono</a>
							</li>
							<li>
								<a href="https://github.com/seanherron/Flag-Webicons" target="_blank">Flag-Webicons</a>
							</li>
							<li>
								<a href="https://github.com/seanherron/Gov-Webicons" target="_blank">Gov-Webicons</a>
							</li>
							<li>
								<a href="https://github.com/shgysk8zer0/logos" target="_blank">shgysk8zer0-logos</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = HTMLDoc;
