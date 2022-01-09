// @flow

const {config} = require('../config');
const {
  getCommodity, subtractWithDeficit, totalPopulation,
} = require('../selectors/selectors');

const gameReducer = (game, action) => {
  switch (action.type) {
    case 'START_TICK': {
      if (game != null && game.tickInterval != null) {
        return game;
      }
      game.prevTickTime = new Date().getTime();
      return {
        ...game,
        tickInterval: setInterval(
          // HACK: store is only available via window
          () => store.dispatch({type: 'TICK'}),
          config.msPerTick,
        ),
      };
    }
    case 'STOP_TICK': {
      clearInterval(game.tickInterval);
      game.tickInterval = null;

      return game;
    }
    case 'TICK': {
      game.time += 1;

      // commodities
      for (const commodity of game.commodities) {
        if (!commodity.unlocked) continue;

        // compute DEMAND based on price and labor
        commodity.demand = commodity.demandFn(commodity.price, totalPopulation(game));

        // compute WAGES for production
        const laborCost = commodity.laborAssigned * game.wages;
        const {result: nextCapital, deficit: laborCostDeficit} =
          subtractWithDeficit(game.capital, laborCost, game.wages /*step*/);
        game.capital = nextCapital;
        game.laborSavings += (laborCost - laborCostDeficit);
        // increase unrest if wages are not payable:
        if (laborCostDeficit > 0) {
          console.log("can't afford to pay labor for", commodity.name, laborCostDeficit / laborCost);
          game.unrest += laborCostDeficit / laborCost;
        }

        // compute PRODUCTION of each commodity based on who you can
        // afford to pay
        const production = Math.floor(
          (commodity.laborAssigned - laborCostDeficit / game.wages)
            / commodity.laborRequired
        );
        commodity.inventory += production;

        // compute SALES for each commodity
        // sales depend both on inventory meeting demand AND labor
        // having enough savings to afford the demand
        const {
          result: inventoryAfterDemand, // game.inventory set below since it
                                        // also depends on labor savings
          deficit: inventoryDeficit,
          amount: demandMet,
        } = subtractWithDeficit(commodity.inventory, commodity.demand);
        // increase unrest if demand is not met:
        if (inventoryDeficit > 0) {
          console.log(
            "inventory doesn't meet demand for ", commodity.name,
            inventoryDeficit/commodity.demand,
          );
          game.unrest += inventoryDeficit / commodity.demand;
        }
        // LABOR SAVINGS
        const {
          result: nextLaborSavings, deficit: savingsDeficit, amount: revenue,
        } = subtractWithDeficit(
          game.laborSavings, commodity.price * demandMet,
          commodity.price /* step */
        );
        game.laborSavings = nextLaborSavings;
        game.capital += revenue;
        const inventorySold = Math.floor(revenue / commodity.price);
        commodity.inventory -= inventorySold;
        // increase unrest if labor can't afford demand
        if (savingsDeficit > 0) {
          console.log(
            "labor can't afford demand for", commodity.name,
            savingsDeficit/(commodity.price*demandMet),
          );
          game.unrest += savingsDeficit / (commodity.price * demandMet);
        }
      }

      // labor pool
      let totalLabor = game.labor;
      game.commodities.forEach(c => totalLabor += c.laborAssigned);
      game.labor += config.laborGrowthRate(totalLabor)

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
      commodity.demand = commodity.demandFn(commodity.price, totalPopulation(game));

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
