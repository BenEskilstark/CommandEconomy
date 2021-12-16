// @flow

const {config} = require('../config');
const {getCommodity} = require('../selectors/selectors');

const gameReducer = (game, action) => {
  switch (action.type) {
    case 'TICK': {
      game.time += 1;

      // commodities
      for (const commodity of game.commodities) {
        // compute production of each commodity
        const production = commodity.laborAssigned / commodity.laborRequired;
        commodity.inventory += production;

        // compute wages for production
        game.capital -= commodity.laborAssigned * game.wages;
        // TODO: Do something if wages are not payable

        // compute sales for each commodity
        const leftover = commodity.inventory - commodity.demand;
        commodity.inventory = Math.max(0, leftover);
        if (leftover >= 0) {
          game.capital += commodity.demand * commodity.price;
        } else {
          // if leftover < 0, then leftover is the unfulfilled demand
          game.capital += (commodity.demand + leftover) * commodity.price;
        }
        // TODO: Do something if demand is not met
      }

      // labor pool
      let totalLabor = game.labor;
      game.commodities.forEach(c => totalLabor += c.laborAssigned);
      game.labor += config.laborGrowthRate(totalLabor)
      // TODO: Do something if wages are less than total demand * price

      return game;
    }
    case 'INCREMENT_WAGES': {
      const {wageChange} = action;
      game.wages += wageChange;
      return game;
    }
    case 'INCREMENT_PRICE': {
      const {name, priceChange} = action;
      const commodity = getCommodity(game, name);
      commodity.price += priceChange;
      // compute next demand for commodity
      // TODO

      return game;
    }
    case 'INCREMENT_LABOR': {
      const {name, laborChange} = action;
      const commodity = getCommodity(game, name);
      if (laborChange < 0) { // unassigning labor
        if (commodity.laborAssigned > laborChange) {
          commodity.laborAssigned += laborChange;
          game.labor -= laborChange;
        }
      } else { // assigning labor
        if (game.labor > laborChange) {
          commodity.laborAssigned += laborChange;
          game.labor -= laborChange;
        }
      }
      return game;
    }
  }
  return game;
}


module.exports = {gameReducer}
