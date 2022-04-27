import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiServiceService } from '../api-service.service';
import { format, parseISO } from 'date-fns';
import { IonRouterOutlet } from '@ionic/angular';
import {Book} from '../models';

@Component({
  selector: 'app-book',
  templateUrl: './book.page.html',
  styleUrls: ['./book.page.scss'],
})
export class BookPage implements OnInit {
  roomId: Number;
  room: any;
  bookings: Book[] = [];
  book: Book = new Book();
  bookings_states:  {current: Book[], previous: Book[], next: Book[]} = {current: [], previous: [], next: []};
  _modal_is_open: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiServiceService,
    public alertController: AlertController,
    public routerOutlet: IonRouterOutlet
  ) {}

  ngOnInit() {
    this.roomId = Number(this.activatedRoute.snapshot.paramMap.get('roomId'));
    this.apiService.getRoom(this.roomId).subscribe((r) => {
      console.log('Bookigns for room', r);
      this.room = r;
      this.bookings = this.room.bookings;
      let _bookings_states = <any>this.apiService.sortBooksState(this.bookings);
      this.bookings_states = {
        current: <Book[]>_bookings_states['current'],
        previous: <Book[]>_bookings_states['previous'],
        next: <Book[]>_bookings_states['next'],
      };
      console.log({ bookings_states: this.bookings_states });
    });
  }

  ionViewWillEnter() {
    this.ngOnInit();
  }

  openBookModal(room?: any, book?: any) {
    if (book) this.book = book;
    else this.book = new Book();
    this._modal_is_open = true;
  }

  onCloseModal(event: any) {
    this.book = new Book();
    this._modal_is_open = false;
    this.ngOnInit();
  }
}
