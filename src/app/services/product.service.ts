import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [];
  private productsSubject = new BehaviorSubject<Product[]>([]);

  constructor() { }

  // Obtener todos los productos como Observable
  getProducts(): Observable<Product[]> {
    return this.productsSubject.asObservable();
  }

  // Añadir un nuevo producto
  addProduct(product: Product): void {
    this.products.push(product);
    this.productsSubject.next([...this.products]);
  }

  // Obtener un producto por su referencia
  getProductByReference(reference: string): Product | undefined {
    return this.products.find(p => p.reference === reference);
  }

  // Actualizar un producto existente
  updateProduct(updatedProduct: Product): void {
    const index = this.products.findIndex(p => p.reference === updatedProduct.reference);
    if (index !== -1) {
      this.products[index] = updatedProduct;
      this.productsSubject.next([...this.products]);
    }
  }

  // Verificar si un nombre de producto ya existe
  isProductNameDuplicate(name: string, reference?: string): boolean {
    return this.products.some(p => 
      p.name.toLowerCase() === name.toLowerCase() && 
      (!reference || p.reference !== reference)
    );
  }
}