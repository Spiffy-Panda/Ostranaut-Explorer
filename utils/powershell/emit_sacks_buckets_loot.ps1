# Emits spiffy-mods/SacksAndBuckets/data/loot/loot_self_reference.json --
# 24 self-emit loot wrappers, one per sack/bucket
# (e.g. "ItmSackTrash" => aCOs ["ItmSackTrash=1.0x1"]).
#
# These are required because aLoots refs target the loot/ folder per
# schema; vanilla items referenced from kiosk aLoots are wrapped the
# same way in data/loot/loot_self_reference.json. Without these wrappers,
# our entries render as dangling refs in the explorer (and may not
# resolve at game load either).
#
# Run: pwsh ./utils/powershell/emit_sacks_buckets_loot.ps1

$ErrorActionPreference = "Stop"
$repoRoot       = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
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
