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
      game.ticksSinceUnrest += 1;

      // special case for unrest based on how many smart phones have been sold
      const unrestFactor = 1 + getCommodity(game, 'Smart Phones').numSold / 100;

      // commodities
      for (const commodity of game.commodities) {
        if (!commodity.unlocked) continue;

        // compute DEMAND based on price and labor
        commodity.demand = commodity.demandFn(game, commodity.price, totalPopulation(game));

        // compute WAGES for production
        const laborCost = commodity.laborAssigned * game.wages;
        const {result: nextCapital, deficit: laborCostDeficit} =
          subtractWithDeficit(game.capital, laborCost, game.wages /*step*/);
        game.capital = nextCapital;
        game.laborSavings += (laborCost - laborCostDeficit);
        // increase unrest if wages are not payable:
        if (laborCostDeficit > 0) {
          game.unrest += unrestFactor * laborCostDeficit / laborCost;
          game.ticksSinceUnrest = 0;
          appendTicker(game,
            "Unrest! Can't afford to pay labor for " + commodity.name +
            " (Unrest: " + game.unrest.toFixed(2) + "%)",
          );
        }

        // compute PRODUCTION of each commodity based on who you can
        // afford to pay
        const adjWage = game.wages == 0 ? 0.01 : game.wages;
        const fractionalProduction =
          (commodity.laborAssigned - laborCostDeficit / adjWage)
            / commodity.laborRequired;
        let roundFn = Math.floor;
        if (fractionalProduction != Math.floor(fractionalProduction)) {
          const decimal = fractionalProduction - Math.floor(fractionalProduction);
          if (Math.random() < decimal) {
            roundFn = Math.ceil;
          }
        }
        const production = roundFn(fractionalProduction);
        commodity.inventory += production;

        // special cases for gold and research, which are not purchasable commodities
        if (commodity.name == 'Gold') {
          game.capital += commodity.inventory;
          commodity.inventory = 0;
          continue;
        }
        if (commodity.name == 'Research') {
          for (const c of game.commodities) {
            if (commodity.laborRequired <= 0.1) continue;
            commodity.laborRequired -= commodity.inventory / 10;
          }
          commodity.inventory = 0;
        }

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
          game.unrest += unrestFactor * inventoryDeficit / commodity.demand;
          game.ticksSinceUnrest = 0;
          appendTicker(game,
            "Unrest! Inventory doesn't meet demand for " + commodity.name +
            " (Unrest: " + game.unrest.toFixed(2) + "%)",
          );
        }
        // LABOR SAVINGS
        const adjPrice = commodity.price == 0 ? 0.01 : commodity.price;
        const {
          result: nextLaborSavings, deficit: savingsDeficit, amount: revenue,
        } = subtractWithDeficit(
          game.laborSavings, adjPrice * demandMet,
          adjPrice /* step */
        );
        game.laborSavings = nextLaborSavings;
        game.capital += revenue;
        const inventorySold = Math.floor(revenue / adjPrice);
        if (adjPrice == 0) {
          commodity.inventory = Math.max(0, commodity.inventory - commodity.demand);
        } else {
          commodity.inventory -= inventorySold;
        }
        commodity.numSold += inventorySold;

        // increase unrest if labor can't afford demand
        if (savingsDeficit > 0) {
          game.unrest += unrestFactor * savingsDeficit / (adjPrice * demandMet);
          game.ticksSinceUnrest = 0;
          appendTicker(game,
            "Unrest! Labor can't afford demand for " + commodity.name +
            " (Unrest: " + game.unrest.toFixed(2) + "%)",
          );
        }
      }

      // labor pool
      const totalLabor = totalPopulation(game);
      game.labor += config.laborGrowthRate(totalLabor, game.time)

      // check if you lost
      if (game.unrest > 100) {
        game.gameOver = true;
      }

      // reduce unrest a bit
      if (game.ticksSinceUnrest > 20 && game.unrest > 0) {
        if (game.ticksSinceUnrest == 21) {
          appendTicker(game, 'The stability of the economy is causing the unrest to die down');
        }
        game.unrest -= unrestFactor * game.ticksSinceUnrest / 1000;
        if (game.unrest < 0) {
          game.unrest = 0;
        }
      }

      return game;
    }
    case 'APPEND_TICKER': {
      const {message} = action;
      appendTicker(game, message);
      return game;
    }
    case 'SET_GAME_OVER': {
      game.gameOver = true;
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
      commodity.demand = commodity.demandFn(game, commodity.price, totalPopulation(game));

      return game;
    }
    case 'INCREMENT_LABOR': {
      const {name, laborChange} = action;
      const commodity = getCommodity(game, name);
      if (laborChange < 0) { // unassigning labor
        const {amount: laborAmount} =
          subtractWithDeficit(commodity.laborAssigned, -1 * laborChange);
        commodity.laborAssigned -= laborAmount;
        game.labor += laborAmount;
      } else { // assigning labor
        const {amount: laborAmount} = subtractWithDeficit(game.labor, laborChange);
        commodity.laborAssigned += laborAmount;
        game.labor -= laborAmount;
      }
      return game;
    }
    case 'UNLOCK_COMMODITY': {
      const {name} = action;
      const commodity = getCommodity(game, name);
      commodity.unlocked = true;
      commodity.demand = commodity.demandFn(game, commodity.price, totalPopulation(game));
      return game;
    }
  }
  return game;
}

function appendTicker(game, message) {
    game.ticker.push(message);
    if (game.ticker.length > config.maxTickerLength) {
      game.ticker.shift();
    }
}


module.exports = {gameReducer}
