import { DealType, LeadTypeID } from './../../models/lead-property-metadata';
import { LeadPropertyType } from '../../models/lead-property-metadata';
import { Injectable } from '@angular/core';
import { PropertyOption, LeadPropertyMetadata } from '../../models/lead-property-metadata'
import * as _ from "lodash";

@Injectable()
export class LeadPropertyMetadataProvider {
  private properties: LeadPropertyMetadata[] = [];
  public static relevanceKey = "relevant";

  constructor() {
    this.properties = [
      // {
      //   id: 'type',
      //   title: 'סוג הליד',
      //   description: 'מעוניין ב',
      //   image: 'assets/img/ica-slidebox-img-1.png',
      //   options: [
      //     new PropertyOption("להשכיר", false, LeadTypeID.Landlord),
      //     new PropertyOption("לקנות", false, LeadTypeID.Buyer),
      //     new PropertyOption("לשכור", false, LeadTypeID.Tenant),
      //     new PropertyOption("למכור", false, LeadTypeID.Seller)
      //   ],
      //   icon: 'clipboard',
      //   type: LeadPropertyType.StringSingleValue,
      //   filterable: false
      // },
      {
        id: 'property',
        title: 'נכס',
        description: 'סוג הנכס',
        image: 'assets/img/ica-slidebox-img-2.png',
        options: [
          new PropertyOption("דירה"),
          new PropertyOption("קוטג' / בית פרטי"),
          new PropertyOption("פנטהאוז / מיני פנט'"),
          new PropertyOption("דירת גן"),
          new PropertyOption("דופלקס"),
          new PropertyOption("משק / נחלה"),
          new PropertyOption("מרתף"),
          new PropertyOption("מחולקת"),
          new PropertyOption("מחסן"),
          new PropertyOption("משרד"),
          new PropertyOption("חנות"),
          new PropertyOption("אולם"),
          new PropertyOption("תעשייה"),
          new PropertyOption("מגרש")
        ],
        icon: 'home',
        type: LeadPropertyType.StringSingleValue,
        filterable: true
      },
      {
        id: 'rooms',
        title: 'חדרים',
        description: 'מספר חדרים מבוקש',
        image: 'assets/img/ica-slidebox-img-3.png',
        options: [
          new PropertyOption("1"),
          new PropertyOption("2"),
          new PropertyOption("3"),
          new PropertyOption("4"),
          new PropertyOption("5"),
          new PropertyOption("יותר מ-5")
        ],
        icon: 'people',
        type: LeadPropertyType.StringSingleValue,
        filterable: true
      },
      {
        id: 'budget',
        title: 'תקציב',
        description: 'תקציב בשקלים',
        image: 'assets/img/ica-slidebox-img-3.png',
        icon: 'cash',
        type: LeadPropertyType.Budget,
        filterable: false
      },
      {
        id: 'area',
        title: 'אזור',
        description: 'האזור המבוקש',
        options: [
          new PropertyOption('מרכז העיר'),
          new PropertyOption('צפון העיר'),
          new PropertyOption('דרום העיר'),
          new PropertyOption('שכונות הרצף'),
          new PropertyOption('הגוש הדתי'),
          new PropertyOption('רמת אפריים'),
          new PropertyOption('רמת חן'),
          new PropertyOption('נת 600 / נת 542'),
          new PropertyOption('קו החוף'),
          new PropertyOption('נוף גלים'),
          new PropertyOption('עיר ימים'),
          new PropertyOption('פולג'),
          new PropertyOption('אגמים'),
          new PropertyOption('האירוסים'),
          new PropertyOption('נורדאו'),
          new PropertyOption('דורה'),
          new PropertyOption('אזורים'),
          new PropertyOption('קרית השרון'),
          new PropertyOption('ותיקים / עמליה'),
          new PropertyOption('מושבים'),
          new PropertyOption('א.ת החדש'),
          new PropertyOption('א.ת אחר')
        ],
        icon: 'md-map',
        type: LeadPropertyType.StringMultivalue,
        filterable: true
      },
      {
        id: 'source',
        title: 'מקור',
        description: 'מאיפה הליד הגיע אלינו?',
        options: [
          new PropertyOption('יד 2'),
          new PropertyOption('אתר הבית'),
          new PropertyOption('פייסבוק'),
          new PropertyOption('שלט'),
          new PropertyOption('עיתון מקומי'),
          new PropertyOption('המלצה / אחר')
        ],
        icon: 'link',
        type: LeadPropertyType.StringSingleValue,
        filterable: false
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

  getDealTypeByLeadType(leadTypeId: LeadTypeID): DealType {
    if (leadTypeId === LeadTypeID.Buyer || leadTypeId === LeadTypeID.Seller){
      return DealType.Sell
    }

    return DealType.Rent;
  }
}

