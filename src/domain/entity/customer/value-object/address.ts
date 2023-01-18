export default class Address {
  /**
   * Geralmente o objeto criado aqui, é pq os atributos em geral não é tão importante para negócio
   * Quando necessário e trocado o objeto todo
   * Objeto de valor ele não muda, ele é trocado. Ele representa apenas uma propriedade
   * 
   * Ele é necessário está sempre se validando, pq o estado sempre tem que está coeso
   * Não tem id pois ele, nao é unico é um conjunto de propriedade
   * Ele tem que ser imutavel. Você troca ele por todo
   */

  /**
   * Não possui sets, quando precisar trocar alguma prop, e necessario que troquei o objeto todo
   * 
   */


  _street: string = "";
  _number: number = 0;
  _zip: string = "";
  _city: string = "";

  constructor(street: string, number: number, zip: string, city: string) {
    this._street = street;
    this._number = number;
    this._zip = zip;
    this._city = city;

    this.validate();
  }

  get street(): string {
    return this._street;
  }

  get number(): number {
    return this._number;
  }

  get zip(): string {
    return this._zip;
  }

  get city(): string {
    return this._city;
  }
  
  validate() {
    if (this._street.length === 0) {
      throw new Error("Street is required");
    }
    if (this._number === 0) {
      throw new Error("Number is required");
    }
    if (this._zip.length === 0) {
      throw new Error("Zip is required");
    }
    if (this._city.length === 0) {
      throw new Error("City is required");
    }
  }

  toString() {
    return `${this._street}, ${this._number}, ${this._zip} ${this._city}`;
  }
}
