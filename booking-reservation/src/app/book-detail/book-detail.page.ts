import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiServiceService } from '../api-service.service';

@Component({
  selector: 'app-book-detail-page',
  templateUrl: './book-detail.page.html',
  styleUrls: ['./book-detail.page.scss'],
})
export class BookDetailPage implements OnInit {
  roomId: number
  bookId: number
  room: any
  book: any

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiServiceService,
  ) { }
  ngOnInit() {
    this.roomId = Number(this.activatedRoute.snapshot.paramMap.get('roomId'));
    this.bookId = Number(this.activatedRoute.snapshot.paramMap.get('bookId'));

    this.apiService.getRoom(this.roomId).subscribe((r) => {
      console.log("Bookings for room", r)
      this.room = r;
      this.book = this.room.bookings.find(x => x.id == this.bookId)
    });
  }

}
