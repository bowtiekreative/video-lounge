import React from 'react';
import BeboReact from 'bebo-react';
import App from './js/components/App.jsx';
import './style.scss';

document.domain = "bebo-dev.im";

BeboReact.render(
  <App />,
  document.getElementById('app'),
  {disableKeyboardDoneStrip: true, disableAudio: true}
);
