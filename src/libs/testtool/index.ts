import { ClientResponse } from "../client";
const ALLOWED_FIELD = ['header', 'body', 'status'];
import color from 'cli-color';


function index(obj: any, is: any) {
  if (typeof is == 'string')
      return index(obj,is.split('.'));
  else if (is.length==0)
      return obj;
  else
      return index(obj[is[0]],is.slice(1));
}


export class Expect {
  public expect: any;
  public actualField: any;
  public actualValue: any;
  public comparator!: string;

  constructor(actualField: any, comparator: string, expect: any){
    this.actualField = actualField;
    this.comparator = comparator;
    this.expect = expect;
  }

  public setResponse(response: ClientResponse){
    // split by dot (.)
    // e.g, body.name
    let rawAnnotation = this.actualField.split('.');
    let field = rawAnnotation[0];
    if(!ALLOWED_FIELD.includes(field)) {
      throw new Error(`Only ${ALLOWED_FIELD} that supported. Error: ${this.actualField}`);
    }

    let subAnnotation = '';
    if(rawAnnotation.length>1) {
      subAnnotation = rawAnnotation[1];
    }

    if(field === 'body') {
      this.actualValue = index(response.body, subAnnotation);
    }

    if(field === 'status') {
      this.actualValue = response.status;
    }

    if(field === 'header') {
      this.actualValue = response.headers.get(subAnnotation);
    }
  }

  evaluate(): string | null | boolean {
      switch(this.comparator){
          case 'equal':
          case '===':
              return this.actualValue === this.expect;
          case '!==':
              return this.actualValue !== this.expect;
          case '>':
              return this.actualValue > this.expect;
          case '<':
              return this.actualValue < this.expect;
          case '>=':
              return this.actualValue >= this.expect;
          case '<=':
              return this.actualValue <= this.expect;
          case 'contains':
              return this.actualValue.includes(this.expect);
          case 'not_contains':
              return !this.actualValue.includes(this.expect);
          case 'regex':
              const re = new RegExp(this.expect);
              return re.test(this.actualValue);
          case 'not_regex':
              const re2 = new RegExp(this.expect);
              return !re2.test(this.actualValue);
          default:
              throw new Error(`Comparator ${this.comparator} is not supported`);
      }
  }
}

export class Test {
    public description: string;
    public expect: Expect[];
    constructor(description: string) {
      this.description = description;
      this.expect = [];
    }

    setResponse(res: ClientResponse) {
      this.expect.forEach(e => {
        e.setResponse(res);
      })
    }

    run() {
      console.log();
      console.log(color.bold.yellow("Running Test"));
      console.log(color.cyan(this.description));
      let diff = [];
      let pass = [];
      for (const e of this.expect) {
        const result = e.evaluate();
        if (result) {
          pass.push(color.greenBright(`${e.actualField} \n\texpect:\t (${e.comparator}) ${e.expect}, \n\tgot:\t ${e.actualValue}`));
        } else {
          diff.push(color.redBright(`${e.actualField} \n\texpect:\t (${e.comparator}) ${e.expect}, \n\tgot:\t ${e.actualValue}`));
        }
      }
      console.log();
      console.log(color.bold.green(`Pass: ${pass.length} / ${this.expect.length}`));
      pass.forEach((p) => console.log(p));
      if(diff.length > 0) {
        console.log();
        console.log(color.bold.red(`Fail: ${diff.length}`));
        diff.forEach((d) => console.log(d)); 
      }
    }
}
