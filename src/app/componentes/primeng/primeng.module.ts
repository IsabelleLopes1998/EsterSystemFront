import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';

@NgModule({
  declarations: [],
  imports: [
  ],
  exports: [
    ButtonModule,
    InputTextModule,
    TableModule,
    PanelModule,
    CardModule,
    DialogModule,
    DividerModule
  ]
})
export class PrimeNgModule { }
