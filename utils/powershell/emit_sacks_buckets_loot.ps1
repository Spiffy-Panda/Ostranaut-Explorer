# Emits two files under spiffy-mods/SacksAndBuckets/data/loot/:
#
# 1. loot.json — overrides the three vanilla supply-kiosk loot tables
#    (ItmSupplyKioskInv, *BCERInv, *BCRSInv) verbatim and appends 24
#    sack/bucket stock lines to each aLoots array. Mod load order
#    replaces vanilla by strName.
#
# 2. loot_self_reference.json — adds 24 self-emit loot wrappers, one
#    per sack/bucket (e.g. "ItmSackTrash" => aCOs ["ItmSackTrash=1.0x1"]).
#    These are required because aLoots refs target loot/ folder per
#    schema; vanilla items referenced from kiosk aLoots are wrapped
#    the same way in data/loot/loot_self_reference.json. Without these
#    wrappers, our entries render as dangling refs in the explorer
#    (and may not resolve at game load either).
#
# Run: pwsh ./utils/powershell/emit_sacks_buckets_loot.ps1

$ErrorActionPreference = "Stop"
$repoRoot       = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$srcLootFile    = Join-Path $repoRoot "data/loot/loot.json"
$outLootFile    = Join-Path $repoRoot "spiffy-mods/SacksAndBuckets/data/loot/loot.json"
$outSelfRefFile = Join-Path $repoRoot "spiffy-mods/SacksAndBuckets/data/loot/loot_self_reference.json"

$targetTables = @("ItmSupplyKioskInv","ItmSupplyKioskBCERInv","ItmSupplyKioskBCRSInv")

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

# --- 1. Kiosk overrides ---
$additions = @()
foreach ($s in $suffixes) {
  # Sacks: 50% chance per spawn, 1 only.
  $additions += "ItmSack$s=0.5x1"
  # Buckets: 25% chance per spawn, 1 only (rarer because bigger payoff).
  $additions += "ItmBucket$s=0.25x1"
}
"Adding $($additions.Count) entries per kiosk table"

$srcArr = Get-Content $srcLootFile -Raw | ConvertFrom-Json

$kioskResult = @()
foreach ($name in $targetTables) {
  $entry = $srcArr | Where-Object { $_.strName -eq $name } | Select-Object -First 1
  if (-not $entry) { throw "Could not find $name in $srcLootFile" }

  $newLoots = @()
  $newLoots += $entry.aLoots
  $newLoots += $additions

  $o = [ordered]@{}
  $o["strName"]  = $entry.strName
  $o["aCOs"]     = @($entry.aCOs)
  $o["aLoots"]   = $newLoots
  $o["strType"]  = $entry.strType
  $kioskResult += $o
}
$json = $kioskResult | ConvertTo-Json -Depth 6
[System.IO.File]::WriteAllText($outLootFile, $json, [System.Text.UTF8Encoding]::new($false))
"Wrote $($kioskResult.Count) kiosk-override tables to $outLootFile"

# --- 2. Self-reference wrappers ---
$selfRefResult = @()
foreach ($n in $itemNames) {
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
