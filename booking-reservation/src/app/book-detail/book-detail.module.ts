import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookDetailPageRoutingModule } from './book-detail-routing.module';

import { BookDetailPage } from './book-detail.page';
import { BookDetailComponent } from './book-detail.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookDetailPageRoutingModule
  ],
  declarations: [BookDetailPage, BookDetailComponent]
})
export class BookDetailPageModule {}
