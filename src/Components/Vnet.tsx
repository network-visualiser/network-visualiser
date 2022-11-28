import IPv4Network from "./IPv4Network";
import Subnet from "./Subnet";

export default class Vnet {
  name: string;
  environment: string;
  network: IPv4Network;
  subnets: Subnet[]
  
  constructor(name: string, environment: string, network: IPv4Network) {
    this.name = name;
    this.network = network;
    this.environment = environment;
    this.subnets = [];
  }
}