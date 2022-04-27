import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarGanttComponent } from './calendar-gantt.component';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [CalendarGanttComponent],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [CalendarGanttComponent]
})
export class CalendarGanttModule { }
