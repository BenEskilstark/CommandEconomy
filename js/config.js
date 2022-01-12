// @flow

const config = {
  msPerTick: 500,

  commodities: [
    {
      name: 'Bread',
      laborRequired: 0.1,
      laborAssigned: 0,
      price: 1,
      inventory: 0,
      demand: 1,
      demandFn: (cost, population) => {
        if (cost <= 5) {
          return 2 * population * (6 - cost);
        }

        return 2 * population;
      },
      unlocked: true,
    },
    {
      name: 'Shirts',
      laborRequired: 1,
      laborAssigned: 0,
      price: 1,
      inventory: 0,
      demand: 1,
      demandFn: (cost, population) => {
        let adjCost = cost > 0 ? cost : 0.01;
        return Math.max(1, Math.floor(population / adjCost));
      },
      unlocked: true,
    },
    {
      name: 'Pants',
      laborRequired: 2,
      laborAssigned: 0,
      price: 2,
      inventory: 0,
      demand: 1,
      demandFn: (cost, population) => {
        let adjCost = cost > 0 ? cost : 0.01;
        return Math.max(1, Math.floor(population / adjCost));
      },
      unlocked: true,
    },
    {
      name: 'Pocket Watches',
      laborRequired: 5,
      laborAssigned: 0,
      price: 5,
      inventory: 0,
      demand: 1,
      demandFn: (cost, population) => {
        return 1;
      },
      unlocked: false,
    },
  ],

  capital: 1000,
  labor: 10,
  laborGrowthRate: (pop, time) => {
    if (time % 10 != 0) {
      return 0;
    }
    return Math.max(1, Math.floor(pop * pop * 0.001))
  },

  wages: 10,
  unrest: 0,
  laborSavings: 50,

  maxTickerLength: 5,
};

module.exports = {
  config,
};
