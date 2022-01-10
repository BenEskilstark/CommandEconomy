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
          return population * (6 - cost);
        }

        return population;
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
        return Math.floor(population / cost);
      },
      unlocked: true,
    },
  ],

  capital: 1000,
  labor: 10,
  laborGrowthRate: (n) => {
    if (n % 10 != 0 || n == 0) {
      return 0;
    }
    return Math.max(1, Math.floor(n * n * 0.001))
  },

  wages: 10,
  unrest: 0,
  laborSavings: 50,
};

module.exports = {
  config,
};
