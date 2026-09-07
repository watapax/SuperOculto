/**
 * Personajes con retrato real disponible en /public/characters/<slug>.png.
 * El resto cae en la ficha genérica (gradiente + silueta) de CharacterAvatar.
 *
 * Identificados a mano a partir de imágenes provistas por el usuario (no son
 * capturas oficiales redistribuidas por nosotros). Algunos son de confianza
 * media — si alguno está mal asignado, avisar para corregirlo.
 */
export const CHARACTER_IMAGE_SLUGS: Record<string, string> = {
  'Andy Bogard': 'andy-bogard',
  'Athena Asamiya': 'athena-asamiya',
  'Benimaru Nikaido': 'benimaru-nikaido',
  'Goro Daimon': 'goro-daimon',
  'Joe Higashi': 'joe-higashi',
  'Ralf Jones': 'ralf-jones',
  'Ryo Sakazaki': 'ryo-sakazaki',
  'Takuma Sakazaki': 'takuma-sakazaki',
  'Terry Bogard': 'terry-bogard',
  'Kyo Kusanagi': 'kyo-kusanagi',
  'Chin Gentsai': 'chin-gentsai',
  King: 'king',
  Ramon: 'ramon',
  'Clark Still': 'clark-still',
  'Iori Yagami': 'iori-yagami',
  Vice: 'vice',
  'Blue Mary': 'blue-mary',
  'Geese Howard': 'geese-howard',
  'Wolfgang Krauser': 'wolfgang-krauser',
  'Mr. Big': 'mr-big',
  Angel: 'angel',
  'Yashiro Nanakase': 'yashiro-nanakase',
  'Choi Bounge': 'choi-bounge',
  'Kula Diamond': 'kula-diamond',
  'May Lee': 'may-lee',
  'Leona Heidern': 'leona-heidern',
  Bao: 'bao',
  'Yuri Sakazaki': 'yuri-sakazaki',
  'Mai Shiranui': 'mai-shiranui',
  'Chang Koehan': 'chang-koehan',
  'Ryuji Yamazaki': 'ryuji-yamazaki',
  'Shingo Yabuki': 'shingo-yabuki',
  "K'": 'k',
  'Kasumi Todoh': 'kasumi-todoh',
  'Chizuru Kagura': 'chizuru-kagura',
  K9999: 'k9999',
  Vanessa: 'vanessa',
  'Jhun Hoon': 'jhun-hoon',
  Shermie: 'shermie',
  Chris: 'chris',
  Mature: 'mature',
  Maxima: 'maxima',
  'Li Xiangfei': 'li-xiangfei',
  Heidern: 'heidern',
  Whip: 'whip',
  Foxy: 'foxy',
}

export function getCharacterImageUrl(name: string): string | undefined {
  const slug = CHARACTER_IMAGE_SLUGS[name]
  return slug ? `/characters/${slug}.png` : undefined
}
