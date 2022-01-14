// @flow

const React = require('react');

const initEventsSystem = (store) => {
  const {dispatch} = store;
  let time = -1;
  store.subscribe(() => {
    const state = store.getState();
    const {game} = state;
    if (!game) return;
    if (game.time == time) return;
    if (game.time == 0) return;
    time = game.time;

    if (time == 120) {
      dispatch({type: 'APPEND_TICKER', message:
        'Industrial process for shirts discovered'
      });
      dispatch({type: 'APPEND_TICKER', message:
        'Simulation paused while you reconfigure the economy. Press Start to resume',
      });
      dispatch({type: 'UNLOCK_COMMODITY', name: 'Shirts'});
      dispatch({type: 'STOP_TICK'});
    }

    if (time == 240) {
      dispatch({type: 'APPEND_TICKER', message:
        'The People want pants!'
      });
      dispatch({type: 'UNLOCK_COMMODITY', name: 'Pants'});
      dispatch({type: 'STOP_TICK'});
    }

    if (time == 360) {
      dispatch({type: 'APPEND_TICKER', message:
        'The People are starting to get a taste for the finer things... Watches invented',
      });
      dispatch({type: 'UNLOCK_COMMODITY', name: 'Pocket Watches'});
      dispatch({type: 'STOP_TICK'});
    }

    if (time == 450) {
      dispatch({type: 'APPEND_TICKER', message:
        'Gold standard: mine gold to increase your currency reserves',
      });
      dispatch({type: 'UNLOCK_COMMODITY', name: 'Gold'});
      dispatch({type: 'STOP_TICK'});
    }

    if (time == 600) {
      dispatch({type: 'APPEND_TICKER', message:
        'Cars offer the people freedom of transportation',
      });
      dispatch({type: 'APPEND_TICKER', message:
        'Cars run on oil -- the more cars, the more oil must be produced',
      });
      dispatch({type: 'UNLOCK_COMMODITY', name: 'Cars'});
      dispatch({type: 'UNLOCK_COMMODITY', name: 'Oil'});
      dispatch({type: 'STOP_TICK'});
    }

    if (time == 700) {
      dispatch({type: 'APPEND_TICKER', message:
        'Our brightest comrades can now research more efficient production techniques',
      });
      dispatch({type: 'APPEND_TICKER', message:
        'Research produced is converted into less labor required for each commodity',
      });
      dispatch({type: 'UNLOCK_COMMODITY', name: 'Research'});
      dispatch({type: 'STOP_TICK'});
    }

    if (time == 900) {
      dispatch({type: 'APPEND_TICKER', message:
        'Our researchers have created "Smart Phones" for use by the people',
      });
      dispatch({type: 'APPEND_TICKER', message:
        'Smart phones cause unrest to increase faster during economic instability',
      });
      dispatch({type: 'APPEND_TICKER', message:
        'but they also cause unrest to decrease faster during times of economic stability',
      });
      dispatch({type: 'UNLOCK_COMMODITY', name: 'Smart Phones'});
      dispatch({type: 'STOP_TICK'});
    }

  });
};

module.exports = {initEventsSystem};
