import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
  useHistory,
} from 'react-router-dom';

import Footer from './components/layout/Footer';

import './global.css';
import 'react-toastify/dist/ReactToastify.css';
import ExternalPopUp from './components/layout/ExternalPopUp';
import Guider from './components/layout/Guider';

import {
  WalletSelectorContextProvider,
  useWalletSelector,
} from './context/WalletSelectorContext';

import { Content } from './Content';
import { LedgerTransactionModal } from './context/modal-ui/modal';
import { XmasActivityContextProvider } from './context/XmasActivity';

function App() {
  return (
    <Router>
      <WalletSelectorContextProvider>
        <XmasActivityContextProvider>
          <div className="page-container relative min-h-screen pb-24 lg:overflow-x-hidden xs:flex xs:flex-col md:flex md:flex-col">
            <Content />

            <Footer />
            <ExternalPopUp></ExternalPopUp>
            <Guider></Guider>
          </div>
        </XmasActivityContextProvider>
      </WalletSelectorContextProvider>

      <LedgerTransactionModal />
    </Router>
  );
}

export default App;
