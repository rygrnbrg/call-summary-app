import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Lead } from '../../models/lead';
import { AvatarPipe } from '../../pipes/avatar/avatar';

@Component({
  selector: 'leads-list',
  templateUrl: 'leads-list.html',
  providers: [AvatarPipe]
})
export class LeadsListComponent {
  @Input()  leads: Lead[];
  @Output() itemClicked = new EventEmitter<Lead>();
  constructor() {

  }

  onItemClicked(item: Lead){
    this.itemClicked.emit(item);
  }
}
