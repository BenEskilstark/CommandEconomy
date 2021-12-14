// @flow

const getCommodity = (game: Game, name: string): Commodity => {
  for (const commodity of game.commodities) {
    if (commodity.name == name) {
      return commodity;
    }
  }
  console.error("no commodity named", name);
  return null;
};

module.exports = {
  getCommodity,
};
