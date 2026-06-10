const speakerImageByName: Record<string, string> = {
  "ayaan hirsi ali": "/conferencistas/conferencia-ayaan-hirsi-ali.jpg",
  "cayetana alvarez de toledo y peralta ramos": "/conferencistas/conferencia-cayetana-alvarez-de-toledo.png",
  "deirdre nansen mccloskey": "/conferencistas/conferencia-deirdre-mccloskey.jpg",
  "guy sorman": "/conferencistas/conferencia-guy-sorman.jpg",
  "ivan duque marquez": "/conferencistas/conferencia-ivan-duque-marquez.jpg",
  "john tomasi": "/conferencistas/conferencia-john-tomasi.jpg",
  "mario vargas llosa": "/conferencistas/conferencia-mario-vargas-llosa.jpg",
  "mauricio macri": "/conferencistas/conferencia-mauricio-macri.jpg",
  "moises naim": "/conferencistas/conferencia-moises-naim.webp",
  "niall ferguson": "/conferencistas/conferencia-niall-ferguson.jpg",
  "oscar naranjo trujillo": "/conferencistas/conferencia-oscar-naranjo-trujillo.jpg",
  "paul polman": "/conferencistas/conferencia-paul-polman.jpeg",
  "sergio fernando moro": "/conferencistas/conferencia-sergio-moro.jpg",
  "yoani sanchez": "/conferencistas/conferencia-yoani-sanchez.jpg",
};

const conferenceImageByYoutubeId: Record<string, string> = {
  BI2jcDcGq6g: "/conferencistas/conferencia-geopolitica-seguridad.jpg",
};

const speakerAliases: Record<string, string> = {
  "ivan duque": "ivan duque marquez",
  "conferencia libertad de mario vargas llosa": "mario vargas llosa",
  "cayetana alvarez de toledo": "cayetana alvarez de toledo y peralta ramos",
  "deirdre mccloskey": "deirdre nansen mccloskey",
  "general oscar naranjo trujillo": "oscar naranjo trujillo",
  "oscar naranjo": "oscar naranjo trujillo",
  "sergio moro": "sergio fernando moro",
};

export function normalizeSpeakerName(name: string) {
  const normalized = name
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

  return speakerAliases[normalized] ?? normalized;
}

export function getSpeakerImage(name: string) {
  return speakerImageByName[normalizeSpeakerName(name)] ?? null;
}

export function getConferenceImage(youtubeId: string) {
  return conferenceImageByYoutubeId[youtubeId] ?? null;
}
