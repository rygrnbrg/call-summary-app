export enum LeadPropertyType {
  Budget,
  StringMultivalue,
  StringSinglValue
}

export class LeadPropertyMetadata {
  public id: string;
  public title: string;
  public description: string;
  public image?: string;
  public options?: PropertyOption[];
  public min?: number;
  public max?: number;
  public value?: any[];
  public icon?: string;
  public type: LeadPropertyType;

  static getValueString(leadPropertyMetadata: LeadPropertyMetadata): string {
    switch (leadPropertyMetadata.type) {
      case LeadPropertyType.Budget:
        if (
          leadPropertyMetadata.value &&
          leadPropertyMetadata.value.length === 2
        ) {
          return `${leadPropertyMetadata.value[0]} - ${leadPropertyMetadata.value[1]}`;
        }
        break;

      case LeadPropertyType.StringMultivalue:
      case LeadPropertyType.StringSinglValue:
        if (leadPropertyMetadata.options) {
          return leadPropertyMetadata.options
            .filter(option => option.selected === true)
            .map(option => option.title)
            .join(", ");
        }
        break;
        
      default:
        return "";
    }

    return "";
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
