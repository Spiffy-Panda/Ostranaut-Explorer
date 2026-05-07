# Emits spiffy-mods/sacks-and-buckets/loot/loot.json by reading vanilla
# supply-kiosk loot tables (ItmSupplyKioskInv, *BCERInv, *BCRSInv) verbatim
# and appending 24 sack/bucket stock lines to each aLoots array.
# The mod overrides each table by strName at load time.
# Run: pwsh ./utils/powershell/emit_sacks_buckets_loot.ps1

$ErrorActionPreference = "Stop"
$repoRoot   = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$srcLootFile = Join-Path $repoRoot "data/loot/loot.json"
$outFile     = Join-Path $repoRoot "spiffy-mods/sacks-and-buckets/loot/loot.json"

$targetTables = @("ItmSupplyKioskInv","ItmSupplyKioskBCERInv","ItmSupplyKioskBCRSInv")

$suffixes = @(
  "Trash","PartsMechSmall","ScrapSteel","PartsElecSmall","ComponentMobo",
  "ScrapAluminum","ComponentMotor","HeatSink","ScrapCarbonFiber",
  "PartsScreen","ScrapPlastic","ScrapClothDirty"
)
$additions = @()
foreach ($s in $suffixes) {
  # Sacks: 50% chance per spawn, 1 only.
  $additions += "ItmSack$s=0.5x1"
  # Buckets: 25% chance per spawn, 1 only (rarer because bigger payoff).
  $additions += "ItmBucket$s=0.25x1"
}
"Adding $($additions.Count) entries per kiosk table"

$srcArr = Get-Content $srcLootFile -Raw | ConvertFrom-Json

$result = @()
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
  $result += $o
}

$json = $result | ConvertTo-Json -Depth 6
[System.IO.File]::WriteAllText($outFile, $json, [System.Text.UTF8Encoding]::new($false))
"Wrote $($result.Count) tables to $outFile"
