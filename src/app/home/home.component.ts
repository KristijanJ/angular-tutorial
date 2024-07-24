import { Component } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { ProductComponent } from '../components/product/product.component';
import { Product } from '../../types';
import { CommonModule } from '@angular/common';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductComponent, CommonModule, PaginatorModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor(private productsService: ProductsService) {}

  products: Product[] = [];
  totalRecords: number = 0;
  rows: number = 5;

  fetchProducts(page: number, perPage: number) {
    this.productsService
      .getProducts('http://localhost:3000/clothes', {
        page,
        perPage,
      })
      .subscribe((products) => {
        this.products = products.items;
        this.totalRecords = products.total;
      });
  }

  onPageChange(event: PaginatorState) {
    this.fetchProducts(event.page!, event.rows!);
  }

  ngOnInit() {
    this.fetchProducts(0, this.rows);
  }

  onProductOutput(product: Product) {
    console.log('Output: ', product);
  }
}
