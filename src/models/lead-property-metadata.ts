export enum LeadPropertyType {
  Budget,
  StringMultivalue,
  StringSingleValue
}

export class LeadPropertyMetadata {
  public id: string;
  public title: string;
  public description: string;
  public image?: string;
  public options?: PropertyOption[];
  public value?: any[] | any;
  public icon?: string;
  public type: LeadPropertyType;

  static getValueString(
    leadPropertyMetadata: LeadPropertyMetadata,
    value?: any
  ): string {
    switch (leadPropertyMetadata.type) {
      case LeadPropertyType.Budget:
        if (value) {
          return value;
        }
        return leadPropertyMetadata.value;
      case LeadPropertyType.StringSingleValue:
        if (value) {
          return value;
        }

        return LeadPropertyMetadata.optionsToString(leadPropertyMetadata.options);

      case LeadPropertyType.StringMultivalue:
        if (value){
          return (<string[]>value).join(', ');
        }
        return this.optionsToString(leadPropertyMetadata.options);

      default:
        return "";
    }
  }

  private static optionsToString(options: PropertyOption[]) {
    return options
      .filter(option => option.selected === true)
      .map(option => option.title)
      .join(", ");
  }

  static reset(slide: LeadPropertyMetadata): void {
    slide.value = null;
    if (slide.options) {
      slide.options.forEach(option => (option.selected = false));
    }
  }
}

export class PropertyOption {
  title: string;
  selected: boolean;

  constructor(title: string, selected?: boolean) {
    this.title = title;
    this.selected = selected;
  }
}

export enum DealType{
  Sell, Rent
}

export enum LeadType{
  Buyer, Seller, Tenant, Landlord
}