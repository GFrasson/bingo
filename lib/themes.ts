export const THEMES = {
  cha_de_panela: [
    "Liquidificador", "Batedeira", "Panela", "Faqueiro", "Pratos",
    "Toalha", "Potes", "Escorredor", "Tábua", "Ralador",
    "Espátula", "Avental", "Forma", "Assadeira", "Espremedor",
    "Abridor", "Escumadeira", "Concha", "Fouet", "Xícaras",
    "Copos", "Jarra", "Petisqueira", "Saladeira", "Travessa",
    "Café", "Luva", "Rodo", "Lixeira", "Vassoura",
    "Pá", "Balde", "Pregadores", "Pano", "Saca-Rolhas",
    "Amassador", "Garfo", "Faca", "Colher", "Pires",
    "Bule", "Frigideira", "Tigela", "Bacia", "Açucareiro",
    "Saleiro", "Pimenteiro", "Bandeja", "Manteigueira", "Queijeira",
    "Fruteira", "Suqueira", "Peneira", "Funil", "Tesoura",
    "Rolo", "Pegador", "Pinça", "Cafeteira", "Chaleira"
  ]
}

export function getRandomBoard(theme: keyof typeof THEMES): string[] {
  const words = THEMES[theme] || THEMES['cha_de_panela'];
  // Shuffle and pick 25
  const shuffled = [...words].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 25);
}
