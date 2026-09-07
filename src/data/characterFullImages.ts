/**
 * Retratos de cuerpo completo (para las columnas verticales de la pelea en
 * vivo), en /public/characters-full/<slug>.png. Fuente: carpeta
 * "imagenes_completas" provista por el usuario, ya con nombre de personaje
 * correcto — no son capturas oficiales redistribuidas por nosotros.
 */
export const CHARACTER_FULL_IMAGE_SLUGS: Record<string, string> = {
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
  'Choi Bounge': 'choi-bounge',
  Chris: 'chris',
  'Clark Still': 'clark-still',
  'Eiji Kisaragi': 'eiji-kisaragi',
  Foxy: 'foxy',
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
  'Kyo Kusanagi': 'kyo-kusanagi',
  'Leona Heidern': 'leona-heidern',
  'Li Xiangfei': 'li-xiangfei',
  Lin: 'lin',
  'Lucky Glauber': 'lucky-glauber',
  'Mai Shiranui': 'mai-shiranui',
  Mature: 'mature',
  Maxima: 'maxima',
  'May Lee': 'may-lee',
  'Ralf Jones': 'ralf-jones',
  Ramon: 'ramon',
  'Robert Garcia': 'robert-garcia',
  'Ryo Sakazaki': 'ryo-sakazaki',
  'Ryuji Yamazaki': 'ryuji-yamazaki',
  Seth: 'seth',
  Shermie: 'shermie',
  'Shingo Yabuki': 'shingo-yabuki',
  'Sie Kensou': 'sie-kensou',
  'Takuma Sakazaki': 'takuma-sakazaki',
  'Terry Bogard': 'terry-bogard',
  Vanessa: 'vanessa',
  Vice: 'vice',
  Whip: 'whip',
  'Yashiro Nanakase': 'yashiro-nanakase',
  'Yuri Sakazaki': 'yuri-sakazaki',
}

export function getCharacterFullImageUrl(name: string): string | undefined {
  const slug = CHARACTER_FULL_IMAGE_SLUGS[name]
  return slug ? `/characters-full/${slug}.png` : undefined
}
