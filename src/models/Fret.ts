export class Fret {
  private readonly _index: number;

  constructor(index: number) {
    this._index = index;
  }

  get index(): number {
    return this._index;
  }

  get name(): string {
    switch (this._index) {
      case 0:
        return "Green";
      case 1:
        return "Red";
      case 2:
        return "Yellow";
      case 3:
        return "Blue";
      case 4:
        return "Orange";
    }
    throw new Error("Invalid index");
  }

  toString(): string {
    return this.name;
  }

  get texturePath(): string {
    return "/assets/note/note-" + this.name.toLowerCase() + ".png";
  }

  get position(): number {
    return this._index - 2;
  }

  get keyboardKey(): string {
    return this._index + 1 + "";
  }

  get gamepadKey(): number {
    switch (this._index) {
      case 0:
        return 0;
      case 1:
        return 1;
      case 2:
        return 3;
      case 3:
        return 2;
      case 4:
        return 4;
    }
    throw new Error("Invalid index");
  }

  static fromIndex(index: number): Fret {
    if (index < 0 || index > 4) {
      throw new Error("Invalid index");
    }
    return new Fret(index);
  }

  static green(): Fret {
    return new Fret(0);
  }

  static red(): Fret {
    return new Fret(1);
  }

  static yellow(): Fret {
    return new Fret(2);
  }

  static blue(): Fret {
    return new Fret(3);
  }

  static orange(): Fret {
    return new Fret(4);
  }

  static all(): Fret[] {
    return [
      Fret.green(),
      Fret.red(),
      Fret.yellow(),
      Fret.blue(),
      Fret.orange(),
    ];
  }
}
