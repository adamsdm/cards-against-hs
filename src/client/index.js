import React from 'react'
import { render } from 'react-dom'
import App from './components/App'


// Force hot module reloading
if (module.hot) {
  module.hot.accept();
}

render(
     <App />,
    document.getElementById('app')
)
