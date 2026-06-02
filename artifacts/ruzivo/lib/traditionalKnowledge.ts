export interface LocalPlantKnowledge {
  traditionalKnowledge: string[];
  traditionalUses: string[];
  safetyNotes: string[];
  ecology: string[];
  conservation: string[];
}

const knowledgeMap: Record<string, LocalPlantKnowledge> = {
  "aloe barbadensis miller": {
    traditionalKnowledge: [
      "Historically associated with healing practices across North, East, and Southern Africa.",
      "Known as 'Gavakava' in Shona — used for skin cleansing and purification rituals.",
      "Ancient Egyptians called it the 'Plant of Immortality'; its knowledge spread south through trade routes.",
    ],
    traditionalUses: [
      "Traditionally used for burns, skin rashes, and wound healing by applying the gel directly.",
      "Reported traditional use as a digestive aid when sap is carefully processed.",
      "Historically applied to the scalp for hair care in many Southern African communities.",
      "Often used by communities for inflammation and sunburn relief.",
    ],
    safetyNotes: [
      "Contains anthraquinones — the yellow sap should not be consumed without preparation.",
      "May cause stomach discomfort or diarrhoea if ingested in large amounts.",
      "Not recommended during pregnancy; consult a practitioner before internal use.",
      "May interact with diabetes and blood-thinning medication.",
    ],
    ecology: [
      "Native to the Arabian Peninsula but naturalised widely across Africa in dry, rocky soils.",
      "Thrives in arid and semi-arid environments with well-drained soils and full sun.",
      "Supports pollinators including sunbirds and bees attracted to its tubular flowers.",
    ],
    conservation: [
      "Widely cultivated; not currently threatened in the wild.",
      "Sustainable harvesting of wild plants is encouraged to prevent over-collection.",
    ],
  },
  "moringa oleifera": {
    traditionalKnowledge: [
      "Known as the 'Miracle Tree' across sub-Saharan Africa for its nutritional density.",
      "Indigenous communities in East and West Africa have cultivated moringa for generations.",
      "Traditional healers use it as a general health tonic and nutritional supplement.",
    ],
    traditionalUses: [
      "Leaves traditionally dried and powdered to supplement nutrition during dry seasons.",
      "Seeds reportedly used for water purification in traditional water treatment.",
      "Leaf paste historically applied to minor skin infections.",
      "Often used by communities as a galactagogue (to support breast milk production).",
    ],
    safetyNotes: [
      "Leaves and pods are very safe for most people in normal food quantities.",
      "Root bark and root extracts may be toxic — avoid during pregnancy.",
      "High doses of root preparations have been historically used as abortifacients.",
      "Consult a practitioner for medicinal use beyond food quantities.",
    ],
    ecology: [
      "Fast-growing tree native to South Asia, now widespread across tropical Africa.",
      "Drought-tolerant; grows in poor soils making it vital in food-insecure regions.",
      "Provides shade, prevents erosion, and supports biodiversity in agroforestry systems.",
    ],
    conservation: [
      "Not threatened; widely cultivated across Africa.",
      "Promoted as a food security and nutrition crop by many African governments.",
    ],
  },
  "azadirachta indica": {
    traditionalKnowledge: [
      "Known as 'Mwarobaini' (Swahili for 'forty') — said to treat forty diseases.",
      "Widely used in West African traditional medicine for centuries.",
      "Neem twigs used as chewing sticks (miswak) for dental hygiene across Muslim communities in Africa.",
    ],
    traditionalUses: [
      "Leaf tea traditionally used for fever and malaria in Nigeria, Ghana, and Kenya.",
      "Bark decoction reported for stomach disorders and skin conditions.",
      "Leaves crushed and applied as insect repellent around homes and grain stores.",
      "Twigs historically used as toothbrushes with antimicrobial benefits.",
    ],
    safetyNotes: [
      "Toxic to children in high doses — never give neem oil or concentrated preparations internally to children.",
      "Not safe during pregnancy — may cause miscarriage.",
      "Dilute preparations only for external use; avoid contact with eyes.",
      "Use only short-term; prolonged internal use may affect the liver.",
    ],
    ecology: [
      "Native to South Asia; naturalised throughout tropical Africa.",
      "Fast-growing, drought-resistant tree providing shade in arid regions.",
      "Supports wildlife including birds and insects; seeds dispersed by bats and birds.",
    ],
    conservation: [
      "Not threatened; widely planted across Africa for shade and medicine.",
      "Promotes sustainable agroforestry when planted alongside crops.",
    ],
  },
  "aspalathus linearis": {
    traditionalKnowledge: [
      "Used for centuries by the indigenous Khoikhoi and San people of the Western Cape.",
      "Khoikhoi called it 'rooibos' (red bush) and drank it as a daily beverage.",
      "Introduced to wider South African use in the early 18th century through indigenous knowledge.",
    ],
    traditionalUses: [
      "Traditionally brewed as a soothing tea for colic and digestive complaints in infants.",
      "Nursing mothers historically drank rooibos tea to calm babies with colic.",
      "Reported traditional use for skin irritations, eczema, and sunburn as a wash.",
      "Often used by communities as a caffeine-free daily tonic for energy and wellbeing.",
    ],
    safetyNotes: [
      "Considered very safe for most people including children and pregnant women.",
      "Excessive consumption may theoretically affect iron absorption.",
      "Rare allergic reactions have been reported — discontinue if any reaction occurs.",
    ],
    ecology: [
      "Endemic to the Cederberg mountain region of South Africa's Western Cape.",
      "Grows only in nutrient-poor, acidic, sandy soils at altitude.",
      "Supports unique fynbos biodiversity; part of the Cape Floristic Region (a global biodiversity hotspot).",
    ],
    conservation: [
      "Listed as a fynbos species requiring careful management.",
      "Cultivated commercially to reduce pressure on wild populations.",
      "Sustainable farming practices are essential to protect the fynbos ecosystem.",
    ],
  },
  "hypoxis hemerocallidea": {
    traditionalKnowledge: [
      "One of the most widely sold medicinal plants in southern African traditional medicine markets.",
      "Used by Zulu, Sotho, and Tswana communities as an immune tonic for generations.",
      "Historically used for urinary tract conditions and prostate health by traditional healers.",
    ],
    traditionalUses: [
      "Corms traditionally boiled to make a medicinal tea for general wellness.",
      "Reported traditional use for urinary and prostate-related conditions.",
      "Historically used as a general vitality tonic during illness and recovery.",
    ],
    safetyNotes: [
      "Critically: interferes with antiretroviral (ARV) medication — do not combine without medical supervision.",
      "May significantly lower blood sugar — use with caution if diabetic.",
      "Not recommended during pregnancy or breastfeeding.",
      "Consult a qualified health practitioner before use alongside any medication.",
    ],
    ecology: [
      "Native to grasslands and open bushveld of southern Africa.",
      "Found in well-drained soils in KwaZulu-Natal, Limpopo, and Mpumalanga.",
      "Yellow star-shaped flowers attract insects and support grassland biodiversity.",
    ],
    conservation: [
      "Over-collection for the traditional medicine trade is a growing concern.",
      "Listed as a species under pressure in South Africa due to high commercial demand.",
      "Sustainable cultivation is strongly encouraged to protect wild populations.",
    ],
  },
  "adansonia digitata": {
    traditionalKnowledge: [
      "Called the 'Tree of Life' across sub-Saharan Africa for providing food, water, and shelter.",
      "Ancient baobabs are considered sacred in many African cultures and used as community meeting places.",
      "San people and other communities historically stored water in hollow baobab trunks.",
    ],
    traditionalUses: [
      "Fruit pulp dissolved in water as an electrolyte-rich, vitamin C drink.",
      "Seeds processed into cooking oil used across West and Central Africa.",
      "Leaves traditionally cooked as a nutritious vegetable similar to spinach.",
      "Bark fibre used for rope, baskets, and cloth in traditional craft production.",
    ],
    safetyNotes: [
      "Fruit pulp is very safe and nutritious; consume in moderation as part of a balanced diet.",
      "Excessive consumption may cause mild digestive upset in some individuals.",
      "Seed oil is safe for cooking and topical use.",
    ],
    ecology: [
      "Native to the African savanna; found across sub-Saharan Africa in dry woodlands.",
      "Provides critical habitat for birds, bats, reptiles, and small mammals in hollow trunks.",
      "Pollinated by bats; seeds dispersed by elephants and baboons.",
    ],
    conservation: [
      "Ancient baobab trees are dying at alarming rates, possibly linked to climate change.",
      "Protected in many African countries; should not be felled without permits.",
      "Sustainable harvesting of fruit only — bark stripping harms the tree significantly.",
    ],
  },
  "harpagophytum procumbens": {
    traditionalKnowledge: [
      "Traditional medicine of the San and Khoikhoi peoples of the Kalahari and Namib regions.",
      "Used for centuries to treat pain and digestive ailments across southern Africa.",
      "The tubers were crushed and applied as poultices in traditional wound care.",
    ],
    traditionalUses: [
      "Traditionally used as a bitter digestive tonic to stimulate appetite.",
      "Reported traditional use for joint pain, arthritis, and back pain by elder communities.",
      "Historically applied as a topical poultice for skin sores and boils.",
    ],
    safetyNotes: [
      "Avoid if taking blood-thinning medication (warfarin) — may increase bleeding risk.",
      "Not recommended during pregnancy — may stimulate uterine contractions.",
      "Avoid with peptic ulcers or gallstones.",
      "Can interact with heart medication — consult a doctor before use.",
    ],
    ecology: [
      "Native to the dry savannas and grasslands of southern Africa.",
      "Found in Botswana, Namibia, South Africa, and Zimbabwe in sandy, well-drained soils.",
      "Produces distinctive hooked fruit (the 'claw') dispersed by attaching to animal fur.",
    ],
    conservation: [
      "Listed as a species under pressure due to high international commercial demand.",
      "Wild harvesting is regulated in Namibia and Botswana.",
      "Cultivation is encouraged to reduce pressure on wild populations.",
    ],
  },
  "artemisia afra": {
    traditionalKnowledge: [
      "The most widely used medicinal plant in southern Africa across many cultures.",
      "Used by Zulu, Xhosa, Sotho, Afrikaans, and Khoikhoi communities for generations.",
      "Traditionally known as 'umhlonyane' — one of the first plants used during illness.",
    ],
    traditionalUses: [
      "Steam inhalation from boiling leaves traditionally used for colds, flu, and chest infections.",
      "Leaf tea historically used for fever, malaria-like symptoms, and body aches.",
      "Reported traditional use for headaches and sinus congestion.",
      "Leaves placed under pillows or near the bed for respiratory support during illness.",
    ],
    safetyNotes: [
      "Not safe during pregnancy — may stimulate uterine contractions.",
      "Do not use for extended periods — limit to short-term use during acute illness.",
      "Thujone content may be toxic in very high doses — use as instructed by a practitioner.",
    ],
    ecology: [
      "Native to highland grasslands and fynbos of southern Africa.",
      "Aromatic shrub that thrives in disturbed soils and roadsides up to high altitudes.",
      "Strong scent deters many insects; supports bees and other pollinators.",
    ],
    conservation: [
      "Widespread and not currently threatened.",
      "High demand in traditional medicine markets — sustainable harvesting is encouraged.",
      "Can be easily cultivated in home gardens.",
    ],
  },
  "agathosma betulina": {
    traditionalKnowledge: [
      "Used by the Khoikhoi people of the Western Cape long before European contact.",
      "Khoikhoi rubbed buchu leaves on their bodies as perfume and for spiritual protection.",
      "Dutch settlers adopted buchu from indigenous knowledge and exported it to Europe as early as the 1650s.",
    ],
    traditionalUses: [
      "Traditionally infused in brandy or vinegar as a urinary tract remedy.",
      "Reported traditional use for kidney and bladder infections.",
      "Historically used as an insect repellent rubbed directly onto the skin.",
      "Leaf poultice applied traditionally for rheumatism and joint pain.",
    ],
    safetyNotes: [
      "Avoid during pregnancy — may stimulate uterine contractions.",
      "Not recommended for people with kidney disease — may irritate the kidneys.",
      "Do not use with blood-thinning medication.",
      "Use only short-term; prolonged use may cause liver stress.",
    ],
    ecology: [
      "Endemic to the fynbos biome of the Western Cape, South Africa.",
      "Grows on mountain slopes in nutrient-poor, acidic, well-drained soils.",
      "Part of the Cape Floristic Region — one of the world's most biodiverse areas.",
    ],
    conservation: [
      "Some Agathosma species are threatened by habitat loss and over-harvesting.",
      "Commercially cultivated to reduce pressure on wild fynbos populations.",
      "Protected under South African biodiversity legislation.",
    ],
  },
  "sutherlandia frutescens": {
    traditionalKnowledge: [
      "Used by Khoikhoi, Cape Malay, and Afrikaner communities across South Africa.",
      "Known as 'kankerbos' (cancer bush) for its traditional role in supporting seriously ill patients.",
      "Traditional healers use it as a broad-spectrum tonic for debilitating conditions.",
    ],
    traditionalUses: [
      "Historically used as a general adaptogen — to help the body manage stress and illness.",
      "Reported traditional use as an immune tonic for chronic and debilitating conditions.",
      "Leaf tea historically used for digestive complaints and stomach ulcers.",
      "Often used by communities to restore appetite and strength during recovery.",
    ],
    safetyNotes: [
      "May interact with ARV (antiretroviral) medication — do not use without medical supervision if HIV positive.",
      "May significantly lower blood sugar — monitor blood glucose if diabetic.",
      "Avoid during pregnancy and breastfeeding.",
      "Interact with immunosuppressant drugs — consult a doctor.",
    ],
    ecology: [
      "Native to the dry regions of South Africa including the Karoo and fynbos.",
      "Drought-tolerant shrub found in disturbed soils, roadsides, and semi-arid habitats.",
      "Bright red-orange flowers attract sunbirds; seeds in inflated pods dispersed by wind.",
    ],
    conservation: [
      "Widespread and not currently threatened.",
      "Sustainable harvesting encouraged due to growing commercial interest.",
      "Easily cultivated in home gardens as a medicinal and ornamental plant.",
    ],
  },
  "aloe ferox": {
    traditionalKnowledge: [
      "Harvested for centuries in the Eastern and Western Cape of South Africa.",
      "The bitter sap ('cape aloe') was historically collected into clay pots and sun-dried into blocks for trade.",
      "Widely used in Zulu, Xhosa, and Afrikaner folk medicine for internal cleansing.",
    ],
    traditionalUses: [
      "Dried bitter sap (aloin) traditionally used in small amounts as a laxative.",
      "External gel applied to burns, skin irritations, and insect bites.",
      "Historically used in compresses for arthritic and inflamed joints.",
    ],
    safetyNotes: [
      "Strong laxative — do not use more than the smallest effective dose.",
      "Not for pregnant women — may stimulate uterine contractions.",
      "Not for people with inflammatory bowel conditions.",
      "Prolonged internal use not recommended — short-term use only.",
    ],
    ecology: [
      "Native to the Eastern Cape, KwaZulu-Natal, and Lesotho highlands of South Africa.",
      "Grows in rocky, well-drained soils in grassland and bushveld.",
      "Flowers in winter providing critical nectar for sunbirds during cold months.",
    ],
    conservation: [
      "Commercially harvested; regulated under South African law.",
      "Wild populations are monitored but not currently endangered.",
      "Cultivation is preferred over wild harvesting to ensure sustainability.",
    ],
  },
  "acacia xanthophloea": {
    traditionalKnowledge: [
      "Named 'fever tree' by early settlers who associated it with malaria in low-lying swampy areas.",
      "Used by Zulu, Swazi, and Tsonga traditional healers for fever treatment.",
      "Sacred tree in some southern African cultures; associated with water and healing.",
    ],
    traditionalUses: [
      "Bark decoction traditionally used for fever, malaria symptoms, and body aches.",
      "Bark wash historically used as an eye treatment for conjunctivitis.",
      "Gum from the tree used as a food supplement in times of scarcity.",
    ],
    safetyNotes: [
      "Use diluted bark decoctions only — concentrated preparations may irritate the stomach.",
      "Not a substitute for modern malaria treatment.",
      "Consult a practitioner before internal use.",
    ],
    ecology: [
      "Found near rivers, floodplains, and wetlands across eastern and southern Africa.",
      "Distinctive yellow-green bark is diagnostic; provides habitat for weaver birds.",
      "Important species in riparian woodland ecosystems supporting high biodiversity.",
    ],
    conservation: [
      "Not currently threatened but sensitive to wetland drainage and habitat loss.",
      "Important for stabilising riverbanks; should not be harvested in quantity.",
    ],
  },
  "sclerocarya birrea": {
    traditionalKnowledge: [
      "Called 'umGanu' in Zulu and 'Mahobohobo' in Shona — a tree of deep cultural significance.",
      "Fruit traditionally harvested communally with associated cultural practices and ceremonies.",
      "Bark used by Venda and Tsonga traditional healers for fever, malaria, and skin conditions.",
    ],
    traditionalUses: [
      "Fruit traditionally eaten fresh and fermented into marula beer in communal celebrations.",
      "Kernel oil historically pressed and used for skin moisturising and hair care.",
      "Bark decoction reported for fever, diarrhoea, and as a prophylactic in malaria season.",
      "Leaves traditionally used in steam baths for body cleansing.",
    ],
    safetyNotes: [
      "Fermented marula juice is highly alcoholic — consume in moderation.",
      "Bark tea should be taken in moderation; excess may irritate the stomach.",
      "Kernel oil is very safe for topical use.",
    ],
    ecology: [
      "Native to the Miombo woodlands and savannas of southern and eastern Africa.",
      "Large deciduous tree; fruit eaten by elephants, baboons, and many other species.",
      "Keystone species in savanna ecosystems providing food and shelter for wildlife.",
    ],
    conservation: [
      "Not currently threatened; widespread across its range.",
      "Important for community livelihoods — sustainable harvesting is economically valuable.",
      "Elephants are major seed dispersers; protecting elephant populations supports marula.",
    ],
  },
  "tulbaghia violacea": {
    traditionalKnowledge: [
      "Used by Zulu healers as 'umagaq' — a protective and medicinal plant.",
      "Historically grown around homesteads as both food, medicine, and insect repellent.",
      "Leaves rubbed on the body were traditionally believed to deter snakes.",
    ],
    traditionalUses: [
      "Bulbs and leaves traditionally eaten raw or cooked to support immune health.",
      "Reported traditional use for sinusitis, colds, and respiratory infections.",
      "Historically used for blood pressure management by elder communities.",
      "Leaves crushed and rubbed on the body as a mosquito and insect repellent.",
    ],
    safetyNotes: [
      "May cause stomach upset if eaten raw in large quantities.",
      "Mild blood-thinning effect — use with caution alongside anticoagulant medication.",
      "Generally very safe as a food plant in normal culinary amounts.",
    ],
    ecology: [
      "Native to the eastern regions of South Africa including KwaZulu-Natal and Eastern Cape.",
      "Grows in grasslands and rocky slopes; adaptable to garden cultivation.",
      "Purple flowers attract bees and butterflies; supports garden pollinator populations.",
    ],
    conservation: [
      "Widely cultivated; not threatened in the wild.",
      "Easy to grow in home gardens providing both food and medicinal benefits.",
    ],
  },
  "momordica charantia": {
    traditionalKnowledge: [
      "Widely used in both West African and East African traditional medicine.",
      "Indigenous communities in Uganda, Nigeria, and Kenya use it for blood sugar management.",
      "Brought to Africa through trade routes; integrated into traditional healing knowledge.",
    ],
    traditionalUses: [
      "Young fruit traditionally cooked as a bitter vegetable to support digestive health.",
      "Leaf tea reported to be used for diabetes management across East and West Africa.",
      "Seeds historically used as a natural deworming agent in children.",
      "Topical leaf application reported for skin infections and rashes.",
    ],
    safetyNotes: [
      "Significant hypoglycaemic effect — may lower blood sugar substantially; monitor carefully.",
      "Not safe during pregnancy — may cause premature contractions.",
      "Seeds are toxic to young children — keep away from children.",
      "Use with caution alongside diabetes medication — risk of very low blood sugar.",
    ],
    ecology: [
      "Tropical vine native to Asia; widely naturalised across tropical Africa.",
      "Grows in disturbed soils, roadsides, and garden environments.",
      "Supports insects with nectar-rich flowers; fruit eaten by birds.",
    ],
    conservation: [
      "Not threatened; widely naturalised.",
      "Grown as a food and medicinal plant in home gardens across Africa.",
    ],
  },
  "ocimum gratissimum": {
    traditionalKnowledge: [
      "Known as 'Efirin' or 'Nchanwu' — a culturally significant herb in West Africa.",
      "Sacred to some Yoruba traditions; used in both culinary and ritual contexts.",
      "Indigenous communities across West Africa have cultivated it for generations.",
    ],
    traditionalUses: [
      "Fresh leaves used extensively in West African soups and stews.",
      "Leaf tea traditionally used for fever, cold, and respiratory infections in Nigeria.",
      "Reported traditional use for malaria symptoms and general body aches.",
      "Leaves applied topically for skin infections and minor wounds.",
    ],
    safetyNotes: [
      "Culinary use of leaves is very safe.",
      "Concentrated essential oil should not be used during pregnancy.",
      "Essential oil can irritate skin — always dilute before topical application.",
    ],
    ecology: [
      "Native to tropical and subtropical Africa; widely cultivated.",
      "Grows in disturbed soils, garden edges, and near human settlements.",
      "Strong aromatic compounds deter some insects while attracting pollinators.",
    ],
    conservation: [
      "Widespread and not threatened.",
      "Promoted as a sustainable herb for food security and traditional medicine.",
    ],
  },
  "carica papaya": {
    traditionalKnowledge: [
      "Integrated into traditional medicine knowledge across East, West, and Central Africa.",
      "Indigenous communities use virtually every part: fruit, seeds, leaves, and latex.",
      "Considered a 'whole pharmacy tree' in some African traditional knowledge systems.",
    ],
    traditionalUses: [
      "Seeds traditionally used as a natural dewormer across sub-Saharan Africa.",
      "Leaves crushed and applied to wounds to speed healing and reduce infection.",
      "Ripe fruit traditionally eaten for digestive support and as a nutritious food.",
      "Unripe latex historically applied to skin parasites and fungal infections.",
    ],
    safetyNotes: [
      "Unripe papaya and latex are not safe during pregnancy — may cause contractions.",
      "Seeds in excess may be harmful — use in small amounts only for deworming.",
      "Papain enzyme may cause allergic reactions in sensitive individuals.",
    ],
    ecology: [
      "Believed native to Central America; now widespread across tropical Africa.",
      "Fast-growing tree of disturbed and cultivated land near human settlements.",
      "Fruit eaten by birds and mammals; supports wildlife in agricultural landscapes.",
    ],
    conservation: [
      "Widely cultivated; not threatened.",
      "Important food security crop across sub-Saharan Africa.",
    ],
  },
  "hibiscus sabdariffa": {
    traditionalKnowledge: [
      "Known as 'Zobo' in Nigeria and 'Bissap' in Senegal — a drink of deep cultural identity.",
      "Served at celebrations and ceremonies across West Africa for generations.",
      "Documented in traditional medicine in Egypt, Sudan, and across the Sahel.",
    ],
    traditionalUses: [
      "Calyces brewed into a tart, vitamin-rich tea — consumed daily across West Africa.",
      "Reported traditional use for blood pressure management and heart health.",
      "Traditionally used for liver health and as a general digestive tonic.",
      "Leaves cooked as a vegetable in Senegal, Mali, and Nigeria.",
    ],
    safetyNotes: [
      "May lower blood pressure — use with caution alongside antihypertensive medication.",
      "May interact with acetaminophen (paracetamol) and chloroquine absorption.",
      "Generally very safe in normal tea amounts.",
    ],
    ecology: [
      "Native to West Africa and Southeast Asia; widely cultivated across tropical Africa.",
      "Grows in warm, humid environments with well-drained soils.",
      "Flowers attract bees and butterflies; seeds dispersed by birds.",
    ],
    conservation: [
      "Widely cultivated; not threatened.",
      "Important cash crop for smallholder farmers across the Sahel.",
    ],
  },
  "leonotis leonurus": {
    traditionalKnowledge: [
      "Used by Khoikhoi, Zulu, and Xhosa healers for skin and venom-related conditions.",
      "Associated with traditional healing ceremonies in some Southern African cultures.",
      "Leaves were smoked ceremonially by some Khoikhoi communities.",
    ],
    traditionalUses: [
      "Leaf decoction traditionally used for skin rashes, eczema, and itching.",
      "Reported traditional use for headaches and as a relaxant.",
      "Bark and leaf preparations historically applied to snake bites and bee stings.",
    ],
    safetyNotes: [
      "Mildly psychoactive in high doses — not for children, pregnant women, or those with mental health conditions.",
      "Do not use in large quantities — risk of dizziness and nausea.",
      "Avoid combining with other sedative substances.",
    ],
    ecology: [
      "Native to the grasslands and roadsides of southern Africa.",
      "Prolific orange flowers are a key nectar source for sunbirds in winter.",
      "Drought-tolerant shrub that supports biodiversity in degraded landscapes.",
    ],
    conservation: [
      "Common and widespread; not threatened.",
      "Easy to cultivate as a garden plant with high wildlife value.",
    ],
  },
  "laportea aestuans": {
    traditionalKnowledge: [
      "Used in West African traditional medicine for joint pain and fever.",
      "Known in Yoruba tradition as 'Esisi' — used carefully by experienced practitioners.",
      "The stinging property is understood in traditional knowledge to have therapeutic potential.",
    ],
    traditionalUses: [
      "Dried leaves boiled and used as a tea for rheumatism and joint pain.",
      "Leaf poultice (after cooking) applied externally for inflammation and swelling.",
      "Reported traditional use as a urinary tract support preparation.",
    ],
    safetyNotes: [
      "Fresh plant causes immediate skin stinging and irritation — always handle with gloves.",
      "Only cooked or dried plant material should be used — never apply fresh leaves to skin.",
      "Not for internal use without guidance from an experienced traditional practitioner.",
    ],
    ecology: [
      "Native to tropical Africa; found in forest margins, disturbed soils, and near water.",
      "Fast-growing annual weed in moist, shaded environments.",
      "Provides ground cover and supports soil moisture retention in forest edges.",
    ],
    conservation: [
      "Common and not threatened.",
      "Often considered a garden weed but has documented traditional value.",
    ],
  },
};

export function findLocalKnowledge(
  nameCommon: string,
  nameScientific: string
): LocalPlantKnowledge | null {
  const sciKey = nameScientific.toLowerCase().trim();
  if (knowledgeMap[sciKey]) return knowledgeMap[sciKey];

  // Partial match on scientific name (genus + species)
  const parts = sciKey.split(" ").slice(0, 2).join(" ");
  const partialMatch = Object.keys(knowledgeMap).find((k) => k.startsWith(parts));
  if (partialMatch) return knowledgeMap[partialMatch];

  return null;
}
