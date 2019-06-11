import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app/App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router } from 'react-router-dom';


import { LocaleProvider } from 'antd';
import es_ES from 'antd/lib/locale-provider/es_ES';
import moment from 'moment';
import 'moment/locale/es';


moment.locale('es');

ReactDOM.render(
    <Router>
        {/* <LocaleProvider locale={es_ES}> */}
        <App />
        {/* </LocaleProvider> */}
    </Router>,
    document.getElementById('root')
);

registerServiceWorker();
