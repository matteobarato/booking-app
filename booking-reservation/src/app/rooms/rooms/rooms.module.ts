import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoomsPageRoutingModule } from './rooms-routing.module';

import { RoomsPage } from './rooms.page';
import { CalendarGanttModule } from 'src/app/calendar-gantt/calendar-gantt.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RoomsPageRoutingModule,
    CalendarGanttModule
  ],
  declarations: [RoomsPage],
  exports: []
})
export class RoomsPageModule {}
