import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { Product } from '../../../types';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-edit-popup',
  standalone: true,
  imports: [
    DialogModule,
    CommonModule,
    FormsModule,
    RatingModule,
    ButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-popup.component.html',
  styleUrl: './edit-popup.component.scss',
})
export class EditPopupComponent {
  constructor(private formBuilder: FormBuilder) {}

  @Input() display: boolean = false;
  @Output() displayChange = new EventEmitter<boolean>();

  @Output() confirm = new EventEmitter<Product>();
  @Input({ required: true }) header!: string;

  @Input() product: Product = {
    name: '',
    image: '',
    price: '',
    rating: 0,
  };

  // CUSTOM FORM VALIDATOR
  specialCharacterValidator(): ValidatorFn {
    return (control) => {
      const hasSpecialCharacter = /a/.test(control.value);

      return hasSpecialCharacter ? { hasSpecialCharacter: true } : null;
    };
  }

  // FORM
  productForm = this.formBuilder.group({
    name: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        // this.specialCharacterValidator(),
      ],
    ],
    image: [''],
    price: ['', [Validators.required]],
    rating: [0],
  });

  onConfirm() {
    const { name, image, price, rating } = this.productForm.value;

    this.confirm.emit({
      name: name || '',
      image: image || '',
      price: price || '',
      rating: rating || 0,
    });

    this.display = false;
    this.displayChange.emit(this.display);
  }

  onCancel() {
    this.display = false;
    this.displayChange.emit(this.display);
  }

  ngOnChanges() {
    // POPULATE THE FORM
    this.productForm.patchValue(this.product);
  }
}
