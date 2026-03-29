import * as server from '../entries/pages/weekly/__week__/_page.server.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/weekly/__week__/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/weekly/[[week]]/+page.server.js";
export const imports = ["_app/immutable/nodes/4.CNcCaRj9.js","_app/immutable/chunks/C3ORRP0n.js","_app/immutable/chunks/D78ZuJz1.js","_app/immutable/chunks/DwV2AR5D.js","_app/immutable/chunks/waKgmyaI.js","_app/immutable/chunks/nqTzrdvV.js","_app/immutable/chunks/CoEQgm8O.js","_app/immutable/chunks/CYuTMODB.js"];
export const stylesheets = [];
export const fonts = [];
