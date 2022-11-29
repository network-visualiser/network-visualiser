import React from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import IPv4Network from "./IPv4Network";
import Subnet from './Subnet'
import SubnetElement from "./SubnetElement";
import Vnet from "./Vnet";
import './VnetVisualiserElement.css'

interface Props {
  vnet: Vnet
}

interface State {
  vnet: Vnet
  gaps: Subnet[]
  currentSubnet?: Subnet
}

export default class VnetVisualiserElement extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      gaps: [],
      vnet: props.vnet,
    };
  }

  componentDidMount(): void {
    this.calculateGaps();
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    if (this.props.vnet.name !== prevProps.vnet.name) {
      this.calculateGaps();
      this.setState({ currentSubnet: undefined, vnet: this.props.vnet });
    }
  }

  calculateGaps() {
    const { vnet } = this.state;
    this.setState({ gaps: vnet.getGaps() });
  }

  render() {
    const { vnet, currentSubnet, gaps } = this.state;

    const getOffset = (vnet: Vnet, subnet: Subnet) => {
      const offset = subnet.network.startIP.numeric - vnet.network.startIP.numeric;
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
              opacity={.7}
              className={`subnet ${currentSubnet === s ? 'selected' : ''}`}
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
            y={(28 - s.network.maskbits) * (100 / 6) + '%'}
            width={getWidth(vnet, s)}
            height="100%"
            >
            <rect
              fill="green"
              stroke="white"
              strokeWidth="1px"
              onClick={() => this.setState({ currentSubnet: s })}
              width="100%"
              height={100 / 6 + '%'}
              opacity={.7}
              className={`gap ${currentSubnet === s ? 'selected' : ''}`}
            />
            {/* <circle
              cx="50%"
              cy="10%"
              r="2"
              fill="red"
            /> */}
            <text
              width="100%"
              x="50%"
              y="20"
              textAnchor="middle"
              alignmentBaseline="middle"
              dominantBaseline="central"
              // transform-origin="6 90%"
              // transform="rotate(-90)"
            >
              { s.network.maskbits <27 && "/" + s.network.maskbits}
            </text>
          </svg>
        ))}
      </svg >
      <ButtonGroup className="mt-3">
        <Button disabled={!this.hasGap(24)} onClick={() => this.addSubnet(24)}>Add /24</Button>
        <Button disabled={!this.hasGap(25)} onClick={() => this.addSubnet(25)}>Add /25</Button>
        <Button disabled={!this.hasGap(26)} onClick={() => this.addSubnet(26)}>Add /26</Button>
        <Button disabled={!this.hasGap(27)} onClick={() => this.addSubnet(27)}>Add /27</Button>
        <Button disabled={!this.hasGap(28)} onClick={() => this.addSubnet(28)}>Add /28</Button>
      </ButtonGroup>
      {currentSubnet && <SubnetElement onClose={() => this.setState({ currentSubnet: undefined })} className="mt-3" vnet={vnet} subnet={currentSubnet} />}
    </div >
  }

  hasGap(maskbits: number): boolean {
    const { gaps } = this.state;
    return gaps.some(g => g.network.maskbits === maskbits);
  }

  addSubnet(maskbits: number) {
    const { vnet } = this.state;

    const gap = vnet.fitSubnet(maskbits);
    if (gap) {
      gap.name = "New subnet";
      vnet.subnets.push(gap!);
      this.setState({ vnet, currentSubnet: gap }, () => this.calculateGaps());
    } else {
      console.log("No gap found");
    }
  }
}