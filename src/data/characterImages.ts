/**
 * Personajes con retrato real disponible en /public/characters/<slug>.png.
 * El resto cae en la ficha genérica (gradiente + silueta) de CharacterAvatar.
 *
 * Mapeo generado a partir de una carpeta de thumbnails con nombres de
 * personaje correctos provista por el usuario (no son capturas oficiales
 * redistribuidas por nosotros). Cubre 63 de los 64 personajes del roster —
 * el único sin imagen es K9999.
 */
export const CHARACTER_IMAGE_SLUGS: Record<string, string> = {
  'Andy Bogard': 'andy-bogard',
  Angel: 'angel',
  'Athena Asamiya': 'athena-asamiya',
  Bao: 'bao',
  'Benimaru Nikaido': 'benimaru-nikaido',
  'Billy Kane': 'billy-kane',
  'Blue Mary': 'blue-mary',
  'Brian Battler': 'brian-battler',
  'Chang Koehan': 'chang-koehan',
  'Chin Gentsai': 'chin-gentsai',
  'Chizuru Kagura': 'chizuru-kagura',
  'Choi Bounge': 'choi-bounge',
  Chris: 'chris',
  'Clark Still': 'clark-still',
  'Eiji Kisaragi': 'eiji-kisaragi',
  Foxy: 'foxy',
  'Geese Howard': 'geese-howard',
  'Goro Daimon': 'goro-daimon',
  'Heavy D!': 'heavy-d',
  Heidern: 'heidern',
  'Hinako Shijou': 'hinako-shijou',
  'Iori Yagami': 'iori-yagami',
  'Jhun Hoon': 'jhun-hoon',
  'Joe Higashi': 'joe-higashi',
  "K'": 'k',
  'Kasumi Todoh': 'kasumi-todoh',
  'Kim Kaphwan': 'kim-kaphwan',
  King: 'king',
  'Kula Diamond': 'kula-diamond',
  Kusanagi: 'kusanagi',
  'Kyo Kusanagi': 'kyo-kusanagi',
  'Leona Heidern': 'leona-heidern',
  'Li Xiangfei': 'li-xiangfei',
  Lin: 'lin',
  'Lucky Glauber': 'lucky-glauber',
  'Mai Shiranui': 'mai-shiranui',
  Mature: 'mature',
  Maxima: 'maxima',
  'May Lee': 'may-lee',
  'Mr. Big': 'mr-big',
  'Omega Rugal': 'omega-rugal',
  'Orochi Chris': 'orochi-chris',
  'Orochi Shermie': 'orochi-shermie',
  'Orochi Yashiro': 'orochi-yashiro',
  'Ralf Jones': 'ralf-jones',
  Ramon: 'ramon',
  'Robert Garcia': 'robert-garcia',
  'Rugal Bernstein': 'rugal-bernstein',
  'Ryo Sakazaki': 'ryo-sakazaki',
  'Ryuji Yamazaki': 'ryuji-yamazaki',
  'Saisyu Kusanagi': 'saisyu-kusanagi',
  Seth: 'seth',
  Shermie: 'shermie',
  'Shingo Yabuki': 'shingo-yabuki',
  'Sie Kensou': 'sie-kensou',
  'Takuma Sakazaki': 'takuma-sakazaki',
  'Terry Bogard': 'terry-bogard',
  Vanessa: 'vanessa',
  Vice: 'vice',
  Whip: 'whip',
  'Wolfgang Krauser': 'wolfgang-krauser',
  'Yashiro Nanakase': 'yashiro-nanakase',
  'Yuri Sakazaki': 'yuri-sakazaki',
}

export function getCharacterImageUrl(name: string): string | undefined {
  const slug = CHARACTER_IMAGE_SLUGS[name]
  return slug ? `/characters/${slug}.png` : undefined
}
