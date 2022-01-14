// @flow

const React = require('react');
const Button = require('./Components/Button.react');
const InfoCard = require('./Components/InfoCard.react');
const {config} = require('../config');
const {displayMoney} = require('../utils/display');
const {totalPopulation} = require('../selectors/selectors');
const {initGameOverSystem} = require('../systems/gameOverSystem');
const {initEventsSystem} = require('../systems/eventsSystem');
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
    initEventsSystem(store);
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
      <div
        style={{
          overflow: 'hidden',
          width: '100%',
          marginBottom: 6,
        }}
      >
        <Info game={game} dispatch={dispatch} />
        <Ticker game={game} />
      </div>
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
    <InfoCard
      style={{
        height: 124,
        padding: 4,
        marginTop: 4,
        marginRight: 4,
        overflow: 'hidden',
        display: 'block',
      }}
    >
      {messages}
    </InfoCard>
  );
}

function Info(props): React.Node {
  const {game, dispatch} = props;

  return (
    <InfoCard
      style={{
        width: 375,
        float: 'left',
        marginTop: 4,
        marginRight: 4,
      }}
    >
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
        id={game.tickInterval ? '' : 'PLAY'}
        label={game.tickInterval ? 'Pause Simulation' : 'Start Simulation'}
        onClick={() => {
          // dispatch({type: 'TICK'});
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

  const assignMult = config.popToAssignFn(totalPopulation(game));
  return (
    <InfoCard
      style={{
        width: 375,
      }}
    >
      <div>Commodity: {commodity.name}</div>
      <div>Labor Required: {commodity.laborRequired}</div>
      <div>
        Labor Assigned: {commodity.laborAssigned}
        <Button label={"Unassign x " + assignMult}
          onClick={() => dispatch({type: 'INCREMENT_LABOR', laborChange: -1 * assignMult, name})}
          disabled={commodity.laborAssigned <= 0}
        />
        <Button label={"Assign x " + assignMult}
          onClick={() => dispatch({type: 'INCREMENT_LABOR', laborChange: 1 * assignMult, name})}
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
