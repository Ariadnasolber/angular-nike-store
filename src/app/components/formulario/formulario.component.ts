import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {
  productoForm!: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.productoForm = this.fb.group({
      reference: ['', [Validators.required, Validators.maxLength(10)]],
      name: ['', [
        Validators.required, 
        Validators.minLength(3), 
        Validators.maxLength(50),
        this.duplicateNameValidator()
      ]],
      price: ['', [
        Validators.required, 
        Validators.min(0.01), 
        Validators.max(9999.99),
        Validators.pattern(/^\d+(\.\d{1,2})?$/)
      ]],
      description: ['', [
        Validators.required, 
        Validators.minLength(10), 
        Validators.maxLength(500)
      ]],
      type: ['road', Validators.required],
      offer: [false]
    });

    // Escuchar cambios en el campo de referencia para cargar datos existentes
    this.productoForm.get('reference')?.valueChanges.subscribe(reference => {
      if (reference && reference.length > 0) {
        this.checkExistingProduct(reference);
      }
    });
  }

  // Validador personalizado para nombres duplicados
  duplicateNameValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      
      const name = control.value;
      const reference = this.productoForm?.get('reference')?.value;
      
      if (this.productService.isProductNameDuplicate(name, reference)) {
        return { duplicateName: true };
      }
      
      return null;
    };
  }

  // Verificar si existe un producto con la referencia ingresada
  checkExistingProduct(reference: string): void {
    const existingProduct = this.productService.getProductByReference(reference);
    
    if (existingProduct) {
      this.isEditMode = true;
      
      // Actualizar el formulario con los datos del producto existente
      this.productoForm.patchValue({
        name: existingProduct.name,
        price: existingProduct.price,
        description: existingProduct.description,
        type: existingProduct.type,
        offer: existingProduct.offer
      });
    } else {
      // Si cambiamos a una referencia nueva, resetear el modo de edición
      if (this.isEditMode) {
        this.isEditMode = false;
        
        // Limpiar los campos excepto la referencia
        this.productoForm.patchValue({
          name: '',
          price: '',
          description: '',
          type: 'road',
          offer: false
        });
      }
    }
  }

  onSubmit(): void {
    if (this.productoForm.valid) {
      const product: Product = this.productoForm.value;
      
      if (this.isEditMode) {
        this.productService.updateProduct(product);
        console.log('Producto actualizado:', product);
      } else {
        this.productService.addProduct(product);
        console.log('Producto añadido:', product);
      }
      
      // Resetear el formulario después de enviar
      this.productoForm.reset({
        reference: '',
        name: '',
        price: '',
        description: '',
        type: 'road',
        offer: false
      });
      
      this.isEditMode = false;
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.productoForm.controls).forEach(key => {
        const control = this.productoForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}