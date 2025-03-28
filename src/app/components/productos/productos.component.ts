import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit, OnDestroy { 
  products: Product[] = []; 
  private subscription: Subscription = new Subscription();

  constructor(private productService: ProductService) { } //inyección del servicio ProductService

  ngOnInit(): void {
    this.subscription = this.productService.getProducts().subscribe(products => { //suscripción al observable de productos
      this.products = products; 
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe(); //desuscripción del observable al destruir el componente
  }
}