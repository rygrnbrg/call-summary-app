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
  public resultLead: Lead;
  tutorialSlides: SummarySlide[];
  showSkip = true;
  dir: string = 'rtl';

  @ViewChild(Slides) slides: Slides;

  constructor(
    public navCtrl: NavController, public menu: MenuController, public platform: Platform,
    public numberFormatPipe: NumberFormatPipe, public summarySlides: SummarySlidesProvider,
    public leads: LeadsProvider, public navParams: NavParams) {
    this.item = navParams.get('item');
    this.dir = platform.dir();
    this.priceRange = { lower: 15, upper: 30 };
    this.tutorialSlides = this.summarySlides.get();
  }

  goToSlide(index: number) {
    setTimeout(() => {
      this.slides.slideTo(index);
    }, 300);
  }

  onSlideChangeStart(slider) {
    this.showSkip = !slider.isEnd();
  }

  ionViewDidLoad() {
    this.tutorialSlides.forEach(slide => SummarySlide.reset(slide));
    this.resultLead = new Lead(this.item.phone, this.item.name);
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

    if (!slide.multiValue) {
      this.handleSingleValueButtonClick(slide, button, index);
      this.goToSlide(index + 1);
    }
  }

  getSlideValueString(slide: SummarySlide): String {
    return SummarySlide.getValueString(slide);
  }

  setBudget(slide: SummarySlide) {
    this.resultLead.budgetMin = this.scalePriceRangeValue(this.priceRange.lower);
    this.resultLead.budgetMax = this.scalePriceRangeValue(this.priceRange.upper);

    let transform = this.numberFormatPipe.transform;

    slide.value = [transform(this.resultLead.budgetMin), transform(this.resultLead.budgetMax)];

  }

  private scalePriceRangeValue(value: number) {
    return value * 100000;
  }

  private handleSingleValueButtonClick(slide: SummarySlide, button: ActionButton, index: number) {
    if (button.selected) {
      slide.buttons.forEach((item) => { item.selected = item === button ? true : false; });
    }
  }

  submitSummary() {
    this.resultLead.area = this.getSimpleSlideValue('area');
    this.resultLead.property = this.getSimpleSlideValue('property');
    this.resultLead.rooms = this.getSimpleSlideValue('rooms');
    this.resultLead.source = this.getSimpleSlideValue('source');
    this.resultLead.type = this.getSimpleSlideValue('type');

    this.leads.add(this.resultLead).then(() => this.navCtrl.setRoot('TabsPage', { tab: 'ListMasterPage' }, {
      animate: true,
      direction: 'forward'
    }));
  }

  private getSlide(slideId: string) {
    return this.tutorialSlides.find(slide => slide.id === slideId);
  }

  private getSimpleSlideValue(slideId): string[] {
    return this.getSlide(slideId).buttons.filter(button => button.selected).map(button => button.title);
  }
}
