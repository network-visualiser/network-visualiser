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

  varsReceived(vars: any) {
    let vnets = Object.keys(vars.vnets).map(vnetName => {
      let vnetInformation = vars.vnets[vnetName];
      console.log(vars.vnets);
      let addressSpace: string;
      if (vnetInformation.vnet.address_space) {
        addressSpace = vnetInformation.vnet.address_space[0];
      } else {
        addressSpace = vnetInformation.address_space_environment_mapping.dev;
      }
  
      const vnet = new Vnet(vnetInformation.vnet.name, new IPv4Network(addressSpace));
  
      const subnets = Object.keys(vnetInformation.subnets).map(subnetKey => {
        let subnet = vnetInformation.subnets[subnetKey];
        let subnetNetwork: IPv4Network;
        if (subnet.cidr_size_offset) {
          let address = vnet.network.address.add(2 ** (32 - subnet.cidr_size_offset.size) * subnet.cidr_size_offset.offset)
          subnetNetwork = new IPv4Network(address.string + '/' + subnet.cidr_size_offset.size);
        } else {
          subnetNetwork = new IPv4Network(subnet.cidr[0]);
        }
        return new Subnet(subnet.name, subnetNetwork);
      });

      vnet.subnets.push(...subnets);
      return vnet;
    })

    this.setState({ vnets });
  }

  render() {
    const { vnets } = this.state;

    return (
      <div className={this.props.className}>
        <FileChooser varsReceived={this.varsReceived.bind(this)} />

        <Accordion className="mt-3" defaultActiveKey="0">
          { vnets.map((vnet: Vnet, index: number) => (
          <Accordion.Item eventKey={index.toString(2)} key={index.toString(2)}>
            <Accordion.Header>{vnet.name}</Accordion.Header>
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