export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.svg"]),
	mimeTypes: {".svg":"image/svg+xml"},
	_: {
		client: {start:"_app/immutable/entry/start.CCWScuiH.js",app:"_app/immutable/entry/app.CplLm0na.js",imports:["_app/immutable/entry/start.CCWScuiH.js","_app/immutable/chunks/CFtrAqWj.js","_app/immutable/chunks/D78ZuJz1.js","_app/immutable/chunks/BXILGx4F.js","_app/immutable/entry/app.CplLm0na.js","_app/immutable/chunks/D78ZuJz1.js","_app/immutable/chunks/C3ORRP0n.js","_app/immutable/chunks/BXILGx4F.js","_app/immutable/chunks/DwV2AR5D.js","_app/immutable/chunks/waKgmyaI.js","_app/immutable/chunks/BPUOlxGb.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js'))
		],
		remotes: {
			
		},
		routes: [
			
		],
		prerendered_routes: new Set(["/about","/rss-ja.xml","/rss-weekly-ja.xml","/rss-weekly-zh.xml","/rss-weekly.xml","/rss-zh.xml","/rss.xml","/sitemap.xml","/weekly","/weekly/__data.json","/","/__data.json","/weekly/2026-W11","/weekly/2026-W11/__data.json"]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
