import { TokenMetadata } from 'src/services/ft-contract';
import { isClientMobie, useClientMobile } from 'src/utils/device';
import React, { useEffect, useState } from 'react';
import { get_pool_from_cache, getV3PoolId, PoolInfo, V3_POOL_FEE_LIST, V3_POOL_SPLITER } from 'src/services/swapV3';
import { FormattedMessage } from 'react-intl';
import { calculateFeePercent, toInternationalCurrencySystem, toPrecision } from 'src/utils/numbers';
import { InfoIcon } from 'src/components/icon/Common';
import { Slider } from 'src/components/icon/Info';
import { SelectedIcon } from 'src/components/icon';

function LimitOrderCardDetailViewLimit({
                                         setV3Pool,
                                         v3Pool,
                                         poolPercents,
                                         tokenIn,
                                         tokenOut,
                                         tokenPriceList,
                                         setFeeTiersShowFull,
                                         feeTiersShowFull,
                                         everyPoolTvl
                                       }: {
  v3Pool: string;
  setV3Pool: (p: string) => void;
  poolPercents: {
    [key: string]: string;
  };
  tokenIn: TokenMetadata;
  tokenOut: TokenMetadata;
  tokenPriceList: Record<string, any>;
  setFeeTiersShowFull: (v: boolean) => void;
  feeTiersShowFull: boolean;
  everyPoolTvl: {
    [key: string]: string;
  };
}) {
  const isMobile = useClientMobile();
  const [hoverSlider, setHoverSlider] = useState(false);
  const [mobileShowFees, setMobileShowFees] = useState(false);

  function SelectPercent({ fee, poolId }: { fee?: number; poolId?: string }) {
    const id = poolId ? poolId : getV3PoolId(tokenIn.id, tokenOut.id, fee);
    const count = poolPercents?.[id];
    return (
      <span
        className='py-1 xs:py-0 xs:px-0.5 px-2.5 text-v3SwapGray bg-black bg-opacity-20 text-xs inline-flex items-center rounded-xl whitespace-nowrap'
        style={{
          fontSize: isClientMobie() ? '11px' : ''
        }}
      >
        <span className='mr-1'>
          {!tokenPriceList
            ? '-'
            : !count
              ? '-'
              : `${poolPercents?.[id] || '0'}%`}
        </span>
        {!count ? (
          <FormattedMessage id='no_pool' defaultMessage={'No Pool'} />
        ) : (
          <FormattedMessage id='select' defaultMessage={'select'} />
        )}
      </span>
    );
  }

  function SelectTvl({ fee, poolId, className }: {
    fee?: number;
    poolId?: string;
    className?: string;
  }) {
    const id = poolId ? poolId : getV3PoolId(tokenIn.id, tokenOut.id, fee);

    const [PoolDetails, setPoolDetails] = useState<PoolInfo>();

    useEffect(() => {
      get_pool_from_cache(id).then(setPoolDetails);
    }, []);

    function displayTvl() {
      const tvl = everyPoolTvl?.[id] || '0';
      if (!tokenPriceList) {
        return '-';
      } else if (!tvl || +tvl == 0) {
        return '$0';
      } else if (+tvl < 1) {
        return '<$1';
      } else {
        return `$${toInternationalCurrencySystem(tvl.toString(), 0)}`;
      }
    }

    function displayTvlAndNoPool() {
      if (everyPoolTvl?.[id] == null) {
        return <span>No pool</span>;
      } else {
        return (
          <>
            <span className='mr-1.5 xsm:mr-0 xsm:hidden'>TVL</span>
            {displayTvl()}
          </>
        );
      }
    }

    return (
      <div
        className={`transform scale-90 inline-flex items-center text-xs whitespace-nowrap ${className}`}
      >
        {displayTvlAndNoPool()}
      </div>
    );
  }

  function isAllFeesNoPools() {
    const target = V3_POOL_FEE_LIST.find((fee) => {
      const pool_id = getV3PoolId(tokenIn.id, tokenOut.id, fee);
      if (everyPoolTvl?.[pool_id] !== null) return true;
    });
    if (target) {
      return false;
    } else {
      return true;
    }
  }

  if (!(tokenIn && tokenOut)) return null;
  return (
    <>
      <div
        className={`relative border border-limitOrderFeeTiersBorderColor flex flex-col rounded-xl p-2.5 xs:p-2 xs:px-1 ${
          feeTiersShowFull ? 'w-full' : ''
        } ${mobileShowFees ? 'feeBoxGradientBorder' : ''}`}
        onMouseLeave={() => {
          if (!isMobile) {
            setHoverSlider(false);
            setFeeTiersShowFull(false);
          }
        }}
      >
        <div className=''>
          <div className='flex items-center justify-between '>
            <span className='text-xs text-primaryText whitespace-nowrap mr-1.5'>
              <FormattedMessage id='fee_tiers' defaultMessage={'Fee Tiers'} />
            </span>
            <div className={'flex items-center gap-1'}>
              <InfoIcon
                tooltip={
                  'Please note: when the order is filled by instant swap, you will be a liquidity taker. Meanwhile, no fee will be charged when you are a liquidity maker.'
                }
                style={{ maxWidth: 220 }}
              />

              <button
                onMouseEnter={(e) => {
                  if (!isMobile) {
                    setHoverSlider(true);
                    setFeeTiersShowFull(true);
                  }
                }}
                className={`p-0.5 rounded-md ${
                  feeTiersShowFull || hoverSlider || mobileShowFees
                    ? 'bg-selectTokenV3BgColor'
                    : ''
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (isMobile) {
                    setMobileShowFees(!mobileShowFees);
                  }
                }}
              >
                <Slider shrink showSlip={feeTiersShowFull || hoverSlider} />
              </button>
            </div>
          </div>
          <div
            className={`flex items-center mt-2 ${
              feeTiersShowFull ? 'hidden' : ''
            }`}
          >
            {isAllFeesNoPools() ? (
              <span className='text-sm text-limitOrderInputColor'>
                Unavailable
              </span>
            ) : (
              <>
                <span className='whitespace-nowrap text-sm text-primaryText mr-1'>
                  {toPrecision(
                    calculateFeePercent(
                      Number(v3Pool?.split(V3_POOL_SPLITER)[2] || 2000) / 100
                    ).toString(),
                    2
                  )}
                  %
                </span>
                <SelectTvl
                  poolId={v3Pool}
                  className='text-limitOrderInputColor'
                />
              </>
            )}
          </div>
        </div>

        {!feeTiersShowFull ? null : (
          <div className='w-full grid grid-cols-4 gap-x-1 mt-1.5'>
            {V3_POOL_FEE_LIST.map((fee, i) => {
              const pool_id = getV3PoolId(tokenIn.id, tokenOut.id, fee);
              const feePercent = toPrecision(
                calculateFeePercent(fee / 100).toString(),
                2
              );
              const isNoPool = everyPoolTvl?.[pool_id] == null;
              return (
                <button
                  key={i + '-' + pool_id}
                  className={`relative rounded-xl ${
                    v3Pool === pool_id && !isNoPool
                      ? 'bg-feeBoxSelectedBg'
                      : isNoPool
                        ? 'border border-commonTokenBorderColor cursor-not-allowed'
                        : 'bg-selectTokenV3BgColor'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!isNoPool) {
                      setV3Pool(pool_id);
                      setHoverSlider(false);
                      setFeeTiersShowFull(false);
                    }
                  }}
                >
                  <div
                    className={`flex-col flex items-start p-2`}
                  >
                    <span
                      className={`text-sm ${
                        isNoPool
                          ? 'text-primaryText text-opacity-60'
                          : 'text-white'
                      }`}
                    >
                      {feePercent}%
                    </span>
                    <SelectTvl
                      fee={fee}
                      className={`text-primaryText ${
                        isNoPool ? 'text-opacity-60' : ''
                      } `}
                    />
                  </div>
                  {v3Pool === pool_id && !isNoPool ? (
                    <SelectedIcon className='absolute right-0 top-0'></SelectedIcon>
                  ) : null}
                </button>
              );
            })}
          </div>
        )}
      </div>
      <div
        className={`absolute z-10 w-full grid grid-cols-4 gap-x-1  rounded-lg text-white mt-1.5 p-1.5 border border-v3GreyColor  bg-feeBoxBgColor lg:hidden ${
          mobileShowFees ? '' : 'hidden'
        }`}
        style={{ boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.25)', top: '71px' }}
      >
        <ArrowToIcon
          className='absolute right-12'
          style={{ top: '-7px' }}
        ></ArrowToIcon>
        {V3_POOL_FEE_LIST.map((fee, i) => {
          const pool_id = getV3PoolId(tokenIn.id, tokenOut.id, fee);
          const feePercent = toPrecision(
            calculateFeePercent(fee / 100).toString(),
            2
          );
          const isNoPool = everyPoolTvl?.[pool_id] == null;
          return (
            <button
              className={`relative bg-feeSubBoxBgColor rounded-xl ${
                v3Pool === pool_id && !isNoPool
                  ? 'bg-opacity-100'
                  : isNoPool
                    ? 'border border-commonTokenBorderColor cursor-not-allowed bg-opacity-0'
                    : 'bg-opacity-30'
              }`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isNoPool) {
                  setV3Pool(pool_id);
                  setMobileShowFees(false);
                }
              }}
            >
              <div
                key={i + '-' + pool_id}
                className={`flex-col flex items-start p-1`}
              >
                <span
                  className={`text-sm ${
                    isNoPool ? 'text-primaryText text-opacity-60' : 'text-white'
                  }`}
                >
                  {feePercent}%
                </span>
                <SelectTvl
                  fee={fee}
                  className={`text-primaryText ${
                    isNoPool ? 'text-opacity-60' : ''
                  } `}
                />
              </div>
              {v3Pool === pool_id && !isNoPool ? (
                <SelectedIcon className='absolute right-0 top-0'></SelectedIcon>
              ) : null}
            </button>
          );
        })}
      </div>
    </>
  );
}

function ArrowToIcon(props: any) {
  return (
    <img
      {...props}
      src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAHCAYAAAA8sqwkAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyVpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTg4MkE0RkQ2ODI5MTFFREE3MkJEQzEyMDI5MUE2OEUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTg4MkE0RkU2ODI5MTFFREE3MkJEQzEyMDI5MUE2OEUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5ODgyQTRGQjY4MjkxMUVEQTcyQkRDMTIwMjkxQTY4RSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5ODgyQTRGQzY4MjkxMUVEQTcyQkRDMTIwMjkxQTY4RSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PmhvIccAAAD+SURBVHjaYmRgYOAGYkYRERHGN2/eMIAAkM3w9+9fpvfv3/9ngIB/QAxmMwExi4CAAAtQMQuIDcSsXIKCory8IsIgNhAzg2igGjCbEUiAJBh5eHiYvnz5wmDp4V/CwsJWCjLtz59fPcd3bOyGmg7GIN38IJ2/fv1isXD3KwUqLvny5SsDkM/AwcFhJaWkwvzk7s1TUJuYQIQQyCnmbr5FrKzshSDF//79Y/j//z/D799/gJo4LSXllZme3rt1GmgAM7OoqLSinq1TOSsrWyZMMQzANHFycVpIKigx/fn67SajrU/of2CIMHz79h1FMTJgYmIC2sTOwMbGxgAQYADlWluUPx6KyQAAAABJRU5ErkJggg=='
    ></img>
  );
}

export default LimitOrderCardDetailViewLimit;