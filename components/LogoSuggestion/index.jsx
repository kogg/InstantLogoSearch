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
			<li className="brand-logo suggestion">
				<div className="brand-logo__image suggestion__image"></div>
				{this.state.popover && (
					<div className="suggestion__popover">
						{!this.state.success && !this.state.failure && (
							<div>
								<strong>Suggest or Upload a logo</strong>
								<p>What logo or logo variation were you wanting?</p>
								<form className="suggestion__form" onSubmit={function(e) {
									e.preventDefault();
									this.suggestLogo(this.refs.suggest_name.value, this.refs.suggest_file.files[0]).then(
										function() {
											this.setState({ success: true });
										}.bind(this),
										function(err) {
											this.setState({ failure: err });
										}.bind(this)
									);
								}.bind(this)}>
									<input className="suggestion__input" placeholder="i.e: facebook circle" type="text" ref="suggest_name" defaultValue={this.props.value}/>
									<label className="suggestion__upload-label" htmlFor="file-upload">Upload SVG*</label>
									<input className="suggestion__upload-input" id="file-upload" type="file" ref="suggest_file" accept=".svg" />
									<input className="suggestion__submit suggestion__submit_success" type="submit" />
									<span className="suggestion__footnote">*Optional but appreciated 😇</span>
								</form>
							</div>
						)}
						{this.state.success && (
							<div>
								<strong>Success!</strong>
								<p>Thank you so much! We will quickly review your request and try to get something up later today!</p>
								<span className="emoji">😍</span>
								<a className="suggestion__another-one" onClick={function(e) {
									e.preventDefault();
									this.setState({ success: null });
								}.bind(this)}>submit another one</a>
							</div>
						)}
						{this.state.failure && (
							<div>
								<strong>Error! Error!</strong>
								<p>We're sorry but something went terribly wrong! {this.state.failure.message}</p>
								<span className="emoji">😓</span>
								<a className="suggestion__another-one" onClick={function(e) {
									e.preventDefault();
									this.setState({ failure: null });
								}.bind(this)}>let's try again!</a>
							</div>
						)}
					</div>
				)}
				<div className="flex-center">
					<div>
						<span>Can't find quite what you're looking for? </span>
						<u className="suggestion__activate-popover" onClick={function(e) {
							e.preventDefault();
							this.setState({ popover: true });
						}.bind(this)}>Suggest</u>
						<span> a logo or </span>
						<u className="suggestion__activate-popover" onClick={function(e) {
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
	suggestLogo: function(name, file) {
		ga('send', 'event', 'Logos', 'Suggest Logo', name);
		return Promise.resolve(file)
			.then(function(file) {
				if (!file) {
					return null;
				}
				return new Promise(function(resolve, reject) {
					var reader = new FileReader();

					reader.onloadend = function() {
						resolve(reader.result);
					};

					reader.onerror = function() {
						reject(reader.error);
					};

					reader.readAsText(file);
				});
			})
			.then(function(data) {
				return this.props.dispatch(actions.createSuggestion({ name: name, file: data }, {}));
			}.bind(this))
			.catch(function(err) {
				error(err);
				ga('send', 'exception', { exDescription: err.message, exFatal: true });
				throw err;
			});
	}
});
