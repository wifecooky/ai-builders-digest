import * as universal from '../entries/pages/_layout.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.js";
export const imports = ["_app/immutable/nodes/0.hRkSz3hk.js","_app/immutable/chunks/C3ORRP0n.js","_app/immutable/chunks/D78ZuJz1.js","_app/immutable/chunks/waKgmyaI.js","_app/immutable/chunks/nqTzrdvV.js","_app/immutable/chunks/CoEQgm8O.js"];
export const stylesheets = ["_app/immutable/assets/0.CsZLATDV.css"];
export const fonts = [];
