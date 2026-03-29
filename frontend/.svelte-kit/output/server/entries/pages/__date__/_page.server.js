import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { error } from "@sveltejs/kit";
const CONTENT_DIR = path.resolve("../content");
function loadSponsor() {
  try {
    const config = yaml.load(fs.readFileSync(path.resolve("../site.yaml"), "utf-8"));
    return config.sponsor || null;
  } catch {
    return null;
  }
}
function loadContent(lang, date) {
  const filePath = path.join(CONTENT_DIR, lang, `${date}.json`);
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
}
function getAvailableDates() {
  const enDir = path.join(CONTENT_DIR, "en");
  try {
    return fs.readdirSync(enDir).filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f)).map((f) => f.replace(".json", "")).sort((a, b) => b.localeCompare(a));
  } catch {
    return [];
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
  const dates = getAvailableDates();
  return [
    { date: "" },
    ...dates.map((d) => ({ date: d }))
  ];
}
function load({ params }) {
  const dates = getAvailableDates();
  const latest = dates[0] || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const date = params.date || latest;
  if (params.date && !dates.includes(params.date)) {
    error(404, "Not found");
  }
  return {
    date,
    latest,
    dates,
    content: {
      en: loadContent("en", date),
      zh: loadContent("zh", date),
      ja: loadContent("ja", date)
    },
    sponsor: loadSponsor(),
    weeks: getAvailableWeeks()
  };
}
export {
  entries,
  load,
  prerender
};
