import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ApiServiceService } from 'src/app/api-service.service';
import {Room} from '../../models';
declare var Coloris:any;



@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.page.html',
  styleUrls: ['./rooms.page.scss'],
})
export class RoomsPage implements OnInit {
  rooms:Room[] = []
  constructor(public alertController: AlertController, private apiService:ApiServiceService) { 
    Coloris({
      parent: '.container',
      el: '.color-field',   
      wrap: true,
      // Available themes: default, large, polaroid.
      theme: 'default',

      // Set the theme to light or dark mode:
      // * light: light mode (default).
      // * dark: dark mode.
      // * auto: automatically enables dark mode when the user prefers a dark color scheme.
      themeMode: 'light',
      margin: 2,
      format: 'hex',
      formatToggle: false,
      alpha: false,
      swatchesOnly: false,
      focusInput: true,
      clearButton: {
        show: true,
        label: 'Reset'
      },   
      swatches: [
        '#DFFF00',
        '#FFBF00',
        '#FF7F50',
        '#DE3163',
        '#9FE2BF',
        '#40E0D0',
        '#6495ED',
        '#CCCCFF',
        '#EE82EE',
        '#98FB98',
        '#FFDEAD'
      ]
    });
  }

  ngOnInit() {
    this.apiService.getRoom().subscribe((rooms)=>{
      this.rooms = <Room[]>rooms
    })
  }

  newRoom(){
    let room = new Room()
    room._editable = true
    this.rooms.push(room)
  }

  saveRoom(room:Room){
    let r = {...room}
    delete r.bookings
    this.apiService.updateRoom(r).subscribe((r:Room)=>{
      console.log("Saved room",r)
      room.id = r.id
    })
  }

  async deleteRoom(room) {
    const alert = await this.alertController.create({
      header: 'Attenzione!',
      message: '<h4>Sei sicuro di volere rimuovere questa Stanza?</h4><br>Tutte le prenotazioni relative verranno rimosse.',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Si',
          handler: () => {
            this.apiService.deleteRoom(room).subscribe(()=>{
              let idx = this.rooms.findIndex(r=>r.id==room.id)
              if (idx > -1) this.rooms.splice(idx,1)
            })
          }
        }
      ]
    });

    await alert.present();
  }

  openColorPicker(room:Room){
    if (room._editable) (<HTMLElement>document.querySelector('#data-coloris-'+room.id)).click()
  }
}
