import { LeadTypeID } from './../../models/lead-property-metadata';
import { Component, ViewChild } from "@angular/core";
import { IonicPage, MenuController, NavController, Platform, Slides, NavParams } from "ionic-angular";
import { LeadPropertyMetadataProvider } from "../../providers/lead-property-metadata/lead-property-metadata";
import { LeadPropertyMetadata, PropertyOption, LeadPropertyType, DealType } from "../../models/lead-property-metadata";
import { NumberFormatPipe } from "../../pipes/number-format/number-format";
import { LeadsProvider } from "../../providers/leads/leads";
import { Lead } from "../../models/lead";

@IonicPage()
@Component({
  selector: "page-tutorial",
  templateUrl: "tutorial.html",
  providers: [NumberFormatPipe]
})
export class TutorialPage {
  public item: Lead;
  public resultLead: Lead;
  public leadPropertyType = LeadPropertyType;
  public leadPropertiesMetadata: LeadPropertyMetadata[];
  public dealType: number = DealType.Sell;

  public dir: string = "rtl";
  private showSkip: boolean = true;

  @ViewChild(Slides) slides: Slides;

  constructor(
    public navCtrl: NavController,
    public menu: MenuController,
    public platform: Platform,
    public numberFormatPipe: NumberFormatPipe,
    public leadPropertyMetadataProvider: LeadPropertyMetadataProvider,
    public leads: LeadsProvider,
    public navParams: NavParams) {
    this.item = navParams.get("item");
    this.dir = platform.dir();
    this.leadPropertiesMetadata = this.leadPropertyMetadataProvider.get().filter(x => !x.hidden);
  }

  public goToSlide(index: number) {
    setTimeout(() => {
      this.slides.slideTo(index);
    }, 300);
  }

  ionViewDidLoad() {
    this.leadPropertiesMetadata.forEach(slide =>
      LeadPropertyMetadata.reset(slide)
    );
    this.resultLead = new Lead(this.item.phone, this.item.name, this.item.type);
    this.dealType = this.leadPropertyMetadataProvider.getDealTypeByLeadType(this.item.type);
  }

  public onSlideChangeStart(slider) {
    this.showSkip = !slider.isEnd();
  }

  public addMetersSlide(index: number) {
    let metersId = "meters";

    if (!this.leadPropertiesMetadata.some(x => x.id === metersId)) {
      let data = this.leadPropertyMetadataProvider.get().find(x => x.id === metersId);
      this.leadPropertiesMetadata.splice(index + 1, 0, data);
    }

    this.goToSlide(index + 1);
  }

  answerButtonClick(slide: LeadPropertyMetadata, button: PropertyOption, index: number): void {
    button.selected = !button.selected;

    if (slide.type === LeadPropertyType.StringSingleValue) {
      this.handleSingleValueButtonClick(slide, button);
      this.goToSlide(index + 1);
    }
  }

  public getSlideValueString(property: LeadPropertyMetadata): String {
    let value = LeadPropertyMetadata.getValueString(property);
    if (!value) {
      value = "-";
    }

    return value;
  }

  setBudget(slide: LeadPropertyMetadata, value: number, index?: number) {
    let transform = this.numberFormatPipe.transform;
    this.resultLead.budget = value;
    slide.value = transform(value);
  }

  private handleSingleValueButtonClick(slide: LeadPropertyMetadata, button: PropertyOption) {
    if (button.selected) {
      slide.options.forEach(item => {
        item.selected = item === button ? true : false;
      });
    }
  }

  public submitSummary() {
    this.resultLead.area = this.getSimpleSlideValue("area");
    this.resultLead.property = this.getSimpleSlideValue("property");
    this.resultLead.rooms = this.getSimpleSlideValue("rooms");
    this.resultLead.source = this.getSimpleSlideValue("source");
    this.resultLead.meters = this.getSimpleSlideValue("meters");

    this.leads.add(this.resultLead).then(() =>
      this.navCtrl.setRoot(
        "TabsPage",
        { tab: "LeadsPage" },
        {
          animate: true,
          direction: "forward"
        }
      )
    );
  }

  private getSlide(propertyId: string) {
    return this.leadPropertiesMetadata.find(slide => slide.id === propertyId);
  }

  public isSlideActive(slide: LeadPropertyMetadata): boolean {
    let slideIndex = this.leadPropertiesMetadata.indexOf(slide);

    return this.slides.getActiveIndex() === slideIndex;
  }

  private getSimpleSlideValue(propertyId: string): any {
    let propertyMetadata = this.leadPropertiesMetadata.find(
      prop => prop.id === propertyId
    );

    let slideValues = this.getSlide(propertyId)
      .options.filter(button => button.selected)
      .map(button => button.title);

    switch (propertyMetadata.type) {
      case LeadPropertyType.StringSingleValue:
        if (slideValues.length === 1) {
          return slideValues[0];
        }
        break;
      case LeadPropertyType.StringMultivalue:
        return slideValues;
    }

    return null;
  }
}
