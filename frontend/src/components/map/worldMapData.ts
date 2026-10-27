/**
 * MineTrace Political World Map GeoData
 * Equirectangular WGS84 Projection (1000 x 500 Viewport)
 */

export interface ContinentShape {
  id: string;
  name: string;
  path: string;
}

export interface CountryJurisdiction {
  code: string;
  name: string;
  specialty: string;
  role: string;
  flag: string;
  labelX: number;
  labelY: number;
  path: string;
}

export const CONTINENTS: ContinentShape[] = [
  {
    "id": "CONT_NA",
    "name": "North America",
    "path": "M 33.3,50.0 L 144.4,52.8 L 238.9,83.3 L 272.2,97.2 L 322.2,88.9 L 352.8,119.4 L 322.2,127.8 L 305.6,133.3 L 291.7,152.8 L 277.8,172.2 L 276.4,180.6 L 263.9,169.4 L 236.1,168.1 L 230.6,177.8 L 233.3,194.4 L 241.7,205.6 L 252.8,211.1 L 284.7,226.4 L 269.4,226.4 L 227.8,205.6 L 205.6,186.1 L 175.0,161.1 L 158.3,144.4 L 152.8,113.9 L 133.3,97.2 L 97.2,83.3 L 33.3,69.4 L 33.3,50.0 Z"
  },
  {
    "id": "CONT_GREENLAND",
    "name": "Greenland",
    "path": "M 402.8,19.4 L 450.0,25.0 L 444.4,38.9 L 438.9,55.6 L 391.7,69.4 L 377.8,83.3 L 355.6,69.4 L 344.4,50.0 L 311.1,33.3 L 333.3,22.2 L 402.8,19.4 Z"
  },
  {
    "id": "CONT_SA",
    "name": "South America",
    "path": "M 300.0,216.7 L 327.8,220.8 L 355.6,233.3 L 361.1,251.4 L 402.8,263.9 L 397.2,283.3 L 383.3,313.9 L 358.3,338.9 L 341.7,355.6 L 319.4,377.8 L 316.7,402.8 L 297.2,400.0 L 291.7,372.2 L 300.0,341.7 L 302.8,300.0 L 275.0,263.9 L 280.6,244.4 L 284.7,226.4 L 300.0,216.7 Z"
  },
  {
    "id": "CONT_EU",
    "name": "Europe",
    "path": "M 577.8,52.8 L 622.2,61.1 L 638.9,83.3 L 588.9,105.6 L 583.3,122.2 L 577.8,133.3 L 561.1,147.2 L 541.7,150.0 L 486.1,150.0 L 475.0,130.6 L 487.5,116.7 L 525.0,100.0 L 516.7,88.9 L 533.3,72.2 L 577.8,52.8 Z"
  },
  {
    "id": "CONT_UK",
    "name": "British Isles",
    "path": "M 486.1,87.5 L 494.4,94.4 L 504.2,106.9 L 486.1,111.1 L 484.7,105.6 L 483.3,97.2 L 486.1,87.5 Z"
  },
  {
    "id": "CONT_AFRICA",
    "name": "Africa",
    "path": "M 486.1,150.0 L 527.8,147.2 L 569.4,161.1 L 590.3,162.5 L 594.4,175.0 L 602.8,188.9 L 622.2,216.7 L 641.7,218.1 L 627.8,244.4 L 608.3,263.9 L 611.1,294.4 L 591.7,325.0 L 555.6,345.8 L 547.2,338.9 L 533.3,300.0 L 533.3,263.9 L 525.0,238.9 L 505.6,236.1 L 488.9,236.1 L 469.4,233.3 L 458.3,219.4 L 452.8,208.3 L 452.8,191.7 L 466.7,172.2 L 486.1,150.0 Z"
  },
  {
    "id": "CONT_ASIA",
    "name": "Eurasia / Asia",
    "path": "M 805.6,38.9 L 994.4,55.6 L 972.2,72.2 L 950.0,83.3 L 894.4,100.0 L 863.9,130.6 L 833.3,144.4 L 838.9,163.9 L 816.7,188.9 L 802.8,216.7 L 788.9,247.2 L 772.2,227.8 L 747.2,191.7 L 713.9,227.8 L 691.7,188.9 L 658.3,180.6 L 647.2,208.3 L 622.2,215.3 L 597.2,175.0 L 600.0,150.0 L 580.6,136.1 L 588.9,122.2 L 638.9,111.1 L 666.7,97.2 L 708.3,83.3 L 722.2,47.2 L 805.6,38.9 Z"
  },
  {
    "id": "CONT_AUSTRALIA",
    "name": "Australia",
    "path": "M 895.8,280.6 L 904.2,294.4 L 925.0,318.1 L 923.6,338.9 L 916.7,354.2 L 906.9,358.3 L 888.9,354.2 L 877.8,347.2 L 866.7,338.9 L 841.7,344.4 L 826.4,347.2 L 820.8,338.9 L 816.7,311.1 L 830.6,304.2 L 843.1,294.4 L 852.8,288.9 L 877.8,283.3 L 887.5,297.2 L 895.8,280.6 Z"
  }
];

export const SOVEREIGN_JURISDICTIONS: CountryJurisdiction[] = [
  {
    "code": "CHL",
    "name": "Chile",
    "specialty": "Atacama Lithium Brine & Copper Concentrates (#1 Global Reserves)",
    "labelX": 308,
    "labelY": 320,
    "flag": "\ud83c\udde8\ud83c\uddf1",
    "role": "CRITICAL EXPORTER",
    "path": "M 306.9,298.6 L 304.7,300.8 L 304.4,315.3 L 301.7,333.3 L 297.2,351.4 L 294.4,366.7 L 290.3,377.8 L 291.7,394.4 L 313.9,402.8 L 309.7,395.8 L 300.0,377.8 L 302.8,355.6 L 305.6,338.9 L 309.7,322.2 L 312.5,311.1 L 306.9,298.6 Z"
  },
  {
    "code": "ARG",
    "name": "Argentina",
    "specialty": "Jujuy / Salta Lithium Brines (Lithium Triangle)",
    "labelX": 325,
    "labelY": 370,
    "flag": "\ud83c\udde6\ud83c\uddf7",
    "role": "CRITICAL EXPORTER",
    "path": "M 312.5,311.1 L 322.2,311.1 L 326.4,312.5 L 338.9,322.2 L 337.5,326.4 L 343.1,330.6 L 338.9,344.4 L 340.3,355.6 L 325.0,363.9 L 318.1,377.8 L 308.3,390.3 L 315.3,402.8 L 309.7,395.8 L 300.0,377.8 L 302.8,355.6 L 305.6,338.9 L 309.7,322.2 L 312.5,311.1 Z"
  },
  {
    "code": "BRA",
    "name": "Brazil",
    "specialty": "Minas Gerais Niobium, Rare Earths & Battery Graphite",
    "labelX": 360,
    "labelY": 290,
    "flag": "\ud83c\udde7\ud83c\uddf7",
    "role": "PRODUCER / REFINER",
    "path": "M 333.3,236.1 L 356.9,238.9 L 361.1,251.4 L 377.8,256.9 L 401.4,263.9 L 400.0,277.8 L 390.3,300.0 L 383.3,313.9 L 365.3,320.8 L 361.1,333.3 L 351.4,343.1 L 340.3,333.3 L 350.0,322.2 L 348.6,316.7 L 338.9,302.8 L 338.9,294.4 L 319.4,277.8 L 297.2,270.8 L 305.6,261.1 L 313.9,245.8 L 333.3,240.3 L 333.3,236.1 Z"
  },
  {
    "code": "COD",
    "name": "DR Congo",
    "specialty": "Katanga Copperbelt Cobalt (#1 Global Supply >70%)",
    "labelX": 570,
    "labelY": 280,
    "flag": "\ud83c\udde8\ud83c\udde9",
    "role": "CRITICAL EXPORTER",
    "path": "M 551.4,236.1 L 576.4,237.5 L 584.7,240.3 L 583.3,247.2 L 580.6,258.3 L 584.7,269.4 L 581.9,273.6 L 579.2,281.9 L 581.9,286.1 L 577.8,287.5 L 566.7,283.3 L 561.1,272.2 L 550.0,266.7 L 533.3,263.9 L 536.1,262.5 L 545.8,254.2 L 550.0,244.4 L 551.4,236.1 Z"
  },
  {
    "code": "ZAF",
    "name": "South Africa",
    "specialty": "Bushveld Complex Platinum Group Metals, Chrome & Manganese",
    "labelX": 570,
    "labelY": 360,
    "flag": "\ud83c\uddff\ud83c\udde6",
    "role": "CRITICAL EXPORTER",
    "path": "M 581.9,311.1 L 587.5,312.5 L 590.3,322.2 L 590.3,329.2 L 579.2,338.9 L 555.6,345.8 L 550.0,341.7 L 545.8,329.2 L 555.6,325.0 L 555.6,319.4 L 570.8,320.8 L 581.9,311.1 Z"
  },
  {
    "code": "CHN",
    "name": "China",
    "specialty": "Global Dominant Processing Hub (Lithium, Cobalt, REEs, Graphite)",
    "labelX": 790,
    "labelY": 150,
    "flag": "\ud83c\udde8\ud83c\uddf3",
    "role": "PRIMARY REFINING MONOPOLY",
    "path": "M 843.1,101.4 L 873.6,116.7 L 863.9,131.9 L 844.4,141.7 L 840.3,145.8 L 837.5,161.1 L 837.5,172.2 L 818.1,187.5 L 801.4,190.3 L 780.6,190.3 L 769.4,172.2 L 747.2,173.6 L 719.4,162.5 L 708.3,147.2 L 705.6,138.9 L 736.1,119.4 L 743.1,113.9 L 766.7,127.8 L 786.1,131.9 L 830.6,111.1 L 843.1,101.4 Z"
  },
  {
    "code": "AUS",
    "name": "Australia",
    "specialty": "Western Australia Hard Rock Spodumene Lithium, Nickel, Rare Earths",
    "labelX": 850,
    "labelY": 330,
    "flag": "\ud83c\udde6\ud83c\uddfa",
    "role": "CRITICAL EXPORTER",
    "path": "M 895.8,280.6 L 904.2,294.4 L 925.0,318.1 L 923.6,338.9 L 916.7,354.2 L 906.9,358.3 L 888.9,354.2 L 877.8,347.2 L 866.7,338.9 L 841.7,344.4 L 826.4,347.2 L 820.8,338.9 L 816.7,311.1 L 830.6,304.2 L 843.1,294.4 L 852.8,288.9 L 877.8,283.3 L 887.5,297.2 L 895.8,280.6 Z"
  },
  {
    "code": "USA",
    "name": "United States",
    "specialty": "Major Strategic Consumer & Battery Gigafactory Expansion",
    "labelX": 235,
    "labelY": 155,
    "flag": "\ud83c\uddfa\ud83c\uddf8",
    "role": "PRIMARY CONSUMER HUB",
    "path": "M 158.3,113.9 L 236.1,113.9 L 252.8,116.7 L 291.7,125.0 L 302.8,125.0 L 302.8,136.1 L 290.3,152.8 L 275.0,169.4 L 276.4,180.6 L 263.9,169.4 L 236.1,168.1 L 230.6,177.8 L 204.2,162.5 L 191.7,162.5 L 175.0,159.7 L 158.3,144.4 L 154.2,133.3 L 158.3,113.9 Z"
  },
  {
    "code": "IDN",
    "name": "Indonesia",
    "specialty": "Morowali Industrial Park HPAL Nickel Matte & MHP (#1 Global Nickel)",
    "labelX": 835,
    "labelY": 260,
    "flag": "\ud83c\uddee\ud83c\udde9",
    "role": "CRITICAL EXPORTER",
    "path": "M 765.3,234.7 L 776.4,244.4 L 793.1,263.9 L 794.4,269.4 L 819.4,273.6 L 844.4,275.0 L 840.3,261.1 L 833.3,254.2 L 845.8,245.8 L 855.6,247.2 L 863.9,256.9 L 891.7,255.6 L 891.7,273.6 L 875.0,262.5 L 861.1,250.0 L 827.8,237.5 L 804.2,247.2 L 765.3,234.7 Z"
  },
  {
    "code": "DEU",
    "name": "Germany",
    "specialty": "European Automotive Heart & Battery Cell Manufacturing",
    "labelX": 530,
    "labelY": 108,
    "flag": "\ud83c\udde9\ud83c\uddea",
    "role": "CONSUMER / REFINER",
    "path": "M 523.6,97.2 L 538.9,98.6 L 541.7,108.3 L 537.5,115.3 L 527.8,118.1 L 522.2,113.9 L 516.7,108.3 L 519.4,101.4 L 523.6,97.2 Z"
  },
  {
    "code": "JPN",
    "name": "Japan",
    "specialty": "Yokohama Smelting & Advanced Cathode Precursors",
    "labelX": 885,
    "labelY": 148,
    "flag": "\ud83c\uddef\ud83c\uddf5",
    "role": "CONSUMER / TECH HUB",
    "path": "M 894.4,123.6 L 904.2,130.6 L 890.3,151.4 L 866.7,158.3 L 862.5,163.9 L 863.9,155.6 L 880.6,147.2 L 888.9,136.1 L 894.4,123.6 Z"
  },
  {
    "code": "IND",
    "name": "India",
    "specialty": "Production Linked Incentive (PLI) Battery Capacity Expansion",
    "labelX": 715,
    "labelY": 205,
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "role": "EMERGING CONSUMER",
    "path": "M 706.9,151.4 L 718.1,161.1 L 744.4,172.2 L 769.4,175.0 L 755.6,188.9 L 741.7,190.3 L 727.8,205.6 L 715.3,226.4 L 704.2,208.3 L 690.3,186.1 L 697.2,175.0 L 706.9,151.4 Z"
  },
  {
    "code": "CAN",
    "name": "Canada",
    "specialty": "Ontario / Quebec Critical Minerals Hub (Lithium, Nickel, Graphite)",
    "labelX": 200,
    "labelY": 95,
    "flag": "\ud83c\udde8\ud83c\udde6",
    "role": "CRITICAL EXPORTER",
    "path": "M 108.3,55.6 L 152.8,55.6 L 238.9,83.3 L 277.8,97.2 L 319.4,88.9 L 352.8,119.4 L 316.7,125.0 L 291.7,125.0 L 252.8,116.7 L 236.1,113.9 L 158.3,113.9 L 138.9,97.2 L 108.3,83.3 L 108.3,55.6 Z"
  },
  {
    "code": "MDG",
    "name": "Madagascar",
    "specialty": "High-Grade Flake Graphite & Nickel-Cobalt (Ambatovy)",
    "labelX": 630,
    "labelY": 350,
    "flag": "\ud83c\uddf2\ud83c\uddec",
    "role": "CRITICAL EXPORTER",
    "path": "M 636.1,283.3 L 638.9,294.4 L 630.6,319.4 L 625.0,320.8 L 622.2,305.6 L 630.6,291.7 L 636.1,283.3 Z"
  },
  {
    "code": "MOZ",
    "name": "Mozambique",
    "specialty": "Balama Flake Graphite Deposit (World's Largest)",
    "labelX": 610,
    "labelY": 315,
    "flag": "\ud83c\uddf2\ud83c\uddff",
    "role": "CRITICAL EXPORTER",
    "path": "M 612.5,280.6 L 612.5,291.7 L 598.6,305.6 L 591.7,322.2 L 588.9,316.7 L 591.7,302.8 L 584.7,293.1 L 597.2,283.3 L 612.5,280.6 Z"
  },
  {
    "code": "ZMB",
    "name": "Zambia",
    "specialty": "Central African Copperbelt & Cobalt By-Products",
    "labelX": 575,
    "labelY": 310,
    "flag": "\ud83c\uddff\ud83c\uddf2",
    "role": "CRITICAL EXPORTER",
    "path": "M 584.7,273.6 L 591.7,276.4 L 591.7,288.9 L 580.6,294.4 L 573.6,300.0 L 565.3,298.6 L 561.1,286.1 L 566.7,280.6 L 577.8,283.3 L 584.7,273.6 Z"
  },
  {
    "code": "RUS",
    "name": "Russia",
    "specialty": "Norilsk Class-1 Nickel, Palladium & Strategic Sanctions Risk",
    "labelX": 750,
    "labelY": 75,
    "flag": "\ud83c\uddf7\ud83c\uddfa",
    "role": "SANCTIONED PRODUCER",
    "path": "M 583.3,55.6 L 666.7,55.6 L 722.2,47.2 L 805.6,38.9 L 1000.0,55.6 L 944.4,83.3 L 888.9,111.1 L 863.9,125.0 L 833.3,111.1 L 777.8,105.6 L 736.1,111.1 L 666.7,97.2 L 583.3,83.3 L 583.3,55.6 Z"
  }
];

/**
 * Converts standard Latitude (-90 to +90) and Longitude (-180 to +180)
 * to 2D SVG canvas coordinates (0..1000, 0..500)
 */
export function projectLatLon(lat: number, lon: number, width = 1000, height = 500): { x: number; y: number } {
  const x = ((lon + 180) / 360) * width;
  const y = ((90 - lat) / 180) * height;
  return { x: Number(x.toFixed(1)), y: Number(y.toFixed(1)) };
}

/**
 * Generates an elevated quadratic Bézier curve connecting two geopolitical coordinates
 */
export function generateTradeArc(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): { path: string; midX: number; midY: number; length: number } {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Parabolic lift height scaled by geographic distance
  const curveLift = Math.min(68, Math.max(22, dist * 0.18));
  const midX = Number(((x1 + x2) / 2).toFixed(1));
  const midY = Number(((y1 + y2) / 2 - curveLift).toFixed(1));

  return {
    path: `M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${midX} ${midY} ${x2.toFixed(1)} ${y2.toFixed(1)}`,
    midX,
    midY,
    length: Number(dist.toFixed(1)),
  };
}
