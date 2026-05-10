// rooms.js — shared room-spec data + per-room card renderer.
//
// Audience: modders editing data/rooms/rooms.json or data/condtrigs/condtrigs.json.
// Loaded by rooms-reference.html and ship-inspector.html (Phase 3+). Plain
// vanilla JS, no module syntax, no fetch — runs from a file:// URL without
// a build step.
//
// === window.ROOMS ===
// Hand-curated mirror of data/rooms/rooms.json with explanatory notes for
// the reference page. Keep in sync with the source JSON when game data
// changes; the inspector consumes this same array. Shape:
//
//   {
//     name:     string,         // C# class-suffixed name, e.g. "Reactor"
//     friendly: string,         // human label, e.g. "Reactor room"
//     priority: number,         // 0..100; tie-break order in CreateRoomSpecs
//     minTiles: number | null,  // null for Blank
//     value:    number,         // room-value modifier, e.g. 1.6
//     void:     boolean,        // bAllowVoid — true means void-only spec
//     reqs:     Trigger[],      // empty array allowed
//     forbids:  Trigger[],      // empty array allowed
//     note?:    { kind: "info"|"gotcha", lbl: string, text: string },
//   }
//
//   type Trigger = {
//     trigger: string,          // "TIs…" condtrig name
//     count?:  number,          // 1 if absent
//     meta?:   boolean,         // true if the trigger is a meta-aggregator
//     expand?: string,          // optional human-readable "what counts" gloss
//   }
//
// === window.renderRoomCard(spec, options) ===
// Returns a fresh HTMLDetailsElement for the given room spec. Pure data → DOM:
// reads no globals beyond `document`, writes none (no localStorage, no
// location.hash). Deep-link, persistence, and pin-state plumbing stay in
// the page-level scripts that call this.
//
//   options = {
//     idPrefix?:     string,         // default "room-"; element id = idPrefix + spec.name
//     pinned?:       boolean,        // default false; adds an "is-pinned" class for downstream CSS
//     onPin?:        (spec) => void, // optional; if set, a pin-toggle button is appended to the summary
//     openByDefault?: boolean,       // default false; sets <details open>
//   }

window.ROOMS = [
  {
    name: "Reactor", friendly: "Reactor room", priority: 100, minTiles: 4, value: 1.6, void: false,
    reqs: [{trigger: "TIsReactorIC", count: 1, expand: "anything with the IsReactorIC condition"}],
    forbids: [],
    note: {kind: "gotcha", lbl: "Wins everything",
      text: "Priority 100 + no forbids = an IC reactor turns any 4+-tile pressurized room into a Reactor, no matter what else is installed. If you mod a reactor into a bridge or a galley, you lose that classification."},
  },
  {
    name: "BridgeRoom", friendly: "Bridge (Closed)", priority: 90, minTiles: 4, value: 1.5, void: false,
    reqs: [{trigger: "TIsNavStationInstalled", count: 1}],
    forbids: [
      {trigger: "TIsRCSDistroInstalled"},
      {trigger: "TIsRoomRecreationOptionals", meta: true, expand: "terminal / TV / bartop"},
      {trigger: "TIsRoomWellnessOptionals01", meta: true, expand: "fridge / sink / treadmill / strength trainer"},
      {trigger: "TIsToilet"},
      {trigger: "TIsReactorIC"},
      {trigger: "TIsBedInstalled"},
    ],
    note: {kind: "info", lbl: "Pair",
      text: "Same trigger as BridgeArea (80) — the forbid list is what distinguishes them. Clean bridge → Closed (×1.5); Nav Station + anything from the forbid list → Open (×1.3)."},
  },
  {
    name: "TowingRoom", friendly: "Towing Room", priority: 85, minTiles: 2, value: 1.6, void: false,
    reqs: [{trigger: "TIsTowingBraceInstalled", count: 1}],
    forbids: [],
    note: {kind: "info", lbl: "Smallest", text: "The 2-tile minimum is unique. Any pressurized room ≥2 tiles with a towing brace becomes Towing (unless a reactor outranks it)."},
  },
  {
    name: "BridgeArea", friendly: "Bridge (Open)", priority: 80, minTiles: 4, value: 1.3, void: false,
    reqs: [{trigger: "TIsNavStationInstalled", count: 1}],
    forbids: [],
    note: {kind: "info", lbl: "Fallback Bridge",
      text: "The 'mixed-function' bridge — gets picked when a Nav Station shares a room with anything from BridgeRoom's forbid list. Lower modifier (1.3 vs 1.5) is the cost of the mix."},
  },
  {
    name: "Airlock", friendly: "Airlock", priority: 75, minTiles: 3, value: 1.5, void: false,
    reqs: [{trigger: "TIsDockSysInstalled", count: 1}],
    forbids: [
      {trigger: "TIsRCSDistroInstalled"}, {trigger: "TIsShipBatteryInstalled", meta: true},
      {trigger: "TIsRoomRecreationOptionals", meta: true}, {trigger: "TIsRoomWellnessOptionals01", meta: true},
      {trigger: "TIsToilet"}, {trigger: "TIsReactorIC"}, {trigger: "TIsNavStationInstalled"}, {trigger: "TIsBedInstalled"},
    ],
    note: {kind: "info", lbl: "No fallback",
      text: "A docking system in a room with anything else from the forbid list falls through to Blank — there's no 'Airlock-Open' tier."},
  },
  {
    name: "Engineering", friendly: "Engineering Room", priority: 70, minTiles: 4, value: 1.4, void: false,
    reqs: [{trigger: "TIsRoomEngineering", count: 1, meta: true, expand: "canister / charger / ship battery / RCS distributor"}],
    forbids: [],
    note: {kind: "info", lbl: "Cheapest industrial", text: "One canister or one battery is enough."},
  },
  {
    name: "WellnessRoom", friendly: "Wellness Room", priority: 65, minTiles: 4, value: 1.9, void: false,
    reqs: [{trigger: "TIsRoomWellnessOptionals01", count: 2, meta: true, expand: "two of: fridge / sink / treadmill / strength trainer"}],
    forbids: [{trigger: "TIsToilet"}, {trigger: "TIsReactorIC"}, {trigger: "TIsBedInstalled"}],
    note: {kind: "info", lbl: "Count > 1 on a meta",
      text: "The ×2 stacks the meta-trigger's fCount, so two distinct items work as well as two of the same."},
  },
  {
    name: "Recreation", friendly: "Recreational Room", priority: 60, minTiles: 10, value: 1.9, void: false,
    reqs: [
      {trigger: "TIsTableInstalled", count: 1},
      {trigger: "TIsFridge01Installed", count: 1},
      {trigger: "TIsRoomRecreationOptionals", count: 1, meta: true, expand: "terminal / TV / bartop"},
    ],
    forbids: [{trigger: "TIsReactorIC"}],
  },
  {
    name: "LuxuryQuarters", friendly: "Luxury Quarters", priority: 50, minTiles: 12, value: 2.0, void: false,
    reqs: [
      {trigger: "TIsBedInstalled", count: 1},
      {trigger: "TIsStorageBinInstalled", count: 2},
      {trigger: "TIsChairInstalled", count: 1},
      {trigger: "TIsLightSourceInstalled", count: 1},
    ],
    forbids: [
      {trigger: "TIsToilet"}, {trigger: "TIsReactorIC"},
      {trigger: "TIsCanister", meta: true}, {trigger: "TIsRTAInstalled"},
      {trigger: "TIsShipBatteryInstalled", meta: true}, {trigger: "TIsHatchInstalled"},
    ],
    note: {kind: "info", lbl: "Highest value",
      text: "×2.0 is the top of the table. The TIsHatchInstalled forbid is unusual — putting a hatch in the room demotes it to BasicQuarters even with everything else present."},
  },
  {
    name: "Bathroom", friendly: "Bathroom", priority: 45, minTiles: 4, value: 1.8, void: false,
    reqs: [{trigger: "TIsToilet", count: 1}, {trigger: "TIsSinkInstalled", count: 1}],
    forbids: [],
    note: {kind: "info", lbl: "Capability-based",
      text: "TIsToilet checks IsContainer + IsOpening10cmUp + IsWaterproof + IsInstalled — modded toilets just need those conds, not a specific item identity."},
  },
  {
    name: "Galley", friendly: "Galley", priority: 40, minTiles: 6, value: 1.8, void: false,
    reqs: [
      {trigger: "TIsTableInstalled", count: 1},
      {trigger: "TIsChairInstalled", count: 4},
      {trigger: "TIsFridge01Installed", count: 1},
    ],
    forbids: [{trigger: "TIsToilet"}, {trigger: "TIsReactorIC"}, {trigger: "TIsBedInstalled"}],
  },
  {
    name: "BasicQuarters", friendly: "Basic Quarters", priority: 35, minTiles: 8, value: 1.8, void: false,
    reqs: [
      {trigger: "TIsBedInstalled", count: 1},
      {trigger: "TIsStorageBinInstalled", count: 1},
      {trigger: "TIsLightSourceInstalled", count: 1},
    ],
    forbids: [{trigger: "TIsToilet"}, {trigger: "TIsReactorIC"}, {trigger: "TIsCanister", meta: true}],
    note: {kind: "info", lbl: "Distinguishing trip-line",
      text: "Differs from LuxuryQuarters mainly by not forbidding TIsHatchInstalled and needing only one storage bin."},
  },
  {
    name: "Passenger2", friendly: "Passenger Room Medium", priority: 25, minTiles: 32, value: 1.6, void: false,
    reqs: [{trigger: "TIsChairInstalled", count: 8}],
    forbids: [{trigger: "TIsToilet"}, {trigger: "TIsSinkInstalled"}, {trigger: "TIsReactorIC"}, {trigger: "TIsCanister", meta: true}],
    note: {kind: "info", lbl: "Largest minimum", text: "32-tile minimum. Only Passenger1 (16/4) and Passenger2 (32/8) differ; priority 25 > 20 means a room with 8 chairs in 32 tiles hits Medium first."},
  },
  {
    name: "Passenger1", friendly: "Passenger Room Small", priority: 20, minTiles: 16, value: 1.4, void: false,
    reqs: [{trigger: "TIsChairInstalled", count: 4}],
    forbids: [{trigger: "TIsToilet"}, {trigger: "TIsSinkInstalled"}, {trigger: "TIsReactorIC"}, {trigger: "TIsCanister", meta: true}],
  },
  {
    name: "GasCargoRoom", friendly: "Gas Cargo Room", priority: 15, minTiles: 12, value: 1.2, void: false,
    reqs: [{trigger: "TIsCanister", count: 6, meta: true, expand: "RTA + canister types together"}],
    forbids: [],
    note: {kind: "info", lbl: "Engineering vs GasCargo",
      text: "1–5 canisters ≥4 tiles → Engineering (×1.4); 6+ canisters ≥12 tiles → GasCargo (×1.2). Engineering wins on priority, so the real discriminator is the tile count + canister count threshold."},
  },
  {
    name: "CargoRoom", friendly: "Cargo Room", priority: 10, minTiles: 6, value: 1.2, void: false,
    reqs: [{trigger: "TIsRoomCargo", count: 6, meta: true, expand: "storage bin / rack"}],
    forbids: [],
  },
  {
    name: "CargoRoomExterior", friendly: "Cargo Space (Exterior)", priority: 5, minTiles: 6, value: 1.05, void: true,
    reqs: [{trigger: "TIsRoomCargoExterior", count: 20, meta: true, expand: "cargo web / storage bin"}],
    forbids: [],
    note: {kind: "gotcha", lbl: "Only void-allowed spec",
      text: "The only spec with bAllowVoid: true. Every other spec's Matches() returns false on a vacuum room, so an unpressurized area can never be anything except this or Blank."},
  },
  {
    name: "Blank", friendly: "(no specialization)", priority: 0, minTiles: null, value: 1.0, void: false,
    reqs: [], forbids: [],
    note: {kind: "gotcha", lbl: "Special-cased",
      text: "Matches() short-circuits on IsBlank, so Blank is never picked by the priority loop. The fallback _roomSpec ??= dictRoomSpec[\"Blank\"] at the end of CreateRoomSpecs() is what assigns it."},
  },
];

(function () {
  function fmtTriggerLine(t) {
    const cnt = t.count && t.count > 1 ? `<span class="count-pill">×${t.count}</span>` : "";
    const meta = t.meta ? `<span class="meta-pill">META</span>` : "";
    const expand = t.expand ? ` <span class="muted">— ${t.expand}</span>` : "";
    return `<span class="req-line">${cnt}<code>${t.trigger}</code>${meta}${expand}</span>`;
  }

  window.renderRoomCard = function renderRoomCard(spec, options) {
    const opts = options || {};
    const idPrefix = opts.idPrefix != null ? opts.idPrefix : "room-";

    const card = document.createElement("details");
    card.className = "room-card" + (opts.pinned ? " is-pinned" : "");
    card.id = idPrefix + spec.name;
    if (opts.openByDefault) card.open = true;

    const minTilesText = spec.minTiles == null ? "any size" : `≥${spec.minTiles} tiles`;
    const presText = spec.void ? "void only" : "pressurized";
    const valueText = spec.value.toFixed(spec.value === Math.floor(spec.value) ? 1 : 2);

    const reqsHtml = spec.reqs.length
      ? spec.reqs.map(fmtTriggerLine).join("")
      : `<span class="none">none</span>`;
    const forbidsHtml = spec.forbids.length
      ? spec.forbids.map(fmtTriggerLine).join("")
      : `<span class="none">none</span>`;

    const noteHtml = spec.note
      ? `<div class="note ${spec.note.kind === "gotcha" ? "gotcha" : ""}">
          <span class="lbl">${spec.note.lbl}</span>${spec.note.text}
        </div>`
      : "";

    card.innerHTML = `
      <summary>
        <span class="summary-name">${spec.name}</span>
        <span><span class="summary-friendly">${spec.friendly}</span></span>
        <span class="summary-meta">pri ${spec.priority}</span>
        <span class="summary-meta">${minTilesText}</span>
        <span class="summary-meta">×${valueText}</span>
      </summary>
      <div class="body">
        <div class="row"><span class="k">Pressurization</span><span class="v">${presText}</span></div>
        <div class="row"><span class="k">Requires</span><span class="v">${reqsHtml}</span></div>
        <div class="row"><span class="k">Forbids</span><span class="v">${forbidsHtml}</span></div>
        ${noteHtml}
      </div>
    `;

    if (typeof opts.onPin === "function") {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "room-pin-btn";
      btn.textContent = opts.pinned ? "Unpin" : "Pin";
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        opts.onPin(spec);
      });
      card.querySelector("summary").appendChild(btn);
    }

    return card;
  };
})();
