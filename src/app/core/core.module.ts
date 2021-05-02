import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { environment } from '../../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material';


@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    HttpClientModule,

  ],
  exports: [],
  providers: [
    AuthService,
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 6000, verticalPosition: 'bottom'}}
  ]
})
export class CoreModule {
}
