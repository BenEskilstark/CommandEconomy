// @flow

const React = require('react');
const Button = require('./Components/Button.react');
const InfoCard = require('./Components/InfoCard.react');
const {displayMoney} = require('../utils/display');
const {totalPopulation} = require('../selectors/selectors');
const {initGameOverSystem} = require('../systems/gameOverSystem');
const {useState, useMemo, useEffect} = React;

import type {State, Action} from '../types';

type Props = {
  state: State, // Game State
  dispatch: (action: Action) => Action,
};

function Game(props: Props): React.Node {
  const {state, dispatch, store} = props;
  const game = state.game;

  // initializations
  useEffect(() => {
    initGameOverSystem(store);
  }, []);

  const commodities = [];
  for (const commodity of game.commodities) {
    if (commodity.unlocked) {
      commodities.push(
        <Commodity
          key={'commodity_' + commodity.name}
          dispatch={dispatch}
          commodity={commodity} game={game}
        />
      );
    }
  }

  // TODO: add button to pay to unlock next commodity

  return (
    <div>
      <Ticker game={game} />
      <Info game={game} dispatch={dispatch} />
      {commodities}
    </div>
  );
}

function Ticker(props): React.Node {
  const {game} = props;
  const messages = [];
  for (let i = 0; i < game.ticker.length; i++) {
    const message = game.ticker[i];
    messages.push(
      <div
        key={"ticker_" + i}
        style={{

        }}
      >
        {message}
      </div>
    );
  }
  return (
    <div
      style={{
        width: '100%',
        height: 90,
        padding: 4,
      }}
    >
      {messages}
    </div>
  );
}

function Info(props): React.Node {
  const {game, dispatch} = props;

  return (
    <InfoCard>
      <div>Capital: ${game.capital}</div>
      <div>Unassigned Labor: {game.labor} / {totalPopulation(game)}</div>
      <div>
        Wages: ${game.wages}
        <Button label="Lower" disabled={game.wages <= 0}
          onClick={() => dispatch({type: 'INCREMENT_WAGES', wageChange: -1})} />
        <Button label="Raise"
          onClick={() => dispatch({type: 'INCREMENT_WAGES', wageChange: 1})} />
      </div>
      <div>
        Labor's Savings: ${game.laborSavings}
      </div>
      <div>
        Unrest: {game.unrest.toFixed(2)}%
      </div>
      <Button
        label={game.tickInterval ? 'Pause Simulation' : 'Start Simulation'}
        onClick={() => {
          if (game.tickInterval) {
            dispatch({type: 'STOP_TICK'});
          } else {
            dispatch({type: 'START_TICK'});
          }
        }}
      />
    </InfoCard>
  );
}

function Commodity(props): React.Node {
  const {commodity, game, dispatch} = props;
  const {name} = commodity;
  return (
    <InfoCard>
      <div>Commodity: {commodity.name}</div>
      <div>Labor Required: {commodity.laborRequired}</div>
      <div>
        Labor Assigned: {commodity.laborAssigned}
        <Button label="Unassign"
          onClick={() => dispatch({type: 'INCREMENT_LABOR', laborChange: -1, name})}
          disabled={commodity.laborAssigned <= 0}
        />
        <Button label="Assign"
          onClick={() => dispatch({type: 'INCREMENT_LABOR', laborChange: 1, name})}
          disabled={game.labor <= 0}
        />
      </div>
      <div>
        Price: ${commodity.price}
        <Button label="Lower"
          onClick={() => dispatch({type: 'INCREMENT_PRICE', priceChange: -1, name})}
          disabled={commodity.price <= 0}
        />
        <Button label="Raise"
          onClick={() => dispatch({type: 'INCREMENT_PRICE', priceChange: 1, name})}
        />
      </div>
      <div>Inventory: {commodity.inventory}</div>
      <div>Demand: {commodity.demand}</div>
    </InfoCard>
  );
}

module.exports = Game;
