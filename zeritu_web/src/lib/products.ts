export interface Product {
  id: string;
  title: string;
  price: number;
  category: "Books" | "Music" | "Merch";
  image: string;
  description: string;
}

export const products: Product[] = [
  
  {
    id: "merch-1",
    title: "Classic Tee - Black",
    price: 29.99,
    category: "Merch",
    image: "/images/merchs/image_2025-11-04_20-16-10.png",
    description: "Premium cotton t-shirt with signature logo.",
  },
  {
    id: "merch-2",
    title: "Hoodie - Grey",
    price: 49.99,
    category: "Merch",
    image: "/images/merchs/image_2025-11-04_20-34-21.png",
    description: "Cozy hoodie perfect for chilly evenings.",
  },
  {
    id: "merch-3",
    title: "Cap - White",
    price: 19.99,
    category: "Merch",
    image: "/images/merchs/image_2025-11-06_07-28-11.png",
    description: "Stylish cap to complete your look.",
  },
  {
    id: "merch-4",
    title: "Tote Bag",
    price: 14.99,
    category: "Merch",
    image: "/images/merchs/image_2025-11-06_07-34-12.png",
    description: "Eco-friendly tote bag for your daily needs.",
  },
  {
    id: "merch-5",
    title: "Mug",
    price: 12.99,
    category: "Merch",
    image: "/images/merchs/image_2025-11-06_08-53-52.png",
    description: "Start your day with a Zeritu mug.",
  },
  {
    id: "merch-6",
    title: "Notebook",
    price: 9.99,
    category: "Merch",
    image: "/images/merchs/image_2025-11-06_14-25-51.png",
    description: "Capture your thoughts in this beautiful notebook.",
  },
  {
    id: "merch-7",
    title: "Phone Case",
    price: 15.99,
    category: "Merch",
    image: "/images/merchs/image_2025-11-07_16-35-05.png",
    description: "Protect your phone in style.",
  },
  {
    id: "merch-8",
    title: "Stickers Pack",
    price: 5.99,
    category: "Merch",
    image: "/images/merchs/image_2025-11-07_16-50-21.png",
    description: "Decorate your laptop or journal.",
  },
];
