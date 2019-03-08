import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, ViewController, NavParams } from 'ionic-angular';
import { Lead } from '../../models/lead';
import { AvatarPipe } from '../../pipes/avatar/avatar';

@IonicPage()
@Component({
  selector: 'page-item-create',
  templateUrl: 'item-create.html',
  providers: [AvatarPipe]
})
export class ItemCreatePage {
  @ViewChild('fileInput') fileInput;

  isReadyToSave: boolean;
  item: any;
  form: FormGroup;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public formBuilder: FormBuilder,
    public navParams: NavParams, 
    public avatarPipe: AvatarPipe) {
    let paramsLead = navParams.get("item");
    let lead: Lead = paramsLead ? paramsLead : new Lead("", "");
    this.form = formBuilder.group({
      profilePic: [lead.avatar],
      name: [lead.name, Validators.required],
      phone: [lead.phone]
    });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ionViewDidLoad() {

  }

  processWebImage(event) {
    let reader = new FileReader();
    reader.onload = (readerEvent) => {

      let imageData = (readerEvent.target as any).result;
      this.form.patchValue({ 'profilePic': imageData });
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  getProfileImageStyle() {
      let avatar = this.avatarPipe.transform(this.form.controls['profilePic'].value);
      return 'url(' + avatar + ')';
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  done() {
    if (!this.form.valid) { return; }
    this.navCtrl.push('TutorialPage', {
      item: new Lead(this.form.value.phone, this.form.value.name, this.form.controls['profilePic'].value)
    });
    // this.viewCtrl.dismiss(this.form.value);
  }
}
