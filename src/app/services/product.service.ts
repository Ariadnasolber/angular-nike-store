import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product';
import { BehaviorSubject, Observable } from 'rxjs';

// Servicio para gestionar los productos, añadir, actualizar y obtener productos
@Injectable({
  //decorador para inyectar el servicio en otros componentes
  providedIn: 'root', //indicar que el servicio es un servicio raíz para que Angular lo inyecte automáticamente
})
export class ProductService {
  private products: Product[] = []; //array privado de productos
  private productsSubject = new BehaviorSubject<Product[]>([]); //sujeto para emitir los productos

  constructor() {} //constructor del servicio vacío para inyectar dependencias si es necesario

  // Obtener todos los productos como Observable
  getProducts(): Observable<Product[]> {
    //devuelve un observable que emite el array de productos permitiendo a los componentes suscritos recibir actualizaciones
    return this.productsSubject.asObservable();
  }

  // Añadir un nuevo producto
  addProduct(product: Product): void {
    //añade un nuevo producto al array de productos y emite el nuevo array
    this.products.push(product); //añade el producto al array
    this.productsSubject.next([...this.products]); //lo emite
  }

  // Obtener un producto por su referencia
  getProductByReference(reference: string): Product | undefined {
    return this.products.find((p) => p.reference === reference); //devuelve el producto con la referencia dada o undefined si no se encuentra
  }

  // Actualizar un producto existente
  updateProduct(updatedProduct: Product): void {
    const index = this.products.findIndex(
      (p) => p.reference === updatedProduct.reference
    );
    if (index !== -1) {
      this.products[index] = updatedProduct;
      this.productsSubject.next([...this.products]);
    }
  }

  // Verificar si un nombre de producto ya existe
  isProductNameDuplicate(name: string, reference?: string): boolean {
    return this.products.some(
      (p) =>
        p.name.toLowerCase() === name.toLowerCase() &&
        (!reference || p.reference !== reference)
    );
  }
}

/* Éste servicio se encarga de gestionar los productos, añadir, actualizar y obtener productos.
    Para ello, se utiliza un array privado de productos y un sujeto para emitir los productos.
    Se proporcionan métodos para obtener todos los productos, añadir un nuevo producto, 
    obtener un producto por su referencia, actualizar un producto existente y verificar si 
    un nombre de producto ya existe. */
