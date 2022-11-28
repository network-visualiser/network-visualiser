import React from "react";
import TerraformVariableFileParser from "./TerraformVariableParser";

import { Button } from 'react-bootstrap'

interface FileChooserProps  {
  varsReceived: (vars: any[]) => void;
}

export default class FileChooser extends React.Component<FileChooserProps> {
  async openFile() {
    console.log('opening file')
    const filePickerOptions = {
      multiple: true,
      types: [
        {
          description: 'Terraform TFVar files',
          accept: {
            'text/plain': ['.tfvars']
          }
        },
      ],
    }

    const fileHandles = await window.showOpenFilePicker(filePickerOptions)

    console.log(fileHandles)

    let result = []

    for (const fh of fileHandles) {
      const file = await fh.getFile();
      const contents = await file.text();
  
      var tfvar = new TerraformVariableFileParser().Parse(contents);
      tfvar.fileName = fh.name;
      result.push(tfvar);
    }

    this.props.varsReceived(result);
  }


  render() {
    return <Button onClick={this.openFile.bind(this)}>Select TFVAR file</Button>
  }
}