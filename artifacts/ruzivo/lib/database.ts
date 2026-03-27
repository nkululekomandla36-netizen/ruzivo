import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Plant {
  id: string;
  name_common: string;
  name_scientific: string;
  image_url: string | null;
  safety_status: "Safe" | "Caution" | "Toxic";
  uses: string[];
  warnings: string[];
  traditional_uses: string[];
  local_names: Record<string, string>;
}

export interface Scan {
  id: string;
  image_uri: string;
  identified_name: string | null;
  confidence_score: number | null;
  timestamp: string;
}

const SEED_PLANTS: Plant[] = [
  {
    id: "aloe-vera",
    name_common: "Aloe Vera",
    name_scientific: "Aloe barbadensis miller",
    image_url: null,
    safety_status: "Safe",
    uses: [
      "Skin healing and burns",
      "Digestive aid",
      "Anti-inflammatory",
      "Wound healing",
      "Moisturizer",
    ],
    warnings: [
      "Excess intake may irritate stomach",
      "Avoid during pregnancy",
      "May interact with diabetes medication",
    ],
    traditional_uses: [
      "Used for burns and skin cleansing in African traditions",
      "Applied to wounds and rashes as a healing gel",
      "Used in purification rituals",
    ],
    local_names: {
      Shona: "Gavakava",
      Zulu: "iNtandane",
      Afrikaans: "Aalwyn",
      Sotho: "Kgopane",
    },
  },
  {
    id: "moringa",
    name_common: "Moringa",
    name_scientific: "Moringa oleifera",
    image_url: null,
    safety_status: "Safe",
    uses: [
      "Immune system booster",
      "Nutritional supplement",
      "Anti-inflammatory",
      "Blood sugar regulation",
      "Antioxidant rich",
    ],
    warnings: [
      "Avoid excessive use",
      "Consult doctor if pregnant",
      "May lower blood pressure",
    ],
    traditional_uses: [
      "Known as the 'miracle tree' or 'healing tree'",
      "Leaves used in soups and teas for nutrition",
      "Seeds used to purify water in rural communities",
    ],
    local_names: {
      Shona: "Moringa",
      Zulu: "umBhikabhika",
      Swahili: "Mzungu wa Nazi",
      Yoruba: "Ewe Ile Oyinbo",
    },
  },
  {
    id: "neem",
    name_common: "Neem",
    name_scientific: "Azadirachta indica",
    image_url: null,
    safety_status: "Caution",
    uses: [
      "Antibacterial treatment",
      "Skin conditions",
      "Dental hygiene",
      "Insect repellent",
      "Antifungal",
    ],
    warnings: [
      "Toxic in large amounts — use carefully",
      "Never give to children in high doses",
      "Avoid during pregnancy",
      "Can cause liver damage if overused",
    ],
    traditional_uses: [
      "Used for cleansing and spiritual protection",
      "Twigs used as natural toothbrushes",
      "Leaves burned to repel mosquitoes",
    ],
    local_names: {
      Shona: "Munyii",
      Swahili: "Mwarobaini",
      Hausa: "Dáwáníyà",
      Zulu: "Neem",
    },
  },
  {
    id: "rooibos",
    name_common: "Rooibos",
    name_scientific: "Aspalathus linearis",
    image_url: null,
    safety_status: "Safe",
    uses: [
      "Herbal tea",
      "Rich in antioxidants",
      "Stress relief",
      "Improved sleep",
      "Heart health support",
    ],
    warnings: [
      "Generally safe for most people",
      "May have mild estrogenic effects",
      "Avoid excessive intake with liver conditions",
    ],
    traditional_uses: [
      "South African indigenous herbal tea since the 18th century",
      "Used by Khoisan people for medicinal purposes",
      "Applied to skin to relieve eczema and acne",
    ],
    local_names: {
      Afrikaans: "Rooibostee",
      Xhosa: "ibhodi",
      Khoikhoi: "Rooibos",
      English: "Red Bush Tea",
    },
  },
  {
    id: "african-potato",
    name_common: "African Potato",
    name_scientific: "Hypoxis hemerocallidea",
    image_url: null,
    safety_status: "Caution",
    uses: [
      "Immune system support",
      "Anti-inflammatory",
      "Prostate health",
      "Urinary tract health",
    ],
    warnings: [
      "Must be used correctly and in proper doses",
      "Can interact with HIV antiretrovirals",
      "Do not use with immunosuppressants",
      "Consult a traditional healer or doctor first",
    ],
    traditional_uses: [
      "Important African medicinal root used for centuries",
      "Used to treat fever, wounds, and heart weakness",
      "Corm roasted and eaten during illness",
      "Widely used in South African traditional medicine",
    ],
    local_names: {
      Zulu: "inkomfe",
      Sotho: "Lotsane",
      Shona: "Chikaka",
      Xhosa: "inkomfe",
    },
  },
  {
    id: "baobab",
    name_common: "Baobab",
    name_scientific: "Adansonia digitata",
    image_url: null,
    safety_status: "Safe",
    uses: [
      "High in Vitamin C and antioxidants",
      "Digestive health",
      "Energy booster",
      "Skin moisturizer",
      "Immune support",
    ],
    warnings: [
      "Seed oil safe topically",
      "May cause mild diarrhea in large amounts",
      "Consult doctor if on blood thinners",
    ],
    traditional_uses: [
      "The 'Tree of Life' — revered across sub-Saharan Africa",
      "Bark used to make rope, cloth, and baskets",
      "Leaves dried and used in soups for nutrition",
      "Fruit pulp dissolved in water as a cooling drink",
    ],
    local_names: {
      Shona: "Mbuyu",
      Zulu: "iMvaba",
      Swahili: "Mbuyu",
      Hausa: "Kuka",
      Yoruba: "Ose",
    },
  },
  {
    id: "devils-claw",
    name_common: "Devil's Claw",
    name_scientific: "Harpagophytum procumbens",
    image_url: null,
    safety_status: "Caution",
    uses: [
      "Arthritis pain relief",
      "Lower back pain",
      "Anti-inflammatory",
      "Digestive disorders",
      "Fever reduction",
    ],
    warnings: [
      "Avoid during pregnancy",
      "May interact with blood thinners",
      "Not recommended for peptic ulcers",
      "Consult a doctor if on cardiac medication",
    ],
    traditional_uses: [
      "Used by San and Khoikhoi peoples of the Kalahari Desert",
      "Root tubers used to treat fevers, rheumatism, and indigestion",
      "Named for the hook-like structures on its fruit pods",
      "Widely exported as a natural anti-inflammatory",
    ],
    local_names: {
      Afrikaans: "Duiwelsklou",
      Tswana: "Sengaparile",
      English: "Devil's Claw",
      German: "Teufelskralle",
    },
  },
  {
    id: "african-wormwood",
    name_common: "African Wormwood",
    name_scientific: "Artemisia afra",
    image_url: null,
    safety_status: "Caution",
    uses: [
      "Cold and flu remedy",
      "Cough and bronchitis",
      "Fever treatment",
      "Malaria prevention support",
      "Intestinal worms",
    ],
    warnings: [
      "Not safe during pregnancy",
      "Avoid in young children",
      "May cause allergic reactions in sensitive individuals",
      "Do not use long-term without supervision",
    ],
    traditional_uses: [
      "One of the most widely used traditional medicines in southern Africa",
      "Burned and inhaled to treat nasal congestion and headaches",
      "Leaves boiled as a tea for colds and fevers",
      "Applied topically for skin conditions and wounds",
    ],
    local_names: {
      Zulu: "umhlonyane",
      Xhosa: "umhlonyane",
      Sotho: "lengana",
      Afrikaans: "Wildeals",
      Shona: "Chigwada",
    },
  },
  {
    id: "buchu",
    name_common: "Buchu",
    name_scientific: "Agathosma betulina",
    image_url: null,
    safety_status: "Caution",
    uses: [
      "Urinary tract infections",
      "Kidney support",
      "Anti-inflammatory",
      "Diuretic",
      "Digestive aid",
    ],
    warnings: [
      "Avoid during pregnancy and breastfeeding",
      "May irritate kidneys in large doses",
      "Not suitable for those with kidney disease",
      "May interact with diuretic medications",
    ],
    traditional_uses: [
      "Sacred plant of the Khoikhoi people of the Cape region",
      "Used for centuries as a healing tonic and medicine",
      "Leaves mixed with brandy to make 'buchu brandy'",
      "Applied to bruises and sprains",
    ],
    local_names: {
      Khoikhoi: "Buchu",
      Afrikaans: "Boegoe",
      Xhosa: "Ibuchu",
      English: "Round Leaf Buchu",
    },
  },
  {
    id: "sutherlandia",
    name_common: "Cancer Bush",
    name_scientific: "Sutherlandia frutescens",
    image_url: null,
    safety_status: "Caution",
    uses: [
      "Immune system strengthening",
      "Anti-cancer support",
      "HIV/AIDS support therapy",
      "Stress and anxiety relief",
      "Anti-inflammatory",
    ],
    warnings: [
      "Interacts severely with antiretroviral drugs",
      "Avoid with immunosuppressants",
      "Not safe during pregnancy or breastfeeding",
      "Consult a doctor before use",
    ],
    traditional_uses: [
      "Used by Khoikhoi and Cape Malay communities for centuries",
      "Called 'the plant that dispels darkness'",
      "Traditionally used for cancer, TB, and diabetes",
      "Leaves boiled as a tea for chronic illness",
    ],
    local_names: {
      Afrikaans: "Kankerbossie",
      Sotho: "Lerumo-lamadi",
      Zulu: "Unwele",
      Xhosa: "Unwele",
    },
  },
  {
    id: "cape-aloe",
    name_common: "Cape Aloe",
    name_scientific: "Aloe ferox",
    image_url: null,
    safety_status: "Caution",
    uses: [
      "Laxative and constipation relief",
      "Skin healing",
      "Bitter tonic for digestion",
      "Wound healing",
      "Anti-inflammatory",
    ],
    warnings: [
      "Powerful laxative — use only in small doses",
      "Not safe during pregnancy",
      "Can cause cramps and diarrhea if overused",
      "Avoid with kidney conditions",
    ],
    traditional_uses: [
      "Widely used in South African traditional healing",
      "Bitter sap collected from leaves for medicinal use",
      "Used as a purgative in cleansing ceremonies",
      "Xhosa and Zulu healers use it for stomach complaints",
    ],
    local_names: {
      Afrikaans: "Bitteraalwyn",
      Zulu: "umHlaba",
      Xhosa: "ikhala",
      Sotho: "Mokgopha",
    },
  },
  {
    id: "fever-tree",
    name_common: "Fever Tree",
    name_scientific: "Vachellia xanthophloea",
    image_url: null,
    safety_status: "Caution",
    uses: [
      "Malaria and fever treatment",
      "Eye infections",
      "Skin conditions",
      "Headache relief",
      "Rheumatism",
    ],
    warnings: [
      "Use bark extracts carefully",
      "Not safe for children in high doses",
      "Consult a healer before internal use",
    ],
    traditional_uses: [
      "Named by early settlers as it grew near mosquito-infested wetlands",
      "Bark used to treat malaria fevers in eastern Africa",
      "Bark decoctions used as an eyewash",
      "An important tree in Zulu and Swazi traditional medicine",
    ],
    local_names: {
      Zulu: "umHlosinga",
      Swahili: "Mgunga",
      Sotho: "Mogohlo",
      Afrikaans: "Koorsboom",
    },
  },
  {
    id: "marula",
    name_common: "Marula",
    name_scientific: "Sclerocarya birrea",
    image_url: null,
    safety_status: "Safe",
    uses: [
      "Nutritious fruit for eating",
      "Skin moisturizer (oil)",
      "Anti-inflammatory",
      "Wound healing",
      "Antioxidant rich fruit",
    ],
    warnings: [
      "Fermented fruit has high alcohol content",
      "Bark decoctions should be used with care",
      "Large amounts of bark may cause diarrhea",
    ],
    traditional_uses: [
      "Fruit used to brew traditional beer throughout southern Africa",
      "Bark used to treat dysentery and malaria",
      "Seed oil used in cooking and as a skin moisturizer",
      "Revered in Swazi, Zulu, and Shona cultures for celebrations",
    ],
    local_names: {
      Zulu: "umGanu",
      Shona: "Mufura",
      Tswana: "Morula",
      Swahili: "Maru",
      Swazi: "umGanu",
    },
  },
  {
    id: "wild-garlic",
    name_common: "Wild Garlic",
    name_scientific: "Tulbaghia violacea",
    image_url: null,
    safety_status: "Safe",
    uses: [
      "Antibacterial and antifungal",
      "Cold and flu treatment",
      "High blood pressure",
      "Worm treatment",
      "Stomach pain relief",
    ],
    warnings: [
      "Strong smell may cause nausea in some people",
      "Avoid very large doses",
      "May thin blood — caution with blood thinners",
    ],
    traditional_uses: [
      "Used throughout Zulu and Sotho traditional medicine",
      "Bulbs and leaves used to treat colds and fever",
      "Applied topically for skin infections and rashes",
      "Planted near homesteads to repel moles and snakes",
    ],
    local_names: {
      Zulu: "umaganda",
      Sotho: "Lerotwane",
      Xhosa: "Ishaqa",
      Afrikaans: "Wildeknoffel",
    },
  },
  {
    id: "bitter-melon",
    name_common: "Bitter Melon",
    name_scientific: "Momordica charantia",
    image_url: null,
    safety_status: "Caution",
    uses: [
      "Blood sugar regulation (diabetes)",
      "Immune support",
      "Digestive health",
      "Anti-malarial",
      "Weight management",
    ],
    warnings: [
      "Can cause hypoglycemia — monitor blood sugar closely",
      "Avoid during pregnancy — may cause miscarriage",
      "Not for children under 12",
      "May interfere with liver enzymes",
    ],
    traditional_uses: [
      "Widely used in West and East African traditional medicine",
      "Leaves boiled as a bitter tea for treating diabetes",
      "Fruit juice used to treat malaria and fever",
      "Used in Ghana, Nigeria, and Zimbabwe for centuries",
    ],
    local_names: {
      Shona: "Nhchamabwe",
      Yoruba: "Ejirin",
      Swahili: "Karela",
      Hausa: "Garafuni",
    },
  },
  {
    id: "african-basil",
    name_common: "African Basil",
    name_scientific: "Ocimum gratissimum",
    image_url: null,
    safety_status: "Safe",
    uses: [
      "Antibacterial properties",
      "Respiratory infections",
      "Diarrhea and stomach complaints",
      "Headache relief",
      "Fever reduction",
    ],
    warnings: [
      "Generally safe in culinary amounts",
      "Avoid high doses during pregnancy",
      "May lower blood pressure",
    ],
    traditional_uses: [
      "Used across West and Central Africa as a medicinal plant",
      "Leaves boiled as a steam inhalant for colds",
      "Used in spiritual and ritual cleansing practices",
      "Often grown near homes for its protective aroma",
    ],
    local_names: {
      Yoruba: "Efirin nla",
      Igbo: "Nchanwu",
      Shona: "Mutsvairo",
      Swahili: "Mrehani mwitu",
    },
  },
  {
    id: "stinging-nettle",
    name_common: "African Nettle",
    name_scientific: "Urtica massaica",
    image_url: null,
    safety_status: "Caution",
    uses: [
      "Joint and arthritis pain",
      "Anemia treatment",
      "Kidney support",
      "Nutritious wild food (cooked)",
      "Blood pressure regulation",
    ],
    warnings: [
      "Raw plant causes skin irritation and stinging",
      "Always cook before eating",
      "Avoid in early pregnancy",
      "May interact with blood pressure medications",
    ],
    traditional_uses: [
      "Leaves cooked and eaten as nutritious greens across East Africa",
      "Used by Maasai and Kikuyu communities for joint pain",
      "Roots boiled for kidney complaints",
      "Leaves used as a poultice for skin problems",
    ],
    local_names: {
      Swahili: "Thabai",
      Kikuyu: "Thabai",
      Luo: "Atipa",
      Zulu: "isiQwabaqa",
    },
  },
  {
    id: "papaya",
    name_common: "Papaya",
    name_scientific: "Carica papaya",
    image_url: null,
    safety_status: "Safe",
    uses: [
      "Digestive enzyme (papain)",
      "Anti-parasitic",
      "Wound healing",
      "Skin brightening",
      "Anti-inflammatory",
    ],
    warnings: [
      "Unripe papaya dangerous during pregnancy",
      "Seeds are medicinal but toxic in large amounts",
      "May cause allergic reactions in latex-sensitive individuals",
    ],
    traditional_uses: [
      "Leaf tea used across Africa to treat malaria and dengue fever",
      "Seeds chewed to expel intestinal worms",
      "Unripe fruit applied topically to heal wounds and ulcers",
      "Widely used in Zimbabwean and Kenyan traditional medicine",
    ],
    local_names: {
      Shona: "Mapopo",
      Swahili: "Mpapai",
      Zulu: "Pawpaw",
      Yoruba: "Ibepe",
      Hausa: "Gwanda",
    },
  },
  {
    id: "hibiscus",
    name_common: "Hibiscus",
    name_scientific: "Hibiscus sabdariffa",
    image_url: null,
    safety_status: "Safe",
    uses: [
      "High blood pressure reduction",
      "Rich in Vitamin C",
      "Herbal tea (bissap / zobo)",
      "Cholesterol management",
      "Liver health",
    ],
    warnings: [
      "Avoid during pregnancy in high doses",
      "May lower blood pressure — caution with medication",
      "May interact with acetaminophen",
    ],
    traditional_uses: [
      "Dried calyces brewed as 'Zobo' in Nigeria and 'Bissap' in West Africa",
      "Used in Egypt and Sudan as a cooling herbal drink",
      "Petals used for jam, sauces, and traditional drinks",
      "Leaves and seeds eaten as food in parts of Africa",
    ],
    local_names: {
      Yoruba: "Zobo",
      Hausa: "Yakuwa",
      Swahili: "Uyuga",
      Arabic: "Karkadeh",
      French: "Bissap",
    },
  },
  {
    id: "wild-dagga",
    name_common: "Wild Dagga",
    name_scientific: "Leonotis leonurus",
    image_url: null,
    safety_status: "Caution",
    uses: [
      "Skin conditions and eczema",
      "Fever and headache",
      "Snake bite treatment",
      "Epilepsy support",
      "High blood pressure",
    ],
    warnings: [
      "Mild psychoactive — use with caution",
      "Not safe during pregnancy",
      "Do not combine with CNS medications",
      "Avoid operating machinery after use",
    ],
    traditional_uses: [
      "Used in Zulu and Xhosa traditional healing",
      "Smoke inhaled for its mild euphoric and calming effects",
      "Flowers and leaves used in teas for various ailments",
      "Applied as poultice for skin diseases and hemorrhoids",
    ],
    local_names: {
      Zulu: "Umfincafincane",
      Afrikaans: "Wildedagga",
      Xhosa: "umFincafincane",
      English: "Lion's Ear",
    },
  },
];

const PLANTS_KEY = "@ruzivo/plants";
const SCANS_KEY = "@ruzivo/scans";

let initialized = false;

async function initAsyncStorage(): Promise<void> {
  if (initialized) return;
  const existing = await AsyncStorage.getItem(PLANTS_KEY);
  if (!existing) {
    await AsyncStorage.setItem(PLANTS_KEY, JSON.stringify(SEED_PLANTS));
  } else {
    const current: Plant[] = JSON.parse(existing);
    const currentIds = new Set(current.map((p) => p.id));
    const newPlants = SEED_PLANTS.filter((p) => !currentIds.has(p.id));
    if (newPlants.length > 0) {
      await AsyncStorage.setItem(
        PLANTS_KEY,
        JSON.stringify([...current, ...newPlants])
      );
    }
  }
  initialized = true;
}

export async function initDatabase(): Promise<void> {
  if (Platform.OS === "web") {
    await initAsyncStorage();
    return;
  }

  try {
    const SQLite = await import("expo-sqlite");
    const db = await SQLite.openDatabaseAsync("ruzivo.db");

    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS plants (
        id TEXT PRIMARY KEY,
        name_common TEXT NOT NULL,
        name_scientific TEXT NOT NULL,
        image_url TEXT,
        safety_status TEXT NOT NULL,
        uses TEXT NOT NULL,
        warnings TEXT NOT NULL,
        traditional_uses TEXT NOT NULL,
        local_names TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS scans (
        id TEXT PRIMARY KEY,
        image_uri TEXT NOT NULL,
        identified_name TEXT,
        confidence_score REAL,
        timestamp TEXT NOT NULL
      );
    `);

    for (const plant of SEED_PLANTS) {
      await db.runAsync(
        `INSERT OR IGNORE INTO plants (id, name_common, name_scientific, image_url, safety_status, uses, warnings, traditional_uses, local_names)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          plant.id,
          plant.name_common,
          plant.name_scientific,
          plant.image_url,
          plant.safety_status,
          JSON.stringify(plant.uses),
          JSON.stringify(plant.warnings),
          JSON.stringify(plant.traditional_uses),
          JSON.stringify(plant.local_names),
        ]
      );
    }
  } catch (err) {
    console.warn("SQLite not available, falling back to AsyncStorage:", err);
    await initAsyncStorage();
  }
}

async function getNativePlants(): Promise<Plant[]> {
  try {
    const SQLite = await import("expo-sqlite");
    const db = await SQLite.openDatabaseAsync("ruzivo.db");
    const rows = await db.getAllAsync<{
      id: string;
      name_common: string;
      name_scientific: string;
      image_url: string | null;
      safety_status: string;
      uses: string;
      warnings: string;
      traditional_uses: string;
      local_names: string;
    }>("SELECT * FROM plants ORDER BY name_common ASC");
    return rows.map((r) => ({
      ...r,
      safety_status: r.safety_status as Plant["safety_status"],
      uses: JSON.parse(r.uses),
      warnings: JSON.parse(r.warnings),
      traditional_uses: JSON.parse(r.traditional_uses),
      local_names: JSON.parse(r.local_names),
    }));
  } catch {
    return getWebPlants();
  }
}

async function getWebPlants(): Promise<Plant[]> {
  const data = await AsyncStorage.getItem(PLANTS_KEY);
  if (!data) return [...SEED_PLANTS];
  return JSON.parse(data) as Plant[];
}

export async function getAllPlants(): Promise<Plant[]> {
  if (Platform.OS !== "web") return getNativePlants();
  return getWebPlants();
}

export async function searchPlants(query: string): Promise<Plant[]> {
  const plants = await getAllPlants();
  const q = query.toLowerCase();
  return plants.filter(
    (p) =>
      p.name_common.toLowerCase().includes(q) ||
      p.name_scientific.toLowerCase().includes(q)
  );
}

export async function getPlantsByFilter(
  filter: "Medicinal" | "Toxic" | "Food"
): Promise<Plant[]> {
  const plants = await getAllPlants();
  if (filter === "Toxic") {
    return plants.filter(
      (p) => p.safety_status === "Toxic" || p.safety_status === "Caution"
    );
  } else if (filter === "Food") {
    return plants.filter((p) => p.safety_status === "Safe");
  }
  return plants;
}

export async function getPlantById(id: string): Promise<Plant | null> {
  const plants = await getAllPlants();
  return plants.find((p) => p.id === id) ?? null;
}

export async function saveScan(scan: Scan): Promise<void> {
  const data = await AsyncStorage.getItem(SCANS_KEY);
  const scans: Scan[] = data ? JSON.parse(data) : [];
  scans.unshift(scan);
  await AsyncStorage.setItem(SCANS_KEY, JSON.stringify(scans.slice(0, 50)));

  if (Platform.OS !== "web") {
    try {
      const SQLite = await import("expo-sqlite");
      const db = await SQLite.openDatabaseAsync("ruzivo.db");
      await db.runAsync(
        "INSERT OR REPLACE INTO scans (id, image_uri, identified_name, confidence_score, timestamp) VALUES (?, ?, ?, ?, ?)",
        [
          scan.id,
          scan.image_uri,
          scan.identified_name,
          scan.confidence_score,
          scan.timestamp,
        ]
      );
    } catch {
    }
  }
}

export async function getRecentScans(limit = 10): Promise<Scan[]> {
  const data = await AsyncStorage.getItem(SCANS_KEY);
  if (!data) return [];
  const scans: Scan[] = JSON.parse(data);
  return scans.slice(0, limit);
}
