window.SHIP_COMPONENT_CATEGORIES = {
  "_generated_by": "utils/python/build_ship_inspector_data.py",
  "_buckets": [
    "walls",
    "floors",
    "doors",
    "conduits",
    "containers",
    "equipment",
    "decorative",
    "other"
  ],
  "_counts": {
    "walls": 170,
    "floors": 498,
    "doors": 43,
    "conduits": 15,
    "containers": 117,
    "equipment": 587,
    "decorative": 0,
    "other": 1000
  },
  "_notes": "Per-strName bucket classification for every CondOwner / Item / CooverLay in the base game whose aStartingConds resolves through strCOBase. The bucket rule mirrors what the ship-inspector page applies to ship components. dmgTint is the cooverlay's strDmgColor name (resolved against data/colors/colors.json into #rrggbb under dmgTintHex when available); it's the *damage* tint, not the base sprite color, but useful as a coarse color-family hint.",
  "byBucket": {
    "walls": {
      "ItmSealTemp01": {
        "friendly": "\"Ripley\" Temporary Blister Seal Wall",
        "short": "Quick Seal Wall",
        "category": [
          "Hull"
        ],
        "basePrice": 79.0,
        "mass": 4.0,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmWallAero1x2SlantB": {
        "friendly": "Aerodynamic 1x2 Slant Wall (LH)",
        "short": "Slant Aero Wall",
        "category": [
          "Hull"
        ],
        "basePrice": 1000.0,
        "mass": 4.0,
        "durability": 7.0,
        "source": "condowner"
      },
      "ItmWallAero1x2SlantLoose": {
        "friendly": "Aerodynamic 1x2 Slant Wall (Loose, RH)",
        "short": "Slant Aero Wall",
        "category": [
          "Hull"
        ],
        "basePrice": 1000.0,
        "mass": 4.0,
        "durability": 7.0,
        "source": "condowner"
      },
      "ItmWallAero1x2Slant": {
        "friendly": "Aerodynamic 1x2 Slant Wall (RH)",
        "short": "Slant Aero Wall",
        "category": [
          "Hull"
        ],
        "basePrice": 1000.0,
        "mass": 4.0,
        "durability": 7.0,
        "source": "condowner"
      },
      "ItmWallAero1x3SlantB": {
        "friendly": "Aerodynamic 1x3 Slant Wall (LH)",
        "short": "Slant Aero Wall",
        "category": [
          "Hull"
        ],
        "basePrice": 2000.0,
        "mass": 6.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmWallAero1x3SlantBLoose": {
        "friendly": "Aerodynamic 1x3 Slant Wall (Loose, LH)",
        "short": "Slant Aero Wall",
        "category": [
          "Hull"
        ],
        "basePrice": 2000.0,
        "mass": 6.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmWallAero1x3SlantLoose": {
        "friendly": "Aerodynamic 1x3 Slant Wall (Loose, RH)",
        "short": "Slant Aero Wall",
        "category": [
          "Hull"
        ],
        "basePrice": 2000.0,
        "mass": 6.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmWallAero1x3Slant": {
        "friendly": "Aerodynamic 1x3 Slant Wall (RH)",
        "short": "Slant Aero Wall",
        "category": [
          "Hull"
        ],
        "basePrice": 2000.0,
        "mass": 6.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmWallAero1x1": {
        "friendly": "Aerodynamic Angled Wall",
        "short": "Aero Wall",
        "category": [
          "Hull"
        ],
        "basePrice": 500.0,
        "mass": 4.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmWallAero1x1Loose": {
        "friendly": "Aerodynamic Angled Wall (Loose)",
        "short": "Aero Wall",
        "category": [
          "Hull"
        ],
        "basePrice": 500.0,
        "mass": 4.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmWallAero1x1Sq": {
        "friendly": "Aerodynamic Wall",
        "short": "Aero Wall",
        "category": [
          "Hull"
        ],
        "basePrice": 500.0,
        "mass": 4.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmWallAero1x1SqLoose": {
        "friendly": "Aerodynamic Wall (Loose)",
        "short": "Aero Wall",
        "category": [
          "Hull"
        ],
        "basePrice": 500.0,
        "mass": 4.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmWallRock051x1": {
        "friendly": "Dark Regolith",
        "short": "Regolith",
        "basePrice": 0.0,
        "mass": 30.0,
        "durability": 15.0,
        "source": "condowner"
      },
      "ItmWallRock061x1": {
        "friendly": "Dark Regolith",
        "short": "Regolith",
        "basePrice": 0.0,
        "mass": 45.0,
        "durability": 15.0,
        "source": "condowner"
      },
      "ItmWallRock051x1Dmg": {
        "friendly": "Dark Regolith (Cracked)",
        "short": "Regolith",
        "basePrice": 0.0,
        "mass": 21.0,
        "durability": 30.0,
        "source": "condowner"
      },
      "ItmWallRock061x1Dmg": {
        "friendly": "Dark Regolith (Cracked)",
        "short": "Regolith",
        "basePrice": 0.0,
        "mass": 29.0,
        "durability": 30.0,
        "source": "condowner"
      },
      "ItmWallIce011x1": {
        "friendly": "Ice Wall",
        "basePrice": 0.0,
        "mass": 24.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmWallIce011x1Dmg": {
        "friendly": "Ice Wall (Cracked)",
        "short": "Ice Wall",
        "basePrice": 0.0,
        "mass": 15.0,
        "durability": 30.0,
        "source": "condowner"
      },
      "ItmNormalsTest": {
        "friendly": "ItmNormalsTest",
        "source": "condowner"
      },
      "ItmWall1x1Loose": {
        "friendly": "ItmWall1x1Loose",
        "short": "Wall",
        "category": [
          "Hull"
        ],
        "basePrice": 21.0,
        "mass": 24.0,
        "durability": 15.0,
        "source": "condowner"
      },
      "ItmWallAero1x2SlantBLoose": {
        "friendly": "Left-hand Aerodynamic 1x2 Slant Wall (Loose, LH)",
        "short": "Slant Aero Wall",
        "category": [
          "Hull"
        ],
        "basePrice": 1000.0,
        "mass": 4.0,
        "durability": 7.0,
        "source": "condowner"
      },
      "ItmWallRock031x1": {
        "friendly": "Shiny Regolith",
        "short": "Regolith",
        "basePrice": 0.0,
        "mass": 88.0,
        "durability": 15.0,
        "source": "condowner"
      },
      "ItmWallRock041x1": {
        "friendly": "Shiny Regolith",
        "short": "Regolith",
        "basePrice": 0.0,
        "mass": 110.0,
        "durability": 15.0,
        "source": "condowner"
      },
      "ItmWallRock031x1Dmg": {
        "friendly": "Shiny Regolith (Cracked)",
        "short": "Regolith",
        "basePrice": 0.0,
        "mass": 53.0,
        "durability": 30.0,
        "source": "condowner"
      },
      "ItmWallRock041x1Dmg": {
        "friendly": "Shiny Regolith (Cracked)",
        "short": "Regolith",
        "basePrice": 0.0,
        "mass": 65.0,
        "durability": 30.0,
        "source": "condowner"
      },
      "ItmWallRock011x1": {
        "friendly": "Stony Regolith",
        "short": "Regolith",
        "basePrice": 0.0,
        "mass": 52.0,
        "durability": 15.0,
        "source": "condowner"
      },
      "ItmWallRock021x1": {
        "friendly": "Stony Regolith",
        "short": "Regolith",
        "basePrice": 0.0,
        "mass": 79.0,
        "durability": 15.0,
        "source": "condowner"
      },
      "ItmWallRock011x1Dmg": {
        "friendly": "Stony Regolith (Cracked)",
        "short": "Regolith",
        "basePrice": 0.0,
        "mass": 24.0,
        "durability": 29.0,
        "source": "condowner"
      },
      "ItmWallRock021x1Dmg": {
        "friendly": "Stony Regolith (Cracked)",
        "short": "Regolith",
        "basePrice": 0.0,
        "mass": 45.0,
        "durability": 30.0,
        "source": "condowner"
      },
      "ItmWall1x1": {
        "friendly": "Wall",
        "category": [
          "Hull"
        ],
        "basePrice": 21.0,
        "mass": 24.0,
        "durability": 15.0,
        "source": "condowner"
      },
      "ItmWall1x1Dmg": {
        "friendly": "Wall (Damaged)",
        "short": "Wall",
        "category": [
          "Hull"
        ],
        "basePrice": 13.0,
        "mass": 18.0,
        "durability": 30.0,
        "source": "condowner"
      },
      "ItmWallCAYL05Dmg": {
        "friendly": "Wall (Damaged): Caylon \"DuraWal Exterior Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 210.0,
        "mass": 12.0,
        "durability": 30.0,
        "source": "cooverlay"
      },
      "ItmWallCAYL02Dmg": {
        "friendly": "Wall (Damaged): Caylon \"DuraWal Interior Green Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 210.0,
        "mass": 12.0,
        "durability": 30.0,
        "source": "cooverlay"
      },
      "ItmWallCAYL03Dmg": {
        "friendly": "Wall (Damaged): Caylon \"DuraWal Interior Orange Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 210.0,
        "mass": 12.0,
        "durability": 30.0,
        "source": "cooverlay"
      },
      "ItmWallCAYL04Dmg": {
        "friendly": "Wall (Damaged): Caylon \"DuraWal Interior Red Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 210.0,
        "mass": 12.0,
        "durability": 30.0,
        "source": "cooverlay"
      },
      "ItmWallPlastic1x1Dmg": {
        "friendly": "Wall (Damaged): Caylon \"DuraWal Interior Series\"",
        "short": "Wall",
        "category": [
          "Hull"
        ],
        "basePrice": 210.0,
        "mass": 12.0,
        "durability": 30.0,
        "source": "condowner"
      },
      "ItmWallLDPH01Dmg": {
        "friendly": "Wall (Damaged): Langdon-Phillips \"Glory Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 13.0,
        "mass": 18.0,
        "durability": 30.0,
        "source": "cooverlay"
      },
      "ItmWallMSHG01Dmg": {
        "friendly": "Wall (Damaged): Minsheng \"和平 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 13.0,
        "mass": 18.0,
        "durability": 30.0,
        "source": "cooverlay"
      },
      "ItmWallMSHG02Dmg": {
        "friendly": "Wall (Damaged): Minsheng \"昌盛 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 13.0,
        "mass": 18.0,
        "durability": 30.0,
        "source": "cooverlay"
      },
      "ItmWallMSHG03Dmg": {
        "friendly": "Wall (Damaged): Minsheng \"神仙 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 13.0,
        "mass": 18.0,
        "durability": 30.0,
        "source": "cooverlay"
      },
      "ItmWallMSHG05Dmg": {
        "friendly": "Wall (Damaged): Minsheng \"神仙 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 13.0,
        "mass": 18.0,
        "durability": 30.0,
        "source": "cooverlay"
      },
      "ItmWallMSHG04Dmg": {
        "friendly": "Wall (Damaged): Minsheng \"纯度 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 13.0,
        "mass": 18.0,
        "durability": 30.0,
        "source": "cooverlay"
      },
      "ItmWallMSSLFWhiteDmg": {
        "friendly": "Wall (Damaged): Mobile Space Systems \"Light Framework\"",
        "category": [
          "Hull"
        ],
        "basePrice": 13.0,
        "mass": 18.0,
        "durability": 30.0,
        "source": "cooverlay"
      },
      "ItmWallRYOB01Dmg": {
        "friendly": "Wall (Damaged): Ryokka \"B-01\"",
        "category": [
          "Hull"
        ],
        "basePrice": 13.0,
        "mass": 18.0,
        "durability": 30.0,
        "source": "cooverlay"
      },
      "ItmWallRYOB02Dmg": {
        "friendly": "Wall (Damaged): Ryokka \"B-02\"",
        "category": [
          "Hull"
        ],
        "basePrice": 13.0,
        "mass": 18.0,
        "durability": 30.0,
        "source": "cooverlay"
      },
      "ItmWallTSDO44Dmg": {
        "friendly": "Wall (Damaged): Testudo \"44 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 13.0,
        "mass": 18.0,
        "durability": 30.0,
        "source": "cooverlay"
      },
      "ItmWallTSDO01Dmg": {
        "friendly": "Wall (Damaged): Testudo \"55 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 13.0,
        "mass": 18.0,
        "durability": 30.0,
        "source": "cooverlay"
      },
      "ItmWallAERO01bDmg": {
        "friendly": "Wall (Damaged): Testudo \"Aero II Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 13.0,
        "mass": 18.0,
        "durability": 30.0,
        "source": "cooverlay"
      },
      "ItmWallAERO01Dmg": {
        "friendly": "Wall (Damaged): Testudo \"Aero Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 13.0,
        "mass": 18.0,
        "durability": 30.0,
        "source": "cooverlay"
      },
      "ItmWallAERO02Dmg": {
        "friendly": "Wall (Damaged): Testudo \"LA Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 13.0,
        "mass": 18.0,
        "durability": 30.0,
        "source": "cooverlay"
      },
      "ItmWallVHRBDmg": {
        "friendly": "Wall (Damaged): Van Hummel \"Banner\"",
        "category": [
          "Hull"
        ],
        "basePrice": 13.0,
        "mass": 18.0,
        "durability": 30.0,
        "source": "cooverlay"
      },
      "ItmWallCAYL05Loose": {
        "friendly": "Wall (Loose): Caylon \"DuraWal Exterior Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 210.0,
        "mass": 14.0,
        "durability": 10.0,
        "source": "cooverlay"
      },
      "ItmWallCAYL02Loose": {
        "friendly": "Wall (Loose): Caylon \"DuraWal Interior Green Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 210.0,
        "mass": 14.0,
        "durability": 10.0,
        "source": "cooverlay"
      },
      "ItmWallCAYL03Loose": {
        "friendly": "Wall (Loose): Caylon \"DuraWal Interior Orange Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 210.0,
        "mass": 14.0,
        "durability": 10.0,
        "source": "cooverlay"
      },
      "ItmWallCAYL04Loose": {
        "friendly": "Wall (Loose): Caylon \"DuraWal Interior Red Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 210.0,
        "mass": 14.0,
        "durability": 10.0,
        "source": "cooverlay"
      },
      "ItmWallPlastic1x1Loose": {
        "friendly": "Wall (Loose): Caylon \"DuraWal Interior Series\"",
        "short": "Wall",
        "category": [
          "Hull"
        ],
        "basePrice": 210.0,
        "mass": 14.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmWallLDPH01Loose": {
        "friendly": "Wall (Loose): Langdon-Phillips \"Glory Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 21.0,
        "mass": 24.0,
        "durability": 15.0,
        "source": "cooverlay"
      },
      "ItmWallMSHG01Loose": {
        "friendly": "Wall (Loose): Minsheng \"和平 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 21.0,
        "mass": 24.0,
        "durability": 15.0,
        "source": "cooverlay"
      },
      "ItmWallMSHG02Loose": {
        "friendly": "Wall (Loose): Minsheng \"昌盛 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 21.0,
        "mass": 24.0,
        "durability": 15.0,
        "source": "cooverlay"
      },
      "ItmWallMSHG03Loose": {
        "friendly": "Wall (Loose): Minsheng \"神仙 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 21.0,
        "mass": 24.0,
        "durability": 15.0,
        "source": "cooverlay"
      },
      "ItmWallMSHG05Loose": {
        "friendly": "Wall (Loose): Minsheng \"神仙 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 21.0,
        "mass": 24.0,
        "durability": 15.0,
        "source": "cooverlay"
      },
      "ItmWallMSHG04Loose": {
        "friendly": "Wall (Loose): Minsheng \"纯度 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 21.0,
        "mass": 24.0,
        "durability": 15.0,
        "source": "cooverlay"
      },
      "ItmWallMSSLFWhiteLoose": {
        "friendly": "Wall (Loose): Mobile Space Systems \"Light Framework\"",
        "category": [
          "Hull"
        ],
        "basePrice": 21.0,
        "mass": 24.0,
        "durability": 15.0,
        "source": "cooverlay"
      },
      "ItmWallRYOB01Loose": {
        "friendly": "Wall (Loose): Ryokka \"B-01\"",
        "category": [
          "Hull"
        ],
        "basePrice": 21.0,
        "mass": 24.0,
        "durability": 15.0,
        "source": "cooverlay"
      },
      "ItmWallRYOB02Loose": {
        "friendly": "Wall (Loose): Ryokka \"B-02\"",
        "category": [
          "Hull"
        ],
        "basePrice": 21.0,
        "mass": 24.0,
        "durability": 15.0,
        "source": "cooverlay"
      },
      "ItmWallTSDO44Loose": {
        "friendly": "Wall (Loose): Testudo \"44 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 21.0,
        "mass": 24.0,
        "durability": 15.0,
        "source": "cooverlay"
      },
      "ItmWallTSDO01Loose": {
        "friendly": "Wall (Loose): Testudo \"55 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 21.0,
        "mass": 24.0,
        "durability": 15.0,
        "source": "cooverlay"
      },
      "ItmWallAERO01bLoose": {
        "friendly": "Wall (Loose): Testudo \"Aero II Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 21.0,
        "mass": 24.0,
        "durability": 15.0,
        "source": "cooverlay"
      },
      "ItmWallAERO01Loose": {
        "friendly": "Wall (Loose): Testudo \"Aero Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 21.0,
        "mass": 24.0,
        "durability": 15.0,
        "source": "cooverlay"
      },
      "ItmWallAERO02Loose": {
        "friendly": "Wall (Loose): Testudo \"LA Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 21.0,
        "mass": 24.0,
        "durability": 15.0,
        "source": "cooverlay"
      },
      "ItmWallVHRBLoose": {
        "friendly": "Wall (Loose): Van Hummel \"Banner\"",
        "category": [
          "Hull"
        ],
        "basePrice": 21.0,
        "mass": 24.0,
        "durability": 15.0,
        "source": "cooverlay"
      },
      "ItmWall1x1Patch": {
        "friendly": "Wall (Patched)",
        "short": "Wall",
        "category": [
          "Hull"
        ],
        "basePrice": 14.0,
        "mass": 19.0,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmWallCAYL04Patch": {
        "friendly": "Wall (Patched): Caylon \"DuraWal Exterior Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 210.0,
        "mass": 12.0,
        "durability": 30.0,
        "source": "cooverlay"
      },
      "ItmWallCAYL05Patch": {
        "friendly": "Wall (Patched): Caylon \"DuraWal Exterior Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 210.0,
        "mass": 12.0,
        "durability": 30.0,
        "source": "cooverlay"
      },
      "ItmWallCAYL02Patch": {
        "friendly": "Wall (Patched): Caylon \"DuraWal Interior Green Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 210.0,
        "mass": 12.0,
        "durability": 30.0,
        "source": "cooverlay"
      },
      "ItmWallCAYL03Patch": {
        "friendly": "Wall (Patched): Caylon \"DuraWal Interior Orange Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 210.0,
        "mass": 12.0,
        "durability": 30.0,
        "source": "cooverlay"
      },
      "ItmWallPlastic1x1Patch": {
        "friendly": "Wall (Patched): Caylon \"DuraWal Interior Series\"",
        "short": "Wall",
        "category": [
          "Hull"
        ],
        "basePrice": 210.0,
        "mass": 12.0,
        "durability": 30.0,
        "source": "condowner"
      },
      "ItmWallLDPH01Patch": {
        "friendly": "Wall (Patched): Langdon-Phillips \"Glory Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 14.0,
        "mass": 19.0,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmWallMSHG01Patch": {
        "friendly": "Wall (Patched): Minsheng \"和平 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 14.0,
        "mass": 19.0,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmWallMSHG02Patch": {
        "friendly": "Wall (Patched): Minsheng \"昌盛 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 14.0,
        "mass": 19.0,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmWallMSHG03Patch": {
        "friendly": "Wall (Patched): Minsheng \"神仙 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 14.0,
        "mass": 19.0,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmWallMSHG05Patch": {
        "friendly": "Wall (Patched): Minsheng \"神仙 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 14.0,
        "mass": 19.0,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmWallMSHG04Patch": {
        "friendly": "Wall (Patched): Minsheng \"纯度 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 14.0,
        "mass": 19.0,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmWallMSSLFWhitePatch": {
        "friendly": "Wall (Patched): Mobile Space Systems \"Light Framework\"",
        "category": [
          "Hull"
        ],
        "basePrice": 14.0,
        "mass": 19.0,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmWallRYOB01Patch": {
        "friendly": "Wall (Patched): Ryokka \"B-01\"",
        "category": [
          "Hull"
        ],
        "basePrice": 14.0,
        "mass": 19.0,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmWallRYOB02Patch": {
        "friendly": "Wall (Patched): Ryokka \"B-02\"",
        "category": [
          "Hull"
        ],
        "basePrice": 14.0,
        "mass": 19.0,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmWallTSDO44Patch": {
        "friendly": "Wall (Patched): Testudo \"44 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 14.0,
        "mass": 19.0,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmWallTSDO01Patch": {
        "friendly": "Wall (Patched): Testudo \"55 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 14.0,
        "mass": 19.0,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmWallAERO01bPatch": {
        "friendly": "Wall (Patched): Testudo \"Aero II Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 14.0,
        "mass": 19.0,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmWallAERO01Patch": {
        "friendly": "Wall (Patched): Testudo \"Aero Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 14.0,
        "mass": 19.0,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmWallAERO02Patch": {
        "friendly": "Wall (Patched): Testudo \"LA Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 14.0,
        "mass": 19.0,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmWallVHRBPatch": {
        "friendly": "Wall (Patched): Van Hummel \"Banner\"",
        "category": [
          "Hull"
        ],
        "basePrice": 14.0,
        "mass": 19.0,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmLitWall1x0": {
        "friendly": "Wall Light: Blue",
        "short": "Light",
        "category": [
          "Hull"
        ],
        "basePrice": 83.0,
        "mass": 0.5,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmLitWall1x0OffLoose": {
        "friendly": "Wall Light: Blue (Loose)",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 83.0,
        "mass": 0.5,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmLitWall1x0Off": {
        "friendly": "Wall Light: Blue (Off)",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 83.0,
        "mass": 0.5,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmLitWall1x0Custom": {
        "friendly": "Wall Light: Blue Setting",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 383.0,
        "mass": 0.5,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmLitWall1x0OffLooseCustom": {
        "friendly": "Wall Light: Blue Setting (Loose)",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 383.0,
        "mass": 0.5,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmLitWall1x0OffCustom": {
        "friendly": "Wall Light: Blue Setting (Off)",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 383.0,
        "mass": 0.5,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmLitWall1x0VibrantGreen": {
        "friendly": "Wall Light: Green",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 108.0,
        "mass": 0.5,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmLitWall1x0VibrantGreenOffLoose": {
        "friendly": "Wall Light: Green (Loose)",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 108.0,
        "mass": 0.5,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmLitWall1x0VibrantGreenOff": {
        "friendly": "Wall Light: Green (Off)",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 108.0,
        "mass": 0.5,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmLitWall1x0VibrantGreenCustom": {
        "friendly": "Wall Light: Green Setting",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 383.0,
        "mass": 0.5,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmLitWall1x0VibrantGreenOffLooseCustom": {
        "friendly": "Wall Light: Green Setting (Loose)",
        "short": "Light",
        "category": [
          "FusionParts"
        ],
        "basePrice": 383.0,
        "mass": 0.5,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmLitWall1x0VibrantGreenOffCustom": {
        "friendly": "Wall Light: Green Setting (Off)",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 383.0,
        "mass": 0.5,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmLitWall1x0Orange": {
        "friendly": "Wall Light: Orange",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 92.0,
        "mass": 0.5,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmLitWall1x0OrangeOffLoose": {
        "friendly": "Wall Light: Orange (Loose)",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 92.0,
        "mass": 0.5,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmLitWall1x0OrangeOff": {
        "friendly": "Wall Light: Orange (Off)",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 92.0,
        "mass": 0.5,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmLitWall1x0OrangeCustom": {
        "friendly": "Wall Light: Orange Setting",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 383.0,
        "mass": 0.5,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmLitWall1x0OrangeOffLooseCustom": {
        "friendly": "Wall Light: Orange Setting (Loose)",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 383.0,
        "mass": 0.5,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmLitWall1x0OrangeOffCustom": {
        "friendly": "Wall Light: Orange Setting (Off)",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 383.0,
        "mass": 0.5,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmLitWall1x0VibrantPurple": {
        "friendly": "Wall Light: Purple",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 151.0,
        "mass": 0.5,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmLitWall1x0VibrantPurpleOffLoose": {
        "friendly": "Wall Light: Purple (Loose)",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 151.0,
        "mass": 0.5,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmLitWall1x0VibrantPurpleOff": {
        "friendly": "Wall Light: Purple (Off)",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 151.0,
        "mass": 0.5,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmLitWall1x0VibrantPurpleCustom": {
        "friendly": "Wall Light: Purple Setting",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 383.0,
        "mass": 0.5,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmLitWall1x0VibrantPurpleOffLooseCustom": {
        "friendly": "Wall Light: Purple Setting (Loose)",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 383.0,
        "mass": 0.5,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmLitWall1x0VibrantPurpleOffCustom": {
        "friendly": "Wall Light: Purple Setting (Off)",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 383.0,
        "mass": 0.5,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmLitWall1x0VibrantRed": {
        "friendly": "Wall Light: Red",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 111.0,
        "mass": 0.5,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmLitWall1x0VibrantRedOffLoose": {
        "friendly": "Wall Light: Red (Loose)",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 111.0,
        "mass": 0.5,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmLitWall1x0VibrantRedOff": {
        "friendly": "Wall Light: Red (Off)",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 111.0,
        "mass": 0.5,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmLitWall1x0VibrantRedCustom": {
        "friendly": "Wall Light: Red Setting",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 383.0,
        "mass": 0.5,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmLitWall1x0VibrantRedOffLooseCustom": {
        "friendly": "Wall Light: Red Setting (Loose)",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 383.0,
        "mass": 0.5,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmLitWall1x0VibrantRedOffCustom": {
        "friendly": "Wall Light: Red Setting (Off)",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 383.0,
        "mass": 0.5,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmLitWall1x0White": {
        "friendly": "Wall Light: White",
        "short": "Light",
        "category": [
          "Hull"
        ],
        "basePrice": 83.0,
        "mass": 0.5,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmLitWall1x0WhiteOffLoose": {
        "friendly": "Wall Light: White (Loose)",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 83.0,
        "mass": 0.5,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmLitWall1x0WhiteOff": {
        "friendly": "Wall Light: White (Off)",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 83.0,
        "mass": 0.5,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmLitWall1x0WhiteCustom": {
        "friendly": "Wall Light: White Setting",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 383.0,
        "mass": 0.5,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmLitWall1x0WhiteOffLooseCustom": {
        "friendly": "Wall Light: White Setting (Loose)",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 383.0,
        "mass": 0.5,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmLitWall1x0WhiteOffCustom": {
        "friendly": "Wall Light: White Setting (Off)",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 383.0,
        "mass": 0.5,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmWallCAYL05": {
        "friendly": "Wall: Caylon \"DuraWal Exterior Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 210.0,
        "mass": 14.0,
        "durability": 10.0,
        "source": "cooverlay"
      },
      "ItmWallCAYL02": {
        "friendly": "Wall: Caylon \"DuraWal Interior Green Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 210.0,
        "mass": 14.0,
        "durability": 10.0,
        "source": "cooverlay"
      },
      "ItmWallCAYL03": {
        "friendly": "Wall: Caylon \"DuraWal Interior Orange Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 210.0,
        "mass": 14.0,
        "durability": 10.0,
        "source": "cooverlay"
      },
      "ItmWallCAYL04": {
        "friendly": "Wall: Caylon \"DuraWal Interior Red Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 210.0,
        "mass": 14.0,
        "durability": 10.0,
        "source": "cooverlay"
      },
      "ItmWallPlastic1x1": {
        "friendly": "Wall: Caylon \"DuraWal Interior Series\"",
        "short": "Wall",
        "category": [
          "Hull"
        ],
        "basePrice": 210.0,
        "mass": 14.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmWallLDPH01": {
        "friendly": "Wall: Langdon-Phillips \"Glory Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 21.0,
        "mass": 24.0,
        "durability": 15.0,
        "source": "cooverlay"
      },
      "ItmWallMSHG01": {
        "friendly": "Wall: Minsheng \"和平 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 21.0,
        "mass": 24.0,
        "durability": 15.0,
        "source": "cooverlay"
      },
      "ItmWallMSHG02": {
        "friendly": "Wall: Minsheng \"昌盛 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 21.0,
        "mass": 24.0,
        "durability": 15.0,
        "source": "cooverlay"
      },
      "ItmWallMSHG03": {
        "friendly": "Wall: Minsheng \"神仙 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 21.0,
        "mass": 24.0,
        "durability": 15.0,
        "source": "cooverlay"
      },
      "ItmWallMSHG05": {
        "friendly": "Wall: Minsheng \"神仙 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 21.0,
        "mass": 24.0,
        "durability": 15.0,
        "source": "cooverlay"
      },
      "ItmWallMSHG04": {
        "friendly": "Wall: Minsheng \"纯度 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 21.0,
        "mass": 24.0,
        "durability": 15.0,
        "source": "cooverlay"
      },
      "ItmWallMSSLFWhite": {
        "friendly": "Wall: Mobile Space Systems \"Light Framework\"",
        "category": [
          "Hull"
        ],
        "basePrice": 21.0,
        "mass": 24.0,
        "durability": 15.0,
        "source": "cooverlay"
      },
      "ItmWallRYOB01": {
        "friendly": "Wall: Ryokka \"B-01\"",
        "category": [
          "Hull"
        ],
        "basePrice": 21.0,
        "mass": 24.0,
        "durability": 15.0,
        "source": "cooverlay"
      },
      "ItmWallRYOB02": {
        "friendly": "Wall: Ryokka \"B-02\"",
        "category": [
          "Hull"
        ],
        "basePrice": 21.0,
        "mass": 24.0,
        "durability": 15.0,
        "source": "cooverlay"
      },
      "ItmWallTSDO44": {
        "friendly": "Wall: Testudo \"44 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 21.0,
        "mass": 24.0,
        "durability": 15.0,
        "source": "cooverlay"
      },
      "ItmWallTSDO01": {
        "friendly": "Wall: Testudo \"55 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 21.0,
        "mass": 24.0,
        "durability": 15.0,
        "source": "cooverlay"
      },
      "ItmWallAERO01b": {
        "friendly": "Wall: Testudo \"Aero II Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 21.0,
        "mass": 24.0,
        "durability": 15.0,
        "source": "cooverlay"
      },
      "ItmWallAERO01": {
        "friendly": "Wall: Testudo \"Aero Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 21.0,
        "mass": 24.0,
        "durability": 15.0,
        "source": "cooverlay"
      },
      "ItmWallAERO02": {
        "friendly": "Wall: Testudo \"LA Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 21.0,
        "mass": 24.0,
        "durability": 15.0,
        "source": "cooverlay"
      },
      "ItmWallVHRB": {
        "friendly": "Wall: Van Hummel \"Banner\"",
        "category": [
          "Hull"
        ],
        "basePrice": 21.0,
        "mass": 24.0,
        "durability": 15.0,
        "source": "cooverlay"
      },
      "ItmWallThin1x107Loose": {
        "friendly": "Whipple Framework (Loose): Testudo \"Caution Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 88.0,
        "mass": 5.0,
        "durability": 5.0,
        "source": "cooverlay"
      },
      "ItmWallThin1x104Loose": {
        "friendly": "Whipple Framework (Loose): Testudo \"Fire Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 88.0,
        "mass": 5.0,
        "durability": 5.0,
        "source": "cooverlay"
      },
      "ItmWallThin1x102Loose": {
        "friendly": "Whipple Framework (Loose): Testudo \"Grass Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 88.0,
        "mass": 5.0,
        "durability": 5.0,
        "source": "cooverlay"
      },
      "ItmWallThin1x106Loose": {
        "friendly": "Whipple Framework (Loose): Testudo \"Gunmetal Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 88.0,
        "mass": 5.0,
        "durability": 5.0,
        "source": "cooverlay"
      },
      "ItmWallThin1x103Loose": {
        "friendly": "Whipple Framework (Loose): Testudo \"Sand Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 88.0,
        "mass": 5.0,
        "durability": 5.0,
        "source": "cooverlay"
      },
      "ItmWallThin1x105Loose": {
        "friendly": "Whipple Framework (Loose): Testudo \"Sun Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 88.0,
        "mass": 5.0,
        "durability": 5.0,
        "source": "cooverlay"
      },
      "ItmWallThin1x107": {
        "friendly": "Whipple Framework: Testudo \"Caution Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 88.0,
        "mass": 5.0,
        "durability": 5.0,
        "source": "cooverlay"
      },
      "ItmWallThin1x104": {
        "friendly": "Whipple Framework: Testudo \"Fire Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 88.0,
        "mass": 5.0,
        "durability": 5.0,
        "source": "cooverlay"
      },
      "ItmWallThin1x102": {
        "friendly": "Whipple Framework: Testudo \"Grass Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 88.0,
        "mass": 5.0,
        "durability": 5.0,
        "source": "cooverlay"
      },
      "ItmWallThin1x106": {
        "friendly": "Whipple Framework: Testudo \"Gunmetal Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 88.0,
        "mass": 5.0,
        "durability": 5.0,
        "source": "cooverlay"
      },
      "ItmWallThin1x1": {
        "friendly": "Whipple Framework: Testudo \"Rain Series\"",
        "short": "Frame",
        "category": [
          "Hull"
        ],
        "basePrice": 88.0,
        "mass": 5.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmWallThin1x1Loose": {
        "friendly": "Whipple Framework: Testudo \"Rain Series\"",
        "short": "Frame",
        "category": [
          "Hull"
        ],
        "basePrice": 88.0,
        "mass": 5.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmWallThin1x103": {
        "friendly": "Whipple Framework: Testudo \"Sand Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 88.0,
        "mass": 5.0,
        "durability": 5.0,
        "source": "cooverlay"
      },
      "ItmWallThin1x105": {
        "friendly": "Whipple Framework: Testudo \"Sun Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 88.0,
        "mass": 5.0,
        "durability": 5.0,
        "source": "cooverlay"
      },
      "ItmWallWindow1x1": {
        "friendly": "Window Angled Wall",
        "short": "Window",
        "category": [
          "Hull"
        ],
        "basePrice": 330.0,
        "mass": 10.0,
        "durability": 7.0,
        "source": "condowner"
      },
      "ItmWallWindow1x1Loose": {
        "friendly": "Window Angled Wall (Loose)",
        "short": "Window",
        "category": [
          "Hull"
        ],
        "basePrice": 330.0,
        "mass": 10.0,
        "durability": 7.0,
        "source": "condowner"
      },
      "ItmWallWindow1x1Sq": {
        "friendly": "Window Wall",
        "short": "Window",
        "category": [
          "Hull"
        ],
        "basePrice": 330.0,
        "mass": 10.0,
        "durability": 7.0,
        "source": "condowner"
      },
      "ItmWallWindow1x1Dmg": {
        "friendly": "Window Wall (Damaged)",
        "short": "Window",
        "category": [
          "Hull"
        ],
        "basePrice": 66.0,
        "mass": 10.0,
        "durability": 14.0,
        "source": "condowner"
      },
      "ItmWallWindow1x1SqDmg": {
        "friendly": "Window Wall (Damaged)",
        "short": "Window",
        "category": [
          "Hull"
        ],
        "basePrice": 66.0,
        "mass": 10.0,
        "durability": 14.0,
        "source": "condowner"
      },
      "ItmWallWindow1x1SqLoose": {
        "friendly": "Window Wall (Loose)",
        "short": "Window",
        "category": [
          "Hull"
        ],
        "basePrice": 330.0,
        "mass": 10.0,
        "durability": 7.0,
        "source": "condowner"
      },
      "ItmWallWindow1x1Patch": {
        "friendly": "Window Wall (Patched)",
        "short": "Window",
        "category": [
          "Hull"
        ],
        "basePrice": 66.0,
        "mass": 10.0,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmWallWindow1x1SqPatch": {
        "friendly": "Window Wall (Patched)",
        "short": "Window",
        "category": [
          "Hull"
        ],
        "basePrice": 66.0,
        "mass": 10.0,
        "durability": 4.0,
        "source": "condowner"
      }
    },
    "floors": {
      "ItmFloorRock021x1C": {
        "friendly": "Dark Rock Core",
        "short": "Dark Core",
        "mass": 37.0,
        "durability": 37.0,
        "source": "condowner"
      },
      "ItmFloorRock02CDmg": {
        "friendly": "Dark Rock Core (Cracked)",
        "short": "Dark Core",
        "mass": 148.0,
        "durability": 296.0,
        "source": "condowner"
      },
      "ItmFloorRock02C": {
        "friendly": "Dark Rock Core (Deposit)",
        "short": "Dark Core",
        "mass": 296.0,
        "durability": 29.0,
        "source": "condowner"
      },
      "ItmFloorRock02CDepositDmg": {
        "friendly": "Dark Rock Core (Deposit)",
        "short": "Dark Deposit",
        "mass": 148.0,
        "durability": 74.0,
        "source": "condowner"
      },
      "ItmFloorLabelBloom": {
        "friendly": "Emblem: Bloom",
        "short": "Emblem",
        "category": [
          "Media"
        ],
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmFloorLabelDynastyCoin": {
        "friendly": "Emblem: Dynasty Coin",
        "short": "Emblem",
        "category": [
          "Media"
        ],
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmFloorLabelEagle": {
        "friendly": "Emblem: Eagle",
        "short": "Emblem",
        "category": [
          "Media"
        ],
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmFloorLabelStarsAndStripes": {
        "friendly": "Emblem: Stars And Stripes",
        "short": "Emblem",
        "category": [
          "Media"
        ],
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmFloorGrate01": {
        "friendly": "Floor",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "source": "condowner"
      },
      "ItmFloorGrate01Dmg": {
        "friendly": "Floor (Damaged)",
        "short": "Floor",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "source": "condowner"
      },
      "ItmFloorWood01Dmg": {
        "friendly": "Floor (Damaged): Minsheng \"Forest 森林\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSHG08Dmg": {
        "friendly": "Floor (Damaged): Minsheng \"Power 力\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintGreyRYODark",
        "dmgTintHex": "#0c0d0d",
        "source": "cooverlay"
      },
      "ItmFloorRYOF01Dmg": {
        "friendly": "Floor (Damaged): Ryokka \"F-01\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintGreyRYODark",
        "dmgTintHex": "#0c0d0d",
        "source": "cooverlay"
      },
      "ItmFloorRYOF02Dmg": {
        "friendly": "Floor (Damaged): Ryokka \"F-02\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintGreyRYODark",
        "dmgTintHex": "#0c0d0d",
        "source": "cooverlay"
      },
      "ItmFloorRYOF03Dmg": {
        "friendly": "Floor (Damaged): Ryokka \"F-03\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintGreyRYODark",
        "dmgTintHex": "#0c0d0d",
        "source": "cooverlay"
      },
      "ItmFloorRYOF04Dmg": {
        "friendly": "Floor (Damaged): Ryokka \"F-04\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintGreyRYODark",
        "dmgTintHex": "#0c0d0d",
        "source": "cooverlay"
      },
      "ItmFloorRYOF05Dmg": {
        "friendly": "Floor (Damaged): Ryokka \"F-05\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintGreyRYODark",
        "dmgTintHex": "#0c0d0d",
        "source": "cooverlay"
      },
      "ItmFloorTSDO05Dmg": {
        "friendly": "Floor (Damaged): Testudo \"100 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintGreyTSDO",
        "dmgTintHex": "#22242a",
        "source": "cooverlay"
      },
      "ItmFloorTSDO46_01Dmg": {
        "friendly": "Floor (Damaged): Testudo \"46 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownTSDO",
        "dmgTintHex": "#5e5546",
        "source": "cooverlay"
      },
      "ItmFloorTSDO46_02Dmg": {
        "friendly": "Floor (Damaged): Testudo \"47 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownTSDO",
        "dmgTintHex": "#5e5546",
        "source": "cooverlay"
      },
      "ItmFloorTSDO46_03Dmg": {
        "friendly": "Floor (Damaged): Testudo \"48 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintDarkGrey",
        "dmgTintHex": "#323232",
        "source": "cooverlay"
      },
      "ItmFloorTSDO46_04Dmg": {
        "friendly": "Floor (Damaged): Testudo \"49 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownTSDO",
        "dmgTintHex": "#5e5546",
        "source": "cooverlay"
      },
      "ItmFloorTSDO46_05Dmg": {
        "friendly": "Floor (Damaged): Testudo \"50 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownTSDO",
        "dmgTintHex": "#5e5546",
        "source": "cooverlay"
      },
      "ItmFloorTSDO01Dmg": {
        "friendly": "Floor (Damaged): Testudo \"96 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintGreyTSDO",
        "dmgTintHex": "#22242a",
        "source": "cooverlay"
      },
      "ItmFloorTSDO02Dmg": {
        "friendly": "Floor (Damaged): Testudo \"97 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintGreyTSDO",
        "dmgTintHex": "#22242a",
        "source": "cooverlay"
      },
      "ItmFloorTSDO03Dmg": {
        "friendly": "Floor (Damaged): Testudo \"98 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintGreyTSDO",
        "dmgTintHex": "#22242a",
        "source": "cooverlay"
      },
      "ItmFloorTSDO04Dmg": {
        "friendly": "Floor (Damaged): Testudo \"99 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintGreyTSDO",
        "dmgTintHex": "#22242a",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_08Dmg": {
        "friendly": "Floor (Damaged): Testudo \"Breakout Turf\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintRedVH",
        "dmgTintHex": "#301213",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_08aDmg": {
        "friendly": "Floor (Damaged): Testudo \"Breakout Turf\" Panel A",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintRedVH",
        "dmgTintHex": "#301213",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_08bDmg": {
        "friendly": "Floor (Damaged): Testudo \"Breakout Turf\" Panel B",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintRedVH",
        "dmgTintHex": "#301213",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_08cDmg": {
        "friendly": "Floor (Damaged): Testudo \"Breakout Turf\" Panel C",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintRedVH",
        "dmgTintHex": "#301213",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_08dDmg": {
        "friendly": "Floor (Damaged): Testudo \"Breakout Turf\" Panel D",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintRedVH",
        "dmgTintHex": "#301213",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_08eDmg": {
        "friendly": "Floor (Damaged): Testudo \"Breakout Turf\" Panel E",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintRedVH",
        "dmgTintHex": "#301213",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_08fDmg": {
        "friendly": "Floor (Damaged): Testudo \"Breakout Turf\" Panel F",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintRedVH",
        "dmgTintHex": "#301213",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_01Dmg": {
        "friendly": "Floor (Damaged): Testudo \"Spring\" Panel A",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintGreyVH",
        "dmgTintHex": "#737062",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_02Dmg": {
        "friendly": "Floor (Damaged): Testudo \"Spring\" Panel B",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintGreyVH",
        "dmgTintHex": "#737062",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_03Dmg": {
        "friendly": "Floor (Damaged): Testudo \"Spring\" Panel C",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintRedVH",
        "dmgTintHex": "#301213",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_04Dmg": {
        "friendly": "Floor (Damaged): Testudo \"Spring\" Panel D",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintGreyVH",
        "dmgTintHex": "#737062",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_05Dmg": {
        "friendly": "Floor (Damaged): Testudo \"Spring\" Panel E",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintRedVH",
        "dmgTintHex": "#301213",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_06Dmg": {
        "friendly": "Floor (Damaged): Testudo \"Spring\" Panel F",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintRedVH",
        "dmgTintHex": "#301213",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_07Dmg": {
        "friendly": "Floor (Damaged): Testudo \"Spring\" Panel G",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintGreyVH",
        "dmgTintHex": "#737062",
        "source": "cooverlay"
      },
      "ItmFloorVHF01Dmg": {
        "friendly": "Floor (Damaged): Van Hummel \"Herald\" Panel A",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintGreyVH",
        "dmgTintHex": "#737062",
        "source": "cooverlay"
      },
      "ItmFloorVHF02Dmg": {
        "friendly": "Floor (Damaged): Van Hummel \"Herald\" Panel B",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintGreyVH",
        "dmgTintHex": "#737062",
        "source": "cooverlay"
      },
      "ItmFloorVHF03Dmg": {
        "friendly": "Floor (Damaged): Van Hummel \"Herald\" Panel C",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintRedVH",
        "dmgTintHex": "#301213",
        "source": "cooverlay"
      },
      "ItmFloorVHF04Dmg": {
        "friendly": "Floor (Damaged): Van Hummel \"Herald\" Panel D",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintGreyVH",
        "dmgTintHex": "#737062",
        "source": "cooverlay"
      },
      "ItmFloorVHF05Dmg": {
        "friendly": "Floor (Damaged): Van Hummel \"Herald\" Panel E",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintRedVH",
        "dmgTintHex": "#301213",
        "source": "cooverlay"
      },
      "ItmFloorGrate01Loose": {
        "friendly": "Floor (Loose)",
        "short": "Floor",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "source": "condowner"
      },
      "ItmFloorWood01Loose": {
        "friendly": "Floor (Loose): Minsheng \"Forest 森林\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSHG08Loose": {
        "friendly": "Floor (Loose): Minsheng \"Power 力\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintGreyRYODark",
        "dmgTintHex": "#0c0d0d",
        "source": "cooverlay"
      },
      "ItmFloorRYOF01Loose": {
        "friendly": "Floor (Loose): Ryokka \"F-01\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintGreyRYODark",
        "dmgTintHex": "#0c0d0d",
        "source": "cooverlay"
      },
      "ItmFloorRYOF02Loose": {
        "friendly": "Floor (Loose): Ryokka \"F-02\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintGreyRYODark",
        "dmgTintHex": "#0c0d0d",
        "source": "cooverlay"
      },
      "ItmFloorRYOF03Loose": {
        "friendly": "Floor (Loose): Ryokka \"F-03\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintGreyRYODark",
        "dmgTintHex": "#0c0d0d",
        "source": "cooverlay"
      },
      "ItmFloorRYOF04Loose": {
        "friendly": "Floor (Loose): Ryokka \"F-04\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintGreyRYODark",
        "dmgTintHex": "#0c0d0d",
        "source": "cooverlay"
      },
      "ItmFloorRYOF05Loose": {
        "friendly": "Floor (Loose): Ryokka \"F-05\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintGreyRYODark",
        "dmgTintHex": "#0c0d0d",
        "source": "cooverlay"
      },
      "ItmFloorTSDO05Loose": {
        "friendly": "Floor (Loose): Testudo \"100 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintGreyTSDO",
        "dmgTintHex": "#22242a",
        "source": "cooverlay"
      },
      "ItmFloorTSDO46_01Loose": {
        "friendly": "Floor (Loose): Testudo \"46 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownTSDO",
        "dmgTintHex": "#5e5546",
        "source": "cooverlay"
      },
      "ItmFloorTSDO46_02Loose": {
        "friendly": "Floor (Loose): Testudo \"47 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownTSDO",
        "dmgTintHex": "#5e5546",
        "source": "cooverlay"
      },
      "ItmFloorTSDO46_03Loose": {
        "friendly": "Floor (Loose): Testudo \"48 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintDarkGrey",
        "dmgTintHex": "#323232",
        "source": "cooverlay"
      },
      "ItmFloorTSDO46_04Loose": {
        "friendly": "Floor (Loose): Testudo \"49 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownTSDO",
        "dmgTintHex": "#5e5546",
        "source": "cooverlay"
      },
      "ItmFloorTSDO46_05Loose": {
        "friendly": "Floor (Loose): Testudo \"50 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownTSDO",
        "dmgTintHex": "#5e5546",
        "source": "cooverlay"
      },
      "ItmFloorTSDO01Loose": {
        "friendly": "Floor (Loose): Testudo \"96 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintGreyTSDO",
        "dmgTintHex": "#22242a",
        "source": "cooverlay"
      },
      "ItmFloorTSDO02Loose": {
        "friendly": "Floor (Loose): Testudo \"97 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintGreyTSDO",
        "dmgTintHex": "#22242a",
        "source": "cooverlay"
      },
      "ItmFloorTSDO03Loose": {
        "friendly": "Floor (Loose): Testudo \"98 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintGreyTSDO",
        "dmgTintHex": "#22242a",
        "source": "cooverlay"
      },
      "ItmFloorTSDO04Loose": {
        "friendly": "Floor (Loose): Testudo \"99 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintGreyTSDO",
        "dmgTintHex": "#22242a",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_08Loose": {
        "friendly": "Floor (Loose): Testudo \"Breakout Turf\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintRedVH",
        "dmgTintHex": "#301213",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_08aLoose": {
        "friendly": "Floor (Loose): Testudo \"Breakout Turf\" Panel A",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintRedVH",
        "dmgTintHex": "#301213",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_08bLoose": {
        "friendly": "Floor (Loose): Testudo \"Breakout Turf\" Panel B",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintRedVH",
        "dmgTintHex": "#301213",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_08cLoose": {
        "friendly": "Floor (Loose): Testudo \"Breakout Turf\" Panel C",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintRedVH",
        "dmgTintHex": "#301213",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_08dLoose": {
        "friendly": "Floor (Loose): Testudo \"Breakout Turf\" Panel D",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintRedVH",
        "dmgTintHex": "#301213",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_08eLoose": {
        "friendly": "Floor (Loose): Testudo \"Breakout Turf\" Panel E",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintRedVH",
        "dmgTintHex": "#301213",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_08fLoose": {
        "friendly": "Floor (Loose): Testudo \"Breakout Turf\" Panel F",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintRedVH",
        "dmgTintHex": "#301213",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_01Loose": {
        "friendly": "Floor (Loose): Testudo \"Spring\" Panel A",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintGreyVH",
        "dmgTintHex": "#737062",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_02Loose": {
        "friendly": "Floor (Loose): Testudo \"Spring\" Panel B",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintGreyVH",
        "dmgTintHex": "#737062",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_03Loose": {
        "friendly": "Floor (Loose): Testudo \"Spring\" Panel C",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintRedVH",
        "dmgTintHex": "#301213",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_04Loose": {
        "friendly": "Floor (Loose): Testudo \"Spring\" Panel D",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintGreyVH",
        "dmgTintHex": "#737062",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_05Loose": {
        "friendly": "Floor (Loose): Testudo \"Spring\" Panel E",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintRedVH",
        "dmgTintHex": "#301213",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_06Loose": {
        "friendly": "Floor (Loose): Testudo \"Spring\" Panel F",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintRedVH",
        "dmgTintHex": "#301213",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_07Loose": {
        "friendly": "Floor (Loose): Testudo \"Spring\" Panel G",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintGreyVH",
        "dmgTintHex": "#737062",
        "source": "cooverlay"
      },
      "ItmFloorVHF01Loose": {
        "friendly": "Floor (Loose): Van Hummel \"Herald\" Panel A",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintGreyVH",
        "dmgTintHex": "#737062",
        "source": "cooverlay"
      },
      "ItmFloorVHF02Loose": {
        "friendly": "Floor (Loose): Van Hummel \"Herald\" Panel B",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintGreyVH",
        "dmgTintHex": "#737062",
        "source": "cooverlay"
      },
      "ItmFloorVHF03Loose": {
        "friendly": "Floor (Loose): Van Hummel \"Herald\" Panel C",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintRedVH",
        "dmgTintHex": "#301213",
        "source": "cooverlay"
      },
      "ItmFloorVHF04Loose": {
        "friendly": "Floor (Loose): Van Hummel \"Herald\" Panel D",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintGreyVH",
        "dmgTintHex": "#737062",
        "source": "cooverlay"
      },
      "ItmFloorVHF05Loose": {
        "friendly": "Floor (Loose): Van Hummel \"Herald\" Panel E",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintRedVH",
        "dmgTintHex": "#301213",
        "source": "cooverlay"
      },
      "ItmFloorGrate01Patch": {
        "friendly": "Floor (Patched)",
        "short": "Floor",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmFloorWood01Patch": {
        "friendly": "Floor (Patched): Minsheng \"Forest 森林\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSHG08Patch": {
        "friendly": "Floor (Patched): Minsheng \"Power 力\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintGreyRYODark",
        "dmgTintHex": "#0c0d0d",
        "source": "cooverlay"
      },
      "ItmFloorRYOF01Patch": {
        "friendly": "Floor (Patched): Ryokka \"F-01\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintGreyRYODark",
        "dmgTintHex": "#0c0d0d",
        "source": "cooverlay"
      },
      "ItmFloorRYOF02Patch": {
        "friendly": "Floor (Patched): Ryokka \"F-02\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintGreyRYODark",
        "dmgTintHex": "#0c0d0d",
        "source": "cooverlay"
      },
      "ItmFloorRYOF03Patch": {
        "friendly": "Floor (Patched): Ryokka \"F-03\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintGreyRYODark",
        "dmgTintHex": "#0c0d0d",
        "source": "cooverlay"
      },
      "ItmFloorRYOF04Patch": {
        "friendly": "Floor (Patched): Ryokka \"F-04\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintGreyRYODark",
        "dmgTintHex": "#0c0d0d",
        "source": "cooverlay"
      },
      "ItmFloorRYOF05Patch": {
        "friendly": "Floor (Patched): Ryokka \"F-05\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintGreyRYODark",
        "dmgTintHex": "#0c0d0d",
        "source": "cooverlay"
      },
      "ItmFloorTSDO05Patch": {
        "friendly": "Floor (Patched): Testudo \"100 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintGreyTSDO",
        "dmgTintHex": "#22242a",
        "source": "cooverlay"
      },
      "ItmFloorTSDO46_01Patch": {
        "friendly": "Floor (Patched): Testudo \"46 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownTSDO",
        "dmgTintHex": "#5e5546",
        "source": "cooverlay"
      },
      "ItmFloorTSDO46_02Patch": {
        "friendly": "Floor (Patched): Testudo \"47 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownTSDO",
        "dmgTintHex": "#5e5546",
        "source": "cooverlay"
      },
      "ItmFloorTSDO46_03Patch": {
        "friendly": "Floor (Patched): Testudo \"48 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintDarkGrey",
        "dmgTintHex": "#323232",
        "source": "cooverlay"
      },
      "ItmFloorTSDO46_04Patch": {
        "friendly": "Floor (Patched): Testudo \"49 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownTSDO",
        "dmgTintHex": "#5e5546",
        "source": "cooverlay"
      },
      "ItmFloorTSDO46_05Patch": {
        "friendly": "Floor (Patched): Testudo \"50 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownTSDO",
        "dmgTintHex": "#5e5546",
        "source": "cooverlay"
      },
      "ItmFloorTSDO01Patch": {
        "friendly": "Floor (Patched): Testudo \"96 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintGreyTSDO",
        "dmgTintHex": "#22242a",
        "source": "cooverlay"
      },
      "ItmFloorTSDO02Patch": {
        "friendly": "Floor (Patched): Testudo \"97 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintGreyTSDO",
        "dmgTintHex": "#22242a",
        "source": "cooverlay"
      },
      "ItmFloorTSDO03Patch": {
        "friendly": "Floor (Patched): Testudo \"98 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintGreyTSDO",
        "dmgTintHex": "#22242a",
        "source": "cooverlay"
      },
      "ItmFloorTSDO04Patch": {
        "friendly": "Floor (Patched): Testudo \"99 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintGreyTSDO",
        "dmgTintHex": "#22242a",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_08Patch": {
        "friendly": "Floor (Patched): Testudo \"Breakout Turf\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintRedVH",
        "dmgTintHex": "#301213",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_08aPatch": {
        "friendly": "Floor (Patched): Testudo \"Breakout Turf\" Panel A",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintRedVH",
        "dmgTintHex": "#301213",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_08bPatch": {
        "friendly": "Floor (Patched): Testudo \"Breakout Turf\" Panel B",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintRedVH",
        "dmgTintHex": "#301213",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_08cPatch": {
        "friendly": "Floor (Patched): Testudo \"Breakout Turf\" Panel C",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintRedVH",
        "dmgTintHex": "#301213",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_08dPatch": {
        "friendly": "Floor (Patched): Testudo \"Breakout Turf\" Panel D",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintRedVH",
        "dmgTintHex": "#301213",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_08ePatch": {
        "friendly": "Floor (Patched): Testudo \"Breakout Turf\" Panel E",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintRedVH",
        "dmgTintHex": "#301213",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_08fPatch": {
        "friendly": "Floor (Patched): Testudo \"Breakout Turf\" Panel F",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintRedVH",
        "dmgTintHex": "#301213",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_01Patch": {
        "friendly": "Floor (Patched): Testudo \"Spring\" Panel A",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintGreyVH",
        "dmgTintHex": "#737062",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_02Patch": {
        "friendly": "Floor (Patched): Testudo \"Spring\" Panel B",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintGreyVH",
        "dmgTintHex": "#737062",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_03Patch": {
        "friendly": "Floor (Patched): Testudo \"Spring\" Panel C",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintRedVH",
        "dmgTintHex": "#301213",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_04Patch": {
        "friendly": "Floor (Patched): Testudo \"Spring\" Panel D",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintGreyVH",
        "dmgTintHex": "#737062",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_05Patch": {
        "friendly": "Floor (Patched): Testudo \"Spring\" Panel E",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintRedVH",
        "dmgTintHex": "#301213",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_06Patch": {
        "friendly": "Floor (Patched): Testudo \"Spring\" Panel F",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintRedVH",
        "dmgTintHex": "#301213",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_07Patch": {
        "friendly": "Floor (Patched): Testudo \"Spring\" Panel G",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintGreyVH",
        "dmgTintHex": "#737062",
        "source": "cooverlay"
      },
      "ItmFloorVHF01Patch": {
        "friendly": "Floor (Patched): Van Hummel \"Herald\" Panel A",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintGreyVH",
        "dmgTintHex": "#737062",
        "source": "cooverlay"
      },
      "ItmFloorVHF02Patch": {
        "friendly": "Floor (Patched): Van Hummel \"Herald\" Panel B",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintGreyVH",
        "dmgTintHex": "#737062",
        "source": "cooverlay"
      },
      "ItmFloorVHF03Patch": {
        "friendly": "Floor (Patched): Van Hummel \"Herald\" Panel C",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintRedVH",
        "dmgTintHex": "#301213",
        "source": "cooverlay"
      },
      "ItmFloorVHF04Patch": {
        "friendly": "Floor (Patched): Van Hummel \"Herald\" Panel D",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintGreyVH",
        "dmgTintHex": "#737062",
        "source": "cooverlay"
      },
      "ItmFloorVHF05Patch": {
        "friendly": "Floor (Patched): Van Hummel \"Herald\" Panel E",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintRedVH",
        "dmgTintHex": "#301213",
        "source": "cooverlay"
      },
      "ItmFloorCAYL01Dmg": {
        "friendly": "Floor A (Damaged): Caylon \"DuraFlor\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorLDPH01Dmg": {
        "friendly": "Floor A (Damaged): Langdon-Phillips \"Liberty\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSHG09ADmg": {
        "friendly": "Floor A (Damaged): Minsheng \"Coalition Dawn\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCross01Dmg": {
        "friendly": "Floor A (Damaged): Minsheng \"Inheritance\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSSLFWhite01Dmg": {
        "friendly": "Floor A (Damaged): Mobile Space Systems \"Light Framework\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSSOW01Dmg": {
        "friendly": "Floor A (Damaged): Mobile Space Systems \"Orange Way\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintOrangeMSS",
        "dmgTintHex": "#ab5b22",
        "source": "cooverlay"
      },
      "ItmFloorMSSWindow01Dmg": {
        "friendly": "Floor A (Damaged): Mobile Space Systems \"Vista\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorAERO01Dmg": {
        "friendly": "Floor A (Damaged): Testudo \"Aero-Break\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL01Loose": {
        "friendly": "Floor A (Loose): Caylon \"DuraFlor\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorLDPH01Loose": {
        "friendly": "Floor A (Loose): Langdon-Phillips \"Liberty\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSHG09ALoose": {
        "friendly": "Floor A (Loose): Minsheng \"Coalition Dawn\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCross01Loose": {
        "friendly": "Floor A (Loose): Minsheng \"Inheritance\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSSLFWhite01Loose": {
        "friendly": "Floor A (Loose): Mobile Space Systems \"Light Framework\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSSOW01Loose": {
        "friendly": "Floor A (Loose): Mobile Space Systems \"Orange Way\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintOrangeMSS",
        "dmgTintHex": "#ab5b22",
        "source": "cooverlay"
      },
      "ItmFloorMSSWindow01Loose": {
        "friendly": "Floor A (Loose): Mobile Space Systems \"Vista\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorAERO01Loose": {
        "friendly": "Floor A (Loose): Testudo \"Aero-Break\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL01Patch": {
        "friendly": "Floor A (Patched): Caylon \"DuraFlor\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorLDPH01Patch": {
        "friendly": "Floor A (Patched): Langdon-Phillips \"Liberty\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSHG09APatch": {
        "friendly": "Floor A (Patched): Minsheng \"Coalition Dawn\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCross01Patch": {
        "friendly": "Floor A (Patched): Minsheng \"Inheritance\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSSLFWhite01Patch": {
        "friendly": "Floor A (Patched): Mobile Space Systems \"Light Framework\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSSOW01Patch": {
        "friendly": "Floor A (Patched): Mobile Space Systems \"Orange Way\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintOrangeMSS",
        "dmgTintHex": "#ab5b22",
        "source": "cooverlay"
      },
      "ItmFloorMSSWindow01Patch": {
        "friendly": "Floor A (Patched): Mobile Space Systems \"Vista\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorAERO01Patch": {
        "friendly": "Floor A (Patched): Testudo \"Aero-Break\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSHG01Dmg": {
        "friendly": "Floor A-2 (Damaged): Minsheng-朴素 \"Inheritance\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSHG01Loose": {
        "friendly": "Floor A-2 (Loose): Minsheng-朴素 \"Inheritance\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSHG01Patch": {
        "friendly": "Floor A-2 (Patched): Minsheng-朴素 \"Inheritance\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSHG01": {
        "friendly": "Floor A-2: Minsheng-朴素 \"Inheritance\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL01": {
        "friendly": "Floor A: Caylon \"DuraFlor\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorLDPH01": {
        "friendly": "Floor A: Langdon-Phillips \"Liberty\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSHG09A": {
        "friendly": "Floor A: Minsheng \"Coalition Dawn\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCross01": {
        "friendly": "Floor A: Minsheng \"Inheritance\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSSLFWhite01": {
        "friendly": "Floor A: Mobile Space Systems \"Light Framework\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSSOW01": {
        "friendly": "Floor A: Mobile Space Systems \"Orange Way\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintOrangeMSS",
        "dmgTintHex": "#ab5b22",
        "source": "cooverlay"
      },
      "ItmFloorMSSWindow01": {
        "friendly": "Floor A: Mobile Space Systems \"Vista\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorAERO01": {
        "friendly": "Floor A: Testudo \"Aero-Break\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL02Dmg": {
        "friendly": "Floor B (Damaged): Caylon \"DuraFlor\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorLDPH02Dmg": {
        "friendly": "Floor B (Damaged): Langdon-Phillips \"Palatine\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSHG09BDmg": {
        "friendly": "Floor B (Damaged): Minsheng \"Coalition Dawn\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorWood02Dmg": {
        "friendly": "Floor B (Damaged): Minsheng \"Forest 森林\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCross02Dmg": {
        "friendly": "Floor B (Damaged): Minsheng \"Harmony\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSSLFWhite02Dmg": {
        "friendly": "Floor B (Damaged): Mobile Space Systems \"Light Framework\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSSOW02Dmg": {
        "friendly": "Floor B (Damaged): Mobile Space Systems \"Orange Way\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintOrangeWhiteMSS",
        "dmgTintHex": "#616161",
        "source": "cooverlay"
      },
      "ItmFloorMSSWindow02Dmg": {
        "friendly": "Floor B (Damaged): Mobile Space Systems \"Vista\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorAERO02Dmg": {
        "friendly": "Floor B (Damaged): Testudo \"Aero-Frame\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL02Loose": {
        "friendly": "Floor B (Loose): Caylon \"DuraFlor\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorLDPH02Loose": {
        "friendly": "Floor B (Loose): Langdon-Phillips \"Palatine\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSHG09BLoose": {
        "friendly": "Floor B (Loose): Minsheng \"Coalition Dawn\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorWood02Loose": {
        "friendly": "Floor B (Loose): Minsheng \"Forest 森林\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCross02Loose": {
        "friendly": "Floor B (Loose): Minsheng \"Harmony\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSSLFWhite02Loose": {
        "friendly": "Floor B (Loose): Mobile Space Systems \"Light Framework\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSSOW02Loose": {
        "friendly": "Floor B (Loose): Mobile Space Systems \"Orange Way\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintOrangeWhiteMSS",
        "dmgTintHex": "#616161",
        "source": "cooverlay"
      },
      "ItmFloorMSSWindow02Loose": {
        "friendly": "Floor B (Loose): Mobile Space Systems \"Vista\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorAERO02Loose": {
        "friendly": "Floor B (Loose): Testudo \"Aero-Frame\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL02Patch": {
        "friendly": "Floor B (Patched): Caylon \"DuraFlor\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorLDPH02Patch": {
        "friendly": "Floor B (Patched): Langdon-Phillips \"Palatine\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSHG09BPatch": {
        "friendly": "Floor B (Patched): Minsheng \"Coalition Dawn\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorWood02Patch": {
        "friendly": "Floor B (Patched): Minsheng \"Forest 森林\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCross02Patch": {
        "friendly": "Floor B (Patched): Minsheng \"Harmony\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSSLFWhite02Patch": {
        "friendly": "Floor B (Patched): Mobile Space Systems \"Light Framework\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSSOW02Patch": {
        "friendly": "Floor B (Patched): Mobile Space Systems \"Orange Way\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintOrangeWhiteMSS",
        "dmgTintHex": "#616161",
        "source": "cooverlay"
      },
      "ItmFloorMSSWindow02Patch": {
        "friendly": "Floor B (Patched): Mobile Space Systems \"Vista\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorAERO02Patch": {
        "friendly": "Floor B (Patched): Testudo \"Aero-Frame\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorLDPH02bDmg": {
        "friendly": "Floor B-2 (Damaged): Langdon-Phillips \"Praetor\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSHG02Dmg": {
        "friendly": "Floor B-2 (Damaged): Minsheng-朴素 \"Harmony\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorLDPH02bLoose": {
        "friendly": "Floor B-2 (Loose): Langdon-Phillips \"Praetor\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSHG02Loose": {
        "friendly": "Floor B-2 (Loose): Minsheng-朴素 \"Harmony\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorLDPH02bPatch": {
        "friendly": "Floor B-2 (Patched): Langdon-Phillips \"Praetor\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSHG02Patch": {
        "friendly": "Floor B-2 (Patched): Minsheng-朴素 \"Harmony\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorLDPH02b": {
        "friendly": "Floor B-2: Langdon-Phillips \"Praetor\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSHG02": {
        "friendly": "Floor B-2: Minsheng-朴素 \"Harmony\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL02": {
        "friendly": "Floor B: Caylon \"DuraFlor\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorLDPH02": {
        "friendly": "Floor B: Langdon-Phillips \"Palatine\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSHG09B": {
        "friendly": "Floor B: Minsheng \"Coalition Dawn\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorWood02": {
        "friendly": "Floor B: Minsheng \"Forest 森林\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCross02": {
        "friendly": "Floor B: Minsheng \"Harmony\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSSLFWhite02": {
        "friendly": "Floor B: Mobile Space Systems \"Light Framework\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSSOW02": {
        "friendly": "Floor B: Mobile Space Systems \"Orange Way\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintOrangeWhiteMSS",
        "dmgTintHex": "#616161",
        "source": "cooverlay"
      },
      "ItmFloorMSSWindow02": {
        "friendly": "Floor B: Mobile Space Systems \"Vista\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorAERO02": {
        "friendly": "Floor B: Testudo \"Aero-Frame\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL03Dmg": {
        "friendly": "Floor C (Damaged): Caylon \"DuraFlor\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSHG09CDmg": {
        "friendly": "Floor C (Damaged): Minsheng \"Coalition Dawn\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCross03Dmg": {
        "friendly": "Floor C (Damaged): Minsheng \"Quietus\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSSLFWhite03Dmg": {
        "friendly": "Floor C (Damaged): Mobile Space Systems \"Light Framework\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSSOW03Dmg": {
        "friendly": "Floor C (Damaged): Mobile Space Systems \"Orange Way\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintOrangeMSS",
        "dmgTintHex": "#ab5b22",
        "source": "cooverlay"
      },
      "ItmFloorAERO03Dmg": {
        "friendly": "Floor C (Damaged): Testudo \"Aero-Grate\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL03Loose": {
        "friendly": "Floor C (Loose): Caylon \"DuraFlor\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSHG09CLoose": {
        "friendly": "Floor C (Loose): Minsheng \"Coalition Dawn\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCross03Loose": {
        "friendly": "Floor C (Loose): Minsheng \"Quietus\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSSLFWhite03Loose": {
        "friendly": "Floor C (Loose): Mobile Space Systems \"Light Framework\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSSOW03Loose": {
        "friendly": "Floor C (Loose): Mobile Space Systems \"Orange Way\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintOrangeMSS",
        "dmgTintHex": "#ab5b22",
        "source": "cooverlay"
      },
      "ItmFloorAERO03Loose": {
        "friendly": "Floor C (Loose): Testudo \"Aero-Grate\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL03Patch": {
        "friendly": "Floor C (Patched): Caylon \"DuraFlor\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSHG09CPatch": {
        "friendly": "Floor C (Patched): Minsheng \"Coalition Dawn\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCross03Patch": {
        "friendly": "Floor C (Patched): Minsheng \"Quietus\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSSLFWhite03Patch": {
        "friendly": "Floor C (Patched): Mobile Space Systems \"Light Framework\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSSOW03Patch": {
        "friendly": "Floor C (Patched): Mobile Space Systems \"Orange Way\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintOrangeMSS",
        "dmgTintHex": "#ab5b22",
        "source": "cooverlay"
      },
      "ItmFloorAERO03Patch": {
        "friendly": "Floor C (Patched): Testudo \"Aero-Grate\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorLDPH03ADmg": {
        "friendly": "Floor C-1 (Damaged): Langdon-Phillips \"Vanguard\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorLDPH03ALoose": {
        "friendly": "Floor C-1 (Loose): Langdon-Phillips \"Vanguard\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorLDPH03APatch": {
        "friendly": "Floor C-1 (Patched): Langdon-Phillips \"Vanguard\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorLDPH03A": {
        "friendly": "Floor C-1: Langdon-Phillips \"Vanguard\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorLDPH03BDmg": {
        "friendly": "Floor C-2 (Damaged): Langdon-Phillips \"Vanguard\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSHG03Dmg": {
        "friendly": "Floor C-2 (Damaged): Minsheng-朴素 \"Quietus\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorLDPH03BLoose": {
        "friendly": "Floor C-2 (Loose): Langdon-Phillips \"Vanguard\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSHG03Loose": {
        "friendly": "Floor C-2 (Loose): Minsheng-朴素 \"Quietus\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorLDPH03BPatch": {
        "friendly": "Floor C-2 (Patched): Langdon-Phillips \"Vanguard\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSHG03Patch": {
        "friendly": "Floor C-2 (Patched): Minsheng-朴素 \"Quietus\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorLDPH03B": {
        "friendly": "Floor C-2: Langdon-Phillips \"Vanguard\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSHG03": {
        "friendly": "Floor C-2: Minsheng-朴素 \"Quietus\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorLDPH03CDmg": {
        "friendly": "Floor C-3 (Damaged): Langdon-Phillips \"Vanguard\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorLDPH03CLoose": {
        "friendly": "Floor C-3 (Loose): Langdon-Phillips \"Vanguard\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorLDPH03CPatch": {
        "friendly": "Floor C-3 (Patched): Langdon-Phillips \"Vanguard\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorLDPH03C": {
        "friendly": "Floor C-3: Langdon-Phillips \"Vanguard\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorLDPH03DDmg": {
        "friendly": "Floor C-4 (Damaged): Langdon-Phillips \"Vanguard\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorLDPH03DLoose": {
        "friendly": "Floor C-4 (Loose): Langdon-Phillips \"Vanguard\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorLDPH03DPatch": {
        "friendly": "Floor C-4 (Patched): Langdon-Phillips \"Vanguard\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorLDPH03D": {
        "friendly": "Floor C-4: Langdon-Phillips \"Vanguard\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL03": {
        "friendly": "Floor C: Caylon \"DuraFlor\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSHG09C": {
        "friendly": "Floor C: Minsheng \"Coalition Dawn\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCross03": {
        "friendly": "Floor C: Minsheng \"Quietus\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSSLFWhite03": {
        "friendly": "Floor C: Mobile Space Systems \"Light Framework\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSSOW03": {
        "friendly": "Floor C: Mobile Space Systems \"Orange Way\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintOrangeMSS",
        "dmgTintHex": "#ab5b22",
        "source": "cooverlay"
      },
      "ItmFloorAERO03": {
        "friendly": "Floor C: Testudo \"Aero-Grate\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL04Dmg": {
        "friendly": "Floor D (Damaged): Caylon \"DuraFlor\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorLDPH01bDmg": {
        "friendly": "Floor D (Damaged): Langdon-Phillips \"Shenandoah\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSHG09DDmg": {
        "friendly": "Floor D (Damaged): Minsheng \"Coalition Dawn\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCross04Dmg": {
        "friendly": "Floor D (Damaged): Minsheng \"Mettle\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSSLFWhite04Dmg": {
        "friendly": "Floor D (Damaged): Mobile Space Systems \"Light Framework\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSSOW04Dmg": {
        "friendly": "Floor D (Damaged): Mobile Space Systems \"Orange Way\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintOrangeMSS",
        "dmgTintHex": "#ab5b22",
        "source": "cooverlay"
      },
      "ItmFloorAERO04Dmg": {
        "friendly": "Floor D (Damaged): Testudo \"Aero-Lift\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL04Loose": {
        "friendly": "Floor D (Loose): Caylon \"DuraFlor\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorLDPH01bLoose": {
        "friendly": "Floor D (Loose): Langdon-Phillips \"Shenandoah\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSHG09DLoose": {
        "friendly": "Floor D (Loose): Minsheng \"Coalition Dawn\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCross04Loose": {
        "friendly": "Floor D (Loose): Minsheng \"Mettle\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSSLFWhite04Loose": {
        "friendly": "Floor D (Loose): Mobile Space Systems \"Light Framework\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSSOW04Loose": {
        "friendly": "Floor D (Loose): Mobile Space Systems \"Orange Way\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintOrangeMSS",
        "dmgTintHex": "#ab5b22",
        "source": "cooverlay"
      },
      "ItmFloorAERO04Loose": {
        "friendly": "Floor D (Loose): Testudo \"Aero-Lift\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL04Patch": {
        "friendly": "Floor D (Patched): Caylon \"DuraFlor\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorLDPH01bPatch": {
        "friendly": "Floor D (Patched): Langdon-Phillips \"Shenandoah\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSHG09DPatch": {
        "friendly": "Floor D (Patched): Minsheng \"Coalition Dawn\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCross04Patch": {
        "friendly": "Floor D (Patched): Minsheng \"Mettle\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSSLFWhite04Patch": {
        "friendly": "Floor D (Patched): Mobile Space Systems \"Light Framework\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSSOW04Patch": {
        "friendly": "Floor D (Patched): Mobile Space Systems \"Orange Way\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintOrangeMSS",
        "dmgTintHex": "#ab5b22",
        "source": "cooverlay"
      },
      "ItmFloorAERO04Patch": {
        "friendly": "Floor D (Patched): Testudo \"Aero-Lift\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSHG04Dmg": {
        "friendly": "Floor D-2 (Damaged): Minsheng-朴素 \"Mettle\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSHG04Loose": {
        "friendly": "Floor D-2 (Loose): Minsheng-朴素 \"Mettle\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSHG04Patch": {
        "friendly": "Floor D-2 (Patched): Minsheng-朴素 \"Mettle\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSHG04": {
        "friendly": "Floor D-2: Minsheng-朴素 \"Mettle\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL04": {
        "friendly": "Floor D: Caylon \"DuraFlor\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorLDPH01b": {
        "friendly": "Floor D: Langdon-Phillips \"Shenandoah\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSHG09D": {
        "friendly": "Floor D: Minsheng \"Coalition Dawn\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCross04": {
        "friendly": "Floor D: Minsheng \"Mettle\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSSLFWhite04": {
        "friendly": "Floor D: Mobile Space Systems \"Light Framework\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSSOW04": {
        "friendly": "Floor D: Mobile Space Systems \"Orange Way\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintOrangeMSS",
        "dmgTintHex": "#ab5b22",
        "source": "cooverlay"
      },
      "ItmFloorAERO04": {
        "friendly": "Floor D: Testudo \"Aero-Lift\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL05Dmg": {
        "friendly": "Floor E (Damaged): Caylon \"DuraFlor\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCross05Dmg": {
        "friendly": "Floor E (Damaged): Minsheng \"Perseverance\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSSLFWhite05Dmg": {
        "friendly": "Floor E (Damaged): Mobile Space Systems \"Light Framework\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSSOW05Dmg": {
        "friendly": "Floor E (Damaged): Mobile Space Systems \"Orange Way\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintOrangeMSS",
        "dmgTintHex": "#ab5b22",
        "source": "cooverlay"
      },
      "ItmFloorAERO05Dmg": {
        "friendly": "Floor E (Damaged): Testudo \"Aero-Pad\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL05Loose": {
        "friendly": "Floor E (Loose): Caylon \"DuraFlor\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCross05Loose": {
        "friendly": "Floor E (Loose): Minsheng \"Perseverance\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSSLFWhite05Loose": {
        "friendly": "Floor E (Loose): Mobile Space Systems \"Light Framework\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSSOW05Loose": {
        "friendly": "Floor E (Loose): Mobile Space Systems \"Orange Way\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintOrangeMSS",
        "dmgTintHex": "#ab5b22",
        "source": "cooverlay"
      },
      "ItmFloorAERO05Loose": {
        "friendly": "Floor E (Loose): Testudo \"Aero-Pad\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL05Patch": {
        "friendly": "Floor E (Patched): Caylon \"DuraFlor\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCross05Patch": {
        "friendly": "Floor E (Patched): Minsheng \"Perseverance\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSSLFWhite05Patch": {
        "friendly": "Floor E (Patched): Mobile Space Systems \"Light Framework\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSSOW05Patch": {
        "friendly": "Floor E (Patched): Mobile Space Systems \"Orange Way\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintOrangeMSS",
        "dmgTintHex": "#ab5b22",
        "source": "cooverlay"
      },
      "ItmFloorAERO05Patch": {
        "friendly": "Floor E (Patched): Testudo \"Aero-Pad\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSHG05Dmg": {
        "friendly": "Floor E-2 (Damaged): Minsheng-朴素 \"Perseverance\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSHG05Loose": {
        "friendly": "Floor E-2 (Loose): Minsheng-朴素 \"Perseverance\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSHG05Patch": {
        "friendly": "Floor E-2 (Patched): Minsheng-朴素 \"Perseverance\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSHG05": {
        "friendly": "Floor E-2: Minsheng-朴素 \"Perseverance\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL05": {
        "friendly": "Floor E: Caylon \"DuraFlor\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCross05": {
        "friendly": "Floor E: Minsheng \"Perseverance\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSSLFWhite05": {
        "friendly": "Floor E: Mobile Space Systems \"Light Framework\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSSOW05": {
        "friendly": "Floor E: Mobile Space Systems \"Orange Way\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintOrangeMSS",
        "dmgTintHex": "#ab5b22",
        "source": "cooverlay"
      },
      "ItmFloorAERO05": {
        "friendly": "Floor E: Testudo \"Aero-Pad\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL06Dmg": {
        "friendly": "Floor F (Damaged): Caylon \"DuraFlor\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCross06Dmg": {
        "friendly": "Floor F (Damaged): Minsheng \"Prosperity\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorAERO06Dmg": {
        "friendly": "Floor F (Damaged): Testudo \"Aero-Block\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL06Loose": {
        "friendly": "Floor F (Loose): Caylon \"DuraFlor\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCross06Loose": {
        "friendly": "Floor F (Loose): Minsheng \"Prosperity\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorAERO06Loose": {
        "friendly": "Floor F (Loose): Testudo \"Aero-Block\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL06Patch": {
        "friendly": "Floor F (Patched): Caylon \"DuraFlor\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCross06Patch": {
        "friendly": "Floor F (Patched): Minsheng \"Prosperity\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorAERO06Patch": {
        "friendly": "Floor F (Patched): Testudo \"Aero-Block\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSHG06Dmg": {
        "friendly": "Floor F-2 (Damaged): Minsheng-朴素 \"Prosperity\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSHG06Loose": {
        "friendly": "Floor F-2 (Loose): Minsheng-朴素 \"Prosperity\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSHG06Patch": {
        "friendly": "Floor F-2 (Patched): Minsheng-朴素 \"Prosperity\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSHG06": {
        "friendly": "Floor F-2: Minsheng-朴素 \"Prosperity\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL06": {
        "friendly": "Floor F: Caylon \"DuraFlor\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCross06": {
        "friendly": "Floor F: Minsheng \"Prosperity\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorAERO06": {
        "friendly": "Floor F: Testudo \"Aero-Block\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL07Dmg": {
        "friendly": "Floor G (Damaged): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCross07Dmg": {
        "friendly": "Floor G (Damaged): Minsheng \"Celebration\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorAERO07Dmg": {
        "friendly": "Floor G (Damaged): Testudo \"Aero-Grip\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL07Loose": {
        "friendly": "Floor G (Loose): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCross07Loose": {
        "friendly": "Floor G (Loose): Minsheng \"Celebration\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorAERO07Loose": {
        "friendly": "Floor G (Loose): Testudo \"Aero-Grip\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL07Patch": {
        "friendly": "Floor G (Patched): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCross07Patch": {
        "friendly": "Floor G (Patched): Minsheng \"Celebration\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorAERO07Patch": {
        "friendly": "Floor G (Patched): Testudo \"Aero-Grip\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSHG07Dmg": {
        "friendly": "Floor G-2 (Damaged): Minsheng-朴素 \"Celebration\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSHG07Loose": {
        "friendly": "Floor G-2 (Loose): Minsheng-朴素 \"Celebration\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSHG07Patch": {
        "friendly": "Floor G-2 (Patched): Minsheng-朴素 \"Celebration\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSHG07": {
        "friendly": "Floor G-2: Minsheng-朴素 \"Celebration\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL07ADmg": {
        "friendly": "Floor G-A (Damaged): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL07ALoose": {
        "friendly": "Floor G-A (Loose): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL07APatch": {
        "friendly": "Floor G-A (Patched): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL07A": {
        "friendly": "Floor G-A: Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL07BDmg": {
        "friendly": "Floor G-B (Damaged): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL07BLoose": {
        "friendly": "Floor G-B (Loose): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL07BPatch": {
        "friendly": "Floor G-B (Patched): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL07B": {
        "friendly": "Floor G-B: Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL07CDmg": {
        "friendly": "Floor G-C (Damaged): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL07CLoose": {
        "friendly": "Floor G-C (Loose): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL07CPatch": {
        "friendly": "Floor G-C (Patched): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL07C": {
        "friendly": "Floor G-C: Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL07": {
        "friendly": "Floor G: Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCross07": {
        "friendly": "Floor G: Minsheng \"Celebration\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorAERO07": {
        "friendly": "Floor G: Testudo \"Aero-Grip\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL08Dmg": {
        "friendly": "Floor H (Damaged): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorAERO08Dmg": {
        "friendly": "Floor H (Damaged): Testudo \"Promenade\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL08Loose": {
        "friendly": "Floor H (Loose): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorAERO08Loose": {
        "friendly": "Floor H (Loose): Testudo \"Promenade\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL08Patch": {
        "friendly": "Floor H (Patched): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorAERO08Patch": {
        "friendly": "Floor H (Patched): Testudo \"Promenade\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL08ADmg": {
        "friendly": "Floor H-A (Damaged): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL08ALoose": {
        "friendly": "Floor H-A (Loose): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL08APatch": {
        "friendly": "Floor H-A (Patched): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL08A": {
        "friendly": "Floor H-A: Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL08BDmg": {
        "friendly": "Floor H-B (Damaged): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL08BLoose": {
        "friendly": "Floor H-B (Loose): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL08CLoose": {
        "friendly": "Floor H-B (Loose): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL08BPatch": {
        "friendly": "Floor H-B (Patched): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL08B": {
        "friendly": "Floor H-B: Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL08CDmg": {
        "friendly": "Floor H-C (Damaged): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL08CPatch": {
        "friendly": "Floor H-C (Patched): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL08C": {
        "friendly": "Floor H-C: Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL08": {
        "friendly": "Floor H: Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorAERO08": {
        "friendly": "Floor H: Testudo \"Promenade\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL09Dmg": {
        "friendly": "Floor I (Damaged): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorAERO09Dmg": {
        "friendly": "Floor I (Damaged): Testudo \"Promenade In\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL09Loose": {
        "friendly": "Floor I (Loose): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorAERO09Loose": {
        "friendly": "Floor I (Loose): Testudo \"Promenade In\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL09Patch": {
        "friendly": "Floor I (Patched): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorAERO09Patch": {
        "friendly": "Floor I (Patched): Testudo \"Promenade In\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL09ADmg": {
        "friendly": "Floor I-A (Damaged): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL09ALoose": {
        "friendly": "Floor I-A (Loose): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL09APatch": {
        "friendly": "Floor I-A (Patched): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL09A": {
        "friendly": "Floor I-A: Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL09BDmg": {
        "friendly": "Floor I-B (Damaged): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL09BLoose": {
        "friendly": "Floor I-B (Loose): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL09BPatch": {
        "friendly": "Floor I-B (Patched): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL09B": {
        "friendly": "Floor I-B: Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL09CDmg": {
        "friendly": "Floor I-C (Damaged): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL09CLoose": {
        "friendly": "Floor I-C (Loose): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL09CPatch": {
        "friendly": "Floor I-C (Patched): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL09C": {
        "friendly": "Floor I-C: Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL09": {
        "friendly": "Floor I: Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorAERO09": {
        "friendly": "Floor I: Testudo \"Promenade In\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL10Dmg": {
        "friendly": "Floor J (Damaged): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorAERO10Dmg": {
        "friendly": "Floor J (Damaged): Testudo \"Promenade Out\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL10Loose": {
        "friendly": "Floor J (Loose): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorAERO10Loose": {
        "friendly": "Floor J (Loose): Testudo \"Promenade Out\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL10Patch": {
        "friendly": "Floor J (Patched): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorAERO10Patch": {
        "friendly": "Floor J (Patched): Testudo \"Promenade Out\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL10ADmg": {
        "friendly": "Floor J-A (Damaged): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL10ALoose": {
        "friendly": "Floor J-A (Loose): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL10APatch": {
        "friendly": "Floor J-A (Patched): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL10A": {
        "friendly": "Floor J-A: Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL10BDmg": {
        "friendly": "Floor J-B (Damaged): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL10BLoose": {
        "friendly": "Floor J-B (Loose): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL10BPatch": {
        "friendly": "Floor J-B (Patched): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL10B": {
        "friendly": "Floor J-B: Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL10CDmg": {
        "friendly": "Floor J-C (Damaged): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL10CLoose": {
        "friendly": "Floor J-C (Loose): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL10CPatch": {
        "friendly": "Floor J-C (Patched): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL10C": {
        "friendly": "Floor J-C: Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL10": {
        "friendly": "Floor J: Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorAERO10": {
        "friendly": "Floor J: Testudo \"Promenade Out\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL11Dmg": {
        "friendly": "Floor K (Damaged): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorAERO11Dmg": {
        "friendly": "Floor K (Damaged): Testudo \"Full Promenade\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL11Loose": {
        "friendly": "Floor K (Loose): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorAERO11Loose": {
        "friendly": "Floor K (Loose): Testudo \"Full Promenade\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL11Patch": {
        "friendly": "Floor K (Patched): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorAERO11Patch": {
        "friendly": "Floor K (Patched): Testudo \"Full Promenade\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL11ADmg": {
        "friendly": "Floor K-A (Damaged): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL11ALoose": {
        "friendly": "Floor K-A (Loose): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL11APatch": {
        "friendly": "Floor K-A (Patched): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL11A": {
        "friendly": "Floor K-A: Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL11BDmg": {
        "friendly": "Floor K-B (Damaged): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL11BLoose": {
        "friendly": "Floor K-B (Loose): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL11BPatch": {
        "friendly": "Floor K-B (Patched): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL11B": {
        "friendly": "Floor K-B: Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL11CDmg": {
        "friendly": "Floor K-C (Damaged): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 5.0,
        "mass": 3.0,
        "durability": 30.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL11CLoose": {
        "friendly": "Floor K-C (Loose): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL11CPatch": {
        "friendly": "Floor K-C (Patched): Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 7.0,
        "mass": 4.0,
        "durability": 4.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL11C": {
        "friendly": "Floor K-C: Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorCAYL11": {
        "friendly": "Floor K: Caylon \"DuraFlor Int\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorAERO11": {
        "friendly": "Floor K: Testudo \"Full Promenade\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorWood01": {
        "friendly": "Floor: Minsheng \"Forest 森林\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorGrateMSHGTile02": {
        "friendly": "Floor: Minsheng \"Mountain 2\"",
        "category": [
          "Hull"
        ],
        "basePrice": 21.0,
        "mass": 6.5,
        "durability": 55.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorGrateMSHGTile01": {
        "friendly": "Floor: Minsheng \"Mountain\"",
        "category": [
          "Hull"
        ],
        "basePrice": 21.0,
        "mass": 6.5,
        "durability": 55.0,
        "dmgTint": "DamageTintBrownMSSLF",
        "dmgTintHex": "#5f4b4b",
        "source": "cooverlay"
      },
      "ItmFloorMSHG08": {
        "friendly": "Floor: Minsheng \"Power 力\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintGreyRYODark",
        "dmgTintHex": "#0c0d0d",
        "source": "cooverlay"
      },
      "ItmFloorRYOF01": {
        "friendly": "Floor: Ryokka \"F-01\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintGreyRYODark",
        "dmgTintHex": "#0c0d0d",
        "source": "cooverlay"
      },
      "ItmFloorRYOF02": {
        "friendly": "Floor: Ryokka \"F-02\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintGreyRYODark",
        "dmgTintHex": "#0c0d0d",
        "source": "cooverlay"
      },
      "ItmFloorRYOF03": {
        "friendly": "Floor: Ryokka \"F-03\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintGreyRYODark",
        "dmgTintHex": "#0c0d0d",
        "source": "cooverlay"
      },
      "ItmFloorRYOF04": {
        "friendly": "Floor: Ryokka \"F-04\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintGreyRYODark",
        "dmgTintHex": "#0c0d0d",
        "source": "cooverlay"
      },
      "ItmFloorRYOF05": {
        "friendly": "Floor: Ryokka \"F-05\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintGreyRYODark",
        "dmgTintHex": "#0c0d0d",
        "source": "cooverlay"
      },
      "ItmFloorTSDO05": {
        "friendly": "Floor: Testudo \"100 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintGreyTSDO",
        "dmgTintHex": "#22242a",
        "source": "cooverlay"
      },
      "ItmFloorTSDO46_01": {
        "friendly": "Floor: Testudo \"46 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownTSDO",
        "dmgTintHex": "#5e5546",
        "source": "cooverlay"
      },
      "ItmFloorTSDO46_02": {
        "friendly": "Floor: Testudo \"47 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownTSDO",
        "dmgTintHex": "#5e5546",
        "source": "cooverlay"
      },
      "ItmFloorTSDO46_03": {
        "friendly": "Floor: Testudo \"48 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintDarkGrey",
        "dmgTintHex": "#323232",
        "source": "cooverlay"
      },
      "ItmFloorTSDO46_04": {
        "friendly": "Floor: Testudo \"49 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownTSDO",
        "dmgTintHex": "#5e5546",
        "source": "cooverlay"
      },
      "ItmFloorTSDO46_05": {
        "friendly": "Floor: Testudo \"50 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintBrownTSDO",
        "dmgTintHex": "#5e5546",
        "source": "cooverlay"
      },
      "ItmFloorTSDO01": {
        "friendly": "Floor: Testudo \"96 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintGreyTSDO",
        "dmgTintHex": "#22242a",
        "source": "cooverlay"
      },
      "ItmFloorTSDO02": {
        "friendly": "Floor: Testudo \"97 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintGreyTSDO",
        "dmgTintHex": "#22242a",
        "source": "cooverlay"
      },
      "ItmFloorTSDO03": {
        "friendly": "Floor: Testudo \"98 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintGreyTSDO",
        "dmgTintHex": "#22242a",
        "source": "cooverlay"
      },
      "ItmFloorTSDO04": {
        "friendly": "Floor: Testudo \"99 Series\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintGreyTSDO",
        "dmgTintHex": "#22242a",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_08": {
        "friendly": "Floor: Testudo \"Breakout Turf\"",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintRedVH",
        "dmgTintHex": "#301213",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_08a": {
        "friendly": "Floor: Testudo \"Breakout Turf\" Panel A",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintRedVH",
        "dmgTintHex": "#301213",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_08b": {
        "friendly": "Floor: Testudo \"Breakout Turf\" Panel B",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintRedVH",
        "dmgTintHex": "#301213",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_08c": {
        "friendly": "Floor: Testudo \"Breakout Turf\" Panel C",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintRedVH",
        "dmgTintHex": "#301213",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_08d": {
        "friendly": "Floor: Testudo \"Breakout Turf\" Panel D",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintRedVH",
        "dmgTintHex": "#301213",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_08e": {
        "friendly": "Floor: Testudo \"Breakout Turf\" Panel E",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintRedVH",
        "dmgTintHex": "#301213",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_08f": {
        "friendly": "Floor: Testudo \"Breakout Turf\" Panel F",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintRedVH",
        "dmgTintHex": "#301213",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_01": {
        "friendly": "Floor: Testudo \"Spring\" Panel A",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintGreyVH",
        "dmgTintHex": "#737062",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_02": {
        "friendly": "Floor: Testudo \"Spring\" Panel B",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintGreyVH",
        "dmgTintHex": "#737062",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_03": {
        "friendly": "Floor: Testudo \"Spring\" Panel C",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintRedVH",
        "dmgTintHex": "#301213",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_04": {
        "friendly": "Floor: Testudo \"Spring\" Panel D",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintGreyVH",
        "dmgTintHex": "#737062",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_05": {
        "friendly": "Floor: Testudo \"Spring\" Panel E",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintRedVH",
        "dmgTintHex": "#301213",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_06": {
        "friendly": "Floor: Testudo \"Spring\" Panel F",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintRedVH",
        "dmgTintHex": "#301213",
        "source": "cooverlay"
      },
      "ItmFloorTSDOC_07": {
        "friendly": "Floor: Testudo \"Spring\" Panel G",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintGreyVH",
        "dmgTintHex": "#737062",
        "source": "cooverlay"
      },
      "ItmFloorVHF01": {
        "friendly": "Floor: Van Hummel \"Herald\" Panel A",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintGreyVH",
        "dmgTintHex": "#737062",
        "source": "cooverlay"
      },
      "ItmFloorVHF02": {
        "friendly": "Floor: Van Hummel \"Herald\" Panel B",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintGreyVH",
        "dmgTintHex": "#737062",
        "source": "cooverlay"
      },
      "ItmFloorVHF03": {
        "friendly": "Floor: Van Hummel \"Herald\" Panel C",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintRedVH",
        "dmgTintHex": "#301213",
        "source": "cooverlay"
      },
      "ItmFloorVHF04": {
        "friendly": "Floor: Van Hummel \"Herald\" Panel D",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintGreyVH",
        "dmgTintHex": "#737062",
        "source": "cooverlay"
      },
      "ItmFloorVHF05": {
        "friendly": "Floor: Van Hummel \"Herald\" Panel E",
        "category": [
          "Hull"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "dmgTint": "DamageTintRedVH",
        "dmgTintHex": "#301213",
        "source": "cooverlay"
      },
      "ItmFloorIce021x1": {
        "friendly": "Ice Core",
        "mass": 18.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmFloorIce02": {
        "friendly": "Ice Core 2x2",
        "short": "Ice Core",
        "mass": 18.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmFloorGrate02": {
        "friendly": "Polished Regolith Floor",
        "short": "Floor",
        "category": [
          "Hull"
        ],
        "basePrice": 21.0,
        "mass": 6.5,
        "durability": 55.0,
        "source": "condowner"
      },
      "ItmFloorRock021x1M": {
        "friendly": "Shiny Rock Core",
        "short": "Shiny Core",
        "mass": 144.0,
        "durability": 144.0,
        "source": "condowner"
      },
      "ItmFloorRock02MDmg": {
        "friendly": "Shiny Rock Core (Cracked)",
        "short": "Shiny Core",
        "mass": 576.0,
        "durability": 1152.0,
        "source": "condowner"
      },
      "ItmFloorRock02M": {
        "friendly": "Shiny Rock Core (Deposit)",
        "short": "Shiny Core",
        "mass": 1152.0,
        "durability": 115.0,
        "source": "condowner"
      },
      "ItmFloorRock02MDepositDmg": {
        "friendly": "Shiny Rock Core (Deposit)",
        "short": "Shiny Deposit",
        "mass": 576.0,
        "durability": 288.0,
        "source": "condowner"
      },
      "ItmFloorLabelAirlock01": {
        "friendly": "Sign: \"Airlock\"",
        "short": "Sign",
        "category": [
          "Media"
        ],
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmFloorLabelDormInstall": {
        "friendly": "Sign: \"Install Conduit Here\"",
        "category": [
          "Media"
        ],
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmFloorLabelLoading": {
        "friendly": "Sign: \"Loading\"",
        "short": "Sign",
        "category": [
          "Media"
        ],
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmFloorLabelArrow01": {
        "friendly": "Sign: Arrow",
        "short": "Sign",
        "category": [
          "Media"
        ],
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmFloorRock021x1": {
        "friendly": "Stony Rock Core",
        "short": "Stony Core",
        "mass": 73.0,
        "durability": 73.0,
        "source": "condowner"
      },
      "ItmFloorRock02Dmg": {
        "friendly": "Stony Rock Core (Cracked)",
        "short": "Stony Core",
        "mass": 292.0,
        "durability": 584.0,
        "source": "condowner"
      },
      "ItmFloorRock02": {
        "friendly": "Stony Rock Core (Deposit)",
        "short": "Stony Core",
        "mass": 584.0,
        "durability": 58.0,
        "source": "condowner"
      },
      "ItmFloorRock02DepositDmg": {
        "friendly": "Stony Rock Core (Deposit)",
        "short": "Stony Deposit",
        "mass": 292.0,
        "durability": 146.0,
        "source": "condowner"
      },
      "ItmRackUnder01": {
        "friendly": "Storage Bay",
        "short": "Bay",
        "category": [
          "Furniture"
        ],
        "basePrice": 4740.0,
        "mass": 40.0,
        "durability": 20.0,
        "source": "condowner"
      },
      "ItmRackUnder01Dmg": {
        "friendly": "Storage Bay (Damaged)",
        "short": "Bay",
        "category": [
          "Furniture"
        ],
        "basePrice": 871.0,
        "mass": 40.0,
        "durability": 45.0,
        "source": "condowner"
      },
      "ItmStorageBinFloor1x101b": {
        "friendly": "Subfloor Bin",
        "category": [
          "Furniture"
        ],
        "basePrice": 1300.0,
        "mass": 28.0,
        "durability": 20.0,
        "source": "cooverlay"
      },
      "ItmStorageBinFloor1x102": {
        "friendly": "Subfloor Bin",
        "category": [
          "Furniture"
        ],
        "basePrice": 1300.0,
        "mass": 28.0,
        "durability": 20.0,
        "source": "cooverlay"
      },
      "ItmStorageBinFloor1x102b": {
        "friendly": "Subfloor Bin",
        "category": [
          "Furniture"
        ],
        "basePrice": 1300.0,
        "mass": 28.0,
        "durability": 20.0,
        "source": "cooverlay"
      },
      "ItmStorageBinFloor1x103": {
        "friendly": "Subfloor Bin",
        "category": [
          "Furniture"
        ],
        "basePrice": 1300.0,
        "mass": 28.0,
        "durability": 20.0,
        "source": "cooverlay"
      },
      "ItmStorageBinFloor1x103b": {
        "friendly": "Subfloor Bin",
        "category": [
          "Furniture"
        ],
        "basePrice": 1300.0,
        "mass": 28.0,
        "durability": 20.0,
        "source": "cooverlay"
      },
      "ItmStorageBinFloor1x101": {
        "friendly": "Subfloor Bin",
        "short": "Bin",
        "category": [
          "Furniture"
        ],
        "basePrice": 1300.0,
        "mass": 28.0,
        "durability": 20.0,
        "source": "condowner"
      },
      "ItmStorageBinFloor1x101bDmg": {
        "friendly": "Subfloor Bin (Damaged)",
        "category": [
          "Furniture"
        ],
        "basePrice": 351.0,
        "mass": 13.0,
        "durability": 40.0,
        "source": "cooverlay"
      },
      "ItmStorageBinFloor1x102Dmg": {
        "friendly": "Subfloor Bin (Damaged)",
        "category": [
          "Furniture"
        ],
        "basePrice": 351.0,
        "mass": 13.0,
        "durability": 40.0,
        "source": "cooverlay"
      },
      "ItmStorageBinFloor1x102bDmg": {
        "friendly": "Subfloor Bin (Damaged)",
        "category": [
          "Furniture"
        ],
        "basePrice": 351.0,
        "mass": 13.0,
        "durability": 40.0,
        "source": "cooverlay"
      },
      "ItmStorageBinFloor1x103Dmg": {
        "friendly": "Subfloor Bin (Damaged)",
        "category": [
          "Furniture"
        ],
        "basePrice": 351.0,
        "mass": 13.0,
        "durability": 40.0,
        "source": "cooverlay"
      },
      "ItmStorageBinFloor1x103bDmg": {
        "friendly": "Subfloor Bin (Damaged)",
        "category": [
          "Furniture"
        ],
        "basePrice": 351.0,
        "mass": 13.0,
        "durability": 40.0,
        "source": "cooverlay"
      },
      "ItmStorageBinFloor1x101Dmg": {
        "friendly": "Subfloor Bin (Damaged)",
        "short": "Bin",
        "category": [
          "Furniture"
        ],
        "basePrice": 351.0,
        "mass": 13.0,
        "durability": 40.0,
        "source": "condowner"
      },
      "ItmStorageBinFloor1x101bPatch": {
        "friendly": "Subfloor Bin (Patched)",
        "category": [
          "Furniture"
        ],
        "basePrice": 1300.0,
        "mass": 17.23,
        "durability": 5.0,
        "source": "cooverlay"
      },
      "ItmStorageBinFloor1x102Patch": {
        "friendly": "Subfloor Bin (Patched)",
        "category": [
          "Furniture"
        ],
        "basePrice": 1300.0,
        "mass": 17.23,
        "durability": 5.0,
        "source": "cooverlay"
      },
      "ItmStorageBinFloor1x102bPatch": {
        "friendly": "Subfloor Bin (Patched)",
        "category": [
          "Furniture"
        ],
        "basePrice": 1300.0,
        "mass": 17.23,
        "durability": 5.0,
        "source": "cooverlay"
      },
      "ItmStorageBinFloor1x103Patch": {
        "friendly": "Subfloor Bin (Patched)",
        "category": [
          "Furniture"
        ],
        "basePrice": 1300.0,
        "mass": 17.23,
        "durability": 5.0,
        "source": "cooverlay"
      },
      "ItmStorageBinFloor1x103bPatch": {
        "friendly": "Subfloor Bin (Patched)",
        "category": [
          "Furniture"
        ],
        "basePrice": 1300.0,
        "mass": 17.23,
        "durability": 5.0,
        "source": "cooverlay"
      },
      "ItmStorageBinFloor1x101Patch": {
        "friendly": "Subfloor Bin (Patched)",
        "short": "Bin",
        "category": [
          "Furniture"
        ],
        "basePrice": 1300.0,
        "mass": 17.23,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmFloorGrate03": {
        "friendly": "Tile Floor",
        "short": "Floor",
        "category": [
          "Hull"
        ],
        "basePrice": 35.0,
        "mass": 40.0,
        "durability": 30.0,
        "source": "condowner"
      }
    },
    "doors": {
      "ItmDoor05ClosedOn": {
        "friendly": "Blast Door (Closed)",
        "category": [
          "Hull"
        ],
        "basePrice": 2670.0,
        "mass": 181.0,
        "durability": 20.0,
        "source": "cooverlay"
      },
      "ItmDoor05ClosedDmg": {
        "friendly": "Blast Door (Closed, Damaged)",
        "category": [
          "Hull"
        ],
        "basePrice": 540.0,
        "mass": 181.0,
        "durability": 60.0,
        "source": "cooverlay"
      },
      "ItmDoor05ClosedOnLocked": {
        "friendly": "Blast Door (Closed, Locked)",
        "category": [
          "Hull"
        ],
        "basePrice": 2670.0,
        "mass": 181.0,
        "durability": 20.0,
        "source": "cooverlay"
      },
      "ItmDoor05ClosedLoose": {
        "friendly": "Blast Door (Closed, Loose)",
        "category": [
          "Hull"
        ],
        "basePrice": 2670.0,
        "mass": 181.0,
        "durability": 20.0,
        "source": "cooverlay"
      },
      "ItmDoor05Closed": {
        "friendly": "Blast Door (Closed, Off)",
        "category": [
          "Hull"
        ],
        "basePrice": 2670.0,
        "mass": 181.0,
        "durability": 20.0,
        "source": "cooverlay"
      },
      "ItmDoor05ClosedLocked": {
        "friendly": "Blast Door (Closed, Off, Locked)",
        "category": [
          "Hull"
        ],
        "basePrice": 2670.0,
        "mass": 181.0,
        "durability": 20.0,
        "source": "cooverlay"
      },
      "ItmDoor05ClosedDmgLoose": {
        "friendly": "Blast Door (Loose, Damaged)",
        "category": [
          "Hull"
        ],
        "basePrice": 540.0,
        "mass": 181.0,
        "durability": 60.0,
        "source": "cooverlay"
      },
      "ItmDoor05OpenOn": {
        "friendly": "Blast Door (Opened)",
        "category": [
          "Hull"
        ],
        "basePrice": 2670.0,
        "mass": 181.0,
        "durability": 20.0,
        "source": "cooverlay"
      },
      "ItmDoor05OpenOnLocked": {
        "friendly": "Blast Door (Opened, Locked)",
        "category": [
          "Hull"
        ],
        "basePrice": 2670.0,
        "mass": 181.0,
        "durability": 20.0,
        "source": "cooverlay"
      },
      "ItmDoor05OpenLocked": {
        "friendly": "Blast Door (Opened, Locked, Off)",
        "category": [
          "Hull"
        ],
        "basePrice": 2670.0,
        "mass": 181.0,
        "durability": 20.0,
        "source": "cooverlay"
      },
      "ItmDoor05Open": {
        "friendly": "Blast Door (Opened, Off)",
        "category": [
          "Hull"
        ],
        "basePrice": 2670.0,
        "mass": 181.0,
        "durability": 20.0,
        "source": "cooverlay"
      },
      "ItmDoor04ClosedOn": {
        "friendly": "Door (Closed)",
        "category": [
          "Hull"
        ],
        "basePrice": 2670.0,
        "mass": 181.0,
        "durability": 20.0,
        "source": "cooverlay"
      },
      "ItmDoor01ClosedOn": {
        "friendly": "Door (Closed)",
        "short": "Door",
        "category": [
          "Hull"
        ],
        "basePrice": 2670.0,
        "mass": 181.0,
        "durability": 20.0,
        "source": "condowner"
      },
      "ItmDoor04ClosedDmg": {
        "friendly": "Door (Closed, Damaged)",
        "category": [
          "Hull"
        ],
        "basePrice": 540.0,
        "mass": 181.0,
        "durability": 60.0,
        "source": "cooverlay"
      },
      "ItmDoor01ClosedDmg": {
        "friendly": "Door (Closed, Damaged)",
        "short": "Door",
        "category": [
          "Hull"
        ],
        "basePrice": 540.0,
        "mass": 181.0,
        "durability": 60.0,
        "source": "condowner"
      },
      "ItmDoor04ClosedOnLocked": {
        "friendly": "Door (Closed, Locked)",
        "category": [
          "Hull"
        ],
        "basePrice": 2670.0,
        "mass": 181.0,
        "durability": 20.0,
        "source": "cooverlay"
      },
      "ItmDoor01ClosedOnLocked": {
        "friendly": "Door (Closed, Locked)",
        "short": "Door",
        "category": [
          "Hull"
        ],
        "basePrice": 2670.0,
        "mass": 181.0,
        "durability": 20.0,
        "source": "condowner"
      },
      "ItmDoor04ClosedLoose": {
        "friendly": "Door (Closed, Loose)",
        "category": [
          "Hull"
        ],
        "basePrice": 2670.0,
        "mass": 181.0,
        "durability": 20.0,
        "source": "cooverlay"
      },
      "ItmDoor01ClosedLoose": {
        "friendly": "Door (Closed, Loose)",
        "short": "Door",
        "category": [
          "Hull"
        ],
        "basePrice": 2670.0,
        "mass": 181.0,
        "durability": 20.0,
        "source": "condowner"
      },
      "ItmDoor04Closed": {
        "friendly": "Door (Closed, Off)",
        "category": [
          "Hull"
        ],
        "basePrice": 2670.0,
        "mass": 181.0,
        "durability": 20.0,
        "source": "cooverlay"
      },
      "ItmDoor01Closed": {
        "friendly": "Door (Closed, Off)",
        "short": "Door",
        "category": [
          "Hull"
        ],
        "basePrice": 2670.0,
        "mass": 181.0,
        "durability": 20.0,
        "source": "condowner"
      },
      "ItmDoor04ClosedLocked": {
        "friendly": "Door (Closed, Off, Locked)",
        "category": [
          "Hull"
        ],
        "basePrice": 2670.0,
        "mass": 181.0,
        "durability": 20.0,
        "source": "cooverlay"
      },
      "ItmDoor01ClosedLocked": {
        "friendly": "Door (Closed, Off, Locked)",
        "short": "Door",
        "category": [
          "Hull"
        ],
        "basePrice": 2670.0,
        "mass": 181.0,
        "durability": 20.0,
        "source": "condowner"
      },
      "ItmDoor04ClosedDmgLoose": {
        "friendly": "Door (Loose, Damaged)",
        "category": [
          "Hull"
        ],
        "basePrice": 540.0,
        "mass": 181.0,
        "durability": 60.0,
        "source": "cooverlay"
      },
      "ItmDoor01ClosedDmgLoose": {
        "friendly": "Door (Loose, Damaged)",
        "short": "Door",
        "category": [
          "Hull"
        ],
        "basePrice": 540.0,
        "mass": 181.0,
        "durability": 60.0,
        "source": "condowner"
      },
      "ItmDoor04OpenOn": {
        "friendly": "Door (Opened)",
        "category": [
          "Hull"
        ],
        "basePrice": 2670.0,
        "mass": 181.0,
        "durability": 20.0,
        "source": "cooverlay"
      },
      "ItmDoor01OpenOn": {
        "friendly": "Door (Opened)",
        "short": "Door",
        "category": [
          "Hull"
        ],
        "basePrice": 2670.0,
        "mass": 181.0,
        "durability": 20.0,
        "source": "condowner"
      },
      "ItmDoor04OpenOnLocked": {
        "friendly": "Door (Opened, Locked)",
        "category": [
          "Hull"
        ],
        "basePrice": 2670.0,
        "mass": 181.0,
        "durability": 20.0,
        "source": "cooverlay"
      },
      "ItmDoor01OpenOnLocked": {
        "friendly": "Door (Opened, Locked)",
        "short": "Door",
        "category": [
          "Hull"
        ],
        "basePrice": 2670.0,
        "mass": 181.0,
        "durability": 20.0,
        "source": "condowner"
      },
      "ItmDoor04OpenLocked": {
        "friendly": "Door (Opened, Locked, Off)",
        "category": [
          "Hull"
        ],
        "basePrice": 2670.0,
        "mass": 181.0,
        "durability": 20.0,
        "source": "cooverlay"
      },
      "ItmDoor01OpenLocked": {
        "friendly": "Door (Opened, Locked, Off)",
        "short": "Door",
        "category": [
          "Hull"
        ],
        "basePrice": 2670.0,
        "mass": 181.0,
        "durability": 20.0,
        "source": "condowner"
      },
      "ItmDoor04Open": {
        "friendly": "Door (Opened, Off)",
        "category": [
          "Hull"
        ],
        "basePrice": 2670.0,
        "mass": 181.0,
        "durability": 20.0,
        "source": "cooverlay"
      },
      "ItmDoor01Open": {
        "friendly": "Door (Opened, Off)",
        "short": "Door",
        "category": [
          "Hull"
        ],
        "basePrice": 2670.0,
        "mass": 181.0,
        "durability": 20.0,
        "source": "condowner"
      },
      "MooringPort": {
        "friendly": "MooringPort",
        "source": "condowner"
      },
      "ItmDockSys02Closed": {
        "friendly": "Primary Exterior Airlock (Closed)",
        "short": "Primary Airlock",
        "category": [
          "Hull"
        ],
        "basePrice": 78944.0,
        "mass": 254.0,
        "durability": 25.0,
        "source": "condowner"
      },
      "ItmDockSys02Open": {
        "friendly": "Primary Exterior Airlock (Opened)",
        "short": "Primary Airlock",
        "category": [
          "Hull"
        ],
        "basePrice": 78944.0,
        "mass": 254.0,
        "durability": 25.0,
        "source": "condowner"
      },
      "ItmDockSys03Closed": {
        "friendly": "Secondary Exterior Airlock (Closed)",
        "short": "Secondary Airlock",
        "category": [
          "Hull"
        ],
        "basePrice": 39472.0,
        "mass": 254.0,
        "durability": 25.0,
        "source": "condowner"
      },
      "ItmDockSys03ClosedDmg": {
        "friendly": "Secondary Exterior Airlock (Damaged)",
        "short": "Secondary Airlock",
        "category": [
          "Hull"
        ],
        "basePrice": 7894.0,
        "mass": 254.0,
        "durability": 40.0,
        "source": "condowner"
      },
      "ItmDockSys03ClosedDmgLoose": {
        "friendly": "Secondary Exterior Airlock (Damaged, Loose)",
        "short": "Secondary Airlock",
        "category": [
          "Hull"
        ],
        "basePrice": 7894.0,
        "mass": 254.0,
        "durability": 40.0,
        "source": "condowner"
      },
      "ItmDockSys03ClosedLoose": {
        "friendly": "Secondary Exterior Airlock (Loose)",
        "short": "Secondary Airlock",
        "category": [
          "Hull"
        ],
        "basePrice": 39472.0,
        "mass": 254.0,
        "durability": 25.0,
        "source": "condowner"
      },
      "ItmDockSys03Open": {
        "friendly": "Secondary Exterior Airlock (Opened)",
        "short": "Secondary Airlock",
        "category": [
          "Hull"
        ],
        "basePrice": 39472.0,
        "mass": 254.0,
        "durability": 25.0,
        "source": "condowner"
      },
      "ItmDoor03Transit": {
        "friendly": "Transit Lift (Down)",
        "short": "Transit Lift",
        "category": [
          "Hull"
        ],
        "basePrice": 2670.0,
        "mass": 581.0,
        "durability": 80.0,
        "source": "condowner"
      },
      "ItmDoor03Transitb": {
        "friendly": "Transit Lift (Up)",
        "category": [
          "Hull"
        ],
        "basePrice": 2670.0,
        "mass": 581.0,
        "durability": 80.0,
        "source": "condowner"
      }
    },
    "conduits": {
      "ItmConduit00": {
        "friendly": "Conduit",
        "category": [
          "Electronics"
        ],
        "basePrice": 80.0,
        "mass": 0.5,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmConduit00Dmg": {
        "friendly": "Conduit (Damaged)",
        "short": "Conduit",
        "category": [
          "Electronics"
        ],
        "basePrice": 8.0,
        "mass": 0.5,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmConduit01Dmg": {
        "friendly": "Conduit (Damaged): Collective Electric \"Albrite\" EMT",
        "category": [
          "Electronics"
        ],
        "basePrice": 8.0,
        "mass": 0.5,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "ItmConduit04Dmg": {
        "friendly": "Conduit (Damaged): Jumper-Jack Emergency Cabling",
        "category": [
          "Electronics"
        ],
        "basePrice": 8.0,
        "mass": 0.5,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "ItmConduit00Loose": {
        "friendly": "Conduit (Loose)",
        "short": "Conduit",
        "category": [
          "Electronics"
        ],
        "basePrice": 80.0,
        "mass": 0.5,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmConduit01Loose": {
        "friendly": "Conduit (Loose): Collective Electric \"Albrite\" EMT",
        "category": [
          "Electronics"
        ],
        "basePrice": 80.0,
        "mass": 0.5,
        "durability": 2.0,
        "source": "cooverlay"
      },
      "ItmConduit04Loose": {
        "friendly": "Conduit (Loose): Jumper-Jack Emergency Cabling",
        "category": [
          "Electronics"
        ],
        "basePrice": 80.0,
        "mass": 0.5,
        "durability": 2.0,
        "source": "cooverlay"
      },
      "ItmConduit04DmgLoose": {
        "friendly": "Conduit (Loose): Jumper-Jack Emergency Cabling",
        "category": [
          "Electronics"
        ],
        "basePrice": 8.0,
        "mass": 0.5,
        "durability": 2.0,
        "source": "cooverlay"
      },
      "ItmConduit00DmgLoose": {
        "friendly": "Conduit (Loose, Damaged)",
        "short": "Conduit",
        "category": [
          "Electronics"
        ],
        "basePrice": 8.0,
        "mass": 0.5,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmConduit01DmgLoose": {
        "friendly": "Conduit (Loose, Damaged): Collective Electric \"Albrite\" EMT",
        "category": [
          "Electronics"
        ],
        "basePrice": 8.0,
        "mass": 0.5,
        "durability": 2.0,
        "source": "cooverlay"
      },
      "ItmConduit01": {
        "friendly": "Conduit: Collective Electric \"Albrite\" EMT",
        "category": [
          "Electronics"
        ],
        "basePrice": 80.0,
        "mass": 0.5,
        "durability": 2.0,
        "source": "cooverlay"
      },
      "ItmConduit04": {
        "friendly": "Conduit: Jumper-Jack Emergency Cabling",
        "category": [
          "Electronics"
        ],
        "basePrice": 80.0,
        "mass": 0.5,
        "durability": 2.0,
        "source": "cooverlay"
      },
      "ItmReactorIC03Batt": {
        "friendly": "IC Fusion Reactor (Battery Mode)",
        "short": "Reactor",
        "category": [
          "FusionParts"
        ],
        "basePrice": 141000.0,
        "mass": 417.0,
        "durability": 25.0,
        "source": "condowner"
      },
      "ItmFusionReactorCore01Batt": {
        "friendly": "IC Fusion Reactor Core: Sulaiman \"X(X) TW\" (Battery Mode)",
        "short": "Reactor Core",
        "category": [
          "FusionParts"
        ],
        "basePrice": 41000.0,
        "mass": 417.0,
        "durability": 25.0,
        "source": "condowner"
      },
      "ItmReactorIC02Batt": {
        "friendly": "ItmReactorIC02Batt",
        "short": "Reactor",
        "category": [
          "FusionParts"
        ],
        "basePrice": 141000.0,
        "mass": 417.0,
        "durability": 120.0,
        "source": "condowner"
      }
    },
    "containers": {
      "ItmBackpack02": {
        "friendly": "Backpack: Black Wing \"KOMPART\"",
        "short": "Backpack",
        "category": [
          "Textiles"
        ],
        "basePrice": 254.0,
        "mass": 1.5,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmBackpack01": {
        "friendly": "Backpack: Pearson \"Yukon\"",
        "short": "Backpack",
        "category": [
          "Textiles"
        ],
        "basePrice": 254.0,
        "mass": 2.0,
        "durability": 4.0,
        "source": "condowner"
      },
      "PocketEVABatt01": {
        "friendly": "Bingham-12 EVA Battery Compartment",
        "short": "Battery Compartment",
        "source": "condowner"
      },
      "PocketEVACO201": {
        "friendly": "Bingham-12 EVA CO2 filter Compartment",
        "short": "Filter Compartment",
        "source": "condowner"
      },
      "PocketEVAO201": {
        "friendly": "Bingham-12 EVA O2 Bottle Compartment",
        "short": "O2 Compartment",
        "source": "condowner"
      },
      "ItmShipWeaponMissileLauncher02DmgLoose": {
        "friendly": "BNW Missile Launcher (Damaged, Loose)",
        "short": "Missile Launcher",
        "category": [
          "Weapons"
        ],
        "basePrice": 18600.0,
        "mass": 230.0,
        "durability": 20.0,
        "source": "condowner"
      },
      "ItmShipWeaponMissileLauncher02Loose": {
        "friendly": "BNW Missile Launcher (Loose)",
        "short": "Missile Launcher",
        "category": [
          "Weapons"
        ],
        "basePrice": 93000.0,
        "mass": 230.0,
        "durability": 14.0,
        "source": "condowner"
      },
      "ItmDrinkBottle01": {
        "friendly": "Bottle of \"Bismertnaya\" Vodka",
        "short": "Bottle",
        "category": [
          "Intoxicants"
        ],
        "basePrice": 0.7,
        "mass": 0.65,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmDrinkBottle02": {
        "friendly": "Bottle of \"Label 99\" Rice Wine",
        "short": "Bottle",
        "category": [
          "Intoxicants"
        ],
        "basePrice": 0.7,
        "mass": 0.65,
        "durability": 2.5,
        "source": "condowner"
      },
      "ItmBoxAntiNausea01": {
        "friendly": "Box: Van Buren \"Nausaway\" Anti-Nausea Pills",
        "short": "Pill Box",
        "category": [
          "Medical"
        ],
        "basePrice": 0.03,
        "mass": 0.025,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmShipWeaponPDC02DmgLoose": {
        "friendly": "Brave New World '钟馗' CIWS (Damaged, Loose)",
        "short": "PDC",
        "category": [
          "Weapons"
        ],
        "basePrice": 8000.0,
        "mass": 40.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmShipWeaponPDC02Loose": {
        "friendly": "Brave New World '钟馗' CIWS (Loose)",
        "short": "PDC",
        "category": [
          "Weapons"
        ],
        "basePrice": 40000.0,
        "mass": 40.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "PocketBreast01": {
        "friendly": "Breast Pocket",
        "short": "Pocket",
        "source": "condowner"
      },
      "ItmStorageBin1x102Loose": {
        "friendly": "Bulkhead Bin (Loose)",
        "category": [
          "Furniture"
        ],
        "basePrice": 774.0,
        "mass": 7.0,
        "durability": 5.0,
        "source": "cooverlay"
      },
      "ItmStorageBin1x102bLoose": {
        "friendly": "Bulkhead Bin (Loose)",
        "category": [
          "Furniture"
        ],
        "basePrice": 774.0,
        "mass": 7.0,
        "durability": 5.0,
        "source": "cooverlay"
      },
      "ItmStorageBin1x103Loose": {
        "friendly": "Bulkhead Bin (Loose)",
        "category": [
          "Furniture"
        ],
        "basePrice": 774.0,
        "mass": 7.0,
        "durability": 5.0,
        "source": "cooverlay"
      },
      "ItmStorageBin1x101Loose": {
        "friendly": "Bulkhead Bin (Loose)",
        "short": "Bin",
        "category": [
          "Furniture"
        ],
        "basePrice": 774.0,
        "mass": 7.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmStorageBin1x102DmgLoose": {
        "friendly": "Bulkhead Bin (Loose, Damaged)",
        "category": [
          "Furniture"
        ],
        "basePrice": 121.0,
        "mass": 7.0,
        "durability": 10.0,
        "source": "cooverlay"
      },
      "ItmStorageBin1x102bDmgLoose": {
        "friendly": "Bulkhead Bin (Loose, Damaged)",
        "category": [
          "Furniture"
        ],
        "basePrice": 121.0,
        "mass": 7.0,
        "durability": 10.0,
        "source": "cooverlay"
      },
      "ItmStorageBin1x103DmgLoose": {
        "friendly": "Bulkhead Bin (Loose, Damaged)",
        "category": [
          "Furniture"
        ],
        "basePrice": 121.0,
        "mass": 7.0,
        "durability": 10.0,
        "source": "cooverlay"
      },
      "ItmStorageBin1x101DmgLoose": {
        "friendly": "Bulkhead Bin (Loose, Damaged)",
        "short": "Bin",
        "category": [
          "Furniture"
        ],
        "basePrice": 121.0,
        "mass": 7.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmStorageBin2x102Loose": {
        "friendly": "Bulkhead Bin 2x (Loose)",
        "category": [
          "Furniture"
        ],
        "basePrice": 882.0,
        "mass": 14.0,
        "durability": 10.0,
        "source": "cooverlay"
      },
      "ItmStorageBin2x103Loose": {
        "friendly": "Bulkhead Bin 2x (Loose)",
        "category": [
          "Furniture"
        ],
        "basePrice": 882.0,
        "mass": 14.0,
        "durability": 10.0,
        "source": "cooverlay"
      },
      "ItmStorageBin2x104Loose": {
        "friendly": "Bulkhead Bin 2x (Loose)",
        "short": "Bin",
        "category": [
          "Furniture"
        ],
        "basePrice": 1482.0,
        "mass": 18.0,
        "durability": 15.0,
        "source": "condowner"
      },
      "ItmStorageBin2x101Loose": {
        "friendly": "Bulkhead Bin 2x (Loose)",
        "short": "Bin",
        "category": [
          "Furniture"
        ],
        "basePrice": 882.0,
        "mass": 14.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmStorageBin2x102DmgLoose": {
        "friendly": "Bulkhead Bin 2x (Loose, Damaged)",
        "category": [
          "Furniture"
        ],
        "basePrice": 197.0,
        "mass": 14.0,
        "durability": 20.0,
        "source": "cooverlay"
      },
      "ItmStorageBin2x103DmgLoose": {
        "friendly": "Bulkhead Bin 2x (Loose, Damaged)",
        "category": [
          "Furniture"
        ],
        "basePrice": 197.0,
        "mass": 14.0,
        "durability": 20.0,
        "source": "cooverlay"
      },
      "ItmStorageBin2x104DmgLoose": {
        "friendly": "Bulkhead Bin 2x (Loose, Damaged)",
        "short": "Bin",
        "category": [
          "Furniture"
        ],
        "basePrice": 267.0,
        "mass": 18.0,
        "durability": 25.0,
        "source": "condowner"
      },
      "ItmStorageBin2x101DmgLoose": {
        "friendly": "Bulkhead Bin 2x (Loose, Damaged)",
        "short": "Bin",
        "category": [
          "Furniture"
        ],
        "basePrice": 197.0,
        "mass": 14.0,
        "durability": 20.0,
        "source": "condowner"
      },
      "ItmStorageBin3x102Loose": {
        "friendly": "Bulkhead Bin 3x (Loose)",
        "category": [
          "Furniture"
        ],
        "basePrice": 1012.0,
        "mass": 21.0,
        "durability": 15.0,
        "source": "cooverlay"
      },
      "ItmStorageBin3x101Loose": {
        "friendly": "Bulkhead Bin 3x (Loose)",
        "short": "Bin",
        "category": [
          "Furniture"
        ],
        "basePrice": 1012.0,
        "mass": 21.0,
        "durability": 15.0,
        "source": "condowner"
      },
      "ItmStorageBin3x102DmgLoose": {
        "friendly": "Bulkhead Bin 3x (Loose, Damaged)",
        "category": [
          "Furniture"
        ],
        "basePrice": 274.0,
        "mass": 21.0,
        "durability": 30.0,
        "source": "cooverlay"
      },
      "ItmStorageBin3x101DmgLoose": {
        "friendly": "Bulkhead Bin 3x (Loose, Damaged)",
        "short": "Bin",
        "category": [
          "Furniture"
        ],
        "basePrice": 274.0,
        "mass": 21.0,
        "durability": 30.0,
        "source": "condowner"
      },
      "ItmStorageBin2x2C02Loose": {
        "friendly": "Bulkhead Bin: Corner (Loose)",
        "category": [
          "Furniture"
        ],
        "basePrice": 1024.0,
        "mass": 21.0,
        "durability": 15.0,
        "source": "cooverlay"
      },
      "ItmStorageBin2x2C03Loose": {
        "friendly": "Bulkhead Bin: Corner (Loose)",
        "category": [
          "Furniture"
        ],
        "basePrice": 1024.0,
        "mass": 21.0,
        "durability": 15.0,
        "source": "cooverlay"
      },
      "ItmStorageBin2x2C04Loose": {
        "friendly": "Bulkhead Bin: Corner (Loose)",
        "short": "Bin",
        "category": [
          "Furniture"
        ],
        "basePrice": 1824.0,
        "mass": 27.0,
        "durability": 20.0,
        "source": "condowner"
      },
      "ItmStorageBin2x2C01Loose": {
        "friendly": "Bulkhead Bin: Corner (Loose)",
        "short": "Bin",
        "category": [
          "Furniture"
        ],
        "basePrice": 1024.0,
        "mass": 21.0,
        "durability": 15.0,
        "source": "condowner"
      },
      "ItmStorageBin2x2C02DmgLoose": {
        "friendly": "Bulkhead Bin: Corner (Loose, Damaged)",
        "category": [
          "Furniture"
        ],
        "basePrice": 292.0,
        "mass": 21.0,
        "durability": 30.0,
        "source": "cooverlay"
      },
      "ItmStorageBin2x2C03DmgLoose": {
        "friendly": "Bulkhead Bin: Corner (Loose, Damaged)",
        "category": [
          "Furniture"
        ],
        "basePrice": 292.0,
        "mass": 21.0,
        "durability": 30.0,
        "source": "cooverlay"
      },
      "ItmStorageBin2x2C04DmgLoose": {
        "friendly": "Bulkhead Bin: Corner (Loose, Damaged)",
        "short": "Bin",
        "category": [
          "Furniture"
        ],
        "basePrice": 392.0,
        "mass": 27.0,
        "durability": 30.0,
        "source": "condowner"
      },
      "ItmStorageBin2x2C01DmgLoose": {
        "friendly": "Bulkhead Bin: Corner (Loose, Damaged)",
        "short": "Bin",
        "category": [
          "Furniture"
        ],
        "basePrice": 292.0,
        "mass": 21.0,
        "durability": 30.0,
        "source": "condowner"
      },
      "PocketCargo01": {
        "friendly": "Cargo Pocket",
        "source": "condowner"
      },
      "ItmWeaponPistol03": {
        "friendly": "Cathcart North \"Detective\" .38 Revolver",
        "short": ".38 Revolver",
        "category": [
          "Weapons"
        ],
        "basePrice": 2250.0,
        "mass": 1.0546,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmWeaponShotgun01": {
        "friendly": "Cathcart North \"Shindig\" Shotgun",
        "short": "Shotgun",
        "category": [
          "Weapons"
        ],
        "basePrice": 1885.0,
        "mass": 3.175,
        "durability": 9.0,
        "source": "condowner"
      },
      "PocketClipPoint01": {
        "friendly": "Clip Point",
        "source": "condowner"
      },
      "ItmAtmoScrubber01OffLoose": {
        "friendly": "CO2 AtmoScrubber (Loose)",
        "short": "CO2 Scrubber",
        "category": [
          "HVAC"
        ],
        "basePrice": 14326.0,
        "mass": 46.5,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmAtmoScrubber01DmgLoose": {
        "friendly": "CO2 AtmoScrubber (Loose, Damaged)",
        "short": "CO2 Scrubber",
        "category": [
          "HVAC"
        ],
        "basePrice": 1845.0,
        "mass": 46.5,
        "durability": 15.0,
        "source": "condowner"
      },
      "PocketCoat01": {
        "friendly": "Coat Pocket",
        "short": "Pocket",
        "source": "condowner"
      },
      "ItmWeaponCrossbow01": {
        "friendly": "Compound Crossbow",
        "short": "CrossBow",
        "category": [
          "Weapons"
        ],
        "basePrice": 685.0,
        "mass": 1.1,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmCigDamaskRoseBox01": {
        "friendly": "Damask Rose Cigarette Box",
        "short": "Cigarette Box",
        "category": [
          "Intoxicants"
        ],
        "basePrice": 1.0,
        "mass": 0.025,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmWeaponPistol01": {
        "friendly": "Deltec \"1911\" Handgun",
        "short": ".45 Handgun",
        "category": [
          "Weapons"
        ],
        "basePrice": 1985.0,
        "mass": 1.1,
        "durability": 12.0,
        "source": "condowner"
      },
      "ItmWeaponPistol02": {
        "friendly": "Deltec \"Barracuda\" 9mm Handgun",
        "short": "9mm Handgun",
        "category": [
          "Weapons"
        ],
        "basePrice": 1245.0,
        "mass": 0.625,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmDrinkPouch01": {
        "friendly": "Drink Pouch",
        "short": "Pouch",
        "category": [
          "ConsumerGoods"
        ],
        "basePrice": 0.23,
        "mass": 0.009,
        "durability": 1.5,
        "source": "condowner"
      },
      "ItmDrinkFlask01": {
        "friendly": "Flask (4L)",
        "short": "Flask",
        "category": [
          "ConsumerGoods"
        ],
        "basePrice": 32.5,
        "mass": 1.0,
        "durability": 2.5,
        "source": "condowner"
      },
      "ItmDrinkFlask02": {
        "friendly": "Flask (8L)",
        "short": "Flask",
        "category": [
          "ConsumerGoods"
        ],
        "basePrice": 82.5,
        "mass": 2.0,
        "durability": 2.5,
        "source": "condowner"
      },
      "ItmFridge01Loose": {
        "friendly": "Fridge (Loose)",
        "short": "Fridge",
        "category": [
          "Furniture"
        ],
        "basePrice": 774.0,
        "mass": 31.0,
        "durability": 15.0,
        "source": "condowner"
      },
      "ItmFridge01DmgLoose": {
        "friendly": "Fridge (Loose, Damaged)",
        "short": "Fridge",
        "category": [
          "Furniture"
        ],
        "basePrice": 121.0,
        "mass": 31.0,
        "durability": 45.0,
        "source": "condowner"
      },
      "ItmToolBox01": {
        "friendly": "Halvorson Pro Tool Box",
        "short": "Toolbox",
        "category": [
          "Tools"
        ],
        "basePrice": 338.0,
        "mass": 10.0,
        "durability": 8.0,
        "source": "condowner"
      },
      "PocketHip01": {
        "friendly": "Hip Pocket",
        "short": "Pocket",
        "source": "condowner"
      },
      "PocketHoodie01": {
        "friendly": "Hoodie Pocket",
        "source": "condowner"
      },
      "ItmToolBox02": {
        "friendly": "Horang \"PlaStak\" Tool Box",
        "short": "Toolbox",
        "category": [
          "Tools"
        ],
        "basePrice": 147.0,
        "mass": 10.0,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmWeaponCrossbow02": {
        "friendly": "Limbless Crossbow",
        "short": "CrossBow",
        "category": [
          "Weapons"
        ],
        "basePrice": 1066.0,
        "mass": 1.1,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmPillBottle01": {
        "friendly": "Pill Bottle: PharmaCon \"Cavilo\" Pain Relief Pills",
        "short": "Pill Bottle",
        "category": [
          "Medical"
        ],
        "basePrice": 0.7,
        "mass": 0.05,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmPillBottle03": {
        "friendly": "Pill Bottle: Van Buren \"Amoxicillin\" Antibiotic Pills",
        "short": "Pill Bottle",
        "category": [
          "Medical"
        ],
        "basePrice": 0.7,
        "mass": 0.05,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmPillBottle02": {
        "friendly": "Pill Bottle: Van Buren \"Hydrocodone\" Pain Relief Pills",
        "short": "Pill Bottle",
        "category": [
          "Medical"
        ],
        "basePrice": 0.7,
        "mass": 0.05,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmShipWeaponDecoyLauncher01DmgLoose": {
        "friendly": "Polaris Decoy Launcher (Damaged, Loose)",
        "short": "Decoy Launcher",
        "category": [
          "Weapons"
        ],
        "basePrice": 17200.0,
        "mass": 320.0,
        "durability": 25.0,
        "source": "condowner"
      },
      "ItmShipWeaponDecoyLauncher01Loose": {
        "friendly": "Polaris Decoy Launcher (Loose)",
        "short": "Decoy Launcher",
        "category": [
          "Weapons"
        ],
        "basePrice": 86000.0,
        "mass": 320.0,
        "durability": 20.0,
        "source": "condowner"
      },
      "ItmRack1x101Loose": {
        "friendly": "Rack 1x1 (Loose)",
        "short": "Rack",
        "category": [
          "Furniture"
        ],
        "basePrice": 774.0,
        "mass": 7.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmRack1x101DormLoose": {
        "friendly": "Rack 1x1 (Loose)",
        "category": [
          "Furniture"
        ],
        "basePrice": 774.0,
        "mass": 7.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmRack1x101DmgLoose": {
        "friendly": "Rack 1x1 (Loose, Damaged)",
        "short": "Rack",
        "category": [
          "Furniture"
        ],
        "basePrice": 121.0,
        "mass": 7.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmRack1x101DormDmgLoose": {
        "friendly": "Rack 1x1 (Loose, Damaged)",
        "category": [
          "Furniture"
        ],
        "basePrice": 121.0,
        "mass": 7.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmRack1x201Loose": {
        "friendly": "Rack 1x2 (Loose)",
        "short": "Rack",
        "category": [
          "Furniture"
        ],
        "basePrice": 882.0,
        "mass": 14.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmRack1x201DmgLoose": {
        "friendly": "Rack 1x2 (Loose, Damaged)",
        "short": "Rack",
        "category": [
          "Furniture"
        ],
        "basePrice": 197.0,
        "mass": 14.0,
        "durability": 20.0,
        "source": "condowner"
      },
      "ItmRack1x301Loose": {
        "friendly": "Rack 1x3 (Loose)",
        "short": "Rack",
        "category": [
          "Furniture"
        ],
        "basePrice": 1012.0,
        "mass": 21.0,
        "durability": 15.0,
        "source": "condowner"
      },
      "ItmRack1x301DmgLoose": {
        "friendly": "Rack 1x3 (Loose, Damaged)",
        "short": "Rack",
        "category": [
          "Furniture"
        ],
        "basePrice": 274.0,
        "mass": 21.0,
        "durability": 30.0,
        "source": "condowner"
      },
      "ItmRack1x401Loose": {
        "friendly": "Rack 1x4 (Loose)",
        "short": "Rack",
        "category": [
          "Furniture"
        ],
        "basePrice": 1300.0,
        "mass": 28.0,
        "durability": 20.0,
        "source": "condowner"
      },
      "ItmRack1x401DmgLoose": {
        "friendly": "Rack 1x4 (Loose, Damaged)",
        "short": "Rack",
        "category": [
          "Furniture"
        ],
        "basePrice": 351.0,
        "mass": 28.0,
        "durability": 45.0,
        "source": "condowner"
      },
      "ItmRack2x2C01Loose": {
        "friendly": "Rack Corner (Loose)",
        "short": "Rack",
        "category": [
          "Furniture"
        ],
        "basePrice": 1024.0,
        "mass": 21.0,
        "durability": 15.0,
        "source": "condowner"
      },
      "ItmRack2x2C01DmgLoose": {
        "friendly": "Rack Corner (Loose, Damaged)",
        "short": "Rack",
        "category": [
          "Furniture"
        ],
        "basePrice": 292.0,
        "mass": 21.0,
        "durability": 30.0,
        "source": "condowner"
      },
      "ItmCrate01": {
        "friendly": "Rakow Smart Crate",
        "short": "Crate",
        "category": [
          "Tools"
        ],
        "basePrice": 338.0,
        "mass": 10.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmCrate01Lock": {
        "friendly": "Rakow Smart Crate (Locked)",
        "short": "Crate",
        "category": [
          "Tools"
        ],
        "basePrice": 338.0,
        "mass": 10.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "PocketPDACarts01": {
        "friendly": "Renbao \"Portal\" PDA Cart Compartment",
        "short": "Cart Compartment",
        "source": "condowner"
      },
      "ItmWeaponPistol04": {
        "friendly": "RiP Handgun",
        "short": "RiP Gun",
        "category": [
          "Weapons"
        ],
        "basePrice": 75.0,
        "mass": 0.43,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmWeaponShockProd01": {
        "friendly": "Shock Prod",
        "category": [
          "Weapons"
        ],
        "basePrice": 145.0,
        "mass": 0.298,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmSink01Loose": {
        "friendly": "Sink (Loose)",
        "short": "Sink",
        "category": [
          "Furniture"
        ],
        "basePrice": 234.0,
        "mass": 15.0,
        "durability": 15.0,
        "source": "condowner"
      },
      "PocketPouchSmall01": {
        "friendly": "Small Pouch",
        "short": "Pouch",
        "source": "condowner"
      },
      "ItmWeaponRifle02": {
        "friendly": "Smartlink \"Helix\" Carbine",
        "short": "5.56mm Carbine",
        "category": [
          "Weapons"
        ],
        "basePrice": 6450.0,
        "mass": 3.59,
        "durability": 9.0,
        "source": "condowner"
      },
      "ItmWeaponShotgun02": {
        "friendly": "Smartlink \"Prophet\" Shotgun",
        "short": "Shotgun",
        "category": [
          "Weapons"
        ],
        "basePrice": 4875.0,
        "mass": 3.875,
        "durability": 7.0,
        "source": "condowner"
      },
      "ItmWeaponPistolEnergy01": {
        "friendly": "Smartlink \"Quicksilver\" Handgun",
        "short": "9mm Handgun",
        "category": [
          "Weapons"
        ],
        "basePrice": 2745.0,
        "mass": 0.825,
        "durability": 7.0,
        "source": "condowner"
      },
      "ItmShipWeaponPDC01DmgLoose": {
        "friendly": "Smartlink 'Charybdis' PDC (Damaged, Loose)",
        "short": "PDC",
        "category": [
          "Weapons"
        ],
        "basePrice": 5000.0,
        "mass": 60.0,
        "durability": 13.0,
        "source": "condowner"
      },
      "ItmShipWeaponPDC01Loose": {
        "friendly": "Smartlink 'Charybdis' PDC (Loose)",
        "short": "PDC",
        "category": [
          "Weapons"
        ],
        "basePrice": 25000.0,
        "mass": 60.0,
        "durability": 8.0,
        "source": "condowner"
      },
      "ItmShipWeaponMissileLauncher01DmgLoose": {
        "friendly": "Smartlink Missile Launcher (Damaged, Loose)",
        "short": "Missile Launcher",
        "category": [
          "Weapons"
        ],
        "basePrice": 17200.0,
        "mass": 320.0,
        "durability": 25.0,
        "source": "condowner"
      },
      "ItmShipWeaponMissileLauncher01Loose": {
        "friendly": "Smartlink Missile Launcher (Loose)",
        "short": "Missile Launcher",
        "category": [
          "Weapons"
        ],
        "basePrice": 86000.0,
        "mass": 320.0,
        "durability": 20.0,
        "source": "condowner"
      },
      "ItmShipWeaponPDC03DmgLoose": {
        "friendly": "Soyuzneft 'Панцирь-Х' PDC (Damaged, Loose)",
        "short": "PDC",
        "category": [
          "Weapons"
        ],
        "basePrice": 3600.0,
        "mass": 75.0,
        "durability": 15.0,
        "source": "condowner"
      },
      "ItmShipWeaponPDC03Loose": {
        "friendly": "Soyuzneft 'Панцирь-Х' PDC (Loose)",
        "short": "PDC",
        "category": [
          "Weapons"
        ],
        "basePrice": 18000.0,
        "mass": 75.0,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmShipWeaponMissileLauncher03DmgLoose": {
        "friendly": "Soyuzneft Missile Launcher (Damaged, Loose)",
        "short": "Missile Launcher",
        "category": [
          "Weapons"
        ],
        "basePrice": 8000.0,
        "mass": 250.0,
        "durability": 12.0,
        "source": "condowner"
      },
      "ItmShipWeaponMissileLauncher03Loose": {
        "friendly": "Soyuzneft Missile Launcher (Loose)",
        "short": "Missile Launcher",
        "category": [
          "Weapons"
        ],
        "basePrice": 40000.0,
        "mass": 250.0,
        "durability": 8.0,
        "source": "condowner"
      },
      "ItmRackUnder01Loose": {
        "friendly": "Storage Bay (Loose)",
        "short": "Bay",
        "category": [
          "Furniture"
        ],
        "basePrice": 4740.0,
        "mass": 40.0,
        "durability": 20.0,
        "source": "condowner"
      },
      "ItmRackUnder01DmgLoose": {
        "friendly": "Storage Bay (Loose, Damaged)",
        "short": "Bay",
        "category": [
          "Furniture"
        ],
        "basePrice": 871.0,
        "mass": 40.0,
        "durability": 45.0,
        "source": "condowner"
      },
      "PocketSmall01": {
        "friendly": "Stretch Pocket",
        "short": "Pocket",
        "source": "condowner"
      },
      "ItmWeaponPistolStun01": {
        "friendly": "Stun Pistol",
        "category": [
          "Weapons"
        ],
        "basePrice": 745.0,
        "mass": 0.625,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmStorageBinFloor1x101bLoose": {
        "friendly": "Subfloor Bin (Loose)",
        "category": [
          "Furniture"
        ],
        "basePrice": 1300.0,
        "mass": 28.0,
        "durability": 20.0,
        "source": "cooverlay"
      },
      "ItmStorageBinFloor1x102Loose": {
        "friendly": "Subfloor Bin (Loose)",
        "category": [
          "Furniture"
        ],
        "basePrice": 1300.0,
        "mass": 28.0,
        "durability": 20.0,
        "source": "cooverlay"
      },
      "ItmStorageBinFloor1x102bLoose": {
        "friendly": "Subfloor Bin (Loose)",
        "category": [
          "Furniture"
        ],
        "basePrice": 1300.0,
        "mass": 28.0,
        "durability": 20.0,
        "source": "cooverlay"
      },
      "ItmStorageBinFloor1x103Loose": {
        "friendly": "Subfloor Bin (Loose)",
        "category": [
          "Furniture"
        ],
        "basePrice": 1300.0,
        "mass": 28.0,
        "durability": 20.0,
        "source": "cooverlay"
      },
      "ItmStorageBinFloor1x103bLoose": {
        "friendly": "Subfloor Bin (Loose)",
        "category": [
          "Furniture"
        ],
        "basePrice": 1300.0,
        "mass": 28.0,
        "durability": 20.0,
        "source": "cooverlay"
      },
      "ItmStorageBinFloor1x101Loose": {
        "friendly": "Subfloor Bin (Loose)",
        "short": "Bin",
        "category": [
          "Furniture"
        ],
        "basePrice": 1300.0,
        "mass": 28.0,
        "durability": 20.0,
        "source": "condowner"
      },
      "ItmDolly02": {
        "friendly": "Testudo \"HyperHandy\" Equipment Truck",
        "short": "Loader Dolly",
        "category": [
          "Tools",
          "Tools"
        ],
        "basePrice": 33480.0,
        "mass": 153.0,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmDolly02Dmg": {
        "friendly": "Testudo \"HyperHandy\" Equipment Truck (Damaged)",
        "short": "Loader Dolly",
        "category": [
          "Tools",
          "Tools"
        ],
        "basePrice": 1680.0,
        "mass": 153.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmDolly01": {
        "friendly": "Testudo \"SuperHandy\" Equipment Truck",
        "short": "Dolly",
        "category": [
          "Tools",
          "Tools"
        ],
        "basePrice": 3348.0,
        "mass": 103.0,
        "durability": 15.0,
        "source": "condowner"
      },
      "ItmDolly01Dmg": {
        "friendly": "Testudo \"SuperHandy\" Equipment Truck (Damaged)",
        "short": "Dolly",
        "category": [
          "Tools",
          "Tools"
        ],
        "basePrice": 168.0,
        "mass": 103.0,
        "durability": 25.0,
        "source": "condowner"
      },
      "ItmToilet01Loose": {
        "friendly": "Toilet (Loose)",
        "short": "Toilet",
        "category": [
          "Furniture"
        ],
        "basePrice": 623.0,
        "mass": 125.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmBackpack03": {
        "friendly": "Tote: Ayotimiwa \"Loyalty\" (Limited Edition)",
        "short": "Tote",
        "category": [
          "Textiles"
        ],
        "basePrice": 71.0,
        "mass": 0.8,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmCigUnicornDreamBox01": {
        "friendly": "Unicorn Dream Cigarette Box",
        "short": "Cigarette Box",
        "category": [
          "Intoxicants"
        ],
        "basePrice": 1.0,
        "mass": 0.025,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmCigViceroyBox01": {
        "friendly": "Viceroy Cigarette Box",
        "short": "Cigarette Box",
        "category": [
          "Intoxicants"
        ],
        "basePrice": 1.0,
        "mass": 0.025,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmCigViceroyBox02": {
        "friendly": "Viceroy Menthol Cigarette Box",
        "short": "Cigarette Box",
        "category": [
          "Intoxicants"
        ],
        "basePrice": 1.0,
        "mass": 0.025,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmWeaponRifle01": {
        "friendly": "Xinhua \"291式自动步枪\" Combat Rifle",
        "short": "5.8mm Combat Rifle",
        "category": [
          "Weapons"
        ],
        "basePrice": 2335.0,
        "mass": 2.89,
        "durability": 12.0,
        "source": "condowner"
      }
    },
    "equipment": {
      "ItmSignNeon01": {
        "friendly": "\"Mescaform\" Neon Sign",
        "short": "Sign",
        "category": [
          "LuxuryGoods"
        ],
        "basePrice": 1314.0,
        "mass": 7.5,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmSignNeon01Off": {
        "friendly": "\"Mescaform\" Neon Sign (Off)",
        "short": "Sign",
        "category": [
          "LuxuryGoods"
        ],
        "basePrice": 1314.0,
        "mass": 7.5,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmElectricalBox01Dmg": {
        "friendly": "'SB-8011' Signal Box (Damaged)",
        "short": "Signal Box",
        "category": [
          "Electronics"
        ],
        "basePrice": 13.3,
        "mass": 12.0,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmElectricalBox01Off": {
        "friendly": "'SB-8011' Signal Box (Off)",
        "short": "Signal Box",
        "category": [
          "Electronics"
        ],
        "basePrice": 66.5,
        "mass": 12.0,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmElectricalBox01": {
        "friendly": "'SB-8011' Signal Box (On)",
        "short": "Signal Box",
        "category": [
          "Electronics"
        ],
        "basePrice": 66.5,
        "mass": 12.0,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmHatch01Closed": {
        "friendly": "Access Hatch (Closed)",
        "category": [
          "Hull"
        ],
        "basePrice": 535.0,
        "mass": 88.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmHatch01Open": {
        "friendly": "Access Hatch (Open)",
        "category": [
          "Hull"
        ],
        "basePrice": 535.0,
        "mass": 88.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmStabilizerActive01On": {
        "friendly": "Active Stabilizer",
        "short": "Stabilizer",
        "category": [
          "Hull"
        ],
        "basePrice": 156774.0,
        "mass": 40.0,
        "durability": 30.0,
        "source": "condowner"
      },
      "ItmStabilizerActive01Dmg": {
        "friendly": "Active Stabilizer (Damaged)",
        "short": "Active Stabilizer",
        "category": [
          "Hull"
        ],
        "basePrice": 37914.0,
        "mass": 35.0,
        "durability": 13.0,
        "source": "condowner"
      },
      "ItmStabilizerActive01Off": {
        "friendly": "Active Stabilizer (Off)",
        "short": "Stabilizer",
        "category": [
          "Hull"
        ],
        "basePrice": 156774.0,
        "mass": 40.0,
        "durability": 30.0,
        "source": "condowner"
      },
      "ItmKioskAerostatScrap01": {
        "friendly": "Aerostat Scrap Kiosk",
        "category": [
          "Furniture"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "condowner"
      },
      "ItmPlanter2x201": {
        "friendly": "Agave Planter",
        "short": "Planter",
        "category": [
          "LuxuryGoods"
        ],
        "basePrice": 10504.0,
        "mass": 21.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmAICargo01": {
        "friendly": "AI Cargo",
        "category": [
          "Electronics"
        ],
        "basePrice": 44100.0,
        "mass": 61.0,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmAICargo01Dmg02": {
        "friendly": "AI Cargo (Damaged)",
        "short": "AI Cargo",
        "category": [
          "Electronics"
        ],
        "basePrice": 5610.0,
        "mass": 61.0,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmAICargo01Off": {
        "friendly": "AI Cargo (Off)",
        "short": "AI Cargo",
        "category": [
          "Electronics"
        ],
        "basePrice": 11200.0,
        "mass": 61.0,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmAirPump02OnG": {
        "friendly": "Air Pump",
        "short": "Pump",
        "category": [
          "HVAC"
        ],
        "basePrice": 2050.0,
        "mass": 11.0,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmAirPump03Dmg": {
        "friendly": "Air Pump (Damaged)",
        "category": [
          "HVAC"
        ],
        "basePrice": 510.0,
        "mass": 11.0,
        "durability": 11.0,
        "source": "cooverlay"
      },
      "ItmAirPump02Dmg": {
        "friendly": "Air Pump (Damaged)",
        "short": "Pump",
        "category": [
          "HVAC"
        ],
        "basePrice": 510.0,
        "mass": 11.0,
        "durability": 11.0,
        "source": "condowner"
      },
      "ItmAirPump03Off": {
        "friendly": "Air Pump (Off)",
        "category": [
          "HVAC"
        ],
        "basePrice": 2050.0,
        "mass": 11.0,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmAirPump02Off": {
        "friendly": "Air Pump (Off)",
        "short": "Pump",
        "category": [
          "HVAC"
        ],
        "basePrice": 2050.0,
        "mass": 11.0,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmAirPump03OnG": {
        "friendly": "Air Pump (OnG)",
        "category": [
          "HVAC"
        ],
        "basePrice": 2050.0,
        "mass": 11.0,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmVent01Closed": {
        "friendly": "Air Vent (Closed)",
        "short": "Vent",
        "category": [
          "HVAC"
        ],
        "basePrice": 335.0,
        "mass": 8.0,
        "durability": 15.0,
        "source": "condowner"
      },
      "ItmVent01Open": {
        "friendly": "Air Vent (Open)",
        "short": "Vent",
        "category": [
          "HVAC"
        ],
        "basePrice": 335.0,
        "mass": 8.0,
        "durability": 15.0,
        "source": "condowner"
      },
      "ItmArcadeGame01": {
        "friendly": "Arcade Cabinet: Breakout 2K79",
        "short": "Arcade: Breakout 2K79",
        "category": [
          "Media"
        ],
        "basePrice": 9450.0,
        "mass": 44.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmArcadeGame01Dmg": {
        "friendly": "Arcade Gaming Cabinet (Damaged)",
        "short": "Arcade Game",
        "category": [
          "Media"
        ],
        "basePrice": 1890.0,
        "mass": 40.0,
        "durability": 12.0,
        "source": "condowner"
      },
      "ItmArcadeGame01Off": {
        "friendly": "Arcade Gaming Cabinet (Off)",
        "short": "Arcade Game",
        "category": [
          "Media"
        ],
        "basePrice": 9450.0,
        "mass": 44.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmSignalBeacon01": {
        "friendly": "ASC \"SB-03a\" Microsatellite Beacon",
        "short": "Beacon",
        "category": [
          "Sensors"
        ],
        "basePrice": 2634.0,
        "mass": 31.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmSignalBeacon01Dmg": {
        "friendly": "ASC \"SB-03a\" Microsatellite Beacon (Damaged)",
        "short": "Beacon",
        "category": [
          "Sensors"
        ],
        "basePrice": 290.0,
        "mass": 1.35,
        "durability": 13.0,
        "source": "condowner"
      },
      "ItmVent02Closed": {
        "friendly": "Auto Air Vent (Closed)",
        "short": "Auto-Vent",
        "category": [
          "HVAC"
        ],
        "basePrice": 2335.0,
        "mass": 10.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmVent02Off": {
        "friendly": "Auto Air Vent (Off)",
        "short": "Auto-Vent",
        "category": [
          "HVAC"
        ],
        "basePrice": 2335.0,
        "mass": 10.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmVent02Open": {
        "friendly": "Auto Air Vent (Open)",
        "short": "Auto-Vent",
        "category": [
          "HVAC"
        ],
        "basePrice": 2335.0,
        "mass": 10.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmTable01": {
        "friendly": "Bar Table",
        "short": "Table",
        "category": [
          "Furniture"
        ],
        "basePrice": 213.0,
        "mass": 20.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmTable01Reserved": {
        "friendly": "Bar Table (Reserved)",
        "category": [
          "Furniture"
        ],
        "basePrice": 213.0,
        "mass": 20.0,
        "durability": 10.0,
        "source": "cooverlay"
      },
      "Plot_Merga_BarStainCOO": {
        "friendly": "Bartop With Strange Stain",
        "category": [
          "LuxuryGoods"
        ],
        "basePrice": 16849.0,
        "mass": 47.0,
        "durability": 10.0,
        "source": "cooverlay"
      },
      "ItmChargerBattDrill01": {
        "friendly": "Battery Charger: Gott",
        "short": "Battery Charger",
        "category": [
          "Electronics"
        ],
        "basePrice": 25.99,
        "mass": 0.55,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmChargerBattDrill01Dmg": {
        "friendly": "Battery Charger: Gott (Damaged)",
        "short": "Battery Charger",
        "category": [
          "Electronics"
        ],
        "basePrice": 6.5,
        "mass": 0.55,
        "durability": 19.0,
        "source": "condowner"
      },
      "ItmChargerBattDrill01Off": {
        "friendly": "Battery Charger: Gott (Off)",
        "short": "Battery Charger",
        "category": [
          "Electronics"
        ],
        "basePrice": 25.99,
        "mass": 0.55,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmChargerBattWelder01": {
        "friendly": "Battery Charger: Halvorson",
        "short": "Battery Charger",
        "category": [
          "Electronics"
        ],
        "basePrice": 24.49,
        "mass": 0.62,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmChargerBattWelder01Dmg": {
        "friendly": "Battery Charger: Halvorson (Damaged)",
        "short": "Battery Charger",
        "category": [
          "Electronics"
        ],
        "basePrice": 4.49,
        "mass": 0.62,
        "durability": 19.0,
        "source": "condowner"
      },
      "ItmChargerBattWelder01Off": {
        "friendly": "Battery Charger: Halvorson (Off)",
        "short": "Battery Charger",
        "category": [
          "Electronics"
        ],
        "basePrice": 24.49,
        "mass": 0.62,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmChargerBattEVA": {
        "friendly": "Battery Charging Station: Bingham-12 EVA",
        "short": "Battery Charger",
        "category": [
          "Electronics"
        ],
        "basePrice": 786.0,
        "mass": 25.0,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmChargerBattEVAOff": {
        "friendly": "Battery Charging Station: Bingham-12 EVA (Off)",
        "short": "Battery Charger",
        "category": [
          "Electronics"
        ],
        "basePrice": 786.0,
        "mass": 25.0,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmChargerBattEVADmg": {
        "friendly": "Battery Charging Station: Bingham-12 EVA (Off)",
        "short": "Battery Charger",
        "category": [
          "Electronics"
        ],
        "basePrice": 157.0,
        "mass": 25.0,
        "durability": 19.0,
        "source": "condowner"
      },
      "ItmChargerBattery04": {
        "friendly": "Battery Charging Station: Weber Laser",
        "short": "Battery Charger",
        "category": [
          "Electronics"
        ],
        "basePrice": 786.0,
        "mass": 25.0,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmChargerBattery04Dmg": {
        "friendly": "Battery Charging Station: Weber Laser (Damaged)",
        "short": "Battery Charger",
        "category": [
          "Electronics"
        ],
        "basePrice": 157.0,
        "mass": 25.0,
        "durability": 16.0,
        "source": "condowner"
      },
      "ItmChargerBattery04Off": {
        "friendly": "Battery Charging Station: Weber Laser (Off)",
        "short": "Battery Charger",
        "category": [
          "Electronics"
        ],
        "basePrice": 786.0,
        "mass": 25.0,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmBed02": {
        "friendly": "Bed",
        "category": [
          "Furniture"
        ],
        "basePrice": 457.0,
        "mass": 19.0,
        "durability": 18.0,
        "source": "condowner"
      },
      "ItmJukebox01": {
        "friendly": "Beydat \"Rock-It\" Jukebox (Dive Bar)",
        "short": "Jukebox",
        "category": [
          "Media"
        ],
        "basePrice": 553.0,
        "mass": 0.5,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmJukebox01Off": {
        "friendly": "Beydat \"Rock-It\" Jukebox (Off)",
        "short": "Jukebox",
        "category": [
          "Media"
        ],
        "basePrice": 553.0,
        "mass": 0.5,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmJukebox01None": {
        "friendly": "Beydat \"Rock-It\" Jukebox (Standby)",
        "short": "Jukebox",
        "category": [
          "Media"
        ],
        "basePrice": 553.0,
        "mass": 0.5,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmJukebox01b": {
        "friendly": "Beydat \"Rock-It\" Jukebox (Techno)",
        "short": "Jukebox",
        "category": [
          "Media"
        ],
        "basePrice": 553.0,
        "mass": 0.5,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmJukebox01c": {
        "friendly": "Beydat \"Rock-It\" Jukebox (Upscale)",
        "short": "Jukebox",
        "category": [
          "Media"
        ],
        "basePrice": 553.0,
        "mass": 0.5,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmShipWeaponMissileLauncher02": {
        "friendly": "BNW Missile Launcher",
        "short": "Missile Launcher",
        "category": [
          "Weapons"
        ],
        "basePrice": 93000.0,
        "mass": 230.0,
        "durability": 14.0,
        "source": "condowner"
      },
      "ItmShipWeaponMissileLauncher02Dmg": {
        "friendly": "BNW Missile Launcher (Damaged)",
        "short": "Missile Launcher",
        "category": [
          "Weapons"
        ],
        "basePrice": 18600.0,
        "mass": 230.0,
        "durability": 20.0,
        "source": "condowner"
      },
      "ItmShipWeaponMissileLauncher02Off": {
        "friendly": "BNW Missile Launcher (Off)",
        "short": "Missile Launcher",
        "category": [
          "Weapons"
        ],
        "basePrice": 93000.0,
        "mass": 230.0,
        "durability": 14.0,
        "source": "condowner"
      },
      "ItmPlanter2x101": {
        "friendly": "Bonsai Planter",
        "short": "Planter",
        "category": [
          "LuxuryGoods"
        ],
        "basePrice": 5252.0,
        "mass": 13.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmShipWeaponPDC02": {
        "friendly": "Brave New World '钟馗' CIWS",
        "short": "PDC",
        "category": [
          "Weapons"
        ],
        "basePrice": 40000.0,
        "mass": 40.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmShipWeaponPDC02Dmg": {
        "friendly": "Brave New World '钟馗' CIWS (Damaged)",
        "short": "PDC",
        "category": [
          "Weapons"
        ],
        "basePrice": 8000.0,
        "mass": 40.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmShipWeaponPDC02Off": {
        "friendly": "Brave New World '钟馗' CIWS (Off)",
        "short": "PDC",
        "category": [
          "Weapons"
        ],
        "basePrice": 40000.0,
        "mass": 40.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmStorageBin1x102": {
        "friendly": "Bulkhead Bin",
        "category": [
          "Furniture"
        ],
        "basePrice": 774.0,
        "mass": 7.0,
        "durability": 5.0,
        "source": "cooverlay"
      },
      "ItmStorageBin1x102b": {
        "friendly": "Bulkhead Bin",
        "category": [
          "Furniture"
        ],
        "basePrice": 774.0,
        "mass": 7.0,
        "durability": 5.0,
        "source": "cooverlay"
      },
      "ItmStorageBin1x103": {
        "friendly": "Bulkhead Bin",
        "category": [
          "Furniture"
        ],
        "basePrice": 774.0,
        "mass": 7.0,
        "durability": 5.0,
        "source": "cooverlay"
      },
      "ItmStorageBin1x101": {
        "friendly": "Bulkhead Bin",
        "short": "Bin",
        "category": [
          "Furniture"
        ],
        "basePrice": 774.0,
        "mass": 7.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmStorageBin1x102Dmg": {
        "friendly": "Bulkhead Bin (Damaged)",
        "category": [
          "Furniture"
        ],
        "basePrice": 121.0,
        "mass": 7.0,
        "durability": 10.0,
        "source": "cooverlay"
      },
      "ItmStorageBin1x102bDmg": {
        "friendly": "Bulkhead Bin (Damaged)",
        "category": [
          "Furniture"
        ],
        "basePrice": 121.0,
        "mass": 7.0,
        "durability": 10.0,
        "source": "cooverlay"
      },
      "ItmStorageBin1x103Dmg": {
        "friendly": "Bulkhead Bin (Damaged)",
        "category": [
          "Furniture"
        ],
        "basePrice": 121.0,
        "mass": 7.0,
        "durability": 10.0,
        "source": "cooverlay"
      },
      "ItmStorageBin1x101Dmg": {
        "friendly": "Bulkhead Bin (Damaged)",
        "short": "Bin",
        "category": [
          "Furniture"
        ],
        "basePrice": 121.0,
        "mass": 7.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmStorageBin2x102": {
        "friendly": "Bulkhead Bin 2x",
        "category": [
          "Furniture"
        ],
        "basePrice": 882.0,
        "mass": 14.0,
        "durability": 10.0,
        "source": "cooverlay"
      },
      "ItmStorageBin2x103": {
        "friendly": "Bulkhead Bin 2x",
        "category": [
          "Furniture"
        ],
        "basePrice": 882.0,
        "mass": 14.0,
        "durability": 10.0,
        "source": "cooverlay"
      },
      "ItmStorageBin2x104": {
        "friendly": "Bulkhead Bin 2x",
        "short": "Bin",
        "category": [
          "Furniture"
        ],
        "basePrice": 1482.0,
        "mass": 18.0,
        "durability": 15.0,
        "source": "condowner"
      },
      "ItmStorageBin2x101": {
        "friendly": "Bulkhead Bin 2x",
        "short": "Bin",
        "category": [
          "Furniture"
        ],
        "basePrice": 882.0,
        "mass": 14.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmStorageBin2x102Dmg": {
        "friendly": "Bulkhead Bin 2x (Damaged)",
        "category": [
          "Furniture"
        ],
        "basePrice": 197.0,
        "mass": 14.0,
        "durability": 20.0,
        "source": "cooverlay"
      },
      "ItmStorageBin2x103Dmg": {
        "friendly": "Bulkhead Bin 2x (Damaged)",
        "category": [
          "Furniture"
        ],
        "basePrice": 197.0,
        "mass": 14.0,
        "durability": 20.0,
        "source": "cooverlay"
      },
      "ItmStorageBin2x104Dmg": {
        "friendly": "Bulkhead Bin 2x (Damaged)",
        "short": "Bin",
        "category": [
          "Furniture"
        ],
        "basePrice": 267.0,
        "mass": 18.0,
        "durability": 25.0,
        "source": "condowner"
      },
      "ItmStorageBin2x101Dmg": {
        "friendly": "Bulkhead Bin 2x (Damaged)",
        "short": "Bin",
        "category": [
          "Furniture"
        ],
        "basePrice": 197.0,
        "mass": 14.0,
        "durability": 20.0,
        "source": "condowner"
      },
      "ItmStorageBin3x102": {
        "friendly": "Bulkhead Bin 3x",
        "category": [
          "Furniture"
        ],
        "basePrice": 1012.0,
        "mass": 21.0,
        "durability": 15.0,
        "source": "cooverlay"
      },
      "ItmStorageBin3x101": {
        "friendly": "Bulkhead Bin 3x",
        "short": "Bin",
        "category": [
          "Furniture"
        ],
        "basePrice": 1012.0,
        "mass": 21.0,
        "durability": 15.0,
        "source": "condowner"
      },
      "ItmStorageBin3x102Dmg": {
        "friendly": "Bulkhead Bin 3x (Damaged)",
        "category": [
          "Furniture"
        ],
        "basePrice": 274.0,
        "mass": 21.0,
        "durability": 30.0,
        "source": "cooverlay"
      },
      "ItmStorageBin3x101Dmg": {
        "friendly": "Bulkhead Bin 3x (Damaged)",
        "short": "Bin",
        "category": [
          "Furniture"
        ],
        "basePrice": 274.0,
        "mass": 21.0,
        "durability": 30.0,
        "source": "condowner"
      },
      "ItmStorageBin2x2C02": {
        "friendly": "Bulkhead Bin: Corner",
        "category": [
          "Furniture"
        ],
        "basePrice": 1024.0,
        "mass": 21.0,
        "durability": 15.0,
        "source": "cooverlay"
      },
      "ItmStorageBin2x2C03": {
        "friendly": "Bulkhead Bin: Corner",
        "category": [
          "Furniture"
        ],
        "basePrice": 1024.0,
        "mass": 21.0,
        "durability": 15.0,
        "source": "cooverlay"
      },
      "ItmStorageBin2x2C04": {
        "friendly": "Bulkhead Bin: Corner",
        "short": "Bin",
        "category": [
          "Furniture"
        ],
        "basePrice": 1824.0,
        "mass": 27.0,
        "durability": 20.0,
        "source": "condowner"
      },
      "ItmStorageBin2x2C01": {
        "friendly": "Bulkhead Bin: Corner",
        "short": "Bin",
        "category": [
          "Furniture"
        ],
        "basePrice": 1024.0,
        "mass": 21.0,
        "durability": 15.0,
        "source": "condowner"
      },
      "ItmStorageBin2x2C02Dmg": {
        "friendly": "Bulkhead Bin: Corner (Damaged)",
        "category": [
          "Furniture"
        ],
        "basePrice": 292.0,
        "mass": 21.0,
        "durability": 30.0,
        "source": "cooverlay"
      },
      "ItmStorageBin2x2C03Dmg": {
        "friendly": "Bulkhead Bin: Corner (Damaged)",
        "category": [
          "Furniture"
        ],
        "basePrice": 292.0,
        "mass": 21.0,
        "durability": 30.0,
        "source": "cooverlay"
      },
      "ItmStorageBin2x2C04Dmg": {
        "friendly": "Bulkhead Bin: Corner (Damaged)",
        "short": "Bin",
        "category": [
          "Furniture"
        ],
        "basePrice": 392.0,
        "mass": 27.0,
        "durability": 30.0,
        "source": "condowner"
      },
      "ItmStorageBin2x2C01Dmg": {
        "friendly": "Bulkhead Bin: Corner (Damaged)",
        "short": "Bin",
        "category": [
          "Furniture"
        ],
        "basePrice": 292.0,
        "mass": 21.0,
        "durability": 30.0,
        "source": "condowner"
      },
      "ItmKioskJobs01": {
        "friendly": "Career Kiosk",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 15.0,
        "durability": 70.0,
        "source": "condowner"
      },
      "ItmKioskCargo01BCER": {
        "friendly": "Cargo Kiosk (BCER)",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmKioskCargo01BCRS": {
        "friendly": "Cargo Kiosk (BCRS)",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmKioskCargo01EJDR": {
        "friendly": "Cargo Kiosk (EJDR)",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmKioskCargo01HQCH": {
        "friendly": "Cargo Kiosk (HQCH)",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmKioskCargo01JATL": {
        "friendly": "Cargo Kiosk (JATL)",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmKioskCargo01JFTS": {
        "friendly": "Cargo Kiosk (JFTS)",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmKioskCargo01JPTN": {
        "friendly": "Cargo Kiosk (JPTN)",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmKioskCargo01MHNG": {
        "friendly": "Cargo Kiosk (MHNG)",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmKioskCargo01MLAB": {
        "friendly": "Cargo Kiosk (MLAB)",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmKioskCargo01MSUZ": {
        "friendly": "Cargo Kiosk (MSUZ)",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmKioskCargo01MTRS": {
        "friendly": "Cargo Kiosk (MTRS)",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmKioskCargo01MVOL": {
        "friendly": "Cargo Kiosk (MVOL)",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmKioskCargo01OFLT": {
        "friendly": "Cargo Kiosk (OFLT)",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmKioskCargo01OKLG": {
        "friendly": "Cargo Kiosk (OKLG)",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmKioskCargo01SVIR": {
        "friendly": "Cargo Kiosk (SVIR)",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmKioskCargo01VCBR": {
        "friendly": "Cargo Kiosk (VCBR)",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmKioskCargo01VENC": {
        "friendly": "Cargo Kiosk (VENC)",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmKioskCargo01VNCA": {
        "friendly": "Cargo Kiosk (VNCA)",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmKioskCargo01VORB": {
        "friendly": "Cargo Kiosk (VORB)",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoLift01": {
        "friendly": "Cargo Lift",
        "category": [
          "Misc"
        ],
        "basePrice": 55752.0,
        "mass": 3100.0,
        "durability": 250.0,
        "source": "condowner"
      },
      "ItmCargoPod01": {
        "friendly": "Cargo Pod",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 5000.0,
        "mass": 50.0,
        "durability": 50.0,
        "source": "condowner"
      },
      "ItmCargoPod01Dmg": {
        "friendly": "Cargo Pod (Damaged)",
        "short": "Cargo Pod",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 1000.0,
        "mass": 50.0,
        "durability": 50.0,
        "source": "condowner"
      },
      "ItmCargoPodClimate01Dmg": {
        "friendly": "Cargo Pod Frame: Climate-Controlled (Damaged)",
        "short": "Cargo Frame",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 2400.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "condowner"
      },
      "ItmCargoPodClimate01": {
        "friendly": "Cargo Pod: Climate-controlled",
        "short": "Cargo Pod",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 12000.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "condowner"
      },
      "ItmCargoPodRad01": {
        "friendly": "Cargo Pod: Radiation-shielded",
        "short": "Cargo Pod",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 12000.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "condowner"
      },
      "ItmCargoPodRad01Dmg": {
        "friendly": "Cargo Pod: Radiation-shielded (Damaged)",
        "short": "Cargo Pod",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 2400.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "condowner"
      },
      "ItmCargoPodSpec01": {
        "friendly": "Cargo Pod: Specialty",
        "short": "Cargo Pod",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 20000.0,
        "mass": 50.0,
        "durability": 80.0,
        "source": "condowner"
      },
      "ItmCargoPodSpec01Dmg": {
        "friendly": "Cargo Pod: Specialty (Damaged)",
        "short": "Cargo Pod",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 4000.0,
        "mass": 50.0,
        "durability": 80.0,
        "source": "condowner"
      },
      "ItmKioskCargo01": {
        "friendly": "Cargo Trade Kiosk",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "condowner"
      },
      "ItmCargoWeb01": {
        "friendly": "Cargo Web",
        "category": [
          "Hull"
        ],
        "basePrice": 174.0,
        "mass": 2.5,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmCargoWeb01Dmg": {
        "friendly": "Cargo Web (Damaged)",
        "short": "Cargo Web",
        "category": [
          "Hull"
        ],
        "basePrice": 121.0,
        "mass": 2.5,
        "durability": 7.0,
        "source": "condowner"
      },
      "ItmChair02": {
        "friendly": "Chair",
        "category": [
          "Furniture"
        ],
        "basePrice": 85.0,
        "mass": 11.0,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmChair02Dmg": {
        "friendly": "Chair (Damaged)",
        "short": "Chair",
        "category": [
          "Furniture"
        ],
        "basePrice": 17.0,
        "mass": 9.0,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmBartop01": {
        "friendly": "Cherry Wood Bartop",
        "short": "Bartop",
        "category": [
          "LuxuryGoods"
        ],
        "basePrice": 13149.0,
        "mass": 244.0,
        "durability": 15.0,
        "source": "condowner"
      },
      "ItmBartop02": {
        "friendly": "Cherry Wood Bartop",
        "short": "Bartop",
        "category": [
          "LuxuryGoods"
        ],
        "basePrice": 13149.0,
        "mass": 47.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmBartop03": {
        "friendly": "Cherry Wood Bartop Corner",
        "short": "Bar Corner",
        "category": [
          "LuxuryGoods"
        ],
        "basePrice": 16849.0,
        "mass": 47.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmAtmoScrubber01": {
        "friendly": "CO2 AtmoScrubber",
        "short": "CO2 Scrubber",
        "category": [
          "HVAC"
        ],
        "basePrice": 14326.0,
        "mass": 46.5,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmAtmoScrubber01Dmg": {
        "friendly": "CO2 AtmoScrubber (Damaged)",
        "short": "CO2 Scrubber",
        "category": [
          "HVAC"
        ],
        "basePrice": 1845.0,
        "mass": 46.5,
        "durability": 15.0,
        "source": "condowner"
      },
      "ItmAtmoScrubber01Off": {
        "friendly": "CO2 AtmoScrubber (Off)",
        "short": "CO2 Scrubber",
        "category": [
          "HVAC"
        ],
        "basePrice": 14326.0,
        "mass": 46.5,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmRTACO2": {
        "friendly": "CO2 Canister",
        "short": "CO2 Can",
        "category": [
          "LifeSupport"
        ],
        "basePrice": 410.0,
        "mass": 115.0,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmRTACO2Dmg": {
        "friendly": "CO2 Canister (Damaged)",
        "short": "CO2 Can",
        "category": [
          "LifeSupport"
        ],
        "basePrice": 53.0,
        "mass": 115.0,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmAlarmCO2OnG": {
        "friendly": "CO2 Pressure Alarm",
        "short": "CO2 Alarm",
        "category": [
          "Sensors"
        ],
        "basePrice": 634.0,
        "mass": 0.5,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmAlarmCO2OnR": {
        "friendly": "CO2 Pressure Alarm (Alert)",
        "short": "CO2 Alarm",
        "category": [
          "Sensors"
        ],
        "basePrice": 634.0,
        "mass": 0.5,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmAlarmCO2Dmg": {
        "friendly": "CO2 Pressure Alarm (Damaged)",
        "short": "CO2 Alarm",
        "category": [
          "Sensors"
        ],
        "basePrice": 121.0,
        "mass": 0.5,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmAlarmCO2Off": {
        "friendly": "CO2 Pressure Alarm (Off)",
        "short": "CO2 Alarm",
        "category": [
          "Sensors"
        ],
        "basePrice": 634.0,
        "mass": 0.5,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmAlarmCO2OnY": {
        "friendly": "CO2 Pressure Alarm (Warning)",
        "short": "CO2 Alarm",
        "category": [
          "Sensors"
        ],
        "basePrice": 634.0,
        "mass": 0.5,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmVendingMachineCoffee": {
        "friendly": "Coffee Machine",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 2485.0,
        "mass": 31.0,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmShipWeaponMassThrower01Off": {
        "friendly": "Coilgun",
        "basePrice": 25000.0,
        "mass": 200.0,
        "durability": 18.0,
        "source": "condowner"
      },
      "ItmShipWeaponMassThrower01": {
        "friendly": "Coilgun",
        "basePrice": 25000.0,
        "mass": 200.0,
        "durability": 18.0,
        "source": "condowner"
      },
      "ItmShipWeaponMassThrower01Dmg": {
        "friendly": "Coilgun (Damaged)",
        "short": "Coilgun",
        "basePrice": 5000.0,
        "mass": 200.0,
        "durability": 23.0,
        "source": "condowner"
      },
      "ItmBattery02b": {
        "friendly": "Compact S Ship Battery",
        "short": "Battery",
        "category": [
          "Electronics"
        ],
        "basePrice": 1575.0,
        "mass": 27.0,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmBattery02bDmg": {
        "friendly": "Compact S Ship Battery (Damaged)",
        "short": "Battery",
        "category": [
          "Electronics"
        ],
        "basePrice": 390.0,
        "mass": 27.0,
        "durability": 18.0,
        "source": "condowner"
      },
      "ItmTable03": {
        "friendly": "Conference Table",
        "category": [
          "Furniture"
        ],
        "basePrice": 213.0,
        "mass": 20.0,
        "durability": 10.0,
        "source": "cooverlay"
      },
      "ItmAtmoScrubber02": {
        "friendly": "Contaminant AtmoScrubber",
        "short": "Contaminant Scrubber",
        "category": [
          "HVAC"
        ],
        "basePrice": 4226.0,
        "mass": 10.5,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmAtmoScrubber02Dmg": {
        "friendly": "Contaminant AtmoScrubber (Damaged)",
        "short": "Contaminant Scrubber",
        "category": [
          "HVAC"
        ],
        "basePrice": 845.0,
        "mass": 10.5,
        "durability": 15.0,
        "source": "condowner"
      },
      "ItmAtmoScrubber02Off": {
        "friendly": "Contaminant AtmoScrubber (Off)",
        "short": "Contaminant Scrubber",
        "category": [
          "HVAC"
        ],
        "basePrice": 4226.0,
        "mass": 10.5,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmAlarmContaminantsOnG": {
        "friendly": "Contaminants Pressure Alarm",
        "short": "Contaminants Alarm",
        "category": [
          "Sensors"
        ],
        "basePrice": 634.0,
        "mass": 0.5,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmAlarmContaminantsOnR": {
        "friendly": "Contaminants Pressure Alarm (Alert)",
        "short": "Contaminants Alarm",
        "category": [
          "Sensors"
        ],
        "basePrice": 634.0,
        "mass": 0.5,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmAlarmContaminantsDmg": {
        "friendly": "Contaminants Pressure Alarm (Damaged)",
        "short": "Contaminants Alarm",
        "category": [
          "Sensors"
        ],
        "basePrice": 121.0,
        "mass": 0.5,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmAlarmContaminantsOff": {
        "friendly": "Contaminants Pressure Alarm (Off)",
        "short": "Contaminants Alarm",
        "category": [
          "Sensors"
        ],
        "basePrice": 634.0,
        "mass": 0.5,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmCooler01On": {
        "friendly": "Cooler",
        "category": [
          "HVAC"
        ],
        "basePrice": 7360.0,
        "mass": 130.0,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmCooler01Dmg": {
        "friendly": "Cooler (Damaged)",
        "short": "Cooler",
        "category": [
          "HVAC"
        ],
        "basePrice": 1340.0,
        "mass": 130.0,
        "durability": 7.0,
        "source": "condowner"
      },
      "ItmCooler01Off": {
        "friendly": "Cooler (Off)",
        "short": "Cooler",
        "category": [
          "HVAC"
        ],
        "basePrice": 7360.0,
        "mass": 130.0,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmCouch01": {
        "friendly": "Couch",
        "category": [
          "Furniture"
        ],
        "basePrice": 889.0,
        "mass": 70.0,
        "durability": 8.0,
        "source": "condowner"
      },
      "ItmFusionCryoPump01": {
        "friendly": "Cryo Distribution Pump",
        "short": "Cryo Pump",
        "category": [
          "FusionParts"
        ],
        "basePrice": 1692.0,
        "mass": 28.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmFusionCryoPump01Dmg": {
        "friendly": "Cryo Distribution Pump (Damaged)",
        "short": "Cryo Pump",
        "category": [
          "FusionParts"
        ],
        "basePrice": 355.0,
        "mass": 28.0,
        "durability": 15.0,
        "source": "condowner"
      },
      "ItmFusionCryoPump01Off": {
        "friendly": "Cryo Distribution Pump (Off)",
        "short": "Cryo Pump",
        "category": [
          "FusionParts"
        ],
        "basePrice": 1692.0,
        "mass": 28.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmCanisterLHe01": {
        "friendly": "Cryo Reservoir",
        "short": "Cryo Tank",
        "category": [
          "FusionParts"
        ],
        "basePrice": 2542.0,
        "mass": 300.0,
        "durability": 40.0,
        "source": "condowner"
      },
      "ItmCanisterLH02": {
        "friendly": "D2O Canister",
        "short": "D2O Tank",
        "category": [
          "FusionParts"
        ],
        "basePrice": 6542.0,
        "mass": 1500.0,
        "durability": 40.0,
        "source": "condowner"
      },
      "ItmTable02": {
        "friendly": "Dining Table",
        "short": "Table",
        "category": [
          "Furniture"
        ],
        "basePrice": 64.0,
        "mass": 20.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmSwitch02Off": {
        "friendly": "Dock Access Manual Override Switch (Off)",
        "short": "Dock Access Override Switch",
        "category": [
          "Electronics"
        ],
        "basePrice": 66.5,
        "mass": 12.0,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmKiosk01": {
        "friendly": "Docking and Refuel Services",
        "short": "Kiosk: Fuel",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "condowner"
      },
      "ItmKioskEmbassy01BCRS": {
        "friendly": "Embassy Services: CCRE, Ceres",
        "short": "Kiosk: CCRE Embassy",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 15.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmKioskEmbassy01VENC": {
        "friendly": "Embassy Services: Encantado, Venus",
        "short": "Kiosk: VENC Embassy",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 15.0,
        "durability": 70.0,
        "source": "condowner"
      },
      "ItmKioskEmbassy01BCER": {
        "friendly": "Embassy Services: Galilean Confederacy, Ceres",
        "short": "Kiosk: GalCon Embassy",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 15.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmKioskEmbassy01OKLG": {
        "friendly": "Embassy Services: K-Leg, 1036-Ganymed",
        "short": "Kiosk: K-Leg Embassy",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 15.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmKioskEmbassy01VNCA": {
        "friendly": "Embassy Services: Newcal, Venus",
        "short": "Kiosk: Newcal Embassy",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 15.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmFactionKiosk01BCRS": {
        "friendly": "Faction Kiosk (CCRE)",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmFactionKiosk01BCER": {
        "friendly": "Faction Kiosk (GalFed)",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmKioskGovt01": {
        "friendly": "Faction Supplies Kiosk",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "condowner"
      },
      "ItmKioskVote01": {
        "friendly": "Feature Vote Kiosk",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "condowner"
      },
      "ItmKioskFerry01": {
        "friendly": "Ferry Services",
        "short": "Kiosk: Ferry",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "condowner"
      },
      "ItmKioskFlotillaScrap01": {
        "friendly": "Flotilla Scrap Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "condowner"
      },
      "ItmFridge01": {
        "friendly": "Fridge",
        "category": [
          "Furniture"
        ],
        "basePrice": 774.0,
        "mass": 31.0,
        "durability": 15.0,
        "source": "condowner"
      },
      "ItmFridge01Dmg": {
        "friendly": "Fridge (Damaged)",
        "short": "Fridge",
        "category": [
          "Furniture"
        ],
        "basePrice": 121.0,
        "mass": 31.0,
        "durability": 45.0,
        "source": "condowner"
      },
      "ItmStrengthTrainer01": {
        "friendly": "Functional Load Exercise eXosystem (FLEX)",
        "short": "Strength Trainer",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 12300.0,
        "mass": 310.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmStrengthTrainer01Dmg": {
        "friendly": "Functional Load Exercise eXosystem (FLEX) (Damaged)",
        "short": "Strength Trainer",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 400.0,
        "mass": 310.0,
        "durability": 12.0,
        "source": "condowner"
      },
      "ItmStrengthTrainer01Off": {
        "friendly": "Functional Load Exercise eXosystem (FLEX) (Off)",
        "short": "Strength Trainer",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 12300.0,
        "mass": 310.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmStrengthTrainer01Active": {
        "friendly": "Functional Load Exercise eXosystem (FLEX) (Running)",
        "short": "Strength Trainer",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 12300.0,
        "mass": 310.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmKioskFurnishings01": {
        "friendly": "Furnishings Kiosk",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "condowner"
      },
      "TraderFurnishingsKioskBCER": {
        "friendly": "Furnishings Kiosk (BCER)",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "TraderFurnishingsKioskBCRS": {
        "friendly": "Furnishings Kiosk (BCRS)",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmFusionFieldCoils01": {
        "friendly": "Fusion Field Coils Assembly",
        "short": "Field Coils",
        "category": [
          "FusionParts"
        ],
        "basePrice": 4740.0,
        "mass": 40.0,
        "durability": 20.0,
        "source": "condowner"
      },
      "ItmFusionFieldCoils01Dmg": {
        "friendly": "Fusion Field Coils Assembly (Damaged)",
        "short": "Field Coils",
        "category": [
          "FusionParts"
        ],
        "basePrice": 871.0,
        "mass": 40.0,
        "durability": 45.0,
        "source": "condowner"
      },
      "ItmFusionFieldCoils01Off": {
        "friendly": "Fusion Field Coils Assembly (Off)",
        "short": "Field Coils",
        "category": [
          "FusionParts"
        ],
        "basePrice": 4740.0,
        "mass": 40.0,
        "durability": 20.0,
        "source": "condowner"
      },
      "ItmCapacitor01": {
        "friendly": "Fusion-grade Laser Capacitor",
        "short": "Capacitor",
        "category": [
          "FusionParts"
        ],
        "basePrice": 12623.0,
        "mass": 45.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmCapacitor01Dmg": {
        "friendly": "Fusion-grade Laser Capacitor (Damaged)",
        "short": "Capacitor",
        "category": [
          "FusionParts"
        ],
        "basePrice": 3156.0,
        "mass": 45.0,
        "durability": 8.0,
        "source": "condowner"
      },
      "ItmCanister01": {
        "friendly": "Gas Canister",
        "short": "Canister",
        "category": [
          "LifeSupport"
        ],
        "basePrice": 410.0,
        "mass": 70.0,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmCanister01Dmg": {
        "friendly": "Gas Canister (Damaged)",
        "short": "Canister",
        "category": [
          "LifeSupport"
        ],
        "basePrice": 53.0,
        "mass": 70.0,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmKioskJobs02": {
        "friendly": "Gig Nexus Job Kiosk",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "condowner"
      },
      "ItmKioskJobs03": {
        "friendly": "Gig Nexus Job Kiosk",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 313.0,
        "durability": 70.0,
        "source": "condowner"
      },
      "ItmMeat01Altar": {
        "friendly": "Goat Altar",
        "short": "Altar",
        "category": [
          "LuxuryGoods"
        ],
        "basePrice": 13960.0,
        "mass": 66.6,
        "durability": 16.0,
        "source": "condowner"
      },
      "ItmRCSCluster01": {
        "friendly": "Halvorson RCS Thruster Assembly",
        "short": "Thruster",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 5520.0,
        "mass": 28.0,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmRCSCluster01Dmg": {
        "friendly": "Halvorson RCS Thruster Assembly (Damaged)",
        "short": "Thruster",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 1112.0,
        "mass": 28.0,
        "durability": 19.0,
        "source": "condowner"
      },
      "ItmRCSCluster01Off": {
        "friendly": "Halvorson RCS Thruster Assembly (Off)",
        "short": "Thruster",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 5520.0,
        "mass": 28.0,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmHeater01": {
        "friendly": "Heater",
        "category": [
          "HVAC"
        ],
        "basePrice": 2634.0,
        "mass": 31.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmHeater01Dmg": {
        "friendly": "Heater (Damaged)",
        "short": "Heater",
        "category": [
          "HVAC"
        ],
        "basePrice": 514.0,
        "mass": 31.0,
        "durability": 15.0,
        "source": "condowner"
      },
      "ItmHeater01Off": {
        "friendly": "Heater (Off)",
        "short": "Heater",
        "category": [
          "HVAC"
        ],
        "basePrice": 2634.0,
        "mass": 31.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmHeater02": {
        "friendly": "Heater Model B",
        "category": [
          "HVAC"
        ],
        "basePrice": 2634.0,
        "mass": 31.0,
        "durability": 5.0,
        "source": "cooverlay"
      },
      "ItmHeater02Dmg": {
        "friendly": "Heater Model B (Damaged)",
        "category": [
          "HVAC"
        ],
        "basePrice": 514.0,
        "mass": 31.0,
        "durability": 15.0,
        "source": "cooverlay"
      },
      "ItmHeater02Off": {
        "friendly": "Heater Model B (Off)",
        "category": [
          "HVAC"
        ],
        "basePrice": 2634.0,
        "mass": 31.0,
        "durability": 5.0,
        "source": "cooverlay"
      },
      "ItmHeavyLiftRotor01Dmg": {
        "friendly": "Heavy Lift Rotor (Damaged)",
        "short": "Heavy Lift Rotor",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 12914.0,
        "mass": 35.0,
        "durability": 30.0,
        "source": "condowner"
      },
      "ItmHeavyLiftRotor01Off": {
        "friendly": "Heavy Lift Rotor (Off)",
        "short": "Heavy Lift Rotor",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 56774.0,
        "mass": 40.0,
        "durability": 30.0,
        "source": "condowner"
      },
      "ItmHeavyLiftRotor01On": {
        "friendly": "Heavy Lift Rotor (On)",
        "short": "Heavy Lift Rotor",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 56774.0,
        "mass": 40.0,
        "durability": 30.0,
        "source": "condowner"
      },
      "ItmPlanter3x101": {
        "friendly": "Hedge Planter",
        "short": "Planter",
        "category": [
          "LuxuryGoods"
        ],
        "basePrice": 7878.0,
        "mass": 17.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmAeroParts3x301": {
        "friendly": "Hull Stabilizer",
        "short": "Stabilizer",
        "category": [
          "Hull"
        ],
        "basePrice": 1300.0,
        "mass": 40.0,
        "durability": 30.0,
        "source": "condowner"
      },
      "ItmAeroParts3x302": {
        "friendly": "Hull Stabilizer",
        "short": "Stabilizer",
        "category": [
          "Hull"
        ],
        "basePrice": 1300.0,
        "mass": 40.0,
        "durability": 30.0,
        "source": "condowner"
      },
      "ItmReactorIC03Dmg": {
        "friendly": "IC Fusion Reactor (Damaged)",
        "short": "Reactor",
        "category": [
          "FusionParts"
        ],
        "basePrice": 29000.0,
        "mass": 417.0,
        "durability": 75.0,
        "source": "condowner"
      },
      "ItmReactorIC03Off": {
        "friendly": "IC Fusion Reactor (Off)",
        "short": "Reactor",
        "category": [
          "FusionParts"
        ],
        "basePrice": 141000.0,
        "mass": 417.0,
        "durability": 25.0,
        "source": "condowner"
      },
      "ItmReactorIC03Ignition": {
        "friendly": "IC Fusion Reactor (Running)",
        "short": "Reactor",
        "category": [
          "FusionParts"
        ],
        "basePrice": 141000.0,
        "mass": 417.0,
        "durability": 25.0,
        "source": "condowner"
      },
      "ItmFusionReactorCore01Dmg": {
        "friendly": "IC Fusion Reactor Core: Sulaiman \"X(X) TW\" (Damaged)",
        "short": "Reactor Core",
        "category": [
          "FusionParts"
        ],
        "basePrice": 8200.0,
        "mass": 417.0,
        "durability": 75.0,
        "source": "condowner"
      },
      "ItmFusionReactorCore01Off": {
        "friendly": "IC Fusion Reactor Core: Sulaiman \"X(X) TW\" (Off)",
        "short": "Reactor Core",
        "category": [
          "FusionParts"
        ],
        "basePrice": 41000.0,
        "mass": 417.0,
        "durability": 25.0,
        "source": "condowner"
      },
      "ItmFusionReactorCore01Ignition": {
        "friendly": "IC Fusion Reactor Core: Sulaiman \"X(X) TW\" (Running)",
        "short": "Reactor Core",
        "category": [
          "FusionParts"
        ],
        "basePrice": 41000.0,
        "mass": 417.0,
        "durability": 25.0,
        "source": "condowner"
      },
      "ItmReactorIC02Ignition": {
        "friendly": "IC Fusion Reactor: Station",
        "short": "Reactor",
        "category": [
          "FusionParts"
        ],
        "basePrice": 141000.0,
        "mass": 417.0,
        "durability": 120.0,
        "source": "condowner"
      },
      "ItmReactorIC02Off": {
        "friendly": "IC Fusion Reactor: Station (Off)",
        "short": "Reactor",
        "category": [
          "FusionParts"
        ],
        "basePrice": 141000.0,
        "mass": 417.0,
        "durability": 120.0,
        "source": "condowner"
      },
      "ItmCargoPod02": {
        "friendly": "ItmCargoPod02",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 5000.0,
        "mass": 50.0,
        "durability": 50.0,
        "source": "cooverlay"
      },
      "ItmCargoPod02Dmg": {
        "friendly": "ItmCargoPod02Dmg",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 1000.0,
        "mass": 50.0,
        "durability": 50.0,
        "source": "cooverlay"
      },
      "ItmCargoPod03": {
        "friendly": "ItmCargoPod03",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 5000.0,
        "mass": 50.0,
        "durability": 50.0,
        "source": "cooverlay"
      },
      "ItmCargoPod03Dmg": {
        "friendly": "ItmCargoPod03Dmg",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 1000.0,
        "mass": 50.0,
        "durability": 50.0,
        "source": "cooverlay"
      },
      "ItmCargoPod04": {
        "friendly": "ItmCargoPod04",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 5000.0,
        "mass": 50.0,
        "durability": 50.0,
        "source": "cooverlay"
      },
      "ItmCargoPod04Dmg": {
        "friendly": "ItmCargoPod04Dmg",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 1000.0,
        "mass": 50.0,
        "durability": 50.0,
        "source": "cooverlay"
      },
      "ItmCargoPod05": {
        "friendly": "ItmCargoPod05",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 5000.0,
        "mass": 50.0,
        "durability": 50.0,
        "source": "cooverlay"
      },
      "ItmCargoPod05Dmg": {
        "friendly": "ItmCargoPod05Dmg",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 1000.0,
        "mass": 50.0,
        "durability": 50.0,
        "source": "cooverlay"
      },
      "ItmCargoPod06": {
        "friendly": "ItmCargoPod06",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 5000.0,
        "mass": 50.0,
        "durability": 50.0,
        "source": "cooverlay"
      },
      "ItmCargoPod06Dmg": {
        "friendly": "ItmCargoPod06Dmg",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 1000.0,
        "mass": 50.0,
        "durability": 50.0,
        "source": "cooverlay"
      },
      "ItmCargoPod07": {
        "friendly": "ItmCargoPod07",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 5000.0,
        "mass": 50.0,
        "durability": 50.0,
        "source": "cooverlay"
      },
      "ItmCargoPod07Dmg": {
        "friendly": "ItmCargoPod07Dmg",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 1000.0,
        "mass": 50.0,
        "durability": 50.0,
        "source": "cooverlay"
      },
      "ItmCargoPod08": {
        "friendly": "ItmCargoPod08",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 5000.0,
        "mass": 50.0,
        "durability": 50.0,
        "source": "cooverlay"
      },
      "ItmCargoPod08Dmg": {
        "friendly": "ItmCargoPod08Dmg",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 1000.0,
        "mass": 50.0,
        "durability": 50.0,
        "source": "cooverlay"
      },
      "ItmCargoPod09": {
        "friendly": "ItmCargoPod09",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 5000.0,
        "mass": 50.0,
        "durability": 50.0,
        "source": "cooverlay"
      },
      "ItmCargoPod09Dmg": {
        "friendly": "ItmCargoPod09Dmg",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 1000.0,
        "mass": 50.0,
        "durability": 50.0,
        "source": "cooverlay"
      },
      "ItmCargoPod10": {
        "friendly": "ItmCargoPod10",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 5000.0,
        "mass": 50.0,
        "durability": 50.0,
        "source": "cooverlay"
      },
      "ItmCargoPod10Dmg": {
        "friendly": "ItmCargoPod10Dmg",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 1000.0,
        "mass": 50.0,
        "durability": 50.0,
        "source": "cooverlay"
      },
      "ItmCargoPod11": {
        "friendly": "ItmCargoPod11",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 5000.0,
        "mass": 50.0,
        "durability": 50.0,
        "source": "cooverlay"
      },
      "ItmCargoPod11Dmg": {
        "friendly": "ItmCargoPod11Dmg",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 1000.0,
        "mass": 50.0,
        "durability": 50.0,
        "source": "cooverlay"
      },
      "ItmCargoPodClimate02": {
        "friendly": "ItmCargoPodClimate02",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 12000.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodClimate02Dmg": {
        "friendly": "ItmCargoPodClimate02Dmg",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 2400.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodClimate03": {
        "friendly": "ItmCargoPodClimate03",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 12000.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodClimate03Dmg": {
        "friendly": "ItmCargoPodClimate03Dmg",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 2400.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodClimate04": {
        "friendly": "ItmCargoPodClimate04",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 12000.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodClimate04Dmg": {
        "friendly": "ItmCargoPodClimate04Dmg",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 2400.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodClimate05": {
        "friendly": "ItmCargoPodClimate05",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 12000.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodClimate05Dmg": {
        "friendly": "ItmCargoPodClimate05Dmg",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 2400.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodClimate06": {
        "friendly": "ItmCargoPodClimate06",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 12000.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodClimate06Dmg": {
        "friendly": "ItmCargoPodClimate06Dmg",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 2400.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodClimate07": {
        "friendly": "ItmCargoPodClimate07",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 12000.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodClimate07Dmg": {
        "friendly": "ItmCargoPodClimate07Dmg",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 2400.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodClimate08": {
        "friendly": "ItmCargoPodClimate08",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 12000.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodClimate08Dmg": {
        "friendly": "ItmCargoPodClimate08Dmg",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 2400.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodClimate09": {
        "friendly": "ItmCargoPodClimate09",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 12000.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodClimate09Dmg": {
        "friendly": "ItmCargoPodClimate09Dmg",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 2400.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodClimate10": {
        "friendly": "ItmCargoPodClimate10",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 12000.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodClimate10Dmg": {
        "friendly": "ItmCargoPodClimate10Dmg",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 2400.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodClimate11": {
        "friendly": "ItmCargoPodClimate11",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 12000.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodClimate11Dmg": {
        "friendly": "ItmCargoPodClimate11Dmg",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 2400.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodRad02": {
        "friendly": "ItmCargoPodRad02",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 12000.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodRad02Dmg": {
        "friendly": "ItmCargoPodRad02Dmg",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 2400.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodRad03": {
        "friendly": "ItmCargoPodRad03",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 12000.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodRad03Dmg": {
        "friendly": "ItmCargoPodRad03Dmg",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 2400.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodRad04": {
        "friendly": "ItmCargoPodRad04",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 12000.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodRad04Dmg": {
        "friendly": "ItmCargoPodRad04Dmg",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 2400.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodRad05": {
        "friendly": "ItmCargoPodRad05",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 12000.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodRad05Dmg": {
        "friendly": "ItmCargoPodRad05Dmg",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 2400.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodRad06": {
        "friendly": "ItmCargoPodRad06",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 12000.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodRad06Dmg": {
        "friendly": "ItmCargoPodRad06Dmg",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 2400.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodRad07": {
        "friendly": "ItmCargoPodRad07",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 12000.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodRad07Dmg": {
        "friendly": "ItmCargoPodRad07Dmg",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 2400.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodRad08": {
        "friendly": "ItmCargoPodRad08",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 12000.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodRad08Dmg": {
        "friendly": "ItmCargoPodRad08Dmg",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 2400.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodRad09": {
        "friendly": "ItmCargoPodRad09",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 12000.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodRad09Dmg": {
        "friendly": "ItmCargoPodRad09Dmg",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 2400.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodRad10": {
        "friendly": "ItmCargoPodRad10",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 12000.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodRad10Dmg": {
        "friendly": "ItmCargoPodRad10Dmg",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 2400.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodRad11": {
        "friendly": "ItmCargoPodRad11",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 12000.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodRad11Dmg": {
        "friendly": "ItmCargoPodRad11Dmg",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 2400.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodSpec02": {
        "friendly": "ItmCargoPodSpec02",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 20000.0,
        "mass": 50.0,
        "durability": 80.0,
        "source": "cooverlay"
      },
      "ItmCargoPodSpec02Dmg": {
        "friendly": "ItmCargoPodSpec02Dmg",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 4000.0,
        "mass": 50.0,
        "durability": 80.0,
        "source": "cooverlay"
      },
      "ItmCargoPodSpec03": {
        "friendly": "ItmCargoPodSpec03",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 20000.0,
        "mass": 50.0,
        "durability": 80.0,
        "source": "cooverlay"
      },
      "ItmCargoPodSpec03Dmg": {
        "friendly": "ItmCargoPodSpec03Dmg",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 4000.0,
        "mass": 50.0,
        "durability": 80.0,
        "source": "cooverlay"
      },
      "ItmCargoPodSpec04": {
        "friendly": "ItmCargoPodSpec04",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 20000.0,
        "mass": 50.0,
        "durability": 80.0,
        "source": "cooverlay"
      },
      "ItmCargoPodSpec04Dmg": {
        "friendly": "ItmCargoPodSpec04Dmg",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 4000.0,
        "mass": 50.0,
        "durability": 80.0,
        "source": "cooverlay"
      },
      "ItmCargoPodSpec05": {
        "friendly": "ItmCargoPodSpec05",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 20000.0,
        "mass": 50.0,
        "durability": 80.0,
        "source": "cooverlay"
      },
      "ItmCargoPodSpec05Dmg": {
        "friendly": "ItmCargoPodSpec05Dmg",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 4000.0,
        "mass": 50.0,
        "durability": 80.0,
        "source": "cooverlay"
      },
      "ItmCargoPodSpec06": {
        "friendly": "ItmCargoPodSpec06",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 20000.0,
        "mass": 50.0,
        "durability": 80.0,
        "source": "cooverlay"
      },
      "ItmCargoPodSpec06Dmg": {
        "friendly": "ItmCargoPodSpec06Dmg",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 4000.0,
        "mass": 50.0,
        "durability": 80.0,
        "source": "cooverlay"
      },
      "ItmCargoPodSpec07": {
        "friendly": "ItmCargoPodSpec07",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 20000.0,
        "mass": 50.0,
        "durability": 80.0,
        "source": "cooverlay"
      },
      "ItmCargoPodSpec07Dmg": {
        "friendly": "ItmCargoPodSpec07Dmg",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 4000.0,
        "mass": 50.0,
        "durability": 80.0,
        "source": "cooverlay"
      },
      "ItmCargoPodSpec08": {
        "friendly": "ItmCargoPodSpec08",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 20000.0,
        "mass": 50.0,
        "durability": 80.0,
        "source": "cooverlay"
      },
      "ItmCargoPodSpec08Dmg": {
        "friendly": "ItmCargoPodSpec08Dmg",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 4000.0,
        "mass": 50.0,
        "durability": 80.0,
        "source": "cooverlay"
      },
      "ItmCargoPodSpec09": {
        "friendly": "ItmCargoPodSpec09",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 20000.0,
        "mass": 50.0,
        "durability": 80.0,
        "source": "cooverlay"
      },
      "ItmCargoPodSpec09Dmg": {
        "friendly": "ItmCargoPodSpec09Dmg",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 4000.0,
        "mass": 50.0,
        "durability": 80.0,
        "source": "cooverlay"
      },
      "ItmCargoPodSpec10": {
        "friendly": "ItmCargoPodSpec10",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 20000.0,
        "mass": 50.0,
        "durability": 80.0,
        "source": "cooverlay"
      },
      "ItmCargoPodSpec10Dmg": {
        "friendly": "ItmCargoPodSpec10Dmg",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 4000.0,
        "mass": 50.0,
        "durability": 80.0,
        "source": "cooverlay"
      },
      "ItmCargoPodSpec11": {
        "friendly": "ItmCargoPodSpec11",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 20000.0,
        "mass": 50.0,
        "durability": 80.0,
        "source": "cooverlay"
      },
      "ItmCargoPodSpec11Dmg": {
        "friendly": "ItmCargoPodSpec11Dmg",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 4000.0,
        "mass": 50.0,
        "durability": 80.0,
        "source": "cooverlay"
      },
      "ItmKioskComms01": {
        "friendly": "ItmKioskComms01",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 15.0,
        "durability": 70.0,
        "source": "condowner"
      },
      "ItmKioskTestudo01": {
        "friendly": "ItmKioskTestudo01",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "item"
      },
      "ItmPanelToggle4x": {
        "friendly": "ItmPanelToggle4x",
        "short": "4x Switch",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 290.0,
        "mass": 0.25,
        "durability": 8.0,
        "source": "condowner"
      },
      "ItmStrut1x1": {
        "friendly": "ItmStrut1x1",
        "short": "Strut",
        "category": [
          "Hull"
        ],
        "mass": 3.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmDoor02Closed": {
        "friendly": "Launch Area",
        "category": [
          "Hull"
        ],
        "basePrice": 73990.0,
        "mass": 2000.0,
        "durability": 80.0,
        "source": "condowner"
      },
      "ItmCanisterLHe02": {
        "friendly": "Liq. He Canister",
        "short": "He3 Tank",
        "category": [
          "FusionParts"
        ],
        "basePrice": 6542.0,
        "mass": 1500.0,
        "durability": 40.0,
        "source": "condowner"
      },
      "ItmPlanterMeat01": {
        "friendly": "Lit Meat Planter",
        "short": "Meat Planter",
        "category": [
          "LuxuryGoods"
        ],
        "basePrice": 15760.0,
        "mass": 305.0,
        "durability": 35.0,
        "source": "condowner"
      },
      "ItmPlanter01": {
        "friendly": "Lit Planter",
        "short": "Planter",
        "category": [
          "LuxuryGoods"
        ],
        "basePrice": 15760.0,
        "mass": 305.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmFusionMHDGenerator01": {
        "friendly": "Magnetohydrodynamic (MHD) Generator",
        "short": "MHD Generator",
        "category": [
          "FusionParts"
        ],
        "basePrice": 12623.0,
        "mass": 45.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmFusionMHDGenerator01Dmg": {
        "friendly": "Magnetohydrodynamic (MHD) Generator (Damaged)",
        "short": "MHD Generator",
        "category": [
          "FusionParts"
        ],
        "basePrice": 3156.0,
        "mass": 45.0,
        "durability": 8.0,
        "source": "condowner"
      },
      "ItmFusionMHDGenerator01Off": {
        "friendly": "Magnetohydrodynamic (MHD) Generator (Off)",
        "short": "MHD Generator",
        "category": [
          "FusionParts"
        ],
        "basePrice": 12623.0,
        "mass": 45.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmKioskOKLGFoodCart02": {
        "friendly": "Mai Suya Street Food Vendor",
        "short": "Suya Cart",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "condowner"
      },
      "ItmShipWeaponMassThrower03": {
        "friendly": "Mass Thrower",
        "category": [
          "Weapons"
        ],
        "basePrice": 15000.0,
        "mass": 300.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmShipWeaponMassThrower03Dmg": {
        "friendly": "Mass Thrower (Damaged)",
        "short": "Mass Thrower",
        "category": [
          "Weapons"
        ],
        "basePrice": 3000.0,
        "mass": 300.0,
        "durability": 8.0,
        "source": "condowner"
      },
      "ItmShipWeaponMassThrower03Off": {
        "friendly": "Mass Thrower (Off)",
        "short": "Mass Thrower",
        "category": [
          "Weapons"
        ],
        "basePrice": 15000.0,
        "mass": 300.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmKioskBCRSMed01": {
        "friendly": "Medical Kiosk (BCRS)",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmKioskSanDiegoMed01": {
        "friendly": "Medical Kiosk (VNCA)",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmBattery02c": {
        "friendly": "Mini XS Ship Battery",
        "short": "Battery",
        "category": [
          "Electronics"
        ],
        "basePrice": 944.0,
        "mass": 16.2,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmBattery02cDmg": {
        "friendly": "Mini XS Ship Battery (Damaged)",
        "short": "Battery",
        "category": [
          "Electronics"
        ],
        "basePrice": 234.0,
        "mass": 16.2,
        "durability": 11.0,
        "source": "condowner"
      },
      "ItmSensorEOIR01": {
        "friendly": "Miura Sensor: EO/IR",
        "short": "EO/IR Sensor",
        "category": [
          "Sensors"
        ],
        "basePrice": 43000.0,
        "mass": 10.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmSensorEOIR01Dmg": {
        "friendly": "Miura Sensor: EO/IR (Damaged)",
        "short": "EO/IR Sensor",
        "category": [
          "Sensors"
        ],
        "basePrice": 8600.0,
        "mass": 10.0,
        "durability": 8.0,
        "source": "condowner"
      },
      "ItmSensorEOIR01Off": {
        "friendly": "Miura Sensor: EO/IR (Off)",
        "short": "EO/IR Sensor",
        "category": [
          "Sensors"
        ],
        "basePrice": 43000.0,
        "mass": 10.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmPlanter2x202": {
        "friendly": "Monstera Planter",
        "short": "Planter",
        "category": [
          "LuxuryGoods"
        ],
        "basePrice": 10504.0,
        "mass": 21.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmRTAN2": {
        "friendly": "N2 Canister",
        "short": "N2 Can",
        "category": [
          "LifeSupport"
        ],
        "basePrice": 410.0,
        "mass": 115.0,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmRTAN2Dmg": {
        "friendly": "N2 Canister (Damaged)",
        "short": "N2 Can",
        "category": [
          "LifeSupport"
        ],
        "basePrice": 53.0,
        "mass": 115.0,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmAlarmN2OnG": {
        "friendly": "N2 Pressure Alarm",
        "short": "N2 Alarm",
        "category": [
          "Sensors"
        ],
        "basePrice": 541.0,
        "mass": 0.5,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmAlarmN2OnR": {
        "friendly": "N2 Pressure Alarm (Alert)",
        "short": "N2 Alarm",
        "category": [
          "Sensors"
        ],
        "basePrice": 541.0,
        "mass": 0.5,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmAlarmN2Dmg": {
        "friendly": "N2 Pressure Alarm (Damaged)",
        "short": "N2 Alarm",
        "category": [
          "Sensors"
        ],
        "basePrice": 105.0,
        "mass": 0.5,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmAlarmN2Off": {
        "friendly": "N2 Pressure Alarm (Off)",
        "short": "N2 Alarm",
        "category": [
          "Sensors"
        ],
        "basePrice": 541.0,
        "mass": 0.5,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmSensorEM01": {
        "friendly": "NASA Sensor: EM",
        "short": "EM Sensor",
        "category": [
          "Sensors"
        ],
        "basePrice": 3200.0,
        "mass": 5.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmSensorEM01Dmg": {
        "friendly": "NASA Sensor: EM (Damaged)",
        "short": "EM Sensor",
        "category": [
          "Sensors"
        ],
        "basePrice": 640.0,
        "mass": 5.0,
        "durability": 7.0,
        "source": "condowner"
      },
      "ItmSensorEM01Off": {
        "friendly": "NASA Sensor: EM (Off)",
        "short": "EM Sensor",
        "category": [
          "Sensors"
        ],
        "basePrice": 3200.0,
        "mass": 5.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmSensorIR01": {
        "friendly": "NASA Sensor: IR",
        "short": "IR Sensor",
        "category": [
          "Sensors"
        ],
        "basePrice": 12000.0,
        "mass": 5.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmSensorIR01Dmg": {
        "friendly": "NASA Sensor: IR (Damaged)",
        "short": "IR Sensor",
        "category": [
          "Sensors"
        ],
        "basePrice": 2400.0,
        "mass": 5.0,
        "durability": 7.0,
        "source": "condowner"
      },
      "ItmSensorIR01Off": {
        "friendly": "NASA Sensor: IR (Off)",
        "short": "IR Sensor",
        "category": [
          "Sensors"
        ],
        "basePrice": 12000.0,
        "mass": 5.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmSensorRadar01": {
        "friendly": "NASA Sensor: Radar",
        "short": "Radar",
        "category": [
          "Sensors"
        ],
        "basePrice": 30000.0,
        "mass": 130.0,
        "durability": 7.0,
        "source": "condowner"
      },
      "ItmSensorRadar01Dmg": {
        "friendly": "NASA Sensor: Radar (Damaged)",
        "short": "Radar",
        "category": [
          "Sensors"
        ],
        "basePrice": 600.0,
        "mass": 130.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmSensorRadar01Off": {
        "friendly": "NASA Sensor: Radar (Off)",
        "short": "Radar",
        "category": [
          "Sensors"
        ],
        "basePrice": 30000.0,
        "mass": 130.0,
        "durability": 7.0,
        "source": "condowner"
      },
      "ItmRTAO2": {
        "friendly": "O2 Canister",
        "short": "O2 Can",
        "category": [
          "LifeSupport"
        ],
        "basePrice": 410.0,
        "mass": 115.0,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmRTAO2Dmg": {
        "friendly": "O2 Canister (Damaged)",
        "short": "O2 Can",
        "category": [
          "LifeSupport"
        ],
        "basePrice": 53.0,
        "mass": 115.0,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmAlarmO2OnG": {
        "friendly": "O2 Pressure Alarm",
        "short": "O2 Alarm",
        "category": [
          "Sensors"
        ],
        "basePrice": 659.0,
        "mass": 0.5,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmAlarmO2OnR": {
        "friendly": "O2 Pressure Alarm (Alert)",
        "short": "O2 Alarm",
        "category": [
          "Sensors"
        ],
        "basePrice": 659.0,
        "mass": 0.5,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmAlarmO2Dmg": {
        "friendly": "O2 Pressure Alarm (Damaged)",
        "short": "O2 Alarm",
        "category": [
          "Sensors"
        ],
        "basePrice": 134.0,
        "mass": 0.5,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmAlarmO2Off": {
        "friendly": "O2 Pressure Alarm (Off)",
        "short": "O2 Alarm",
        "category": [
          "Sensors"
        ],
        "basePrice": 659.0,
        "mass": 0.5,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmKioskSupplies03": {
        "friendly": "OKLG Licensed Supply Kiosk",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "condowner"
      },
      "ItmKioskSupplies02": {
        "friendly": "OKLG Scrap Kiosk",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "condowner"
      },
      "ItmLitCeiling1x1": {
        "friendly": "Overhead Light: Blue",
        "short": "Light",
        "category": [
          "Hull"
        ],
        "basePrice": 583.0,
        "mass": 1.5,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmLitCeiling1x1Off": {
        "friendly": "Overhead Light: Blue (Off)",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 583.0,
        "mass": 1.5,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmLitCeiling1x1Custom": {
        "friendly": "Overhead Light: Blue Setting",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 2681.0,
        "mass": 1.5,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmLitCeiling1x1OffCustom": {
        "friendly": "Overhead Light: Blue Setting (Off)",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 2681.0,
        "mass": 1.5,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmLitCeiling1x1VibrantGreen": {
        "friendly": "Overhead Light: Green",
        "short": "Light",
        "category": [
          "Hull"
        ],
        "basePrice": 583.0,
        "mass": 1.5,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmLitCeiling1x1VibrantGreenOff": {
        "friendly": "Overhead Light: Green (Off)",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 583.0,
        "mass": 1.5,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmLitCeiling1x1VibrantGreenCustom": {
        "friendly": "Overhead Light: Green Setting",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 2681.0,
        "mass": 1.5,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmLitCeiling1x1VibrantGreenOffCustom": {
        "friendly": "Overhead Light: Green Setting (Off)",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 2681.0,
        "mass": 1.5,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmLitCeiling1x1Orange": {
        "friendly": "Overhead Light: Orange",
        "short": "Light",
        "category": [
          "Hull"
        ],
        "basePrice": 583.0,
        "mass": 1.5,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmLitCeiling1x1OrangeOff": {
        "friendly": "Overhead Light: Orange (Off)",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 583.0,
        "mass": 1.5,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmLitCeiling1x1OrangeCustom": {
        "friendly": "Overhead Light: Orange Setting",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 2681.0,
        "mass": 1.5,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmLitCeiling1x1OrangeOffCustom": {
        "friendly": "Overhead Light: Orange Setting (Off)",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 2681.0,
        "mass": 1.5,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmLitCeiling1x1VibrantPurple": {
        "friendly": "Overhead Light: Purple",
        "short": "Light",
        "category": [
          "Hull"
        ],
        "basePrice": 1779.79,
        "mass": 1.5,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmLitCeiling1x1VibrantPurpleOff": {
        "friendly": "Overhead Light: Purple (Off)",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 1779.79,
        "mass": 1.5,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmLitCeiling1x1VibrantPurpleCustom": {
        "friendly": "Overhead Light: Purple Setting",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 2681.0,
        "mass": 1.5,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmLitCeiling1x1VibrantPurpleOffCustom": {
        "friendly": "Overhead Light: Purple Setting (Off)",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 2681.0,
        "mass": 1.5,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmLitCeiling1x1VibrantRed": {
        "friendly": "Overhead Light: Red",
        "short": "Light",
        "category": [
          "Hull"
        ],
        "basePrice": 583.0,
        "mass": 1.5,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmLitCeiling1x1VibrantRedOff": {
        "friendly": "Overhead Light: Red (Off)",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 583.0,
        "mass": 1.5,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmLitCeiling1x1VibrantRedCustom": {
        "friendly": "Overhead Light: Red Setting",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 2681.0,
        "mass": 1.5,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmLitCeiling1x1VibrantRedOffCustom": {
        "friendly": "Overhead Light: Red Setting (Off)",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 2681.0,
        "mass": 1.5,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmLitCeiling1x1White": {
        "friendly": "Overhead Light: White",
        "short": "Light",
        "category": [
          "Hull"
        ],
        "basePrice": 583.0,
        "mass": 1.5,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmLitCeiling1x1WhiteOff": {
        "friendly": "Overhead Light: White (Off)",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 583.0,
        "mass": 1.5,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmLitCeiling1x1WhiteCustom": {
        "friendly": "Overhead Light: White Setting",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 2681.0,
        "mass": 1.5,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmLitCeiling1x1WhiteOffCustom": {
        "friendly": "Overhead Light: White Setting (Off)",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 2681.0,
        "mass": 1.5,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmChairStrap01": {
        "friendly": "Passenger Seat",
        "short": "Seat",
        "category": [
          "Furniture"
        ],
        "basePrice": 410.0,
        "mass": 23.0,
        "durability": 8.0,
        "source": "condowner"
      },
      "ItmChairStrap01Dmg": {
        "friendly": "Passenger Seat (Damaged)",
        "short": "Seat",
        "category": [
          "Furniture"
        ],
        "basePrice": 82.0,
        "mass": 21.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmChairStrap01Off": {
        "friendly": "Passenger Seat (Off)",
        "short": "Seat",
        "category": [
          "Furniture"
        ],
        "basePrice": 410.0,
        "mass": 23.0,
        "durability": 8.0,
        "source": "condowner"
      },
      "ItmStationNavDmg": {
        "friendly": "Polaris \"Standard Navigation Console\"  (Damaged)",
        "short": "Nav Station",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 3500.0,
        "mass": 500.0,
        "durability": 19.0,
        "source": "condowner"
      },
      "ItmStationNavOff": {
        "friendly": "Polaris \"Standard Navigation Console\"  (Off)",
        "short": "Nav Station",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 16880.0,
        "mass": 500.0,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmStationNav": {
        "friendly": "Polaris \"Standard Navigation Console\" Nav Station",
        "short": "Nav Station",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 16880.0,
        "mass": 500.0,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmShipWeaponDecoyLauncher01": {
        "friendly": "Polaris Decoy Launcher",
        "short": "Decoy Launcher",
        "category": [
          "Weapons"
        ],
        "basePrice": 86000.0,
        "mass": 320.0,
        "durability": 20.0,
        "source": "condowner"
      },
      "ItmShipWeaponDecoyLauncher01Dmg": {
        "friendly": "Polaris Decoy Launcher (Damaged)",
        "short": "Decoy Launcher",
        "category": [
          "Weapons"
        ],
        "basePrice": 17200.0,
        "mass": 320.0,
        "durability": 25.0,
        "source": "condowner"
      },
      "ItmShipWeaponDecoyLauncher01Off": {
        "friendly": "Polaris Decoy Launcher (Off)",
        "short": "Decoy Launcher",
        "category": [
          "Weapons"
        ],
        "basePrice": 86000.0,
        "mass": 320.0,
        "durability": 20.0,
        "source": "condowner"
      },
      "ItmSensorOptical01": {
        "friendly": "Polaris Sensor: Optical",
        "short": "Optical Sensor",
        "category": [
          "Sensors"
        ],
        "basePrice": 5000.0,
        "mass": 7.0,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmSensorOptical01Dmg": {
        "friendly": "Polaris Sensor: Optical (Damaged)",
        "short": "Optical Sensor",
        "category": [
          "Sensors"
        ],
        "basePrice": 1000.0,
        "mass": 7.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmSensorOptical01Off": {
        "friendly": "Polaris Sensor: Optical (Off)",
        "short": "Optical Sensor",
        "category": [
          "Sensors"
        ],
        "basePrice": 5000.0,
        "mass": 7.0,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmDecorPoster11": {
        "friendly": "Poster: Bismertnaya Vodka Classic",
        "category": [
          "Media"
        ],
        "basePrice": 40.0,
        "mass": 0.005,
        "durability": 1.0,
        "source": "cooverlay"
      },
      "ItmDecorPoster12": {
        "friendly": "Poster: Bismertnaya Vodka Psyche",
        "category": [
          "Media"
        ],
        "basePrice": 40.0,
        "mass": 0.005,
        "durability": 1.0,
        "source": "cooverlay"
      },
      "ItmDecorPoster09": {
        "friendly": "Poster: Black Bull Kape",
        "category": [
          "Media"
        ],
        "basePrice": 40.0,
        "mass": 0.005,
        "durability": 1.0,
        "source": "cooverlay"
      },
      "ItmDecorPoster10": {
        "friendly": "Poster: Damask Rose",
        "category": [
          "Media"
        ],
        "basePrice": 40.0,
        "mass": 0.005,
        "durability": 1.0,
        "source": "cooverlay"
      },
      "ItmDecorPoster01": {
        "friendly": "Poster: Grande Prêmio do Encantado",
        "short": "Poster",
        "category": [
          "Media"
        ],
        "basePrice": 40.0,
        "mass": 0.005,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmDecorPoster05": {
        "friendly": "Poster: Lucky says PANIC",
        "category": [
          "Media"
        ],
        "basePrice": 40.0,
        "mass": 0.005,
        "durability": 1.0,
        "source": "cooverlay"
      },
      "ItmDecorPoster06": {
        "friendly": "Poster: Lucky says YIELD",
        "category": [
          "Media"
        ],
        "basePrice": 40.0,
        "mass": 0.005,
        "durability": 1.0,
        "source": "cooverlay"
      },
      "ItmDecorPoster00": {
        "friendly": "Poster: New Earth Ostracon",
        "short": "Poster",
        "category": [
          "Media"
        ],
        "basePrice": 400.0,
        "mass": 0.005,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmDecorPoster03": {
        "friendly": "Poster: Travel Atlantis",
        "category": [
          "Media"
        ],
        "basePrice": 40.0,
        "mass": 0.005,
        "durability": 1.0,
        "source": "cooverlay"
      },
      "ItmDecorPoster02": {
        "friendly": "Poster: Travel Tharsis Landing",
        "category": [
          "Media"
        ],
        "basePrice": 40.0,
        "mass": 0.005,
        "durability": 1.0,
        "source": "cooverlay"
      },
      "ItmDecorPoster04": {
        "friendly": "Poster: Viceroy's Advertisement",
        "category": [
          "Media"
        ],
        "basePrice": 40.0,
        "mass": 0.005,
        "durability": 1.0,
        "source": "cooverlay"
      },
      "ItmDocumentOgiso01": {
        "friendly": "Poster: Work Safety",
        "short": "Poster",
        "category": [
          "Media"
        ],
        "basePrice": 0.15,
        "mass": 0.005,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmSwitch01Dmg": {
        "friendly": "Power Switch (Damaged)",
        "short": "Switch",
        "category": [
          "Electronics"
        ],
        "basePrice": 14.0,
        "mass": 12.0,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmSwitch01Off": {
        "friendly": "Power Switch (Off)",
        "short": "Switch",
        "category": [
          "Electronics"
        ],
        "basePrice": 66.5,
        "mass": 12.0,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmSwitch01On": {
        "friendly": "Power Switch (On)",
        "short": "Switch",
        "category": [
          "Electronics"
        ],
        "basePrice": 66.5,
        "mass": 12.0,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmSwitch01OffTutorial": {
        "friendly": "Power Switch: Dorm (Off)",
        "category": [
          "Electronics"
        ],
        "basePrice": 66.5,
        "mass": 12.0,
        "durability": 2.0,
        "source": "cooverlay"
      },
      "ItmReactorIC02IgnitionMini": {
        "friendly": "Power Uplink: Station",
        "short": "Power Uplink",
        "category": [
          "FusionParts"
        ],
        "basePrice": 141000.0,
        "mass": 417.0,
        "durability": 120.0,
        "source": "condowner"
      },
      "ItmShipCladding01": {
        "friendly": "PPC Ablative Hull Cladding",
        "short": "Cladding",
        "category": [
          "Hull"
        ],
        "basePrice": 8000.0,
        "mass": 20.0,
        "durability": 30.0,
        "source": "condowner"
      },
      "ItmShipCladding01Dmg": {
        "friendly": "PPC Ablative Hull Cladding (Damaged)",
        "short": "Cladding",
        "category": [
          "Hull"
        ],
        "basePrice": 300.0,
        "mass": 20.0,
        "durability": 30.0,
        "source": "condowner"
      },
      "ItmKioskRacingVenus": {
        "friendly": "Racing League Kiosk",
        "short": "Kiosk",
        "category": [
          "Furniture"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "condowner"
      },
      "ItmRack1x101": {
        "friendly": "Rack 1x1",
        "short": "Rack",
        "category": [
          "Furniture"
        ],
        "basePrice": 774.0,
        "mass": 7.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmRack1x101Dorm": {
        "friendly": "Rack 1x1",
        "category": [
          "Furniture"
        ],
        "basePrice": 774.0,
        "mass": 7.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmRack1x101Dmg": {
        "friendly": "Rack 1x1 (Damaged)",
        "short": "Rack",
        "category": [
          "Furniture"
        ],
        "basePrice": 121.0,
        "mass": 7.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmRack1x101DormDmg": {
        "friendly": "Rack 1x1 (Damaged)",
        "category": [
          "Furniture"
        ],
        "basePrice": 121.0,
        "mass": 7.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmRack1x201": {
        "friendly": "Rack 1x2",
        "short": "Rack",
        "category": [
          "Furniture"
        ],
        "basePrice": 882.0,
        "mass": 14.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmRack1x201Dmg": {
        "friendly": "Rack 1x2 (Damaged)",
        "short": "Rack",
        "category": [
          "Furniture"
        ],
        "basePrice": 197.0,
        "mass": 14.0,
        "durability": 20.0,
        "source": "condowner"
      },
      "ItmRack1x301": {
        "friendly": "Rack 1x3",
        "short": "Rack",
        "category": [
          "Furniture"
        ],
        "basePrice": 1012.0,
        "mass": 21.0,
        "durability": 15.0,
        "source": "condowner"
      },
      "ItmRack1x301Dmg": {
        "friendly": "Rack 1x3 (Damaged)",
        "short": "Rack",
        "category": [
          "Furniture"
        ],
        "basePrice": 274.0,
        "mass": 21.0,
        "durability": 30.0,
        "source": "condowner"
      },
      "ItmRack1x401": {
        "friendly": "Rack 1x4",
        "short": "Rack",
        "category": [
          "Furniture"
        ],
        "basePrice": 1300.0,
        "mass": 28.0,
        "durability": 20.0,
        "source": "condowner"
      },
      "ItmRack1x401Dmg": {
        "friendly": "Rack 1x4 (Damaged)",
        "short": "Rack",
        "category": [
          "Furniture"
        ],
        "basePrice": 351.0,
        "mass": 29.0,
        "durability": 45.0,
        "source": "condowner"
      },
      "ItmRack2x2C01": {
        "friendly": "Rack Corner",
        "short": "Rack",
        "category": [
          "Furniture"
        ],
        "basePrice": 1024.0,
        "mass": 21.0,
        "durability": 15.0,
        "source": "condowner"
      },
      "ItmRack2x2C01Dmg": {
        "friendly": "Rack Corner (Damaged)",
        "short": "Rack",
        "category": [
          "Furniture"
        ],
        "basePrice": 292.0,
        "mass": 21.0,
        "durability": 30.0,
        "source": "condowner"
      },
      "ItmShipWeaponMassThrower02": {
        "friendly": "Railgun",
        "category": [
          "Weapons"
        ],
        "basePrice": 45000.0,
        "mass": 210.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmShipWeaponMassThrower02Dmg": {
        "friendly": "Railgun (Damaged)",
        "short": "Railgun",
        "category": [
          "Weapons"
        ],
        "basePrice": 9000.0,
        "mass": 210.0,
        "durability": 18.0,
        "source": "condowner"
      },
      "ItmShipWeaponMassThrower02Off": {
        "friendly": "Railgun (Off)",
        "short": "Railgun",
        "category": [
          "Weapons"
        ],
        "basePrice": 45000.0,
        "mass": 210.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmRCSDistro02": {
        "friendly": "RCS Intake Regulator: Kang \"2202\"",
        "short": "Intake",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 1692.0,
        "mass": 28.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmRCSDistro02Dmg": {
        "friendly": "RCS Intake Regulator: Kang \"2202\" (Damaged)",
        "short": "Intake",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 355.0,
        "mass": 28.0,
        "durability": 15.0,
        "source": "condowner"
      },
      "ItmRCSDistro02Off": {
        "friendly": "RCS Intake Regulator: Kang \"2202\" (Off)",
        "short": "Intake",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 1692.0,
        "mass": 28.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmRCSDistro01": {
        "friendly": "RCS Intake Regulator: Miura \"Hydra\"",
        "short": "Intake",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 32266.0,
        "mass": 28.0,
        "durability": 8.0,
        "source": "condowner"
      },
      "ItmRCSDistro01Dmg": {
        "friendly": "RCS Intake Regulator: Miura \"Hydra\" (Damaged)",
        "short": "Intake",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 7330.0,
        "mass": 28.0,
        "durability": 22.0,
        "source": "condowner"
      },
      "ItmRCSDistro01Off": {
        "friendly": "RCS Intake Regulator: Miura \"Hydra\" (Off)",
        "short": "Intake",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 32266.0,
        "mass": 28.0,
        "durability": 8.0,
        "source": "condowner"
      },
      "ItmFusionFuelRegulator01": {
        "friendly": "Reactor Fuel Regulator",
        "short": "Fuel Regulator",
        "category": [
          "FusionParts"
        ],
        "basePrice": 13134.0,
        "mass": 28.0,
        "durability": 8.0,
        "source": "condowner"
      },
      "ItmFusionFuelRegulator01Dmg": {
        "friendly": "Reactor Fuel Regulator (Damaged)",
        "short": "Fuel Regulator",
        "category": [
          "FusionParts"
        ],
        "basePrice": 3283.0,
        "mass": 28.0,
        "durability": 22.0,
        "source": "condowner"
      },
      "ItmFusionFuelRegulator01Off": {
        "friendly": "Reactor Fuel Regulator (Off)",
        "short": "Fuel Regulator",
        "category": [
          "FusionParts"
        ],
        "basePrice": 13134.0,
        "mass": 28.0,
        "durability": 8.0,
        "source": "condowner"
      },
      "ItmKioskResBroker01BCER": {
        "friendly": "Real Estate Kiosk (BCER)",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmKioskResBroker01BCRS": {
        "friendly": "Real Estate Kiosk (BCRS)",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmKioskResBroker01OKLG": {
        "friendly": "Real Estate Kiosk (OKLG)",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmKioskResBroker01VENC": {
        "friendly": "Real Estate Kiosk (VENC)",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "condowner"
      },
      "ItmKioskResBroker01VNCA": {
        "friendly": "Real Estate Kiosk (VNCA)",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmTV01": {
        "friendly": "Renbao \"Smart\" TV",
        "short": "TV",
        "category": [
          "Media"
        ],
        "basePrice": 366.0,
        "mass": 13.0,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmTV01Off": {
        "friendly": "Renbao \"Smart\" TV (Off)",
        "short": "TV",
        "category": [
          "Media"
        ],
        "basePrice": 366.0,
        "mass": 13.0,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmTV01Drama": {
        "friendly": "Renbao \"Smart\" TV (Playing Reruns)",
        "short": "TV",
        "category": [
          "Media"
        ],
        "basePrice": 366.0,
        "mass": 13.0,
        "durability": 4.0,
        "source": "condowner"
      },
      "ReservedStationFlotillaBroker": {
        "friendly": "ReservedStationFlotillaBroker",
        "short": "Broker Station",
        "category": [
          "IndustrialProducts"
        ],
        "durability": 25.0,
        "source": "condowner"
      },
      "ReservedStationFlotillaOrganizer": {
        "friendly": "ReservedStationFlotillaOrganizer",
        "short": "Organizer Planter",
        "category": [
          "IndustrialProducts"
        ],
        "durability": 25.0,
        "source": "condowner"
      },
      "ReservedTerminalOKLGPortAuthority": {
        "friendly": "ReservedTerminalOKLGPortAuthority",
        "short": "P.A. Terminal",
        "category": [
          "Electronics"
        ],
        "durability": 25.0,
        "source": "condowner"
      },
      "ItmTowingBrace01": {
        "friendly": "Ryokka \"T7N\" Towing Brace",
        "short": "Tow Brace",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 23944.0,
        "mass": 180.0,
        "durability": 40.0,
        "source": "condowner"
      },
      "ItmTowingBrace01Dmg": {
        "friendly": "Ryokka \"T7N\" Towing Brace (Damaged)",
        "short": "Tow Brace",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 4788.0,
        "mass": 180.0,
        "durability": 15.0,
        "source": "condowner"
      },
      "ItmTowingBrace01DmgSecured": {
        "friendly": "Ryokka \"T7N\" Towing Brace (Damaged, Secured)",
        "short": "Tow Brace",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 4788.0,
        "mass": 180.0,
        "durability": 15.0,
        "source": "condowner"
      },
      "ItmTowingBrace01Off": {
        "friendly": "Ryokka \"T7N\" Towing Brace (Off)",
        "short": "Tow Brace",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 23944.0,
        "mass": 180.0,
        "durability": 40.0,
        "source": "condowner"
      },
      "ItmTowingBrace01OffSecured": {
        "friendly": "Ryokka \"T7N\" Towing Brace (Off, Secured)",
        "short": "Tow Brace",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 23944.0,
        "mass": 180.0,
        "durability": 40.0,
        "source": "condowner"
      },
      "ItmTowingBrace01Secured": {
        "friendly": "Ryokka \"T7N\" Towing Brace (Secured)",
        "short": "Tow Brace",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 23944.0,
        "mass": 180.0,
        "durability": 40.0,
        "source": "condowner"
      },
      "ItmChair04Dmg": {
        "friendly": "Seat (Damaged): Minsheng \"红运\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 17.0,
        "mass": 9.0,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmChairCube01aDmg": {
        "friendly": "Seat (Damaged): Testudo \"Concourse Series 1-A\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 17.0,
        "mass": 9.0,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmChairCube01cDmg": {
        "friendly": "Seat (Damaged): Testudo \"Concourse Series 1-C\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 17.0,
        "mass": 9.0,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmChairCube02aDmg": {
        "friendly": "Seat (Damaged): Testudo \"Concourse Series 2-A\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 17.0,
        "mass": 9.0,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmChairCube02bDmg": {
        "friendly": "Seat (Damaged): Testudo \"Concourse Series 2-B\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 67.0,
        "mass": 12.0,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmChairCube02cDmg": {
        "friendly": "Seat (Damaged): Testudo \"Concourse Series 2-C\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 17.0,
        "mass": 9.0,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmChairCube03aDmg": {
        "friendly": "Seat (Damaged): Testudo \"Concourse Series 3-A\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 17.0,
        "mass": 9.0,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmChairCube03bDmg": {
        "friendly": "Seat (Damaged): Testudo \"Concourse Series 3-B\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 67.0,
        "mass": 12.0,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmChairCube03cDmg": {
        "friendly": "Seat (Damaged): Testudo \"Concourse Series 3-C\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 17.0,
        "mass": 9.0,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmChairCube04aDmg": {
        "friendly": "Seat (Damaged): Testudo \"Concourse Series 4-A\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 17.0,
        "mass": 9.0,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmChairCube04bDmg": {
        "friendly": "Seat (Damaged): Testudo \"Concourse Series 4-B\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 67.0,
        "mass": 12.0,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmChairCube04cDmg": {
        "friendly": "Seat (Damaged): Testudo \"Concourse Series 4-C\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 17.0,
        "mass": 9.0,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmChair03Dmg": {
        "friendly": "Seat (Damaged): Testudo \"Saloon Series\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 17.0,
        "mass": 9.0,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmChair04": {
        "friendly": "Seat: Minsheng \"红运\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 85.0,
        "mass": 11.0,
        "durability": 6.0,
        "source": "cooverlay"
      },
      "ItmChairCube01a": {
        "friendly": "Seat: Testudo \"Concourse Series 1-A\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 85.0,
        "mass": 11.0,
        "durability": 6.0,
        "source": "cooverlay"
      },
      "ItmChairCube01b": {
        "friendly": "Seat: Testudo \"Concourse Series 1-B\"",
        "short": "Chair",
        "category": [
          "Furniture"
        ],
        "basePrice": 335.0,
        "mass": 14.0,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmChairCube01bDmg": {
        "friendly": "Seat: Testudo \"Concourse Series 1-B\" (Damaged)",
        "short": "Chair",
        "category": [
          "Furniture"
        ],
        "basePrice": 67.0,
        "mass": 12.0,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmChairCube01c": {
        "friendly": "Seat: Testudo \"Concourse Series 1-C\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 85.0,
        "mass": 11.0,
        "durability": 6.0,
        "source": "cooverlay"
      },
      "ItmChairCube02a": {
        "friendly": "Seat: Testudo \"Concourse Series 2-A\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 85.0,
        "mass": 11.0,
        "durability": 6.0,
        "source": "cooverlay"
      },
      "ItmChairCube02b": {
        "friendly": "Seat: Testudo \"Concourse Series 2-B\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 335.0,
        "mass": 14.0,
        "durability": 6.0,
        "source": "cooverlay"
      },
      "ItmChairCube02c": {
        "friendly": "Seat: Testudo \"Concourse Series 2-C\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 85.0,
        "mass": 11.0,
        "durability": 6.0,
        "source": "cooverlay"
      },
      "ItmChairCube03a": {
        "friendly": "Seat: Testudo \"Concourse Series 3-A\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 85.0,
        "mass": 11.0,
        "durability": 6.0,
        "source": "cooverlay"
      },
      "ItmChairCube03b": {
        "friendly": "Seat: Testudo \"Concourse Series 3-B\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 335.0,
        "mass": 14.0,
        "durability": 6.0,
        "source": "cooverlay"
      },
      "ItmChairCube03c": {
        "friendly": "Seat: Testudo \"Concourse Series 3-C\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 85.0,
        "mass": 11.0,
        "durability": 6.0,
        "source": "cooverlay"
      },
      "ItmChairCube04a": {
        "friendly": "Seat: Testudo \"Concourse Series 4-A\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 85.0,
        "mass": 11.0,
        "durability": 6.0,
        "source": "cooverlay"
      },
      "ItmChairCube04b": {
        "friendly": "Seat: Testudo \"Concourse Series 4-B\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 335.0,
        "mass": 14.0,
        "durability": 6.0,
        "source": "cooverlay"
      },
      "ItmChairCube04c": {
        "friendly": "Seat: Testudo \"Concourse Series 4-C\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 85.0,
        "mass": 11.0,
        "durability": 6.0,
        "source": "cooverlay"
      },
      "ItmChair03": {
        "friendly": "Seat: Testudo \"Saloon Series\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 85.0,
        "mass": 11.0,
        "durability": 6.0,
        "source": "cooverlay"
      },
      "ItmSecretCompartment01": {
        "friendly": "Secret Compartment",
        "category": [
          "Hull"
        ],
        "basePrice": 743.0,
        "mass": 6.5,
        "durability": 15.0,
        "source": "condowner"
      },
      "ItmKioskHealth01": {
        "friendly": "Self Care Kiosk",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "condowner"
      },
      "ItmBattery02": {
        "friendly": "Ship Battery",
        "short": "Battery",
        "category": [
          "Electronics"
        ],
        "basePrice": 2623.0,
        "mass": 45.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmBattery02Dmg": {
        "friendly": "Ship Battery (Damaged)",
        "short": "Battery",
        "category": [
          "Electronics"
        ],
        "basePrice": 524.0,
        "mass": 45.0,
        "durability": 30.0,
        "source": "condowner"
      },
      "ItmKioskOKLGShipBroker01": {
        "friendly": "Ship Broker Kiosk",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "condowner"
      },
      "ItmKioskBCERShipBroker01": {
        "friendly": "Ship Broker Kiosk (BCER)",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmKioskBCRSShipBroker01": {
        "friendly": "Ship Broker Kiosk (BCRS)",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmKioskVENCShipBroker01": {
        "friendly": "Ship Broker Kiosk (VENC)",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmKioskVNCAShipBroker01": {
        "friendly": "Ship Broker Kiosk (VNCA)",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmKioskVORBShipBroker01": {
        "friendly": "Ship Broker Kiosk (VORB)",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmSink01": {
        "friendly": "Sink",
        "category": [
          "Furniture"
        ],
        "basePrice": 234.0,
        "mass": 15.0,
        "durability": 15.0,
        "source": "condowner"
      },
      "ItmSink01Starter": {
        "friendly": "Sink (Dorm)",
        "short": "Sink",
        "category": [
          "Furniture"
        ],
        "basePrice": 234.0,
        "mass": 15.0,
        "durability": 15.0,
        "source": "condowner"
      },
      "ItmBed01": {
        "friendly": "Sleeping Bunk",
        "short": "Bunk",
        "category": [
          "LuxuryGoods"
        ],
        "basePrice": 2280.0,
        "mass": 30.0,
        "durability": 12.0,
        "source": "condowner"
      },
      "ItmBed01Dmg": {
        "friendly": "Sleeping Bunk (Damaged)",
        "short": "Bunk",
        "category": [
          "LuxuryGoods"
        ],
        "basePrice": 294.0,
        "mass": 30.0,
        "durability": 25.0,
        "source": "condowner"
      },
      "ItmBed01Off": {
        "friendly": "Sleeping Bunk (Off)",
        "short": "Bunk",
        "category": [
          "LuxuryGoods"
        ],
        "basePrice": 2280.0,
        "mass": 30.0,
        "durability": 12.0,
        "source": "condowner"
      },
      "ItmShipWeaponPDC01": {
        "friendly": "Smartlink 'Charybdis' PDC",
        "short": "PDC",
        "category": [
          "Weapons"
        ],
        "basePrice": 25000.0,
        "mass": 60.0,
        "durability": 8.0,
        "source": "condowner"
      },
      "ItmShipWeaponPDC01Dmg": {
        "friendly": "Smartlink 'Charybdis' PDC (Damaged)",
        "short": "PDC",
        "category": [
          "Weapons"
        ],
        "basePrice": 5000.0,
        "mass": 60.0,
        "durability": 13.0,
        "source": "condowner"
      },
      "ItmShipWeaponPDC01Firing": {
        "friendly": "Smartlink 'Charybdis' PDC (Firing)",
        "category": [
          "Weapons"
        ],
        "basePrice": 25000.0,
        "mass": 60.0,
        "durability": 8.0,
        "source": "cooverlay"
      },
      "ItmShipWeaponPDC01Off": {
        "friendly": "Smartlink 'Charybdis' PDC (Off)",
        "short": "PDC",
        "category": [
          "Weapons"
        ],
        "basePrice": 25000.0,
        "mass": 60.0,
        "durability": 8.0,
        "source": "condowner"
      },
      "ItmShipWeaponMissileLauncher01": {
        "friendly": "Smartlink Missile Launcher",
        "short": "Missile Launcher",
        "category": [
          "Weapons"
        ],
        "basePrice": 86000.0,
        "mass": 320.0,
        "durability": 20.0,
        "source": "condowner"
      },
      "ItmShipWeaponMissileLauncher01Dmg": {
        "friendly": "Smartlink Missile Launcher (Damaged)",
        "short": "Missile Launcher",
        "category": [
          "Weapons"
        ],
        "basePrice": 17200.0,
        "mass": 320.0,
        "durability": 25.0,
        "source": "condowner"
      },
      "ItmShipWeaponMissileLauncher01Off": {
        "friendly": "Smartlink Missile Launcher (Off)",
        "short": "Missile Launcher",
        "category": [
          "Weapons"
        ],
        "basePrice": 86000.0,
        "mass": 320.0,
        "durability": 20.0,
        "source": "condowner"
      },
      "ItmAlarmSmokeOnG": {
        "friendly": "Smoke Alarm",
        "category": [
          "Sensors"
        ],
        "basePrice": 256.0,
        "mass": 0.5,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmAlarmSmokeOnR": {
        "friendly": "Smoke Alarm (Alert)",
        "short": "Smoke Alarm",
        "category": [
          "Sensors"
        ],
        "basePrice": 256.0,
        "mass": 0.5,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmAlarmSmokeDmg": {
        "friendly": "Smoke Alarm (Damaged)",
        "short": "Smoke Alarm",
        "category": [
          "Sensors"
        ],
        "basePrice": 51.0,
        "mass": 0.5,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmAlarmSmokeOff": {
        "friendly": "Smoke Alarm (Off)",
        "short": "Smoke Alarm",
        "category": [
          "Sensors"
        ],
        "basePrice": 256.0,
        "mass": 0.5,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmShipWeaponPDC03": {
        "friendly": "Soyuzneft 'Панцирь-Х' PDC",
        "short": "PDC",
        "category": [
          "Weapons"
        ],
        "basePrice": 18000.0,
        "mass": 75.0,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmShipWeaponPDC03Dmg": {
        "friendly": "Soyuzneft 'Панцирь-Х' PDC (Damaged)",
        "short": "PDC",
        "category": [
          "Weapons"
        ],
        "basePrice": 3600.0,
        "mass": 75.0,
        "durability": 15.0,
        "source": "condowner"
      },
      "ItmShipWeaponPDC03Firing": {
        "friendly": "Soyuzneft 'Панцирь-Х' PDC (Firing)",
        "category": [
          "Weapons"
        ],
        "basePrice": 18000.0,
        "mass": 75.0,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "ItmShipWeaponPDC03Off": {
        "friendly": "Soyuzneft 'Панцирь-Х' PDC (Off)",
        "short": "PDC",
        "category": [
          "Weapons"
        ],
        "basePrice": 18000.0,
        "mass": 75.0,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmShipWeaponMissileLauncher03": {
        "friendly": "Soyuzneft Missile Launcher",
        "short": "Missile Launcher",
        "category": [
          "Weapons"
        ],
        "basePrice": 40000.0,
        "mass": 250.0,
        "durability": 8.0,
        "source": "condowner"
      },
      "ItmShipWeaponMissileLauncher03Dmg": {
        "friendly": "Soyuzneft Missile Launcher (Damaged)",
        "short": "Missile Launcher",
        "category": [
          "Weapons"
        ],
        "basePrice": 8000.0,
        "mass": 250.0,
        "durability": 12.0,
        "source": "condowner"
      },
      "ItmShipWeaponMissileLauncher03Off": {
        "friendly": "Soyuzneft Missile Launcher (Off)",
        "short": "Missile Launcher",
        "category": [
          "Weapons"
        ],
        "basePrice": 40000.0,
        "mass": 250.0,
        "durability": 8.0,
        "source": "condowner"
      },
      "ItmChair01": {
        "friendly": "Spacer Stool",
        "short": "Stool",
        "category": [
          "Furniture"
        ],
        "basePrice": 27.0,
        "mass": 2.0,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmChair01Dmg": {
        "friendly": "Spacer Stool (Damaged)",
        "short": "Stool",
        "category": [
          "Furniture"
        ],
        "basePrice": 5.4,
        "mass": 2.0,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmBattery02LowPower": {
        "friendly": "Starter Battery",
        "category": [
          "Electronics"
        ],
        "basePrice": 2623.0,
        "mass": 45.0,
        "durability": 10.0,
        "source": "cooverlay"
      },
      "ItmBattery02bLowPower": {
        "friendly": "Starter Battery",
        "category": [
          "Electronics"
        ],
        "basePrice": 1575.0,
        "mass": 27.0,
        "durability": 6.0,
        "source": "cooverlay"
      },
      "ItmBattery02cLowPower": {
        "friendly": "Starter Battery",
        "category": [
          "Electronics"
        ],
        "basePrice": 944.0,
        "mass": 16.2,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmSink01Station": {
        "friendly": "Station Sink",
        "category": [
          "Furniture"
        ],
        "basePrice": 234.0,
        "mass": 15.0,
        "durability": 15.0,
        "source": "cooverlay"
      },
      "ItmPlanter1x101": {
        "friendly": "Succulent Planter",
        "short": "Planter",
        "category": [
          "LuxuryGoods"
        ],
        "basePrice": 2626.0,
        "mass": 7.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmFusionCorePump01": {
        "friendly": "Sulaiman Fusion Core Pump ",
        "short": "Core Pump",
        "category": [
          "FusionParts"
        ],
        "basePrice": 5520.0,
        "mass": 28.0,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmFusionCorePump01Dmg": {
        "friendly": "Sulaiman Fusion Core Pump (Damaged)",
        "short": "Core Pump",
        "category": [
          "FusionParts"
        ],
        "basePrice": 1112.0,
        "mass": 28.0,
        "durability": 19.0,
        "source": "condowner"
      },
      "ItmFusionCorePump01Off": {
        "friendly": "Sulaiman Fusion Core Pump (Off)",
        "short": "Core Pump",
        "category": [
          "FusionParts"
        ],
        "basePrice": 5520.0,
        "mass": 28.0,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmFusionLaserArray01": {
        "friendly": "Sulaiman Fusion Laser Array",
        "short": "Laser Array",
        "category": [
          "FusionParts"
        ],
        "basePrice": 5520.0,
        "mass": 28.0,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmFusionLaserArray01Dmg": {
        "friendly": "Sulaiman Fusion Laser Array (Damaged)",
        "short": "Laser Array",
        "category": [
          "FusionParts"
        ],
        "basePrice": 1112.0,
        "mass": 28.0,
        "durability": 19.0,
        "source": "condowner"
      },
      "ItmFusionLaserArray01Off": {
        "friendly": "Sulaiman Fusion Laser Array (Off)",
        "short": "Laser Array",
        "category": [
          "FusionParts"
        ],
        "basePrice": 5520.0,
        "mass": 28.0,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmFusionPelletFeeder01": {
        "friendly": "Sulaiman Pellet Feeder Assembly",
        "short": "Pellet Feeder",
        "category": [
          "FusionParts"
        ],
        "basePrice": 5520.0,
        "mass": 28.0,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmFusionPelletFeeder01Dmg": {
        "friendly": "Sulaiman Pellet Feeder Assembly (Damaged)",
        "short": "Pellet Feeder",
        "category": [
          "FusionParts"
        ],
        "basePrice": 1112.0,
        "mass": 28.0,
        "durability": 19.0,
        "source": "condowner"
      },
      "ItmFusionPelletFeeder01Off": {
        "friendly": "Sulaiman Pellet Feeder Assembly (Off)",
        "short": "Pellet Feeder",
        "category": [
          "FusionParts"
        ],
        "basePrice": 5520.0,
        "mass": 28.0,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmKioskSupplies01": {
        "friendly": "Supply Kiosk",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "condowner"
      },
      "ItmKioskSupplies01BCER": {
        "friendly": "Supply Kiosk (BCER)",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmKioskSupplies01BCRS": {
        "friendly": "Supply Kiosk (BCRS)",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmTerminal01": {
        "friendly": "Terminal",
        "category": [
          "Electronics"
        ],
        "basePrice": 488.0,
        "mass": 20.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "ReservedTerminalSanDiegoBingham": {
        "friendly": "Terminal (Bingham)",
        "short": "Terminal",
        "category": [
          "Electronics"
        ],
        "durability": 25.0,
        "source": "cooverlay"
      },
      "ReservedTerminalSanDiegoBlackWing": {
        "friendly": "Terminal (BlackWing)",
        "short": "Terminal",
        "category": [
          "Electronics"
        ],
        "durability": 25.0,
        "source": "cooverlay"
      },
      "ReservedTerminalSanDiegoClothes": {
        "friendly": "Terminal (Clothes)",
        "short": "Terminal",
        "category": [
          "Electronics"
        ],
        "durability": 25.0,
        "source": "cooverlay"
      },
      "ReservedTerminalSanDiegoCollectiveElectric": {
        "friendly": "Terminal (CollectiveElectric)",
        "short": "Terminal",
        "category": [
          "Electronics"
        ],
        "durability": 25.0,
        "source": "cooverlay"
      },
      "ReservedTerminalSanDiegoFutureFoods": {
        "friendly": "Terminal (FutureFoods)",
        "short": "Terminal",
        "category": [
          "Electronics"
        ],
        "durability": 25.0,
        "source": "cooverlay"
      },
      "ReservedTerminalSanDiegoGEC": {
        "friendly": "Terminal (GEC)",
        "short": "Terminal",
        "category": [
          "Electronics"
        ],
        "durability": 25.0,
        "source": "cooverlay"
      },
      "ReservedTerminalSanDiegoGott": {
        "friendly": "Terminal (Gott)",
        "short": "Terminal",
        "category": [
          "Electronics"
        ],
        "durability": 25.0,
        "source": "cooverlay"
      },
      "ReservedTerminalSanDiegoHalvorson": {
        "friendly": "Terminal (Halvorson)",
        "short": "Terminal",
        "category": [
          "Electronics"
        ],
        "durability": 25.0,
        "source": "cooverlay"
      },
      "ReservedTerminalSanDiegoHorang": {
        "friendly": "Terminal (Horang)",
        "short": "Terminal",
        "category": [
          "Electronics"
        ],
        "durability": 25.0,
        "source": "cooverlay"
      },
      "ReservedTerminalSanDiegoKang": {
        "friendly": "Terminal (Kang)",
        "short": "Terminal",
        "category": [
          "Electronics"
        ],
        "durability": 25.0,
        "source": "cooverlay"
      },
      "ReservedTerminalSanDiegoMiura": {
        "friendly": "Terminal (Miura)",
        "short": "Terminal",
        "category": [
          "Electronics"
        ],
        "durability": 25.0,
        "source": "cooverlay"
      },
      "ItmTerminal01Off": {
        "friendly": "Terminal (Off)",
        "short": "Terminal",
        "category": [
          "Electronics"
        ],
        "basePrice": 488.0,
        "mass": 20.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "ReservedTerminalSanDiegoPolaris": {
        "friendly": "Terminal (Polaris)",
        "short": "Terminal",
        "category": [
          "Electronics"
        ],
        "durability": 25.0,
        "source": "cooverlay"
      },
      "ReservedTerminalSanDiegoRakow": {
        "friendly": "Terminal (Rakow)",
        "short": "Terminal",
        "category": [
          "Electronics"
        ],
        "durability": 25.0,
        "source": "cooverlay"
      },
      "ReservedTerminalSanDiegoRenbao": {
        "friendly": "Terminal (Renbao)",
        "short": "Terminal",
        "category": [
          "Electronics"
        ],
        "durability": 25.0,
        "source": "cooverlay"
      },
      "ReservedTerminalSanDiegoShoes": {
        "friendly": "Terminal (Shoes)",
        "short": "Terminal",
        "category": [
          "Electronics"
        ],
        "durability": 25.0,
        "source": "cooverlay"
      },
      "ReservedTerminalSanDiegoSulaiman": {
        "friendly": "Terminal (Sulaiman)",
        "short": "Terminal",
        "category": [
          "Electronics"
        ],
        "durability": 25.0,
        "source": "cooverlay"
      },
      "ReservedTerminalSanDiegoWeber": {
        "friendly": "Terminal (Weber)",
        "short": "Terminal",
        "category": [
          "Electronics"
        ],
        "durability": 25.0,
        "source": "cooverlay"
      },
      "ItmKioskTestudo01BCER": {
        "friendly": "Testudo Kiosk (BCER)",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmKioskTestudo01BCRS": {
        "friendly": "Testudo Kiosk (BCRS)",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmAlarmTempOnW": {
        "friendly": "Thermostat",
        "category": [
          "Sensors"
        ],
        "basePrice": 116.0,
        "mass": 0.5,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmAlarmTempDmg": {
        "friendly": "Thermostat (Damaged)",
        "short": "Thermostat",
        "category": [
          "Sensors"
        ],
        "basePrice": 23.0,
        "mass": 0.5,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmAlarmTempOff": {
        "friendly": "Thermostat (Off)",
        "short": "Thermostat",
        "category": [
          "Sensors"
        ],
        "basePrice": 116.0,
        "mass": 0.5,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmAlarmTempOnB": {
        "friendly": "Thermostat (Too Cold)",
        "short": "Thermostat",
        "category": [
          "Sensors"
        ],
        "basePrice": 116.0,
        "mass": 0.5,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmAlarmTempOnR": {
        "friendly": "Thermostat (Too Warm)",
        "short": "Thermostat",
        "category": [
          "Sensors"
        ],
        "basePrice": 116.0,
        "mass": 0.5,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmToilet01": {
        "friendly": "Toilet",
        "category": [
          "Furniture"
        ],
        "basePrice": 623.0,
        "mass": 125.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmKioskTransit01": {
        "friendly": "Transit Kiosk",
        "short": "Transit",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 58.0,
        "durability": 70.0,
        "source": "condowner"
      },
      "ItmKioskTransit02": {
        "friendly": "Transit Kiosk",
        "short": "Transit",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 58.0,
        "durability": 70.0,
        "source": "condowner"
      },
      "ItmKioskTransit03": {
        "friendly": "Transit Lift (Down)",
        "short": "Transit",
        "category": [
          "Furniture"
        ],
        "mass": 58.0,
        "durability": 70.0,
        "source": "condowner"
      },
      "ItmDoor03TransitExpress": {
        "friendly": "Transit Lift (Express)",
        "short": "Transit Lift X",
        "category": [
          "Hull"
        ],
        "basePrice": 2670.0,
        "mass": 581.0,
        "durability": 80.0,
        "source": "condowner"
      },
      "ItmDoor03TransitExpressDmg": {
        "friendly": "Transit Lift (Express, Damaged)",
        "short": "Transit Lift X",
        "category": [
          "Hull"
        ],
        "basePrice": 2670.0,
        "mass": 581.0,
        "durability": 80.0,
        "source": "condowner"
      },
      "ItmKioskTransit03b": {
        "friendly": "Transit Lift (Up)",
        "short": "Transit",
        "category": [
          "Furniture"
        ],
        "mass": 58.0,
        "durability": 70.0,
        "source": "condowner"
      },
      "ItmTransponder01Dmg": {
        "friendly": "Transponder/IFF (Damaged): Polaris \"VDX-01\"",
        "short": "Transponder",
        "category": [
          "Sensors"
        ],
        "basePrice": 290.0,
        "mass": 1.35,
        "durability": 13.0,
        "source": "condowner"
      },
      "ItmTransponder01Off": {
        "friendly": "Transponder/IFF (Off): Polaris \"VDX-01\"",
        "short": "Transponder",
        "category": [
          "Sensors"
        ],
        "basePrice": 29000.0,
        "mass": 1.35,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmTransponder01OnR": {
        "friendly": "Transponder/IFF: Polaris \"VDX-01\"",
        "short": "Transponder",
        "category": [
          "Sensors"
        ],
        "basePrice": 29000.0,
        "mass": 1.35,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmTreadmill01": {
        "friendly": "Treadmill",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 10850.0,
        "mass": 310.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmTreadmill01Dmg": {
        "friendly": "Treadmill (Damaged)",
        "short": "Treadmill",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 400.0,
        "mass": 310.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmTreadmill01Off": {
        "friendly": "Treadmill (Off)",
        "short": "Treadmill",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 10850.0,
        "mass": 310.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmTreadmill01Active": {
        "friendly": "Treadmill (Running)",
        "short": "Treadmill",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 10850.0,
        "mass": 310.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmFloorGrate4x401": {
        "friendly": "Turbine Lifter",
        "short": "Turbine",
        "category": [
          "Hull"
        ],
        "basePrice": 3100.0,
        "mass": 65.0,
        "durability": 30.0,
        "source": "condowner"
      },
      "ItmAirPump01Dmg": {
        "friendly": "Turbo Air Pump (Damaged)",
        "category": [
          "HVAC"
        ],
        "basePrice": 510.0,
        "mass": 11.0,
        "durability": 11.0,
        "source": "cooverlay"
      },
      "ItmAirPump01Off": {
        "friendly": "Turbo Air Pump (Off)",
        "category": [
          "HVAC"
        ],
        "basePrice": 2050.0,
        "mass": 11.0,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmAirPump01OnG": {
        "friendly": "Turbo Air Pump (OnG)",
        "category": [
          "HVAC"
        ],
        "basePrice": 2050.0,
        "mass": 11.0,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmBedMedical01": {
        "friendly": "Van Buren \"Infirmaway\" Medical Bed",
        "short": "Med Bed",
        "category": [
          "Medical"
        ],
        "basePrice": 18570.0,
        "mass": 88.0,
        "durability": 8.0,
        "source": "condowner"
      },
      "ItmBedMedical01Dmg": {
        "friendly": "Van Buren \"Infirmaway\" Medical Bed  (Damaged)",
        "short": "Med Bed",
        "category": [
          "Medical"
        ],
        "basePrice": 18570.0,
        "mass": 88.0,
        "durability": 23.0,
        "source": "condowner"
      },
      "ItmBedMedical01Off": {
        "friendly": "Van Buren \"Infirmaway\" Medical Bed (Off)",
        "short": "Med Bed",
        "category": [
          "Medical"
        ],
        "basePrice": 18570.0,
        "mass": 88.0,
        "durability": 8.0,
        "source": "condowner"
      },
      "ItmKioskVORBScrap01": {
        "friendly": "VORB Scrap Kiosk",
        "short": "Kiosk",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "condowner"
      },
      "ItmSensorLidar01": {
        "friendly": "Weber Sensor: LiDAR",
        "short": "LiDAR",
        "category": [
          "Sensors"
        ],
        "basePrice": 23000.0,
        "mass": 30.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmSensorLidar01Dmg": {
        "friendly": "Weber Sensor: LiDAR (Damaged)",
        "short": "LiDAR",
        "category": [
          "Sensors"
        ],
        "basePrice": 4600.0,
        "mass": 30.0,
        "durability": 7.0,
        "source": "condowner"
      },
      "ItmSensorLidar01Off": {
        "friendly": "Weber Sensor: LiDAR (Off)",
        "short": "LiDAR",
        "category": [
          "Sensors"
        ],
        "basePrice": 23000.0,
        "mass": 30.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmWorkbench01": {
        "friendly": "Workbench",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 1446.0,
        "mass": 20.0,
        "durability": 20.0,
        "source": "condowner"
      },
      "ItmKioskOKLGFoodCart01": {
        "friendly": "Xinhua Fusion Street Food Vendor",
        "short": "Xinhua Cart",
        "category": [
          "IndustrialProducts"
        ],
        "mass": 31.0,
        "durability": 70.0,
        "source": "condowner"
      },
      "ItmAntenna01OnG": {
        "friendly": "XPDR Antenna (Active)",
        "short": "Antenna",
        "category": [
          "Sensors"
        ],
        "basePrice": 3000.0,
        "mass": 3.0,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmAntenna01Dmg": {
        "friendly": "XPDR Antenna (Damaged)",
        "short": "Antenna",
        "category": [
          "Sensors"
        ],
        "basePrice": 600.0,
        "mass": 2.0,
        "durability": 8.0,
        "source": "condowner"
      },
      "ItmAntenna01Off": {
        "friendly": "XPDR Antenna (Off)",
        "short": "Antenna",
        "category": [
          "Sensors"
        ],
        "basePrice": 3000.0,
        "mass": 3.0,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmAntenna02OnG": {
        "friendly": "XPDR Antenna: Hardened (Active)",
        "short": "Antenna",
        "category": [
          "Sensors"
        ],
        "basePrice": 9020.0,
        "mass": 12.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmAntenna02Dmg": {
        "friendly": "XPDR Antenna: Hardened (Damaged)",
        "short": "Antenna",
        "category": [
          "Sensors"
        ],
        "basePrice": 1804.0,
        "mass": 10.0,
        "durability": 18.0,
        "source": "condowner"
      },
      "ItmAntenna02Off": {
        "friendly": "XPDR Antenna: Hardened (Off)",
        "short": "Antenna",
        "category": [
          "Sensors"
        ],
        "basePrice": 9020.0,
        "mass": 12.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmSensorEM02": {
        "friendly": "Zhuangzi Sensor: EM",
        "short": "EM Sensor",
        "category": [
          "Sensors"
        ],
        "basePrice": 6400.0,
        "mass": 3.0,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmSensorEM02Dmg": {
        "friendly": "Zhuangzi Sensor: EM (Damaged)",
        "short": "EM Sensor",
        "category": [
          "Sensors"
        ],
        "basePrice": 1280.0,
        "mass": 3.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmSensorEM02Off": {
        "friendly": "Zhuangzi Sensor: EM (Off)",
        "short": "EM Sensor",
        "category": [
          "Sensors"
        ],
        "basePrice": 6400.0,
        "mass": 3.0,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmSensorIR02": {
        "friendly": "Zhuangzi Sensor: IR",
        "short": "IR Sensor",
        "category": [
          "Sensors"
        ],
        "basePrice": 12000.0,
        "mass": 5.0,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmSensorIR02Dmg": {
        "friendly": "Zhuangzi Sensor: IR (Damaged)",
        "short": "IR Sensor",
        "category": [
          "Sensors"
        ],
        "basePrice": 2400.0,
        "mass": 5.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmSensorIR02Off": {
        "friendly": "Zhuangzi Sensor: IR (Off)",
        "short": "IR Sensor",
        "category": [
          "Sensors"
        ],
        "basePrice": 12000.0,
        "mass": 5.0,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmSensorLidar02": {
        "friendly": "Zhuangzi Sensor: LiDAR",
        "short": "LiDAR",
        "category": [
          "Sensors"
        ],
        "basePrice": 29000.0,
        "mass": 21.0,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmSensorLidar02Dmg": {
        "friendly": "Zhuangzi Sensor: LiDAR (Damaged)",
        "short": "LiDAR",
        "category": [
          "Sensors"
        ],
        "basePrice": 5800.0,
        "mass": 21.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmSensorLidar02Off": {
        "friendly": "Zhuangzi Sensor: LiDAR (Off)",
        "short": "LiDAR",
        "category": [
          "Sensors"
        ],
        "basePrice": 29000.0,
        "mass": 21.0,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmSensorRadar02": {
        "friendly": "Zhuangzi Sensor: Radar",
        "short": "Radar",
        "category": [
          "Sensors"
        ],
        "basePrice": 42000.0,
        "mass": 90.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmSensorRadar02Dmg": {
        "friendly": "Zhuangzi Sensor: Radar (Damaged)",
        "short": "Radar",
        "category": [
          "Sensors"
        ],
        "basePrice": 8400.0,
        "mass": 90.0,
        "durability": 8.0,
        "source": "condowner"
      },
      "ItmSensorRadar02Off": {
        "friendly": "Zhuangzi Sensor: Radar (Off)",
        "short": "Radar",
        "category": [
          "Sensors"
        ],
        "basePrice": 42000.0,
        "mass": 130.0,
        "durability": 5.0,
        "source": "condowner"
      }
    },
    "decorative": {},
    "other": {
      "DataBINMergaSuspiciousGaps": {
        "friendly": "              .BIN",
        "source": "cooverlay"
      },
      "ItmSignNeon01Loose": {
        "friendly": "\"Mescaform\" Neon Sign (Loose)",
        "short": "Sign",
        "category": [
          "LuxuryGoods"
        ],
        "basePrice": 1314.0,
        "mass": 7.5,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmSealTemp01Loose": {
        "friendly": "\"Ripley\" Temporary Blister Seal Kit (Loose)",
        "short": "Quick Seal Kit",
        "category": [
          "Hull"
        ],
        "basePrice": 79.0,
        "mass": 4.0,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmDroneDecoy01": {
        "friendly": "'Rave' Drone Decoy",
        "short": "Decoy",
        "category": [
          "Electronics"
        ],
        "basePrice": 450.0,
        "mass": 1.8,
        "durability": 8.0,
        "source": "condowner"
      },
      "ItmDroneDecoy01On": {
        "friendly": "'Rave' Drone Decoy (Active)",
        "short": "Drone Decoy",
        "category": [
          "Electronics"
        ],
        "basePrice": 450.0,
        "mass": 1.8,
        "durability": 8.0,
        "source": "condowner"
      },
      "ItmElectricalBox01DmgLoose": {
        "friendly": "'SB-8011' Signal Box (Damaged, Loose)",
        "short": "Signal Box",
        "category": [
          "Electronics"
        ],
        "basePrice": 13.3,
        "mass": 12.0,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmElectricalBox01Loose": {
        "friendly": "'SB-8011' Signal Box (Loose)",
        "short": "Signal Box",
        "category": [
          "Electronics"
        ],
        "basePrice": 66.5,
        "mass": 12.0,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmCanister01DmgLoose": {
        "friendly": "01 Canister (Damaged, Loose)",
        "short": "Canister",
        "category": [
          "LifeSupport"
        ],
        "basePrice": 53.0,
        "mass": 70.0,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmCanister01Loose": {
        "friendly": "01 Canister (Loose)",
        "short": "Canister",
        "category": [
          "LifeSupport"
        ],
        "basePrice": 410.0,
        "mass": 70.0,
        "durability": 4.0,
        "source": "condowner"
      },
      "DataIMGThreeWolfMoons": {
        "friendly": "3WOLFMOONS.IMG",
        "source": "cooverlay"
      },
      "DataBIN79": {
        "friendly": "79.BIN",
        "source": "cooverlay"
      },
      "[us]": {
        "friendly": "[us]",
        "source": "condowner"
      },
      "AABarTechnoLowPass": {
        "friendly": "AABarTechnoLowPass",
        "short": "Sink",
        "source": "condowner"
      },
      "AAUnderwater": {
        "friendly": "AAUnderwater",
        "short": "Sink",
        "source": "condowner"
      },
      "ItmFusionABLWall01Loose": {
        "friendly": "Ablative Core Liner Replacement (Loose)",
        "short": "ABL Core Liner",
        "category": [
          "FusionParts"
        ],
        "basePrice": 7979.0,
        "mass": 28.0,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmHatch01Loose": {
        "friendly": "Access Hatch (Loose)",
        "category": [
          "Hull"
        ],
        "basePrice": 535.0,
        "mass": 88.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmStabilizerActive01DmgLoose": {
        "friendly": "Active Stabilizer (Damaged, Loose)",
        "short": "Active Stabilizer",
        "category": [
          "Hull"
        ],
        "basePrice": 37914.0,
        "mass": 35.0,
        "durability": 13.0,
        "source": "condowner"
      },
      "ItmStabilizerActive01Loose": {
        "friendly": "Active Stabilizer (Loose)",
        "short": "Active Stabilizer",
        "category": [
          "Hull"
        ],
        "basePrice": 156774.0,
        "mass": 40.0,
        "durability": 30.0,
        "source": "condowner"
      },
      "ItmAICargo01Loose": {
        "friendly": "AI Cargo (Loose)",
        "short": "AI Cargo",
        "category": [
          "Electronics"
        ],
        "basePrice": 44100.0,
        "mass": 61.0,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmAICargo01LooseDmg": {
        "friendly": "AI Cargo (Loose, Damaged)",
        "short": "AI Cargo",
        "category": [
          "Electronics"
        ],
        "basePrice": 5610.0,
        "mass": 61.0,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmAICargo01OffLoose": {
        "friendly": "AI Cargo (Off, Loose)",
        "short": "AI Cargo",
        "category": [
          "Electronics"
        ],
        "basePrice": 11200.0,
        "mass": 61.0,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmAirPump03DmgLoose": {
        "friendly": "Air Pump (Damaged, Loose)",
        "category": [
          "HVAC"
        ],
        "basePrice": 510.0,
        "mass": 11.0,
        "durability": 11.0,
        "source": "cooverlay"
      },
      "ItmAirPump02DmgLoose": {
        "friendly": "Air Pump (Damaged, Loose)",
        "short": "Pump",
        "category": [
          "HVAC"
        ],
        "basePrice": 510.0,
        "mass": 11.0,
        "durability": 11.0,
        "source": "condowner"
      },
      "ItmAirPump03OffLoose": {
        "friendly": "Air Pump (Loose)",
        "category": [
          "HVAC"
        ],
        "basePrice": 2050.0,
        "mass": 11.0,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmAirPump02OffLoose": {
        "friendly": "Air Pump (Loose)",
        "short": "Pump",
        "category": [
          "HVAC"
        ],
        "basePrice": 2050.0,
        "mass": 11.0,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmVent01Loose": {
        "friendly": "Air Vent (Loose)",
        "short": "Vent",
        "category": [
          "HVAC"
        ],
        "basePrice": 335.0,
        "mass": 8.0,
        "durability": 15.0,
        "source": "condowner"
      },
      "ItmAmmoCasings01": {
        "friendly": "Ammo Casings",
        "category": [
          "Weapons"
        ],
        "basePrice": 1.0,
        "mass": 0.004,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmAmmo38": {
        "friendly": "Ammo: .38 Special",
        "short": "Ammo: .38",
        "category": [
          "Weapons"
        ],
        "basePrice": 35.0,
        "mass": 0.0164,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmAmmo45": {
        "friendly": "Ammo: .45 ACP",
        "short": "Ammo: .45",
        "category": [
          "Weapons"
        ],
        "basePrice": 50.0,
        "mass": 0.015,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmAmmo12Gauge": {
        "friendly": "Ammo: 12-gauge 00 Buckshot",
        "short": "Ammo: Shotshell",
        "category": [
          "Weapons"
        ],
        "basePrice": 5.0,
        "mass": 0.0319,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmAmmo12GaugeHG": {
        "friendly": "Ammo: 12-gauge HG Shotshell",
        "short": "Ammo: HG Shotshell",
        "category": [
          "Weapons"
        ],
        "basePrice": 1115.0,
        "mass": 0.0319,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmAmmo150mm": {
        "friendly": "Ammo: 150mm",
        "category": [
          "Weapons"
        ],
        "basePrice": 100.0,
        "mass": 2.0,
        "durability": 20.0,
        "source": "condowner"
      },
      "ItmAmmo20mm": {
        "friendly": "Ammo: 20mm",
        "category": [
          "Weapons"
        ],
        "basePrice": 5.0,
        "mass": 0.0319,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmAmmo556": {
        "friendly": "Ammo: 5.56mm",
        "category": [
          "Weapons"
        ],
        "basePrice": 5.0,
        "mass": 0.01231,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmAmmo58": {
        "friendly": "Ammo: 5.8mm",
        "category": [
          "Weapons"
        ],
        "basePrice": 5.0,
        "mass": 0.01231,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmAmmo9mm": {
        "friendly": "Ammo: 9mm FMJ",
        "short": "Ammo: 9mm",
        "category": [
          "Weapons"
        ],
        "basePrice": 25.0,
        "mass": 0.01,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmAmmoHullsafe": {
        "friendly": "Ammo: 9mm HG",
        "category": [
          "Weapons"
        ],
        "basePrice": 5.0,
        "mass": 0.01,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmAmmoBolt": {
        "friendly": "Ammo: Crossbow Bolt",
        "short": "Ammo: Bolt",
        "category": [
          "Weapons"
        ],
        "basePrice": 5.0,
        "mass": 0.01,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmAmmo556HG": {
        "friendly": "Ammo: HG 5.56mm",
        "category": [
          "Weapons"
        ],
        "basePrice": 5.0,
        "mass": 0.01231,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmAmmoPowerCell01": {
        "friendly": "Ammo: Power Cell",
        "category": [
          "Weapons"
        ],
        "basePrice": 101.99,
        "mass": 1.4,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmAmmo55602": {
        "friendly": "Ammo: Special 5.56mm",
        "short": "Ammo: 5.56mm",
        "category": [
          "Weapons"
        ],
        "basePrice": 5.0,
        "mass": 0.01231,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmOssifexPen01": {
        "friendly": "Anti Atrophy Pen Injector: Ossifex",
        "short": "Ossifex Pen",
        "category": [
          "Medical"
        ],
        "basePrice": 7000.0,
        "mass": 0.4,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmAntiGravPen01": {
        "friendly": "Anti G-LOC Pen Injector: Gravusine",
        "short": "Gravusine Pen",
        "category": [
          "Medical"
        ],
        "basePrice": 1000.0,
        "mass": 0.4,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmAntiHypoVPen01": {
        "friendly": "AntiHypo-V Pen Injector: Sanguifil",
        "short": "AntiHypo-V Pen",
        "category": [
          "Medical"
        ],
        "basePrice": 10000.0,
        "mass": 0.4,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmAntiRadPen01": {
        "friendly": "AntiRad Pen Injector: ChymAdd",
        "short": "AntiRad Pen",
        "category": [
          "Medical"
        ],
        "basePrice": 10000.0,
        "mass": 0.4,
        "durability": 4.0,
        "source": "condowner"
      },
      "DataSNDSavedApology": {
        "friendly": "APOLOGY.SND",
        "source": "cooverlay"
      },
      "DataTXTDebitAppOutdated": {
        "friendly": "APPDEBITFORM.TXT",
        "source": "cooverlay"
      },
      "ItmArcadeGame01DmgLoose": {
        "friendly": "Arcade Gaming Cabinet (Damaged Loose)",
        "short": "Arcade Game",
        "category": [
          "Media"
        ],
        "basePrice": 1890.0,
        "mass": 40.0,
        "durability": 12.0,
        "source": "condowner"
      },
      "ItmArcadeGame01Loose": {
        "friendly": "Arcade Gaming Cabinet (Loose)",
        "short": "Arcade Game",
        "category": [
          "Media"
        ],
        "basePrice": 9450.0,
        "mass": 44.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "BodyarmLowerLB": {
        "friendly": "Arm: Lower Left",
        "mass": 1.05,
        "source": "cooverlay"
      },
      "BodyarmLowerLC": {
        "friendly": "Arm: Lower Left",
        "mass": 1.05,
        "source": "cooverlay"
      },
      "BodyarmLowerLA02": {
        "friendly": "Arm: Lower Left",
        "mass": 1.05,
        "source": "cooverlay"
      },
      "BodyarmLowerLB02": {
        "friendly": "Arm: Lower Left",
        "mass": 1.05,
        "source": "cooverlay"
      },
      "BodyarmLowerLC02": {
        "friendly": "Arm: Lower Left",
        "mass": 1.05,
        "source": "cooverlay"
      },
      "BodyarmLowerRB": {
        "friendly": "Arm: Lower Right",
        "mass": 1.05,
        "source": "cooverlay"
      },
      "BodyarmLowerRC": {
        "friendly": "Arm: Lower Right",
        "mass": 1.05,
        "source": "cooverlay"
      },
      "BodyarmLowerRA02": {
        "friendly": "Arm: Lower Right",
        "mass": 1.05,
        "source": "cooverlay"
      },
      "BodyarmLowerRB02": {
        "friendly": "Arm: Lower Right",
        "mass": 1.05,
        "source": "cooverlay"
      },
      "BodyarmLowerRC02": {
        "friendly": "Arm: Lower Right",
        "mass": 1.05,
        "source": "cooverlay"
      },
      "BodyarmUpperLB": {
        "friendly": "Arm: Upper Left",
        "mass": 1.841,
        "source": "cooverlay"
      },
      "BodyarmUpperLC": {
        "friendly": "Arm: Upper Left",
        "mass": 1.841,
        "source": "cooverlay"
      },
      "BodyarmUpperLA02": {
        "friendly": "Arm: Upper Left",
        "mass": 1.841,
        "source": "cooverlay"
      },
      "BodyarmUpperLB02": {
        "friendly": "Arm: Upper Left",
        "mass": 1.841,
        "source": "cooverlay"
      },
      "BodyarmUpperLC02": {
        "friendly": "Arm: Upper Left",
        "mass": 1.841,
        "source": "cooverlay"
      },
      "BodyarmUpperRB": {
        "friendly": "Arm: Upper Right",
        "mass": 1.841,
        "source": "cooverlay"
      },
      "BodyarmUpperRC": {
        "friendly": "Arm: Upper Right",
        "mass": 1.841,
        "source": "cooverlay"
      },
      "BodyarmUpperRA02": {
        "friendly": "Arm: Upper Right",
        "mass": 1.841,
        "source": "cooverlay"
      },
      "BodyarmUpperRB02": {
        "friendly": "Arm: Upper Right",
        "mass": 1.841,
        "source": "cooverlay"
      },
      "BodyarmUpperRC02": {
        "friendly": "Arm: Upper Right",
        "mass": 1.841,
        "source": "cooverlay"
      },
      "ItmSignalBeacon01DmgLoose": {
        "friendly": "ASC \"SB-03a\" Microsatellite Beacon (Damaged, Loose)",
        "short": "Beacon",
        "category": [
          "Sensors"
        ],
        "basePrice": 290.0,
        "mass": 1.35,
        "durability": 13.0,
        "source": "condowner"
      },
      "ItmSignalBeacon01Loose": {
        "friendly": "ASC \"SB-03a\" Microsatellite Beacon (Loose)",
        "short": "Beacon",
        "category": [
          "Sensors"
        ],
        "basePrice": 15.0,
        "mass": 6.5,
        "durability": 15.0,
        "source": "condowner"
      },
      "ItmVent02Loose": {
        "friendly": "Auto Air Vent (Loose)",
        "short": "Auto-Vent",
        "category": [
          "HVAC"
        ],
        "basePrice": 2335.0,
        "mass": 10.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "DataBINRobotCracker": {
        "friendly": "B43-B-G0N3.BIN",
        "source": "cooverlay"
      },
      "SOCBanterBreakout": {
        "friendly": "Banter: Breakout",
        "source": "condowner"
      },
      "ItmTable01Loose": {
        "friendly": "Bar Table (Loose)",
        "short": "Table",
        "category": [
          "Furniture"
        ],
        "basePrice": 213.0,
        "mass": 20.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmWeaponBaseballBat01": {
        "friendly": "Bat",
        "category": [
          "Weapons"
        ],
        "basePrice": 25.0,
        "mass": 0.907,
        "durability": 15.0,
        "source": "condowner"
      },
      "ItmChargerBattDrill01OffLoose": {
        "friendly": "Battery Charger: Gott (Loose)",
        "short": "Battery Charger",
        "category": [
          "Electronics"
        ],
        "basePrice": 25.99,
        "mass": 0.55,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmChargerBattDrill01DmgLoose": {
        "friendly": "Battery Charger: Gott (Loose, Damaged)",
        "short": "Battery Charger",
        "category": [
          "Electronics"
        ],
        "basePrice": 6.5,
        "mass": 0.55,
        "durability": 19.0,
        "source": "condowner"
      },
      "ItmChargerBattWelder01OffLoose": {
        "friendly": "Battery Charger: Halvorson (Loose)",
        "short": "Battery Charger",
        "category": [
          "Electronics"
        ],
        "basePrice": 24.49,
        "mass": 0.62,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmChargerBattWelder01DmgLoose": {
        "friendly": "Battery Charger: Halvorson (Loose, Damaged)",
        "short": "Battery Charger",
        "category": [
          "Electronics"
        ],
        "basePrice": 4.49,
        "mass": 0.62,
        "durability": 19.0,
        "source": "condowner"
      },
      "ItmChargerBattEVAOffLoose": {
        "friendly": "Battery Charging Station: Bingham-12 EVA (Loose)",
        "short": "Battery Charger",
        "category": [
          "Electronics"
        ],
        "basePrice": 786.0,
        "mass": 25.0,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmChargerBattEVADmgLoose": {
        "friendly": "Battery Charging Station: Bingham-12 EVA (Loose, Damaged)",
        "short": "Battery Charger",
        "category": [
          "Electronics"
        ],
        "basePrice": 157.0,
        "mass": 25.0,
        "durability": 19.0,
        "source": "condowner"
      },
      "ItmChargerBattery04OffLoose": {
        "friendly": "Battery Charging Station: Weber Laser (Loose)",
        "short": "Battery Charger",
        "category": [
          "Electronics"
        ],
        "basePrice": 786.0,
        "mass": 25.0,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmChargerBattery04DmgLoose": {
        "friendly": "Battery Charging Station: Weber Laser (Loose, Damaged)",
        "short": "Battery Charger",
        "category": [
          "Electronics"
        ],
        "basePrice": 157.0,
        "mass": 25.0,
        "durability": 16.0,
        "source": "condowner"
      },
      "ItmBatteryDisp01": {
        "friendly": "Battery: Azul Disposable BB ",
        "short": "Sm Battery",
        "category": [
          "Electronics"
        ],
        "basePrice": 15.0,
        "mass": 0.13,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmBattery03": {
        "friendly": "Battery: Bingham-12 EVA",
        "short": "EVA Battery",
        "category": [
          "Electronics"
        ],
        "basePrice": 300.0,
        "mass": 11.5,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmBattery03Dmg": {
        "friendly": "Battery: Bingham-12 EVA (Damaged)",
        "short": "EVA Battery",
        "category": [
          "Electronics"
        ],
        "basePrice": 55.0,
        "mass": 11.5,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmBatteryDrill01": {
        "friendly": "Battery: Gott Power Tools",
        "short": "Battery",
        "category": [
          "Electronics"
        ],
        "basePrice": 57.8,
        "mass": 1.04,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmBatteryDrill01Dmg": {
        "friendly": "Battery: Gott Power Tools (Damaged)",
        "short": "Battery",
        "category": [
          "Electronics"
        ],
        "basePrice": 14.8,
        "mass": 1.04,
        "durability": 8.0,
        "source": "condowner"
      },
      "ItmBatteryWelder01": {
        "friendly": "Battery: Halvorson Power Tools",
        "short": "Battery",
        "category": [
          "Electronics"
        ],
        "basePrice": 48.6,
        "mass": 1.04,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmBatteryWelder01Dmg": {
        "friendly": "Battery: Halvorson Power Tools (Damaged)",
        "short": "Battery",
        "category": [
          "Electronics"
        ],
        "basePrice": 8.6,
        "mass": 1.04,
        "durability": 8.0,
        "source": "condowner"
      },
      "ItmBattery04": {
        "friendly": "Battery: Weber Laser Torch",
        "short": "Battery",
        "category": [
          "Electronics"
        ],
        "basePrice": 8640.0,
        "mass": 11.5,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmBattery04Dmg": {
        "friendly": "Battery: Weber Laser Torch (Damaged)",
        "short": "Battery",
        "category": [
          "Electronics"
        ],
        "basePrice": 1640.0,
        "mass": 11.5,
        "durability": 8.0,
        "source": "condowner"
      },
      "DataSNDPercussion": {
        "friendly": "BEATS.SND",
        "source": "cooverlay"
      },
      "ItmBed02Loose": {
        "friendly": "Bed",
        "category": [
          "Furniture"
        ],
        "basePrice": 457.0,
        "mass": 19.0,
        "durability": 18.0,
        "source": "condowner"
      },
      "DataTXTMergaLongFingerSerialKiller": {
        "friendly": "BEWARE_THE_HAND.TXT",
        "source": "cooverlay"
      },
      "Robot02": {
        "friendly": "Beydat \"Enforcer\" Heavy Security & Construction Drone",
        "short": "Robot",
        "mass": 54.15,
        "source": "condowner"
      },
      "ItmJukebox01Loose": {
        "friendly": "Beydat \"Rock-It\" Jukebox (Loose)",
        "short": "Jukebox",
        "category": [
          "Media"
        ],
        "basePrice": 553.0,
        "mass": 0.5,
        "durability": 10.0,
        "source": "condowner"
      },
      "Robot01": {
        "friendly": "Beydat \"Weaver\" Light Construction Drone",
        "short": "Robot",
        "mass": 54.15,
        "source": "condowner"
      },
      "OutfitHelmet03": {
        "friendly": "Bingham-12 EVA Helmet",
        "short": "EVA Helmet",
        "category": [
          "SpaceSuits"
        ],
        "basePrice": 2500.0,
        "mass": 2.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "OutfitHelmet03Dmg": {
        "friendly": "Bingham-12 EVA Helmet (Damaged)",
        "short": "EVA Helmet",
        "category": [
          "SpaceSuits"
        ],
        "basePrice": 503.0,
        "mass": 2.0,
        "durability": 30.0,
        "source": "condowner"
      },
      "OutfitEVA01": {
        "friendly": "Bingham-12 EVA Suit",
        "short": "EVA Suit",
        "category": [
          "SpaceSuits"
        ],
        "basePrice": 7000.0,
        "mass": 50.0,
        "durability": 6.0,
        "source": "condowner"
      },
      "OutfitEVA01Dmg": {
        "friendly": "Bingham-12 EVA Suit (Damaged)",
        "short": "EVA Suit",
        "category": [
          "SpaceSuits"
        ],
        "basePrice": 1400.0,
        "mass": 50.0,
        "durability": 14.0,
        "source": "condowner"
      },
      "OutfitEVA01Off": {
        "friendly": "Bingham-12 EVA Suit (Off)",
        "short": "EVA Suit",
        "category": [
          "SpaceSuits"
        ],
        "basePrice": 7000.0,
        "mass": 50.0,
        "durability": 6.0,
        "source": "condowner"
      },
      "OutfitHelmet04": {
        "friendly": "Bingham-12B EVA Helmet",
        "category": [
          "SpaceSuits"
        ],
        "basePrice": 2500.0,
        "mass": 2.0,
        "durability": 10.0,
        "source": "cooverlay"
      },
      "OutfitHelmet04Dmg": {
        "friendly": "Bingham-12B EVA Helmet (Damaged)",
        "category": [
          "SpaceSuits"
        ],
        "basePrice": 503.0,
        "mass": 2.0,
        "durability": 30.0,
        "source": "cooverlay"
      },
      "OutfitEVA03": {
        "friendly": "Bingham-12B EVA Suit",
        "category": [
          "SpaceSuits"
        ],
        "basePrice": 7000.0,
        "mass": 50.0,
        "durability": 6.0,
        "source": "cooverlay"
      },
      "OutfitEVA03Dmg": {
        "friendly": "Bingham-12B EVA Suit (Damaged)",
        "category": [
          "SpaceSuits"
        ],
        "basePrice": 1400.0,
        "mass": 50.0,
        "durability": 14.0,
        "source": "cooverlay"
      },
      "OutfitEVA03Off": {
        "friendly": "Bingham-12B EVA Suit (Off)",
        "category": [
          "SpaceSuits"
        ],
        "basePrice": 7000.0,
        "mass": 50.0,
        "durability": 6.0,
        "source": "cooverlay"
      },
      "OutfitHelmet05": {
        "friendly": "Bingham-12C EVA Helmet",
        "category": [
          "SpaceSuits"
        ],
        "basePrice": 2500.0,
        "mass": 2.0,
        "durability": 10.0,
        "source": "cooverlay"
      },
      "OutfitHelmet05Dmg": {
        "friendly": "Bingham-12C EVA Helmet (Damaged)",
        "category": [
          "SpaceSuits"
        ],
        "basePrice": 503.0,
        "mass": 2.0,
        "durability": 30.0,
        "source": "cooverlay"
      },
      "OutfitEVA05": {
        "friendly": "Bingham-12C EVA Suit",
        "category": [
          "SpaceSuits"
        ],
        "basePrice": 7000.0,
        "mass": 50.0,
        "durability": 6.0,
        "source": "cooverlay"
      },
      "OutfitEVA05Dmg": {
        "friendly": "Bingham-12C EVA Suit (Damaged)",
        "category": [
          "SpaceSuits"
        ],
        "basePrice": 1400.0,
        "mass": 50.0,
        "durability": 14.0,
        "source": "cooverlay"
      },
      "OutfitEVA05Off": {
        "friendly": "Bingham-12C EVA Suit (Off)",
        "category": [
          "SpaceSuits"
        ],
        "basePrice": 7000.0,
        "mass": 50.0,
        "durability": 6.0,
        "source": "cooverlay"
      },
      "OutfitHelmet06": {
        "friendly": "Bingham-12D EVA Helmet",
        "category": [
          "SpaceSuits"
        ],
        "basePrice": 2500.0,
        "mass": 2.0,
        "durability": 10.0,
        "source": "cooverlay"
      },
      "OutfitHelmet06Dmg": {
        "friendly": "Bingham-12D EVA Helmet (Damaged)",
        "category": [
          "SpaceSuits"
        ],
        "basePrice": 503.0,
        "mass": 2.0,
        "durability": 30.0,
        "source": "cooverlay"
      },
      "OutfitEVA06": {
        "friendly": "Bingham-12D EVA Suit",
        "category": [
          "SpaceSuits"
        ],
        "basePrice": 7000.0,
        "mass": 50.0,
        "durability": 6.0,
        "source": "cooverlay"
      },
      "OutfitEVA06Dmg": {
        "friendly": "Bingham-12D EVA Suit (Damaged)",
        "category": [
          "SpaceSuits"
        ],
        "basePrice": 1400.0,
        "mass": 50.0,
        "durability": 14.0,
        "source": "cooverlay"
      },
      "OutfitEVA06Off": {
        "friendly": "Bingham-12D EVA Suit (Off)",
        "category": [
          "SpaceSuits"
        ],
        "basePrice": 7000.0,
        "mass": 50.0,
        "durability": 6.0,
        "source": "cooverlay"
      },
      "OutfitHelmet07": {
        "friendly": "Bingham-12E EVA Helmet",
        "category": [
          "SpaceSuits"
        ],
        "basePrice": 2500.0,
        "mass": 2.0,
        "durability": 10.0,
        "source": "cooverlay"
      },
      "OutfitHelmet07Dmg": {
        "friendly": "Bingham-12E EVA Helmet (Damaged)",
        "category": [
          "SpaceSuits"
        ],
        "basePrice": 503.0,
        "mass": 2.0,
        "durability": 30.0,
        "source": "cooverlay"
      },
      "OutfitEVA07": {
        "friendly": "Bingham-12E EVA Suit",
        "category": [
          "SpaceSuits"
        ],
        "basePrice": 7000.0,
        "mass": 50.0,
        "durability": 6.0,
        "source": "cooverlay"
      },
      "OutfitEVA07Dmg": {
        "friendly": "Bingham-12E EVA Suit (Damaged)",
        "category": [
          "SpaceSuits"
        ],
        "basePrice": 1400.0,
        "mass": 50.0,
        "durability": 14.0,
        "source": "cooverlay"
      },
      "OutfitEVA07Off": {
        "friendly": "Bingham-12E EVA Suit (Off)",
        "category": [
          "SpaceSuits"
        ],
        "basePrice": 7000.0,
        "mass": 50.0,
        "durability": 6.0,
        "source": "cooverlay"
      },
      "OutfitHelmet08": {
        "friendly": "Bingham-12F EVA Helmet",
        "category": [
          "SpaceSuits"
        ],
        "basePrice": 2500.0,
        "mass": 2.0,
        "durability": 10.0,
        "source": "cooverlay"
      },
      "OutfitHelmet08Dmg": {
        "friendly": "Bingham-12F EVA Helmet (Damaged)",
        "category": [
          "SpaceSuits"
        ],
        "basePrice": 503.0,
        "mass": 2.0,
        "durability": 30.0,
        "source": "cooverlay"
      },
      "OutfitEVA08": {
        "friendly": "Bingham-12F EVA Suit",
        "category": [
          "SpaceSuits"
        ],
        "basePrice": 7000.0,
        "mass": 50.0,
        "durability": 6.0,
        "source": "cooverlay"
      },
      "OutfitEVA08Dmg": {
        "friendly": "Bingham-12F EVA Suit (Damaged)",
        "category": [
          "SpaceSuits"
        ],
        "basePrice": 1400.0,
        "mass": 50.0,
        "durability": 14.0,
        "source": "cooverlay"
      },
      "OutfitEVA08Off": {
        "friendly": "Bingham-12F EVA Suit (Off)",
        "category": [
          "SpaceSuits"
        ],
        "basePrice": 7000.0,
        "mass": 50.0,
        "durability": 6.0,
        "source": "cooverlay"
      },
      "OutfitHelmet09": {
        "friendly": "Bingham-12G EVA Helmet",
        "category": [
          "SpaceSuits"
        ],
        "basePrice": 2500.0,
        "mass": 2.0,
        "durability": 10.0,
        "source": "cooverlay"
      },
      "OutfitHelmet09Dmg": {
        "friendly": "Bingham-12G EVA Helmet (Damaged)",
        "category": [
          "SpaceSuits"
        ],
        "basePrice": 503.0,
        "mass": 2.0,
        "durability": 30.0,
        "source": "cooverlay"
      },
      "OutfitEVA09": {
        "friendly": "Bingham-12G EVA Suit",
        "category": [
          "SpaceSuits"
        ],
        "basePrice": 7000.0,
        "mass": 50.0,
        "durability": 6.0,
        "source": "cooverlay"
      },
      "OutfitEVA09Dmg": {
        "friendly": "Bingham-12G EVA Suit (Damaged)",
        "category": [
          "SpaceSuits"
        ],
        "basePrice": 1400.0,
        "mass": 50.0,
        "durability": 14.0,
        "source": "cooverlay"
      },
      "OutfitEVA09Off": {
        "friendly": "Bingham-12G EVA Suit (Off)",
        "category": [
          "SpaceSuits"
        ],
        "basePrice": 7000.0,
        "mass": 50.0,
        "durability": 6.0,
        "source": "cooverlay"
      },
      "Plot_Whodunnit_VictimDNA": {
        "friendly": "Biological Samples from Victim",
        "short": "DNA Samples",
        "category": [
          "Trash"
        ],
        "basePrice": 0.1,
        "mass": 0.0002,
        "durability": 1.0,
        "source": "condowner"
      },
      "LiquidVodka": {
        "friendly": "Bismertnaya Vodka",
        "short": "Vodka",
        "category": [
          "Intoxicants"
        ],
        "basePrice": 42.5,
        "mass": 0.035,
        "source": "condowner"
      },
      "Blank": {
        "friendly": "Blank",
        "source": "condowner"
      },
      "LiquidBlood": {
        "friendly": "Blood",
        "category": [
          "Medical"
        ],
        "basePrice": 0.6,
        "mass": 0.2625,
        "source": "condowner"
      },
      "Plot_Whodunnit_VictimLiquidBlood": {
        "friendly": "Blood from Victim",
        "short": "Victim's Blood",
        "category": [
          "Medical"
        ],
        "basePrice": 0.6,
        "mass": 0.2625,
        "source": "cooverlay"
      },
      "DataBINBreakout2K79Mods": {
        "friendly": "BO2k79_MODPACK.BIN",
        "source": "cooverlay"
      },
      "ItmAmmoMissile02": {
        "friendly": "Brave New World 'Little Dragon 小龙' Missile",
        "short": "Missile",
        "category": [
          "Weapons"
        ],
        "basePrice": 9000.0,
        "mass": 80.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "DataSNDAttack03": {
        "friendly": "BREACHINGTEAM.SND",
        "source": "cooverlay"
      },
      "DataSNDBreathing": {
        "friendly": "BREATH.SND",
        "source": "cooverlay"
      },
      "ItmDrinkBottle01Dmg": {
        "friendly": "Broken Bottle",
        "short": "Bottle",
        "category": [
          "Weapons"
        ],
        "basePrice": 0.3,
        "mass": 0.32,
        "durability": 3.0,
        "source": "condowner"
      },
      "OutfitSuit01": {
        "friendly": "Brown Duster",
        "short": "Coat",
        "category": [
          "Textiles"
        ],
        "basePrice": 225.0,
        "mass": 1.0,
        "durability": 4.0,
        "source": "condowner"
      },
      "Cancel": {
        "friendly": "Cancel",
        "source": "condowner"
      },
      "DataSNDAttack": {
        "friendly": "CAPTAIN_LOG.SND",
        "source": "cooverlay"
      },
      "OutfitCargoPants03": {
        "friendly": "Cargo Pants: Beige",
        "category": [
          "Textiles"
        ],
        "basePrice": 73.0,
        "mass": 0.25,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "OutfitCargoPants04": {
        "friendly": "Cargo Pants: Brick",
        "category": [
          "Textiles"
        ],
        "basePrice": 73.0,
        "mass": 0.25,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "OutfitCargoPants01": {
        "friendly": "Cargo Pants: Navy",
        "category": [
          "Textiles"
        ],
        "basePrice": 73.0,
        "mass": 0.25,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmPantsCargo01": {
        "friendly": "Cargo Pants: Navy",
        "short": "Pants",
        "category": [
          "Textiles"
        ],
        "basePrice": 73.0,
        "mass": 0.25,
        "durability": 4.0,
        "source": "condowner"
      },
      "OutfitCargoPants02": {
        "friendly": "Cargo Pants: Orange",
        "category": [
          "Textiles"
        ],
        "basePrice": 73.0,
        "mass": 0.25,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmCargoPod01DmgLoose": {
        "friendly": "Cargo Pod (Damaged, Loose)",
        "short": "Cargo Pod",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 1000.0,
        "mass": 50.0,
        "durability": 50.0,
        "source": "condowner"
      },
      "ItmCargoPod01Loose": {
        "friendly": "Cargo Pod (Loose)",
        "short": "Cargo Pod",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 5000.0,
        "mass": 50.0,
        "durability": 50.0,
        "source": "condowner"
      },
      "ItmCargoPodClimate01DmgLoose": {
        "friendly": "Cargo Pod Frame: Climate-Controlled (Damaged, Loose)",
        "short": "Cargo Frame",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 2400.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "condowner"
      },
      "ItmCargoPodClimate01Loose": {
        "friendly": "Cargo Pod: Climate-Controlled (Loose)",
        "short": "Cargo Pod",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 12000.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "condowner"
      },
      "ItmCargoPodRad01DmgLoose": {
        "friendly": "Cargo Pod: Radiation-shielded (Damaged, Loose)",
        "short": "Cargo Pod",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 2400.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "condowner"
      },
      "ItmCargoPodRad01Loose": {
        "friendly": "Cargo Pod: Radiation-shielded (Loose)",
        "short": "Cargo Pod",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 12000.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "condowner"
      },
      "ItmCargoPodSpec01DmgLoose": {
        "friendly": "Cargo Pod: Specialty (Damaged, Loose)",
        "short": "Cargo Pod",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 4000.0,
        "mass": 50.0,
        "durability": 80.0,
        "source": "condowner"
      },
      "ItmCargoPodSpec01Loose": {
        "friendly": "Cargo Pod: Specialty (Loose)",
        "short": "Cargo Pod",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 20000.0,
        "mass": 50.0,
        "durability": 80.0,
        "source": "condowner"
      },
      "ItmCargoWeb01Loose": {
        "friendly": "Cargo Web (Loose)",
        "short": "Cargo Web",
        "category": [
          "Hull"
        ],
        "basePrice": 174.0,
        "mass": 2.5,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmCargoWeb01DmgLoose": {
        "friendly": "Cargo Web (Loose, Damaged)",
        "short": "Cargo Web",
        "category": [
          "Hull"
        ],
        "basePrice": 121.0,
        "mass": 2.5,
        "durability": 7.0,
        "source": "condowner"
      },
      "ItmDocumentWhodunnit01": {
        "friendly": "Case File: Death Investigation",
        "short": "Case File",
        "category": [
          "Media"
        ],
        "basePrice": 0.15,
        "mass": 0.005,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmChair02DmgLoose": {
        "friendly": "Chair (Damaged Loose)",
        "short": "Chair",
        "category": [
          "Furniture"
        ],
        "basePrice": 17.0,
        "mass": 9.0,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmChair02Loose": {
        "friendly": "Chair (Loose)",
        "short": "Chair",
        "category": [
          "Furniture"
        ],
        "basePrice": 85.0,
        "mass": 11.0,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmBartop02Loose": {
        "friendly": "Cherry Wood Bartop (Loose)",
        "short": "Bartop",
        "category": [
          "LuxuryGoods"
        ],
        "basePrice": 13149.0,
        "mass": 47.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmBartop03Loose": {
        "friendly": "Cherry Wood Bartop Corner (Loose)",
        "short": "Bar Corner",
        "category": [
          "LuxuryGoods"
        ],
        "basePrice": 16849.0,
        "mass": 47.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "LiquidBloodMeat": {
        "friendly": "Chunky Blood",
        "category": [
          "Medical"
        ],
        "basePrice": 0.6,
        "mass": 0.2625,
        "source": "cooverlay"
      },
      "SOCCigarette": {
        "friendly": "Cigarette",
        "source": "condowner"
      },
      "ItmCigStub": {
        "friendly": "Cigarette Stub",
        "short": "Cig Stub",
        "category": [
          "Trash"
        ],
        "basePrice": 0.0,
        "mass": 0.0002,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmRTACO2DmgLoose": {
        "friendly": "CO2 Canister (Damaged, Loose)",
        "short": "CO2 Can",
        "category": [
          "LifeSupport"
        ],
        "basePrice": 53.0,
        "mass": 115.0,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmRTACO2Loose": {
        "friendly": "CO2 Canister (Loose)",
        "short": "CO2 Can",
        "category": [
          "LifeSupport"
        ],
        "basePrice": 410.0,
        "mass": 115.0,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmFilterCO202": {
        "friendly": "CO2 Filter: EVA",
        "short": "CO2 Filter",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 235.0,
        "mass": 2.5,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmFilterCO202Dmg": {
        "friendly": "CO2 Filter: EVA (Damaged)",
        "short": "CO2 Filter",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 235.0,
        "mass": 2.5,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmAlarmCO2DmgLoose": {
        "friendly": "CO2 Pressure Alarm (Damaged, Loose)",
        "short": "CO2 Alarm",
        "category": [
          "Sensors"
        ],
        "basePrice": 121.0,
        "mass": 0.5,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmAlarmCO2OffLoose": {
        "friendly": "CO2 Pressure Alarm (Loose)",
        "short": "CO2 Alarm",
        "category": [
          "Sensors"
        ],
        "basePrice": 634.0,
        "mass": 0.5,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmFilterCO201": {
        "friendly": "CO2 Scrubber Cartridge",
        "short": "CO2 Cartridge",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 235.0,
        "mass": 2.5,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmFilterCO201Dmg": {
        "friendly": "CO2 Scrubber Cartridge (Damaged)",
        "short": "CO2 Cartridge",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 235.0,
        "mass": 2.5,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmShipWeaponMassThrower01DmgLoose": {
        "friendly": "Coilgun (Damaged, Loose)",
        "short": "Coilgun",
        "basePrice": 5000.0,
        "mass": 200.0,
        "durability": 23.0,
        "source": "condowner"
      },
      "ItmShipWeaponMassThrower01Loose": {
        "friendly": "Coilgun (Loose)",
        "short": "Coilgun",
        "basePrice": 25000.0,
        "mass": 200.0,
        "durability": 18.0,
        "source": "condowner"
      },
      "ItmBattery02bLoose": {
        "friendly": "Compact S Ship Battery (Loose)",
        "short": "Battery",
        "category": [
          "Electronics"
        ],
        "basePrice": 1575.0,
        "mass": 27.0,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmBattery02bDmgLoose": {
        "friendly": "Compact S Ship Battery (Loose, Damaged)",
        "short": "Battery",
        "category": [
          "Electronics"
        ],
        "basePrice": 390.0,
        "mass": 27.0,
        "durability": 18.0,
        "source": "condowner"
      },
      "Compartment": {
        "friendly": "Compartment",
        "source": "condowner"
      },
      "ItmHeatSink01": {
        "friendly": "Component: Heat Sink",
        "short": "Heat Sink",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 27.5,
        "mass": 1.5,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmComponentMobo01": {
        "friendly": "Component: Motherboard",
        "short": "Motherboard",
        "category": [
          "Electronics"
        ],
        "basePrice": 17.5,
        "mass": 0.5,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmComponentMotor01": {
        "friendly": "Component: Motor",
        "short": "Motor",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 37.5,
        "mass": 2.5,
        "durability": 5.0,
        "source": "condowner"
      },
      "OutfitLeggings01f": {
        "friendly": "Compression Leggings: Black",
        "category": [
          "Textiles"
        ],
        "basePrice": 101.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitLeggings01c": {
        "friendly": "Compression Leggings: Blue",
        "category": [
          "Textiles"
        ],
        "basePrice": 101.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitLeggings01g": {
        "friendly": "Compression Leggings: Brown",
        "category": [
          "Textiles"
        ],
        "basePrice": 101.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitLeggings01h": {
        "friendly": "Compression Leggings: Olive",
        "category": [
          "Textiles"
        ],
        "basePrice": 101.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitLeggings01i": {
        "friendly": "Compression Leggings: Pink",
        "category": [
          "Textiles"
        ],
        "basePrice": 101.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitLeggings01e": {
        "friendly": "Compression Leggings: Purple",
        "category": [
          "Textiles"
        ],
        "basePrice": 101.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitLeggings01a": {
        "friendly": "Compression Leggings: Red",
        "category": [
          "Textiles"
        ],
        "basePrice": 101.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitLeggings01d": {
        "friendly": "Compression Leggings: Tan",
        "category": [
          "Textiles"
        ],
        "basePrice": 101.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitLeggings01b": {
        "friendly": "Compression Leggings: Teal",
        "category": [
          "Textiles"
        ],
        "basePrice": 101.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitLeggings01": {
        "friendly": "Compression Leggings: Yellow",
        "category": [
          "Textiles"
        ],
        "basePrice": 101.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "ItmLeggings01": {
        "friendly": "Compression Leggings: Yellow",
        "short": "Leggings",
        "category": [
          "Textiles"
        ],
        "basePrice": 101.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmTerminal01Loose": {
        "friendly": "Computer Terminal (Loose)",
        "short": "Terminal",
        "category": [
          "Electronics"
        ],
        "basePrice": 488.0,
        "mass": 20.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmTable03Loose": {
        "friendly": "Conference Table (Loose)",
        "category": [
          "Furniture"
        ],
        "basePrice": 213.0,
        "mass": 20.0,
        "durability": 10.0,
        "source": "cooverlay"
      },
      "DataSNDCorporateSecret": {
        "friendly": "CONFIDENTIAL_BOARDMEETING.SND",
        "source": "cooverlay"
      },
      "DataBINPersonalAddressesOKLG": {
        "friendly": "CONTACTS.BIN",
        "source": "cooverlay"
      },
      "DataBINPersonalAddressesVoltaire": {
        "friendly": "CONTACTS.BIN",
        "source": "cooverlay"
      },
      "DataBINPersonalAddressesRingStation": {
        "friendly": "CONTACTS.BIN",
        "source": "cooverlay"
      },
      "DataBINPersonalAddressesNewcal": {
        "friendly": "CONTACTS.BIN",
        "source": "cooverlay"
      },
      "DataBINPersonalAddressesFortSimpson": {
        "friendly": "CONTACTS.BIN",
        "source": "cooverlay"
      },
      "DataBINPersonalAddressesAtlantis": {
        "friendly": "CONTACTS.BIN",
        "source": "cooverlay"
      },
      "DataBINPersonalAddressesJadeRabbit": {
        "friendly": "CONTACTS.BIN",
        "source": "cooverlay"
      },
      "ItmAtmoScrubber02OffLoose": {
        "friendly": "Contaminant AtmoScrubber (Loose)",
        "short": "Contaminant Scrubber",
        "category": [
          "HVAC"
        ],
        "basePrice": 4226.0,
        "mass": 10.5,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmAtmoScrubber02DmgLoose": {
        "friendly": "Contaminant AtmoScrubber (Loose, Damaged)",
        "short": "Contaminant Scrubber",
        "category": [
          "HVAC"
        ],
        "basePrice": 845.0,
        "mass": 10.5,
        "durability": 15.0,
        "source": "condowner"
      },
      "ItmAlarmContaminantsDmgLoose": {
        "friendly": "Contaminants Pressure Alarm (Damaged, Loose)",
        "short": "Contaminants Alarm",
        "category": [
          "Sensors"
        ],
        "basePrice": 121.0,
        "mass": 0.5,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmAlarmContaminantsOffLoose": {
        "friendly": "Contaminants Pressure Alarm (Loose)",
        "short": "Contaminants Alarm",
        "category": [
          "Sensors"
        ],
        "basePrice": 634.0,
        "mass": 0.5,
        "durability": 1.0,
        "source": "condowner"
      },
      "SysExplosionMissile02": {
        "friendly": "Conventional Missile Explosion",
        "short": "Explosion",
        "source": "condowner"
      },
      "SysExplosionMissile03": {
        "friendly": "Conventional Missile Explosion (Small)",
        "short": "Explosion",
        "source": "condowner"
      },
      "ItmCooler01DmgLoose": {
        "friendly": "Cooler (Loose, Damaged)",
        "short": "Cooler",
        "category": [
          "HVAC"
        ],
        "basePrice": 1340.0,
        "mass": 130.0,
        "durability": 7.0,
        "source": "condowner"
      },
      "ItmCooler01OffLoose": {
        "friendly": "Cooler (Off, Loose)",
        "short": "Cooler",
        "category": [
          "HVAC"
        ],
        "basePrice": 7360.0,
        "mass": 130.0,
        "durability": 3.0,
        "source": "condowner"
      },
      "DataSNDNeverland": {
        "friendly": "CREEPYKIDS.SND",
        "source": "cooverlay"
      },
      "Crew01": {
        "friendly": "Crew01",
        "short": "Person",
        "mass": 35.15,
        "source": "condowner"
      },
      "DataBINMundane01": {
        "friendly": "CREW_HEALTH_RECORDS.BIN",
        "source": "cooverlay"
      },
      "ItmFusionCryoPump01Loose": {
        "friendly": "Cryo Distribution Pump (Loose)",
        "short": "Cryo Pump",
        "category": [
          "FusionParts"
        ],
        "basePrice": 1692.0,
        "mass": 28.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmFusionCryoPump01DmgLoose": {
        "friendly": "Cryo Distribution Pump (Loose, Damaged)",
        "short": "Cryo Pump",
        "category": [
          "FusionParts"
        ],
        "basePrice": 355.0,
        "mass": 28.0,
        "durability": 15.0,
        "source": "condowner"
      },
      "ItmCanisterLHe01Loose": {
        "friendly": "Cryo Reservoir (Loose)",
        "short": "Cryo Tank",
        "category": [
          "FusionParts"
        ],
        "basePrice": 2542.0,
        "mass": 300.0,
        "durability": 40.0,
        "source": "condowner"
      },
      "DataBINCryptoSmall": {
        "friendly": "CRYPTO_TOKEN.BIN",
        "source": "cooverlay"
      },
      "DataBINCryptoLarge": {
        "friendly": "CRYPTO_VAULT.BIN",
        "source": "cooverlay"
      },
      "DataBINCryptoMed": {
        "friendly": "CRYPTO_WALLET.BIN",
        "source": "cooverlay"
      },
      "ItmWeaponCutlass01": {
        "friendly": "Cutlass",
        "category": [
          "Weapons"
        ],
        "basePrice": 362.0,
        "mass": 0.68,
        "durability": 12.0,
        "source": "condowner"
      },
      "ItmCanisterLH02Loose": {
        "friendly": "D2O Canister (Loose)",
        "short": "D2O Tank",
        "category": [
          "FusionParts"
        ],
        "basePrice": 6542.0,
        "mass": 1500.0,
        "durability": 40.0,
        "source": "condowner"
      },
      "ItmCargoD2O01": {
        "friendly": "D2O Cargo",
        "category": [
          "D2O"
        ],
        "basePrice": 125.0,
        "mass": 105.0,
        "durability": 6.0,
        "source": "condowner"
      },
      "DataTXTFanfic01": {
        "friendly": "DALISAY.TXT",
        "source": "cooverlay"
      },
      "ItmCigDamaskRose01": {
        "friendly": "Damask Rose Cigarette",
        "short": "Cigarette",
        "category": [
          "Intoxicants"
        ],
        "basePrice": 15.0,
        "mass": 0.005,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmCigDamaskRose01Lit": {
        "friendly": "Damask Rose Cigarette (Lit)",
        "short": "Cigarette",
        "category": [
          "Trash"
        ],
        "basePrice": 0.0,
        "mass": 0.001,
        "durability": 1.0,
        "source": "condowner"
      },
      "SOCDarkJoke": {
        "friendly": "Dark Joke",
        "source": "condowner"
      },
      "DataFile": {
        "friendly": "Data File",
        "source": "condowner"
      },
      "DataStore": {
        "friendly": "Data Storage Device",
        "source": "condowner"
      },
      "DataBINMergaParanoidGaps": {
        "friendly": "DEADMAN_SWITCH.TXT",
        "source": "cooverlay"
      },
      "DataIMGMergaSingerObituary": {
        "friendly": "DEATH_OF_A_LEGEND.TXT",
        "source": "cooverlay"
      },
      "SOCDefy": {
        "friendly": "Defy",
        "source": "condowner"
      },
      "DataVIDFilm04": {
        "friendly": "DIAMONDS_CENSORED.VID",
        "source": "cooverlay"
      },
      "ItmTable02Loose": {
        "friendly": "Dining Table (Loose)",
        "short": "Table",
        "category": [
          "Furniture"
        ],
        "basePrice": 64.0,
        "mass": 20.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "DataVIDMundane03": {
        "friendly": "DOCKING_PROCEDURES.VID",
        "source": "cooverlay"
      },
      "DataBINRobotOS01": {
        "friendly": "DRONE_OS.BIN",
        "source": "cooverlay"
      },
      "DataBINRobotOS02": {
        "friendly": "DRONE_OS.BIN",
        "source": "cooverlay"
      },
      "ItmNavModDuhrt": {
        "friendly": "Dyonn Ultra High Resolution Tomographer Module",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 767.0,
        "mass": 0.4,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmNavModDuhrtDmg": {
        "friendly": "Dyonn Ultra High Resolution Tomographer Module (Damaged)",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 159.0,
        "mass": 0.4,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "SOCEncourage": {
        "friendly": "Encourage",
        "source": "condowner"
      },
      "ItmMeat01EyeLoose": {
        "friendly": "Eye (Loose)",
        "short": "Eye",
        "category": [
          "Misc"
        ],
        "basePrice": 13960.0,
        "mass": 8.0,
        "durability": 6.0,
        "source": "condowner"
      },
      "DataVIDFilm06": {
        "friendly": "FAST&FULMINATING.VID",
        "source": "cooverlay"
      },
      "SysFire": {
        "friendly": "Fire",
        "source": "condowner"
      },
      "DataSNDGhostStory02": {
        "friendly": "FIREFLIES.SND",
        "source": "cooverlay"
      },
      "SOCFishCompliment": {
        "friendly": "Fish for Compliment",
        "source": "condowner"
      },
      "ItmBookPolarisNavManual01": {
        "friendly": "Flight Manual: Nav Console",
        "short": "Manual",
        "category": [
          "Media"
        ],
        "basePrice": 73.0,
        "mass": 0.85,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmTrencherAcceptableAlgae": {
        "friendly": "Food: Trenchers Acceptable Algae",
        "short": "Trenchers",
        "category": [
          "Food"
        ],
        "basePrice": 60.0,
        "mass": 0.2,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmTrencherChipotlePorkCheeseSpread": {
        "friendly": "Food: Trenchers Chipotle Pork with Cheese Spread",
        "short": "Trenchers",
        "category": [
          "Food"
        ],
        "basePrice": 60.0,
        "mass": 0.2,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmTrencherKungPaoChicken": {
        "friendly": "Food: Trenchers Kung Pao Chicken",
        "short": "Trenchers",
        "category": [
          "Food"
        ],
        "basePrice": 73.0,
        "mass": 0.2,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmTrencherMysteryMeatInSurpriseSauce": {
        "friendly": "Food: Trenchers Mystery Meat in Surprise Sauce",
        "short": "Trenchers",
        "category": [
          "Food"
        ],
        "basePrice": 65.0,
        "mass": 0.2,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmTrencherNachoFiesta": {
        "friendly": "Food: Trenchers Nacho Fiesta",
        "short": "Trenchers",
        "category": [
          "Food"
        ],
        "basePrice": 69.0,
        "mass": 0.2,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmTrencherPizzaPouch": {
        "friendly": "Food: Trenchers Pizza Pouch",
        "short": "Trenchers",
        "category": [
          "Food"
        ],
        "basePrice": 69.0,
        "mass": 0.2,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmTrencherSpicyBuffaloWings": {
        "friendly": "Food: Trenchers Spicy Buffalo Wings with Ranch Dip",
        "short": "Trenchers",
        "category": [
          "Food"
        ],
        "basePrice": 83.0,
        "mass": 0.2,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmTrencherSweetPotatoCakeGardenSalad": {
        "friendly": "Food: Trenchers Sweet Potato Cake and Garden Salad",
        "short": "Trenchers",
        "category": [
          "Food"
        ],
        "basePrice": 83.0,
        "mass": 0.2,
        "durability": 1.0,
        "source": "condowner"
      },
      "BodyfootLB": {
        "friendly": "Foot: Left",
        "mass": 0.931,
        "source": "cooverlay"
      },
      "BodyfootLC": {
        "friendly": "Foot: Left",
        "mass": 0.931,
        "source": "cooverlay"
      },
      "BodyfootLA02": {
        "friendly": "Foot: Left",
        "mass": 0.931,
        "source": "cooverlay"
      },
      "BodyfootLB02": {
        "friendly": "Foot: Left",
        "mass": 0.931,
        "source": "cooverlay"
      },
      "BodyfootLC02": {
        "friendly": "Foot: Left",
        "mass": 0.931,
        "source": "cooverlay"
      },
      "BodyfootRB": {
        "friendly": "Foot: Right",
        "mass": 0.931,
        "source": "cooverlay"
      },
      "BodyfootRC": {
        "friendly": "Foot: Right",
        "mass": 0.931,
        "source": "cooverlay"
      },
      "BodyfootRA02": {
        "friendly": "Foot: Right",
        "mass": 0.931,
        "source": "cooverlay"
      },
      "BodyfootRB02": {
        "friendly": "Foot: Right",
        "mass": 0.931,
        "source": "cooverlay"
      },
      "BodyfootRC02": {
        "friendly": "Foot: Right",
        "mass": 0.931,
        "source": "cooverlay"
      },
      "DataSNDMundane01": {
        "friendly": "FOR_STRESS_RELIEF.SND",
        "source": "cooverlay"
      },
      "ItmStrengthTrainer01DmgLoose": {
        "friendly": "Functional Load Exercise eXosystem (FLEX) (Damaged, Loose)",
        "short": "Strength Trainer",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 400.0,
        "mass": 310.0,
        "durability": 12.0,
        "source": "condowner"
      },
      "ItmStrengthTrainer01Loose": {
        "friendly": "Functional Load Exercise eXosystem (FLEX) (Loose)",
        "short": "Strength Trainer",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 2000.0,
        "mass": 310.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmFusionFieldCoils01Loose": {
        "friendly": "Fusion Field Coils Assembly (Loose)",
        "short": "Field Coils",
        "category": [
          "FusionParts"
        ],
        "basePrice": 4740.0,
        "mass": 40.0,
        "durability": 20.0,
        "source": "condowner"
      },
      "ItmFusionFieldCoils01DmgLoose": {
        "friendly": "Fusion Field Coils Assembly (Loose, Damaged)",
        "short": "Field Coils",
        "category": [
          "FusionParts"
        ],
        "basePrice": 871.0,
        "mass": 40.0,
        "durability": 45.0,
        "source": "condowner"
      },
      "SysExplosionMissile01": {
        "friendly": "Fusion Missile Explosion",
        "short": "Explosion",
        "source": "condowner"
      },
      "ItmCapacitor01Loose": {
        "friendly": "Fusion-grade Laser Capacitor (Loose)",
        "short": "Capacitor",
        "category": [
          "FusionParts"
        ],
        "basePrice": 12623.0,
        "mass": 45.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmCapacitor01DmgLoose": {
        "friendly": "Fusion-grade Laser Capacitor (Loose, Damaged)",
        "short": "Capacitor",
        "category": [
          "FusionParts"
        ],
        "basePrice": 3156.0,
        "mass": 45.0,
        "durability": 8.0,
        "source": "condowner"
      },
      "DataTXTFusionManual01": {
        "friendly": "FUSION_AO_MANUAL_1_PARTS.TXT",
        "source": "cooverlay"
      },
      "DataTXTFusionManual02": {
        "friendly": "FUSION_AO_MANUAL_2_OPS.TXT",
        "source": "cooverlay"
      },
      "DataTXTFusionManual03": {
        "friendly": "FUSION_AO_MANUAL_3_WARNINGS.TXT",
        "source": "cooverlay"
      },
      "ItmMiningTrash": {
        "friendly": "Gangue Material",
        "short": "Gangue",
        "category": [
          "Trash"
        ],
        "basePrice": 2.0,
        "mass": 3.0,
        "source": "condowner"
      },
      "DataSNDGhostStory": {
        "friendly": "GHOST.SND",
        "source": "cooverlay"
      },
      "DataVIDVideotape3": {
        "friendly": "GOLDINHALANTS3.VID",
        "source": "cooverlay"
      },
      "ItmToolGrinder02": {
        "friendly": "Gott Angle Grinder",
        "short": "Grinder",
        "category": [
          "Tools"
        ],
        "basePrice": 120.0,
        "mass": 2.0,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmToolGrinder02Dmg": {
        "friendly": "Gott Angle Grinder (Damaged)",
        "short": "Grinder",
        "category": [
          "Tools"
        ],
        "basePrice": 25.0,
        "mass": 2.0,
        "durability": 18.0,
        "source": "condowner"
      },
      "ItmToolDrillMining01": {
        "friendly": "Gott Mining Tool",
        "short": "Mining Tool",
        "category": [
          "Tools"
        ],
        "basePrice": 2500.0,
        "mass": 8.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmToolDrillMining01Dmg": {
        "friendly": "Gott Mining Tool (Damaged)",
        "short": "Mining Tool",
        "category": [
          "Tools"
        ],
        "basePrice": 500.0,
        "mass": 7.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmToolDrill01": {
        "friendly": "Gott Power Drill",
        "short": "Drill",
        "category": [
          "Tools"
        ],
        "basePrice": 150.0,
        "mass": 2.0,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmToolDrill01Dmg": {
        "friendly": "Gott Power Drill (Damaged)",
        "short": "Drill",
        "category": [
          "Tools"
        ],
        "basePrice": 30.0,
        "mass": 2.0,
        "durability": 18.0,
        "source": "condowner"
      },
      "ItmToolSolderingIron01": {
        "friendly": "Gott Soldering Iron",
        "short": "Solderer",
        "category": [
          "Tools"
        ],
        "basePrice": 90.0,
        "mass": 2.0,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmToolSolderingIron01Dmg": {
        "friendly": "Gott Soldering Iron (Damaged)",
        "short": "Solderer",
        "category": [
          "Tools"
        ],
        "basePrice": 20.0,
        "mass": 2.0,
        "durability": 18.0,
        "source": "condowner"
      },
      "DataVIDMundane01": {
        "friendly": "GREYWATER_TRAINING.VID",
        "source": "cooverlay"
      },
      "OutfitSuit06": {
        "friendly": "Gunmetal Coveralls: Tharsis Landing",
        "short": "Coveralls",
        "category": [
          "Textiles"
        ],
        "basePrice": 172.0,
        "mass": 1.0,
        "durability": 6.5,
        "source": "condowner"
      },
      "ItmHackingDataCard01": {
        "friendly": "Hacking Data Card",
        "short": "Data Card",
        "category": [
          "Electronics"
        ],
        "basePrice": 31.0,
        "mass": 0.01,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmToolFireEx01": {
        "friendly": "Halvorson Fire Extinguisher",
        "short": "Extinguisher",
        "category": [
          "Tools"
        ],
        "basePrice": 130.0,
        "mass": 2.5,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmToolFireEx01Dmg": {
        "friendly": "Halvorson Fire Extinguisher (Damaged)",
        "short": "Extinguisher",
        "category": [
          "Tools"
        ],
        "basePrice": 67.0,
        "mass": 2.5,
        "durability": 15.0,
        "source": "condowner"
      },
      "ItmToolWelder01": {
        "friendly": "Halvorson Friction Stir Welder",
        "short": "Welder",
        "category": [
          "Tools"
        ],
        "basePrice": 165.0,
        "mass": 2.0,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmToolWelder01Dmg": {
        "friendly": "Halvorson Friction Stir Welder (Damaged)",
        "short": "Welder",
        "category": [
          "Tools"
        ],
        "basePrice": 35.0,
        "mass": 2.0,
        "durability": 18.0,
        "source": "condowner"
      },
      "ItmToolDrillMining02Dmg": {
        "friendly": "Halvorson Laser Mining Tool (Damaged)",
        "short": "Mining Laser",
        "category": [
          "Tools"
        ],
        "basePrice": 2650.0,
        "mass": 15.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmToolDrillMining02": {
        "friendly": "Halvorson Mining Laser",
        "short": "Mining Laser",
        "category": [
          "Tools"
        ],
        "basePrice": 13250.0,
        "mass": 17.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmRCSCluster01DmgLoose": {
        "friendly": "Halvorson RCS Thruster Assembly (Damaged, Loose)",
        "short": "Thruster",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 1112.0,
        "mass": 28.0,
        "durability": 19.0,
        "source": "condowner"
      },
      "ItmRCSCluster01Loose": {
        "friendly": "Halvorson RCS Thruster Assembly (Loose)",
        "short": "Thruster",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 5520.0,
        "mass": 28.0,
        "durability": 6.0,
        "source": "condowner"
      },
      "BodyhandLB": {
        "friendly": "Hand: Left",
        "mass": 0.4095,
        "source": "cooverlay"
      },
      "BodyhandLC": {
        "friendly": "Hand: Left",
        "mass": 0.4095,
        "source": "cooverlay"
      },
      "BodyhandLA02": {
        "friendly": "Hand: Left",
        "mass": 0.4095,
        "source": "cooverlay"
      },
      "BodyhandLB02": {
        "friendly": "Hand: Left",
        "mass": 0.4095,
        "source": "cooverlay"
      },
      "BodyhandLC02": {
        "friendly": "Hand: Left",
        "mass": 0.4095,
        "source": "cooverlay"
      },
      "BodyhandRB": {
        "friendly": "Hand: Right",
        "mass": 0.575,
        "source": "cooverlay"
      },
      "BodyhandRC": {
        "friendly": "Hand: Right",
        "mass": 0.575,
        "source": "cooverlay"
      },
      "BodyhandRA02": {
        "friendly": "Hand: Right",
        "mass": 0.575,
        "source": "cooverlay"
      },
      "BodyhandRB02": {
        "friendly": "Hand: Right",
        "mass": 0.575,
        "source": "cooverlay"
      },
      "BodyhandRC02": {
        "friendly": "Hand: Right",
        "mass": 0.575,
        "source": "cooverlay"
      },
      "DataIMGMergaLongFingerDeathMark": {
        "friendly": "HAND_OF_DEATH.IMG",
        "source": "cooverlay"
      },
      "OutfitCargoPantsStrapped03": {
        "friendly": "Harness Pants: Ash",
        "category": [
          "Textiles"
        ],
        "basePrice": 230.0,
        "mass": 0.25,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "OutfitCargoPantsStrapped04": {
        "friendly": "Harness Pants: Gunmetal",
        "category": [
          "Textiles"
        ],
        "basePrice": 230.0,
        "mass": 0.25,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "OutfitCargoPantsStrapped02": {
        "friendly": "Harness Pants: Sage",
        "category": [
          "Textiles"
        ],
        "basePrice": 230.0,
        "mass": 0.25,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "OutfitCargoPantsStrapped01": {
        "friendly": "Harness Pants: Sunflower",
        "category": [
          "Textiles"
        ],
        "basePrice": 230.0,
        "mass": 0.25,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmPantsCargoStrapped01": {
        "friendly": "Harness Pants: Sunflower",
        "short": "Pants",
        "category": [
          "Textiles"
        ],
        "basePrice": 230.0,
        "mass": 0.25,
        "durability": 4.0,
        "source": "condowner"
      },
      "DataIMGSuperHarrison": {
        "friendly": "HARRYMUSCLES.IMG",
        "source": "cooverlay"
      },
      "ItmCargoHE301": {
        "friendly": "HE3 Cargo",
        "category": [
          "He3"
        ],
        "basePrice": 773.0,
        "mass": 1.3,
        "durability": 6.0,
        "source": "condowner"
      },
      "WoundHead": {
        "friendly": "Head",
        "source": "condowner"
      },
      "ItmHeater01OffLoose": {
        "friendly": "Heater (Loose)",
        "short": "Heater",
        "category": [
          "HVAC"
        ],
        "basePrice": 2634.0,
        "mass": 31.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmHeater01DmgLoose": {
        "friendly": "Heater (Loose, Damaged)",
        "short": "Heater",
        "category": [
          "HVAC"
        ],
        "basePrice": 514.0,
        "mass": 31.0,
        "durability": 15.0,
        "source": "condowner"
      },
      "ItmHeater02OffLoose": {
        "friendly": "Heater Model B (Loose)",
        "category": [
          "HVAC"
        ],
        "basePrice": 2634.0,
        "mass": 31.0,
        "durability": 5.0,
        "source": "cooverlay"
      },
      "ItmHeater02DmgLoose": {
        "friendly": "Heater Model B (Loose, Damaged)",
        "category": [
          "HVAC"
        ],
        "basePrice": 514.0,
        "mass": 31.0,
        "durability": 15.0,
        "source": "cooverlay"
      },
      "ItmHeavyLiftRotor01DmgLoose": {
        "friendly": "Heavy Lift Rotor (Damaged, Loose)",
        "short": "Heavy Lift Rotor",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 12914.0,
        "mass": 1.35,
        "durability": 50.0,
        "source": "condowner"
      },
      "ItmHeavyLiftRotor01Loose": {
        "friendly": "Heavy Lift Rotor (Loose)",
        "short": "Heavy Lift Rotor",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 56774.0,
        "mass": 40.0,
        "durability": 30.0,
        "source": "condowner"
      },
      "ItmMeat01HoofLoose": {
        "friendly": "Hoof (Loose)",
        "short": "Hoof",
        "category": [
          "Misc"
        ],
        "basePrice": 4560.0,
        "mass": 10.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmToolScrewDriver01": {
        "friendly": "Horang \"PlaScrew\" Screwdriver",
        "short": "Screwdriver",
        "category": [
          "Tools"
        ],
        "basePrice": 15.0,
        "mass": 2.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmToolHacksaw01": {
        "friendly": "Horang \"PlastHak\" Hacksaw",
        "short": "Hacksaw",
        "category": [
          "Tools"
        ],
        "basePrice": 40.0,
        "mass": 3.0,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmMeat01HornLoose": {
        "friendly": "Horn (Loose)",
        "short": "Horn",
        "category": [
          "Misc"
        ],
        "basePrice": 8560.0,
        "mass": 10.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmAeroParts3x301Loose": {
        "friendly": "Hull Stabilizer (Loose)",
        "short": "Stabilizer",
        "category": [
          "Hull"
        ],
        "basePrice": 1300.0,
        "mass": 40.0,
        "durability": 30.0,
        "source": "condowner"
      },
      "ItmAeroParts3x302Loose": {
        "friendly": "Hull Stabilizer (Loose)",
        "short": "Stabilizer",
        "category": [
          "Hull"
        ],
        "basePrice": 1300.0,
        "mass": 40.0,
        "durability": 30.0,
        "source": "condowner"
      },
      "ItmMineral11": {
        "friendly": "Hydrates",
        "short": "Ore: Hydrates",
        "category": [
          "Ore"
        ],
        "basePrice": 150.0,
        "mass": 10.0,
        "durability": 101.0,
        "source": "condowner"
      },
      "ItmHygieneWipes01": {
        "friendly": "Hygiene Pack",
        "category": [
          "Medical"
        ],
        "basePrice": 80.0,
        "mass": 0.01,
        "durability": 1.0,
        "source": "condowner"
      },
      "DataIMGCryptid02": {
        "friendly": "I_FOUND_BIGFOOT.IMG",
        "source": "cooverlay"
      },
      "ItmReactorIC03OffLoose": {
        "friendly": "IC Fusion Reactor (Loose)",
        "short": "Reactor",
        "category": [
          "FusionParts"
        ],
        "basePrice": 141000.0,
        "mass": 417.0,
        "durability": 25.0,
        "source": "condowner"
      },
      "ItmReactorIC03DmgLoose": {
        "friendly": "IC Fusion Reactor (Loose, Damaged)",
        "short": "Reactor",
        "category": [
          "FusionParts"
        ],
        "basePrice": 29000.0,
        "mass": 417.0,
        "durability": 75.0,
        "source": "condowner"
      },
      "ItmFusionReactorCore01Loose": {
        "friendly": "IC Fusion Reactor Core: Sulaiman \"X(X) TW\" (Loose)",
        "short": "Reactor Core",
        "category": [
          "FusionParts"
        ],
        "basePrice": 10250.0,
        "mass": 417.0,
        "durability": 25.0,
        "source": "condowner"
      },
      "ItmFusionReactorCore01DmgLoose": {
        "friendly": "IC Fusion Reactor Core: Sulaiman \"X(X) TW\" (Loose, Damaged)",
        "short": "Reactor Core",
        "category": [
          "FusionParts"
        ],
        "basePrice": 2050.0,
        "mass": 417.0,
        "durability": 75.0,
        "source": "condowner"
      },
      "ItmReactorIC02OffLoose": {
        "friendly": "IC Fusion Reactor: Station (Loose)",
        "short": "Reactor",
        "category": [
          "FusionParts"
        ],
        "basePrice": 141000.0,
        "mass": 417.0,
        "durability": 120.0,
        "source": "condowner"
      },
      "ItmIceTrash01": {
        "friendly": "Ice Gangue",
        "short": "Gangue",
        "basePrice": 0.0,
        "mass": 2.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "DataIMGMeat02": {
        "friendly": "INFESTATION.IMG",
        "source": "cooverlay"
      },
      "SOCInspirePurpose": {
        "friendly": "Inspire with Purpose",
        "source": "condowner"
      },
      "SOCInsult": {
        "friendly": "Insult",
        "source": "condowner"
      },
      "DataVIDMundane04": {
        "friendly": "INTERIOR_TOUR.VID",
        "source": "cooverlay"
      },
      "DataSNDConfession02": {
        "friendly": "INTERNALAFFAIRS.SND",
        "source": "cooverlay"
      },
      "DataBINPersonalAddressesProkofiev": {
        "friendly": "INVENTORY.BIN",
        "source": "cooverlay"
      },
      "SOCInviteDrink": {
        "friendly": "Invite for Drink",
        "source": "condowner"
      },
      "ItmCargoPod02DmgLoose": {
        "friendly": "ItmCargoPod02DmgLoose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 1000.0,
        "mass": 50.0,
        "durability": 50.0,
        "source": "cooverlay"
      },
      "ItmCargoPod02Loose": {
        "friendly": "ItmCargoPod02Loose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 5000.0,
        "mass": 50.0,
        "durability": 50.0,
        "source": "cooverlay"
      },
      "ItmCargoPod03DmgLoose": {
        "friendly": "ItmCargoPod03DmgLoose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 1000.0,
        "mass": 50.0,
        "durability": 50.0,
        "source": "cooverlay"
      },
      "ItmCargoPod03Loose": {
        "friendly": "ItmCargoPod03Loose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 5000.0,
        "mass": 50.0,
        "durability": 50.0,
        "source": "cooverlay"
      },
      "ItmCargoPod04DmgLoose": {
        "friendly": "ItmCargoPod04DmgLoose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 1000.0,
        "mass": 50.0,
        "durability": 50.0,
        "source": "cooverlay"
      },
      "ItmCargoPod04Loose": {
        "friendly": "ItmCargoPod04Loose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 5000.0,
        "mass": 50.0,
        "durability": 50.0,
        "source": "cooverlay"
      },
      "ItmCargoPod05DmgLoose": {
        "friendly": "ItmCargoPod05DmgLoose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 1000.0,
        "mass": 50.0,
        "durability": 50.0,
        "source": "cooverlay"
      },
      "ItmCargoPod05Loose": {
        "friendly": "ItmCargoPod05Loose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 5000.0,
        "mass": 50.0,
        "durability": 50.0,
        "source": "cooverlay"
      },
      "ItmCargoPod06DmgLoose": {
        "friendly": "ItmCargoPod06DmgLoose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 1000.0,
        "mass": 50.0,
        "durability": 50.0,
        "source": "cooverlay"
      },
      "ItmCargoPod06Loose": {
        "friendly": "ItmCargoPod06Loose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 5000.0,
        "mass": 50.0,
        "durability": 50.0,
        "source": "cooverlay"
      },
      "ItmCargoPod07DmgLoose": {
        "friendly": "ItmCargoPod07DmgLoose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 1000.0,
        "mass": 50.0,
        "durability": 50.0,
        "source": "cooverlay"
      },
      "ItmCargoPod07Loose": {
        "friendly": "ItmCargoPod07Loose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 5000.0,
        "mass": 50.0,
        "durability": 50.0,
        "source": "cooverlay"
      },
      "ItmCargoPod08DmgLoose": {
        "friendly": "ItmCargoPod08DmgLoose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 1000.0,
        "mass": 50.0,
        "durability": 50.0,
        "source": "cooverlay"
      },
      "ItmCargoPod08Loose": {
        "friendly": "ItmCargoPod08Loose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 5000.0,
        "mass": 50.0,
        "durability": 50.0,
        "source": "cooverlay"
      },
      "ItmCargoPod09DmgLoose": {
        "friendly": "ItmCargoPod09DmgLoose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 1000.0,
        "mass": 50.0,
        "durability": 50.0,
        "source": "cooverlay"
      },
      "ItmCargoPod09Loose": {
        "friendly": "ItmCargoPod09Loose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 5000.0,
        "mass": 50.0,
        "durability": 50.0,
        "source": "cooverlay"
      },
      "ItmCargoPod10DmgLoose": {
        "friendly": "ItmCargoPod10DmgLoose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 1000.0,
        "mass": 50.0,
        "durability": 50.0,
        "source": "cooverlay"
      },
      "ItmCargoPod10Loose": {
        "friendly": "ItmCargoPod10Loose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 5000.0,
        "mass": 50.0,
        "durability": 50.0,
        "source": "cooverlay"
      },
      "ItmCargoPod11DmgLoose": {
        "friendly": "ItmCargoPod11DmgLoose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 1000.0,
        "mass": 50.0,
        "durability": 50.0,
        "source": "cooverlay"
      },
      "ItmCargoPod11Loose": {
        "friendly": "ItmCargoPod11Loose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 5000.0,
        "mass": 50.0,
        "durability": 50.0,
        "source": "cooverlay"
      },
      "ItmCargoPodClimate02DmgLoose": {
        "friendly": "ItmCargoPodClimate02DmgLoose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 2400.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodClimate02Loose": {
        "friendly": "ItmCargoPodClimate02Loose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 12000.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodClimate03DmgLoose": {
        "friendly": "ItmCargoPodClimate03DmgLoose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 2400.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodClimate03Loose": {
        "friendly": "ItmCargoPodClimate03Loose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 12000.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodClimate04DmgLoose": {
        "friendly": "ItmCargoPodClimate04DmgLoose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 2400.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodClimate04Loose": {
        "friendly": "ItmCargoPodClimate04Loose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 12000.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodClimate05DmgLoose": {
        "friendly": "ItmCargoPodClimate05DmgLoose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 2400.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodClimate05Loose": {
        "friendly": "ItmCargoPodClimate05Loose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 12000.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodClimate06DmgLoose": {
        "friendly": "ItmCargoPodClimate06DmgLoose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 2400.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodClimate06Loose": {
        "friendly": "ItmCargoPodClimate06Loose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 12000.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodClimate07DmgLoose": {
        "friendly": "ItmCargoPodClimate07DmgLoose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 2400.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodClimate07Loose": {
        "friendly": "ItmCargoPodClimate07Loose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 12000.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodClimate08DmgLoose": {
        "friendly": "ItmCargoPodClimate08DmgLoose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 2400.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodClimate08Loose": {
        "friendly": "ItmCargoPodClimate08Loose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 12000.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodClimate09DmgLoose": {
        "friendly": "ItmCargoPodClimate09DmgLoose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 2400.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodClimate09Loose": {
        "friendly": "ItmCargoPodClimate09Loose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 12000.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodClimate10DmgLoose": {
        "friendly": "ItmCargoPodClimate10DmgLoose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 2400.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodClimate10Loose": {
        "friendly": "ItmCargoPodClimate10Loose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 12000.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodClimate11DmgLoose": {
        "friendly": "ItmCargoPodClimate11DmgLoose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 2400.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodClimate11Loose": {
        "friendly": "ItmCargoPodClimate11Loose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 12000.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodRad02DmgLoose": {
        "friendly": "ItmCargoPodRad02DmgLoose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 2400.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodRad02Loose": {
        "friendly": "ItmCargoPodRad02Loose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 12000.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodRad03DmgLoose": {
        "friendly": "ItmCargoPodRad03DmgLoose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 2400.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodRad03Loose": {
        "friendly": "ItmCargoPodRad03Loose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 12000.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodRad04DmgLoose": {
        "friendly": "ItmCargoPodRad04DmgLoose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 2400.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodRad04Loose": {
        "friendly": "ItmCargoPodRad04Loose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 12000.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodRad05DmgLoose": {
        "friendly": "ItmCargoPodRad05DmgLoose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 2400.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodRad05Loose": {
        "friendly": "ItmCargoPodRad05Loose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 12000.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodRad06DmgLoose": {
        "friendly": "ItmCargoPodRad06DmgLoose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 2400.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodRad06Loose": {
        "friendly": "ItmCargoPodRad06Loose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 12000.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodRad07DmgLoose": {
        "friendly": "ItmCargoPodRad07DmgLoose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 2400.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodRad07Loose": {
        "friendly": "ItmCargoPodRad07Loose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 12000.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodRad08DmgLoose": {
        "friendly": "ItmCargoPodRad08DmgLoose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 2400.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodRad08Loose": {
        "friendly": "ItmCargoPodRad08Loose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 12000.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodRad09DmgLoose": {
        "friendly": "ItmCargoPodRad09DmgLoose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 2400.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodRad09Loose": {
        "friendly": "ItmCargoPodRad09Loose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 12000.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodRad10DmgLoose": {
        "friendly": "ItmCargoPodRad10DmgLoose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 2400.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodRad10Loose": {
        "friendly": "ItmCargoPodRad10Loose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 12000.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodRad11DmgLoose": {
        "friendly": "ItmCargoPodRad11DmgLoose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 2400.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodRad11Loose": {
        "friendly": "ItmCargoPodRad11Loose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 12000.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodSpec02DmgLoose": {
        "friendly": "ItmCargoPodSpec02DmgLoose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 4000.0,
        "mass": 50.0,
        "durability": 80.0,
        "source": "cooverlay"
      },
      "ItmCargoPodSpec02Loose": {
        "friendly": "ItmCargoPodSpec02Loose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 20000.0,
        "mass": 50.0,
        "durability": 80.0,
        "source": "cooverlay"
      },
      "ItmCargoPodSpec03DmgLoose": {
        "friendly": "ItmCargoPodSpec03DmgLoose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 4000.0,
        "mass": 50.0,
        "durability": 80.0,
        "source": "cooverlay"
      },
      "ItmCargoPodSpec03Loose": {
        "friendly": "ItmCargoPodSpec03Loose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 20000.0,
        "mass": 50.0,
        "durability": 80.0,
        "source": "cooverlay"
      },
      "ItmCargoPodSpec04DmgLoose": {
        "friendly": "ItmCargoPodSpec04DmgLoose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 4000.0,
        "mass": 50.0,
        "durability": 80.0,
        "source": "cooverlay"
      },
      "ItmCargoPodSpec04Loose": {
        "friendly": "ItmCargoPodSpec04Loose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 20000.0,
        "mass": 50.0,
        "durability": 80.0,
        "source": "cooverlay"
      },
      "ItmCargoPodSpec05DmgLoose": {
        "friendly": "ItmCargoPodSpec05DmgLoose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 4000.0,
        "mass": 50.0,
        "durability": 80.0,
        "source": "cooverlay"
      },
      "ItmCargoPodSpec05Loose": {
        "friendly": "ItmCargoPodSpec05Loose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 20000.0,
        "mass": 50.0,
        "durability": 80.0,
        "source": "cooverlay"
      },
      "ItmCargoPodSpec06DmgLoose": {
        "friendly": "ItmCargoPodSpec06DmgLoose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 4000.0,
        "mass": 50.0,
        "durability": 80.0,
        "source": "cooverlay"
      },
      "ItmCargoPodSpec06Loose": {
        "friendly": "ItmCargoPodSpec06Loose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 20000.0,
        "mass": 50.0,
        "durability": 80.0,
        "source": "cooverlay"
      },
      "ItmCargoPodSpec07DmgLoose": {
        "friendly": "ItmCargoPodSpec07DmgLoose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 4000.0,
        "mass": 50.0,
        "durability": 80.0,
        "source": "cooverlay"
      },
      "ItmCargoPodSpec07Loose": {
        "friendly": "ItmCargoPodSpec07Loose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 20000.0,
        "mass": 50.0,
        "durability": 80.0,
        "source": "cooverlay"
      },
      "ItmCargoPodSpec08DmgLoose": {
        "friendly": "ItmCargoPodSpec08DmgLoose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 4000.0,
        "mass": 50.0,
        "durability": 80.0,
        "source": "cooverlay"
      },
      "ItmCargoPodSpec08Loose": {
        "friendly": "ItmCargoPodSpec08Loose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 20000.0,
        "mass": 50.0,
        "durability": 80.0,
        "source": "cooverlay"
      },
      "ItmCargoPodSpec09DmgLoose": {
        "friendly": "ItmCargoPodSpec09DmgLoose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 2400.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodSpec09Loose": {
        "friendly": "ItmCargoPodSpec09Loose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 12000.0,
        "mass": 50.0,
        "durability": 70.0,
        "source": "cooverlay"
      },
      "ItmCargoPodSpec10DmgLoose": {
        "friendly": "ItmCargoPodSpec10DmgLoose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 4000.0,
        "mass": 50.0,
        "durability": 80.0,
        "source": "cooverlay"
      },
      "ItmCargoPodSpec10Loose": {
        "friendly": "ItmCargoPodSpec10Loose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 20000.0,
        "mass": 50.0,
        "durability": 80.0,
        "source": "cooverlay"
      },
      "ItmCargoPodSpec11DmgLoose": {
        "friendly": "ItmCargoPodSpec11DmgLoose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 4000.0,
        "mass": 50.0,
        "durability": 80.0,
        "source": "cooverlay"
      },
      "ItmCargoPodSpec11Loose": {
        "friendly": "ItmCargoPodSpec11Loose",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 20000.0,
        "mass": 50.0,
        "durability": 80.0,
        "source": "cooverlay"
      },
      "ItmPDACart01": {
        "friendly": "ItmPDACart01",
        "category": [
          "Electronics"
        ],
        "basePrice": 4096.0,
        "mass": 0.06,
        "durability": 2.0,
        "source": "item"
      },
      "ItmPDACart02": {
        "friendly": "ItmPDACart02",
        "category": [
          "Electronics"
        ],
        "basePrice": 4096.0,
        "mass": 0.06,
        "durability": 2.0,
        "source": "item"
      },
      "ItmPDACart03": {
        "friendly": "ItmPDACart03",
        "category": [
          "Electronics"
        ],
        "basePrice": 4096.0,
        "mass": 0.06,
        "durability": 2.0,
        "source": "item"
      },
      "ItmPDACart04": {
        "friendly": "ItmPDACart04",
        "category": [
          "Electronics"
        ],
        "basePrice": 4096.0,
        "mass": 0.06,
        "durability": 2.0,
        "source": "item"
      },
      "ItmPDACart05": {
        "friendly": "ItmPDACart05",
        "category": [
          "Electronics"
        ],
        "basePrice": 4096.0,
        "mass": 0.06,
        "durability": 2.0,
        "source": "item"
      },
      "DataSNDJTSmoovPutItIn": {
        "friendly": "JTSMOOV_PUTITIN.SND",
        "source": "cooverlay"
      },
      "ItmWeaponKatana01": {
        "friendly": "Katana",
        "category": [
          "Weapons"
        ],
        "basePrice": 12362.0,
        "mass": 1.3,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmWeaponKnuckles01": {
        "friendly": "Knuckleduster",
        "category": [
          "Weapons"
        ],
        "basePrice": 46.0,
        "mass": 0.198,
        "durability": 15.0,
        "source": "condowner"
      },
      "LiquidRiceWine": {
        "friendly": "Label 99 Rice Wine",
        "short": "Rice Wine",
        "category": [
          "Intoxicants"
        ],
        "basePrice": 36.25,
        "mass": 0.06125,
        "source": "condowner"
      },
      "DataSNDLovedOneVoice": {
        "friendly": "LASTGOODBYE.SND",
        "source": "cooverlay"
      },
      "WoundArmFractureL": {
        "friendly": "Left Arm",
        "source": "condowner"
      },
      "BodyfootLA": {
        "friendly": "Left Foot",
        "short": "L Foot",
        "mass": 0.931,
        "source": "condowner"
      },
      "BodyhandLA": {
        "friendly": "Left Hand",
        "short": "L Hand",
        "mass": 0.4095,
        "source": "condowner"
      },
      "BodyRobothandL": {
        "friendly": "Left Hand",
        "short": "L Hand",
        "mass": 0.4095,
        "source": "condowner"
      },
      "WoundLegFractureL": {
        "friendly": "Left Leg",
        "source": "condowner"
      },
      "BodylegLowerLB": {
        "friendly": "Leg: Lower Left",
        "mass": 3.199,
        "source": "cooverlay"
      },
      "BodylegLowerLC": {
        "friendly": "Leg: Lower Left",
        "mass": 3.199,
        "source": "cooverlay"
      },
      "BodylegLowerLA02": {
        "friendly": "Leg: Lower Left",
        "mass": 3.199,
        "source": "cooverlay"
      },
      "BodylegLowerLB02": {
        "friendly": "Leg: Lower Left",
        "mass": 3.199,
        "source": "cooverlay"
      },
      "BodylegLowerLC02": {
        "friendly": "Leg: Lower Left",
        "mass": 3.199,
        "source": "cooverlay"
      },
      "BodylegLowerRB": {
        "friendly": "Leg: Lower Right",
        "mass": 3.199,
        "source": "cooverlay"
      },
      "BodylegLowerRC": {
        "friendly": "Leg: Lower Right",
        "mass": 3.199,
        "source": "cooverlay"
      },
      "BodylegLowerRA02": {
        "friendly": "Leg: Lower Right",
        "mass": 3.199,
        "source": "cooverlay"
      },
      "BodylegLowerRB02": {
        "friendly": "Leg: Lower Right",
        "mass": 3.199,
        "source": "cooverlay"
      },
      "BodylegLowerRC02": {
        "friendly": "Leg: Lower Right",
        "mass": 3.199,
        "source": "cooverlay"
      },
      "BodylegUpperLB": {
        "friendly": "Leg: Upper Left",
        "mass": 10.129,
        "source": "cooverlay"
      },
      "BodylegUpperLC": {
        "friendly": "Leg: Upper Left",
        "mass": 10.129,
        "source": "cooverlay"
      },
      "BodylegUpperLA02": {
        "friendly": "Leg: Upper Left",
        "mass": 10.129,
        "source": "cooverlay"
      },
      "BodylegUpperLB02": {
        "friendly": "Leg: Upper Left",
        "mass": 10.129,
        "source": "cooverlay"
      },
      "BodylegUpperLC02": {
        "friendly": "Leg: Upper Left",
        "mass": 10.129,
        "source": "cooverlay"
      },
      "BodylegUpperRB": {
        "friendly": "Leg: Upper Right",
        "mass": 10.129,
        "source": "cooverlay"
      },
      "BodylegUpperRC": {
        "friendly": "Leg: Upper Right",
        "mass": 10.129,
        "source": "cooverlay"
      },
      "BodylegUpperRA02": {
        "friendly": "Leg: Upper Right",
        "mass": 10.129,
        "source": "cooverlay"
      },
      "BodylegUpperRB02": {
        "friendly": "Leg: Upper Right",
        "mass": 10.129,
        "source": "cooverlay"
      },
      "BodylegUpperRC02": {
        "friendly": "Leg: Upper Right",
        "mass": 10.129,
        "source": "cooverlay"
      },
      "OutfitLeggings02b": {
        "friendly": "Leggings: Dark Camo",
        "category": [
          "Textiles"
        ],
        "basePrice": 101.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitLeggings02e": {
        "friendly": "Leggings: Digital Camo Jungle",
        "category": [
          "Textiles"
        ],
        "basePrice": 101.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitLeggings02g": {
        "friendly": "Leggings: Digital Camo Mars",
        "category": [
          "Textiles"
        ],
        "basePrice": 101.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitLeggings02c": {
        "friendly": "Leggings: Digital Camo Purple",
        "category": [
          "Textiles"
        ],
        "basePrice": 101.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitLeggings02f": {
        "friendly": "Leggings: Digital Camo Tundra",
        "category": [
          "Textiles"
        ],
        "basePrice": 101.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitLeggings02": {
        "friendly": "Leggings: Galaxy",
        "category": [
          "Textiles"
        ],
        "basePrice": 101.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "ItmLeggings02": {
        "friendly": "Leggings: Galaxy Print",
        "short": "Leggings",
        "category": [
          "Textiles"
        ],
        "basePrice": 101.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "condowner"
      },
      "OutfitLeggings02d": {
        "friendly": "Leggings: Green Swirl",
        "category": [
          "Textiles"
        ],
        "basePrice": 101.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitLeggings02j": {
        "friendly": "Leggings: Marbled Achromic",
        "category": [
          "Textiles"
        ],
        "basePrice": 101.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitLeggings02k": {
        "friendly": "Leggings: Marbled Blue",
        "category": [
          "Textiles"
        ],
        "basePrice": 101.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitLeggings02l": {
        "friendly": "Leggings: Marbled Green",
        "category": [
          "Textiles"
        ],
        "basePrice": 101.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitLeggings02m": {
        "friendly": "Leggings: Marbled Magenta",
        "category": [
          "Textiles"
        ],
        "basePrice": 101.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitLeggings02i": {
        "friendly": "Leggings: Marbled Rainbow",
        "category": [
          "Textiles"
        ],
        "basePrice": 101.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitLeggings02n": {
        "friendly": "Leggings: Marbled Silver",
        "category": [
          "Textiles"
        ],
        "basePrice": 101.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitLeggings02h": {
        "friendly": "Leggings: Rainbow",
        "category": [
          "Textiles"
        ],
        "basePrice": 101.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitLeggings02a": {
        "friendly": "Leggings: Stripes",
        "category": [
          "Textiles"
        ],
        "basePrice": 101.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "DataVIDBlackmail": {
        "friendly": "LEVERAGE.VID",
        "source": "cooverlay"
      },
      "ItmCanisterLHe02Loose": {
        "friendly": "Liq. He Canister (Loose)",
        "short": "He3 Tank",
        "category": [
          "FusionParts"
        ],
        "basePrice": 6542.0,
        "mass": 1500.0,
        "durability": 40.0,
        "source": "condowner"
      },
      "ItmPlanterMeat01Loose": {
        "friendly": "Lit Meat Planter (Loose)",
        "short": "Meat Planter",
        "category": [
          "LuxuryGoods"
        ],
        "basePrice": 15760.0,
        "mass": 305.0,
        "durability": 35.0,
        "source": "condowner"
      },
      "DataTXTFanfic02": {
        "friendly": "LOCUSPOCUS.TXT",
        "source": "cooverlay"
      },
      "DataTXTGame02": {
        "friendly": "LONE_STAR_GAMEBOOK.TXT",
        "source": "cooverlay"
      },
      "SysLootSpawnerAirlock": {
        "friendly": "LootSpawner: Airlock",
        "source": "cooverlay"
      },
      "SysLootSpawnerAmmoMassThrower01": {
        "friendly": "LootSpawner: Ammo MassThrower01",
        "source": "cooverlay"
      },
      "SysLootSpawnerAmmoMassThrower02": {
        "friendly": "LootSpawner: Ammo MassThrower02",
        "source": "cooverlay"
      },
      "SysLootSpawnerAmmoMassThrower03": {
        "friendly": "LootSpawner: Ammo MassThrower03",
        "source": "cooverlay"
      },
      "SysLootSpawnerAmmoMissileLauncher01": {
        "friendly": "LootSpawner: Ammo MissileLauncher01",
        "source": "cooverlay"
      },
      "SysLootSpawnerAmmoMissileLauncher02": {
        "friendly": "LootSpawner: Ammo MissileLauncher02",
        "source": "cooverlay"
      },
      "SysLootSpawnerAmmoMissileLauncher03": {
        "friendly": "LootSpawner: Ammo MissileLauncher03",
        "source": "cooverlay"
      },
      "SysLootSpawnerAmmoPDC": {
        "friendly": "LootSpawner: Ammo PDC",
        "source": "cooverlay"
      },
      "SysLootSpawnerBoarding": {
        "friendly": "LootSpawner: Boarding",
        "source": "cooverlay"
      },
      "SysLootSpawnerBulkCargo": {
        "friendly": "LootSpawner: Bulk Cargo",
        "source": "cooverlay"
      },
      "SysLootSpawnerCrewPersonal ": {
        "friendly": "LootSpawner: Crew Personal",
        "source": "cooverlay"
      },
      "SysLootSpawnerCrewRec": {
        "friendly": "LootSpawner: Crew Rec",
        "source": "cooverlay"
      },
      "SysLootSpawnerEngineering": {
        "friendly": "LootSpawner: Engineering",
        "source": "cooverlay"
      },
      "SysLootSpawnerJunk": {
        "friendly": "LootSpawner: Junk",
        "source": "cooverlay"
      },
      "SysLootSpawnerMedical": {
        "friendly": "LootSpawner: Medical",
        "source": "cooverlay"
      },
      "SysLootSpawnerNotBoarding": {
        "friendly": "LootSpawner: NotBoarding",
        "source": "cooverlay"
      },
      "SysLootSpawnerProvisions": {
        "friendly": "LootSpawner: Provisions",
        "source": "cooverlay"
      },
      "SysLootSpawnerRandomFloor": {
        "friendly": "LootSpawner: Random Floor",
        "source": "cooverlay"
      },
      "SysLootSpawnerRandomPartsScrap": {
        "friendly": "LootSpawner: Random Parts Scrap",
        "source": "cooverlay"
      },
      "SysLootSpawnerRandomWall": {
        "friendly": "LootSpawner: Random Wall",
        "source": "cooverlay"
      },
      "WoundAbdomenLower": {
        "friendly": "Lower Abdomen",
        "source": "condowner"
      },
      "WoundChestLower": {
        "friendly": "Lower Chest",
        "source": "condowner"
      },
      "BodyarmLowerLA": {
        "friendly": "Lower Left Arm",
        "short": "Lower L Arm",
        "mass": 1.05,
        "source": "condowner"
      },
      "WoundArmLowerL": {
        "friendly": "Lower Left Arm",
        "source": "condowner"
      },
      "BodylegLowerLA": {
        "friendly": "Lower Left Leg",
        "short": "Lower L Leg",
        "mass": 3.199,
        "source": "condowner"
      },
      "WoundLegLowerL": {
        "friendly": "Lower Left Leg",
        "source": "condowner"
      },
      "BodyarmLowerRA": {
        "friendly": "Lower Right Arm",
        "short": "Lower R Arm",
        "mass": 1.05,
        "source": "condowner"
      },
      "WoundArmLowerR": {
        "friendly": "Lower Right Arm",
        "source": "condowner"
      },
      "BodylegLowerRA": {
        "friendly": "Lower Right Leg",
        "short": "Lower R Leg",
        "mass": 3.199,
        "source": "condowner"
      },
      "WoundLegLowerR": {
        "friendly": "Lower Right Leg",
        "source": "condowner"
      },
      "ItmWeaponMachete01": {
        "friendly": "Machete",
        "category": [
          "Weapons"
        ],
        "basePrice": 362.0,
        "mass": 0.51,
        "durability": 12.0,
        "source": "condowner"
      },
      "ItmFusionMHDGenerator01Loose": {
        "friendly": "Magnetohydrodynamic (MHD) Generator (Loose)",
        "short": "MHD Generator",
        "category": [
          "FusionParts"
        ],
        "basePrice": 12623.0,
        "mass": 45.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmFusionMHDGenerator01DmgLoose": {
        "friendly": "Magnetohydrodynamic (MHD) Generator (Loose, Damaged)",
        "short": "MHD Generator",
        "category": [
          "FusionParts"
        ],
        "basePrice": 3156.0,
        "mass": 45.0,
        "durability": 8.0,
        "source": "condowner"
      },
      "DataSNDManifesto": {
        "friendly": "MANIFESTO.SND",
        "source": "cooverlay"
      },
      "ItmBookEnvManual01": {
        "friendly": "Manual: Environmental",
        "short": "Manual",
        "category": [
          "Media"
        ],
        "basePrice": 58.0,
        "mass": 0.76,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmBookFusionManual01": {
        "friendly": "Manual: Fusion",
        "short": "Manual",
        "category": [
          "Media"
        ],
        "basePrice": 1258.0,
        "mass": 0.76,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmShipWeaponMassThrower03DmgLoose": {
        "friendly": "Mass Thrower (Damaged, Loose)",
        "short": "Mass Thrower",
        "category": [
          "Weapons"
        ],
        "basePrice": 3000.0,
        "mass": 300.0,
        "durability": 8.0,
        "source": "condowner"
      },
      "ItmShipWeaponMassThrower03Loose": {
        "friendly": "Mass Thrower (Loose)",
        "short": "Mass Thrower",
        "category": [
          "Weapons"
        ],
        "basePrice": 15000.0,
        "mass": 300.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "DataSNDAttack02": {
        "friendly": "MAYDAY.SND",
        "source": "cooverlay"
      },
      "ItmMeat01": {
        "friendly": "Meat",
        "basePrice": 3510.0,
        "mass": 5.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmMeat01Eye": {
        "friendly": "Meat",
        "category": [
          "Misc"
        ],
        "basePrice": 13960.0,
        "mass": 9.0,
        "durability": 8.0,
        "source": "condowner"
      },
      "ItmMeat01Hoof": {
        "friendly": "Meat",
        "category": [
          "Misc"
        ],
        "basePrice": 4560.0,
        "mass": 15.0,
        "durability": 8.0,
        "source": "condowner"
      },
      "ItmMeat01Horn": {
        "friendly": "Meat",
        "category": [
          "Misc"
        ],
        "basePrice": 8560.0,
        "mass": 15.0,
        "durability": 8.0,
        "source": "condowner"
      },
      "ItmMeat01Loose": {
        "friendly": "Meat (Loose)",
        "short": "Meat",
        "category": [
          "Food"
        ],
        "basePrice": 810.0,
        "mass": 0.2,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmIce02": {
        "friendly": "Methane Ice",
        "short": "CH4 Ice",
        "basePrice": 20.0,
        "mass": 24.84,
        "durability": 7.0,
        "source": "condowner"
      },
      "ItmBattery02cLoose": {
        "friendly": "Mini XS Ship Battery (Loose)",
        "short": "Battery",
        "category": [
          "Electronics"
        ],
        "basePrice": 944.0,
        "mass": 16.2,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmBattery02cDmgLoose": {
        "friendly": "Mini XS Ship Battery (Loose, Damaged)",
        "short": "Battery",
        "category": [
          "Electronics"
        ],
        "basePrice": 234.0,
        "mass": 16.2,
        "durability": 11.0,
        "source": "condowner"
      },
      "SysExplosionMiningSmall": {
        "friendly": "Mining Charge Explosion (Small)",
        "short": "Explosion",
        "source": "condowner"
      },
      "ItmSensorEOIR01Loose": {
        "friendly": "Miura Sensor: EO/IR (Loose)",
        "short": "EO/IR Sensor",
        "category": [
          "Sensors"
        ],
        "basePrice": 43000.0,
        "mass": 10.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmSensorEOIR01DmgLoose": {
        "friendly": "Miura Sensor: EO/IR (Loose, Damaged)",
        "short": "EO/IR Sensor",
        "category": [
          "Sensors"
        ],
        "basePrice": 8600.0,
        "mass": 10.0,
        "durability": 8.0,
        "source": "condowner"
      },
      "LiquidCoffee": {
        "friendly": "Moretti Coffee",
        "short": "Coffee",
        "category": [
          "LuxuryGoods"
        ],
        "basePrice": 13.75,
        "mass": 0.21,
        "source": "condowner"
      },
      "ItmRTAN2DmgLoose": {
        "friendly": "N2 Canister (Damaged, Loose)",
        "short": "N2 Can",
        "category": [
          "LifeSupport"
        ],
        "basePrice": 53.0,
        "mass": 115.0,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmRTAN2Loose": {
        "friendly": "N2 Canister (Loose)",
        "short": "N2 Can",
        "category": [
          "LifeSupport"
        ],
        "basePrice": 410.0,
        "mass": 115.0,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmAlarmN2DmgLoose": {
        "friendly": "N2 Pressure Alarm (Damaged, Loose)",
        "short": "N2 Alarm",
        "category": [
          "Sensors"
        ],
        "basePrice": 105.0,
        "mass": 0.5,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmAlarmN2OffLoose": {
        "friendly": "N2 Pressure Alarm (Loose)",
        "short": "N2 Alarm",
        "category": [
          "Sensors"
        ],
        "basePrice": 541.0,
        "mass": 0.5,
        "durability": 1.0,
        "source": "condowner"
      },
      "SOCNameDropManager": {
        "friendly": "Name Drop: Corporate Manager",
        "source": "condowner"
      },
      "SOCNameDropCrim": {
        "friendly": "Name Drop: Criminal",
        "source": "condowner"
      },
      "SOCNameDropLEO": {
        "friendly": "Name Drop: Law Enforcement Officer",
        "source": "condowner"
      },
      "ItmSensorEM01Loose": {
        "friendly": "NASA Sensor: EM (Loose)",
        "short": "EM Sensor",
        "category": [
          "Sensors"
        ],
        "basePrice": 3200.0,
        "mass": 5.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmSensorEM01DmgLoose": {
        "friendly": "NASA Sensor: EM (Loose, Damaged)",
        "short": "EM Sensor",
        "category": [
          "Sensors"
        ],
        "basePrice": 640.0,
        "mass": 5.0,
        "durability": 7.0,
        "source": "condowner"
      },
      "ItmSensorIR01Loose": {
        "friendly": "NASA Sensor: IR (Loose)",
        "short": "IR Sensor",
        "category": [
          "Sensors"
        ],
        "basePrice": 12000.0,
        "mass": 5.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmSensorIR01DmgLoose": {
        "friendly": "NASA Sensor: IR (Loose, Damaged)",
        "short": "IR Sensor",
        "category": [
          "Sensors"
        ],
        "basePrice": 2400.0,
        "mass": 7.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmSensorRadar01Loose": {
        "friendly": "NASA Sensor: Radar (Loose)",
        "short": "Radar",
        "category": [
          "Sensors"
        ],
        "basePrice": 30000.0,
        "mass": 130.0,
        "durability": 7.0,
        "source": "condowner"
      },
      "ItmSensorRadar01DmgLoose": {
        "friendly": "NASA Sensor: Radar (Loose, Damaged)",
        "short": "Radar",
        "category": [
          "Sensors"
        ],
        "basePrice": 600.0,
        "mass": 130.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmNavMod": {
        "friendly": "Nav Module",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 767.0,
        "mass": 0.4,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmNavModMobo": {
        "friendly": "Nav Module",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 767.0,
        "mass": 0.4,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmNavModMoboScreen": {
        "friendly": "Nav Module",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 767.0,
        "mass": 0.4,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmNavModDmg": {
        "friendly": "Nav Module (Damaged)",
        "short": "Nav Module (Dmg)",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 159.0,
        "mass": 0.4,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmNavModMoboDmg": {
        "friendly": "Nav Module (Damaged)",
        "short": "Nav Module (Dmg)",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 159.0,
        "mass": 0.4,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmNavModMoboScreenDmg": {
        "friendly": "Nav Module (Damaged)",
        "short": "Nav Module (Dmg)",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 159.0,
        "mass": 0.4,
        "durability": 4.0,
        "source": "condowner"
      },
      "DataBINNavStationData": {
        "friendly": "NAVDATA.BIN",
        "source": "cooverlay"
      },
      "ItmWeaponNightstick02": {
        "friendly": "Nightstick",
        "category": [
          "Weapons"
        ],
        "basePrice": 65.0,
        "mass": 0.68,
        "durability": 16.0,
        "source": "condowner"
      },
      "ItmCanisterO2Small": {
        "friendly": "O2 Bottle",
        "category": [
          "LifeSupport"
        ],
        "basePrice": 48.0,
        "mass": 11.0,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmCanisterO2SmallDmg": {
        "friendly": "O2 Bottle (Damaged)",
        "short": "O2 Bottle",
        "category": [
          "LifeSupport"
        ],
        "basePrice": 9.0,
        "mass": 11.0,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmCanisterO2SmallInject": {
        "friendly": "O2 Bottle (Injecting)",
        "short": "O2 Bottle",
        "category": [
          "LifeSupport"
        ],
        "basePrice": 48.0,
        "mass": 11.0,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmCanisterO2SmallRefill": {
        "friendly": "O2 Bottle (Refreshing)",
        "short": "O2 Bottle",
        "category": [
          "LifeSupport"
        ],
        "basePrice": 48.0,
        "mass": 11.0,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmRTAO2DmgLoose": {
        "friendly": "O2 Canister (Damaged, Loose)",
        "short": "O2 Can",
        "category": [
          "LifeSupport"
        ],
        "basePrice": 53.0,
        "mass": 115.0,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmRTAO2Loose": {
        "friendly": "O2 Canister (Loose)",
        "short": "O2 Can",
        "category": [
          "LifeSupport"
        ],
        "basePrice": 410.0,
        "mass": 115.0,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmAlarmO2DmgLoose": {
        "friendly": "O2 Pressure Alarm (Damaged, Loose)",
        "short": "O2 Alarm",
        "category": [
          "Sensors"
        ],
        "basePrice": 134.0,
        "mass": 0.5,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmAlarmO2OffLoose": {
        "friendly": "O2 Pressure Alarm (Loose)",
        "short": "O2 Alarm",
        "category": [
          "Sensors"
        ],
        "basePrice": 659.0,
        "mass": 0.5,
        "durability": 1.0,
        "source": "condowner"
      },
      "SOCOfferSmoke": {
        "friendly": "Offer a Smoke",
        "source": "condowner"
      },
      "ItmCargoOre01": {
        "friendly": "Ore Cargo",
        "category": [
          "Ore"
        ],
        "basePrice": 1000.0,
        "mass": 50.0,
        "durability": 25.0,
        "source": "condowner"
      },
      "ItmMineral03": {
        "friendly": "Ore: Carbon/Carbides",
        "short": "Ore: Carbon",
        "category": [
          "Ore"
        ],
        "basePrice": 99.0,
        "mass": 10.0,
        "durability": 101.0,
        "source": "condowner"
      },
      "ItmMineral08": {
        "friendly": "Ore: Cobalt",
        "category": [
          "Ore"
        ],
        "basePrice": 4000.0,
        "mass": 10.0,
        "durability": 101.0,
        "source": "condowner"
      },
      "ItmMineral09": {
        "friendly": "Ore: Gold",
        "category": [
          "Ore"
        ],
        "basePrice": 10000.0,
        "mass": 10.0,
        "durability": 101.0,
        "source": "condowner"
      },
      "ItmMineral06": {
        "friendly": "Ore: Iridium",
        "category": [
          "Ore"
        ],
        "basePrice": 12000.0,
        "mass": 10.0,
        "durability": 101.0,
        "source": "condowner"
      },
      "ItmMineral01": {
        "friendly": "Ore: Meteoric Iron",
        "short": "Ore: Iron",
        "category": [
          "Ore"
        ],
        "basePrice": 450.0,
        "mass": 20.0,
        "durability": 101.0,
        "source": "condowner"
      },
      "ItmMineral02": {
        "friendly": "Ore: Olivine",
        "category": [
          "Ore"
        ],
        "basePrice": 180.0,
        "mass": 10.0,
        "durability": 101.0,
        "source": "condowner"
      },
      "ItmMineral07": {
        "friendly": "Ore: Palladium",
        "category": [
          "Ore"
        ],
        "basePrice": 8000.0,
        "mass": 10.0,
        "durability": 101.0,
        "source": "condowner"
      },
      "ItmMineral05": {
        "friendly": "Ore: Platinum",
        "category": [
          "Ore"
        ],
        "basePrice": 15000.0,
        "mass": 10.0,
        "durability": 101.0,
        "source": "condowner"
      },
      "ItmMineral04": {
        "friendly": "Ore: Silicates",
        "category": [
          "Ore"
        ],
        "basePrice": 200.0,
        "mass": 10.0,
        "durability": 101.0,
        "source": "condowner"
      },
      "ItmMineral10": {
        "friendly": "Ore: Wolfram",
        "category": [
          "Ore"
        ],
        "basePrice": 2000.0,
        "mass": 10.0,
        "durability": 101.0,
        "source": "condowner"
      },
      "ItmLitCeiling1x1OffLoose": {
        "friendly": "Overhead Light: Blue (Loose)",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 583.0,
        "mass": 1.5,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmLitCeiling1x1OffLooseCustom": {
        "friendly": "Overhead Light: Blue Setting (Loose)",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 2681.0,
        "mass": 1.5,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmLitCeiling1x1VibrantGreenOffLoose": {
        "friendly": "Overhead Light: Green (Loose)",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 583.0,
        "mass": 1.5,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmLitCeiling1x1VibrantGreenOffLooseCustom": {
        "friendly": "Overhead Light: Green Setting (Loose)",
        "short": "Light",
        "category": [
          "FusionParts"
        ],
        "basePrice": 2681.0,
        "mass": 1.5,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmLitCeiling1x1OrangeOffLoose": {
        "friendly": "Overhead Light: Orange (Loose)",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 583.0,
        "mass": 1.5,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmLitCeiling1x1OrangeOffLooseCustom": {
        "friendly": "Overhead Light: Orange Setting (Loose)",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 2681.0,
        "mass": 1.5,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmLitCeiling1x1VibrantPurpleOffLoose": {
        "friendly": "Overhead Light: Plurple (Loose)",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 1779.79,
        "mass": 1.5,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmLitCeiling1x1VibrantPurpleOffLooseCustom": {
        "friendly": "Overhead Light: Purple Setting (Loose)",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 2681.0,
        "mass": 1.5,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmLitCeiling1x1VibrantRedOffLoose": {
        "friendly": "Overhead Light: Red (Loose)",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 583.0,
        "mass": 1.5,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmLitCeiling1x1VibrantRedOffLooseCustom": {
        "friendly": "Overhead Light: Red Setting (Loose)",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 2681.0,
        "mass": 1.5,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmLitCeiling1x1WhiteOffLoose": {
        "friendly": "Overhead Light: White (Loose)",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 583.0,
        "mass": 1.5,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmLitCeiling1x1WhiteOffLooseCustom": {
        "friendly": "Overhead Light: White Setting (Loose)",
        "short": "Light",
        "category": [
          "Electronics"
        ],
        "basePrice": 2681.0,
        "mass": 1.5,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmOxygenCandle01": {
        "friendly": "Oxygen Candle",
        "short": "O2 Candle",
        "category": [
          "LifeSupport"
        ],
        "basePrice": 360.0,
        "mass": 1.8,
        "durability": 8.0,
        "source": "condowner"
      },
      "ItmOxygenCandle01On": {
        "friendly": "Oxygen Candle (Active)",
        "short": "O2 Candle",
        "category": [
          "LifeSupport"
        ],
        "basePrice": 360.0,
        "mass": 1.8,
        "durability": 8.0,
        "source": "condowner"
      },
      "ItmDocumentMeatPackaging": {
        "friendly": "Packaging: 'Perpetual Protein Project' Meat Product",
        "short": "Packaging",
        "category": [
          "Misc"
        ],
        "basePrice": 0.1,
        "mass": 0.003,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmDocumentMeatPackaging2": {
        "friendly": "Packaging: 'Perpetual Protein Project' Meat Product",
        "short": "Packaging",
        "category": [
          "Misc"
        ],
        "basePrice": 0.1,
        "mass": 0.003,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmPants01": {
        "friendly": "Pants: Blue Jeans",
        "short": "Jeans",
        "category": [
          "Textiles"
        ],
        "basePrice": 501.0,
        "mass": 0.25,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmChairStrap01Loose": {
        "friendly": "Passenger Seat",
        "short": "Seat",
        "category": [
          "Furniture"
        ],
        "basePrice": 410.0,
        "mass": 23.0,
        "durability": 8.0,
        "source": "condowner"
      },
      "ItmChairStrap01DmgLoose": {
        "friendly": "Passenger Seat (Damaged)",
        "short": "Seat",
        "category": [
          "Furniture"
        ],
        "basePrice": 82.0,
        "mass": 21.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmDocumentPermitOKLG01eUsed": {
        "friendly": "Permit: Black Ayotimiwa Salvage Permit",
        "category": [
          "Media"
        ],
        "basePrice": 1000000.0,
        "mass": 0.003,
        "durability": 1.0,
        "source": "cooverlay"
      },
      "ItmDocumentPermitOKLG01e": {
        "friendly": "Permit: Black Ayotimiwa Salvage Permit",
        "short": "Permit",
        "category": [
          "Media"
        ],
        "basePrice": 1000000.0,
        "mass": 0.003,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmDocumentPermitOKLG01cUsed": {
        "friendly": "Permit: Blue Ayotimiwa Salvage Permit",
        "category": [
          "Media"
        ],
        "basePrice": 30000.0,
        "mass": 0.003,
        "durability": 1.0,
        "source": "cooverlay"
      },
      "ItmDocumentPermitOKLG01c": {
        "friendly": "Permit: Blue Ayotimiwa Salvage Permit",
        "short": "Permit",
        "category": [
          "Media"
        ],
        "basePrice": 30000.0,
        "mass": 0.003,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmDocumentPermitOKLG01bUsed": {
        "friendly": "Permit: Red Ayotimiwa Salvage Permit",
        "category": [
          "Media"
        ],
        "basePrice": 13500.0,
        "mass": 0.003,
        "durability": 1.0,
        "source": "cooverlay"
      },
      "ItmDocumentPermitOKLG01b": {
        "friendly": "Permit: Red Ayotimiwa Salvage Permit",
        "short": "Permit",
        "category": [
          "Media"
        ],
        "basePrice": 13500.0,
        "mass": 0.003,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmDocumentPermitOKLG01dUsed": {
        "friendly": "Permit: Silver Ayotimiwa Salvage Permit",
        "category": [
          "Media"
        ],
        "basePrice": 120000.0,
        "mass": 0.003,
        "durability": 1.0,
        "source": "cooverlay"
      },
      "ItmDocumentPermitOKLG01d": {
        "friendly": "Permit: Silver Ayotimiwa Salvage Permit",
        "short": "Permit",
        "category": [
          "Media"
        ],
        "basePrice": 120000.0,
        "mass": 0.003,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmDocumentPermitOKLG01Used": {
        "friendly": "Permit: Yellow Ayotimiwa Salvage Permit",
        "category": [
          "Media"
        ],
        "basePrice": 5000.0,
        "mass": 0.003,
        "durability": 1.0,
        "source": "cooverlay"
      },
      "ItmDocumentPermitOKLG01": {
        "friendly": "Permit: Yellow Ayotimiwa Salvage Permit",
        "short": "Permit",
        "category": [
          "Media"
        ],
        "basePrice": 5000.0,
        "mass": 0.003,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmToolWorkLamp01On": {
        "friendly": "Phoebus Work Lamp",
        "short": "Lamp",
        "category": [
          "Tools"
        ],
        "basePrice": 68.0,
        "mass": 3.5,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmToolWorkLamp01": {
        "friendly": "Phoebus Work Lamp (Off)",
        "short": "Lamp",
        "category": [
          "Tools"
        ],
        "basePrice": 68.0,
        "mass": 3.5,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmPillPainkillerMinor01": {
        "friendly": "Pill: PharmaCon \"Cavilo\" Pain Relief",
        "short": "Pill",
        "category": [
          "Medical"
        ],
        "basePrice": 5.8,
        "mass": 0.0003,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmPillAntibiotic01": {
        "friendly": "Pill: Van Buren \"Amoxicillin\" Antibiotic",
        "short": "Pill",
        "category": [
          "Medical"
        ],
        "basePrice": 14.3,
        "mass": 0.0003,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmPillPainkiller01": {
        "friendly": "Pill: Van Buren \"Hydrocodone\" Pain Relief",
        "short": "Pill",
        "category": [
          "Medical"
        ],
        "basePrice": 16.8,
        "mass": 0.0003,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmPillAntiNausea01": {
        "friendly": "Pill: Van Buren \"Nausaway\" Anti-Nausea",
        "short": "Pill",
        "category": [
          "Medical"
        ],
        "basePrice": 5.2,
        "mass": 0.0003,
        "durability": 1.0,
        "source": "condowner"
      },
      "Placeholder": {
        "friendly": "Placeholder",
        "source": "condowner"
      },
      "DataSNDConfession": {
        "friendly": "PLEA_DEAL.SND",
        "source": "cooverlay"
      },
      "ItmWeaponPocketKnife01": {
        "friendly": "Pocketknife",
        "category": [
          "Weapons"
        ],
        "basePrice": 57.0,
        "mass": 0.198,
        "durability": 8.0,
        "source": "condowner"
      },
      "ItmStationNavLoose": {
        "friendly": "Polaris \"Standard Navigation Console\"  (Loose)",
        "short": "Nav Station",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 16880.0,
        "mass": 500.0,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmStationNavDmgLoose": {
        "friendly": "Polaris \"Standard Navigation Console\"  (Loose, Damaged)",
        "short": "Nav Station",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 3500.0,
        "mass": 500.0,
        "durability": 19.0,
        "source": "condowner"
      },
      "ItmAmmoDecoyMissile01": {
        "friendly": "Polaris Decoy Missile GDM-4",
        "short": "Decoy Missile",
        "category": [
          "Weapons"
        ],
        "basePrice": 5000.0,
        "mass": 150.0,
        "durability": 7.0,
        "source": "condowner"
      },
      "ItmAmmoDecoyMissile02": {
        "friendly": "Polaris Decoy Missile GDM-800",
        "short": "Decoy Missile",
        "category": [
          "Weapons"
        ],
        "basePrice": 25000.0,
        "mass": 150.0,
        "durability": 7.0,
        "source": "condowner"
      },
      "ItmAmmoDecoyMissile03": {
        "friendly": "Polaris Decoy Missile GDM-X1",
        "short": "Decoy Missile",
        "category": [
          "Weapons"
        ],
        "basePrice": 150000.0,
        "mass": 150.0,
        "durability": 7.0,
        "source": "condowner"
      },
      "ItmNavModMooringControl": {
        "friendly": "Polaris Mooring Control Module",
        "short": "Mooring",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 767.0,
        "mass": 0.4,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmNavModMooringControlDmg": {
        "friendly": "Polaris Mooring Control Module (Damaged)",
        "short": "Mooring (Dmg)",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 159.0,
        "mass": 0.4,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmNavModControlToggle": {
        "friendly": "Polaris Navigation Control Toggle Module",
        "short": "Control Toggle",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 767.0,
        "mass": 0.4,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmNavModControlToggleDmg": {
        "friendly": "Polaris Navigation Control Toggle Module (Damaged)",
        "short": "Control Toggle (Dmg)",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 159.0,
        "mass": 0.4,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmNavModControls": {
        "friendly": "Polaris Navigation Controls Module",
        "short": "Controls",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 767.0,
        "mass": 0.4,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmNavModControlsDmg": {
        "friendly": "Polaris Navigation Controls Module (Damaged)",
        "short": "Controls (Dmg)",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 159.0,
        "mass": 0.4,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmNavModCoursePlot": {
        "friendly": "Polaris Navigation Course Plot Module",
        "short": "Course Plot",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 767.0,
        "mass": 0.4,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmNavModCoursePlotDmg": {
        "friendly": "Polaris Navigation Course Plot Module (Damaged)",
        "short": "Course Plot (Dmg)",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 159.0,
        "mass": 0.4,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmNavModDiagnostics": {
        "friendly": "Polaris Navigation Diagnostics Module",
        "short": "Diagnostics",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 767.0,
        "mass": 0.4,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmNavModDiagnosticsDmg": {
        "friendly": "Polaris Navigation Diagnostics Module (Damaged)",
        "short": "Diagnostics (Dmg)",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 159.0,
        "mass": 0.4,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmNavModEngineMode": {
        "friendly": "Polaris Navigation Engine Mode Module",
        "short": "Engine Mode",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 767.0,
        "mass": 0.4,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmNavModEngineModeDmg": {
        "friendly": "Polaris Navigation Engine Mode Module (Damaged)",
        "short": "Engine Mode (Dmg)",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 159.0,
        "mass": 0.4,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmNavModFire3x3": {
        "friendly": "Polaris Navigation Fire Group Module",
        "short": "Fire Groups",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 767.0,
        "mass": 0.4,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmNavModFire2x2": {
        "friendly": "Polaris Navigation Fire Group Module",
        "short": "Fire Groups",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 767.0,
        "mass": 0.4,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmNavModFire3x3Dmg": {
        "friendly": "Polaris Navigation Fire Group Module (Damaged)",
        "short": "Fire Groups (Dmg)",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 159.0,
        "mass": 0.4,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmNavModFire2x2Dmg": {
        "friendly": "Polaris Navigation Fire Group Module (Damaged)",
        "short": "Fire Groups (Dmg)",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 159.0,
        "mass": 0.4,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmNavModFlightDynamics": {
        "friendly": "Polaris Navigation Flight Dynamics Module",
        "short": "Flight Dynamics",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 767.0,
        "mass": 0.4,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmNavModFlightDynamicsDmg": {
        "friendly": "Polaris Navigation Flight Dynamics Module (Damaged)",
        "short": "Flight Dynamics (Dmg)",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 159.0,
        "mass": 0.4,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmNavModDisplayControls": {
        "friendly": "Polaris Navigation Map Controls Module",
        "short": "Display Controls",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 767.0,
        "mass": 0.4,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmNavModDisplayControlsDmg": {
        "friendly": "Polaris Navigation Map Controls Module (Damaged)",
        "short": "Display Controls (Dmg)",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 159.0,
        "mass": 0.4,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmNavModMap": {
        "friendly": "Polaris Navigation Map Module",
        "short": "Map",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 767.0,
        "mass": 0.4,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmNavModMapDmg": {
        "friendly": "Polaris Navigation Map Module (Damaged)",
        "short": "Map (Dmg)",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 159.0,
        "mass": 0.4,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmNavModReserves": {
        "friendly": "Polaris Navigation Reserves Module",
        "short": "Reserves",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 767.0,
        "mass": 0.4,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmNavModReservesDmg": {
        "friendly": "Polaris Navigation Reserves Module (Damaged)",
        "short": "Reserves (Dmg)",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 159.0,
        "mass": 0.4,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmNavModSensorsMFD": {
        "friendly": "Polaris Navigation Sensors MFD Module",
        "short": "Sensors MFD",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 767.0,
        "mass": 0.4,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmNavModSensorsMFDDmg": {
        "friendly": "Polaris Navigation Sensors MFD Module (Damaged)",
        "short": "Sensors MFD (Dmg)",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 159.0,
        "mass": 0.4,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmNavModTargetData": {
        "friendly": "Polaris Navigation Target Data Module",
        "short": "Target Data",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 767.0,
        "mass": 0.4,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmNavModTargetDataDmg": {
        "friendly": "Polaris Navigation Target Data Module (Damaged)",
        "short": "Target Data (Dmg)",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 159.0,
        "mass": 0.4,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmNavModTimeZoom": {
        "friendly": "Polaris Navigation Time/Zoom Module",
        "short": "Time/Zoom",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 767.0,
        "mass": 0.4,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmNavModTimeZoomDmg": {
        "friendly": "Polaris Navigation Time/Zoom Module (Damaged)",
        "short": "Time/Zoom (Dmg)",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 159.0,
        "mass": 0.4,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmNavModTorchDrive": {
        "friendly": "Polaris Navigation Torch Drive Module",
        "short": "Torch Drive",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 767.0,
        "mass": 0.4,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmNavModTorchDriveDmg": {
        "friendly": "Polaris Navigation Torch Drive Module (Damaged)",
        "short": "Torch Drive (Dmg)",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 159.0,
        "mass": 0.4,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmNavModTransponder": {
        "friendly": "Polaris Navigation Transponder Module",
        "short": "Transponder",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 767.0,
        "mass": 0.4,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmNavModTransponderDmg": {
        "friendly": "Polaris Navigation Transponder Module (Damaged)",
        "short": "Transponder (Dmg)",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 159.0,
        "mass": 0.4,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmNavModWarnings": {
        "friendly": "Polaris Navigation Warnings Module",
        "short": "Warnings",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 767.0,
        "mass": 0.4,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmNavModWarningsDmg": {
        "friendly": "Polaris Navigation Warnings Module (Damaged)",
        "short": "Warnings (Dmg)",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 159.0,
        "mass": 0.4,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmNavModWeaponsMFD": {
        "friendly": "Polaris Navigation Weapons MFD Module",
        "short": "Weapons MFD",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 767.0,
        "mass": 0.4,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmNavModWeaponsMFDDmg": {
        "friendly": "Polaris Navigation Weapons MFD Module (Damaged)",
        "short": "Weapons MFD (Dmg)",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 159.0,
        "mass": 0.4,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmSensorOptical01Loose": {
        "friendly": "Polaris Sensor: Optical (Loose)",
        "short": "Optical Sensor",
        "category": [
          "Sensors"
        ],
        "basePrice": 5000.0,
        "mass": 7.0,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmSensorOptical01DmgLoose": {
        "friendly": "Polaris Sensor: Optical (Loose, Damaged)",
        "short": "Optical Sensor",
        "category": [
          "Sensors"
        ],
        "basePrice": 1000.0,
        "mass": 7.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "OutfitSuit09": {
        "friendly": "Port Authority Coveralls",
        "category": [
          "Textiles"
        ],
        "basePrice": 93.0,
        "mass": 1.0,
        "durability": 6.0,
        "source": "cooverlay"
      },
      "ItmDecorPoster11Loose": {
        "friendly": "Poster: Bismertnaya Vodka Classic (Loose)",
        "category": [
          "Media"
        ],
        "basePrice": 40.0,
        "mass": 0.005,
        "durability": 1.0,
        "source": "cooverlay"
      },
      "ItmDecorPoster12Loose": {
        "friendly": "Poster: Bismertnaya Vodka Psyche (Loose)",
        "category": [
          "Media"
        ],
        "basePrice": 40.0,
        "mass": 0.005,
        "durability": 1.0,
        "source": "cooverlay"
      },
      "ItmDecorPoster09Loose": {
        "friendly": "Poster: Black Bull Kape (Loose)",
        "category": [
          "Media"
        ],
        "basePrice": 40.0,
        "mass": 0.005,
        "durability": 1.0,
        "source": "cooverlay"
      },
      "ItmDecorPoster10Loose": {
        "friendly": "Poster: Damask Rose (Loose)",
        "category": [
          "Media"
        ],
        "basePrice": 40.0,
        "mass": 0.005,
        "durability": 1.0,
        "source": "cooverlay"
      },
      "ItmDecorPoster01Loose": {
        "friendly": "Poster: Grande Prêmio do Encantado (Loose)",
        "short": "Poster",
        "category": [
          "Media"
        ],
        "basePrice": 40.0,
        "mass": 0.005,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmDecorPoster05Loose": {
        "friendly": "Poster: Lucky says PANIC (Loose)",
        "category": [
          "Media"
        ],
        "basePrice": 40.0,
        "mass": 0.005,
        "durability": 1.0,
        "source": "cooverlay"
      },
      "ItmDecorPoster06Loose": {
        "friendly": "Poster: Lucky says YIELD (Loose)",
        "category": [
          "Media"
        ],
        "basePrice": 40.0,
        "mass": 0.005,
        "durability": 1.0,
        "source": "cooverlay"
      },
      "ItmDecorPoster00Loose": {
        "friendly": "Poster: New Earth Ostracon (Loose)",
        "short": "Poster",
        "category": [
          "Media"
        ],
        "basePrice": 400.0,
        "mass": 0.005,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmDecorPoster03Loose": {
        "friendly": "Poster: Travel Atlantis (Loose)",
        "category": [
          "Media"
        ],
        "basePrice": 40.0,
        "mass": 0.005,
        "durability": 1.0,
        "source": "cooverlay"
      },
      "ItmDecorPoster02Loose": {
        "friendly": "Poster: Travel Tharsis Landing (Loose)",
        "category": [
          "Media"
        ],
        "basePrice": 40.0,
        "mass": 0.005,
        "durability": 1.0,
        "source": "cooverlay"
      },
      "ItmDecorPoster04Loose": {
        "friendly": "Poster: Viceroy's Advertisement (Loose)",
        "category": [
          "Media"
        ],
        "basePrice": 40.0,
        "mass": 0.005,
        "durability": 1.0,
        "source": "cooverlay"
      },
      "ItmDocumentOgiso01Loose": {
        "friendly": "Poster: Work Safety (Loose)",
        "short": "Poster",
        "category": [
          "Media"
        ],
        "basePrice": 0.15,
        "mass": 0.005,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmSwitch01Loose": {
        "friendly": "Power Switch (Loose)",
        "short": "Switch",
        "category": [
          "Electronics"
        ],
        "basePrice": 66.5,
        "mass": 12.0,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmSwitch01DmgLoose": {
        "friendly": "Power Switch (Loose, Damaged)",
        "short": "Switch",
        "category": [
          "Electronics"
        ],
        "basePrice": 14.0,
        "mass": 12.0,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmShipCladding01Loose": {
        "friendly": "PPC Ablative Hull Cladding (Loose)",
        "short": "Cladding",
        "category": [
          "Hull"
        ],
        "basePrice": 8000.0,
        "mass": 20.0,
        "durability": 30.0,
        "source": "condowner"
      },
      "ItmShipCladding01DmgLoose": {
        "friendly": "PPC Ablative Hull Cladding (Loose, Damaged)",
        "short": "Cladding",
        "category": [
          "Hull"
        ],
        "basePrice": 300.0,
        "mass": 20.0,
        "durability": 30.0,
        "source": "condowner"
      },
      "DataIMGMeat01": {
        "friendly": "PPP.IMG",
        "source": "cooverlay"
      },
      "DataTXTMeat01": {
        "friendly": "PPP_History_01.TXT",
        "source": "cooverlay"
      },
      "DataTXTMeat02": {
        "friendly": "PPP_History_02.TXT",
        "source": "cooverlay"
      },
      "DataTXTMeat03": {
        "friendly": "PPP_History_03.TXT",
        "source": "cooverlay"
      },
      "DataTXTMeat04": {
        "friendly": "PPP_History_04.TXT",
        "source": "cooverlay"
      },
      "DataTXTMeat05": {
        "friendly": "PPP_History_05.TXT",
        "source": "cooverlay"
      },
      "DataTXTMeat06": {
        "friendly": "PPP_History_06.TXT",
        "source": "cooverlay"
      },
      "DataTXTMeat07": {
        "friendly": "PPP_History_07.TXT",
        "source": "cooverlay"
      },
      "DataTXTMeat08": {
        "friendly": "PPP_History_08.TXT",
        "source": "cooverlay"
      },
      "DataTXTMeat09": {
        "friendly": "PPP_History_09.TXT",
        "source": "cooverlay"
      },
      "OutfitPS02": {
        "friendly": "Pressure Suit",
        "category": [
          "SpaceSuits"
        ],
        "basePrice": 630.0,
        "mass": 4.0,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "OutfitPS01": {
        "friendly": "Pressure Suit",
        "category": [
          "SpaceSuits"
        ],
        "basePrice": 630.0,
        "mass": 4.0,
        "durability": 4.0,
        "source": "condowner"
      },
      "OutfitPS02Dmg": {
        "friendly": "Pressure Suit (Damaged)",
        "category": [
          "SpaceSuits"
        ],
        "basePrice": 630.0,
        "mass": 4.0,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "OutfitPS01Dmg": {
        "friendly": "Pressure Suit (Damaged)",
        "short": "Pressure Suit",
        "category": [
          "SpaceSuits"
        ],
        "basePrice": 130.0,
        "mass": 4.0,
        "durability": 8.0,
        "source": "condowner"
      },
      "OutfitHelmet02": {
        "friendly": "Pressure Suit Helmet",
        "short": "Helmet",
        "category": [
          "SpaceSuits"
        ],
        "basePrice": 235.0,
        "mass": 1.5,
        "durability": 7.0,
        "source": "condowner"
      },
      "OutfitHelmet02Dmg": {
        "friendly": "Pressure Suit Helmet (Damaged)",
        "short": "Helmet",
        "category": [
          "SpaceSuits"
        ],
        "basePrice": 46.0,
        "mass": 1.5,
        "durability": 15.0,
        "source": "condowner"
      },
      "SOCPretendCatch": {
        "friendly": "Pretend to Catch",
        "source": "condowner"
      },
      "SOCPretendFumble": {
        "friendly": "Pretend to Fumble",
        "source": "condowner"
      },
      "DataTXTHelioHoraInfo": {
        "friendly": "PRISONER_INFO_HELIOHORA.TXT",
        "source": "cooverlay"
      },
      "OutfitSuit07": {
        "friendly": "Purple Coveralls",
        "short": "Coveralls",
        "category": [
          "Textiles"
        ],
        "basePrice": 570000.0,
        "mass": 1.0,
        "durability": 600.0,
        "source": "condowner"
      },
      "DataBINPDACracker": {
        "friendly": "R3N-B00.BIN",
        "source": "cooverlay"
      },
      "ItmShipWeaponMassThrower02DmgLoose": {
        "friendly": "Railgun (Damaged, Loose)",
        "short": "Railgun",
        "category": [
          "Weapons"
        ],
        "basePrice": 9000.0,
        "mass": 210.0,
        "durability": 18.0,
        "source": "condowner"
      },
      "ItmShipWeaponMassThrower02Loose": {
        "friendly": "Railgun (Loose)",
        "short": "Railgun",
        "category": [
          "Weapons"
        ],
        "basePrice": 45000.0,
        "mass": 210.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmRCSDistro02Loose": {
        "friendly": "RCS Intake Regulator: Kang \"2202\" (Loose)",
        "short": "Intake",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 1692.0,
        "mass": 28.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmRCSDistro02DmgLoose": {
        "friendly": "RCS Intake Regulator: Kang \"2202\" (Loose, Damaged)",
        "short": "Intake",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 355.0,
        "mass": 28.0,
        "durability": 15.0,
        "source": "condowner"
      },
      "ItmRCSDistro01Loose": {
        "friendly": "RCS Intake Regulator: Miura \"Hydra\" (Loose)",
        "short": "Intake",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 32266.0,
        "mass": 28.0,
        "durability": 8.0,
        "source": "condowner"
      },
      "ItmRCSDistro01DmgLoose": {
        "friendly": "RCS Intake Regulator: Miura \"Hydra\" (Loose, Damaged)",
        "short": "Intake",
        "category": [
          "ControlSystems"
        ],
        "basePrice": 7330.0,
        "mass": 28.0,
        "durability": 22.0,
        "source": "condowner"
      },
      "ItmFusionFuelRegulator01Loose": {
        "friendly": "Reactor Fuel Regulator (Loose)",
        "short": "Fuel Regulator",
        "category": [
          "FusionParts"
        ],
        "basePrice": 13134.0,
        "mass": 28.0,
        "durability": 8.0,
        "source": "condowner"
      },
      "ItmFusionFuelRegulator01DmgLoose": {
        "friendly": "Reactor Fuel Regulator (Loose, Damaged)",
        "short": "Fuel Regulator",
        "category": [
          "FusionParts"
        ],
        "basePrice": 3283.0,
        "mass": 28.0,
        "durability": 22.0,
        "source": "condowner"
      },
      "SOCReassure": {
        "friendly": "Reassure",
        "source": "condowner"
      },
      "OutfitSuit03": {
        "friendly": "Red Coveralls: Newcal",
        "short": "Coveralls",
        "category": [
          "Textiles"
        ],
        "basePrice": 225.0,
        "mass": 1.0,
        "durability": 6.0,
        "source": "condowner"
      },
      "Regolith": {
        "friendly": "Regolith",
        "source": "condowner"
      },
      "RegolithBig": {
        "friendly": "Regolith",
        "source": "condowner"
      },
      "RegolithEuropa": {
        "friendly": "Regolith",
        "source": "condowner"
      },
      "RegolithEuropa02": {
        "friendly": "Regolith",
        "source": "condowner"
      },
      "ItmMineralStone01": {
        "friendly": "Regolith (Loose)",
        "short": "Regolith",
        "category": [
          "Ore"
        ],
        "basePrice": 35.0,
        "mass": 20.0,
        "durability": 60.0,
        "source": "condowner"
      },
      "RegolithVoid": {
        "friendly": "RegolithVoid",
        "short": "Void",
        "source": "condowner"
      },
      "RegolithVoidBig": {
        "friendly": "RegolithVoidBig",
        "short": "Void",
        "source": "condowner"
      },
      "DataSNDVoiceMemo": {
        "friendly": "REMINDER.SND",
        "source": "cooverlay"
      },
      "SOCReminisce": {
        "friendly": "Reminisce",
        "source": "condowner"
      },
      "DataIMGRemoteControlCat": {
        "friendly": "REMOTECATROL.IMG",
        "source": "cooverlay"
      },
      "ItmWristPDA01": {
        "friendly": "Renbao \"Portal\" PDA",
        "short": "PDA",
        "category": [
          "Electronics"
        ],
        "basePrice": 270.0,
        "mass": 0.4,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmWristPDA01Dmg": {
        "friendly": "Renbao \"Portal\" PDA (Damaged)",
        "short": "PDA",
        "category": [
          "Electronics"
        ],
        "basePrice": 22.0,
        "mass": 0.4,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmWristPDA01Locked": {
        "friendly": "Renbao \"Portal\" PDA (Locked)",
        "short": "PDA",
        "category": [
          "Electronics"
        ],
        "basePrice": 270.0,
        "mass": 0.4,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmTV01Loose": {
        "friendly": "Renbao \"Smart\" TV (Loose)",
        "short": "TV",
        "category": [
          "Media"
        ],
        "basePrice": 366.0,
        "mass": 13.0,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmPDACart00": {
        "friendly": "Renbao Blank Cartridge",
        "short": "PDA Cartridge",
        "category": [
          "Electronics"
        ],
        "basePrice": 4096.0,
        "mass": 0.06,
        "durability": 2.0,
        "source": "condowner"
      },
      "Braincase": {
        "friendly": "Renbao Cerebrum Armature",
        "mass": 24.79,
        "source": "condowner"
      },
      "ItmPDACartDmgViz": {
        "friendly": "Renbao DmgViz Cartridge",
        "category": [
          "Electronics"
        ],
        "basePrice": 4096.0,
        "mass": 0.06,
        "durability": 2.0,
        "source": "cooverlay"
      },
      "ItmPDACartHeatViz": {
        "friendly": "Renbao HeatViz Cartridge",
        "category": [
          "Electronics"
        ],
        "basePrice": 4096.0,
        "mass": 0.06,
        "durability": 2.0,
        "source": "cooverlay"
      },
      "ItmPDACartKpaViz": {
        "friendly": "Renbao KpaViz Cartridge",
        "category": [
          "Electronics"
        ],
        "basePrice": 4096.0,
        "mass": 0.06,
        "durability": 2.0,
        "source": "cooverlay"
      },
      "ItmPDACartMassViz": {
        "friendly": "Renbao MassViz Cartridge",
        "category": [
          "Electronics"
        ],
        "basePrice": 4096.0,
        "mass": 0.06,
        "durability": 2.0,
        "source": "cooverlay"
      },
      "ItmPDACartPriceViz": {
        "friendly": "Renbao PriceViz Cartridge",
        "category": [
          "Electronics"
        ],
        "basePrice": 4096.0,
        "mass": 0.06,
        "durability": 2.0,
        "source": "cooverlay"
      },
      "ItmPDACartPwrViz": {
        "friendly": "Renbao PwrViz Cartridge",
        "category": [
          "Electronics"
        ],
        "basePrice": 4096.0,
        "mass": 0.06,
        "durability": 2.0,
        "source": "cooverlay"
      },
      "ItmDataCard01": {
        "friendly": "Renbao R014 Data Card",
        "short": "Data Card",
        "category": [
          "Electronics"
        ],
        "basePrice": 31.0,
        "mass": 0.01,
        "durability": 2.0,
        "source": "condowner"
      },
      "DataTXTGame01": {
        "friendly": "RETRO_RPG.TXT",
        "source": "cooverlay"
      },
      "WoundArmFractureR": {
        "friendly": "Right Arm",
        "source": "condowner"
      },
      "BodyfootRA": {
        "friendly": "Right Foot",
        "short": "R Foot",
        "mass": 0.931,
        "source": "condowner"
      },
      "BodyRobothandR": {
        "friendly": "Right Hand",
        "short": "R Hand",
        "mass": 0.575,
        "source": "condowner"
      },
      "BodyhandRA": {
        "friendly": "Right Hand",
        "short": "R Hand",
        "mass": 0.575,
        "source": "condowner"
      },
      "WoundLegFractureR": {
        "friendly": "Right Leg",
        "source": "condowner"
      },
      "DataVIDRoboKetchup": {
        "friendly": "ROBOKETCHUP.VID",
        "source": "cooverlay"
      },
      "WoundRobotHead": {
        "friendly": "Robot Head",
        "source": "condowner"
      },
      "RobotBodyMovementUnit": {
        "friendly": "Robot Movement Unit",
        "short": "Robot Legs",
        "mass": 11.125,
        "source": "condowner"
      },
      "WoundRobotMovementUnit": {
        "friendly": "Robot Movement Unit",
        "source": "condowner"
      },
      "WoundRobotTorso": {
        "friendly": "Robot Torso",
        "source": "condowner"
      },
      "DataBINRoster_PMC": {
        "friendly": "ROSTER_PMC.BIN",
        "source": "cooverlay"
      },
      "ItmHeavyLiftRotor01OnWheel": {
        "friendly": "Rotor Blade",
        "short": "Heavy Lift Rotor Blade",
        "source": "condowner"
      },
      "ItmTowingBrace01DmgLoose": {
        "friendly": "Ryokka \"T7N\" Towing Brace 1/2 (Damaged, Loose)",
        "short": "Tow Brace",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 2394.0,
        "mass": 90.0,
        "durability": 15.0,
        "source": "condowner"
      },
      "ItmTowingBrace01Loose": {
        "friendly": "Ryokka \"T7N\" Towing Brace 1/2 (Loose)",
        "short": "Tow Brace",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 11972.0,
        "mass": 90.0,
        "durability": 40.0,
        "source": "condowner"
      },
      "DataSNDSakuraNoir": {
        "friendly": "SAKURANOIR.SND",
        "source": "cooverlay"
      },
      "ItmCargoScience01": {
        "friendly": "Science Cargo",
        "category": [
          "Science"
        ],
        "basePrice": 5000.0,
        "mass": 25.0,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmScrapPlastic": {
        "friendly": "Scrap 'Caylon' Plastic",
        "short": "Plastic",
        "category": [
          "Plastics"
        ],
        "basePrice": 46.0,
        "mass": 0.3,
        "durability": 2.0,
        "source": "condowner"
      },
      "ItmScrapAluminum": {
        "friendly": "Scrap Aluminum",
        "short": "Aluminum",
        "category": [
          "Metals"
        ],
        "basePrice": 1.1,
        "mass": 1.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmScrapCarbonFiber": {
        "friendly": "Scrap Carbon Fiber",
        "short": "Carbon Fiber",
        "category": [
          "Metals"
        ],
        "basePrice": 0.12,
        "mass": 1.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmScrapClothClean": {
        "friendly": "Scrap Cloth (Clean)",
        "short": "Cloth",
        "category": [
          "Textiles"
        ],
        "basePrice": 2.4,
        "mass": 0.025,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmScrapClothDirty": {
        "friendly": "Scrap Cloth (Dirty)",
        "short": "Cloth",
        "category": [
          "Textiles"
        ],
        "basePrice": 0.8,
        "mass": 0.025,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmScrapSteel": {
        "friendly": "Scrap Steel",
        "short": "Steel",
        "category": [
          "Metals"
        ],
        "basePrice": 3.6,
        "mass": 1.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "OutfitSuit04": {
        "friendly": "Seagreen Coveralls: Ubiq",
        "short": "Coveralls",
        "category": [
          "Textiles"
        ],
        "basePrice": 360.0,
        "mass": 1.0,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmChair04DmgLoose": {
        "friendly": "Seat (Damaged, Loose): Minsheng \"红运\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 17.0,
        "mass": 9.0,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmChairCube01aDmgLoose": {
        "friendly": "Seat (Damaged, Loose): Testudo \"Concourse Series 1-A\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 17.0,
        "mass": 9.0,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmChairCube01cDmgLoose": {
        "friendly": "Seat (Damaged, Loose): Testudo \"Concourse Series 1-C\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 17.0,
        "mass": 9.0,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmChairCube02aDmgLoose": {
        "friendly": "Seat (Damaged, Loose): Testudo \"Concourse Series 2-A\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 17.0,
        "mass": 9.0,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmChairCube02bDmgLoose": {
        "friendly": "Seat (Damaged, Loose): Testudo \"Concourse Series 2-B\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 67.0,
        "mass": 12.0,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmChairCube02cDmgLoose": {
        "friendly": "Seat (Damaged, Loose): Testudo \"Concourse Series 2-C\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 17.0,
        "mass": 9.0,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmChairCube03aDmgLoose": {
        "friendly": "Seat (Damaged, Loose): Testudo \"Concourse Series 3-A\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 17.0,
        "mass": 9.0,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmChairCube03bDmgLoose": {
        "friendly": "Seat (Damaged, Loose): Testudo \"Concourse Series 3-B\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 67.0,
        "mass": 12.0,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmChairCube03cDmgLoose": {
        "friendly": "Seat (Damaged, Loose): Testudo \"Concourse Series 3-C\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 17.0,
        "mass": 9.0,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmChairCube04aDmgLoose": {
        "friendly": "Seat (Damaged, Loose): Testudo \"Concourse Series 4-A\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 17.0,
        "mass": 9.0,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmChairCube04bDmgLoose": {
        "friendly": "Seat (Damaged, Loose): Testudo \"Concourse Series 4-B\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 67.0,
        "mass": 12.0,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmChairCube04cDmgLoose": {
        "friendly": "Seat (Damaged, Loose): Testudo \"Concourse Series 4-C\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 17.0,
        "mass": 9.0,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmChair03DmgLoose": {
        "friendly": "Seat (Damaged, Loose): Testudo \"Saloon Series\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 17.0,
        "mass": 9.0,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmChair04Loose": {
        "friendly": "Seat (Loose): Minsheng \"红运\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 85.0,
        "mass": 11.0,
        "durability": 6.0,
        "source": "cooverlay"
      },
      "ItmChairCube01aLoose": {
        "friendly": "Seat (Loose): Testudo \"Concourse Series 1-A\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 85.0,
        "mass": 11.0,
        "durability": 6.0,
        "source": "cooverlay"
      },
      "ItmChairCube01cLoose": {
        "friendly": "Seat (Loose): Testudo \"Concourse Series 1-C\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 85.0,
        "mass": 11.0,
        "durability": 6.0,
        "source": "cooverlay"
      },
      "ItmChairCube02aLoose": {
        "friendly": "Seat (Loose): Testudo \"Concourse Series 2-A\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 85.0,
        "mass": 11.0,
        "durability": 6.0,
        "source": "cooverlay"
      },
      "ItmChairCube02bLoose": {
        "friendly": "Seat (Loose): Testudo \"Concourse Series 2-B\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 335.0,
        "mass": 14.0,
        "durability": 6.0,
        "source": "cooverlay"
      },
      "ItmChairCube02cLoose": {
        "friendly": "Seat (Loose): Testudo \"Concourse Series 2-C\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 85.0,
        "mass": 11.0,
        "durability": 6.0,
        "source": "cooverlay"
      },
      "ItmChairCube03aLoose": {
        "friendly": "Seat (Loose): Testudo \"Concourse Series 3-A\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 85.0,
        "mass": 11.0,
        "durability": 6.0,
        "source": "cooverlay"
      },
      "ItmChairCube03bLoose": {
        "friendly": "Seat (Loose): Testudo \"Concourse Series 3-B\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 335.0,
        "mass": 14.0,
        "durability": 6.0,
        "source": "cooverlay"
      },
      "ItmChairCube03cLoose": {
        "friendly": "Seat (Loose): Testudo \"Concourse Series 3-C\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 85.0,
        "mass": 11.0,
        "durability": 6.0,
        "source": "cooverlay"
      },
      "ItmChairCube04aLoose": {
        "friendly": "Seat (Loose): Testudo \"Concourse Series 4-A\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 85.0,
        "mass": 11.0,
        "durability": 6.0,
        "source": "cooverlay"
      },
      "ItmChairCube04bLoose": {
        "friendly": "Seat (Loose): Testudo \"Concourse Series 4-B\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 335.0,
        "mass": 14.0,
        "durability": 6.0,
        "source": "cooverlay"
      },
      "ItmChairCube04cLoose": {
        "friendly": "Seat (Loose): Testudo \"Concourse Series 4-C\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 85.0,
        "mass": 11.0,
        "durability": 6.0,
        "source": "cooverlay"
      },
      "ItmChair03Loose": {
        "friendly": "Seat (Loose): Testudo \"Saloon Series\"",
        "category": [
          "Furniture"
        ],
        "basePrice": 85.0,
        "mass": 11.0,
        "durability": 6.0,
        "source": "cooverlay"
      },
      "ItmChairCube01bDmgLoose": {
        "friendly": "Seat: Testudo \"Concourse Series 1-B\" (Damaged Loose)",
        "short": "Chair",
        "category": [
          "Furniture"
        ],
        "basePrice": 67.0,
        "mass": 12.0,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmChairCube01bLoose": {
        "friendly": "Seat: Testudo \"Concourse Series 1-B\" (Loose)",
        "short": "Chair",
        "category": [
          "Furniture"
        ],
        "basePrice": 335.0,
        "mass": 14.0,
        "durability": 6.0,
        "source": "condowner"
      },
      "SOCShareAnotherStory": {
        "friendly": "Share Another Story",
        "source": "condowner"
      },
      "ItmBattery02Loose": {
        "friendly": "Ship Battery (Loose)",
        "short": "Battery",
        "category": [
          "Electronics"
        ],
        "basePrice": 2623.0,
        "mass": 45.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmBattery02DmgLoose": {
        "friendly": "Ship Battery (Loose, Damaged)",
        "short": "Battery",
        "category": [
          "Electronics"
        ],
        "basePrice": 524.0,
        "mass": 45.0,
        "durability": 30.0,
        "source": "condowner"
      },
      "ShipCO": {
        "friendly": "ShipCO",
        "source": "condowner"
      },
      "ItmShirt01": {
        "friendly": "Shirt: Gray Long-Sleeve",
        "short": "Shirt",
        "category": [
          "Textiles"
        ],
        "basePrice": 87.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmWeaponShiv01": {
        "friendly": "Shiv",
        "category": [
          "Weapons"
        ],
        "basePrice": 3.0,
        "mass": 0.525,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmShoe01L": {
        "friendly": "Shoe: Black Wing \"Terra Toe\" (Left)",
        "short": "Shoe L",
        "category": [
          "Textiles"
        ],
        "basePrice": 126.0,
        "mass": 2.1,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmShoe01R": {
        "friendly": "Shoe: Black Wing \"Terra Toe\" (Right)",
        "short": "Shoe R",
        "category": [
          "Textiles"
        ],
        "basePrice": 126.0,
        "mass": 2.1,
        "durability": 5.0,
        "source": "condowner"
      },
      "OutfitShoeSneaker01L": {
        "friendly": "Shoe: Sneaker (Left)",
        "category": [
          "Textiles"
        ],
        "basePrice": 126.0,
        "mass": 2.1,
        "durability": 5.0,
        "source": "cooverlay"
      },
      "OutfitShoeSneaker02L": {
        "friendly": "Shoe: Sneaker (Left)",
        "category": [
          "Textiles"
        ],
        "basePrice": 126.0,
        "mass": 2.1,
        "durability": 5.0,
        "source": "cooverlay"
      },
      "OutfitShoeSneaker03L": {
        "friendly": "Shoe: Sneaker (Left)",
        "category": [
          "Textiles"
        ],
        "basePrice": 126.0,
        "mass": 2.1,
        "durability": 5.0,
        "source": "cooverlay"
      },
      "OutfitShoeSneaker01R": {
        "friendly": "Shoe: Sneaker (Right)",
        "category": [
          "Textiles"
        ],
        "basePrice": 126.0,
        "mass": 2.1,
        "durability": 5.0,
        "source": "cooverlay"
      },
      "OutfitShoeSneaker02R": {
        "friendly": "Shoe: Sneaker (Right)",
        "category": [
          "Textiles"
        ],
        "basePrice": 126.0,
        "mass": 2.1,
        "durability": 5.0,
        "source": "cooverlay"
      },
      "OutfitShoeSneaker03R": {
        "friendly": "Shoe: Sneaker (Right)",
        "category": [
          "Textiles"
        ],
        "basePrice": 126.0,
        "mass": 2.1,
        "durability": 5.0,
        "source": "cooverlay"
      },
      "SOCShootersSuck": {
        "friendly": "Shooters Suck",
        "source": "condowner"
      },
      "ItmWeaponNightstick01": {
        "friendly": "Short Billy Club",
        "short": "Billy Club",
        "category": [
          "Weapons"
        ],
        "basePrice": 55.0,
        "mass": 0.48,
        "durability": 14.0,
        "source": "condowner"
      },
      "DataBINAtlantisResearch": {
        "friendly": "SIGHTINGS.BIN",
        "source": "cooverlay"
      },
      "DataSNDSilversmythBloopers": {
        "friendly": "SILVERSMYTH_BLOOPERS.SND",
        "source": "cooverlay"
      },
      "DataSNDSilversmythAlbum": {
        "friendly": "SILVERSMYTH_GOLD.SND",
        "source": "cooverlay"
      },
      "DataSNDSilversmythRIP": {
        "friendly": "SILVERSMYTH_RIP.SND",
        "source": "cooverlay"
      },
      "ItmBed01DmgLoose": {
        "friendly": "Sleeping Bunk (Damaged, Loose)",
        "short": "Bunk",
        "category": [
          "LuxuryGoods"
        ],
        "basePrice": 294.0,
        "mass": 30.0,
        "durability": 25.0,
        "source": "condowner"
      },
      "ItmBed01Loose": {
        "friendly": "Sleeping Bunk (Loose)",
        "short": "Bunk",
        "category": [
          "LuxuryGoods"
        ],
        "basePrice": 2280.0,
        "mass": 30.0,
        "durability": 12.0,
        "source": "condowner"
      },
      "ItmWeaponBaseballBat02": {
        "friendly": "Slugger",
        "short": "Bat",
        "category": [
          "Weapons"
        ],
        "basePrice": 290.0,
        "mass": 1.1,
        "durability": 9.0,
        "source": "condowner"
      },
      "ItmPartsElecSmall01": {
        "friendly": "Small Electronic Parts",
        "short": "Elec. Parts",
        "category": [
          "Electronics"
        ],
        "basePrice": 14.5,
        "mass": 0.5,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmPartsMechSmall01": {
        "friendly": "Small Mechanical Parts",
        "short": "Mech. Parts",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 5.0,
        "mass": 0.5,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmAmmoMissile01": {
        "friendly": "Smartlink 'Rancor' Missile",
        "short": "Missile",
        "category": [
          "Weapons"
        ],
        "basePrice": 20000.0,
        "mass": 150.0,
        "durability": 7.0,
        "source": "condowner"
      },
      "ItmAlarmSmokeDmgLoose": {
        "friendly": "Smoke Alarm (Damaged, Loose)",
        "short": "Smoke Alarm",
        "category": [
          "Sensors"
        ],
        "basePrice": 51.0,
        "mass": 0.5,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmAlarmSmokeOffLoose": {
        "friendly": "Smoke Alarm (Loose)",
        "short": "Smoke Alarm",
        "category": [
          "Sensors"
        ],
        "basePrice": 256.0,
        "mass": 0.5,
        "durability": 2.0,
        "source": "condowner"
      },
      "Social Moves": {
        "friendly": "Social Moves",
        "source": "condowner"
      },
      "DataVIDFilm05": {
        "friendly": "SOUTHERN_HIGHLAND.VID",
        "source": "cooverlay"
      },
      "ItmAmmoMissile03": {
        "friendly": "Soyuzneft 'Belter Bomb' Missile",
        "short": "Missile",
        "category": [
          "Weapons"
        ],
        "basePrice": 3000.0,
        "mass": 20.0,
        "durability": 2.0,
        "source": "condowner"
      },
      "DataBINOstranauts": {
        "friendly": "SPACE_PROTOTYPE.BIN",
        "source": "cooverlay"
      },
      "ItmChair01DmgLoose": {
        "friendly": "Spacer Stool (Damaged, Loose)",
        "short": "Stool",
        "category": [
          "Furniture"
        ],
        "basePrice": 5.4,
        "mass": 2.0,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmChair01Loose": {
        "friendly": "Spacer Stool (Loose)",
        "short": "Stool",
        "category": [
          "Furniture"
        ],
        "basePrice": 27.0,
        "mass": 2.0,
        "durability": 3.0,
        "source": "condowner"
      },
      "DataSNDMeat01": {
        "friendly": "SPACER_SHANTY.SND",
        "source": "cooverlay"
      },
      "ItmPartsScreen01": {
        "friendly": "Spare Screen",
        "short": "Screen",
        "category": [
          "Electronics"
        ],
        "basePrice": 245.0,
        "mass": 6.0,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmWeaponSpear01": {
        "friendly": "Spear",
        "category": [
          "Weapons"
        ],
        "basePrice": 62.0,
        "mass": 1.25,
        "durability": 7.0,
        "source": "condowner"
      },
      "ItmWeaponGoat01": {
        "friendly": "Spinal Scepter",
        "category": [
          "Weapons"
        ],
        "basePrice": 21362.0,
        "mass": 0.51,
        "durability": 15.0,
        "source": "condowner"
      },
      "ItmSplint01": {
        "friendly": "Splint",
        "category": [
          "Medical"
        ],
        "basePrice": 148.95,
        "mass": 1.11,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmBattery02LowPowerLoose": {
        "friendly": "Starter Battery (Loose)",
        "category": [
          "Electronics"
        ],
        "basePrice": 2623.0,
        "mass": 45.0,
        "durability": 10.0,
        "source": "cooverlay"
      },
      "ItmBattery02bLowPowerLoose": {
        "friendly": "Starter Battery (Loose)",
        "category": [
          "Electronics"
        ],
        "basePrice": 1575.0,
        "mass": 27.0,
        "durability": 6.0,
        "source": "cooverlay"
      },
      "ItmBattery02cLowPowerLoose": {
        "friendly": "Starter Battery (Loose)",
        "category": [
          "Electronics"
        ],
        "basePrice": 944.0,
        "mass": 16.2,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmFoodHot02": {
        "friendly": "Street Food: Algae Broth in a Bag with Alligator Pepper and Seared Tomatoes",
        "short": "Vendor Food",
        "category": [
          "Food"
        ],
        "basePrice": 125.0,
        "mass": 0.2,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmFoodHot06": {
        "friendly": "Street Food: Chili Vinegar Fish Balls",
        "short": "Vendor Food",
        "category": [
          "Food"
        ],
        "basePrice": 135.0,
        "mass": 0.2,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmFoodHot05": {
        "friendly": "Street Food: Entomoprotein Noodles with Nestégg Herb-and-Dairy Flakes",
        "short": "Vendor Food",
        "category": [
          "Food"
        ],
        "basePrice": 99.0,
        "mass": 0.2,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmFoodHot03": {
        "friendly": "Street Food: Kebab of Chicken in a Yaji Spice Rub",
        "short": "Vendor Food",
        "category": [
          "Food"
        ],
        "basePrice": 150.0,
        "mass": 0.2,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmFoodHot04": {
        "friendly": "Street Food: Spot Prawn Curry Stir Fry",
        "short": "Vendor Food",
        "category": [
          "Food"
        ],
        "basePrice": 185.0,
        "mass": 0.2,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmFoodHot01": {
        "friendly": "Street Food: Szechuan Beef with Pink Peppercorn",
        "short": "Vendor Food",
        "category": [
          "Food"
        ],
        "basePrice": 205.0,
        "mass": 0.2,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmFusionCorePump01Loose": {
        "friendly": "Sulaiman Fusion Core Pump (Loose)",
        "short": "Core Pump",
        "category": [
          "FusionParts"
        ],
        "basePrice": 5520.0,
        "mass": 28.0,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmFusionCorePump01DmgLoose": {
        "friendly": "Sulaiman Fusion Core Pump (Loose, Damaged)",
        "short": "Core Pump",
        "category": [
          "FusionParts"
        ],
        "basePrice": 1112.0,
        "mass": 28.0,
        "durability": 19.0,
        "source": "condowner"
      },
      "ItmFusionLaserArray01Loose": {
        "friendly": "Sulaiman Fusion Laser Array (Loose)",
        "short": "Laser Array",
        "category": [
          "FusionParts"
        ],
        "basePrice": 5520.0,
        "mass": 28.0,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmFusionLaserArray01DmgLoose": {
        "friendly": "Sulaiman Fusion Laser Array (Loose, Damaged)",
        "short": "Laser Array",
        "category": [
          "FusionParts"
        ],
        "basePrice": 1112.0,
        "mass": 28.0,
        "durability": 19.0,
        "source": "condowner"
      },
      "ItmFusionPelletFeeder01Loose": {
        "friendly": "Sulaiman Pellet Feeder Assembly (Loose)",
        "short": "Pellet Feeder",
        "category": [
          "FusionParts"
        ],
        "basePrice": 5520.0,
        "mass": 28.0,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmFusionPelletFeeder01DmgLoose": {
        "friendly": "Sulaiman Pellet Feeder Assembly (Loose, Damaged)",
        "short": "Pellet Feeder",
        "category": [
          "FusionParts"
        ],
        "basePrice": 1112.0,
        "mass": 28.0,
        "durability": 19.0,
        "source": "condowner"
      },
      "ItmShirtHoodie01": {
        "friendly": "Sweatshirt: Ayotimiwa",
        "short": "Hoodie",
        "category": [
          "Textiles"
        ],
        "basePrice": 63.0,
        "mass": 0.25,
        "durability": 3.0,
        "source": "condowner"
      },
      "SysExplosionFusion": {
        "friendly": "SysExplosionFusion",
        "short": "Explosion",
        "source": "condowner"
      },
      "SysExplosionMining": {
        "friendly": "SysExplosionMining",
        "short": "Mining Charge Explosion",
        "source": "condowner"
      },
      "SysLootSpawner": {
        "friendly": "SysLootSpawner",
        "short": "Spawner",
        "source": "condowner"
      },
      "SysLootSpawnerLot": {
        "friendly": "SysLootSpawnerLot",
        "short": "Lot Spawner",
        "source": "condowner"
      },
      "SysORG": {
        "friendly": "SysORG",
        "short": "Organization",
        "source": "condowner"
      },
      "OutfitTShirt04": {
        "friendly": "T-shirt: ASCII Skull",
        "category": [
          "Textiles"
        ],
        "basePrice": 30.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitTShirtBrand18": {
        "friendly": "T-shirt: Atlantis",
        "category": [
          "Textiles"
        ],
        "basePrice": 30.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitTShirtBrand18c": {
        "friendly": "T-shirt: Atlantis Blue",
        "category": [
          "Textiles"
        ],
        "basePrice": 30.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitTShirtBrand18b": {
        "friendly": "T-shirt: Atlantis Deep",
        "category": [
          "Textiles"
        ],
        "basePrice": 30.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitTShirt05": {
        "friendly": "T-shirt: Ayotimiwa",
        "category": [
          "Textiles"
        ],
        "basePrice": 30.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitTShirtBrand08": {
        "friendly": "T-shirt: Bismertnaya",
        "category": [
          "Textiles"
        ],
        "basePrice": 30.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitTShirtBrand08b": {
        "friendly": "T-shirt: Bismertnaya Immortal",
        "category": [
          "Textiles"
        ],
        "basePrice": 30.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitTShirtBrand06": {
        "friendly": "T-shirt: Black Bull Kape",
        "category": [
          "Textiles"
        ],
        "basePrice": 30.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitTShirtBrand01": {
        "friendly": "T-shirt: Cloud Racer",
        "category": [
          "Textiles"
        ],
        "basePrice": 30.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitTShirtBrand09": {
        "friendly": "T-shirt: DND Cola",
        "category": [
          "Textiles"
        ],
        "basePrice": 30.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitTShirtBrand09b": {
        "friendly": "T-shirt: DND Cola Shatter",
        "category": [
          "Textiles"
        ],
        "basePrice": 30.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitTShirtBrand09c": {
        "friendly": "T-shirt: DND Cola Skull",
        "category": [
          "Textiles"
        ],
        "basePrice": 30.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitTShirt03": {
        "friendly": "T-shirt: Europa",
        "category": [
          "Textiles"
        ],
        "basePrice": 30.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitTShirtBrand01b": {
        "friendly": "T-shirt: Formula Venus",
        "category": [
          "Textiles"
        ],
        "basePrice": 30.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitTShirtBrand05": {
        "friendly": "T-shirt: Halvorson",
        "category": [
          "Textiles"
        ],
        "basePrice": 30.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitTShirtBrand05c": {
        "friendly": "T-shirt: Halvorson",
        "category": [
          "Textiles"
        ],
        "basePrice": 30.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitTShirtBrand05d": {
        "friendly": "T-shirt: Halvorson Blue",
        "category": [
          "Textiles"
        ],
        "basePrice": 30.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitTShirtBrand05b": {
        "friendly": "T-shirt: Halvorson Red",
        "category": [
          "Textiles"
        ],
        "basePrice": 30.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitTShirtBrand15": {
        "friendly": "T-shirt: Hangzhou",
        "category": [
          "Textiles"
        ],
        "basePrice": 30.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitTShirtBrand15c": {
        "friendly": "T-shirt: Hangzhou",
        "category": [
          "Textiles"
        ],
        "basePrice": 30.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitTShirtBrand15f": {
        "friendly": "T-shirt: Hangzhou Legacy",
        "category": [
          "Textiles"
        ],
        "basePrice": 30.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitTShirtBrand15e": {
        "friendly": "T-shirt: Hangzhou Scroll",
        "category": [
          "Textiles"
        ],
        "basePrice": 30.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitTShirtBrand15d": {
        "friendly": "T-shirt: Hangzhou Star",
        "category": [
          "Textiles"
        ],
        "basePrice": 30.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitTShirtBrand15b": {
        "friendly": "T-shirt: Hangzhou Wheel",
        "category": [
          "Textiles"
        ],
        "basePrice": 30.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitTShirtBrand07": {
        "friendly": "T-shirt: Label 99",
        "category": [
          "Textiles"
        ],
        "basePrice": 30.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitTShirtBrand07b": {
        "friendly": "T-shirt: Label 99 Gold",
        "category": [
          "Textiles"
        ],
        "basePrice": 30.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitTShirtBrand13": {
        "friendly": "T-shirt: Mariner",
        "category": [
          "Textiles"
        ],
        "basePrice": 30.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitTShirtBrand11": {
        "friendly": "T-shirt: Mescaform",
        "category": [
          "Textiles"
        ],
        "basePrice": 30.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitTShirtBrand16": {
        "friendly": "T-shirt: Newcal",
        "category": [
          "Textiles"
        ],
        "basePrice": 30.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitTShirtBrand16b": {
        "friendly": "T-shirt: Newcal Black",
        "category": [
          "Textiles"
        ],
        "basePrice": 30.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitTShirtBrand16c": {
        "friendly": "T-shirt: Newcal Seafoam",
        "category": [
          "Textiles"
        ],
        "basePrice": 30.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitTShirt02": {
        "friendly": "T-shirt: Orange",
        "category": [
          "Textiles"
        ],
        "basePrice": 30.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitTShirtBrand04": {
        "friendly": "T-shirt: Polaris",
        "category": [
          "Textiles"
        ],
        "basePrice": 30.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitTShirtBrand04c": {
        "friendly": "T-shirt: Polaris \"North\"",
        "category": [
          "Textiles"
        ],
        "basePrice": 30.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitTShirtBrand04b": {
        "friendly": "T-shirt: Polaris \"Rose\"",
        "category": [
          "Textiles"
        ],
        "basePrice": 30.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitTShirtBrand17b": {
        "friendly": "T-shirt: Tasijin",
        "category": [
          "Textiles"
        ],
        "basePrice": 30.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitTShirtBrand03b": {
        "friendly": "T-shirt: Testudo \"T\"",
        "category": [
          "Textiles"
        ],
        "basePrice": 30.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitTShirtBrand03": {
        "friendly": "T-shirt: Testudo Black",
        "category": [
          "Textiles"
        ],
        "basePrice": 30.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitTShirtBrand03c": {
        "friendly": "T-shirt: Testudo Yellow",
        "category": [
          "Textiles"
        ],
        "basePrice": 30.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitTShirtBrand17": {
        "friendly": "T-shirt: Tharsis Landing",
        "category": [
          "Textiles"
        ],
        "basePrice": 30.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitTShirtBrand12": {
        "friendly": "T-shirt: Ubiq",
        "category": [
          "Textiles"
        ],
        "basePrice": 30.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitTShirtBrand12b": {
        "friendly": "T-shirt: Ubiq Blue",
        "category": [
          "Textiles"
        ],
        "basePrice": 30.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitTShirtBrand14": {
        "friendly": "T-shirt: Ultramutant",
        "category": [
          "Textiles"
        ],
        "basePrice": 30.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitTShirtBrand10": {
        "friendly": "T-shirt: Viceroy's",
        "category": [
          "Textiles"
        ],
        "basePrice": 30.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitTShirtBrand02c": {
        "friendly": "T-shirt: Weber Cyan",
        "category": [
          "Textiles"
        ],
        "basePrice": 30.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitTShirtBrand02d": {
        "friendly": "T-shirt: Weber Teal",
        "category": [
          "Textiles"
        ],
        "basePrice": 30.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitTShirtBrand02b": {
        "friendly": "T-shirt: Weber White",
        "category": [
          "Textiles"
        ],
        "basePrice": 30.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitTShirtBrand02": {
        "friendly": "T-shirt: Weber Yellow",
        "category": [
          "Textiles"
        ],
        "basePrice": 30.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "OutfitTShirt01": {
        "friendly": "T-shirt: White",
        "category": [
          "Textiles"
        ],
        "basePrice": 30.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "ItmTShirt01": {
        "friendly": "T-shirt: White",
        "short": "T-Shirt",
        "category": [
          "Textiles"
        ],
        "basePrice": 30.0,
        "mass": 0.125,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmTablet01": {
        "friendly": "Tablet",
        "category": [
          "Media"
        ],
        "basePrice": 230.0,
        "mass": 0.5,
        "durability": 7.0,
        "source": "condowner"
      },
      "ItmWeaponKnife01": {
        "friendly": "Tactical Knife",
        "short": "Tac Knife",
        "category": [
          "Weapons"
        ],
        "basePrice": 227.0,
        "mass": 0.305,
        "durability": 12.0,
        "source": "condowner"
      },
      "OutfitSuit05": {
        "friendly": "Tan Coveralls: Atlantis",
        "short": "Coveralls",
        "category": [
          "Textiles"
        ],
        "basePrice": 437.0,
        "mass": 1.0,
        "durability": 5.5,
        "source": "condowner"
      },
      "DataTXTFanfic03": {
        "friendly": "TAXINFO.TXT",
        "source": "cooverlay"
      },
      "DataSNDAudioWill": {
        "friendly": "TESTAMENT.SND",
        "source": "cooverlay"
      },
      "ItmToothbrush05": {
        "friendly": "Testudo \"AstroBristle Active\"",
        "category": [
          "ConsumerGoods"
        ],
        "basePrice": 10.0,
        "mass": 0.01,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "ItmToothbrush01": {
        "friendly": "Testudo \"AstroBristle Classic\"",
        "short": "Toothbrush",
        "category": [
          "ConsumerGoods"
        ],
        "basePrice": 10.0,
        "mass": 0.01,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmToothbrush06": {
        "friendly": "Testudo \"AstroBristle Kids\"",
        "category": [
          "ConsumerGoods"
        ],
        "basePrice": 10.0,
        "mass": 0.01,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "ItmToothbrush03": {
        "friendly": "Testudo \"AstroBristle MaxClean\"",
        "category": [
          "ConsumerGoods"
        ],
        "basePrice": 10.0,
        "mass": 0.01,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "ItmToothbrush04": {
        "friendly": "Testudo \"AstroBristle Photon\"",
        "category": [
          "ConsumerGoods"
        ],
        "basePrice": 10.0,
        "mass": 0.01,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "ItmToothbrush02": {
        "friendly": "Testudo \"AstroBristle UltraSoft\"",
        "category": [
          "ConsumerGoods"
        ],
        "basePrice": 10.0,
        "mass": 0.01,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "ItmBookStudyAdmin01": {
        "friendly": "Textbook: Business Administration",
        "short": "Admin Textbook",
        "category": [
          "Media"
        ],
        "basePrice": 580.0,
        "mass": 3.0,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "ItmBookStudyEngCivil01": {
        "friendly": "Textbook: Civil Engineering",
        "short": "Civil Eng. Textbook",
        "category": [
          "Media"
        ],
        "basePrice": 580.0,
        "mass": 3.0,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "ItmBookStudyEngCombat01": {
        "friendly": "Textbook: Combat Engineering",
        "short": "Combat Eng. Textbook",
        "category": [
          "Media"
        ],
        "basePrice": 580.0,
        "mass": 3.0,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "ItmBookStudyEngConstruction01": {
        "friendly": "Textbook: Construction Engineering",
        "short": "Construction Textbook",
        "category": [
          "Media"
        ],
        "basePrice": 580.0,
        "mass": 3.0,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "ItmBookStudyEngElectronic01": {
        "friendly": "Textbook: Electrical Engineering",
        "short": "Elec. Eng. Textbook",
        "category": [
          "Media"
        ],
        "basePrice": 580.0,
        "mass": 3.0,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmBookStudyEngExcavation01": {
        "friendly": "Textbook: Excavation",
        "short": "Excavation Textbook",
        "category": [
          "Media"
        ],
        "basePrice": 580.0,
        "mass": 3.0,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "ItmBookStudyHacking01": {
        "friendly": "Textbook: Hacking",
        "short": "Hacking Textbook",
        "category": [
          "Media"
        ],
        "basePrice": 580.0,
        "mass": 3.0,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "ItmBookStudyEngMechanical01": {
        "friendly": "Textbook: Mechanical Engineering",
        "short": "Mech. Eng. Textbook",
        "category": [
          "Media"
        ],
        "basePrice": 580.0,
        "mass": 3.0,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "ItmBookStudyEngRobotics01": {
        "friendly": "Textbook: Robotics Engineering",
        "short": "Robotics Eng. Textbook",
        "category": [
          "Media"
        ],
        "basePrice": 580.0,
        "mass": 3.0,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "ItmBookStudyEngSoftware01": {
        "friendly": "Textbook: Software Engineering",
        "short": "Software Eng. Textbook",
        "category": [
          "Media"
        ],
        "basePrice": 580.0,
        "mass": 3.0,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "ItmBookStudyEngSpaceship01": {
        "friendly": "Textbook: Spaceship Engineering",
        "short": "Spaceship Eng. Textbook",
        "category": [
          "Media"
        ],
        "basePrice": 580.0,
        "mass": 3.0,
        "durability": 3.0,
        "source": "cooverlay"
      },
      "ItmHullPatch01": {
        "friendly": "The Holden Patch",
        "short": "Hull Patch",
        "category": [
          "Tools"
        ],
        "basePrice": 15.0,
        "mass": 1.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "DataSNDPoetry": {
        "friendly": "THE_BARD.SND",
        "source": "cooverlay"
      },
      "DataVIDFilm02": {
        "friendly": "THE_DISCONNECT(CLEAN).VID",
        "source": "cooverlay"
      },
      "DataVIDMundane05": {
        "friendly": "THE_ZERO-G_GOURMAND.VID",
        "source": "cooverlay"
      },
      "DataSNDBarbershop": {
        "friendly": "THEGANGALLTOGETHER.SND",
        "source": "cooverlay"
      },
      "ItmAlarmTempDmgLoose": {
        "friendly": "Thermostat (Damaged, Loose)",
        "short": "Thermostat",
        "category": [
          "Sensors"
        ],
        "basePrice": 23.0,
        "mass": 0.5,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmAlarmTempOffLoose": {
        "friendly": "Thermostat (Loose)",
        "short": "Thermostat",
        "category": [
          "Sensors"
        ],
        "basePrice": 116.0,
        "mass": 0.5,
        "durability": 1.0,
        "source": "condowner"
      },
      "DataVIDFilm01": {
        "friendly": "THOSE_WITH_LOADED_GUNS.VID",
        "source": "cooverlay"
      },
      "SOCThrowPass": {
        "friendly": "Throw a Pass",
        "source": "condowner"
      },
      "TIL": {
        "friendly": "TIL",
        "short": "Tile",
        "source": "condowner"
      },
      "DataVIDFilm03": {
        "friendly": "TIMELOCK1798_71215.VID",
        "source": "cooverlay"
      },
      "ItmToyDinosaur01": {
        "friendly": "Toy: Parasaurolofillion",
        "short": "Toy",
        "category": [
          "Media"
        ],
        "basePrice": 65.0,
        "mass": 0.2,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmToyDinosaur02": {
        "friendly": "Toy: Tudykosaurus Rex",
        "short": "Toy",
        "category": [
          "Media"
        ],
        "basePrice": 65.0,
        "mass": 0.2,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmTransponder01DmgLoose": {
        "friendly": "Transponder/IFF (Damaged, Loose): Polaris \"VDX-01\"",
        "short": "Transponder",
        "category": [
          "Sensors"
        ],
        "basePrice": 290.0,
        "mass": 1.35,
        "durability": 13.0,
        "source": "condowner"
      },
      "ItmTransponder01Loose": {
        "friendly": "Transponder/IFF (Loose): Polaris \"VDX-01\"",
        "short": "Transponder",
        "category": [
          "Sensors"
        ],
        "basePrice": 29000.0,
        "mass": 1.35,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmScrapTrash": {
        "friendly": "Trash",
        "category": [
          "Trash"
        ],
        "basePrice": 0.05,
        "mass": 1.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmTreadmill01DmgLoose": {
        "friendly": "Treadmill: Halvorson \"Ibn Battuta\" (Damaged, Loose)",
        "short": "Treadmill",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 2000.0,
        "mass": 310.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmTreadmill01Loose": {
        "friendly": "Treadmill: Halvorson \"Ibn Battuta\" (Loose)",
        "short": "Treadmill",
        "category": [
          "IndustrialProducts"
        ],
        "basePrice": 10850.0,
        "mass": 310.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmFloorGrate4x401Loose": {
        "friendly": "Turbine Lifter (Loose)",
        "short": "Turbine",
        "category": [
          "Hull"
        ],
        "basePrice": 3100.0,
        "mass": 65.0,
        "durability": 30.0,
        "source": "condowner"
      },
      "ItmAirPump01DmgLoose": {
        "friendly": "Turbo Air Pump (Damaged, Loose)",
        "category": [
          "HVAC"
        ],
        "basePrice": 510.0,
        "mass": 11.0,
        "durability": 11.0,
        "source": "cooverlay"
      },
      "ItmAirPump01OffLoose": {
        "friendly": "Turbo Air Pump (Loose)",
        "category": [
          "HVAC"
        ],
        "basePrice": 2050.0,
        "mass": 11.0,
        "durability": 4.0,
        "source": "cooverlay"
      },
      "ItmUbiqWISPNode01": {
        "friendly": "Ubiq WISP Node",
        "short": "WISP Node",
        "category": [
          "Electronics"
        ],
        "basePrice": 4999.0,
        "mass": 42.0,
        "durability": 12.0,
        "source": "condowner"
      },
      "ItmUbiqWISPNode01Hacked": {
        "friendly": "Ubiq WISP Node (Hacked)",
        "short": "WISP Node",
        "category": [
          "Electronics"
        ],
        "basePrice": 19999.0,
        "mass": 42.0,
        "durability": 12.0,
        "source": "condowner"
      },
      "DataIMGCryptid01": {
        "friendly": "UFO_SIGHTING?!.IMG",
        "source": "cooverlay"
      },
      "DataSNDNigerianFolkLore": {
        "friendly": "UNCLE.SND",
        "source": "cooverlay"
      },
      "ItmCigUnicornDream01": {
        "friendly": "Unicorn Dream Cigarette",
        "short": "Cigarette",
        "category": [
          "Intoxicants"
        ],
        "basePrice": 15.0,
        "mass": 0.005,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmCigUnicornDream01Lit": {
        "friendly": "Unicorn Dream Cigarette (Lit)",
        "short": "Cigarette",
        "category": [
          "Trash"
        ],
        "basePrice": 0.0,
        "mass": 0.001,
        "durability": 1.0,
        "source": "condowner"
      },
      "WoundAbdomenUpper": {
        "friendly": "Upper Abdomen",
        "source": "condowner"
      },
      "WoundChestUpper": {
        "friendly": "Upper Chest",
        "source": "condowner"
      },
      "BodyarmUpperLA": {
        "friendly": "Upper Left Arm",
        "short": "Upper L Arm",
        "mass": 1.841,
        "source": "condowner"
      },
      "WoundArmUpperL": {
        "friendly": "Upper Left Arm",
        "source": "condowner"
      },
      "BodylegUpperLA": {
        "friendly": "Upper Left Leg",
        "short": "Upper L Leg",
        "mass": 10.129,
        "source": "condowner"
      },
      "WoundLegUpperL": {
        "friendly": "Upper Left Leg",
        "source": "condowner"
      },
      "BodyarmUpperRA": {
        "friendly": "Upper Right Arm",
        "short": "Upper R Arm",
        "mass": 1.841,
        "source": "condowner"
      },
      "WoundArmUpperR": {
        "friendly": "Upper Right Arm",
        "source": "condowner"
      },
      "BodylegUpperRA": {
        "friendly": "Upper Right Leg",
        "short": "Upper R Leg",
        "mass": 10.129,
        "source": "condowner"
      },
      "WoundLegUpperR": {
        "friendly": "Upper Right Leg",
        "source": "condowner"
      },
      "ItmBedMedical01Loose": {
        "friendly": "Van Buren \"Infirmaway\" Medical Bed  (Loose)",
        "short": "Med Bed",
        "category": [
          "Medical"
        ],
        "basePrice": 18570.0,
        "mass": 88.0,
        "durability": 8.0,
        "source": "condowner"
      },
      "ItmBedMedical01DmgLoose": {
        "friendly": "Van Buren \"Infirmaway\" Medical Bed (Damaged, Loose)",
        "short": "Med Bed",
        "category": [
          "Medical"
        ],
        "basePrice": 2400.0,
        "mass": 88.0,
        "durability": 23.0,
        "source": "condowner"
      },
      "SOCVenusStory": {
        "friendly": "Venus Story",
        "source": "condowner"
      },
      "ItmCigViceroy01": {
        "friendly": "Viceroy Cigarette",
        "short": "Cigarette",
        "category": [
          "Intoxicants"
        ],
        "basePrice": 5.0,
        "mass": 0.005,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmCigViceroy01Lit": {
        "friendly": "Viceroy Cigarette (Lit)",
        "short": "Cigarette",
        "category": [
          "Trash"
        ],
        "basePrice": 0.0,
        "mass": 0.001,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmCigViceroy02": {
        "friendly": "Viceroy Menthol Cigarette",
        "short": "Cigarette",
        "category": [
          "Intoxicants"
        ],
        "basePrice": 7.0,
        "mass": 0.005,
        "durability": 1.0,
        "source": "condowner"
      },
      "ItmCigViceroy02Lit": {
        "friendly": "Viceroy Menthol Cigarette (Lit)",
        "short": "Cigarette",
        "category": [
          "Trash"
        ],
        "basePrice": 0.0,
        "mass": 0.001,
        "durability": 1.0,
        "source": "condowner"
      },
      "DataVIDVlog04": {
        "friendly": "VIDEOLOG.VID",
        "source": "cooverlay"
      },
      "Videotape": {
        "friendly": "Videotape",
        "mass": 0.198,
        "source": "condowner"
      },
      "DataVIDMundane02": {
        "friendly": "VISIT_TITAN.VID",
        "source": "cooverlay"
      },
      "DataVIDVlog03": {
        "friendly": "VLOG!.VID",
        "source": "cooverlay"
      },
      "DataVIDVlog01": {
        "friendly": "VLOG.VID",
        "source": "cooverlay"
      },
      "DataVIDVlog02": {
        "friendly": "VLOG.VID",
        "source": "cooverlay"
      },
      "DataVIDVlog05": {
        "friendly": "VLOG.VID",
        "source": "cooverlay"
      },
      "DataVIDVlog06": {
        "friendly": "VLOG.VID",
        "source": "cooverlay"
      },
      "DataVIDVlog07": {
        "friendly": "VLOG.VID",
        "source": "cooverlay"
      },
      "DataVIDVlog08": {
        "friendly": "VLOG.VID",
        "source": "cooverlay"
      },
      "DataVIDVlog09": {
        "friendly": "VLOG.VID",
        "source": "cooverlay"
      },
      "DataVIDVlog10": {
        "friendly": "VLOGYRINTH.VID",
        "source": "cooverlay"
      },
      "ItmCargoVolatiles01": {
        "friendly": "Volatiles Canister",
        "short": "Volatiles Cargo",
        "category": [
          "Volatiles"
        ],
        "basePrice": 1000.0,
        "mass": 8.0,
        "durability": 6.0,
        "source": "condowner"
      },
      "SOCWarriorsSuck": {
        "friendly": "Warriors Suck",
        "source": "condowner"
      },
      "LiquidWater": {
        "friendly": "Water",
        "category": [
          "Water"
        ],
        "basePrice": 150.0,
        "mass": 0.25,
        "source": "condowner"
      },
      "ItmIce01": {
        "friendly": "Water Ice",
        "short": "Ice",
        "basePrice": 1200.0,
        "mass": 24.7,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmExplosiveCharge01Armed": {
        "friendly": "Weber 'Core' Explosive (Armed)",
        "short": "Explosive (Armed)",
        "basePrice": 350.0,
        "mass": 8.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmExplosiveCharge01": {
        "friendly": "Weber 'Core' Explosive (Deactivated)",
        "short": "Explosive",
        "category": [
          "Tools"
        ],
        "basePrice": 350.0,
        "mass": 8.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmToolLaserTorch01": {
        "friendly": "Weber 'Lance' Laser Torch",
        "short": "Laser Torch",
        "category": [
          "Tools"
        ],
        "basePrice": 7650.0,
        "mass": 15.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmToolLaserTorch01Dmg": {
        "friendly": "Weber 'Lance' Laser Torch (Damaged)",
        "short": "Laser Torch",
        "category": [
          "Tools"
        ],
        "basePrice": 1250.0,
        "mass": 15.0,
        "durability": 15.0,
        "source": "condowner"
      },
      "ItmToolCrowbar01": {
        "friendly": "Weber 'Prize' Crowbar",
        "short": "Crowbar",
        "category": [
          "Tools"
        ],
        "basePrice": 20.0,
        "mass": 2.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "ItmExplosiveCharge02": {
        "friendly": "Weber 'Sap' Breaching Charge",
        "short": "Sap Explosive",
        "category": [
          "Tools"
        ],
        "basePrice": 60.0,
        "mass": 2.0,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmExplosiveCharge02Armed": {
        "friendly": "Weber 'Sap' Breaching Charge (Armed)",
        "short": "Explosive (Armed)",
        "basePrice": 60.0,
        "mass": 2.0,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmSensorLidar01Loose": {
        "friendly": "Weber Sensor: LiDAR (Loose)",
        "short": "LiDAR",
        "category": [
          "Sensors"
        ],
        "basePrice": 23000.0,
        "mass": 30.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmSensorLidar01DmgLoose": {
        "friendly": "Weber Sensor: LiDAR (Loose, Damaged)",
        "short": "LiDAR",
        "category": [
          "Sensors"
        ],
        "basePrice": 4600.0,
        "mass": 30.0,
        "durability": 7.0,
        "source": "condowner"
      },
      "DataSNDRoar": {
        "friendly": "WHAT_IS_THIS.SND",
        "source": "cooverlay"
      },
      "DataSNDGhostStory03": {
        "friendly": "WHY_DOESNT_IT_ROT?.SND",
        "source": "cooverlay"
      },
      "ItmAntenna01DmgLoose": {
        "friendly": "XPDR Antenna (Damaged, Loose)",
        "short": "Antenna",
        "category": [
          "Sensors"
        ],
        "basePrice": 600.0,
        "mass": 2.0,
        "durability": 8.0,
        "source": "condowner"
      },
      "ItmAntenna01Loose": {
        "friendly": "XPDR Antenna (Loose)",
        "short": "Antenna",
        "category": [
          "Sensors"
        ],
        "basePrice": 3000.0,
        "mass": 3.0,
        "durability": 4.0,
        "source": "condowner"
      },
      "ItmAntenna02DmgLoose": {
        "friendly": "XPDR Antenna: Hardened (Damaged, Loose)",
        "short": "Antenna",
        "category": [
          "Sensors"
        ],
        "basePrice": 1804.0,
        "mass": 10.0,
        "durability": 18.0,
        "source": "condowner"
      },
      "ItmAntenna02Loose": {
        "friendly": "XPDR Antenna: Hardened (Loose)",
        "short": "Antenna",
        "category": [
          "Sensors"
        ],
        "basePrice": 9020.0,
        "mass": 12.0,
        "durability": 10.0,
        "source": "condowner"
      },
      "OutfitSuit02": {
        "friendly": "Yellow Coveralls: Ayotimiwa",
        "short": "Coveralls",
        "category": [
          "Textiles"
        ],
        "basePrice": 93.0,
        "mass": 1.0,
        "durability": 6.0,
        "source": "condowner"
      },
      "ItmSensorEM02Loose": {
        "friendly": "Zhuangzi Sensor: EM (Loose)",
        "short": "EM Sensor",
        "category": [
          "Sensors"
        ],
        "basePrice": 6400.0,
        "mass": 3.0,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmSensorEM02DmgLoose": {
        "friendly": "Zhuangzi Sensor: EM (Loose, Damaged)",
        "short": "EM Sensor",
        "category": [
          "Sensors"
        ],
        "basePrice": 1280.0,
        "mass": 3.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmSensorIR02Loose": {
        "friendly": "Zhuangzi Sensor: IR (Loose)",
        "short": "IR Sensor",
        "category": [
          "Sensors"
        ],
        "basePrice": 12000.0,
        "mass": 5.0,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmSensorIR02DmgLoose": {
        "friendly": "Zhuangzi Sensor: IR (Loose, Damaged)",
        "short": "IR Sensor",
        "category": [
          "Sensors"
        ],
        "basePrice": 2400.0,
        "mass": 5.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmSensorLidar02Loose": {
        "friendly": "Zhuangzi Sensor: LiDAR (Loose)",
        "short": "LiDAR",
        "category": [
          "Sensors"
        ],
        "basePrice": 29000.0,
        "mass": 21.0,
        "durability": 3.0,
        "source": "condowner"
      },
      "ItmSensorLidar02DmgLoose": {
        "friendly": "Zhuangzi Sensor: LiDAR (Loose, Damaged)",
        "short": "LiDAR",
        "category": [
          "Sensors"
        ],
        "basePrice": 5800.0,
        "mass": 21.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmSensorRadar02Loose": {
        "friendly": "Zhuangzi Sensor: Radar (Loose)",
        "short": "Radar",
        "category": [
          "Sensors"
        ],
        "basePrice": 42000.0,
        "mass": 130.0,
        "durability": 5.0,
        "source": "condowner"
      },
      "ItmSensorRadar02DmgLoose": {
        "friendly": "Zhuangzi Sensor: Radar (Loose, Damaged)",
        "short": "Radar",
        "category": [
          "Sensors"
        ],
        "basePrice": 8400.0,
        "mass": 90.0,
        "durability": 8.0,
        "source": "condowner"
      },
      "DataIMGXinhua02": {
        "friendly": "来得好!不然离开通过气闸!.IMG",
        "source": "cooverlay"
      },
      "DataIMGXinhua": {
        "friendly": "黄金周.IMG",
        "source": "cooverlay"
      }
    }
  }
};
