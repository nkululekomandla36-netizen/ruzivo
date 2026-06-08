import { NOT_RECORDED } from "./languageRegistry";

export const EXTENDED_LOCAL_NAMES: Record<string, Record<string, string>> = {
  "aloe-vera": {
    Ndebele:     "Gavakava",
    Tswana:      "Kgopane",
    Venda:       "Gavhani",
    Tsonga:      "Xikakavha",
    Sepedi:      "Mokgopha",
    Swahili:     "Msubaki",
    Chewa:       "Chingangamlira",
    Kinyarwanda: "Musitani",
    Wolof:       "Aloe",
    Akan:        "Aloe",
    Arabic:      "Sabbar",
  },

  "moringa": {
    Tswana:      "Moringa",
    Sepedi:      "Moringa",
    Venda:       "Muvuvha",
    Tsonga:      "Muringa",
    Chewa:       "Cham'mwamba",
    Lingala:     "Molengwa",
    Kinyarwanda: "Moringa",
    Kirundi:     "Moringa",
    Akan:        "Yevudua",
    Wolof:       "Nébédaye",
    Fulani:      "Jiga",
    Kamba:       "Moringa",
    Oromo:       "Moringa",
  },

  "neem": {
    Tswana:      "Neem",
    Sepedi:      "Munyii",
    Venda:       "Munyii",
    Tsonga:      "Neem",
    Yoruba:      "Dongoyaro",
    Igbo:        "Ogbu",
    Akan:        "Nim",
    Wolof:       "Nim",
    Lingala:     "Neem",
    Kinyarwanda: "Neem",
    Oromo:       "Neem",
  },

  "rooibos": {
    Sotho:       "Rooibos",
    Tswana:      "Rooibos",
    Venda:       "Rooibos",
    Zulu:        "Rooibos",
    Ndebele:     "Rooibos",
  },

  "african-potato": {
    Tswana:      "Lotsane",
    Ndebele:     "iNkomfe",
    Venda:       "Mukonĩ",
    Tsonga:      "Xihlwahlwa",
    Sepedi:      "Lotsane",
    Swahili:     "Mkadi",
  },

  "baobab": {
    Venda:       "Muvhuyu",
    Tsonga:      "Muvhuyu",
    Sepedi:      "Muvhuyu",
    Ndebele:     "iMvaba",
    Tswana:      "Mowana",
    Lozi:        "Muuyu",
    Chewa:       "Mlambe",
    Kalanga:     "Muvhuyu",
    Nambya:      "Muuyu",
    Swahili:     "Mbuyu",
    Kamba:       "Muamba",
    Oromo:       "Buqqee",
    Lingala:     "Mosaka",
    Kinyarwanda: "Umuyuyu",
    Kirundi:     "Umuyuyu",
    Akan:        "Adusoa",
    Wolof:       "Buuy",
    Fulani:      "Boye",
    Arabic:      "Tabaldi",
  },

  "devils-claw": {
    Sepedi:      "Sengaparile",
    Venda:       "Tshidzimba",
    Ndebele:     "Intemeleko",
    Tsonga:      "Xipfunu",
  },

  "african-wormwood": {
    Venda:       "Muvhumbela",
    Tsonga:      "Nhlangwini",
    Sepedi:      "Lengana",
    Tswana:      "Lengana",
    Ndebele:     "Umhlonyane",
    Swahili:     "Mchungu",
    Amharic:     "Chicho",
  },

  "buchu": {
    Sotho:       "Buchu",
    Zulu:        "Buchu",
    Venda:       "Ibuchu",
  },

  "sutherlandia": {
    Venda:       "Insiswa",
    Ndebele:     "Unwele",
    Tswana:      "Lerumo-lamadi",
    Tsonga:      "Nkanka",
  },

  "cape-aloe": {
    Ndebele:     "iNhlakazana",
    Tswana:      "Kgopane ya kapa",
    Venda:       "Gavhani",
    Tsonga:      "Xikakavha xa kapa",
    Sepedi:      "Mokgopha",
    Swahili:     "Kiburi",
  },

  "fever-tree": {
    Ndebele:     "umHlosinga",
    Tswana:      "Mogohlo",
    Venda:       "Mungongolo",
    Tsonga:      "Nkaya",
    Sepedi:      "Mogohlo",
    Swahili:     "Mgunga wa Njano",
    Kinyarwanda: "Umukora",
  },

  "marula": {
    Venda:       "Mufula",
    Tsonga:      "Nkanyi",
    Sepedi:      "Morula",
    Ndebele:     "umGanu",
    Lozi:        "Mufula",
    Chewa:       "Mpoza",
    Kalanga:     "Munkanyi",
    Nambya:      "Mupfura",
    Kamba:       "Muembe wa msitu",
  },

  "wild-garlic": {
    Venda:       "Tshidzimba",
    Tsonga:      "Nkhanye",
    Ndebele:     "uMaganda",
    Tswana:      "Kgengwe",
    Swahili:     "Kitunguu pori",
  },

  "bitter-melon": {
    Tswana:      "Serotswana",
    Venda:       "Tshifhingamutshato",
    Tsonga:      "Xitshembani",
    Sepedi:      "Sekgologolo",
    Chewa:       "Nzungulu",
    Swahili:     "Karela",
    Lingala:     "Margose",
    Kinyarwanda: "Isukari isara",
    Wolof:       "Margose",
    Akan:        "Nyankaboadua",
    Oromo:       "Harbuye",
  },

  "african-basil": {
    Venda:       "Mutsvairo",
    Tsonga:      "Nhlangana",
    Sepedi:      "Morabaraba",
    Tswana:      "Morabaraba",
    Swahili:     "Mrehani mwitu",
    Lingala:     "Efirin",
    Kinyarwanda: "Umusogi",
    Akan:        "Nunum",
  },

  "stinging-nettle": {
    Kamba:       "Munyi",
    Oromo:       "Qumbi",
    Lingala:     "Bontingi",
    Kinyarwanda: "Umunanira",
  },

  "papaya": {
    Venda:       "Papai",
    Tsonga:      "Papai",
    Sepedi:      "Papaya",
    Ndebele:     "Mapopo",
    Tswana:      "Papaya",
    Lozi:        "Mapopo",
    Chewa:       "Mapapaya",
    Kalanga:     "Papaw",
    Kamba:       "Mpapayu",
    Oromo:       "Papaya",
    Lingala:     "Papaye",
    Kinyarwanda: "Papaye",
    Kirundi:     "Papaye",
    Akan:        "Brofere",
    Wolof:       "Papaye",
    Fulani:      "Gwanda",
  },

  "hibiscus": {
    Venda:       "Tshifhingamutshato",
    Tsonga:      "Ncila",
    Sepedi:      "Tshifhingamutshato",
    Ndebele:     "uHhibhisikasi",
    Tswana:      "Tshifhingamutshato",
    Chewa:       "Masamba achifufu",
    Oromo:       "Karkade",
    Lingala:     "Ngai ngai",
    Kinyarwanda: "Kirisiti",
    Akan:        "Sobolo",
    Wolof:       "Bissap",
    Fulani:      "Yakuwa",
    Amharic:     "Kem",
  },

  "wild-dagga": {
    Ndebele:     "umFincafincane",
    Venda:       "Mutshekele",
    Tsonga:      "Nhlangana",
    Tswana:      "Madidimalo",
    Sotho:       "Motlatswa",
  },

  "black-seed": {
    Venda:       "Tikur azmud",
    Tsonga:      "Nhlangana",
    Oromo:       "Tikur zinch",
    Wolof:       "Nigelle",
    Akan:        "Kuremu",
  },

  "turmeric": {
    Venda:       "Borrie",
    Tsonga:      "Borrie",
    Sepedi:      "Borrie",
    Ndebele:     "uBorrie",
    Tswana:      "Borrie",
    Chewa:       "Manjano",
    Oromo:       "Ird",
    Amharic:     "Erd",
    Lingala:     "Manjano",
    Wolof:       "Curcuma",
    Akan:        "Asase wisa",
    Kinyarwanda: "Umukuza",
  },

  "ginger": {
    Venda:       "Tangawizi",
    Tsonga:      "Tangawizi",
    Sepedi:      "Tangawizi",
    Ndebele:     "uTangawizi",
    Tswana:      "Tangawizi",
    Chewa:       "Chimbizga",
    Oromo:       "Zinjibila",
    Amharic:     "Zinjibil",
    Lingala:     "Litangawizi",
    Kinyarwanda: "Tangawizi",
    Kirundi:     "Tangawizi",
    Akan:        "Akekaduro",
    Wolof:       "Gingembre",
  },

  "shea-tree": {
    Venda:       "Mufuta",
    Tsonga:      "Mafura",
    Sepedi:      "Mofuta",
    Chewa:       "Mtungula",
    Kinyarwanda: "Umunyinya",
    Akan:        "Nkuto",
    Wolof:       "Karité",
    Fulani:      "Karite",
  },

  "bitter-kola": {
    Venda:       "Muhomu",
    Tswana:      "Kola e bogale",
    Lingala:     "Likola",
    Kinyarwanda: "Ikinyinya",
    Akan:        "Tweapea",
    Wolof:       "Goro amer",
  },

  "soursop": {
    Venda:       "Soursop",
    Tsonga:      "Soursop",
    Chewa:       "Soursop",
    Lingala:     "Korosol",
    Kinyarwanda: "Soursop",
    Akan:        "Abibifre",
    Wolof:       "Korossol",
    Oromo:       "Soursop",
  },

  "lemongrass": {
    Venda:       "Tshimela",
    Tsonga:      "Nkwenga",
    Sepedi:      "Motlatswa",
    Tswana:      "Mosukujane",
    Chewa:       "Msatsi",
    Oromo:       "Seree",
    Lingala:     "Mchaichai",
    Kinyarwanda: "Ibirere",
    Akan:        "Ahaban nsusua",
    Wolof:       "Citronnelle",
    Kamba:       "Ngutu",
  },

  "guava": {
    Venda:       "Mugwava",
    Tsonga:      "Magwava",
    Sepedi:      "Legwava",
    Ndebele:     "uGwava",
    Tswana:      "Legwava",
    Chewa:       "Gwafa",
    Lozi:        "Magwava",
    Kamba:       "Mupera",
    Oromo:       "Waaxii",
    Lingala:     "Goyave",
    Kinyarwanda: "Igiyava",
    Kirundi:     "Igiyava",
    Akan:        "Guava",
    Wolof:       "Goyave",
    Fulani:      "Gouyave",
  },

  "tamarind": {
    Venda:       "Mutswamba",
    Tsonga:      "Nchenga nchenga",
    Sepedi:      "Moretologa",
    Tswana:      "Moretlwa",
    Chewa:       "Bwemba",
    Lozi:        "Katumbu",
    Kamba:       "Mutambi",
    Oromo:       "Raaree",
    Lingala:     "Tamarin",
    Kinyarwanda: "Umutamali",
    Kirundi:     "Umutamali",
    Akan:        "Sawa",
    Wolof:       "Dakhaar",
  },

  "agave": {
    Venda:       "Garingboom",
    Tsonga:      "Nkula",
    Tswana:      "Garingboom",
    Swahili:     "Mkonge",
    Ndebele:     "iGaringboom",
  },

  "pelargonium": {
    Ndebele:     "Umckaloabo",
    Venda:       "Mutshekele",
    Tswana:      "Khoabo",
    Sepedi:      "Khoabo",
    Tsonga:      "Nhlangana ya mahe",
  },

  "hoodia": {
    Venda:       "Xhoba",
    Tswana:      "Ghaap",
    Ndebele:     "Ghaap",
  },

  "sausage-tree": {
    Venda:       "Muvonde",
    Tsonga:      "Nkonkwane",
    Sepedi:      "Muvonde",
    Ndebele:     "umVongotsi",
    Tswana:      "Mporola",
    Lozi:        "Muvonde",
    Chewa:       "Mvunguti",
    Kalanga:     "Muvonde",
    Swahili:     "Mwegea",
    Lingala:     "Mubombombo",
    Kinyarwanda: "Umuvunde",
  },

  "jackalberry": {
    Venda:       "Mubvunzandadzi",
    Tsonga:      "Nduku",
    Sepedi:      "Mukhakha",
    Ndebele:     "umKhiwane",
    Tswana:      "Mmaba",
    Chewa:       "Kankha",
    Lozi:        "Muchakata",
    Swahili:     "Mbula",
    Kinyarwanda: "Umukeri",
    Wolof:       "Dyabo",
  },

  "buffalo-thorn": {
    Venda:       "Tshipute",
    Tsonga:      "Nsala",
    Sepedi:      "Mokgalo",
    Ndebele:     "umLahlankosi",
    Tswana:      "Mokgalo",
    Chewa:       "Nsangu",
    Lozi:        "Musangu",
    Swahili:     "Mkunazi",
    Kinyarwanda: "Umukeri wa murima",
  },
};

export function getMergedLocalNames(
  plantId: string,
  baseNames: Record<string, string>
): Record<string, string> {
  const extended = EXTENDED_LOCAL_NAMES[plantId] ?? {};
  const merged: Record<string, string> = { ...extended };
  for (const [lang, name] of Object.entries(baseNames)) {
    merged[lang] = name;
  }
  return merged;
}

export { NOT_RECORDED };
