
/**
 * Essa entidade é focada em négocio, quando for persistir o dados no banco
 * cria-se outro modelo para que execute a operação de persistir
 */

import Address from "./value-object/address";


export default class Customer {
  private _id: string;
  private _name: string = "";
  private _address!: Address;
  private _active: boolean = false;
  private _rewardPoints: number = 0;

  constructor(id: string, name: string) {
    this._id = id;
    this._name = name;
    this.validate();
  }



  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get rewardPoints(): number {
    return this._rewardPoints;
  }

  validate() {
    if (this._id.length === 0) {
      throw new Error("Id is required");
    }
    if (this._name.length === 0) {
      throw new Error("Name is required");
    }
  }

  /**
   * Nas funções que são setExemplo, é utilizado de forma padrão pois indica que será setado o valor
   * mas quando utilizado dominio rico, é utilizado changeExemplo, isso deixa explicito a sua serventia.
   *
   * Toda vez que for criado a entidade, os campos obrigatórios é necessario que seja informado
   * 
   * Para cada alteração baseada em regra de negócio, é possível que se execute validação dos dados
   */

  changeName(name: string) {
    this._name = name;
    this.validate();
  }

  get Address(): Address {
    return this._address;
  }

  changeAddress(address: Address) {
    this._address = address;
  }

  isActive(): boolean {
    return this._active;
  }

  activate() {
    if (this._address === undefined) {
      throw new Error("Address is mandatory to activate a customer");
    }
    this._active = true;
  }

  deactivate() {
    this._active = false;
  }

  addRewardPoints(points: number) {
    this._rewardPoints += points;
  }

  set Address(address: Address) {
    this._address = address;
  }
}
