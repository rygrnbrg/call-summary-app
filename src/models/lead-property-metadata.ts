export class LeadPropertyMetadata {
  public id: string;
  public title: string;
  public description: string;
  public image?: string;
  public options?: PropertyOption[];
  public isBudgetRange?: boolean;
  public min?: number;
  public max?: number;
  public value?: any[];
  public multiValue?: boolean;
  public icon?: string;

  static getValueString(slide: LeadPropertyMetadata): string {
    if (slide.isBudgetRange && slide.value && slide.value.length === 2) {
      return `${slide.value[0]} - ${slide.value[1]}`;
    }

    if (slide.options) {
      return slide.options.filter(button => button.selected === true).map(button => button.title).join(', ');
    }

    return "";
  }

  static reset(slide: LeadPropertyMetadata): void {
    slide.value = null;
    if (slide.options) {
      slide.options.forEach(button => button.selected = false);
    }
  }
}

export class PropertyOption {
  title: string;
  selected: boolean

  constructor(title: string, selected?: boolean) {
    this.title = title;
    this.selected = selected;
  }
}
