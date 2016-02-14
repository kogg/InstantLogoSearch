var fs    = require('fs');
var path  = require('path');
var React = require('react');

var HTMLDoc = React.createClass({
	statics: {
		cacheBuster: function(assetPath) {
			return assetPath + '?' + fs.statSync(path.join(__dirname, '../dist', assetPath)).mtime.getTime().toString(16);
		}
	},
	render: function() {
		return (
			<div className="ShareButtons">
				<a className="social-action social-action-twitter">tweet</a>
				<a className="social-action social-action-facebook">share</a>
				<a className="social-action social-action-github">star</a>
			</div>
		);
	}
});

module.exports = HTMLDoc;
