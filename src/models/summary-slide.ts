export class SummarySlide {
  public id: string;
  public title: string;
  public description: string;
  public image?: string;
  public buttons?: ActionButton[];
  public isBudgetRange?: boolean;
  public min?: number;
  public max?: number;
  public value?: any[];
  public multiValue?: boolean;
  public icon?: string;

  static getValueString(slide: SummarySlide): string {
    if (slide.isBudgetRange && slide.value && slide.value.length === 2) {
      return `${slide.value[0]} - ${slide.value[1]}`;
    }

    if (slide.buttons) {
      return slide.buttons.filter(button => button.selected === true).map(button => button.title).join(', ');
    }

    return "";
  }

  static reset(slide: SummarySlide): void {
    slide.value = null;
    if (slide.buttons) {
      slide.buttons.forEach(button => button.selected = false);
    }
  }
}

export class ActionButton {
  title: string;
  selected: boolean

  constructor(title: string, selected?: boolean) {
    this.title = title;
    this.selected = selected;
  }
}
