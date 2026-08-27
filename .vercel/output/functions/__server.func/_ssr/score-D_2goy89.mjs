//#region node_modules/.nitro/vite/services/ssr/assets/score-D_2goy89.js
var CATEGORIES = [
	"methodology",
	"business-model",
	"industry",
	"niche",
	"case-study",
	"paper",
	"unexplored-frontier"
];
var WEIGHTS = {
	growth: .3,
	scalability: .25,
	adaptability: .25,
	accessibility: .2
};
var AXIS_META = [
	{
		key: "scalability",
		label: "Scalability",
		short: "sc"
	},
	{
		key: "accessibility",
		label: "Accessibility",
		short: "ac"
	},
	{
		key: "growth",
		label: "Growth potential",
		short: "gr"
	},
	{
		key: "adaptability",
		label: "Adaptability",
		short: "ad"
	}
];
function compositeOf(scores) {
	const total = scores.growth * WEIGHTS.growth + scores.scalability * WEIGHTS.scalability + scores.adaptability * WEIGHTS.adaptability + scores.accessibility * WEIGHTS.accessibility;
	return Math.round(total * 100) / 100;
}
function bandOf(composite) {
	if (composite >= 8.5) return "S";
	if (composite >= 7.5) return "A";
	if (composite >= 6.5) return "B";
	if (composite >= 5.5) return "C";
	return "D";
}
function clampScore(n) {
	if (!Number.isFinite(n)) return 1;
	return Math.max(1, Math.min(10, Math.round(n)));
}
//#endregion
export { compositeOf as a, clampScore as i, CATEGORIES as n, bandOf as r, AXIS_META as t };
