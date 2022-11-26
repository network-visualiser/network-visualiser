export default class IPv4Address {
  numeric: number;
  stringBinary: string;
  string: string;
  static ParseString(address: string) {
    let parts = address.split('.').map(part => parseInt(part));
    let numeric = parts[3];
    numeric += parts[2] << 8;
    numeric += parts[1] << 16;
    numeric += parts[0] << 24;

    return new IPv4Address(numeric);
  }

  constructor(numeric: number) {
    this.numeric = numeric;
    this.stringBinary = this.numeric.toString(2);
    this.string = ((numeric & 0xFF000000) >> 24) + "." + ((numeric & 0x00FF0000) >> 16) + "." + ((numeric & 0xFF00) >> 8) + "." + (numeric & 0xFF);
  }

  add(value: number) {
    return new IPv4Address(this.numeric + value);
  }

  toString() {
    return this.numeric.toString(2)
  }
}