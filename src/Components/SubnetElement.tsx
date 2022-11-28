import React from "react";
import NetworkElement from "./NetworkElement";
import Subnet from "./Subnet";
import Vnet from "./Vnet";
import { Alert } from 'react-bootstrap'
import { SubnetTerraformTemplate } from "./SubnetTerraformTemplate";

export interface Props {
  subnet: Subnet
  vnet: Vnet
  className?: string
  style?: React.CSSProperties
  onClose: () => void
}

interface State {
  hide: boolean
}

export default class SubnetElement extends React.Component<Props, State> {
  state = {
    hide: false
  }

  componentDidMount(): void {
    this.setState({ hide: false })
  }
  
  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    if (this.props.subnet.name !== prevProps.subnet.name) {
      this.setState({ hide: false })
    }
  }
  
  render() {
    const { subnet, vnet, onClose } = this.props;
    const { hide } = this.state;

    return <Alert show={!hide} onClose={() => this.setState({ hide: true }, () => onClose())} dismissible closeLabel="Close" className={this.props.className} style={this.props.style}>
      <h3>{subnet.name}</h3>
      <NetworkElement network={subnet.network} />
      <SubnetTerraformTemplate className="mt-3" vnet={vnet} subnet={subnet} />
    </Alert>
  }
}

