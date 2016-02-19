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
	getInitialState: _.constant({}),
	render:          function() {
		return (
			<li className={classNames({
				'brand-logo':        true,
				'suggestion':        true,
				'suggestion_active': this.props.active || this.state.filename
			})}>
				<div className="flex-center brand-logo__image suggestion__image">
					{
						this.state.filedata ?
							<img src={this.state.filedata} /> :
							<div>
								<span>Don't see quite what you're looking for? </span>
								<label className="suggestion__activate-popover" htmlFor="suggest-name"><u>Suggest</u></label>
								<span> a logo or </span>
								<label className="suggestion__activate-popover" htmlFor="file-upload"><u>upload</u></label>
								<span> something yourself!</span>
							</div>
					}
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
								<input className="suggestion__input" id="suggest-name" placeholder="i.e: facebook circle" type="text" ref="suggest_name" defaultValue={this.props.value}/>
								<label className="suggestion__upload-label" htmlFor="file-upload">{this.state.filename || 'Upload SVG'}</label>
								<input className="suggestion__upload-input" id="file-upload" type="file" ref="suggest_file" accept=".svg" onChange={function() {
									var dom = this.refs.suggest_file;

									var path           = dom.value;
									var last_slash_pos = path.indexOf('\\') >= 0 ? path.lastIndexOf('\\') : path.lastIndexOf('/');
									var filename       = path.substring(last_slash_pos);
									if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
										filename = filename.substring(1);
									}
									this.setState({ filename: filename });

									if (window.File && window.FileReader && window.FileList) {
										var files = dom.files;
										if (files.length) {
											var reader = new FileReader();
											reader.onload = function(e) {
												this.setState({ filedata: e.target.result });
											}.bind(this);
											reader.readAsDataURL(files[0]);
										} else {
											this.setState({ filedata: null });
										}
									}
								}.bind(this)} />
								<input className={classNames({
									suggestion__submit:           true,
									suggestion__submit_uploading: this.state.suggestion === SUGGESTION_UPLOADING
								})} type="submit" value="Suggest Logo" disabled={this.state.suggestion === SUGGESTION_UPLOADING} />
							</form>
						</div>
					)}
					{(this.state.suggestion === SUGGESTION_SUCCESS) && (
						<Popup onClose={function() {
							this.setState({ suggestion: null });
						}.bind(this)}>
							<div>
								<strong>Thank you for improving </strong>
								<strong>{process.env.npm_package_title}!</strong>
							</div>
						</Popup>
					)}
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
