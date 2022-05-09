import { Component, Input, OnInit } from '@angular/core';
import { format, parseISO } from 'date-fns';
import { ta } from 'date-fns/locale';
declare var Gantt;

class GanttTask {
  id: string;
  group_id: number
  name: string;
  start: string;
  end: string;
  ref: any;
  progress: number = 100;
  title: string = ''
  dependencies: string = '';
  custom_class: string = '';
  start_at: string;
  end_at: string;
}

@Component({
  selector: 'app-calendar-gantt',
  templateUrl: './calendar-gantt.component.html',
  styleUrls: ['./calendar-gantt.component.scss'],
})
export class CalendarGanttComponent implements OnInit {
  @Input()
  get _rooms(): any {
    return this.rooms;
  }
  set _rooms(rooms: any) {
    if (!rooms.length && rooms.id) {
      rooms = [rooms]
    }
    // console.log(rooms);
    this.rooms = rooms;
    if (!rooms || !rooms.length) this.tasks = [];
    else this.ngOnInit()
  }
  tasks: GanttTask[] = [];
  rooms: any[] = [];
  gantt: any;
  gantt_id: number;
  gantt_options: any = {
    header_height: 20,
    step: 24 * 2,
    view_modes: ['Day', 'Week'],
    bar_height: 20 * 3,
    bar_corner_radius: 3 * 5,
    arrow_curve: 5,
    padding: 18,
    view_mode: 'Day',
    date_format: 'DD-MM-YYYY',
    language: 'it',
    popup_trigger: 'mouseover',
    custom_popup_html: (task) => {
      // the task object will contain the updated
      // dates and progress value
      // console.log(task)
      const end_date = this.formatDate(task.end_at)
      const start_date = this.formatDate(task.start_at)
      const status_label = task.ref['status'] == 1? 'Confermato': task.ref['status'] == -1? 'Cancellata':  task.ref['status'] == 0 ? 'In Attesa' : task.ref['status'] == 2 ? 'Booking' : 'Bozza';
      return `
      <ion-card>
        <ion-card-container>
        <ion-item>
        <ion-button shape="round" fill="clear" slot="end" href="/rooms/${task.ref['room']}/bookings/${task.ref['id']}">
        <ion-icon slot="icon-only" name="arrow-redo-outline"></ion-icon>
      </ion-button>
      <ion-label>
      <ion-card-subtitle>${task.title}</ion-card-subtitle>

      </ion-label>
        </ion-item>
        <ion-item>
                  <ion-icon slot="start" color="primary" icon="calendar-number-outline"></ion-icon>
                    <ion-button fill="clear">
                      <ion-text>Dal: ${start_date}</ion-text>
                    </ion-button>
                  <ion-text>&nbsp;/&nbsp;</ion-text>
                    <ion-button fill="clear">
                      <ion-text>Al: ${end_date}</ion-text>
                    </ion-button>
        </ion-item>
        <ion-item>
          <ion-icon name="people-outline" color="primary" slot="start"></ion-icon>
            <ion-button fill="clear">
              <ion-text>${task.ref['peopleNumber']}</ion-text>
            </ion-button>
        </ion-item>
        <ion-item>
        <ion-icon name="information-circle-outline" color="primary" slot="start"></ion-icon>
          <ion-button fill="clear">
            <ion-text>${status_label}<ion-text>
          </ion-button>
        </ion-item>
        `+
        (task.ref['is_online'] ?
          `<ion-item>
        <ion-icon name="cloud-done-outline" color="primary" slot="start"></ion-icon>
                  <ion-label color="primary">
                    <b>Booking</b>
                  </ion-label>
        </ion-item>`: ``) + `
        <ion-card-container>
      </ion-card>
      `;
    },
  }
  _ready: boolean = false

  constructor() {
    this.gantt_id = Math.round(Math.random() * 1e8);
  }

  ngOnInit() {
    let _i = setInterval(() => {
      if (document.querySelector('#gantt-' + this.gantt_id)) {
        if (this.rooms && this.rooms.length) this.tasks = this.updateTaskFromRooms(this.rooms)
        this.gantt = new Gantt('#gantt-' + this.gantt_id, this.tasks, this.gantt_options);
        clearInterval(_i);
        console.log('Calendar loaded in #gantt-' + this.gantt_id);
        this._ready = true
      }
    }, 500);
  }

  updateTaskFromRooms(rooms: any[]): GanttTask[] {
    let tasks: GanttTask[] = [];
    for (let [room_index, room] of rooms.entries()) {
      if (!room['bookings']) continue;
      let book_tasks: GanttTask[] = room['bookings'].sort((a,b)=>(-a.status+b.status)).map((b) => {
        let t: GanttTask = new GanttTask();
        t.id = `${room['id']}-${b.id}`;
        t.group_id = room['name']
        t.start = new Date(b.start_at).toISOString();
        t.end = new Date(new Date(b.end_at).setHours(0, 0, 0, 0)).toISOString();
        t.start_at = new Date(b.start_at).toISOString();
        t.end_at = new Date(b.end_at).toISOString();
        if (b.status == 2) {
          t.name = t.title = '[Booking]'
        } else {
          t.name = `[${room['name']}]: ${(b.people.cognome_nome || '').substr(0, 10) + '...' || ''
            }.`;
          t.title = `[${room['name']}]: ${b.people.cognome_nome || ''}`
        }
        t.ref = b
        t.custom_class =
          'gantt_task_status_' + b.status + ' gantt_task_room_' + (room_index + 1);

        // Setting color based on roomId
        // document.documentElement.style.setProperty('--room-color-' + (room_index + 1), room.color);

        return t;
      });
      tasks = tasks.concat(book_tasks);
    }
    // console.log('Gantt Tasks', tasks);
    return tasks;
  }

  _ganttChangeView(view: string) {
    this.gantt.change_view_mode(view)
  }

  formatDate(value: string, type: String = 'dd MM') {
    return format(new Date(value), <any>type);
  }
}
