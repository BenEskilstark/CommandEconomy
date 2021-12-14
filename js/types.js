// @flow

export type Dollar = number;
export type Labor = number;

export type Commodity = {
  name: string,
  laborRequired: Labor, // labor required per unit
  laborAssigned: Labor, // amount of labor assigned to produce this commodity
  price: Dollar, // selling price per unit
  inventory: number, // number of units available to sell
  demand: number, // how many of them are sold per unit time
};

export type Person = {
  name: string,
  money: Dollar,
};

export type GameState = {
  commodities: Array<Commodity>,
  people: Array<Person>,
  capital: Dollar, // how much money you have
  labor: Labor, // how much unassigned labor you have
  time: number,
};
