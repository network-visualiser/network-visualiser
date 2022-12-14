import React from "react";
import FileChooser from "./FileChooser";
import IPv4Network from "./IPv4Network";
import Vnet from "./Vnet";
import Subnet from "./Subnet";
import VnetElement from "./VnetElement";
import VnetVisualiserElement from "./VnetVisualiserElement";

import { Accordion } from 'react-bootstrap'

import './SubnetElement.css'

interface Props {
  className?: string
}
interface State {
  vnets: Vnet[]
}

export default class SubnetVisualiser extends React.Component<Props, State> {
  
  constructor(props: Props) {
    super(props);

    this.state = {
      vnets: [],
    };
  }

  parseSubnets(vnet: Vnet, subnets: any): Subnet[] {
    return Object.keys(subnets).map(subnetKey => {
      let subnet = subnets[subnetKey];
      let subnetNetwork: IPv4Network;
      if (subnet.cidr_size_offset) {
        let address = vnet.network.address.add(2 ** (32 - subnet.cidr_size_offset.size) * subnet.cidr_size_offset.offset)
        subnetNetwork = new IPv4Network(address.string + '/' + subnet.cidr_size_offset.size);
      } else {
        subnetNetwork = new IPv4Network(subnet.cidr[0]);
      }
      return new Subnet(subnet.name, subnetNetwork);
    })
  }

  varsReceived(vars: any[]) {
    const vnets: Vnet[] = [];
    for(const v of vars) {
      let vv = Object.keys(v.vnets).map(vnetName => {
        let vnetInformation = v.vnets[vnetName];
        let addressSpace: string;
        let environment = v.global_settings.suffix;

        if (vnetInformation.vnet.address_space) {
          addressSpace = vnetInformation.vnet.address_space[0];
          const vnet = new Vnet(vnetInformation.vnet.name, v.global_settings.suffix, new IPv4Network(addressSpace));
          const subnets = this.parseSubnets(vnet, vnetInformation.subnets);
          vnet.subnets.push(...subnets);
          return [vnet]
        }

        return Object.keys(vnetInformation.address_space_environment_mapping).map(environmentName => {
          addressSpace = vnetInformation.address_space_environment_mapping[environmentName];
          const vnet = new Vnet(vnetInformation.vnet.name, environmentName, new IPv4Network(addressSpace));
          const subnets = this.parseSubnets(vnet, vnetInformation.subnets);
          vnet.subnets.push(...subnets);
          return vnet
        })
      })

      vnets.push(...vv.flat());
    }

    this.setState({ vnets });
  }

  render() {
    const { vnets } = this.state;

    return (
      <div className={this.props.className}>
        <FileChooser varsReceived={this.varsReceived.bind(this)} />

        <Accordion className="mt-3" activeKey={["0", "1", "2"]}>
          { vnets.map((vnet: Vnet, index: number) => (
          <Accordion.Item eventKey={index.toString()} key={index.toString()}>
            <Accordion.Header>{vnet.name} ({vnet.environment})</Accordion.Header>
            <Accordion.Body>
            <VnetElement vnet={vnet} />
            <VnetVisualiserElement key={vnet.toString()} vnet={vnet} />
            </Accordion.Body>
          </Accordion.Item>
          ))}
        </Accordion>
      </div>
    )
  }
}