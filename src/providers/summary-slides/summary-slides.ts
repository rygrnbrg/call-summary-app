import { Injectable } from '@angular/core';
import { ActionButton, SummarySlide } from '../../models/summary-slide'

@Injectable()
export class SummarySlidesProvider {
  private slides: SummarySlide[] = [];

  constructor() { 
    this.slides = [
      {
        id: 'leadType',
        title: 'סוג הליד',
        description: 'מעוניין ב',
        image: 'assets/img/ica-slidebox-img-1.png',
        buttons: [
          new ActionButton("להשכיר"),
          new ActionButton("לקנות"),
          new ActionButton("לשכור"),
          new ActionButton("למכור")
        ],
        icon: 'clipboard-outline'
      },
      {
        id: 'propertyType',
        title: 'נכס',
        description: 'סוג הנכס',
        image: 'assets/img/ica-slidebox-img-2.png',
        buttons: [
          new ActionButton("דירה"),
          new ActionButton("פנטהאוס"),
          new ActionButton("קוטג'"),
          new ActionButton("אחר")
        ],
        icon: 'home-outline'
      },
      {
        id: 'numberOfRooms',
        title: 'חדרים',
        description: 'מספר חדרים מבוקש',
        image: 'assets/img/ica-slidebox-img-3.png',
        buttons: [
          new ActionButton("פחות מ-3"),
          new ActionButton("3"),
          new ActionButton("4"),
          new ActionButton("5"),
          new ActionButton("יותר מ-5")
        ],
        icon: 'people-outline'
      },
      {
        id: 'budget',
        title: 'תקציב',
        description: 'תקציב בשקלים',
        image: 'assets/img/ica-slidebox-img-3.png',
        isBudgetRange: true,
        min: 1,
        max: 10,
        icon: 'cash-outline'
      },
      {
        id: 'area',
        title: 'אזור',
        description: 'האזור המבוקש',
        multiValue: true,
        buttons:[
          new ActionButton('מרכז נתניה'),
          new ActionButton('צפון נתניה'),
          new ActionButton('דרום נתניה'),
          new ActionButton('שכונות הרצף'),
          new ActionButton('עיר ימים - פולג'),
          new ActionButton('אגמים'),
          new ActionButton('נורדאו'),
          new ActionButton('דורה אזורים'),
          new ActionButton('רצועת החוף')
        ],
        icon: 'map-outline'
      },
      {
        id: 'source',
        title: 'מקור',
        description: 'מאיפה הליד הגיע אלינו?', 
        multiValue: true,
        buttons: [
          new ActionButton('פייסבוק'),
          new ActionButton('שלט'),
          new ActionButton('עיתון'),
          new ActionButton('אתר מצדה'),
          new ActionButton('המלצה אישית'),
          new ActionButton('אחר')
        ],
        icon: 'link'
      }
    ];
  }

  get() : SummarySlide[]{
    return Object.assign(this.slides);
  }
}
