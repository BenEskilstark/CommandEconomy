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

// when you want to do A - B, but A must always be >= 0, and you need
// to do something different if B > A, then use this function.
// Returns a {result, deficit, amount} tuple where
// - result is the new value of A after the subtraction, but always >= 0
// - deficit is the leftover value if B > A
// - amount is how much of operandB successfully subtracted
//    (will either equal operandB if deficit = 0 or operandA otherwise)
const subtractWithDeficit = (operandA, operandB) => {
  let result = operandA - operandB;
  let amount = operandB;
  let deficit = 0;
  if (result < 0) {
    deficit = -1 * result;
    amount = operandA;
    result = 0;
  }
  return {result, deficit, amount};
}



module.exports = {
  getCommodity,
  subtractWithDeficit,
};
