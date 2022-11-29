import React from "react";
import TerraformVariableFileParser from "./TerraformVariableParser";

import { Button, Form } from 'react-bootstrap'

interface FileChooserProps  {
  varsReceived: (vars: any[]) => void;
}

export default class FileChooser extends React.Component<FileChooserProps> {
  async parseFiles(files: FileList | null) {
    if (!files) {
      return;
    }

    let result = []

    for(let i = 0; i < files.length; i++) {
      const file = files[i];
      const content = await file.text();  
      const tfvar = new TerraformVariableFileParser().Parse(content);
      tfvar.fileName = file.text;
      result.push(tfvar);
    }
    
    this.props.varsReceived(result);
  }


  render() {
    return <>
      <Form.Label htmlFor="tfvarsFiles">Choose terraform .tfvars files</Form.Label>
      <Form.Control
        multiple
        type="file"
        id="tfvarsFiles"
        title="Select TFVars files"
        accept=".tfvars"
        placeholder="Select TFVars files"
        onChange={(e) => this.parseFiles((e.target as HTMLInputElement).files)}
      />
    </>
  }
}