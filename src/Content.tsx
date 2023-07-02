import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useState,
} from 'react';

import { ReferendumPage } from '~pages/ReferendumPage';

import FarmsMigrate from '~pages/farms/FarmsMigrate';
import FarmsBoosterPage from '~pages/farms/FarmsBoostPage';
import YourLiquidityPageV3 from './pages/poolsV3/YourLiquidityPageV3';
import AddYourLiquidityPageV3 from './pages/poolsV3/AddYourLiquidityPageV3';
import YourLiquidityDetailV3 from './pages/poolsV3/YourLiquidityDetailV3';
import PoolDetailV3 from './pages/poolsV3/PoolDetailV3';
import MyOrderPage from '~pages/MyOrder';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
  useHistory,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import DepositPage from './pages/DepositPage';
import { PoolDetailsPage } from './pages/pools/DetailsPage';
import SwapPage from './pages/SwapPage';
import { AccountPage } from './pages/AccountPage';
import { RecentActivityPage } from './pages/RecentActivityPage';
import { LiquidityPage } from './pages/pools/LiquidityPage';
import { AddTokenPage } from './pages/pools/AddTokenPage';
import AdboardPage from './pages/Adboard/AdboardPage';
import NavigationBar from './components/layout/NavigationBar';
import Footer from './components/layout/Footer';
import { MorePoolsPage } from '~pages/pools/MorePoolsPage';
import StableSwapPage from './pages/stable/StableSwapPage';
import XrefPage from './pages/xref/XrefPage';
import RiskPage from './pages/RiskPage';
import USNPage from './pages/USNPage';
import Portfolio from './pages/Portfolio';
import Burrow from './pages/Burrow';
import Overview from './pages/Overview';
import {
  auroraAddr,
  getAuroraPool,
  getErc20Addr,
  useAuroraTokens,
} from './services/aurora/aurora';
import {
  BgShapeLeftTop,
  BgShapeCenter,
  BgShapeCenterSmall,
} from './components/icon';
import Modal from 'react-modal';
import AllOrders from './pages/Orderly/components/AllOrders';

import './global.css';
import 'react-toastify/dist/ReactToastify.css';
import { FarmsPage } from '~pages/farms/FarmsPage';
import { AirdropPage } from '~pages/AirdropPage';

import { isMobile } from '~utils/device';

import { StableSwapPageEntry } from '~pages/stable/StableSwapEntry';

import {
  WalletContext,
  globalStateReducer,
  removeSenderLoginRes,
} from './utils/wallets-integration';

import { StableSwapRouter } from './pages/stable/StableSwapRouter';

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
import { LedgerTransactionModal } from './context/modal-ui/modal';
import View from './pages/Orderly/OrderlyTradingBoard';
import OrderlyContextProvider, {
  OrderlyContext,
} from '~pages/Orderly/orderly/OrderlyContext';
import { list_seeds_info } from './services/farm';
import { ORDERLY_ASSET_MANAGER } from './pages/Orderly/near';
import {
  get_orderly_public_key_path,
  generateTradingKeyPair,
} from './pages/Orderly/orderly/utils';

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
      .catch((e) => {});
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

  return (
    <WalletContext.Provider value={{ globalState, globalStatedispatch }}>
      <NavigationBar />
      <ToastContainer
        newestOnTop={window.location.pathname === '/orderbook' ? true : false}
        style={{
          marginTop: isMobile() ? 'none' : '44px',
        }}
      />
      <OrderlyContextProvider>
        <Switch>
          {/* <Route path="/account" component={AccountPage} />
          <Route path="/recent" component={RecentActivityPage} />
          <Route
            path="/more_pools/:tokenIds"
            component={AutoHeight(MorePoolsPage)}
          />
          <Route path="/pool/:id" component={AutoHeight(PoolDetailsPage)} />
          <Route path="/pools/add-token" component={AutoHeight(AddTokenPage)} />
          <Route path="/pools" component={AutoHeight(LiquidityPage)} />
          <Route path="/airdrop" component={AutoHeight(AirdropPage)} />
          <Route path="/farms" component={AutoHeight(FarmsPage)} />
          <Route path={`/sauce/:id`} component={AutoHeight(StableSwapRouter)} />
          <Route path={'/myOrder'} component={AutoHeight(MyOrderPage)} />

          <Route path={'/orderly/all-orders'} component={AllOrders} />

          <Route
            path="/yourliquidity"
            component={AutoHeight(YourLiquidityPageV3)}
          />
          <Route
            path="/yoursLiquidityDetailV2/:id/:status?"
            component={AutoHeight(YourLiquidityDetailV3)}
          />

          <Route path="/orderbook" component={View} />
          <Route
            path="/addLiquidityV2"
            component={AutoHeight(AddYourLiquidityPageV3)}
          />

          <Route path="/sauce" component={AutoHeight(StableSwapPageEntry)} />

          <Route path="/xref" component={AutoHeight(XrefPage)} />
          <Route path="/risks" component={AutoHeight(RiskPage)} />
          {!!getConfig().REF_VE_CONTRACT_ID ? (
            <Route path="/referendum" component={AutoHeight(ReferendumPage)} />
          ) : null}

          <Route
            path="/v2farms/:id?"
            component={AutoHeight(FarmsBoosterPage)}
          />
          <Route path="/farmsMigrate" component={AutoHeight(FarmsMigrate)} />
          <Route path="/poolV2/:id" component={AutoHeight(PoolDetailV3)} />
          <Route path="/portfolio" component={AutoHeight(Portfolio)} />
          <Route path="/burrow" component={AutoHeight(Burrow)} />
          <Route path="/overview" component={AutoHeight(Overview)} /> */}
          <Route path="/" component={AutoHeight(View)} />
        </Switch>
      </OrderlyContextProvider>
    </WalletContext.Provider>
  );
}

// decorate any components with this HOC to display them as vertical-align middle
// use individual fn is needed since `h-4/5` is not a appropriate style rule for
// any components
function AutoHeight(Comp: any) {
  return (props: any) => {
    return (
      <div className="xs:flex xs:flex-col md:flex md:flex-col justify-center h-4/5 lg:mt-12 relative">
        <Comp {...props} />
      </div>
    );
  };
}
