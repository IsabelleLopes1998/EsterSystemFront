import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeUrlPipe } from './pipe/safe-url.pipe';
import { ZeroFormatPipe } from './pipe/zero-format.pipe';
import { PercentualFormatPipe } from './pipe/percentual-format';
import { CpfMaskPipe } from './pipe/cpfMask.pipe';
import { CnpjMaskPipe } from './pipe/CnpjMask.pipe';

@NgModule({
  declarations: [
    SafeUrlPipe,
    ZeroFormatPipe,
    PercentualFormatPipe,
    CpfMaskPipe,
    CnpjMaskPipe
  ],
  exports : [
    SafeUrlPipe,
    ZeroFormatPipe,
    PercentualFormatPipe,
    CpfMaskPipe,
    CnpjMaskPipe
  ],
  providers :[
  ],
  imports: [
    CommonModule
  ]
})
export class CoreModule { }
