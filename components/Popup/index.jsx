var disableScroll = process.browser && require('disable-scroll');
var Gateway       = require('react-gateway').Gateway;
var Modal         = require('react-modal2').default;
var React         = require('react');

var ShareButtons = require('../ShareButtons');

Modal.getApplicationElement = function() {
	return document.getElementById('react-app');
};

module.exports = React.createClass({
	componentDidMount: function() {
		disableScroll.on();
	},
	render: function() {
		// FIXME Broken until https://github.com/cloudflare/react-gateway/pull/9
		return (
			<Gateway into="global">
				<Modal
					onClose={this.props.onClose}
					backdropClassName="popup__container flex"
					modalClassName="popup">
						<div className="popup__messaging">
							{this.props.children || (
								<div>
									<strong>Wow! Thank you for using </strong>
									<strong>{process.env.npm_package_title}!</strong>
									<h2>You should share us (but like, no pressure).</h2>
								</div>
							)}
							<ShareButtons />
						</div>
						<div className="popup__contributors-container">
							<h4>A big thank you to all our contributors</h4>
							<ul className="popup__contributors">
								<li>
									<a href="https://www.maxcdn.com/" target="_blank">MaxCDN</a>
								</li>
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
				</Modal>
			</Gateway>
		);
	},
	componentWillUnmount: function() {
		disableScroll.off();
	}
});
