import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '@/types/Product';

const PRODUCTS_KEY = '@products';

export class StorageService {
  static async getProducts(): Promise<Product[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(PRODUCTS_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Error getting products:', e);
      return [];
    }
  }

  static async saveProduct(product: Product): Promise<void> {
    try {
      const products = await this.getProducts();
      const existingIndex = products.findIndex(p => p.id === product.id);

      if (existingIndex >= 0) {
        products[existingIndex] = { ...product, updatedAt: new Date().toISOString() };
      } else {
        products.push(product);
      }

      const jsonValue = JSON.stringify(products);
      await AsyncStorage.setItem(PRODUCTS_KEY, jsonValue);
    } catch (e) {
      console.error('Error saving product:', e);
      throw e;
    }
  }

  static async deleteProduct(productId: string): Promise<void> {
    try {
      const products = await this.getProducts();
      const filteredProducts = products.filter(p => p.id !== productId);
      const jsonValue = JSON.stringify(filteredProducts);
      await AsyncStorage.setItem(PRODUCTS_KEY, jsonValue);
    } catch (e) {
      console.error('Error deleting product:', e);
      throw e;
    }
  }

  static async updateProductQuantity(productId: string, newQuantity: number): Promise<void> {
    try {
      const products = await this.getProducts();
      const product = products.find(p => p.id === productId);

      if (product) {
        product.quantity = newQuantity;
        product.updatedAt = new Date().toISOString();
        await this.saveProduct(product);
      }
    } catch (e) {
      console.error('Error updating product quantity:', e);
      throw e;
    }
  }
}