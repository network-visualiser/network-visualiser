export default class TerraformVariableFileParser {
  Parse(contents: string): any {
    var lines = contents
      .split(/[\r\n]+/g)
      .map((line) => line.trim())
      .map(line => line.replace(/#.*$/, ''))
      .filter(line => line[0] !== '#');

    var vars: any = {}
    let curr = vars;
    let levels = [vars];
    lines.forEach(line => {
      let matches;
      if ((matches = line.match(/(.+?)\s*=\s*{\s*$/))) {

        levels.push(curr);

        let keyName = matches[1];
        curr[keyName] = curr[keyName] || {};
        curr = curr[keyName];
      } else if ((matches = line.match(/(.+?)\s*=\s*(.*?)$/))) {
        let keyName = matches[1];
        let value: any = matches[2].trim();

        if (value[0] === '"' && value[value.length - 1] === '"') {
          value = value.substring(1, value.length - 1);
        } else if ( value[0] === "[" && value[value.length - 1] === "]") {
          value = value.substring(1, value.length - 1)
                      .split(/\s*,\s*/)
                      .map((v: string) => v.trim().replace(/^"/, "").replace(/"$/, ""));
        } else if (value === "true" || value === "false") {
          value = !!value;
        } else {
          value = parseFloat(value);
        }

        curr[keyName] = value;
      } else if (line.match(/}\s*$/)) {
        curr = levels.pop();
      }
    })

    return vars;
  }
}