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
        const laborCost = commodity.laborAssigned * game.wages;
        game.capital -= laborCost;
        game.laborSavings += laborCost;
        // TODO: Do something if wages are not payable

        // compute sales for each commodity
        // TODO: Do something if laborSavings < commodityRevenue
        const leftover = commodity.inventory - commodity.demand;
        commodity.inventory = Math.max(0, leftover);
        if (leftover >= 0) {
          const commodityRevenue = commodity.demand * commodity.price;
          game.capital += commodityRevenue;
          game.laborSavings -= commodityRevenue;
        } else {
          // if leftover < 0, then leftover is the unfulfilled demand
          const commodityRevenue = (commodity.demand + leftover) * commodity.price;
          game.capital += commodityRevenue;
          game.laborSavings -= commodityRevenue;
        }
        // TODO: Do something if demand is not met
      }

      // labor pool
      let totalLabor = game.labor;
      game.commodities.forEach(c => totalLabor += c.laborAssigned);
      game.labor += config.laborGrowthRate(totalLabor)

      // TODO: compute demand based on price and labor

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
      // TODO compute next demand for commodity

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
