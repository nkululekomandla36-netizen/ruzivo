export interface LanguageDef {
  code: string;
  label: string;
  region: string;
}

export const LANGUAGE_REGISTRY: LanguageDef[] = [
  { code: "English",       label: "English",                  region: "Universal" },

  { code: "Shona",         label: "Shona",                    region: "Southern Africa" },
  { code: "Ndebele",       label: "Ndebele",                  region: "Southern Africa" },
  { code: "Zulu",          label: "Zulu",                     region: "Southern Africa" },
  { code: "Xhosa",         label: "Xhosa",                    region: "Southern Africa" },
  { code: "Afrikaans",     label: "Afrikaans",                region: "Southern Africa" },
  { code: "Sotho",         label: "Sotho",                    region: "Southern Africa" },
  { code: "Tswana",        label: "Tswana",                   region: "Southern Africa" },
  { code: "Swazi",         label: "Swazi",                    region: "Southern Africa" },
  { code: "Venda",         label: "Venda",                    region: "Southern Africa" },
  { code: "Tsonga",        label: "Tsonga",                   region: "Southern Africa" },
  { code: "Sepedi",        label: "Northern Sotho (Sepedi)",  region: "Southern Africa" },
  { code: "Lozi",          label: "Lozi",                     region: "Southern Africa" },
  { code: "Tonga",         label: "Tonga",                    region: "Southern Africa" },
  { code: "Khoikhoi",      label: "Khoikhoi / Nama",          region: "Southern Africa" },

  { code: "Kalanga",       label: "Kalanga",                  region: "Zimbabwe Region" },
  { code: "Nambya",        label: "Nambya",                   region: "Zimbabwe Region" },
  { code: "Shangani",      label: "Shangani / Korekore",      region: "Zimbabwe Region" },
  { code: "Chewa",         label: "Chewa / Nyanja",           region: "Zimbabwe Region" },

  { code: "Swahili",       label: "Swahili",                  region: "East Africa" },
  { code: "Kikuyu",        label: "Kikuyu",                   region: "East Africa" },
  { code: "Luo",           label: "Luo",                      region: "East Africa" },
  { code: "Kamba",         label: "Kamba",                    region: "East Africa" },
  { code: "Amharic",       label: "Amharic",                  region: "East Africa" },
  { code: "Oromo",         label: "Oromo",                    region: "East Africa" },

  { code: "Lingala",       label: "Lingala",                  region: "Central Africa" },
  { code: "Kinyarwanda",   label: "Kinyarwanda",              region: "Central Africa" },
  { code: "Kirundi",       label: "Kirundi",                  region: "Central Africa" },

  { code: "Yoruba",        label: "Yoruba",                   region: "West Africa" },
  { code: "Igbo",          label: "Igbo",                     region: "West Africa" },
  { code: "Hausa",         label: "Hausa",                    region: "West Africa" },
  { code: "Akan",          label: "Akan / Twi",               region: "West Africa" },
  { code: "Wolof",         label: "Wolof",                    region: "West Africa" },
  { code: "Fulani",        label: "Fulani (Fula)",            region: "West Africa" },
  { code: "Bambara",       label: "Bambara",                  region: "West Africa" },
  { code: "Dioula",        label: "Dioula",                   region: "West Africa" },
  { code: "Efik",          label: "Efik",                     region: "West Africa" },

  { code: "Arabic",        label: "Arabic",                   region: "North Africa" },
  { code: "Egyptian",      label: "Egyptian Arabic",          region: "North Africa" },
  { code: "French",        label: "French (regional)",        region: "North Africa" },
  { code: "German",        label: "German (colonial era)",    region: "Historical" },
];

export const REGION_ORDER: string[] = [
  "Universal",
  "Southern Africa",
  "Zimbabwe Region",
  "East Africa",
  "Central Africa",
  "West Africa",
  "North Africa",
  "Historical",
];

export function groupLanguagesByRegion(): Map<string, LanguageDef[]> {
  const map = new Map<string, LanguageDef[]>();
  for (const lang of LANGUAGE_REGISTRY) {
    if (!map.has(lang.region)) map.set(lang.region, []);
    map.get(lang.region)!.push(lang);
  }
  return map;
}

export const NOT_RECORDED = "Not yet recorded";
