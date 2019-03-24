import { DealType, LeadTypeID } from './../../models/lead-property-metadata';
import { LeadPropertyType } from '../../models/lead-property-metadata';
import { Injectable } from '@angular/core';
import { PropertyOption, LeadPropertyMetadata } from '../../models/lead-property-metadata'
import * as _ from "lodash";

@Injectable()
export class LeadPropertyMetadataProvider {
  private properties: LeadPropertyMetadata[] = [];

  constructor() {
    this.properties = [
      {
        id: 'type',
        title: 'סוג הליד',
        description: 'מעוניין ב',
        image: 'assets/img/ica-slidebox-img-1.png',
        options: [
          new PropertyOption("להשכיר", false, LeadTypeID.Landlord),
          new PropertyOption("לקנות", false, LeadTypeID.Buyer),
          new PropertyOption("לשכור", false, LeadTypeID.Tenant),
          new PropertyOption("למכור", false, LeadTypeID.Seller)
        ],
        icon: 'clipboard-outline',
        type: LeadPropertyType.StringSingleValue
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
        icon: 'home-outline',
        type: LeadPropertyType.StringSingleValue
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
        icon: 'people-outline',
        type: LeadPropertyType.StringSingleValue
      },
      {
        id: 'budget',
        title: 'תקציב',
        description: 'תקציב בשקלים',
        image: 'assets/img/ica-slidebox-img-3.png',
        icon: 'cash-outline',
        type: LeadPropertyType.Budget
      },
      {
        id: 'area',
        title: 'אזור',
        description: 'האזור המבוקש',
        options: [
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
        icon: 'map-outline',
        type: LeadPropertyType.StringMultivalue,
      },
      {
        id: 'source',
        title: 'מקור',
        description: 'מאיפה הליד הגיע אלינו?',
        options: [
          new PropertyOption('פייסבוק'),
          new PropertyOption('שלט'),
          new PropertyOption('עיתון'),
          new PropertyOption('אתר מצדה'),
          new PropertyOption('המלצה אישית'),
          new PropertyOption('אחר')
        ],
        icon: 'link',
        type: LeadPropertyType.StringSingleValue,
      }
    ];
  }

  get(): LeadPropertyMetadata[] {
    let copy: LeadPropertyMetadata[] = [];
    this.properties.forEach(prop => copy.push(_.cloneDeep(prop)));
    return copy;
  }

  getDealType(properties: LeadPropertyMetadata[]): DealType {
    let typeProperty = properties.find(prop => prop.id === "type");

    if (typeProperty) {
      let selectedOption = typeProperty.options.find(option => option.selected === true);

      if (selectedOption && (selectedOption.title === "להשכיר" || selectedOption.title === "לשכור")) {
        return DealType.Rent;
      }
    }

    return DealType.Sell;
  }
}

