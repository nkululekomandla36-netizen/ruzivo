export interface LocalPlantKnowledge {
  traditionalKnowledge: string[];
  traditionalUses: string[];
  safetyNotes: string[];
  ecology: string[];
  conservation: string[];
  nutritionalProfile: string[];
  activeCompounds: string[];
  healthBenefits: string[];
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
    nutritionalProfile: [
      "Vitamins: A, C, E, and B-12 present in the gel — antioxidant vitamin profile.",
      "Minerals: calcium, magnesium, zinc, selenium, and chromium found in gel.",
      "Fiber: contains mucilaginous polysaccharides including acemannan — a prebiotic compound.",
      "Protein: small amounts of amino acids including lysine, threonine, and isoleucine.",
    ],
    activeCompounds: [
      "Flavonoids: antioxidant flavonoids including quercetin and apigenin in leaf extract.",
      "Alkaloids: barbaloin (an anthraquinone glycoside) concentrated in the yellow latex.",
      "Tannins: present in the leaf skin contributing to astringent properties.",
      "Saponins: cleansing saponins found throughout the leaf with antimicrobial properties.",
      "Polyphenols: phenolic compounds contribute significantly to antioxidant activity.",
      "Terpenoids: campesterol and β-sitosterol identified — plant sterols in the gel.",
    ],
    healthBenefits: [
      "Contains compounds associated with soothing skin irritation and supporting wound healing.",
      "Traditionally used for digestive comfort; research suggests acemannan may support gut lining health.",
      "Contains antioxidant vitamins associated with skin health and immune system support.",
      "Research suggests anti-inflammatory properties linked to anthraquinone and polyphenol content.",
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
    nutritionalProfile: [
      "Vitamins: extraordinarily rich in vitamin C (7× oranges), vitamin A, and vitamin E.",
      "Minerals: high iron (3× spinach), calcium (4× milk), and potassium content in leaves.",
      "Fiber: leaves contain significant dietary fiber supporting digestive health.",
      "Protein: leaves contain ~9g protein per 100g — one of the highest plant protein densities.",
    ],
    activeCompounds: [
      "Flavonoids: quercetin, kaempferol, and rutin — potent antioxidant flavonoids.",
      "Alkaloids: moringine and moringinine identified in bark and roots.",
      "Tannins: condensed tannins present contributing to astringent properties.",
      "Saponins: saponins in seeds contribute to natural water-clarifying properties.",
      "Polyphenols: chlorogenic acid and caffeic acid — well-studied antioxidant polyphenols.",
      "Terpenoids: β-sitosterol and other phytosterols identified in seed oil.",
    ],
    healthBenefits: [
      "Contains compounds associated with antioxidant protection due to exceptionally high vitamin C and polyphenol content.",
      "Traditionally used for nutritional support during illness and recovery; research suggests anti-inflammatory properties.",
      "Research suggests isothiocyanates in moringa may support healthy blood sugar regulation.",
      "Contains iron and folate associated with supporting healthy blood formation.",
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
    nutritionalProfile: [
      "Vitamins: leaves contain vitamins A, C, and E; used as a vegetable in some communities.",
      "Minerals: calcium, phosphorus, and iron present in leaves.",
      "Fiber: neem leaves contain dietary fiber when used as food.",
      "Protein: moderate amino acid content in leaves; seeds are high in fatty acids.",
    ],
    activeCompounds: [
      "Flavonoids: quercetin and kaempferol — antioxidant flavonoids throughout the plant.",
      "Alkaloids: nimbolide and gedunin — bioactive limonoid alkaloids in leaves and seeds.",
      "Tannins: gallic and ellagic acid tannins with astringent properties.",
      "Saponins: nimbioside saponins contribute to the plant's antimicrobial properties.",
      "Polyphenols: caffeic acid and chlorogenic acid identified in leaf extracts.",
      "Terpenoids: azadirachtin — the primary insecticidal terpenoid; nimbin and nimbidin.",
    ],
    healthBenefits: [
      "Contains compounds associated with antimicrobial activity; traditionally used for skin and dental hygiene.",
      "Azadirachtin and related terpenoids are associated with natural pest-repellent properties.",
      "Traditionally used for fever management; research suggests antipyretic compounds in leaves.",
      "Contains compounds associated with anti-inflammatory activity in traditional medicine use.",
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
    nutritionalProfile: [
      "Vitamins: naturally caffeine-free; contains trace amounts of vitamin C when fresh.",
      "Minerals: iron, calcium, potassium, copper, zinc, and manganese in brewed tea.",
      "Fiber: brewed tea is essentially fiber-free; consumed as a beverage.",
      "Protein: negligible protein content — valued for phytochemicals rather than macronutrients.",
    ],
    activeCompounds: [
      "Flavonoids: aspalathin — unique to rooibos; nothofagin and quercetin also present.",
      "Alkaloids: caffeine-free — notable absence distinguishes rooibos from other teas.",
      "Tannins: very low tannin content compared to black or green tea.",
      "Saponins: trace saponins present with mild anti-inflammatory properties.",
      "Polyphenols: over 30 identified polyphenols; aspalathin is the primary bioactive compound.",
      "Terpenoids: alpha-lipoic acid and other terpenoids identified in leaf extracts.",
    ],
    healthBenefits: [
      "Contains aspalathin — a unique flavonoid associated with antioxidant activity and research into blood sugar support.",
      "Research suggests polyphenol content associated with cardiovascular health support.",
      "Traditionally used for digestive comfort; contains compounds associated with soothing gut irritation.",
      "Caffeine-free profile makes it traditionally valued for relaxation and sleep support.",
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
    nutritionalProfile: [
      "Vitamins: limited nutritional data available; corms consumed medicinally, not as food.",
      "Minerals: contains phytosterols and sterolin as primary bioactive constituents.",
      "Fiber: corm starch provides dietary fiber when processed.",
      "Protein: minor protein content; not considered a food source.",
    ],
    activeCompounds: [
      "Flavonoids: hypoxoside — the unique beta-glucoside precursor compound specific to Hypoxis.",
      "Alkaloids: trace alkaloids present in corm tissue.",
      "Tannins: condensed tannins present in corm extracts.",
      "Saponins: sterolins (sitosterol beta-glucoside) — the primary bioactive saponin compounds.",
      "Polyphenols: phenolic compounds contribute to antioxidant activity.",
      "Terpenoids: beta-sitosterol — a plant sterol with documented biological activity.",
    ],
    healthBenefits: [
      "Contains hypoxoside — converted to rooperol in the body; research suggests antioxidant associations.",
      "Traditionally used as an immune tonic; compounds associated with immune system modulation.",
      "Beta-sitosterol content associated with prostate health support in research literature.",
      "Research suggests anti-inflammatory properties linked to sterol and polyphenol content.",
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
    nutritionalProfile: [
      "Vitamins: fruit pulp contains 6× more vitamin C than oranges; also vitamins B1, B2, and B6.",
      "Minerals: exceptionally high calcium (twice that of milk), potassium, and magnesium in pulp.",
      "Fiber: very high dietary fiber — among the highest of any fruit (approx. 44% dry weight).",
      "Protein: seeds and leaves contain significant protein; seed oil is rich in linoleic acid.",
    ],
    activeCompounds: [
      "Flavonoids: quercetin, kaempferol, and luteolin identified in bark and leaf extracts.",
      "Alkaloids: trace alkaloids including adenosine derivatives in bark.",
      "Tannins: condensed tannins in bark with astringent properties.",
      "Saponins: triterpenoid saponins in bark — contribute to traditional medicinal uses.",
      "Polyphenols: rich polyphenol profile in pulp; contributes to very high antioxidant capacity.",
      "Terpenoids: ursolic acid and betulinic acid — bioactive triterpenes in bark.",
    ],
    healthBenefits: [
      "Contains exceptionally high vitamin C associated with immune system support and antioxidant protection.",
      "High calcium and phosphorus content associated with bone health support.",
      "Prebiotic fiber content traditionally associated with digestive health; research supports gut microbiome benefits.",
      "Research suggests polyphenol content linked to high antioxidant capacity comparable to superfruits.",
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
    nutritionalProfile: [
      "Vitamins: not a significant dietary source; consumed medicinally in small amounts.",
      "Minerals: contains trace iron and magnesium in tuber extracts.",
      "Fiber: tubers contain inulin — a prebiotic dietary fiber.",
      "Protein: limited protein content; tubers are primarily used for phytochemical value.",
    ],
    activeCompounds: [
      "Flavonoids: kaempferol and luteolin — antioxidant flavonoids in tuber extracts.",
      "Alkaloids: not significantly present; considered relatively alkaloid-free.",
      "Tannins: tannins present contributing to bitter digestive tonic properties.",
      "Saponins: triterpenoid saponins in secondary tubers.",
      "Polyphenols: acteoside (verbascoside) — a potent phenylpropanoid glycoside.",
      "Terpenoids: harpagoside and harpagide — the primary bioactive iridoid glycosides.",
    ],
    healthBenefits: [
      "Harpagoside content associated with anti-inflammatory activity; research supports traditional use for joint comfort.",
      "Traditionally used for back and joint pain; multiple clinical studies suggest analgesic associations.",
      "Contains bitter compounds associated with digestive stimulation and appetite support.",
      "Research suggests harpagide may be associated with muscle relaxant properties.",
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
    nutritionalProfile: [
      "Vitamins: not consumed as a food source; used as a medicinal tea or steam inhalation.",
      "Minerals: trace mineral content; consumed in very small medicinal amounts.",
      "Fiber: minimal fiber intake from tea preparations.",
      "Protein: negligible protein content; value lies in volatile oil phytochemicals.",
    ],
    activeCompounds: [
      "Flavonoids: artemetin and cirsilineol — polymethoxylated flavonoids in leaves.",
      "Alkaloids: trace alkaloid content.",
      "Tannins: condensed tannins present in leaf extracts.",
      "Saponins: trace saponins found in plant extracts.",
      "Polyphenols: caffeic acid derivatives and chlorogenic acid identified.",
      "Terpenoids: thujone, camphor, and α-terpineol — the primary volatile terpenoids in essential oil.",
    ],
    healthBenefits: [
      "Traditionally used for respiratory support; contains volatile terpenoids associated with airways.",
      "Contains compounds associated with antipyretic (fever-reducing) properties in traditional use.",
      "Research suggests camphor and terpineol content linked to decongestant and antimicrobial associations.",
      "Contains anti-inflammatory polyphenols traditionally associated with relief from body aches.",
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
    nutritionalProfile: [
      "Vitamins: not consumed as a food source; used medicinally in small amounts.",
      "Minerals: trace mineral content in leaf preparations.",
      "Fiber: negligible dietary fiber in tea or extract form.",
      "Protein: no significant protein content; value is in essential oil compounds.",
    ],
    activeCompounds: [
      "Flavonoids: diosmin and hesperidin — flavonoid glycosides with vascular associations.",
      "Alkaloids: trace alkaloids not significantly present.",
      "Tannins: condensed tannins contribute to astringent urinary tract properties.",
      "Saponins: trace saponins in leaf extracts.",
      "Polyphenols: rutin and quercetin glycosides identified in leaf extracts.",
      "Terpenoids: diosphenol (the primary bioactive terpenoid), pulegone, and isomenthone in essential oil.",
    ],
    healthBenefits: [
      "Contains diosphenol — traditionally associated with urinary tract support; linked to diuretic properties.",
      "Traditionally used for urinary health; research suggests antimicrobial associations relevant to urinary tract.",
      "Flavonoid diosmin associated with vascular health and capillary support in research.",
      "Contains compounds associated with anti-inflammatory activity supporting traditional joint use.",
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
    nutritionalProfile: [
      "Vitamins: used medicinally; not a significant dietary food source.",
      "Minerals: trace minerals in leaf extracts.",
      "Fiber: minimal fiber intake from tea preparations.",
      "Protein: contains pinitol and GABA as notable non-protein amino acid compounds.",
    ],
    activeCompounds: [
      "Flavonoids: SU1 (a unique flavonoid glycoside) and kaempferol glycosides identified.",
      "Alkaloids: trace alkaloids; not alkaloid-rich.",
      "Tannins: condensed tannins with astringent properties in leaves.",
      "Saponins: oleanolic acid saponins — anti-inflammatory triterpenoid saponins.",
      "Polyphenols: caffeic acid and chlorogenic acid identified in leaf extracts.",
      "Terpenoids: lupeol and beta-sitosterol — bioactive triterpenoids and sterols.",
    ],
    healthBenefits: [
      "Contains GABA (gamma-aminobutyric acid) associated with calming effects and stress adaptation.",
      "Pinitol content associated with blood sugar modulation; traditionally used to restore appetite.",
      "Research suggests oleanolic acid saponins linked to anti-inflammatory and immune-modulating associations.",
      "Traditionally used as an adaptogenic tonic; compounds associated with supporting the body under physical stress.",
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
    nutritionalProfile: [
      "Vitamins: gel contains vitamins C, E, and B-complex; aloin-rich latex is medicinal not nutritional.",
      "Minerals: calcium, magnesium, and zinc present in the gel fraction.",
      "Fiber: contains acemannan and other mucilaginous polysaccharides.",
      "Protein: amino acids including arginine, serine, and glycine found in gel.",
    ],
    activeCompounds: [
      "Flavonoids: antioxidant flavonoids including isorabaiochrome unique to Aloe ferox.",
      "Alkaloids: aloin A and aloin B — hydroxyanthracene anthraquinone glycosides.",
      "Tannins: catechin tannins present in leaf skin extracts.",
      "Saponins: saponins with cleansing properties throughout the leaf.",
      "Polyphenols: feroxidin and other phenolic compounds unique to this species.",
      "Terpenoids: beta-sitosterol and lophenol sterols in the gel.",
    ],
    healthBenefits: [
      "Aloin content associated with stimulant laxative properties; traditionally used for digestive cleansing.",
      "Gel compounds associated with wound healing and skin soothing — research supports topical use.",
      "Contains antioxidant flavonoids associated with protection from oxidative stress.",
      "Traditionally used for joint support; compounds associated with anti-inflammatory activity.",
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
    nutritionalProfile: [
      "Vitamins: gum arabic (acacia gum) contains trace B vitamins.",
      "Minerals: bark and gum contain calcium and magnesium.",
      "Fiber: gum arabic is a soluble dietary fiber and prebiotic.",
      "Protein: gum contains glycoproteins — the arabinogalactan-protein complex.",
    ],
    activeCompounds: [
      "Flavonoids: luteolin and quercetin derivatives identified in bark and leaf extracts.",
      "Alkaloids: trace alkaloids including tyramine derivatives in bark.",
      "Tannins: condensed and hydrolysable tannins — high astringent content in bark.",
      "Saponins: triterpenoid saponins in bark with antimicrobial properties.",
      "Polyphenols: gallic acid and ellagic acid polyphenols — high antioxidant activity.",
      "Terpenoids: ursolic acid and betulin — bioactive triterpenoids in bark.",
    ],
    healthBenefits: [
      "Contains compounds associated with antipyretic properties; traditionally used for fever support.",
      "Gum arabic is a prebiotic fiber associated with supporting beneficial gut bacteria.",
      "Bark tannins associated with antimicrobial properties relevant to traditional wound and eye use.",
      "Research suggests polyphenol content linked to antioxidant and anti-inflammatory associations.",
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
    nutritionalProfile: [
      "Vitamins: fruit is exceptionally rich in vitamin C — 8× the content of oranges.",
      "Minerals: kernel contains significant iron, zinc, magnesium, copper, and phosphorus.",
      "Fiber: fruit pulp contains dietary fiber; kernels are fiber-rich.",
      "Protein: kernels contain 28% protein and 57% oil — a complete protein and fat source.",
    ],
    activeCompounds: [
      "Flavonoids: catechin, quercetin, and procyanidins — antioxidant flavonoids in fruit and bark.",
      "Alkaloids: trace alkaloids in bark extracts.",
      "Tannins: condensed tannins in bark — astringent antimicrobial properties.",
      "Saponins: triterpenoid saponins in bark with anti-inflammatory associations.",
      "Polyphenols: gallic acid and ellagic acid polyphenols in fruit skin — high antioxidant ORAC value.",
      "Terpenoids: lupeol and beta-amyrin — bioactive triterpenes in bark.",
    ],
    healthBenefits: [
      "Exceptionally high vitamin C content associated with immune support and antioxidant protection.",
      "Kernel oil contains oleic acid (70%) associated with skin barrier support and moisturisation.",
      "Contains polyphenols associated with anti-inflammatory activity; bark traditionally used for fever.",
      "Kernel protein provides all essential amino acids — associated with muscle and tissue support.",
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
    nutritionalProfile: [
      "Vitamins: contains vitamin C, and B vitamins similar to other allium species.",
      "Minerals: sulfur compounds, selenium, calcium, and potassium present in bulb and leaves.",
      "Fiber: bulb contains dietary fiber and inulin — a prebiotic compound.",
      "Protein: moderate amino acid content; similar nutritional profile to garlic.",
    ],
    activeCompounds: [
      "Flavonoids: kaempferol and quercetin glycosides — antioxidant flavonoids.",
      "Alkaloids: not significantly alkaloid-rich.",
      "Tannins: trace tannins present.",
      "Saponins: steroidal saponins with antimicrobial associations.",
      "Polyphenols: ferulic acid and caffeic acid derivatives identified.",
      "Terpenoids: marasmicin and tulbaghialin — sulfur-containing terpenoid compounds unique to this species.",
    ],
    healthBenefits: [
      "Contains sulfur compounds associated with cardiovascular support; traditionally used for blood pressure.",
      "Allicin-like compounds associated with antimicrobial properties relevant to respiratory use.",
      "Research suggests organosulfur compounds linked to antifungal and antibacterial associations.",
      "Contains antioxidant flavonoids associated with general cellular protection.",
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
    nutritionalProfile: [
      "Vitamins: high vitamin C (twice the content of broccoli); also vitamins A, B1, B2, and folate.",
      "Minerals: significant iron, zinc, potassium, calcium, and phosphorus in fruit and leaves.",
      "Fiber: high dietary fiber content — approximately 2.8g per 100g of fresh fruit.",
      "Protein: leaves contain approximately 3.1g protein per 100g — a useful vegetable protein.",
    ],
    activeCompounds: [
      "Flavonoids: momordicin and catechin — bitter flavonoids contributing to the characteristic taste.",
      "Alkaloids: momordicine alkaloids — the primary bitter compounds in fruit and seeds.",
      "Tannins: condensed tannins contributing to astringent properties.",
      "Saponins: charantin — a steroidal saponin mixture associated with blood sugar research.",
      "Polyphenols: gallic acid, caffeic acid — antioxidant polyphenols in fruit.",
      "Terpenoids: cucurbitacins and momordicosides — bitter triterpenoid glycosides.",
    ],
    healthBenefits: [
      "Charantin and polypeptide-P are associated with blood sugar modulation; traditionally used for diabetes support.",
      "Research suggests compounds associated with insulin-like activity in multiple published studies.",
      "Contains antioxidant vitamins C and A associated with immune support and cellular protection.",
      "Traditionally used for digestive health; bitter compounds associated with digestive enzyme stimulation.",
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
    nutritionalProfile: [
      "Vitamins: high vitamin A (β-carotene), vitamin C, and vitamin K in fresh leaves.",
      "Minerals: significant calcium, iron, magnesium, and potassium content.",
      "Fiber: good dietary fiber content as a leafy herb.",
      "Protein: approximately 3.7g protein per 100g of fresh leaves — useful leafy vegetable protein.",
    ],
    activeCompounds: [
      "Flavonoids: orientin, vitexin, and luteolin — antioxidant flavonoids in leaves.",
      "Alkaloids: trace alkaloids not significantly present.",
      "Tannins: condensed tannins with antimicrobial properties.",
      "Saponins: ursolic acid saponins with anti-inflammatory associations.",
      "Polyphenols: rosmarinic acid — a potent antioxidant polyphenol present in high concentrations.",
      "Terpenoids: eugenol, thymol, and camphor — the primary bioactive volatile terpenoids in essential oil.",
    ],
    healthBenefits: [
      "Eugenol content associated with antimicrobial and analgesic properties; traditionally used for skin infections.",
      "Contains rosmarinic acid — associated with anti-inflammatory and antioxidant activity in research.",
      "Traditionally used for fever; volatile terpenoids associated with antipyretic and respiratory support.",
      "High vitamin A content associated with immune support and vision health.",
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
    nutritionalProfile: [
      "Vitamins: exceptionally rich in vitamin C (100g provides 75mg — 100% daily value); also vitamins A and folate.",
      "Minerals: potassium, magnesium, calcium, and copper present in ripe fruit.",
      "Fiber: moderate dietary fiber (1.7g/100g); unripe fruit is higher in pectin fiber.",
      "Protein: fruit contains papain — a proteolytic enzyme; seeds contain approximately 26% protein.",
    ],
    activeCompounds: [
      "Flavonoids: kaempferol, quercetin, and myricetin — antioxidant flavonoids in leaves and fruit.",
      "Alkaloids: carpaine — a macrocyclic alkaloid in leaves associated with traditional use.",
      "Tannins: condensed tannins in seeds with antiparasitic associations.",
      "Saponins: triterpenoid saponins in seeds with antiparasitic properties.",
      "Polyphenols: caffeic acid, ferulic acid, and chlorogenic acid in fruit and leaves.",
      "Terpenoids: lycopene (in ripe red flesh) — a carotenoid terpenoid antioxidant.",
    ],
    healthBenefits: [
      "Papain enzyme associated with digestive support — traditionally used to ease protein digestion.",
      "Lycopene content in red-fleshed varieties associated with antioxidant protection in research.",
      "Leaves contain carpaine and flavonoids associated with traditional use for fever and platelet support.",
      "Vitamin C and antioxidant profile associated with immune system support.",
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
    nutritionalProfile: [
      "Vitamins: excellent source of vitamin C; also contains vitamins B1, B2, and niacin.",
      "Minerals: significant iron, calcium, magnesium, potassium, and phosphorus in dried calyces.",
      "Fiber: calyces contain high mucilaginous fiber; leaves are high in dietary fiber.",
      "Protein: leaves contain approximately 1.5g protein per 100g; seeds are higher in protein.",
    ],
    activeCompounds: [
      "Flavonoids: quercetin, luteolin, and kaempferol — antioxidant flavonoids in calyces.",
      "Alkaloids: trace alkaloids not significantly present.",
      "Tannins: condensed tannins contributing to astringency in calyx tea.",
      "Saponins: trace saponins in seed extracts.",
      "Polyphenols: hibiscus acid, protocatechuic acid, and chlorogenic acid — the primary bioactive polyphenols.",
      "Terpenoids: beta-sitosterol and ursolic acid — triterpenoids in calyx and seed.",
    ],
    healthBenefits: [
      "Research suggests anthocyanin-rich polyphenols associated with cardiovascular health and blood pressure support.",
      "Contains compounds associated with liver health support; traditionally used as a digestive tonic.",
      "High vitamin C and antioxidant content associated with immune system and skin health.",
      "Research suggests hibiscus acid linked to lipid profile support in multiple clinical studies.",
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
    nutritionalProfile: [
      "Vitamins: not used as a food source; consumed medicinally in small amounts.",
      "Minerals: trace mineral content in leaf preparations.",
      "Fiber: negligible dietary contribution from medicinal preparations.",
      "Protein: minor protein content; value is in alkaloid and terpenoid compounds.",
    ],
    activeCompounds: [
      "Flavonoids: luteolin and apigenin — anti-inflammatory flavonoids in leaves.",
      "Alkaloids: leonurine — a mild alkaloid associated with traditional relaxant use.",
      "Tannins: condensed tannins with astringent properties.",
      "Saponins: triterpenoid saponins in stem and leaf extracts.",
      "Polyphenols: rosmarinic acid and caffeic acid derivatives identified.",
      "Terpenoids: marrubiin and leonuride — the primary bioactive diterpenoids in leaves.",
    ],
    healthBenefits: [
      "Contains marrubiin — traditionally associated with relaxant and mild sedative properties.",
      "Luteolin and apigenin associated with anti-inflammatory activity relevant to skin and pain use.",
      "Research suggests leonurine linked to smooth muscle relaxant associations.",
      "Traditionally used for skin conditions; tannins associated with astringent wound support.",
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
    nutritionalProfile: [
      "Vitamins: cooked leaves contain vitamins A and C; related nettle species are used as vegetables.",
      "Minerals: iron, calcium, and magnesium found in cooked leaf preparations.",
      "Fiber: leaves contain dietary fiber when cooked and consumed as a vegetable.",
      "Protein: leaves contain moderate protein (~3g/100g cooked) — similar to other leafy greens.",
    ],
    activeCompounds: [
      "Flavonoids: quercetin and kaempferol — antioxidant flavonoids in leaf extracts.",
      "Alkaloids: trace alkaloids not significantly present.",
      "Tannins: condensed tannins with astringent anti-inflammatory properties.",
      "Saponins: trace saponins in leaf and stem tissue.",
      "Polyphenols: caffeic acid and chlorogenic acid identified in extracts.",
      "Terpenoids: formic acid and histamine — the stinging compounds in trichomes (on fresh plant only).",
    ],
    healthBenefits: [
      "Contains quercetin and anti-inflammatory polyphenols associated with joint health support.",
      "Traditionally used for arthritis and rheumatism; compounds associated with anti-inflammatory activity.",
      "Iron content in cooked leaves associated with nutritional support for blood health.",
      "Research on related nettle species suggests urinary tract and prostate health associations.",
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
