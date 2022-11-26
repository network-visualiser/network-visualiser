import React from "react";
import IPv4Network from "./IPv4Network";
import Subnet from './Subnet'
import SubnetElement from "./SubnetElement";
import Vnet from "./Vnet";
import './VnetVisualiserElement.css'

interface Props {
  vnet: Vnet
}

interface State {
  gaps: Subnet[]
  currentSubnet?: Subnet
}

export default class VnetVisualiserElement extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      gaps: [],
    };
  }

  componentDidMount(): void {
    this.calculateGaps();
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    console.log('componentDidUpdate');
    if (this.props.vnet.name !== prevProps.vnet.name) {
      this.calculateGaps();
      this.setState({ currentSubnet: undefined });
    }
  }

  calculateGaps() {
    const { vnet } = this.props;
    const gaps: Subnet[] = [];

    const smallestSubnet = 28;
    let currentSubnet = vnet.network.maskbits;

    while (currentSubnet <= smallestSubnet) {
      for (let i = 0; i < 2 ** (currentSubnet - vnet.network.maskbits); i++) {
        const startAddress = vnet.network.address.add(i * 2 ** (32 - currentSubnet));
        const gap = new IPv4Network(startAddress.string + '/' + currentSubnet);
        var gapVnet = new Subnet("gap", gap);

        // Make sure none of the subnets overlap with the gap
        if (vnet.subnets.every(s => !gap.overlaps(s.network) && !s.network.overlaps(gap))) {
          gaps.push(gapVnet);
        }
      }
      currentSubnet++;
    }

    this.setState({ gaps });
  }

  render() {
    const { vnet } = this.props;
    const { currentSubnet, gaps } = this.state;

    const getOffset = (vnet: Vnet, subnet: Subnet) => {
      const offset = subnet.network.startIP.numeric - vnet.network.startIP.numeric;
      console.log(offset, vnet.network.availableIPs, subnet.network.availableIPs);
      const percentage = offset / vnet.network.availableIPs * 100;
      return percentage + '%';
    }

    const getWidth = (vnet: Vnet, subnet: Subnet) => {
      const percentage = subnet.network.availableIPs / vnet.network.availableIPs * 100;
      return percentage + '%';
    }

    return <div>
      <div>
        <p>Allocated subnets: {vnet.subnets.length}</p>
      </div>

      {/* <pre>
        Gaps: {JSON.stringify(gaps.map(g => g.network.toString()), null, 2)}
      </pre> */}

      <svg width="100%" height="200">
        <rect width="100%" height="100%" fill="black" opacity={0.5}></rect>

        {vnet.subnets.map((s, i) => (
          <svg
            key={s.network.address.string + i}
            x={getOffset(vnet, s)}
            width={getWidth(vnet, s)}
          >
            <rect
              stroke="white"
              strokeWidth="1px"
              onClick={() => this.setState({ currentSubnet: s })}
              width="100%"
              height="100%"
              opacity={.5}
              className="subnet"
            />
            {/* <circle
              cx="50%"
              cy="50%"
              r="2"
              fill="red"
            /> */}
            <text
              x="0"
              y="90%"
              textAnchor="start"
              alignmentBaseline="middle"
              dominantBaseline="central"
              transform-origin="6 90%"
              transform="rotate(-90)"
            >
              {s.name}
            </text>
          </svg>
        ))}
        {gaps.map((s, i) => (
          <svg
            key={s.network.address.string + i}
            x={getOffset(vnet, s)}
            dy="20"
            width={getWidth(vnet, s)}
            height="100%"
            >
            <rect
              fill="green"
              stroke="white"
              strokeWidth="1px"
              onClick={() => this.setState({ currentSubnet: s })}
              width="100%"
              height="25%"
              y={(32 - s.network.maskbits) * 10}
              opacity={.7}
              className="gap"
            />
            {/* <circle
              cx="50%"
              cy="50%"
              r="2"
              fill="red"
            /> */}
            <text
              x="0"
              y="90%"
              textAnchor="start"
              alignmentBaseline="middle"
              dominantBaseline="central"
              transform-origin="6 90%"
              transform="rotate(-90)"
            >
            </text>
          </svg>
        ))}
      </svg >
      {currentSubnet && <SubnetElement className="mt-3" vnet={vnet} subnet={currentSubnet} />}
    </div >
  }
}