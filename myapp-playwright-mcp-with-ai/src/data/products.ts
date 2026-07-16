import { Product } from '@/types/menu';

export const products: Product[] = [
  // Lanches
  {
    id: 'big-mock',
    name: 'Big Mock',
    price: 39.90,
    description: 'Quatro camadas de pão, dois hambúrgueres de carne bovina, alface, queijo derretido, molho especial, cebola e pão com gergelim.',
    image: '/images/cardapio/bigmock.png',
    category: 'lanches',
    ingredients: ['Pão com gergelim', 'Hambúrguer bovino (2x)', 'Alface', 'Queijo cheddar', 'Molho especial', 'Cebola'],
  },
  {
    id: 'duplo-deploy',
    name: 'Duplo Deploy',
    price: 41.50,
    description: 'Dois suculentos hambúrgueres de carne, maionese cremosa, cebola crispy, fatias de bacon e queijo cheddar derretido no pão brioche.',
    image: '/images/cardapio/duplodeploy.png',
    category: 'lanches',
    ingredients: ['Pão brioche', 'Hambúrguer bovino (2x)', 'Maionese', 'Cebola crispy', 'Bacon', 'Queijo cheddar'],
  },
  {
    id: 'mcmerge',
    name: 'McMerge',
    price: 39.90,
    description: 'Pão brioche, molho barbecue picante, bacon crocante, alface fresquinha e queijo mussarela derretido.',
    image: '/images/cardapio/mcmerge.png',
    category: 'lanches',
    ingredients: ['Pão brioche', 'Hambúrguer bovino', 'Molho barbecue', 'Bacon', 'Alface', 'Queijo mussarela'],
  },
  {
    id: 'mcnifico-flaky',
    name: 'McNífico Flaky',
    price: 36.20,
    description: 'Um hambúrguer de carne bovina, com molho de tomate temperado, queijo, e cebola caramelizada.',
    image: '/images/cardapio/mcnificoflaky.png',
    category: 'lanches',
    ingredients: ['Pão tradicional', 'Hambúrguer bovino', 'Molho de tomate', 'Queijo', 'Cebola caramelizada'],
  },

  // Fritas
  {
    id: 'batatas-fullstack',
    name: 'Batatas Full Stack',
    price: 10.90,
    description: 'Uma porção gigante de batatas fritas crocantes, perfeitas para compartilhar ou devorar sozinho!',
    image: '/images/cardapio/fritas-fullstack.png',
    category: 'fritas',
    ingredients: ['Batatas selecionadas', 'Sal'],
  },
  {
    id: 'batatas-refatoradas',
    name: 'Batatas Refatoradas',
    price: 9.90,
    description: 'Batatas médias cortadas em palitos, fritas até ficarem douradas e crocantes por fora, macias por dentro.',
    image: '/images/cardapio/fritas-refatoradas.png',
    category: 'fritas',
    ingredients: ['Batatas selecionadas', 'Sal'],
  },
  {
    id: 'batatas-minificadas',
    name: 'Batatas Minificadas',
    price: 5.90,
    description: 'Uma porção pequena e rápida de batatas fritas. Ideal para um lanchinho rápido!',
    image: '/images/cardapio/fritas-minificadas.png',
    category: 'fritas',
    ingredients: ['Batatas selecionadas', 'Sal'],
  },

  // Bebidas
  {
    id: 'coca-crash',
    name: 'Coca-Crash',
    price: 5.90,
    description: 'Refrigerante de cola gelado, perfeito para acompanhar seu lanche favorito.',
    image: '/images/cardapio/coca-crashf.png',
    category: 'bebidas',
    ingredients: ['Refrigerante de cola 500ml'],
  },
  {
    id: 'fanta-warning',
    name: 'Fanta Warning',
    price: 5.90,
    description: 'Refrigerante sabor laranja, refrescante e cheio de sabor.',
    image: '/images/cardapio/fanta-warning.png',
    category: 'bebidas',
    ingredients: ['Refrigerante de laranja 500ml'],
  },
  {
    id: 'agua-localhost',
    name: 'Água Localhost',
    price: 2.90,
    description: 'Água mineral pura e refrescante. Hidratação essencial!',
    image: '/images/cardapio/agua-localhost.png',
    category: 'bebidas',
    ingredients: ['Água mineral 500ml'],
  },

  // Sobremesas
  {
    id: 'casquinha-vanillajs',
    name: 'Casquinha Vanilla JS',
    price: 3.90,
    description: 'Casquinha crocante com sorvete cremoso sabor baunilha. Clássica e irresistível!',
    image: '/images/cardapio/casquinha-vanilajs.png',
    category: 'sobremesas',
    ingredients: ['Casquinha crocante', 'Sorvete de baunilha'],
  },
  {
    id: 'casquinha-darkmode',
    name: 'Casquinha Dark Mode',
    price: 3.90,
    description: 'Casquinha crocante com sorvete de chocolate intenso. Para os amantes do cacau!',
    image: '/images/cardapio/casquinha-darkmode.png',
    category: 'sobremesas',
    ingredients: ['Casquinha crocante', 'Sorvete de chocolate'],
  },
  {
    id: 'casquinha-pullrequest',
    name: 'Casquinha Pull Request',
    price: 2.90,
    description: 'Casquinha com sorvete sabor misto, baunilha e chocolate. O melhor dos dois mundos!',
    image: '/images/cardapio/casquinha-pullrequest.png',
    category: 'sobremesas',
    ingredients: ['Casquinha crocante', 'Sorvete de baunilha', 'Sorvete de chocolate'],
  },
];

export const categories = [
  { id: 'lanches', name: 'Lanches', icon: '🍔' },
  { id: 'fritas', name: 'Fritas', icon: '🍟' },
  { id: 'bebidas', name: 'Bebidas', icon: '🥤' },
  { id: 'sobremesas', name: 'Sobremesas', icon: '🍦' },
] as const;
