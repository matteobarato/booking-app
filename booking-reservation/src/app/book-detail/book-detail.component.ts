import { Component, Input, OnInit } from '@angular/core';
import { AlertController, IonRouterOutlet } from '@ionic/angular';
import { ApiServiceService } from '../api-service.service';
import { format, parseISO } from 'date-fns';
import { Output, EventEmitter } from '@angular/core';
import { Book, BookStatus, Membro } from '../models';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss'],
})
export class BookDetailComponent implements OnInit {
  @Input()
  get _room(): any {
    return this.room;
  }
  set _room(room: Book) {
    this.room = room;
  }
  @Input()
  get _book(): Book {
    return this.book;
  }
  set _book(book: Book) {
    this.book = book || this.newBooking();
    if (!this.book.room) this.book.room = this.room.id;
  }

  @Output() _modal_status = new EventEmitter<boolean>();

  book: Book = new Book();
  room: any = undefined;
  _rooms: any[] = [];
  _book_status: BookStatus = new BookStatus();
  _rent_days: number = 0;

  constructor(
    private apiService: ApiServiceService,
    public alertController: AlertController,
    public routerOutlet: IonRouterOutlet
  ) {}

  ngOnInit() {
    this.apiService.getRoom().subscribe((rooms) => {
      this._rooms = <any[]>rooms;
      console.log('Book room', this.book.room);
      console.log('Booking detail rooms', this._rooms);
      this._rent_days = this.apiService.dayBewteen(
        <Date>this.book.start_at,
        <Date>this.book.end_at
      );
      this.updateTotal(this.book)
    });
  }

  newBooking() {
    let book: Book = new Book();
    book.room = this.room.id;
    book.status = 0;
    book._editable = true;
    book.is_online = this.room.is_online
    this.book = book;
    return this.book;
  }

  saveBooking(book: Book) {
    book.room = this.room.id;
    console.log("SAVING BOOK", book)
    this.apiService.updateBook(book).subscribe((b) => {
      if (b && b.id) {
        if (!book.id) this.room.bookings.push(book); // appena creato
        book.id = b.id;
        this.book.id = b.id;
      }
    });
  }

  async deleteBooking(book: Book) {
    const alert = await this.alertController.create({
      header: 'Attenzione!',
      message: '<h4>Sei sicuro di volere cancellare questa prontazione?.</h4>',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'Si',
          handler: () => {
            this.apiService.deleteBook(book).subscribe(() => {
              let idx = this.room.bookings.findIndex((r) => r.id == book.id);
              if (idx > -1) this.room.bookings.splice(idx, 1);
            });
          },
        },
      ],
    });

    await alert.present();
  }

  formatDate(value: string) {
    return format(parseISO(value).setHours(0, 0, 0, 0), 'MMM dd yyyy');
  }

  updateBookDayPrice() {
    this._rent_days = this.apiService.dayBewteen(
      <Date>this.book.start_at,
      <Date>this.book.end_at
    );
    if (!this.book.bill || !this.book.bill.length) {
      this.book.bill = [
        { key: 'Prezzo Soggiorno', value: 0 },
        { key: 'Tasse Soggiorno', value: 0 },
      ];
    }else{
      if (this.book.bill[0].key != 'Prezzo Soggiorno') this.book.bill[0].key = 'Prezzo Soggiorno'
      if (this.book.bill[1].key != 'Tasse Soggiorno') this.book.bill[1].key = 'Tasse Soggiorno'
    }
  }

  updateTotal(book: Book) {
    this.updateBookDayPrice()
    if (!book.bill.length) book._total = 0;
    else{
      let book_rent_price = (book.bill[0].value * this._rent_days + book.bill[1].value * this._rent_days)
      book._total = book.bill.length > 2 ? (book.bill.slice(2).map((x) => x.value).reduce((a, b) => a + b), 0) : 0 ;
      book._total += book_rent_price

    }

    return book._total;
  }

  addPeople() {
    console.log(this.book);
    this.book.people.membri_gruppo.push(new Membro());
  }

  removePeople(idx: number) {
    this.book.people.membri_gruppo.splice(idx, 1);
  }

  closeModal() {
    this.book = undefined;
    this.room = undefined;
    this._modal_status.emit(false);
  }

  compareRooms(a, b) {
    console.log('Compare, a, b', a, b);
    return a == b;
  }

  onChangeRoom(event: any) {
    let room_id = event.target.value;
    this.room = this._rooms.find((r) => r.id == room_id);
  }
}
