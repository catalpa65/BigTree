export type Quote = { text: string; author: string };

export const QUOTES: Quote[] = [
  // 中文优选
  { text: "不积跬步，无以至千里。", author: "荀子" },
  { text: "行胜于言。", author: "孔子" },
  { text: "为者常成，行者常至。", author: "晁说之" },
  { text: "业精于勤，荒于嬉。", author: "韩愈" },
  { text: "纸上得来终觉浅，绝知此事要躬行。", author: "陆游" },
  { text: "千里之行，始于足下。", author: "老子" },
  { text: "天行健，君子以自强不息。", author: "《周易》" },
  { text: "不驰于空想，不骛于虚声。", author: "刘少奇" },
  { text: "见贤思齐焉，见不贤而内自省也。", author: "孔子" },
  { text: "青，取之于蓝，而胜于蓝。", author: "荀子" },
  { text: "苟日新，日日新，又日新。", author: "《礼记》" },
  { text: "不忘初心，方得始终。", author: "释迦牟尼（传）" },
  { text: "道阻且长，行则将至。", author: "《荀子·修身》意近" },
  { text: "博学之，审问之，慎思之，明辨之，笃行之。", author: "《礼记》" },
  { text: "工欲善其事，必先利其器。", author: "《论语》" },
  { text: "心之所向，素履以往。", author: "木心（传）" },
  { text: "路虽远，行则将至；事虽难，做则必成。", author: "《礼记》意近" },
  { text: "积土成山，风雨兴焉；积水成渊，蛟龙生焉。", author: "荀子" },
  { text: "玉不琢，不成器；人不学，不知道。", author: "《礼记》" },
  { text: "凡事预则立，不预则废。", author: "《礼记》" },
  { text: "吾心安处是吾乡。", author: "苏轼" },
  { text: "知止而后有定。", author: "《大学》" },
  { text: "静以修身，俭以养德。", author: "诸葛亮" },

  // 英文优选
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
  { text: "Less, but better.", author: "Dieter Rams" },
  {
    text: "It always seems impossible until it's done.",
    author: "Nelson Mandela",
  },
  {
    text: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb",
  },
  {
    text: "Action is the foundational key to all success.",
    author: "Pablo Picasso",
  },
  { text: "Dream big. Start small. Act now.", author: "Robin Sharma" },
  {
    text: "If you want to go fast, go alone. If you want to go far, go together.",
    author: "African Proverb",
  },
  { text: "Done is better than perfect.", author: "Sheryl Sandberg" },
];

export function getRandomQuote(random = Math.random): Quote {
  const idx = Math.floor(random() * QUOTES.length);
  return QUOTES[idx];
}
