import { g as generateRss } from "../../../chunks/rss.js";
const prerender = true;
function GET() {
  return new Response(generateRss("zh"), {
    headers: { "Content-Type": "application/xml; charset=utf-8" }
  });
}
export {
  GET,
  prerender
};
