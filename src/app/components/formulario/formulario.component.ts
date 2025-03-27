import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css'],
})
export class FormularioComponent implements OnInit {
  productoForm!: FormGroup; //formaulario reactivo
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.initForm(); //inicialización del formulario
  }

  initForm(): void {
    //intForm inicializa el formulario reactivo con los campos requeridos y validadores
    this.productoForm = this.fb.group({
      reference: ['', [Validators.required, Validators.maxLength(10)]],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          this.duplicateNameValidator(),
        ],
      ],
      price: [
        '',
        [
          Validators.required,
          Validators.min(0.01),
          Validators.max(9999.99),
          Validators.pattern(/^\d+(\.\d{1,2})?$/),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(500),
        ],
      ],
      type: ['road', Validators.required],
      offer: [false],
    });

    this.productoForm.get('reference')?.valueChanges.subscribe((reference) => {
      //cada vez que el valor de referencia cambie, se llama a la función checkExistingProduct para verificar si existe un producto con la referencia ingresada y cargar los datos existentes
      if (reference && reference.length > 0) {
        this.checkExistingProduct(reference);
      }
    });
  }

  // validador personalizado para  el campo name que asegura que no haya nombres de productos duplicados
  duplicateNameValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      //
      if (!control.value) {
        return null;
      }

      const name = control.value; //obtener el valor del campo name
      const reference = this.productoForm?.get('reference')?.value; //obtener el valor del campo reference

      if (this.productService.isProductNameDuplicate(name, reference)) {
        //verificar si el nombre del producto ya existe
        return { duplicateName: true }; //si el nombre del producto ya existe, devuelve un error
      }

      return null;
    };
  }

  // Verificar si existe un producto con la misma referencia
  checkExistingProduct(reference: string): void {
    const existingProduct =
      this.productService.getProductByReference(reference); //obtener el producto existente por referencia

    if (existingProduct) {
      this.isEditMode = true; //activa el modo de edición si hay un producto existente

      // Rellena el formulario con los datos del producto existente
      this.productoForm.patchValue({
        name: existingProduct.name,
        price: existingProduct.price,
        description: existingProduct.description,
        type: existingProduct.type,
        offer: existingProduct.offer,
      });
    } else {
      // Si cambiamos a una referencia nueva, quitamos el modo de edición/actualización
      if (this.isEditMode) {
        this.isEditMode = false;

        // limpia los campos excepto la referencia
        this.productoForm.patchValue({
          name: '',
          price: '',
          description: '',
          type: 'road',
          offer: false,
        });
      }
    }
  }

  onSubmit(): void {
    //enviar el formulario
    if (this.productoForm.valid) {
      //verificar si el formulario es válido
      const product: Product = this.productoForm.value; //obtener los valores del formulario y asignarlos a la variable product

      if (this.isEditMode) {  //si estamos en modo de edición, actualizamos el producto
        this.productService.updateProduct(product);
        console.log('Producto actualizado:', product);
      } else {  //si no estamos en modo de edición, añadimos un nuevo producto
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
        offer: false,
      });

      this.isEditMode = false;  //desactivar el modo de edición
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.productoForm.controls).forEach((key) => {   //marcar todos los campos como tocados para mostrar errores
        const control = this.productoForm.get(key); 
        control?.markAsTouched();
      });
    }
  }
}
