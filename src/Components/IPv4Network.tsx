import IPv4Address from "./IPv4Address";

export default class IPv4Network {
  network: string;
  address: IPv4Address;
  maskbits: number;
  availableIPs: number;
  startIP: IPv4Address;
  endIP: IPv4Address;
  parts: any;

  constructor(network: string) {
    this.network = network;
    this.address = IPv4Address.ParseString(network.split('/')[0]);
    this.maskbits = parseInt(network.split('/')[1]);
    this.availableIPs = Math.pow(2, 32 - this.maskbits);

    this.startIP = this.address.add(0);
    this.endIP = this.address.add(this.availableIPs - 1);
  }

  toString() {
    return this.address.string + '/' + this.maskbits;
  }

  getStartIP() {
    return this.parts[0] + '.' + this.parts[1] + '.' + this.parts[2] + '.' + (this.parts[3] + 1);
  }

  getEndIP() {
    return this.parts[0] + '.' + this.parts[1] + '.' + this.parts[2] + '.' + (this.parts[3] + 1);
  }

  contains(ip: IPv4Address) {
    return this.startIP <= ip && ip <= this.endIP;
  }

  overlaps(network: IPv4Network): boolean {
    return (this.contains(network.startIP) || this.contains(network.endIP));
  }
}