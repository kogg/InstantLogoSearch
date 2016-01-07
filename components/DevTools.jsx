var React          = require('react');
var createDevTools = require('redux-devtools').createDevTools;
var LogMonitor     = require('redux-devtools-log-monitor').default;
var DockMonitor    = require('redux-devtools-dock-monitor').default;

module.exports = createDevTools(
	<DockMonitor toggleVisibilityKey="ctrl-h" changePositionKey="ctrl-q">
		<LogMonitor theme="tomorrow" />
	</DockMonitor>
);
