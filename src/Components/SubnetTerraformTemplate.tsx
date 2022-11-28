import React from "react";
import SyntaxHighlighter from 'react-syntax-highlighter';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Subnet from "./Subnet";
import Vnet from "./Vnet";

export interface Props {
  subnet: Subnet
  vnet: Vnet
  className?: string
  style?: React.CSSProperties
}

export function SubnetTerraformTemplate({ vnet, subnet, className }: Props) {
  const getOffset = (): number => {
    return Math.abs(vnet.network.address.add(-1 * subnet.network.address.numeric).numeric / subnet.network.availableIPs);
  };

  const subnetKey = subnet.name.replace(/(.)([A-Z])/g, '$1_$2').toLowerCase().replace(/[^a-z0-9]/g, '_');

  return (
    <div style={{ textAlign: 'left' }} className={className}>
      <Container>
        <Row>
          <Col>
            <h3>Offset style</h3>
            <SyntaxHighlighter>
              {`${subnetKey} = {
  name = "${subnet.name}"
  # cidr = ["${subnet.network.toString()}"]
  cidr_size_offset = {
    size   = ${subnet.network.maskbits}
    offset = ${getOffset()}
  }
}`}
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
  );
}
