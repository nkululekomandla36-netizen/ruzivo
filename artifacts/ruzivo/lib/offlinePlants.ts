export interface OfflinePlant {
  id: string;
  name_common: string;
  name_scientific: string;
  category: "medicinal" | "food" | "toxic";
  safety_status: "Safe" | "Caution" | "Toxic";
  africanKnowledge: {
    uses: string;
    preparation: string;
    warnings: string;
  };
  uses: string[];
  warnings: string[];
  traditional_uses: string[];
  local_names: Record<string, string>;
}

export const offlinePlants: OfflinePlant[] = [
  {
    id: "aloe-vera",
    name_common: "Aloe Vera",
    name_scientific: "Aloe barbadensis miller",
    category: "medicinal",
    safety_status: "Safe",
    africanKnowledge: {
      uses: "Skin healing, burns, and digestive aid across African traditions",
      preparation: "Apply gel externally or process sap carefully before ingestion",
      warnings: "Excess intake may irritate stomach; avoid during pregnancy",
    },
    uses: ["Skin healing and burns", "Digestive aid", "Anti-inflammatory", "Wound healing"],
    warnings: ["Excess intake may irritate stomach", "Avoid during pregnancy"],
    traditional_uses: [
      "Used for burns and skin cleansing in African traditions",
      "Applied to wounds and rashes as a healing gel",
    ],
    local_names: { Shona: "Gavakava", Zulu: "iNtandane", Afrikaans: "Aalwyn", Sotho: "Kgopane" },
  },
  {
    id: "moringa",
    name_common: "Moringa",
    name_scientific: "Moringa oleifera",
    category: "food",
    safety_status: "Safe",
    africanKnowledge: {
      uses: "Nutritional supplement; leaves used in soups and traditional medicine",
      preparation: "Dry and powder leaves for tea, or cook fresh leaves in stews",
      warnings: "Root extracts should be avoided during pregnancy",
    },
    uses: ["Rich in vitamins and minerals", "Anti-inflammatory", "Blood sugar support"],
    warnings: ["Root bark may be toxic", "Avoid high doses during pregnancy"],
    traditional_uses: [
      "Leaves boiled as nutritional supplement across East and West Africa",
      "Seeds used for water purification",
    ],
    local_names: { Swahili: "Mzungu wa nazi", Hausa: "Zogale", Shona: "Musumo" },
  },
  {
    id: "neem",
    name_common: "Neem",
    name_scientific: "Azadirachta indica",
    category: "medicinal",
    safety_status: "Caution",
    africanKnowledge: {
      uses: "Fever, malaria, skin infections, and dental hygiene",
      preparation: "Boil leaves for tea or use as a wash; chew twigs for dental care",
      warnings: "Not safe for children in high doses; avoid during pregnancy",
    },
    uses: ["Antimicrobial", "Malaria support", "Skin infections", "Dental hygiene"],
    warnings: ["Toxic in high doses to children", "Not for pregnant women"],
    traditional_uses: [
      "Twigs used as toothbrushes across West Africa",
      "Leaf tea used for fever and malaria in Nigeria and Ghana",
    ],
    local_names: { Hausa: "Dogon yaro", Yoruba: "Afara", Swahili: "Mwarobaini" },
  },
  {
    id: "rooibos",
    name_common: "Rooibos",
    name_scientific: "Aspalathus linearis",
    category: "food",
    safety_status: "Safe",
    africanKnowledge: {
      uses: "Antioxidant tea; used for infant colic and digestive issues",
      preparation: "Steep dried leaves in hot water for 5–7 minutes",
      warnings: "Generally very safe; excessive amounts may affect iron absorption",
    },
    uses: ["Antioxidant-rich", "Digestive aid", "Caffeine-free beverage", "Infant colic relief"],
    warnings: ["May reduce iron absorption in excess"],
    traditional_uses: [
      "Indigenous Khoisan people used it as a medicinal tea for centuries",
      "Used by nursing mothers in South Africa for infant colic",
    ],
    local_names: { Afrikaans: "Rooibos", Xhosa: "Imphepho", Sotho: "Thethe" },
  },
  {
    id: "african-potato",
    name_common: "African Potato",
    name_scientific: "Hypoxis hemerocallidea",
    category: "medicinal",
    safety_status: "Caution",
    africanKnowledge: {
      uses: "Immune support; traditionally used for urinary tract conditions",
      preparation: "Boil corms in water to make a medicinal tea",
      warnings: "Can interfere with antiretroviral drugs; do not self-medicate",
    },
    uses: ["Immune support", "Anti-inflammatory", "Urinary tract health"],
    warnings: ["Interferes with ARV medication", "Do not combine with other drugs without advice"],
    traditional_uses: [
      "Widely used in Southern Africa as an immune tonic",
      "Traditional healers use for general wellness and prostate health",
    ],
    local_names: { Zulu: "iNkomfe", Sotho: "Lotsane", Afrikaans: "Sterblom" },
  },
  {
    id: "baobab",
    name_common: "Baobab",
    name_scientific: "Adansonia digitata",
    category: "food",
    safety_status: "Safe",
    africanKnowledge: {
      uses: "Fruit pulp used for nutrition, vitamin C, and electrolytes",
      preparation: "Mix powdered fruit with water or milk; use leaves in cooking",
      warnings: "Very safe; excessive consumption may cause mild digestive upset",
    },
    uses: ["High vitamin C content", "Electrolyte source", "Nutritional supplement"],
    warnings: ["Consume in moderate amounts"],
    traditional_uses: [
      "Called the Tree of Life across sub-Saharan Africa",
      "Fruit pulp dissolved in water as a refreshing drink and energy source",
    ],
    local_names: { Swahili: "Mbuyu", Hausa: "Kuka", Shona: "Mbuyu", Zulu: "iSimuku" },
  },
  {
    id: "devils-claw",
    name_common: "Devil's Claw",
    name_scientific: "Harpagophytum procumbens",
    category: "medicinal",
    safety_status: "Caution",
    africanKnowledge: {
      uses: "Joint pain, arthritis, and digestive bitters",
      preparation: "Boil dried tubers to make a tea; take small amounts",
      warnings: "Avoid with blood thinners; not for pregnant women or those with ulcers",
    },
    uses: ["Joint and arthritis pain relief", "Anti-inflammatory", "Digestive bitter"],
    warnings: ["Avoid with blood-thinning medication", "Not for pregnancy or peptic ulcers"],
    traditional_uses: [
      "Used by San and Khoikhoi peoples of southern Africa for pain",
      "Applied as a poultice for skin conditions",
    ],
    local_names: { Afrikaans: "Duiwelsklou", Tswana: "Sengaparile" },
  },
  {
    id: "african-wormwood",
    name_common: "African Wormwood",
    name_scientific: "Artemisia afra",
    category: "medicinal",
    safety_status: "Caution",
    africanKnowledge: {
      uses: "Respiratory infections, colds, fever, and malaria",
      preparation: "Boil leaves in water and inhale steam, or drink as tea",
      warnings: "Do not use during pregnancy; avoid prolonged use",
    },
    uses: ["Cold and flu remedy", "Fever reduction", "Respiratory support"],
    warnings: ["Avoid during pregnancy", "Do not use for extended periods"],
    traditional_uses: [
      "Most widely used medicinal plant in southern Africa",
      "Inhaled steam used for chest infections and colds",
    ],
    local_names: { Afrikaans: "Wilde als", Zulu: "umhlonyane", Xhosa: "umhlonyana" },
  },
  {
    id: "buchu",
    name_common: "Buchu",
    name_scientific: "Agathosma betulina",
    category: "medicinal",
    safety_status: "Safe",
    africanKnowledge: {
      uses: "Urinary tract infections, kidney support, and digestive health",
      preparation: "Steep leaves in hot water for tea or infuse in brandy (traditional)",
      warnings: "Avoid in pregnancy; do not use with kidney disease",
    },
    uses: ["Urinary tract support", "Anti-inflammatory", "Digestive health"],
    warnings: ["Avoid during pregnancy", "Consult doctor if kidney disease present"],
    traditional_uses: [
      "Khoikhoi people used buchu as perfume and for healing",
      "Rubbed on the body as insect repellent and spiritual protection",
    ],
    local_names: { Afrikaans: "Boegoe", Khoikhoi: "Bookoo" },
  },
  {
    id: "cancer-bush",
    name_common: "Cancer Bush",
    name_scientific: "Sutherlandia frutescens",
    category: "medicinal",
    safety_status: "Caution",
    africanKnowledge: {
      uses: "Immune booster, stress adaptogen, and general tonic",
      preparation: "Brew dried leaves as a tea; use in small amounts",
      warnings: "Can interact with ARV drugs; not for diabetics without supervision",
    },
    uses: ["Immune support", "Adaptogen", "Anti-inflammatory"],
    warnings: ["Interacts with ARV medication", "Monitor blood sugar if diabetic"],
    traditional_uses: [
      "Used across southern Africa as a general healing tonic",
      "Called 'cancer bush' for its traditional use with serious illness",
    ],
    local_names: { Afrikaans: "Kankerbos", Zulu: "insiswa", Sotho: "lerumo-lamadi" },
  },
  {
    id: "cape-aloe",
    name_common: "Cape Aloe",
    name_scientific: "Aloe ferox",
    category: "medicinal",
    safety_status: "Caution",
    africanKnowledge: {
      uses: "Laxative, skin care, and joint inflammation",
      preparation: "Dried bitter sap used sparingly; gel applied externally",
      warnings: "Strong laxative — use minimal doses; not during pregnancy",
    },
    uses: ["Laxative", "Skin healing", "Anti-inflammatory"],
    warnings: ["Strong laxative effect", "Not for pregnant or nursing women"],
    traditional_uses: [
      "Bitter sap collected and dried into blocks for traditional medicine in South Africa",
      "External gel used for burns and skin irritations",
    ],
    local_names: { Afrikaans: "Bitteraalwyn", Zulu: "iNhlakazana" },
  },
  {
    id: "fever-tree",
    name_common: "Fever Tree",
    name_scientific: "Acacia xanthophloea",
    category: "medicinal",
    safety_status: "Caution",
    africanKnowledge: {
      uses: "Malaria and fever treatment; eye infections",
      preparation: "Boil bark in water; use as a wash or drink in small quantities",
      warnings: "Use with care; bark decoction should be diluted",
    },
    uses: ["Fever and malaria support", "Antimicrobial", "Eye wash"],
    warnings: ["Use diluted preparations only", "Not a substitute for medical treatment"],
    traditional_uses: [
      "Named by settlers who observed it near malaria-prone wetlands",
      "Bark used by Zulu and Swazi healers for fever and body pain",
    ],
    local_names: { Zulu: "umHlosinga", Afrikaans: "Koorsboom", Swahili: "Mgunga" },
  },
  {
    id: "marula",
    name_common: "Marula",
    name_scientific: "Sclerocarya birrea",
    category: "food",
    safety_status: "Safe",
    africanKnowledge: {
      uses: "Nutrition, skin oil, and traditional brewing",
      preparation: "Eat fruit fresh; press nuts for oil; bark brewed for tea",
      warnings: "Fermented fruit is alcoholic; bark tea in moderation only",
    },
    uses: ["Vitamin C-rich fruit", "Skin moisturiser (oil)", "Nutritional food source"],
    warnings: ["Fermented juice is highly alcoholic"],
    traditional_uses: [
      "Fruit eaten across southern Africa; oil used for skin and hair care",
      "Bark used medicinally for fever and malaria by Venda and Tsonga people",
    ],
    local_names: { Zulu: "umGanu", Shona: "Mahobohobo", Afrikaans: "Maroela" },
  },
  {
    id: "wild-garlic",
    name_common: "Wild Garlic",
    name_scientific: "Tulbaghia violacea",
    category: "medicinal",
    safety_status: "Safe",
    africanKnowledge: {
      uses: "Immune support, sinusitis, and blood pressure",
      preparation: "Crush leaves and eat raw; brew as a tea or cook in food",
      warnings: "Excess may cause stomach irritation; mild blood-thinning effect",
    },
    uses: ["Antimicrobial", "Blood pressure support", "Immune booster", "Sinus relief"],
    warnings: ["May cause stomach upset in large amounts"],
    traditional_uses: [
      "Used by Zulu healers to treat fever and colds",
      "Leaves and bulbs rubbed on the body to deter insects and snakes",
    ],
    local_names: { Zulu: "umagaq", Sotho: "tšhipi", Afrikaans: "Wildeknoffel" },
  },
  {
    id: "bitter-melon",
    name_common: "Bitter Melon",
    name_scientific: "Momordica charantia",
    category: "medicinal",
    safety_status: "Caution",
    africanKnowledge: {
      uses: "Blood sugar control and digestive health",
      preparation: "Juice fruit or cook young fruit as vegetable; brew leaves as tea",
      warnings: "Can lower blood sugar significantly; avoid in pregnancy",
    },
    uses: ["Blood sugar support", "Digestive health", "Antimicrobial"],
    warnings: ["Significant hypoglycaemic effect", "Not for pregnant women or young children"],
    traditional_uses: [
      "Used in East and West Africa for diabetes management",
      "Leaves applied topically for skin infections",
    ],
    local_names: { Swahili: "Karela", Yoruba: "Ejinrin" },
  },
  {
    id: "african-basil",
    name_common: "African Basil",
    name_scientific: "Ocimum gratissimum",
    category: "food",
    safety_status: "Safe",
    africanKnowledge: {
      uses: "Cooking herb, fever relief, and respiratory support",
      preparation: "Use fresh or dried in cooking; brew as herbal tea",
      warnings: "Very safe; avoid essential oil concentrates during pregnancy",
    },
    uses: ["Culinary herb", "Antimicrobial", "Fever relief", "Respiratory support"],
    warnings: ["Concentrated essential oil not for pregnancy"],
    traditional_uses: [
      "Used across West Africa in cooking and as a medicinal plant",
      "Leaf tea used for cold and respiratory infections in Nigeria",
    ],
    local_names: { Yoruba: "Efirin", Igbo: "Nchanwu", Hausa: "Daidoya" },
  },
  {
    id: "papaya",
    name_common: "Papaya",
    name_scientific: "Carica papaya",
    category: "food",
    safety_status: "Safe",
    africanKnowledge: {
      uses: "Digestive enzyme, skin healing, and anti-parasitic",
      preparation: "Eat ripe fruit; use seeds for parasite treatment; apply latex to wounds",
      warnings: "Unripe fruit latex not safe during pregnancy; seeds in moderation only",
    },
    uses: ["Digestive enzyme (papain)", "Anti-parasitic", "Skin healing", "Nutritious fruit"],
    warnings: ["Unripe papaya not safe in pregnancy", "Seeds in excess may be harmful"],
    traditional_uses: [
      "Seeds used across Africa as a natural dewormer",
      "Leaves crushed and applied to wounds to speed healing",
    ],
    local_names: { Swahili: "Papai", Hausa: "Gwanda", Zulu: "umkhiwa" },
  },
  {
    id: "hibiscus",
    name_common: "Hibiscus",
    name_scientific: "Hibiscus sabdariffa",
    category: "food",
    safety_status: "Safe",
    africanKnowledge: {
      uses: "Blood pressure support, antioxidant tea, and digestive health",
      preparation: "Brew dried calyces in hot or cold water as a tea (called Zobo or Bissap)",
      warnings: "May lower blood pressure; caution if on antihypertensives",
    },
    uses: ["Blood pressure support", "Antioxidant-rich", "Digestive health", "Refreshing beverage"],
    warnings: ["May interact with blood pressure medication"],
    traditional_uses: [
      "Zobo drink widely consumed in Nigeria; Bissap in Senegal and West Africa",
      "Flowers used in traditional medicine for liver health",
    ],
    local_names: { Hausa: "Zobo", Yoruba: "Isapa", Swahili: "Uyoga wa rangi" },
  },
  {
    id: "wild-dagga",
    name_common: "Wild Dagga",
    name_scientific: "Leonotis leonurus",
    category: "medicinal",
    safety_status: "Caution",
    africanKnowledge: {
      uses: "Skin conditions, snake bites, and headaches",
      preparation: "Boil leaves for a wash; brew small amounts as tea",
      warnings: "Mildly psychoactive; avoid high doses and use during pregnancy",
    },
    uses: ["Skin conditions", "Headache relief", "Anti-inflammatory"],
    warnings: ["Mildly psychoactive in high doses", "Not for children or pregnancy"],
    traditional_uses: [
      "Used by Khoikhoi and Zulu healers for skin rashes and venomous bites",
      "Leaves smoked ceremonially in some southern African traditions",
    ],
    local_names: { Afrikaans: "Wildesalie", Zulu: "umFincafincane", Xhosa: "umFincafincane" },
  },
  {
    id: "african-nettle",
    name_common: "African Nettle",
    name_scientific: "Laportea aestuans",
    category: "medicinal",
    safety_status: "Caution",
    africanKnowledge: {
      uses: "Rheumatism, fever, and urinary conditions",
      preparation: "Boil leaves carefully; apply cooked leaves as poultice",
      warnings: "Fresh leaves cause stinging; handle with care; use only cooked/dried",
    },
    uses: ["Anti-inflammatory", "Fever relief", "Urinary support"],
    warnings: ["Fresh plant causes skin irritation and stinging", "Handle with gloves"],
    traditional_uses: [
      "Used in West Africa for joint pain and fever",
      "Dried leaves brewed as a medicinal tea",
    ],
    local_names: { Yoruba: "Esisi", Swahili: "Upupu" },
  },
];
