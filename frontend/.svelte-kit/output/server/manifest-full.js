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
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/about",
				pattern: /^\/about\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/rss-ja.xml",
				pattern: /^\/rss-ja\.xml\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/rss-ja.xml/_server.js'))
			},
			{
				id: "/rss-weekly-ja.xml",
				pattern: /^\/rss-weekly-ja\.xml\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/rss-weekly-ja.xml/_server.js'))
			},
			{
				id: "/rss-weekly-zh.xml",
				pattern: /^\/rss-weekly-zh\.xml\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/rss-weekly-zh.xml/_server.js'))
			},
			{
				id: "/rss-weekly.xml",
				pattern: /^\/rss-weekly\.xml\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/rss-weekly.xml/_server.js'))
			},
			{
				id: "/rss-zh.xml",
				pattern: /^\/rss-zh\.xml\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/rss-zh.xml/_server.js'))
			},
			{
				id: "/rss.xml",
				pattern: /^\/rss\.xml\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/rss.xml/_server.js'))
			},
			{
				id: "/sitemap.xml",
				pattern: /^\/sitemap\.xml\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/sitemap.xml/_server.js'))
			},
			{
				id: "/weekly/[[week]]",
				pattern: /^\/weekly(?:\/([^/]+))?\/?$/,
				params: [{"name":"week","optional":true,"rest":false,"chained":true}],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/[[date]]",
				pattern: /^(?:\/([^/]+))?\/?$/,
				params: [{"name":"date","optional":true,"rest":false,"chained":true}],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
