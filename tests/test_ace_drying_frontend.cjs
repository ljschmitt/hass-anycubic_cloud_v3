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
const helperNames = new Set(["ENTITY_TRANSLATION_KEY_ALIASES", "getEntityTranslationKeys", "getStrictMatchingEntity",
  "createEmptyEntity", "getEntityState", "getPrinterButtonStateObj", "getPrinterDryingButtonStateObj",
  "isPrinterButtonStateAvailable"]);
const ast = ts.createSourceFile("helpers.ts", helpers, ts.ScriptTarget.Latest, true);
const selected = ast.statements.filter((s) =>
  (ts.isFunctionDeclaration(s) && helperNames.has(s.name?.text)) ||
  (ts.isVariableStatement(s) && s.declarationList.declarations.some((d) => helperNames.has(d.name.text))));
assert.equal(selected.length, helperNames.size);
const dialogAst = ts.createSourceFile("dialog.ts", dialog, ts.ScriptTarget.Latest, true);
const dialogCode = dialogAst.statements.filter((s) => !ts.isImportDeclaration(s)).map((s) => s.getText(dialogAst)).join("\n");
const { outputText } = ts.transpileModule(selected.map((s) => s.getText(ast)).join("\n") + "\n" + dialogCode, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  transformers: { before: [(context) => {
    const visit = (node) => ts.isDecorator(node) ? undefined : ts.visitEachChild(node, visit, context);
    return (node) => ts.visitNode(node, visit);
  }] },
});
const html = (strings, ...values) => strings.reduce((out, s, i) => out + s + String(values[i] ?? ""), "");
const context = { exports: {}, LitElement: class { willUpdate() {} }, css: html, html, nothing: "", localize: (key) => key };
vm.runInNewContext(outputText, context);
const Dialog = context.exports.AnycubicPrintercardMulticolorboxModalDrying;
const canonicalPrefix = fs.readFileSync(path.join(integration, "const.py"), "utf8")
  .match(/ENTITY_ID_DRYING_START_PRESET_ = "([^"]+)"/)[1];

const calls = [];
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
console.log("Panel/card ACE drying: canonical buttons, renamed IDs, primary/secondary switching, missing and unavailable entities passed.");
