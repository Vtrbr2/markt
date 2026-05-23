// Usuário
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin';
  avatarUrl?: string;
}

// Autenticação
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Produto
export interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  status: string;
  variations?: Record<string, string[]>;
  images: ProductImage[];
  category?: Category;
  seller?: { id: string; storeName: string };
}

// Categoria
export interface Category {
  id: string;
  name: string;
  slug: string;
  iconUrl?: string;
  children?: Category[];
}

// Carrinho
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  variation?: Record<string, string>;
  subtotal: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  totalItems: number;
  subtotal: number;
}

// Pedido
export interface OrderItem {
  id: string;
  productSnapshot: {
    title: string;
    price: number;
    imageUrl?: string;
  };
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  status: 'pending' | 'paid' | 'preparing' | 'shipped' | 'delivered' | 'canceled';
  total: number;
  items: OrderItem[];
  createdAt: string;
}

// Pagamento
export interface CheckoutResponse {
  payment: {
    id: string;
    status: string;
    method: string;
    amount: number;
  };
  paymentUrl?: string;
  pixCode?: string;
  pixQrCode?: string;
  boletoUrl?: string;
}

// Paginação
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
