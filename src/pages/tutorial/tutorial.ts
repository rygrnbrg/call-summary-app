import { Component, ViewChild } from '@angular/core';
import { IonicPage, MenuController, NavController, Platform, Slides, NavParams } from 'ionic-angular';
import { LeadPropertyMetadataProvider } from '../../providers/summary-slides/summary-slides'
import { LeadPropertyMetadata, PropertyOption, LeadPropertyType } from '../../models/lead-property-metadata'
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
  public leadPropertyType = LeadPropertyType;
  tutorialSlides: LeadPropertyMetadata[];
  showSkip = true;
  dir: string = 'rtl';

  @ViewChild(Slides) slides: Slides;

  constructor(
    public navCtrl: NavController, public menu: MenuController, public platform: Platform,
    public numberFormatPipe: NumberFormatPipe, public leadPropertyMetadataProvider: LeadPropertyMetadataProvider,
    public leads: LeadsProvider, public navParams: NavParams) {
    this.item = navParams.get('item');
    this.dir = platform.dir();
    this.priceRange = { lower: 15, upper: 30 };
    this.tutorialSlides = this.leadPropertyMetadataProvider.get();
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
    this.tutorialSlides.forEach(slide => LeadPropertyMetadata.reset(slide));
    this.resultLead = new Lead(this.item.phone, this.item.name);
  }

  answerButtonClick(slide: LeadPropertyMetadata, button: PropertyOption, index: number): void {
    button.selected = !button.selected;

    if (slide.type === LeadPropertyType.StringSinglValue) {
      this.handleSingleValueButtonClick(slide, button, index);
      this.goToSlide(index + 1);
    }
  }

  getSlideValueString(slide: LeadPropertyMetadata): String {
    return LeadPropertyMetadata.getValueString(slide);
  }

  setBudget(slide: LeadPropertyMetadata) {
    this.resultLead.budgetMin = this.scalePriceRangeValue(this.priceRange.lower);
    this.resultLead.budgetMax = this.scalePriceRangeValue(this.priceRange.upper);

    let transform = this.numberFormatPipe.transform;

    slide.value = [transform(this.resultLead.budgetMin), transform(this.resultLead.budgetMax)];

  }

  private scalePriceRangeValue(value: number) {
    return value * 100000;
  }

  private handleSingleValueButtonClick(slide: LeadPropertyMetadata, button: PropertyOption, index: number) {
    if (button.selected) {
      slide.options.forEach((item) => { item.selected = item === button ? true : false; });
    }
  }

  submitSummary() {
    this.resultLead.area = this.getSimpleSlideValue('area');
    this.resultLead.property = this.getSimpleSlideValue('property');
    this.resultLead.rooms = this.getSimpleSlideValue('rooms');
    this.resultLead.source = this.getSimpleSlideValue('source');
    this.resultLead.type = this.getSimpleSlideValue('type');

    this.leads.add(this.resultLead).then(() => this.navCtrl.setRoot('TabsPage', { tab: 'LeadsPage' }, {
      animate: true,
      direction: 'forward'
    }));
  }

  private getSlide(propertyId: string) {
    return this.tutorialSlides.find(slide => slide.id === propertyId);
  }

  private getSimpleSlideValue(propertyId: string): string[] {
    return this.getSlide(propertyId).options.filter(button => button.selected).map(button => button.title);
  }
}
