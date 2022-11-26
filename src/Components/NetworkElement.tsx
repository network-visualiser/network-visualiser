import React from "react";
import IPv4Network from "./IPv4Network";
import './NetworkElement.css'

interface Props {
  network: IPv4Network
}

export default class NetworkElement extends React.Component<Props> {
  render() {
    const { network } = this.props;

    return <div>
      <table>
        <tbody>
          <tr>
            <td>Address</td>
            <td align={"right"}>{network.toString()}</td>
          </tr>
          <tr>
            <td>Available IPs</td>
            <td align={"right"}>{network.availableIPs}</td>
          </tr>
          <tr>
            <td>Start IP</td>
            <td align={"right"}>{network.startIP.string}</td>
          </tr>
          <tr>
            <td>End IP</td>
            <td align={"right"}>{network.endIP.string}</td>
          </tr>
        </tbody>
      </table>
    </div>
  }
}