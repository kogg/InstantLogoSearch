var _          = require('underscore');
var classNames = require('classnames');
var error      = require('debug')(process.env.npm_package_name + ':application:error');
var React      = require('react');

var actions = require('../../actions');
var Popup   = require('../Popup');

var SUGGESTION_UPLOADING = 1;
var SUGGESTION_SUCCESS   = 2;
var SUGGESTION_ERROR     = 3;

module.exports = React.createClass({
	getInitialState:           _.constant({}),
	componentWillReceiveProps: function(nextProps) {
		if ((this.props.value !== nextProps.value) && this.state.popover) {
			this.setState({ popover: false });
		}
	},
	render: function() {
		return (
			<li className={classNames({
				'brand-logo':        true,
				'suggestion':        true,
				'suggestion_active': this.props.active
			})}>
				<div className="flex-center brand-logo__image suggestion__image">
					<div>
						<span>Don't see quite what you're looking for? </span>
						<u className="suggestion__activate-popover">Suggest</u>
						<span> a logo or </span>
						<u className="suggestion__activate-popover">upload</u>
						<span> something yourself!</span>
					</div>
				</div>
				<div className="suggestion__popover">
					{(this.state.suggestion !== SUGGESTION_ERROR) && (
						<div>
							<form className="suggestion__form" onSubmit={function(e) {
								e.preventDefault();
								this.setState({ suggestion: SUGGESTION_UPLOADING });
								this.suggestLogo(this.refs.suggest_name.value, this.refs.suggest_file.files[0]).then(
									function() {
										this.setState({ suggestion: SUGGESTION_SUCCESS });
									}.bind(this),
									function() {
										this.setState({ suggestion: SUGGESTION_ERROR });
									}.bind(this)
								);
							}.bind(this)}>
								<input className="suggestion__input" placeholder="i.e: facebook circle" type="text" ref="suggest_name" defaultValue={this.props.value}/>
								<label className="suggestion__upload-label" htmlFor="file-upload">Upload SVG</label>
								<input className="suggestion__upload-input" id="file-upload" type="file" ref="suggest_file" accept=".svg" />
								<input className={classNames({
									suggestion__submit:           true,
									suggestion__submit_success:   true,
									suggestion__submit_uploading: this.state.suggestion === SUGGESTION_UPLOADING
								})} type="submit" value="Suggest Logo" disabled={this.state.suggestion === SUGGESTION_UPLOADING} />
							</form>
						</div>
					)}
					{(this.state.suggestion === SUGGESTION_SUCCESS) && <Popup onClose={function() {
						this.setState({ suggestion: null });
					}.bind(this)} />}
					{(this.state.suggestion === SUGGESTION_ERROR) && (
						<div className="suggestion_error">
							<p>We're sorry but something went terribly wrong!</p>
							<a className="suggestion__another-one" onClick={function(e) {
								e.preventDefault();
								this.setState({ suggestion: null });
							}.bind(this)}>😓 let's try again!</a>
						</div>
					)}
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
