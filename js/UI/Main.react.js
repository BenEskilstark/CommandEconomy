// @flow

const React = require('react');
const Button = require('./Components/Button.react');
const Modal = require('./Components/Modal.react');
const Game = require('./Game.react');
// const Lobby = require('./Lobby.react');

import type {State, Action} from '../types';

type Props = {
  state: State, // Game State
  dispatch: (action: Action) => Action,
  store: Object,
  modal: Object,
};

function Main(props: Props): React.Node {
  const {state, modal} = props;
  let content = null;
  if (state.screen === 'LOBBY') {
    content = <Lobby dispatch={props.dispatch} store={props.store} />;
  } else if (state.screen === 'GAME') {
    content = <Game dispatch={props.dispatch} state={state} store={props.store} />;
  }

  return (
    <React.Fragment>
      {content}
      {modal}
    </React.Fragment>
  )
}

function Lobby(props): React.Node {
  return (
    <div>
      <Button
        label="Play"
        onClick={() => {
          props.dispatch({
            type: 'SET_MODAL',
            modal: (<PlayModal dispatch={props.dispatch} />),
          });
        }}
      />
    </div>
  );
}

function PlayModal(props): React.Node {
  const {dispatch} = props;
  return (
    <Modal
      title={"Command Economy"}
      body={
        "Prove Marx right! Assign laborers to jobs, set their wages, and control " +
        "the prices of the commodities they produce. If the economy is unstable then " +
        "unrest will go up. If unrest hits 100%, then you will be deposed. " +
        "Press the Start Simulation button to begin once you have your initial configuration."
      }
      buttons={[
        {
          label: "Play",
          onClick: () => {
            dispatch({type: 'DISMISS_MODAL'});
            dispatch({type: 'START', screen: 'GAME'});
            // dispatch({type: 'START_TICK'});
          },
        }
      ]}
    />
  );
}


module.exports = Main;
