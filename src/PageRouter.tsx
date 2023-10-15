import { Route, Switch } from 'react-router-dom';
import React,{lazy} from 'react';
import { OrderlyPerpetual } from './pages/Orderly/OrderlyPerpetual';
import OrderlyTradingBoard from '~pages/Orderly/OrderlyTradingBoard';
import { AccountPage } from '~pages/AccountPage';
import { RecentActivityPage } from '~pages/RecentActivityPage';
import { MorePoolsPage } from '~pages/pools/MorePoolsPage';
import { PoolDetailsPage } from '~pages/pools/DetailsPage';
import { AddTokenPage } from '~pages/pools/AddTokenPage';
import { LiquidityPage } from '~pages/pools/LiquidityPage';
import { AirdropPage } from '~pages/AirdropPage';
import { FarmsPage } from '~pages/farms/FarmsPage';
import { StableSwapRouter } from '~pages/stable/StableSwapRouter';
import MyOrderPage from '~pages/MyOrder';
import YourLiquidityPageV3 from '~pages/poolsV3/YourLiquidityPageV3';
import YourLiquidityDetailV3 from '~pages/poolsV3/YourLiquidityDetailV3';
import AddYourLiquidityPageV3 from '~pages/poolsV3/AddYourLiquidityPageV3';
import { StableSwapPageEntry } from '~pages/stable/StableSwapEntry';
import XrefPage from '~pages/xref/XrefPage';
import RiskPage from '~pages/RiskPage';
import getConfig from '~services/config';
import { ReferendumPage } from '~pages/ReferendumPage';
import FarmsBoosterPage from '~pages/farms/FarmsBoostPage';
import FarmsMigrate from '~pages/farms/FarmsMigrate';
import PoolDetailV3 from '~pages/poolsV3/PoolDetailV3';
import Portfolio from '~pages/Portfolio';
import Burrow from '~pages/Burrow';
import Overview from '~pages/Overview';
import PortfolioOrderly from '~pages/Orderly/PorfolioOrderly';
import SwapPage from '~pages/SwapPage';

// const OrderlyPerpetual = React.lazy(() => import('./pages/Orderly/OrderlyPerpetual.js'))

// const OrderlyPerpetual = lazy(() => new Promise((resolve, reject) => {
//   import('./pages/Orderly/OrderlyPerpetual.js')
//     .then(result => resolve(result.default ? result : { default: result }))
//     .catch(reject);
// }));

const PageRouter=()=>{
  return (
    <Switch>
      <Route
        path="/orderbook/perps"
        component={AutoHeightNoOffset(OrderlyPerpetual)}
      />

      <Route
        path="/orderbook/spot"
        component={AutoHeightNoOffset(OrderlyTradingBoard)}
      />

      <Route path="/account" component={AccountPage} />
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

      <Route
        path="/yourliquidity"
        component={AutoHeight(YourLiquidityPageV3)}
      />
      <Route
        path="/yoursLiquidityDetailV2/:id/:status?"
        component={AutoHeight(YourLiquidityDetailV3)}
      />

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
      <Route path="/overview" component={AutoHeight(Overview)} />

      <Route
        path="/orderbook"
        component={AutoHeightNoOffset(OrderlyTradingBoard)}
        exact
      />

      <Route path="/overview" component={AutoHeight(Overview)} />
      <Route path="/orderly" component={AutoHeight(PortfolioOrderly)} />
      <Route path="/" component={AutoHeight(SwapPage)} />
    </Switch>
  )
}


// decorate any components with this HOC to display them as vertical-align middle
// use individual fn is needed since `h-4/5` is not a appropriate style rule for
// any components
function AutoHeight(Comp: any) {
  return (props: any) => {
    return (
      <div className="xs:flex xs:flex-col md:flex md:flex-col justify-center h-4/5 lg:mt-12 relative xs:pb-14">
        <Comp {...props} />
      </div>
    );
  };
}

function AutoHeightNoOffset(Comp: any) {
  return (props: any) => {
    return (
      <div className="xs:flex xs:flex-col md:flex md:flex-col justify-center h-4/5 relative lg:mt-9 xs:pb-14">
        <Comp {...props} />
      </div>
    );
  };
}

export default PageRouter