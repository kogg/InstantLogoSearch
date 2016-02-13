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
			<div className="popup">
				<div className="">
					{this.props.children}
				</div>
				<div className="">
					our contributors areeeee!!!
				</div>
			</div>
		);
	}
});

module.exports = HTMLDoc;
