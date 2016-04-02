var _          = require('underscore');
var classNames = require('classnames');
var React      = require('react');

var actions = require('../../actions');
var rollbar = require('../../rollbar');
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
				'suggestion_active': this.props.active || this.state.filedata
			})}>
				<div className="flex-center brand-logo__image suggestion__image">
					{
						this.state.filedata ?
							<img src={this.state.filedata} /> :
							<div>
								<span>Don't see quite what you're looking for? </span>
								<label className="suggestion__activate-popover" htmlFor="file-upload"><u>Upload</u></label>
								<span> a logo!</span>
							</div>
					}
				</div>
				<div className="suggestion__popover">
					{(this.state.suggestion !== SUGGESTION_ERROR) && (
						<div>
							<form className="suggestion__form" onSubmit={function(e) {
								e.preventDefault();
								if (!this.refs.suggest_file.files.length || this.state.suggestion === SUGGESTION_UPLOADING) {
									return;
								}
								this.setState({ suggestion: SUGGESTION_UPLOADING });
								this.suggestLogo(this.refs.suggest_name.value, this.refs.suggest_file.files[0]).then(
									function() {
										this.setState({ suggestion: SUGGESTION_SUCCESS, filedata: null, filename: null });
									}.bind(this),
									function() {
										this.setState({ suggestion: SUGGESTION_ERROR });
									}.bind(this)
								);
							}.bind(this)}>
								<input className="suggestion__input" id="suggest-name" placeholder="i.e: facebook circle" type="text" ref="suggest_name" defaultValue={this.props.value}/>
								<label className="suggestion__upload-label" htmlFor="file-upload">{this.state.filename || 'Upload SVG'}</label>
								<input className="suggestion__upload-input" id="file-upload" type="file" ref="suggest_file" accept=".svg" onChange={function() {
									var files = this.refs.suggest_file.files;
									if (!files || !files.length) {
										return this.setState({ filedata: null, filename: null });
									}

									if (window.File && window.FileReader && window.FileList) {
										var reader = new FileReader();
										reader.onload = function(e) {
											var path           = this.refs.suggest_file.value;
											var last_slash_pos = path.indexOf('\\') >= 0 ? path.lastIndexOf('\\') : path.lastIndexOf('/');
											var filename       = path.substring(last_slash_pos);
											if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
												filename = filename.substring(1);
											}
											this.setState({ filedata: e.target.result, filename: filename });
										}.bind(this);
										reader.readAsDataURL(files[0]);
									}
								}.bind(this)} />
								<input className={classNames({
									suggestion__submit:           true,
									suggestion__submit_disabled:  !this.state.filedata || this.state.suggestion === SUGGESTION_UPLOADING,
									suggestion__submit_uploading: this.state.suggestion === SUGGESTION_UPLOADING
								})} type="submit" value="Suggest Logo" disabled={!this.state.filedata || this.state.suggestion === SUGGESTION_UPLOADING} />
							</form>
						</div>
					)}
					{(this.state.suggestion === SUGGESTION_SUCCESS) && (
						<Popup onClose={function() {
							this.setState({ suggestion: null });
						}.bind(this)}>
							<div>
								<strong>Your Logo was uploaded </strong>
								<strong>successfully!</strong>
							</div>
							<h2>Thanks! All logos are reviewed before appearing on {process.env.npm_package_title}. You should share us (but like, no pressure).</h2>
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
				(rollbar.handleError || rollbar.error)(err);
				ga('send', 'exception', { exDescription: err.message, exFatal: true });
				throw err;
			});
	}
});
