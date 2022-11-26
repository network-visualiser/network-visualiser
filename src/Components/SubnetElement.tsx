import React from "react";
import NetworkElement from "./NetworkElement";
import Subnet from "./Subnet";
import Vnet from "./Vnet";
import SyntaxHighlighter from 'react-syntax-highlighter';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

interface Props {
  subnet: Subnet
  vnet: Vnet
  className?: string
  style?: React.CSSProperties
}

export default class SubnetElement extends React.Component<Props> {
  
  render() {
    const { subnet, vnet } = this.props;

    return <div className={this.props.className} style={this.props.style}>
      <h3>{subnet.name}</h3>
      <NetworkElement network={subnet.network} />
      <SubnetTerraformTemplate className="mt-3" vnet={vnet} subnet={subnet} />
    </div>
  }
}

function SubnetTerraformTemplate({ vnet, subnet, className }: Props) {
  const getOffset = (): number => {
    return Math.abs(vnet.network.address.add(-1 * subnet.network.address.numeric).numeric / subnet.network.availableIPs);
  }

  const subnetKey = subnet.name.replace(/(.)([A-Z])/g, '$1_$2').toLowerCase().replace(/[^a-z0-9]/g, '_');

  return (
    <div style={{textAlign: 'left'}} className={className}>
      <Container>
        <Row>
        <Col>
        <h3>Offset style</h3>
        <SyntaxHighlighter>
        {
          `${subnetKey} = {
  name = "${subnet.name}"
  # cidr = ["${subnet.network.toString()}"]
  cidr_size_offset = {
    size   = ${ subnet.network.maskbits }
    offset = ${ getOffset() }
  }
}`
}
        </SyntaxHighlighter>
        </Col>

      <Col>
        <h3>Fixed-cidr style</h3>
        <SyntaxHighlighter>
        {`${subnetKey} = {
  name = "${subnet.name}"
  cidr = ["${subnet.network.address.string}"]
}`}
        </SyntaxHighlighter>
      </Col>
      </Row>
      </Container>
    </div>
  )
}