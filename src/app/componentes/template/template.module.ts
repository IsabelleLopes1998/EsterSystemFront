import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateComponent } from './template.component';
import { PanelMenuModule } from 'primeng/panelmenu';
import { SidebarModule } from 'primeng/sidebar';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { PrimeNgModule } from 'src/app/componentes/primeng/primeng.module';



@NgModule({
  declarations: [TemplateComponent],
  imports: [
    CommonModule,
    RouterModule,
    PanelMenuModule,
    SidebarModule,
    ToolbarModule,
    ButtonModule,
    AvatarModule,
    DynamicDialogModule,
    PrimeNgModule
  ],
  exports: [TemplateComponent],
})
export class TemplateModule {}
