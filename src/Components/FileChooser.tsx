import React from "react";
import TerraformVariableFileParser from "./TerraformVariableParser";

import { Button } from 'react-bootstrap'

interface FileChooserProps  {
  varsReceived: (vars: any) => void;
}

export default class FileChooser extends React.Component<FileChooserProps> {
  async openFile() {
    console.log('opening file')
    const filePickerOptions = {
      types: [
        {
          description: 'Terraform TFVar files',
          accept: {
            'text/plain': ['.tfvars']
          }
        },
      ],
    }

    const [fileHandle] = await window.showOpenFilePicker(filePickerOptions)

    const file = await fileHandle.getFile();
    const contents = await file.text();

    var tfvar = new TerraformVariableFileParser().Parse(contents);
    this.props.varsReceived(tfvar);
  }


  render() {
    return <Button onClick={this.openFile.bind(this)}>Select TFVAR file</Button>
  }
}