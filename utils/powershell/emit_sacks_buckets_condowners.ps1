# Emits spiffy-mods/SacksAndBuckets/data/condowners/condowners.json.
# One-shot generator for 24 container CO entries (12 sacks + 12 buckets)
# templated against the (suffix, source-item, fit-gate, contents-noun) table.
# Run: pwsh ./utils/powershell/emit_sacks_buckets_condowners.ps1

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$outFile  = Join-Path $repoRoot "spiffy-mods/SacksAndBuckets/data/condowners/condowners.json"

# (suffix, source item, fit-gate, plural noun for description)
$kinds = @(
  @{ suffix="Trash";            src="ItmScrapTrash";          gate="TIsFitContainerTrash";            noun="trash"               },
  @{ suffix="PartsMechSmall";   src="ItmPartsMechSmall01";    gate="TIsFitContainerPartsMechSmall";   noun="small mech parts"    },
  @{ suffix="ScrapSteel";       src="ItmScrapSteel";          gate="TIsFitContainerScrapSteel";       noun="steel scrap"         },
  @{ suffix="PartsElecSmall";   src="ItmPartsElecSmall01";    gate="TIsFitContainerPartsElecSmall";   noun="small elec parts"    },
  @{ suffix="ComponentMobo";    src="ItmComponentMobo01";     gate="TIsFitContainerComponentMobo";    noun="motherboards"        },
  @{ suffix="ScrapAluminum";    src="ItmScrapAluminum";       gate="TIsFitContainerScrapAluminum";    noun="aluminum scrap"      },
  @{ suffix="ComponentMotor";   src="ItmComponentMotor01";    gate="TIsFitContainerComponentMotor";   noun="small motors"        },
  @{ suffix="HeatSink";         src="ItmHeatSink01";          gate="TIsFitContainerHeatSink";         noun="heat sinks"          },
  @{ suffix="ScrapCarbonFiber"; src="ItmScrapCarbonFiber";    gate="TIsFitContainerScrapCarbonFiber"; noun="carbon fiber scrap"  },
  @{ suffix="PartsScreen";      src="ItmPartsScreen01";       gate="TIsFitContainerPartsScreen";      noun="screen fragments"    },
  @{ suffix="ScrapPlastic";     src="ItmScrapPlastic";        gate="TIsFitContainerScrapPlastic";     noun="plastic scrap"       },
  @{ suffix="ScrapClothDirty";  src="ItmScrapClothDirty";     gate="TIsFitContainerScrapClothDirty";  noun="dirty cloth scraps"  }
)

function Sack-Entry($k) {
  @{
    strName          = "ItmSack$($k.suffix)"
    strNameShort     = "Sack: $($k.suffix)"
    strNameFriendly  = "Sack of $((Get-Culture).TextInfo.ToTitleCase($k.noun))"
    strDesc          = "A reinforced canvas sack, sized and stitched for one job: holding $($k.noun) and nothing else. Single-type by construction."
    strItemDef       = "ItmBackpack02"
    strType          = "Item"
    strLoot          = $null
    strContainerCT   = $k.gate
    nContainerHeight = 4
    nContainerWidth  = 4
    aInteractions    = @("Inventory","EquipItem","DropItem","PickupItem")
    aStartingConds   = @(
      "IsBurnable=1.0x1.0",
      "IsContainer=1.0x1",
      "IsBackpack=1.0x1.0",
      "IsFlexible=1.0x1.0",
      "IsSheet=1.0x1.0",
      "IsTempInsulator=1.0x1.0",
      "IsSolid=1.0x1.0",
      "StatMass=1.0x2.0",
      "StatBasePrice=1.0x200.0",
      "StatDamageMax=1.0x4",
      "StatDismantleProgressMax=1.0x30",
      "IsCategoryTextiles=1.0x1.0"
    )
    mapCondTolerance = @()
    mapPoints        = @()
    mapChargeProfiles= @("Melee","MeleeAttackDefault")
    aUpdateCommands  = @("Destructable,StatDamage,ACTClothesDestroy,StatDamageMax,1.0")
    mapGUIPropMaps   = $null
    strPortraitImg   = "ItmBackpack02"
    strAudioEmitter  = "ItmBackpackSound"
    mapSlotEffects   = @(
      "back",  "Backpack02Full",
      "heldL", "HeldBackpack02FullL",
      "heldR", "HeldBackpack02FullR",
      "drag",  "Backpack02Full"
    )
    jsonPI           = $null
  }
}

function Bucket-Entry($k) {
  @{
    strName          = "ItmBucket$($k.suffix)"
    strNameShort     = "Bucket: $($k.suffix)"
    strNameFriendly  = "Bucket of $((Get-Culture).TextInfo.ToTitleCase($k.noun))"
    strDesc          = "An oversized industrial bucket built for bulk salvage. Stays put -- drag it to where you want it. Accepts $($k.noun) only."
    strItemDef       = "ItmCrate01"
    strType          = "Item"
    strLoot           = $null
    strContainerCT   = $k.gate
    nContainerHeight = 8
    nContainerWidth  = 8
    aInteractions    = @("Inventory","DropItem","PickupItem")
    aStartingConds   = @(
      "IsContainer=1.0x1.0",
      "IsCrate=1.0x1.0",
      "IsOversized=1.0x1.0",
      "IsRigid=1.0x1.0",
      "IsSolid=1.0x1.0",
      "IsWaterproof=1.0x1.0",
      "StatBasePrice=1.0x400.0",
      "StatDamageMax=1.0x10",
      "StatDismantleProgressMax=1.0x20",
      "StatMass=1.0x15.0",
      "IsCategoryTools=1.0x1"
    )
    mapCondTolerance = @()
    mapPoints        = @()
    mapChargeProfiles= @("Melee","MeleeAttackDefault")
    aUpdateCommands  = @("Destructable,StatDamage,ACTCrate01Destroy,StatDamageMax,1.0")
    mapGUIPropMaps   = $null
    strPortraitImg   = "paperdoll/held/portCrate01"
    strAudioEmitter  = "ItmPlasticBoxSound"
    mapSlotEffects   = @(
      "heldL", "HeldItmCrate01L",
      "heldR", "HeldItmCrate01R",
      "drag",  "Blank"
    )
    jsonPI           = $null
  }
}

function Kiosk-Entry {
  # Standalone trade kiosk that exposes only sacks & buckets via
  # GUITradeSacksKiosk -> TraderSacksKiosk -> ItmSacksKioskInv.
  # Spawnable via 'spawn ItmSacksKiosk01' because the loot generator
  # adds a same-named self-reference wrapper to loot_self_reference.json.
  #
  # Conds were originally cloned from ItmKioskSupplies01, but vanilla
  # kiosks carry IsInstalled=1 because they're placed in ship layouts,
  # never spawned dynamically -- spawn failed mid-emit ("leftovers")
  # trying to instantiate something already-installed at the player's
  # feet. Stripped to a crate-like spawnability profile (IsOversized +
  # IsRigid + no IsInstalled/IsLocked/IsHiddenInv/IsInfiniteContainer)
  # so it drops on the floor on spawn and can be dragged into position.
  # Trade behavior preserved via IsTraderNPC (TIsTradeKiosk fires) and
  # the explicit aInteractions + mapGUIPropMaps wiring below.
  @{
    strName          = "ItmSacksKiosk01"
    strNameShort     = "Kiosk: Sacks & Buckets"
    strNameFriendly  = "Sacks & Buckets Kiosk"
    strDesc          = "A self-service kiosk stocked with single-type containers: sacks for wear-and-carry, buckets for bulk floor storage. One container, one item type."
    strItemDef       = "ItmKioskSupplies01"
    strType          = "Item"
    strLoot           = $null
    strContainerCT   = "TIsFitContainerUnlimited"
    nContainerHeight = 0
    nContainerWidth  = 0
    aInteractions    = @("ACTKioskUseNPC","GUITradeSacksKiosk")
    aStartingConds   = @(
      "IsContainer=1.0x1.0",
      "IsIndestructable=1.0x1",
      "IsKioskNPC=1.0x1",
      "IsOversized=1.0x1.0",
      "IsReadyRestock=1.0x1.0",
      "IsRigid=1.0x1.0",
      "IsSalvageValueHigh=1.0x1.0",
      "IsSolid=1.0x1.0",
      "IsTraderNPC=1.0x1",
      "StatMass=1.0x31.0",
      "StatDamageMax=1.0x70",
      "IsMechanical=1.0x1",
      "IsCategoryIndustrialProducts=1.0x1"
    )
    mapCondTolerance = @()
    mapPoints        = @("use,0,-16")
    mapChargeProfiles= @()
    aUpdateCommands  = @()
    mapGUIPropMaps   = @(
      "Panel A", "Trade",
      "Trade",   "Trade",
      "Trader",  "TraderSacksKiosk"
    )
    strPortraitImg   = "ItmKioskSupplies01"
    strAudioEmitter  = "ItmKioskHealth01Sound"
    mapSlotEffects   = @(
      "heldL", "HeldItmCrate01L",
      "heldR", "HeldItmCrate01R",
      "drag",  "Blank"
    )
    jsonPI           = $null
  }
}

$entries = @()
foreach ($k in $kinds) {
  $entries += Sack-Entry   $k
  $entries += Bucket-Entry $k
}
$entries += Kiosk-Entry

# Use ordered hashtables converted via JSON serialization.
# PowerShell 5.1 ConvertTo-Json reorders keys alphabetically when fed regular
# hashtables; force ordering with [ordered] re-wrap.
$ordered = @()
foreach ($e in $entries) {
  $o = [ordered]@{}
  foreach ($key in @(
    "strName","strNameShort","strNameFriendly","strDesc",
    "strItemDef","strType","strLoot","strContainerCT",
    "nContainerHeight","nContainerWidth",
    "aInteractions","aStartingConds",
    "mapCondTolerance","mapPoints","mapChargeProfiles",
    "aUpdateCommands","mapGUIPropMaps",
    "strPortraitImg","strAudioEmitter","mapSlotEffects","jsonPI"
  )) {
    $o[$key] = $e[$key]
  }
  $ordered += $o
}

$json = $ordered | ConvertTo-Json -Depth 6
[System.IO.File]::WriteAllText($outFile, $json, [System.Text.UTF8Encoding]::new($false))
"Wrote $($ordered.Count) entries to $outFile"
