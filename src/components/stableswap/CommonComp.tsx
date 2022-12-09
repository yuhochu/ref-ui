import React, { useState, useEffect, useContext } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { TokenMetadata } from '../../services/ft-contract';
import { toRealSymbol } from '../../utils/token';
import { shareToUserTotal } from './RemoveLiquidity';
import { Card } from '../card/Card';
import { QuestionTip } from '../../components/layout/TipWrapper';
import BigNumber from 'bignumber.js';
import { useCanFarm, useCanFarmV1, useCanFarmV2 } from '../../state/farm';
import { useFarmStake } from '../../state/farm';
import { Pool, canFarmV1, canFarmV2 } from '../../services/pool';
import { Link, useHistory } from 'react-router-dom';
import { FarmDot } from '~components/icon';
import { ShareInFarmV2 } from '../layout/ShareInFarm';
import { useYourliquidity } from '../../state/pool';
import {
  WatchListStartEmpty,
  WatchListStartFull,
} from '../../components/icon/WatchListStar';
import { WalletContext } from '../../utils/wallets-integration';
import { useWalletSelector } from '../../context/WalletSelectorContext';
import {
  addPoolToWatchList,
  removePoolFromWatchList,
  getWatchListFromDb,
} from '../../services/pool';
import { isClientMobie } from '../../utils/device';
import ReactTooltip from 'react-tooltip';
import { REF_FI_POOL_ACTIVE_TAB } from '../../pages/pools/LiquidityPage';

export function BackToStablePoolList() {
  const history = useHistory();

  return (
    <div className="flex items-center text-base text-farmText ">
      <span
        onClick={() => {
          localStorage.setItem(REF_FI_POOL_ACTIVE_TAB, 'stable');

          history.push('/pools');
        }}
        className="hover:text-white  cursor-pointer"
      >
        <span className="pr-1.5">{'<'}</span>
        <span>
          <FormattedMessage id="pools" defaultMessage="Pools" />
        </span>
      </span>
    </div>
  );
}

export const Images = ({
  tokens,
  size,
  className,
  noverlap,
  borderStyle,
  isRewardDisplay,
  border,
}: {
  tokens: TokenMetadata[];
  size?: string;
  className?: string;
  noverlap?: boolean;
  borderStyle?: string;
  isRewardDisplay?: boolean;
  border?: boolean;
}) => {
  const displayTokens = [...new Set<string>(tokens?.map((t) => t?.id))].map(
    (id) => tokens.find((t) => t?.id === id)
  );

  return (
    <div className={`${className} flex items-center flex-shrink-0`}>
      {tokens &&
        displayTokens
          ?.slice(0, isRewardDisplay ? 5 : displayTokens.length)
          ?.map((token, index) => {
            const icon = token?.icon;
            const id = token?.id;
            if (icon)
              return (
                <img
                  key={id || 0 + index}
                  className={`inline-block flex-shrink-0 h-${size || 10} w-${
                    size || 10
                  } rounded-full border ${
                    border ? 'border' : ''
                  } border-gradientFromHover ${
                    tokens?.length > 1 ? (noverlap ? 'ml-0' : '-ml-1') : ''
                  } bg-cardBg`}
                  src={icon}
                  style={{
                    border: borderStyle || 'none',
                  }}
                />
              );
            return (
              <div
                key={id || 0 + index}
                className={`inline-block h-${size || 10} flex-shrink-0 w-${
                  size || 10
                } rounded-full bg-cardBg border border-gradientFromHover -ml-1 `}
                style={{
                  border: borderStyle || 'none',
                }}
              ></div>
            );
          })}
      {displayTokens.length > 5 && (
        <div
          key={5 + '-more-extra-tokens'}
          className={`inline-block h-${
            size || 10
          } flex-shrink-0 flex items-center justify-center text-gradientFrom w-${
            size || 10
          } rounded-full bg-darkBg border border-gradientFromHover -ml-1 `}
        >
          <span className={`relative bottom-1`}>...</span>
        </div>
      )}
    </div>
  );
};

export const Symbols = ({
  withArrow,
  tokens,
  size,
  seperator,
  fontSize,
}: {
  withArrow?: boolean;
  tokens: TokenMetadata[];
  size?: string;
  seperator?: string;
  fontSize?: string;
}) => {
  return (
    <div
      className={`text-white ${fontSize || 'font-bold'}  ${
        withArrow ? 'cursor-pointer' : null
      } ${size}`}
    >
      {tokens?.map((token, index) => (
        <span key={token?.id || index}>
          {index ? seperator || '/' : ''}
          {toRealSymbol(token?.symbol || '')}
        </span>
      ))}
      {withArrow ? <span className="ml-1.5">{'>'}</span> : null}
    </div>
  );
};

export function SharesCard({ shares, pool }: { shares: string; pool: Pool }) {
  const { farmCount: countV1, endedFarmCount: endedFarmCountV1 } = useCanFarmV1(
    pool.id,
    true
  );

  const { farmCount: countV2, endedFarmCount: endedFarmCountV2 } = useCanFarmV2(
    pool.id,
    true
  );

  const { farmStakeV1, farmStakeV2, userTotalShare } = useYourliquidity(
    pool.id
  );

  return (
    <Card
      padding={'px-7 xs:px-4 py-4 mb-2'}
      rounded="rounded-2xl"
      className="text-sm flex items-center justify-between"
      width="w-full"
    >
      <span className="text-primaryText flex items-center">
        <FormattedMessage id="my_shares" defaultMessage="Shares" />
        <QuestionTip id="shares_tip" />
      </span>
      <div className="flex items-center  mr-1 xs:ml-1.5 md:ml-1.5">
        {shareToUserTotal({
          shares,
          userTotalShare,
          haveFarm: !!countV1 || !!countV2,
          pool,
        })}
        <div className="flex flex-col items-end">
          {countV1 > endedFarmCountV1 || Number(farmStakeV1) > 0 ? (
            <ShareInFarmV2
              farmStake={farmStakeV1}
              userTotalShare={userTotalShare}
              version={'V1'}
            />
          ) : null}

          {countV2 > endedFarmCountV2 || Number(farmStakeV2) > 0 ? (
            <ShareInFarmV2
              farmStake={farmStakeV2}
              userTotalShare={userTotalShare}
              version={'V2'}
              poolId={pool.id}
              onlyEndedFarm={endedFarmCountV2 === countV2}
            />
          ) : null}
        </div>
      </div>
    </Card>
  );
}

export const StableTokens = ({
  tokens,
  pool,
}: {
  tokens: TokenMetadata[];
  pool?: Pool;
}) => {
  const [showFullStart, setShowFullStar] = useState<Boolean>(false);
  const { globalState } = useContext(WalletContext);
  const { modal } = useWalletSelector();
  const isSignedIn = globalState.isSignedIn;
  const intl = useIntl();
  useEffect(() => {
    if (pool?.id) {
      getWatchListFromDb({ pool_id: pool.id.toString() }).then((watchlist) => {
        setShowFullStar(watchlist.length > 0);
      });
    }
  }, [pool]);
  const handleSaveWatchList = () => {
    if (!isSignedIn) {
      modal.show();
    } else {
      if (pool?.id) {
        addPoolToWatchList({ pool_id: pool.id.toString() }).then(() => {
          setShowFullStar(true);
        });
      }
    }
  };
  const handleRemoveFromWatchList = () => {
    if (pool?.id) {
      removePoolFromWatchList({ pool_id: pool.id.toString() }).then(() => {
        setShowFullStar(false);
      });
    }
  };
  function add_to_watchlist_tip() {
    const tip = intl.formatMessage({ id: 'add_to_watchlist' });
    let result: string = `<div class="text-navHighLightText text-xs text-left font-normal">${tip}</div>`;
    return result;
  }

  function remove_from_watchlist_tip() {
    const tip = intl.formatMessage({ id: 'remove_from_watchlist' });
    let result: string = `<div class="text-navHighLightText text-xs text-left font-normal">${tip}</div>`;
    return result;
  }
  const isMobile = isClientMobie();
  return (
    <div className="flex items-center justify-between pt-6 pb-5 ml-4">
      <div className="flex items-center">
        <Images tokens={tokens} />
        <span className="ml-4">
          <Symbols tokens={tokens} size="text-2xl xsm:text-xl" />
        </span>
      </div>
      <div
        className="flex items-center justify-center rounded-lg cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          showFullStart ? handleRemoveFromWatchList() : handleSaveWatchList();
        }}
        style={{
          background: '#172534',
          width: '30px',
          height: '24px',
        }}
      >
        {showFullStart ? (
          <div
            className="text-sm "
            data-type="info"
            data-place="right"
            data-multiline={true}
            data-class="reactTip"
            data-html={true}
            data-tip={isMobile ? '' : remove_from_watchlist_tip()}
            data-for="fullstar-tip"
          >
            <WatchListStartFull />

            <ReactTooltip
              id="fullstar-tip"
              backgroundColor="#1D2932"
              border
              borderColor="#7e8a93"
              effect="solid"
            />
          </div>
        ) : (
          <div
            className="text-sm "
            data-type="info"
            data-place="right"
            data-multiline={true}
            data-class="reactTip"
            data-html={true}
            data-tip={isMobile ? '' : add_to_watchlist_tip()}
            data-for="emptystar-tip"
          >
            <WatchListStartEmpty />
            <ReactTooltip
              id="emptystar-tip"
              backgroundColor="#1D2932"
              border
              borderColor="#7e8a93"
              effect="solid"
            />
          </div>
        )}
      </div>
    </div>
  );
};
