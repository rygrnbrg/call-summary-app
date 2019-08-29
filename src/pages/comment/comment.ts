import { LeadsProvider } from './../../providers/leads/leads';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Comment } from '../../models/comment';
import { Lead } from '../../models/lead';

@IonicPage()
@Component({
  selector: 'page-comment',
  templateUrl: 'comment.html',
})
export class CommentPage {
  public text: string = "";
  public lead: Lead;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    public leadsProvider: LeadsProvider) {
    this.lead = this.navParams.get("lead");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommentPage');
  }

  public cancel() {
    this.viewCtrl.dismiss();
  }

  public submit() {
    if (this.text.length) {
      let comment = new Comment(this.text);
      this.leadsProvider.addComment(this.lead, comment).then(()=>{
        this.viewCtrl.dismiss({success: true});
      });
    }
  }
}
