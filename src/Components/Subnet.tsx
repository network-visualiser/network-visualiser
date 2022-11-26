import IPv4Network from "./IPv4Network";

export default class Subnet {
  name: any;
  network: IPv4Network;
  offset: any;
  
  constructor(name: string, network: IPv4Network) {
    this.name = name;
    this.network = network;
    this.offset = 0;
  }
}