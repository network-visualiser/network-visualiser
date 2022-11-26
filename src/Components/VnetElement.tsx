import React from "react";
import NetworkElement from "./NetworkElement";
import Vnet from "./Vnet";

interface Props {
  vnet: Vnet
}

export default class VnetElement extends React.Component<Props> {
  render() {
    const { vnet } = this.props;

    return <div>
      <h2>{vnet.name}</h2>
      <NetworkElement network={vnet.network} />
    </div>
  }
}