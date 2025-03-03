import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-formulario',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.css'
})
export class FormularioComponent {
  productoForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.productoForm = this.fb.group({
      reference: ['', Validators.required], // Número de referencia obligatorio
      name: ['', Validators.required], // Nombre del producto obligatorio
      price: ['', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]], // Precio obligatorio y numérico
      description: ['', Validators.required], // Descripción obligatoria
      type: ['road'], // Tipo de producto (valor por defecto)
      offer: [false] // Producto de oferta (checkbox)
    });
  }

  onSubmit() {
    if (this.productoForm.valid) {
      console.log('Datos del formulario:', this.productoForm.value);
    } else {
      console.log('El formulario tiene errores');
    }
  }
}
