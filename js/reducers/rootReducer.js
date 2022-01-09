// @flow

const {gameReducer} = require('./gameReducer');
const {modalReducer} = require('./modalReducer');
const {config} = require('../config');
const {deepCopy} = require('../utils/helpers');
const {totalPopulation} = require('../selectors/selectors');

import type {State, Action} from '../types';

const rootReducer = (state: State, action: Action): State => {
  if (state === undefined) return initState();

  switch (action.type) {
    case 'START': {
      const {screen} = action;
      const game = initGameState();
      return {
        ...state,
        screen,
        game,
      };
    }
    case 'SET_SCREEN': {
      const {screen} = action;
      const nextState = {...state, screen};
      if (screen == 'LOBBY') {
        nextState.game = null;
      }
      return nextState;
    }
    case 'SET_MODAL':
    case 'DISMISS_MODAL':
      return modalReducer(state, action);
    case 'INCREMENT_PRICE':
    case 'INCREMENT_LABOR':
    case 'INCREMENT_WAGES':
    case 'START_TICK':
    case 'STOP_TICK':
    case 'TICK': {
      if (!state.game) return state;
      return {
        ...state,
        game: gameReducer(state.game, action),
      };
    }
  }
  return state;
};


//////////////////////////////////////
// Initializations
const initState = () => {
  return {
    screen: 'LOBBY',
    game: null,
  };
}

const initGameState = () => {
  const game = {
    commodities: config.commodities.map(c => deepCopy(c)),
    capital: config.capital,
    labor: config.labor,
    wages: config.wages,
    unrest: config.unrest,
    laborSavings: config.laborSavings,
    people: [],
    time: 0,
  };

  for (const commodity of game.commodities) {
    commodity.demand = commodity.demandFn(commodity.price, totalPopulation(game));
  }

  return game;
}

module.exports = {rootReducer};
