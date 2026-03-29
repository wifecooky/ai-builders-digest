import fs from "fs";
import path from "path";
import { error } from "@sveltejs/kit";
const CONTENT_DIR = path.resolve("../content");
function loadWeeklyContent(lang, weekId) {
  const filePath = path.join(CONTENT_DIR, lang, "weekly", `${weekId}.json`);
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
}
function getAvailableWeeks() {
  const weeklyDir = path.join(CONTENT_DIR, "en", "weekly");
  try {
    return fs.readdirSync(weeklyDir).filter((f) => /^\d{4}-W\d{2}\.json$/.test(f)).map((f) => f.replace(".json", "")).sort((a, b) => b.localeCompare(a));
  } catch {
    return [];
  }
}
const prerender = true;
function entries() {
  const weeks = getAvailableWeeks();
  if (!weeks.length) return [];
  return [
    { week: "" },
    ...weeks.map((w) => ({ week: w }))
  ];
}
function load({ params }) {
  const weeks = getAvailableWeeks();
  if (!weeks.length) {
    return { week: null, latest: null, weeks: [], content: { en: null, zh: null, ja: null } };
  }
  const latest = weeks[0];
  const week = params.week || latest;
  if (params.week && !weeks.includes(params.week)) {
    error(404, "Weekly report not found");
  }
  return {
    week,
    latest,
    weeks,
    content: {
      en: loadWeeklyContent("en", week),
      zh: loadWeeklyContent("zh", week),
      ja: loadWeeklyContent("ja", week)
    }
  };
}
export {
  entries,
  load,
  prerender
};
