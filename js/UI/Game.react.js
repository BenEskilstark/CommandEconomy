// @flow

const React = require('react');
const Button = require('./Components/Button.react');
const InfoCard = require('./Components/InfoCard.react');
const {displayMoney} = require('../utils/display');

import type {State, Action} from '../types';

type Props = {
  state: State, // Game State
  dispatch: (action: Action) => Action,
};

function Game(props: Props): React.Node {
  const {state, dispatch} = props;
  const game = state.game;

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
      <Info game={game} dispatch={dispatch} />
      {commodities}
    </div>
  );
}

function Info(props): React.Node {
  const {game, dispatch} = props;

  return (
    <InfoCard>
      <div>Capital: {game.capital}</div>
      <div>Labor: {game.labor}</div>
      <div>
        Wages: {game.wages}
        <Button label="Lower Wages" disabled={game.wages <= 0}
          onClick={() => dispatch({type: 'INCREMENT_WAGES', wageChange: -1})} />
        <Button label="Raise Wages"
          onClick={() => dispatch({type: 'INCREMENT_WAGES', wageChange: 1})} />
      </div>
      <div>
        Unrest: {game.unrest}%
      </div>
      <Button label="Step Simulation" onClick={() => dispatch({type: 'TICK'})} />
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
        <Button label="Unassign Labor"
          onClick={() => dispatch({type: 'INCREMENT_LABOR', laborChange: -1, name})}
          disabled={commodity.laborAssigned <= 0}
        />
        <Button label="Assign Labor"
          onClick={() => dispatch({type: 'INCREMENT_LABOR', laborChange: 1, name})}
          disabled={game.labor <= 0}
        />
      </div>
      <div>
        Price: {commodity.price}
        <Button label="Lower Price"
          onClick={() => dispatch({type: 'INCREMENT_PRICE', priceChange: -1, name})}
          disabled={commodity.price <= 0}
        />
        <Button label="Raise Price"
          onClick={() => dispatch({type: 'INCREMENT_PRICE', priceChange: 1, name})}
        />
      </div>
      <div>Inventory: {commodity.inventory}</div>
      <div>Demand: {commodity.demand}</div>
    </InfoCard>
  );
}

module.exports = Game;
