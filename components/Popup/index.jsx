var disableScroll = process.browser && require('disable-scroll');
var Gateway       = require('react-gateway').Gateway;
var Modal         = require('react-modal2').default;
var React         = require('react');

var ShareButtons = require('../ShareButtons');

var HTMLDoc = React.createClass({
	componentDidMount: function() {
		disableScroll.on();
	},
	render: function() {
		return (
			<Gateway into="global">
				<Modal
					onClose={function() {
						console.log('lol');
					}}
					backdropClassName="popup__container flex"
					modalClassName="popup">
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
				</Modal>
			</Gateway>
		);
	},
	componentWillUnmount: function() {
		disableScroll.off();
	}
});

module.exports = HTMLDoc;
