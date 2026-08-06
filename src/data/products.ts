export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  weight: string;
  nostalgia: number;
  composition: string;
  roastNote: string;
  description: string;
  stats: {
    sweetness: number;
    nostalgia: number;
    variety: number;
    wow: number;
  };
  images: string[];
};

export const products: Product[] = [
  {
    id: "tetris",
    slug: "tetris",
    name: "Тетрис",
    price: 1990,
    weight: "675 г",
    nostalgia: 5,
    composition: "Wispa, Тетрис, Тамагочи, Turbo, Love is, кубик Рубика, зефир, чупа-чупс, петушок, Yupi, Invite, взрывная карамель, радуга-пружинка",
    roastNote: "Подарочный бокс · 90-е",
    description:
      "Подарочный набор сладостей из 90-х — настоящее «путешествие во времени» в одной коробке. Узнаваемые лакомства и ретро-игрушки, которые мгновенно возвращают атмосферу детства.",
    stats: { sweetness: 8, nostalgia: 10, variety: 9, wow: 9 },
    images: [
      "/catalog/tetris/01.png",
      "/catalog/tetris/02.png",
      "/catalog/tetris/03.png",
      "/catalog/tetris/04.png",
      "/catalog/tetris/05.png",
      "/catalog/tetris/06.png",
    ],
  },
  {
    id: "posylka",
    slug: "posylka-iz-90h",
    name: "Посылка из 90-х",
    price: 1090,
    weight: "285 г",
    nostalgia: 5,
    composition: "Yupi, Love is, Invite, Mamba, Turbo, Тамагочи, Wispa",
    roastNote: "Компактный ретро-набор",
    description:
      "Сладкое путешествие в прошлое: Тамагочи, мармелад Love is, Yupi, Invite, Turbo, Wispa, Mamba, чупа-чупс, взрывная карамель и другие хиты эпохи.",
    stats: { sweetness: 8, nostalgia: 10, variety: 8, wow: 9 },
    images: [
      "/catalog/posylka-iz-90h/01.png",
      "/catalog/posylka-iz-90h/02.png",
      "/catalog/posylka-iz-90h/03.png",
    ],
  },
  {
    id: "privet",
    slug: "privet-iz-90h",
    name: "Привет из 90-х",
    price: 490,
    weight: "135 г",
    nostalgia: 5,
    composition: "Yupi, Invite, Love is, Turbo, Mamba, радуга-пружинка, чупа-чупс, мармелад Love is",
    roastNote: "Лёгкий комплимент",
    description:
      "Идеальный небольшой подарок, чтобы вспомнить сладкие моменты прошлого или познакомить новое поколение с культовыми сладостями 90-х.",
    stats: { sweetness: 8, nostalgia: 9, variety: 7, wow: 8 },
    images: [
      "/catalog/privet-iz-90h/01.png",
      "/catalog/privet-iz-90h/02.png",
      "/catalog/privet-iz-90h/03.png",
    ],
  },
  {
    id: "tamagochi",
    slug: "tamagochi",
    name: "Тамагочи",
    price: 1690,
    weight: "570 г",
    nostalgia: 5,
    composition:
      "Зефирная змейка, Yupi, Invite, Love is, Turbo, Wispa, радуга-пружинка, шипучка, сахарный браслет, пряник «Тамагочи», чупа-чупс и другие хиты",
    roastNote: "Посылка из прошлого",
    description:
      "Набор «Посылка из прошлого» — машина времени в коробке. Открывая её, вы погружаетесь в воспоминания о детстве и юности.",
    stats: { sweetness: 7, nostalgia: 10, variety: 8, wow: 9 },
    images: [
      "/catalog/tamagochi/01.png",
      "/catalog/tamagochi/02.png",
      "/catalog/tamagochi/03.png",
    ],
  },
  {
    id: "malchik",
    slug: "malchik",
    name: "Мальчик",
    price: 590,
    weight: "210 г",
    nostalgia: 4,
    composition: "Кислые конфеты, жвачка, острый челлендж, взрывная карамель, мармелад, жевательные конфеты",
    roastNote: "20 позиций · челлендж",
    description:
      "Пора устроить настоящий челлендж! 20 топовых сладостей для мальчика: ультра-кислые леденцы, мармелад-монстры, необычные жвачки и шипучки.",
    stats: { sweetness: 6, nostalgia: 7, variety: 9, wow: 9 },
    images: [
      "/catalog/malchik/01.png",
      "/catalog/malchik/02.png",
      "/catalog/malchik/03.png",
    ],
  },
  {
    id: "kislyj",
    slug: "kislyj-bum",
    name: "Кислый бум",
    price: 790,
    weight: "215 г",
    nostalgia: 4,
    composition: "Азиатские сладости, супер-кислые конфеты, зефир, мармелад, жвачка, тянучка, взрывная карамель, сюрпризы",
    roastNote: "20 сладостей · kids",
    description:
      "Уникальный сладкий бокс: 20 позиций, часть с игрушками-сюрпризами. Яркий подарок на день рождения, Новый год или просто так.",
    stats: { sweetness: 7, nostalgia: 8, variety: 9, wow: 8 },
    images: [
      "/catalog/kislyj-bum/01.png",
      "/catalog/kislyj-bum/02.png",
      "/catalog/kislyj-bum/03.png",
      "/catalog/kislyj-bum/04.png",
    ],
  },
  {
    id: "kandi",
    slug: "kandi-klab",
    name: "Канди клаб",
    price: 540,
    weight: "190 г",
    nostalgia: 4,
    composition: "Азиатские сладости, кислые конфеты, зефир, мармелад, жвачка, карамельная соска, взрывная карамель",
    roastNote: "Сюрприз-бокс",
    description:
      "Сладкий бокс с необычными вкусностями и конфетками-игрушками. В комплекте праздничная открытка — готовый подарок ребёнку или взрослому.",
    stats: { sweetness: 9, nostalgia: 8, variety: 7, wow: 7 },
    images: [
      "/catalog/kandi-klab/01.png",
      "/catalog/kandi-klab/02.png",
      "/catalog/kandi-klab/03.png",
    ],
  },
];

export const popularProducts = products.slice(0, 4);

export function formatPrice(value: number) {
  return `${value.toLocaleString("ru-RU")} ₽`;
}
