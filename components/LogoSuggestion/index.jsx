var _     = require('underscore');
var error = require('debug')(process.env.npm_package_name + ':application:error');
var React = require('react');

var actions = require('../../actions');

module.exports = React.createClass({
	getInitialState:           _.constant({}),
	componentWillReceiveProps: function(nextProps) {
		if ((this.props.value !== nextProps.value) && this.state.popover) {
			this.setState({ popover: false });
		}
	},
	render: function() {
		return (
			<li className="brand-logo missing-logo">
				<div className="brand-logo-image"></div>
				{this.state.popover && (
					<div className="pop-over">
						{!this.state.success && !this.state.failure && (
							<div className="suggest">
								<strong>Suggest or Upload a logo</strong>
								<p>What logo or logo variation were you wanting?</p>
								<form className="submit-logo-form" onSubmit={function(e) {
									e.preventDefault();
									this.suggestLogo(this.refs.suggest_name.value).then(
										function() {
											this.setState({ success: true });
										}.bind(this),
										function(err) {
											this.setState({ failure: err });
										}.bind(this)
									);
								}.bind(this)}>
									<input className="submit-logo-form-input" placeholder="i.e: facebook circle" type="text" ref="suggest_name" defaultValue={this.props.value}/>
									<label htmlFor="file-upload" className="custom-file-upload">Upload SVG*</label>
									<input className="file-upload" id="file-upload" type="file" ref="suggest_file" accept="image/" />
									<input className="submit-logo submit-logo-success" type="submit" />
									<span className="footnote">*Optional but appreciated 😇</span>
								</form>
							</div>
						)}
						{this.state.success && (
							<div className="success">
								<strong>Success!</strong>
								<p>Thank you so much! We will quickly review your request and try to get something up later today!</p>
								<span className="emoji">😍</span>
								<a className="another-one" onClick={function(e) {
									e.preventDefault();
									this.setState({ success: null });
								}.bind(this)}>submit another one</a>
							</div>
						)}
						{this.state.failure && (
							<div className="error">
								<strong>Error! Error!</strong>
								<p>We're sorry but something went terribly wrong! {this.state.failure.message}</p>
								<span className="emoji">😓</span>
								<a className="another-one" onClick={function(e) {
									e.preventDefault();
									this.setState({ failure: null });
								}.bind(this)}>let's try again!</a>
							</div>
						)}
					</div>
				)}
				<div className="flex-center">
					<div className="">
						<span>Can't find quite what you're looking for? </span>
						<u className="activate-pop-over" onClick={function(e) {
							e.preventDefault();
							this.setState({ popover: true });
						}.bind(this)}>Suggest</u>
						<span> a logo or </span>
						<u className="activate-pop-over" onClick={function(e) {
							e.preventDefault();
							this.setState({ popover: true });
						}.bind(this)}>upload</u>
						<span> something yourself!</span>
					</div>
				</div>
			</li>
		);
	},
	componentDidUpdate: function(prevProps) {
		if ((this.props.value !== prevProps.value) && this.refs.suggest_name) {
			this.refs.suggest_name.value = this.props.value;
		}
	},
	suggestLogo: function(name) {
		ga('send', 'event', 'Logos', 'Suggest Logo', name);
		return this.props.dispatch(actions.createSuggestion({ name: name }, {})).catch(function(err) {
			error(err);
			ga('send', 'exception', { exDescription: err.message, exFatal: true });
			throw err;
		});
	}
});
