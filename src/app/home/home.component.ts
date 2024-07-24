import { Component, ViewChild } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { ProductComponent } from '../components/product/product.component';
import { Product, Products } from '../../types';
import { CommonModule } from '@angular/common';
import { Paginator, PaginatorModule, PaginatorState } from 'primeng/paginator';
import { EditPopupComponent } from '../components/edit-popup/edit-popup.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ProductComponent,
    CommonModule,
    PaginatorModule,
    EditPopupComponent,
    ButtonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor(private productsService: ProductsService) {}

  @ViewChild('paginator') paginator: Paginator | undefined;

  private baseUrl: string = 'http://localhost:3000'; // move to some config file
  products: Product[] = [];
  totalRecords: number = 0;
  rows: number = 5;

  displayAddPopup: boolean = false;
  displayEditPopup: boolean = false;

  toggleEditPopup(product: Product) {
    this.selectedProduct = product;
    this.displayEditPopup = true;
  }
  toggleAddPopup() {
    this.displayAddPopup = true;
  }

  toggleDeletePopup(id: number) {
    this.deleteProduct(id);
  }

  selectedProduct: Product = {
    id: 0,
    name: '',
    image: '',
    price: '',
    rating: 0,
  };

  resetPaginator() {
    this.paginator?.changePage(0);
  }

  fetchProducts(page: number, perPage: number) {
    this.productsService
      .getProducts(`${this.baseUrl}/clothes`, { page, perPage })
      .subscribe({
        next: (data: Products) => {
          this.products = data.items;
          this.totalRecords = data.total;
        },
        error: (error) => console.error(error),
      });
  }

  onPageChange(event: PaginatorState) {
    this.fetchProducts(event.page!, event.rows!);
  }

  editProduct(product: Product, id: number) {
    console.log('Editing product', product.name);
    this.productsService
      .editProduct(`${this.baseUrl}/clothes/${id}`, product)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.fetchProducts(0, this.rows);
          this.resetPaginator();
        },
        error: (error) => console.error(error),
      });
  }

  deleteProduct(id: number) {
    console.log('Deleting product', id);
    this.productsService
      .deleteProduct(`${this.baseUrl}/clothes/${id}`)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.fetchProducts(0, this.rows);
          this.resetPaginator();
        },
        error: (error) => console.error(error),
      });
  }

  addProduct(product: Product) {
    console.log('Adding product', product.name);
    this.productsService
      .addProduct(`${this.baseUrl}/clothes/`, product)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.fetchProducts(0, this.rows);
          this.resetPaginator();
        },
        error: (error) => console.error(error),
      });
  }

  onConfirmAdd(product: Product) {
    this.addProduct(product);
    this.displayAddPopup = false;
  }

  onConfirmEdit(product: Product) {
    if (!this.selectedProduct.id) {
      return;
    }

    this.editProduct(product, this.selectedProduct.id);
    this.displayEditPopup = false;
  }

  ngOnInit() {
    this.fetchProducts(0, this.rows);
  }

  onProductOutput(product: Product) {
    console.log('Output: ', product);
  }
}
