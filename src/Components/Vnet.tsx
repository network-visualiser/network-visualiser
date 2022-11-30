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

  getGaps(): Subnet[] {
    const gaps: Subnet[] = [];

    const smallestSubnet = 28;
    let currentSubnet = this.network.maskbits;

    while (currentSubnet <= smallestSubnet) {
      for (let i = 0; i < 2 ** (currentSubnet - this.network.maskbits); i++) {
        const startAddress = this.network.address.add(i * 2 ** (32 - currentSubnet));
        const gap = new IPv4Network(startAddress.string + '/' + currentSubnet);
        var gapVnet = new Subnet("gap", gap);

        // Make sure none of the subnets overlap with the gap
        if (this.subnets.every(s => !gap.overlaps(s.network) && !s.network.overlaps(gap))) {
          gaps.push(gapVnet);
        }
      }
      currentSubnet++;
    }

    return gaps;
  }

  fitSubnet(maskbits: number): Subnet | null | undefined {
    const allGaps = this.getGaps();
    const gaps = allGaps.filter(g => g.network.maskbits === maskbits);

    const candidates: Subnet[] = [];
    
    // first sort the gaps by the least amount of overlaps with other gaps
    gaps.sort((a,b) => {
      return allGaps.filter(g2 => a.network.overlaps(g2.network)).length - allGaps.filter(g2 => b.network.overlaps(g2.network)).length;
    });

    // first best fit is in the between of existing subnets
    const bestFitGaps = gaps.filter(g => {
      return this.subnets.some(s => g.network.startIP.add(-1).string === s.network.endIP.string) &&
      this.subnets.some(s => g.network.endIP.add(1).string === s.network.startIP.string);
    })
    candidates.push(...bestFitGaps);
    console.log('Found best-fit gaps', bestFitGaps);

    // next best fit is when there are no overlaps of bigger gaps
    const nonOverlappingGaps = gaps.filter(g => {
      const biggerOverllappingGaps = allGaps.filter(g1 => g1.network.maskbits < maskbits);
      if(biggerOverllappingGaps.length === 0) { return false; }

      return biggerOverllappingGaps.every(g2 => !g.network.overlaps(g2.network));
    })
    console.log('Found non-overlapping gaps', nonOverlappingGaps);
    candidates.push(...nonOverlappingGaps);

    // next best fit is at the beginning or end of subnets
    const vicinitySubnets = gaps.filter(g => {
      return this.subnets.some(s => g.network.startIP.add(-1).string === s.network.endIP.string) ||
      this.subnets.some(s => g.network.endIP.add(1).string === s.network.startIP.string);
    })
    candidates.push(...vicinitySubnets);
    console.log('Found vicinity gaps', vicinitySubnets);

    // next best fit is the rest of the subnets
    candidates.push(...gaps);
    
    return candidates[0];
  }

}