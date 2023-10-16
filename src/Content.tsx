import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useState,
} from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
  useHistory,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import NavigationBar from './components/layout/NavigationBar';

import Modal from 'react-modal';

import './global.css';
import 'react-toastify/dist/ReactToastify.css';

import { isMobile } from '~utils/device';

import {
  WalletContext,
  globalStateReducer,
  removeSenderLoginRes,
} from './utils/wallets-integration';

import { useGlobalPopUp } from './state/popUp';
import { providers } from 'near-api-js';
import {
  ACCOUNT_ID_KEY,
  useWalletSelector,
} from './context/WalletSelectorContext';
import getConfig from './services/config';
import { AccountView } from 'near-api-js/lib/providers/provider';
import { InjectedWallet } from '@near-wallet-selector/core';
import { REF_FARM_BOOST_CONTRACT_ID, wallet } from './services/near';

import OrderlyContextProvider, {
  OrderlyContext,
} from '~pages/Orderly/orderly/OrderlyContext';
import { list_seeds_info } from './services/farm';
import { ORDERLY_ASSET_MANAGER } from './pages/Orderly/near';
import {
  get_orderly_public_key_path,
  generateTradingKeyPair,
} from './pages/Orderly/orderly/utils';
import PageRouter from './PageRouter';

export type Account = AccountView & {
  account_id: string;
};

Modal.defaultStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 100,
    outline: 'none',
  },
  content: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -65%)',
    outline: 'none',
  },
};

Modal.setAppElement('#root');

export function Content() {
  const GlobalStateReducer = useReducer(globalStateReducer, {
    isSignedIn: false,
  });
  const [globalState, globalStatedispatch] = GlobalStateReducer;

  const { selector, modal, accounts, accountId, setAccountId } =
    useWalletSelector();

  const getAccount = useCallback(async (): Promise<Account | null> => {
    if (!accountId) {
      return null;
    }

    const provider = new providers.JsonRpcProvider({
      url: getConfig().nodeUrl,
    });

    return provider
      .query<AccountView>({
        request_type: 'view_account',
        finality: 'final',
        account_id: accountId,
      })
      .then((data: any) => ({
        ...data,
        account_id: accountId,
      }));
  }, [accountId]);

  useEffect(() => {
    if (!accountId) {
      return null;
    }

    getAccount()
      .then(async (res) => {
        if ((await selector.wallet()).id === 'sender') {
          ((await selector.wallet()) as InjectedWallet)
            .signIn({
              contractId: REF_FARM_BOOST_CONTRACT_ID,
            })
            .then(() => {
              globalStatedispatch({ type: 'signIn' });
            });
        } else {
          globalStatedispatch({ type: 'signIn' });
        }
      })
      .catch(async (e) => {
        alert(
          `Account ID: ${accountId} has not been found. Please transfer some NEAR to this account and try again.`
        );
        const wallet = await selector.wallet();
        await wallet.signOut();

        window.location.reload();
      });
  }, [accountId, getAccount]);

  useEffect(() => {
    if (
      !window?.near?.isSender ||
      selector?.store?.getState()?.selectedWalletId !== 'sender'
    )
      return;

    window.near.on('accountChanged', async (changedAccountId: string) => {
      const senderModule = selector.store
        .getState()
        .modules.find((m) => m.id === 'sender');

      const senderWallet = (await senderModule.wallet()) as InjectedWallet;

      await senderWallet.signIn({
        contractId: ORDERLY_ASSET_MANAGER,
      });

      window.location.reload();
    });
  }, [window.near]);

  useGlobalPopUp(globalState);

  React.useEffect(() => {
    const pubkey = localStorage.getItem(get_orderly_public_key_path());

    if (!pubkey && accountId) {
      generateTradingKeyPair();
    }
  }, [accountId]);

  if (isMobile()) {
    document.body.style.setProperty('overflow-x', 'hidden');
    document.documentElement.style.setProperty('overflow-x', 'hidden');
  }

  return (
    <WalletContext.Provider value={{ globalState, globalStatedispatch }}>
      <NavigationBar />
      <ToastContainer
        newestOnTop={
          window.location.pathname.startsWith('/orderbook') ? true : false
        }
        style={{
          marginTop: isMobile() ? 'none' : '44px',
        }}
      />
      <OrderlyContextProvider>
        <PageRouter />
      </OrderlyContextProvider>
    </WalletContext.Provider>
  );
}
