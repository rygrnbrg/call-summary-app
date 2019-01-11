import { Injectable } from '@angular/core';
import { PropertyOption, LeadPropertyMetadata } from '../../models/lead-property-metadata'

@Injectable()
export class LeadPropertyMetadataProvider {
  private slides: LeadPropertyMetadata[] = [];

  constructor() { 
    this.slides = [
      {
        id: 'type',
        title: 'סוג הליד',
        description: 'מעוניין ב',
        image: 'assets/img/ica-slidebox-img-1.png',
        options: [
          new PropertyOption("להשכיר"),
          new PropertyOption("לקנות"),
          new PropertyOption("לשכור"),
          new PropertyOption("למכור")
        ],
        icon: 'clipboard-outline'
      },
      {
        id: 'property',
        title: 'נכס',
        description: 'סוג הנכס',
        image: 'assets/img/ica-slidebox-img-2.png',
        options: [
          new PropertyOption("דירה"),
          new PropertyOption("פנטהאוס"),
          new PropertyOption("קוטג'"),
          new PropertyOption("אחר")
        ],
        icon: 'home-outline'
      },
      {
        id: 'rooms',
        title: 'חדרים',
        description: 'מספר חדרים מבוקש',
        image: 'assets/img/ica-slidebox-img-3.png',
        options: [
          new PropertyOption("פחות מ-3"),
          new PropertyOption("3"),
          new PropertyOption("4"),
          new PropertyOption("5"),
          new PropertyOption("יותר מ-5")
        ],
        icon: 'people-outline'
      },
      {
        id: 'budget',
        title: 'תקציב',
        description: 'תקציב בשקלים',
        image: 'assets/img/ica-slidebox-img-3.png',
        isBudgetRange: true,
        min: 0,
        max: 10,
        icon: 'cash-outline'
      },
      {
        id: 'area',
        title: 'אזור',
        description: 'האזור המבוקש',
        multiValue: true,
        options:[
          new PropertyOption('מרכז נתניה'),
          new PropertyOption('צפון נתניה'),
          new PropertyOption('דרום נתניה'),
          new PropertyOption('שכונות הרצף'),
          new PropertyOption('עיר ימים - פולג'),
          new PropertyOption('אגמים'),
          new PropertyOption('נורדאו'),
          new PropertyOption('דורה אזורים'),
          new PropertyOption('רצועת החוף')
        ],
        icon: 'map-outline'
      },
      {
        id: 'source',
        title: 'מקור',
        description: 'מאיפה הליד הגיע אלינו?', 
        multiValue: true,
        options: [
          new PropertyOption('פייסבוק'),
          new PropertyOption('שלט'),
          new PropertyOption('עיתון'),
          new PropertyOption('אתר מצדה'),
          new PropertyOption('המלצה אישית'),
          new PropertyOption('אחר')
        ],
        icon: 'link'
      }
    ];
  }

  get() : LeadPropertyMetadata[]{
    return Object.assign(this.slides);
  }
}
