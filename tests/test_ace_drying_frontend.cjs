// Execute the actual shared panel/card drying dialog with only Lit/HA boundaries stubbed.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { createRequire } = require("node:module");

const root = path.resolve(__dirname, "..");
const integration = path.join(root, "custom_components/anycubic_ha_integration");
const frontend = path.join(integration, "frontend_panel");
const ts = createRequire(path.join(frontend, "package.json"))("typescript");
const helpers = fs.readFileSync(path.join(frontend, "src/helpers.ts"), "utf8");
const dialog = fs.readFileSync(path.join(frontend,
  "src/components/printer_card/multicolorbox_view/multicolorbox_modal_drying.ts"), "utf8");
const boxView = fs.readFileSync(path.join(frontend,
  "src/components/printer_card/multicolorbox_view/multicolorbox_view.ts"), "utf8");
const helperNames = new Set(["ENTITY_TRANSLATION_KEY_ALIASES", "getEntityTranslationKeys", "getStrictMatchingEntity",
  "createEmptyEntity", "getEntityState", "getPrinterButtonStateObj", "getPrinterDryingButtonStateObj",
  "isPrinterButtonStateAvailable", "getPrinterSwitchStateObj", "getPrinterSensorStateObj",
  "getPrinterBinarySensorState", "getEntityStateBinary", "getEntityStateString"]);
const ast = ts.createSourceFile("helpers.ts", helpers, ts.ScriptTarget.Latest, true);
const selected = ast.statements.filter((s) =>
  (ts.isFunctionDeclaration(s) && helperNames.has(s.name?.text)) ||
  (ts.isVariableStatement(s) && s.declarationList.declarations.some((d) => helperNames.has(d.name.text))));
assert.equal(selected.length, helperNames.size);
function withoutImports(file, source) {
  const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
  return ast.statements.filter((s) => !ts.isImportDeclaration(s)).map((s) => s.getText(ast)).join("\n");
}
const { outputText } = ts.transpileModule([selected.map((s) => s.getText(ast)).join("\n"),
  withoutImports("dialog.ts", dialog), "{\n" + withoutImports("box-view.ts", boxView) + "\n}"].join("\n"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  transformers: { before: [(context) => {
    const visit = (node) => ts.isDecorator(node) ? undefined : ts.visitEachChild(node, visit, context);
    return (node) => ts.visitNode(node, visit);
  }] },
});
const html = (strings, ...values) => strings.reduce((out, s, i) => out + s + String(values[i] ?? ""), "");
const context = { exports: {}, LitElement: class { willUpdate() {} }, css: html, html, nothing: "", localize: (key) => key,
  map: (items, fn) => Array.from(items, fn).join(""), styleMap: () => "" };
vm.runInNewContext(outputText, context);
const Dialog = context.exports.AnycubicPrintercardMulticolorboxModalDrying;
const BoxView = context.exports.AnycubicPrintercardMulticolorboxview;
const canonicalPrefix = fs.readFileSync(path.join(integration, "const.py"), "utf8")
  .match(/ENTITY_ID_DRYING_START_PRESET_ = "([^"]+)"/)[1];

const calls = [];
const box = Object.assign(new BoxView(), {
  hass: { states: {} }, printerEntities: {}, printerEntityIdPart: "test_", language: "en",
});
function setState(domain, suffix, state, attributes = {}) {
  const id = `${domain}.renamed_${suffix}`;
  box.printerEntities[id] = { entity_id: id, translation_key: suffix, device_id: "test-device" };
  box.hass.states[id] = { entity_id: id, state, attributes };
}
setState("binary_sensor", "printer_online", "on");
setState("sensor", "ace_current_temperature", "22.5", { unit_of_measurement: "°C" });
setState("sensor", "ace_humidity", "31");
assert.match(box._renderAceMeasurements(), /22\.5\s+°C.*31%/s);
box.box_id = 1;
assert.equal(box._renderAceMeasurements(), "", "Secondary ACE must not reuse primary measurements");
setState("sensor", "secondary_ace_humidity", "0");
assert.match(box._renderAceMeasurements(), /0%/);
for (const invalid of ["unknown", "unavailable", "", "-1", "101"]) {
  setState("sensor", "secondary_ace_humidity", invalid);
  assert.equal(box._renderAceMeasurements(), "", "Invalid humidity must remain hidden");
}
box.box_id = 0;
box.showControls = false;
assert.equal(box._renderAceMeasurements(), "", "Internal rack must not show ACE measurements");
box.showControls = true;
setState("binary_sensor", "printer_online", "off");

const loadedSpool = { spool_loaded: true, material_type: "PLA", color: [10, 20, 30] };
for (const invalid of [undefined, null, NaN, Infinity, -1, 101, "50"]) {
  box.spoolList = [{ ...loadedSpool, consumables_percent: invalid }];
  const rendered = box._renderSpools();
  assert.doesNotMatch(rendered, /ac-spool-fill|fill_unknown/, "Unverified or invalid estimates must stay hidden");
  assert.match(rendered, /PLA/, "Hiding estimates must preserve the spool material");
}
for (const value of [0, 50, 100]) {
  box.spoolList = [{ ...loadedSpool, consumables_percent: value }];
  assert.match(box._renderSpools(), new RegExp(`ac-spool-fill[\\s\\S]*${value}%`), "Valid endpoints and estimates must remain visible");
}
for (const overrides of [{ spool_loaded: false }, { reserved_by_ace: true }]) {
  box.spoolList = [{ ...loadedSpool, consumables_percent: 50, ...overrides }];
  assert.doesNotMatch(box._renderSpools(), /ac-spool-fill/, "Empty slots and ACE feed must not show estimates");
}
assert.equal(box._renderAceMeasurements(), "", "Offline printer must not show stale measurements");

function fixture(prefix = "test_", primary = true, secondary = true) {
  const hass = { states: {}, callService: (...args) => { calls.push(args); return Promise.resolve(); } };
  const entities = {};
  for (const [boxPrefix, enabled] of [["", primary], ["secondary_", secondary]]) {
    if (!enabled) continue;
    for (const [key, attributes] of [[canonicalPrefix + "1", { duration: 600, temperature: 50 }], ["drying_stop", {}]]) {
      const suffix = boxPrefix + key;
      // A renamed ID must be called through the registry, not a reconstructed name.
      const id = "button." + prefix + "renamed_" + suffix;
      entities[id] = { entity_id: id, translation_key: suffix, device_id: "test-device" };
      hass.states[id] = { entity_id: id, state: "unknown", attributes };
    }
  }
  return { hass, entities };
}
function update(dialog, fields) { dialog.willUpdate(new Map(fields.map((key) => [key, undefined]))); }
function open(dialog, box) {
  dialog._handleModalEvent({ stopPropagation() {}, detail: { modalOpen: true, box_id: box } });
  update(dialog, ["box_id"]);
}

const modal = new Dialog();
Object.assign(modal, { language: "en", printerEntityIdPart: "test_", ...fixture() });
modal.printerEntities = modal.entities;
update(modal, ["hass", "language", "box_id"]);
assert.equal(modal._hasDryingPreset1, true, "Configured primary preset must be found by its backend key");
assert.equal(modal._hasDryingPreset2, false, "Unconfigured presets must stay hidden");
assert.equal(modal._hasDryingStop, true, "Never-pressed (unknown) HA buttons are available");
assert.match(modal._renderCard(), /600.*card\.drying_settings\.button_minutes.*50°C/s);
modal._handleDryingPreset1();
assert.equal(calls.at(-1)[2].entity_id, "button.test_renamed_drying_start_preset_1");

// Change ACE without an unrelated hass update: both labels and action must change immediately.
open(modal, 1);
assert.equal(modal._dryingPresetId1, "secondary_" + canonicalPrefix + "1");
modal._handleDryingPreset1();
assert.equal(calls.at(-1)[2].entity_id, "button.test_renamed_secondary_drying_start_preset_1");
open(modal, 1);
modal._handleDryingStop();
assert.equal(calls.at(-1)[2].entity_id, "button.test_renamed_secondary_drying_stop");
open(modal, 0);
modal._handleDryingStop();
assert.equal(calls.at(-1)[2].entity_id, "button.test_renamed_drying_stop");
assert.ok(calls.every(([domain, action]) => domain === "button" && action === "press"));

// A second printer with only one ACE must not retain the first printer's secondary controls.
const other = fixture("other_", true, false);
modal.hass = other.hass;
modal.printerEntities = other.entities;
modal.printerEntityIdPart = "other_";
update(modal, ["printerEntities", "printerEntityIdPart"]);
open(modal, 1);
assert.equal(modal._hasDryingPreset1, false);
assert.equal(modal._hasDryingStop, false);
const before = calls.length;
modal._pressHassButton("secondary_drying_stop");
assert.equal(calls.length, before, "Missing buttons must never issue a service call");
open(modal, 0);
assert.equal(modal._hasDryingPreset1, true);
modal.hass.states["button.other_renamed_drying_start_preset_1"].state = "unavailable";
update(modal, ["hass"]);
assert.equal(modal._hasDryingPreset1, false);
modal._pressHassButton(canonicalPrefix + "1");
assert.equal(calls.length, before, "Unavailable printers must never issue a service call");
modal.printerEntities = {};
update(modal, ["printerEntities"]);
assert.equal(modal._hasDryingStop, false);
assert.match(modal._renderCard(), /card\.drying_settings\.no_presets/);
assert.match(modal._renderCard(), /\/config\/integrations\/integration\/anycubic_ha_integration/);

const refillStates = {
  "switch.renamed_primary": { entity_id: "switch.renamed_primary", state: "off" },
  "switch.renamed_secondary": { entity_id: "switch.renamed_secondary", state: "on" },
};
const refillRegistry = {
  "switch.renamed_primary": { translation_key: "multi_color_box_runout_refill", entity_id: "switch.renamed_primary" },
  "switch.renamed_secondary": { translation_key: "secondary_multi_color_box_runout_refill", entity_id: "switch.renamed_secondary" },
};
const refillState = context.exports.getPrinterSwitchStateObj;
assert.equal(refillState({ states: refillStates }, refillRegistry, "wrong_", "ace_run_out_refill"), refillStates["switch.renamed_primary"]);
assert.equal(refillState({ states: refillStates }, refillRegistry, "wrong_", "secondary_ace_run_out_refill"), refillStates["switch.renamed_secondary"]);
console.log("Panel/card ACE controls and per-box temperature/humidity checks passed.");
