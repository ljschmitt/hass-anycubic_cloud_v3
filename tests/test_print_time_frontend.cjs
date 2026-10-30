// Exercise the unchanged time helpers shared by the panel and dashboard card.
// Run from any directory after installing the frontend's npm dependencies.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { createRequire } = require("node:module");

const frontend = path.resolve(__dirname, "../custom_components/anycubic_ha_integration/frontend_panel");
const frontendRequire = createRequire(path.join(frontend, "package.json"));
const ts = frontendRequire("typescript");
const { intervalToDuration } = frontendRequire("date-fns");
const source = fs.readFileSync(path.join(frontend, "src/helpers.ts"), "utf8");
const ast = ts.createSourceFile("helpers.ts", source, ts.ScriptTarget.Latest, true);
const names = new Set(["getEntityTotalSeconds", "milliSecondsToDuration", "secondsToDuration", "formatDuration"]);
const selected = ast.statements.filter((statement) =>
  (ts.isFunctionDeclaration(statement) && names.has(statement.name?.text)) ||
  (ts.isVariableStatement(statement) && statement.declarationList.declarations.some((d) => names.has(d.name.text)))
);
assert.equal(selected.length, names.size, "All actual time helpers must be exercised");
const { outputText } = ts.transpileModule(selected.map((s) => s.getText(ast)).join("\n"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
});
const context = { exports: {}, dfnsIntervalToDuration: intervalToDuration };
vm.runInNewContext(outputText, context);
const { getEntityTotalSeconds, formatDuration } = context.exports;

for (const [minutes, seconds, display] of [
  [43.35, 2601, "43m21s"], // #17 S1 Max: seconds normalized by the backend
  [43, 2580, "43m0s"], // existing minute-based models
  [2601, 156060, "1d19h21m0s"], // a genuinely long legacy print must stay long
  [0, 0, "0s"],
  [1 / 60, 1, "1s"],
  [224, 13440, "3h44m0s"], // remaining time stays in minutes
]) {
  const entity = { state: String(minutes), attributes: { unit_of_measurement: "min" } };
  assert.equal(getEntityTotalSeconds(entity), seconds);
  assert.equal(formatDuration(seconds, false), display);
}
assert.equal(getEntityTotalSeconds({ state: "01:02:03" }), 3723);
assert.equal(getEntityTotalSeconds({ state: "1 day, 01:02:03" }), 90123);
assert.equal(getEntityTotalSeconds({ state: "2601" }, true), 2601);
console.log("Panel/card time helpers: S1 Max, legacy minutes, remaining time and duration formats passed.");
