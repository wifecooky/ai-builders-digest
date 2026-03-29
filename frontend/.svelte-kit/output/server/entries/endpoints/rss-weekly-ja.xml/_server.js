import { a as generateWeeklyRss } from "../../../chunks/rss.js";
const prerender = true;
function GET() {
  return new Response(generateWeeklyRss("ja"), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" }
  });
}
export {
  GET,
  prerender
};
