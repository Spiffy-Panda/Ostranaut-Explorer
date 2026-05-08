# Emits two files under spiffy-mods/SacksAndBuckets/data/loot/:
#
# 1. loot.json — the standalone ItmSacksKioskInv loot table that the
#    GUITradeSacksKiosk + TraderSacksKiosk wiring uses for stock. No
#    vanilla overrides; no edits to ItmSupplyKioskInv etc.
#
# 2. loot_self_reference.json — 25 self-emit loot wrappers:
#      * 24 wrappers (one per sack/bucket) so the kiosk's aLoots refs
#        resolve to loot/ folder entries that emit the actual COs.
#      * 1 wrapper for ItmSacksKiosk01 itself, required for the
#        `spawn ItmSacksKiosk01` debug command -- spawn resolves its
#        argument as a loot-table name. Vanilla kiosks lack this
#        wrapper because they're placed in ship layouts, not spawned.
#
#    Vanilla wraps every aLoots-referenced item the same way in
#    data/loot/loot_self_reference.json.
#
# Run: pwsh ./utils/powershell/emit_sacks_buckets_loot.ps1

$ErrorActionPreference = "Stop"
$repoRoot       = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$outLootFile    = Join-Path $repoRoot "spiffy-mods/SacksAndBuckets/data/loot/loot.json"
$outSelfRefFile = Join-Path $repoRoot "spiffy-mods/SacksAndBuckets/data/loot/loot_self_reference.json"

$suffixes = @(
  "Trash","PartsMechSmall","ScrapSteel","PartsElecSmall","ComponentMobo",
  "ScrapAluminum","ComponentMotor","HeatSink","ScrapCarbonFiber",
  "PartsScreen","ScrapPlastic","ScrapClothDirty"
)
$itemNames = @()
foreach ($s in $suffixes) {
  $itemNames += "ItmSack$s"
  $itemNames += "ItmBucket$s"
}
# The kiosk also gets a self-ref so `spawn ItmSacksKiosk01` works.
$selfRefNames = $itemNames + @("ItmSacksKiosk01")

# --- 1. Standalone kiosk stock table ---
$stockLines = @()
foreach ($s in $suffixes) {
  # Sacks: 100% chance per spawn, 1-2 of each on a roll.
  $stockLines += "ItmSack$s=1.0x1-2"
  # Buckets: 50% chance per spawn, 1 only (rarer because bigger payoff).
  $stockLines += "ItmBucket$s=0.5x1"
}

$kioskInv = [ordered]@{}
$kioskInv["strName"]  = "ItmSacksKioskInv"
$kioskInv["aCOs"]     = @()
$kioskInv["aLoots"]   = $stockLines
$kioskInv["strType"]  = "item"

$lootArr = @($kioskInv)
# -InputObject preserves the array wrapper for single-element arrays;
# `$arr | ConvertTo-Json` would unwrap and emit a bare object.
$json = ConvertTo-Json -InputObject $lootArr -Depth 6
[System.IO.File]::WriteAllText($outLootFile, $json, [System.Text.UTF8Encoding]::new($false))
"Wrote ItmSacksKioskInv ($($stockLines.Count) lines) to $outLootFile"

# --- 2. Self-reference wrappers ---
$selfRefResult = @()
foreach ($n in $selfRefNames) {
  $o = [ordered]@{}
  $o["strName"] = $n
  $o["aCOs"]    = @("$n=1.0x1")
  $o["aLoots"]  = @()
  $o["strType"] = "item"
  $selfRefResult += $o
}
$json = $selfRefResult | ConvertTo-Json -Depth 6
[System.IO.File]::WriteAllText($outSelfRefFile, $json, [System.Text.UTF8Encoding]::new($false))
"Wrote $($selfRefResult.Count) self-reference wrappers to $outSelfRefFile"
