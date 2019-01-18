import { ModalController } from 'ionic-angular';
import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Lead } from "../../models/lead";
import { AvatarPipe } from "../../pipes/avatar/avatar";

@Component({
  selector: "leads-list",
  templateUrl: "leads-list.html",
  providers: [AvatarPipe]
})
export class LeadsListComponent {
  @Input()
  leads: Lead[];
  @Input()
  title: string;

  @Output() itemClicked = new EventEmitter<Lead>();
  constructor() {}
  
  public onItemClicked(item: Lead) {
    this.itemClicked.emit(item);
  }
}
