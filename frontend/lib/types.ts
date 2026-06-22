export interface ProductDto {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  categoryId: string;
  categoryName: string;
  sellerId: string;
  sellerName: string;
  imageUrls: string[];
  createdAt: string;
  averageRating: number;
  reviewCount: number;
}

export interface OrderDto {
  id: string;
  orderDate: string;
  totalAmount: number;
  status: string;
  shippingAddress: string;
  items: OrderItemDto[];
}

export interface OrderItemDto {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface ReviewDto {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment?: string;
  createdAt: string;
}