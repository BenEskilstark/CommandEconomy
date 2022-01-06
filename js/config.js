// @flow

const config = {
  commodities: [
    {
      name: 'Bread',
      laborRequired: 0.1,
      laborAssigned: 0,
      price: 1,
      inventory: 0,
      demand: 1,
      unlocked: true,
    },
    {
      name: 'Shirts',
      laborRequired: 0.1,
      laborAssigned: 0,
      price: 1,
      inventory: 0,
      demand: 1,
      unlocked: false,
    },
  ],

  capital: 100,
  labor: 10,
  laborGrowthRate: (n) => Math.max(1, Math.floor(n * n * 0.001)),

  wages: 2,
  unrest: 0,
};

module.exports = {
  config,
};
