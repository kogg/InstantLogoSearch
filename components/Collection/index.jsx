var React = require('react');

module.exports = React.createClass({
	render: function() {
		return (
			<div className="collection">
				<ul className="collection-row">
					<li className="collection-row-list">
						<img src="/svg/svgporn/dotnet.svg" />
					</li>
					<li className="collection-row-list">
						<img src="/svg/svgporn/100tb.svg" />
					</li>
					<li className="collection-row-list">
						<img src="/svg/svgporn/appcode.svg" />
					</li>
					<li className="collection-row-list">
						<img src="/svg/svgporn/desk.svg" />
					</li>
					<li className="collection-row-list">
						<img src="/svg/svgporn/authy.svg" />
					</li>
					<li className="collection-row-list">
						<img src="/svg/svgporn/appdynamics.svg" />
					</li>
					<li className="collection-row-list">
						<img src="/svg/svgporn/tomcat.svg" />
					</li>
					<li className="collection-row-list">
						<img src="/svg/svgporn/dreamhost.svg" />
					</li>
					<li className="collection-row-list">
						<img src="/svg/svgporn/divshot.svg" />
					</li>
					<li className="collection-row-list">
						<img src="/svg/svgporn/codebase.svg" />
					</li>
					<li className="collection-row-list">
						<img src="/svg/svgporn/codepen.svg" />
					</li>
					<li className="collection-row-list">
						<img src="/svg/svgporn/composer.svg" />
					</li>
					<li className="collection-row-list-end">
						<div className="dummyimage"></div>
					</li>
				</ul>
				<div className="ctas">
					<a>Download SVGs</a>
					<a>Download PNGs</a>
				</div>
			</div>
		);
	}
});
