export interface Product {
    id: number;
    name: string | null;
    description: string | null;
    price: number;
    category: string;
    imageUrl: string;
}