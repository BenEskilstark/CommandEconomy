// @flow

const config = {
  msPerTick: 2500,

  commodities: [
    {
      name: 'Bread',
      laborRequired: 0.1,
      laborAssigned: 0,
      price: 1,
      inventory: 0,
      demand: 1,
      demandFn: (cost, population) => {
        return population;
      },
      unlocked: true,
    },
    {
      name: 'Shirts',
      laborRequired: 0.1,
      laborAssigned: 0,
      price: 1,
      inventory: 0,
      demand: 1,
      demandFn: (cost, population) => {
        return population;
      },
      unlocked: false,
    },
  ],

  capital: 100,
  labor: 10,
  laborGrowthRate: (n) => {
    if (n % 10 != 0) {
      return 0;
    }
    return Math.max(1, Math.floor(n * n * 0.001))
  },

  wages: 10,
  unrest: 0,
  laborSavings: 10,
};

module.exports = {
  config,
};
