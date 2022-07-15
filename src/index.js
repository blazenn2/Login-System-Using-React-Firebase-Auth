import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import App from './App';
import NodeContext from '../src/Context/Node/NodeContext'

ReactDOM.render(
  <NodeContext>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </NodeContext>,
  document.getElementById('root')
);
