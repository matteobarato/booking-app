import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiServiceService {
  apiUrl: string = environment.apiUrl;

  constructor(
    public http: HttpClient,
    public toastController: ToastController
  ) {}

  getRoom(roomId: any = undefined) {
    if (!roomId) roomId = '';
    return this.http.get(`${this.apiUrl}/room/${roomId}`);
  }
  updateRoom(room: any) {
    let action;
    if (!room.id) {
      // create
      action = this.http.post(`${this.apiUrl}/room`, room);
    } else {
      // update
      action = this.http.patch(`${this.apiUrl}/room/${room.id}`, room);
    }

    return action.pipe(
      map((res: HttpResponse<any>) => {
        //same type as above statement
        console.log(res);
        this.presentToast(
          'success',
          room.id ? 'Stanza aggiornata' : 'Stanza creata'
        );

        return res;
      }),
      catchError((err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', err.error.message);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          console.error(
            `Backend returned code ${err.status}, body was: ${err.error}`
          );
        }
        this.presentToast('danger', err.error.msg);
        // ...optionally return a default fallback value so app can continue (pick one)
        // which could be a default value
        // return Observable.of<any>({my: "default value..."});
        // or simply an empty observable
        return throwError(err);
      })
    );
  }
  deleteRoom(room: any) {
    return this.http.delete(`${this.apiUrl}/room/${room.id}`);
  }

  getBook(bookId: any = undefined) {
    if (!bookId) bookId = '';
    return this.http.get(`${this.apiUrl}/book/${bookId}`);
  }
  updateBook(book: any) {
    let action;

    if (!book.id) {
      // create
      action = this.http.post(`${this.apiUrl}/book`, book);
    } else {
      // update
      action = this.http.patch(`${this.apiUrl}/book/${book.id}`, book);
    }

    return action.pipe(
      map((res: HttpResponse<any>) => {
        //same type as above statement
        console.log(res);
        this.presentToast(
          'success',
          book.id ? 'Prenotazione aggiornata' : 'Preontazione creata'
        );

        return res;
      }),
      catchError((err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', err.error.message);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          console.error(
            `Backend returned code ${err.status}, body was: ${err.error}`
          );
        }
        this.presentToast('danger', err.error.msg);
        // ...optionally return a default fallback value so app can continue (pick one)
        // which could be a default value
        // return Observable.of<any>({my: "default value..."});
        // or simply an empty observable
        return throwError(err);
      })
    );
  }
  deleteBook(book: any) {
    return this.http.delete(`${this.apiUrl}/book/${book.id}`);
  }

  sortBooksState(books: any[]){
    let states = {previous:[], currents:[], next:[]}
    
    books
    .sort((a, b) => new Date(a.start_at).getTime()- new Date(b.start_at).getTime())
    .forEach(b=> {
      let state = this.currentDate(b.start_at, b.end_at)
      if (state < 0) states.previous.push(b)
      else if (state == 0) states.currents.push(b)
      else if (state > 0) states.next.push(b)
    })
    return states
  }

  currentDate(start:Date|number, end:Date|number, now?:number){
    if (!now) now = new Date().getTime()
    start = new Date(start).getTime()
    end = new Date(end).getTime()

    // Passata
    if (now > end) return 1
    // Corrente
    if (now>=start && now<=end) return 0
    // Futura
    if (now < start) return -1
  }

  dayBewteen(start:Date|number, end:Date|number){
    start = new Date(start).getTime()
    end = new Date(end).getTime()
    let difference = Math.abs(end - start)
    console.log(difference)
    return Math.ceil(difference / (1000 * 3600 * 24));
  }
 

  async presentToast(status, msg) {
    const toast = await this.toastController.create({
      message: msg,
      color: status,
      duration: 2000,
      icon: status=='danger'? 'close-circle-outline':'checkmark-outline',
      position: 'bottom',
    });
    toast.present();
  }

  async presentToastWithOptions() {
    const toast = await this.toastController.create({
      header: 'Toast header',
      message: 'Click to Close',
      icon: 'close-circle-outline',
      position: 'top',
      buttons: [
        {
          side: 'start',
          icon: 'star',
          text: 'Favorite',
          handler: () => {
            console.log('Favorite clicked');
          },
        },
        {
          text: 'Done',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
      ],
    });
    await toast.present();

    const { role } = await toast.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }
}
