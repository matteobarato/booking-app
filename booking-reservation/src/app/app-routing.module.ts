import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'rooms',
    pathMatch: 'full'
  },
  {
    path: 'rooms',
    loadChildren: () => import('./rooms/rooms/rooms.module').then( m => m.RoomsPageModule)
  },
  {
    path: 'rooms/:roomId/bookings',
    loadChildren: () => import('./book/book.module').then( m => m.BookPageModule)
  },
  {
    path: 'rooms/:roomId/bookings/:bookId',
    loadChildren: () => import('./book-detail/book-detail.module').then( m => m.BookDetailPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
