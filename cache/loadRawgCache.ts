import { getGames, getRecentGames } from "../database";
import { GamesApi, Results } from "../types";
import { rawgCache } from "./rawgCache";

const url = "https://api.rawg.io/api/games?key=30778c23f4f34908a65b042d94443ba7&dates=1969-01-01,2026-04-11";

async function fetchAllPages(ordering: string, totalPages = 10): Promise<Results[]> {
  const pages = await Promise.all(
    Array.from({ length: totalPages }, (_, i) =>
      fetch(`${url}&ordering=${ordering}&page=${i + 1}&page_size=40`).then(r => r.json())
    )
  );
  return pages.flatMap((p: GamesApi) => p.results ?? []);
}

function withResults(base: GamesApi, results: Results[]): GamesApi {
  return { ...base, results };
}

function byNameAsc(a: Results, b: Results) { return a.name.localeCompare(b.name); }
function byNameDesc(a: Results, b: Results) { return b.name.localeCompare(a.name); }
function byRatingAsc(a: Results, b: Results) { return Number(a.rating) - Number(b.rating); }
function byRatingDesc(a: Results, b: Results) { return Number(b.rating) - Number(a.rating); }
function byReleaseAsc(a: Results, b: Results) { return Date.parse(a.released || "") - Date.parse(b.released || ""); }
function byReleaseDesc(a: Results, b: Results) { return Date.parse(b.released || "") - Date.parse(a.released || ""); }
function isSinglePlayer(g: Results) { return g.tags?.some(t => t.slug === "singleplayer") ?? false; }
function isMultiPlayer(g: Results) { return g.tags?.some(t => t.slug === "multiplayer") ?? false; }

export async function refreshRawgCache() {
  const [base, recent] = await Promise.all([
    getGames(),
    getRecentGames(),
  ]);

  const results = await fetchAllPages("-rating");

  rawgCache.base = withResults(base, results);
  rawgCache.recent = withResults(recent, [...results].sort(byReleaseDesc));
  rawgCache.byNameAsc = withResults(base, [...results].sort(byNameAsc));
  rawgCache.byNameDes = withResults(base, [...results].sort(byNameDesc));
  rawgCache.byRatingAsc = withResults(base, [...results].sort(byRatingAsc));
  rawgCache.byRatingDes = withResults(base, [...results].sort(byRatingDesc));
  rawgCache.byYear = withResults(base, [...results].sort(byReleaseAsc));
  rawgCache.single = withResults(base, results.filter(isSinglePlayer));
  rawgCache.multi = withResults(base, results.filter(isMultiPlayer));
  rawgCache.timestamp = Date.now();
}