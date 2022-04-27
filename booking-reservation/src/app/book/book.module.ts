import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookPageRoutingModule } from './book-routing.module';

import { BookPage } from './book.page';
import { CalendarGanttModule } from '../calendar-gantt/calendar-gantt.module';
@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, BookPageRoutingModule, CalendarGanttModule],
  declarations: [BookPage],
})
export class BookPageModule {}
