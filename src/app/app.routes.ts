import { Routes } from '@angular/router';
import { BodyComponent } from './components/body/body.component';
import { FormularioComponent } from './components/formulario/formulario.component';
import { ProductosComponent } from './components/productos/productos.component';


export const routes: Routes = [
    {path: '', component: BodyComponent},
    {path: 'formulario', component: FormularioComponent },
    {path: 'productos', component: ProductosComponent }
];
