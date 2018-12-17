import { Component, ViewChild } from '@angular/core';
import { IonicPage, MenuController, NavController, Platform, Slides, NavParams } from 'ionic-angular';
import { SummarySlidesProvider } from '../../providers/summary-slides/summary-slides'
import { SummarySlide, ActionButton } from '../../models/summary-slide'
import { NumberFormatPipe } from '../../pipes/number-format/number-format';
import { LeadsProvider } from '../../providers/leads/leads';
import { Lead } from '../../models/lead';


@IonicPage()
@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html',
  providers: [NumberFormatPipe]
})
export class TutorialPage {
  public priceRange;
  public item: Lead;
  tutorialSlides: SummarySlide[];
  showSkip = true;
  dir: string = 'rtl';

  @ViewChild(Slides) slides: Slides;

  constructor
  (public navCtrl: NavController, 
    public menu: MenuController, 
    public platform: Platform, 
    public numberFormatPipe: NumberFormatPipe,
    public summarySlides: SummarySlidesProvider,
    public leads: LeadsProvider, 
    public navParams: NavParams) {
      this.item = navParams.get('item');
      this.dir = platform.dir();
      this.tutorialSlides = summarySlides.get();
      this.priceRange = { lower: 15, upper: 30 };
  }

  goToSlide(index: number) {
    setTimeout(() => {
      this.slides.slideTo(index);    
    }, 300);
  }

  
  startApp() {
    this.navCtrl.setRoot('WelcomePage', {}, {
      animate: true,
      direction: 'forward'
    });
  }

  onSlideChangeStart(slider) {
    this.showSkip = !slider.isEnd();
  }

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    // this.menu.enable(false);
  }

  ionViewWillLeave() {
    // enable the root left menu when leaving the tutorial page
    // this.menu.enable(true);
  }

  answerButtonClick(slide: SummarySlide, button: ActionButton, index: number): void {
    button.selected = !button.selected;

    if (!slide.multiValue){
      this.handleSingleValueButtonClick(slide,button,index);
      this.goToSlide(index +1);
    }
 } 

  getSlideValueString(slide: SummarySlide): String {
    return SummarySlide.getValueString(slide);
  }

  setBudget(slide: SummarySlide){
    let transform = this.numberFormatPipe.transform;
    slide.value= [transform(this.priceRange.lower * 100000), transform(this.priceRange.upper* 100000)];
  }

  private handleSingleValueButtonClick(slide: SummarySlide, button: ActionButton, index: number){
    if (button.selected){
      slide.buttons.forEach((item)=> { item.selected = item===button? true : false;});
    }   
   }
  
   submitSummary(){
     let info = {};
     this.tutorialSlides.forEach((slide)=>{
       info[slide.id] = this.getSlideValueString(slide);
     });
     let lead = new Lead(this.item.phone, this.item.name, info, this.item.avatar);

     this.leads.add(lead).then(()=>this.navCtrl.setRoot('TabsPage', { tab: 'ListMasterPage'}, {
      animate: true,
      direction: 'forward'
     }));
   }
}
