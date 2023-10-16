import { ftGetBalance, REF_META_DATA, TokenMetadata } from "~services/ft-contract";
import { SWAP_MODE, SWAP_TYPE, SwapProContext } from "~pages/SwapPage";
import getConfig, { getExtraStablePoolConfig } from "~services/config";
import React, { useContext, useEffect, useState } from "react";
import { useWalletSelector } from "~context/WalletSelectorContext";
import { FormattedMessage, useIntl } from "react-intl";
import { useHistory, useLocation } from "react-router-dom";
import { useDepositableBalance, useTokenPriceList } from "~state/token";
import { nearDeposit, nearWithdraw, unwrapedNear, wnearMetadata, WRAP_NEAR_CONTRACT_ID } from "~services/wrap-near";
import { getMax, ONLY_ZEROS, toPrecision, toReadableNumber } from "~utils/numbers";
import { useCrossSwapPopUp, useRefSwapPro, useSwapPopUp } from "~state/swap";
import BigNumber from "bignumber.js";
import Big from "big.js";
import { NEAR_WITHDRAW_KEY } from "~components/forms/WrapNear";
import SwapFormWrap from "~components/forms/SwapFormWrap";
import SubmitButton, { InsufficientButton } from "~components/forms/SubmitButton";
import { ConnectToNearBtnSwap } from "~components/button/Button";
import { TokenAmountV3 } from "~components/forms/TokenAmount";
import Alert from "~components/alert/Alert";
import { CountdownTimer, SwapExchange } from "~components/icon";
import { isMobile } from "~utils/device";
import { FaAngleDown, FaAngleUp } from "~components/reactIcons";
import { DoubleCheckModal, SkyWardModal } from "~components/layout/SwapDoubleCheck";
import {
  DetailView_near_wnear,
  getPriceImpactTipType,
  SUPPORT_LEDGER_KEY,
  SwapRate,
  unWrapTokenId,
  wrapTokenId
} from "~components/swap/SwapCard";

export default function SwapCard(props: {
  allTokens: TokenMetadata[];
  swapMode: SWAP_MODE;
  tokenInAmount: string;
  setTokenInAmount: (value: string) => void;
  tokenInAmountInput: string;
  setTokenInAmountInput: (value: string) => void;
  swapTab?: JSX.Element;
  globalWhiteListTokens: TokenMetadata[];
  setTokenIn: (value: TokenMetadata) => void;
  tokenIn: TokenMetadata;
  setTokenOut: (value: TokenMetadata) => void;
  tokenOut: TokenMetadata;
}) {
  const { NEARXIDS, STNEARIDS } = getExtraStablePoolConfig();
  const { REF_TOKEN_ID } = getConfig();

  const {
    allTokens,
    tokenIn,
    tokenOut,
    setTokenIn,
    setTokenOut,
    swapMode,
    tokenInAmount,
    setTokenInAmount,
    tokenInAmountInput,
    setTokenInAmountInput,
    swapTab,
    globalWhiteListTokens,
  } = props;

  const [doubleCheckOpen, setDoubleCheckOpen] = useState<boolean>(false);

  const [supportLedger, setSupportLedger] = useState(
    localStorage.getItem(SUPPORT_LEDGER_KEY) ? true : false
  );

  const [useNearBalance] = useState<boolean>(true);

  const { accountId } = useWalletSelector();

  const isSignedIn = !!accountId;

  const [tokenInBalanceFromNear, setTokenInBalanceFromNear] =
    useState<string>();
  const [tokenOutBalanceFromNear, setTokenOutBalanceFromNear] =
    useState<string>();

  const [reEstimateTrigger, setReEstimateTrigger] = useState(false);

  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [loadingTrigger, setLoadingTrigger] = useState<boolean>(true);
  const [loadingPause, setLoadingPause] = useState<boolean>(false);
  const [showSwapLoading, setShowSwapLoading] = useState<boolean>(false);

  const [showSkywardTip, setShowSkywardTip] = useState<boolean>(false);
  const [wrapOperation, setWrapOperation] = useState<boolean>(false);
  const [wrapLoading, setWrapLoading] = useState<boolean>(false);

  const [balanceInDone, setBalanceInDone] = useState<boolean>(false);
  const [balanceOutDone, setBalanceOutDone] = useState<boolean>(false);

  const intl = useIntl();
  const location = useLocation();
  const history = useHistory();

  const { selectMarket, trades, enableTri, swapType } =
    useContext(SwapProContext);

  const selectTrade = trades?.[selectMarket];

  const [urlTokenIn, urlTokenOut, urlSlippageTolerance] = decodeURIComponent(
    location.hash.slice(1)
  ).split(TOKEN_URL_SEPARATOR);

  const nearBalance = useDepositableBalance('NEAR');

  const [slippageToleranceNormal, setSlippageToleranceNormal] =
    useState<number>(
      Number(localStorage.getItem(SWAP_SLIPPAGE_KEY) || urlSlippageTolerance) ||
      0.5
    );

  const [showDetails, setShowDetails] = useState<boolean>(false);

  const tokenPriceList = useTokenPriceList();

  const skywardId =
    getConfig().networkId === 'mainnet'
      ? 'token.skyward.near'
      : 'skyward.fakes.testnet';

  useEffect(() => {
    if (!tokenIn || !tokenOut) return;

    history.replace(
      `#${unWrapTokenId(tokenIn)}${TOKEN_URL_SEPARATOR}${unWrapTokenId(
        tokenOut
      )}`
    );

    localStorage.setItem(SWAP_IN_KEY, tokenIn.id);
    localStorage.setItem(SWAP_OUT_KEY, tokenOut.id);
    localStorage.setItem(SWAP_IN_KEY_SYMBOL, tokenIn.symbol);
    localStorage.setItem(SWAP_OUT_KEY_SYMBOL, tokenOut.symbol);
  }, [tokenIn?.id, tokenOut?.id, tokenIn?.symbol, tokenOut?.symbol]);

  useEffect(() => {
    if (allTokens) {
      const [in_id, out_id] = getStorageTokenId();
      let urlTokenInId = allTokens.find((t) => t.id && t.id === urlTokenIn)?.id;

      let urlTokenOutId = allTokens.find(
        (t) => t.id && t.id === urlTokenOut
      )?.id;

      if (!urlTokenInId) {
        urlTokenInId = globalWhiteListTokens.find(
          (t) => t.symbol && t.symbol === urlTokenIn
        )?.id;
      }

      if (!urlTokenOutId) {
        urlTokenOutId = globalWhiteListTokens.find(
          (t) => t.symbol && t.symbol === urlTokenOut
        )?.id;
      }
      let rememberedIn = wrapTokenId(urlTokenInId) || in_id;
      let rememberedOut = wrapTokenId(urlTokenOutId) || out_id;

      if (rememberedIn == NEARXIDS[0]) {
        rememberedIn = REF_TOKEN_ID;
      }
      if (rememberedOut == NEARXIDS[0]) {
        rememberedOut = REF_TOKEN_ID;
      }
      let candTokenIn;
      if (urlTokenIn == 'near' || urlTokenIn == 'NEAR') {
        candTokenIn = unwrapedNear;
      } else if (urlTokenIn == WRAP_NEAR_CONTRACT_ID || urlTokenIn == 'wNEAR') {
        candTokenIn = wnearMetadata;
      } else if (rememberedIn == 'near') {
        candTokenIn = unwrapedNear;
      } else if (rememberedIn == WRAP_NEAR_CONTRACT_ID) {
        candTokenIn = wnearMetadata;
      } else {
        candTokenIn =
          allTokens.find((token) => {
            return token.id === rememberedIn;
          }) || unwrapedNear;
      }
      let candTokenOut;
      if (urlTokenOut == 'near' || urlTokenOut == 'NEAR') {
        candTokenOut = unwrapedNear;
      } else if (
        urlTokenOut == WRAP_NEAR_CONTRACT_ID ||
        urlTokenOut == 'wNEAR'
      ) {
        candTokenOut = wnearMetadata;
      } else if (rememberedOut == 'near') {
        candTokenOut = unwrapedNear;
      } else if (rememberedOut == WRAP_NEAR_CONTRACT_ID) {
        candTokenOut = wnearMetadata;
      } else {
        candTokenOut =
          allTokens.find((token) => {
            return token.id === rememberedOut;
          }) || REF_META_DATA;
      }
      if (candTokenIn.id === skywardId || candTokenOut.id === skywardId) {
        setShowSkywardTip(true);
      }

      setTokenIn(candTokenIn);
      setTokenOut(candTokenOut);

      if (tokenOut?.id === candTokenOut?.id && tokenIn?.id === candTokenIn?.id)
        setReEstimateTrigger(!reEstimateTrigger);
    }
  }, [
    allTokens?.map((t) => t.id).join('-'),
    swapMode,
    urlTokenIn,
    urlTokenOut,
  ]);

  useEffect(() => {
    if (tokenIn) {
      const tokenInId = tokenIn.id;
      if (tokenInId) {
        if (isSignedIn) {
          setBalanceInDone(false);
          ftGetBalance(
            tokenIn.id === WRAP_NEAR_CONTRACT_ID && tokenIn.symbol == 'NEAR'
              ? 'NEAR'
              : tokenIn.id
          )
            .then((available: string) =>
              setTokenInBalanceFromNear(
                toReadableNumber(tokenIn?.decimals, available)
              )
            )
            .finally(() => {
              setBalanceInDone(true);
            });
        }
      }
    }
    if (tokenOut) {
      const tokenOutId = tokenOut.id;
      if (tokenOutId) {
        if (isSignedIn) {
          setBalanceOutDone(false);
          ftGetBalance(
            tokenOut.id === WRAP_NEAR_CONTRACT_ID && tokenOut.symbol == 'NEAR'
              ? 'NEAR'
              : tokenOut.id
          )
            .then((available: string) =>
              setTokenOutBalanceFromNear(
                toReadableNumber(tokenOut?.decimals, available)
              )
            )
            .finally(() => {
              setBalanceOutDone(true);
            });
        }
      }
    }
    if (
      tokenIn &&
      tokenOut &&
      ((tokenIn.symbol == 'NEAR' && tokenOut.symbol == 'wNEAR') ||
        (tokenIn.symbol == 'wNEAR' && tokenOut.symbol == 'NEAR'))
    ) {
      setWrapOperation(true);
    } else {
      setWrapOperation(false);
    }
  }, [tokenIn, tokenOut, useNearBalance, isSignedIn, nearBalance]);

  function getStorageTokenId() {
    const in_key = localStorage.getItem(SWAP_IN_KEY);
    const in_key_symbol = localStorage.getItem(SWAP_IN_KEY_SYMBOL);
    const out_key = localStorage.getItem(SWAP_OUT_KEY);
    const out_key_symbol = localStorage.getItem(SWAP_OUT_KEY_SYMBOL);
    const result = [];
    if (in_key == WRAP_NEAR_CONTRACT_ID) {
      if (in_key_symbol == 'NEAR') {
        result.push('near');
      } else {
        result.push(WRAP_NEAR_CONTRACT_ID);
      }
    } else {
      result.push(in_key);
    }
    if (out_key == WRAP_NEAR_CONTRACT_ID) {
      if (out_key_symbol == 'NEAR') {
        result.push('near');
      } else {
        result.push(WRAP_NEAR_CONTRACT_ID);
      }
    } else {
      result.push(out_key);
    }
    return result;
  }

  const getSlippageTolerance = () => {
    return {
      slippageValue: slippageToleranceNormal,
      setSlippageValue: setSlippageToleranceNormal,
      slippageKey: SWAP_SLIPPAGE_KEY,
    };
  };

  const [quoting, setQuoting] = useState<boolean>(true);

  const onChangeSlippage = (slippage: number) => {
    const { setSlippageValue, slippageKey } = getSlippageTolerance();
    setSlippageValue(slippage);
    localStorage.setItem(slippageKey, slippage.toString());
  };

  const slippageTolerance = getSlippageTolerance().slippageValue;

  useSwapPopUp();

  useCrossSwapPopUp();

  useRefSwapPro({
    tokenIn,
    tokenInAmount,
    tokenOut,
    slippageTolerance,
    setLoadingData,
    loadingTrigger,
    setLoadingTrigger,
    setShowSwapLoading,
    loadingPause,
    reEstimateTrigger,
    supportLedger,
    loadingData,
    wrapOperation,
    setQuoting,
    setReEstimateTrigger,
    quoting,
  });

  useEffect(() => {
    if (swapMode == 'normal') {
      setLoadingTrigger(true);
    }
  }, [swapMode]);

  useEffect(() => {
    const delayInput = setTimeout(() => {
      setTokenInAmount(tokenInAmountInput);
    }, 300);
    return () => clearTimeout(delayInput);
  }, [tokenInAmountInput]);

  const throwNoPoolError = () => {
    return new Error(
      `${intl.formatMessage({
        id: 'no_pool_available_to_make_a_swap_from',
      })} ${tokenIn?.symbol} -> ${tokenOut?.symbol} ${intl.formatMessage({
        id: 'for_the_amount',
      })} ${tokenInAmount} ${intl.formatMessage({
        id: 'no_pool_eng_for_chinese',
      })}`
    );
  };

  function wrapButtonCheck() {
    if (!wrapOperation) return false;
    if (
      !(
        +tokenInAmount > 0 &&
        new BigNumber(tokenInAmount).isLessThanOrEqualTo(tokenInMax)
      )
    )
      return false;
    if (tokenIn?.symbol == 'NEAR') {
      if (
        !new BigNumber(tokenInAmount).plus(0.5).isLessThanOrEqualTo(tokenInMax)
      )
        return false;
    }
    return true;
  }

  const tokenInMax = tokenInBalanceFromNear || '0';

  const tokenOutTotal = tokenOutBalanceFromNear || '0';

  function satisfyCondition1() {
    return (
      selectTrade &&
      selectTrade.quoteDone &&
      selectTrade.canSwap &&
      !loadingTrigger &&
      !quoting
    );
  }

  function satisfyCondition2() {
    return (
      new Big(tokenInAmount || '0').gt('0') &&
      new Big(tokenInMax || '0').gt('0') &&
      new Big(tokenInAmount || '0').lte(tokenInMax || '0')
    );
  }

  function satisfyCondition3() {
    return (
      selectTrade &&
      !selectTrade.swapError &&
      tokenIn &&
      tokenOut &&
      tokenIn.id !== tokenOut.id
    );
  }

  function satisfyShowDetailViewCondition() {
    const hideCondition2 =
      !selectTrade || selectTrade?.swapError || !selectTrade.availableRoute;
    const hideCondition3 = wrapOperation;
    const hideCondition4 = new Big(tokenInAmount || '0').lte('0');
    const hideCondition5 = tokenIn?.id == tokenOut?.id;
    const hideConditionFinal =
      hideCondition2 || hideCondition3 || hideCondition4 || hideCondition5;

    return !hideConditionFinal;
  }

  const canSubmit =
    selectMarket === 'orderly' ||
    (satisfyCondition1() && satisfyCondition2() && satisfyCondition3());

  const canWrap = wrapButtonCheck();

  const canShowDetailView = satisfyShowDetailViewCondition();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const ifDoubleCheck =
      new BigNumber(tokenInAmount || 0).isLessThanOrEqualTo(
        new BigNumber(tokenInMax || 0)
      ) && Number(selectTrade?.priceImpact || 0) > 2;

    if (ifDoubleCheck) setDoubleCheckOpen(true);
    else selectTrade && selectTrade.makeSwap();
  };
  const handleSubmit_wrap = (e: any) => {
    e.preventDefault();

    sessionStorage.setItem(NEAR_WITHDRAW_KEY, '1');

    if (tokenIn?.symbol === 'NEAR') {
      setWrapLoading(true);
      return nearDeposit(tokenInAmount);
    } else {
      setWrapLoading(true);
      return nearWithdraw(tokenInAmount);
    }
  };

  function judgeBalance() {
    const condition1 = tokenIn && balanceInDone && balanceOutDone;
    return (
      condition1 &&
      (Number(getMax(tokenIn.id, tokenInMax || '0', tokenIn)) -
        Number(tokenInAmount || '0') <
        0 ||
        ONLY_ZEROS.test(tokenInMax))
    );
  }

  const handleInputAmountChange = (v: string) => {
    if (Number(v) > 0) {
      setShowSwapLoading(true);
    }
    setTokenInAmountInput(v);
  };

  const isInsufficientBalance = judgeBalance();

  return (
    <>
      <SwapFormWrap
        supportLedger={supportLedger}
        setSupportLedger={setSupportLedger}
        useNearBalance={useNearBalance.toString()}
        canSubmit={canSubmit}
        swapTab={swapTab}
        slippageTolerance={slippageTolerance}
        onChange={onChangeSlippage}
        showElseView={wrapOperation}
        setReEstimateTrigger={setReEstimateTrigger}
        elseView={
          <div className="frsc">
            {isSignedIn ? (
              !isInsufficientBalance ? (
                <SubmitButton
                  onClick={handleSubmit_wrap}
                  disabled={!canWrap || wrapLoading}
                  loading={wrapLoading}
                />
              ) : (
                <InsufficientButton divClassName="h-12 mt-2 w-full"></InsufficientButton>
              )
            ) : (
              <div className="mt-4 w-full">
                <ConnectToNearBtnSwap />
              </div>
            )}
          </div>
        }
        swapMode={swapMode}
        onSubmit={handleSubmit}
        info={intl.formatMessage({ id: 'swapCopy' })}
        title={swapMode === SWAP_MODE.LIMIT ? 'create_order' : 'swap'}
        loading={{
          loadingData,
          setLoadingData,
          loadingTrigger,
          setLoadingTrigger,
          loadingPause,
          setLoadingPause,
          showSwapLoading,
          setShowSwapLoading,
        }}
        isInsufficient={isInsufficientBalance && selectMarket !== 'orderly'}
      >

        TokenAmountV3
        <TokenAmountV3
          forSwap
          forCross={enableTri}
          swapMode={swapMode}
          amount={tokenInAmountInput}
          total={tokenInMax}
          max={tokenInMax}
          tokens={allTokens}
          tokenIn={tokenIn}
          tokenOut={tokenOut}
          selectedToken={tokenIn}
          onSelectToken={(token) => {
            localStorage.setItem(SWAP_IN_KEY, token.id);
            setTokenIn(token);

            if (token.id === skywardId) {
              setShowSkywardTip(true);
            }
          }}
          useNearBalance={useNearBalance}
          onChangeAmount={(v) => {
            handleInputAmountChange(v);
          }}
          tokenPriceList={tokenPriceList}
          isError={tokenIn?.id === tokenOut?.id}
          postSelected={tokenOut}
          onSelectPost={(token) => {
            setTokenOut(token);
          }}
          allowWNEAR={true}
          nearErrorTip={
            balanceInDone &&
            balanceOutDone &&
            tokenIn &&
            Number(getMax(tokenIn.id, tokenInMax || '0', tokenIn)) -
            Number(tokenInAmount || '0') <
            0 &&
            !ONLY_ZEROS.test(tokenInMax || '0') &&
            !ONLY_ZEROS.test(tokenInAmountInput || '0') &&
            tokenIn.id === WRAP_NEAR_CONTRACT_ID &&
            tokenIn.symbol === 'NEAR' && (
              <Alert
                level="warn"
                message={`${intl.formatMessage({
                  id: 'near_validation_error',
                })} `}
                extraClass="px-0 pb-3"
              />
            )
          }
        />
        <SwapExchange
          onChange={() => {
            setTokenIn(tokenOut);
            localStorage.setItem(SWAP_IN_KEY, tokenOut.id);
            setTokenOut(tokenIn);
            localStorage.setItem(SWAP_OUT_KEY, tokenIn.id);
            setTokenInAmountInput(toPrecision('1', 6));
            localStorage.setItem(SWAP_IN_KEY, tokenOut.id);
            localStorage.setItem(SWAP_OUT_KEY, tokenIn.id);
          }}
        />

        waaaaaaaaaa
        <TokenAmountV3
          forSwap
          isOut
          swapMode={swapMode}
          amount={
            wrapOperation
              ? tokenInAmount
              : tokenIn?.id === tokenOut?.id
                ? ''
                : selectTrade?.tokenOutAmount || ''
          }
          forCross={enableTri}
          total={tokenOutTotal}
          tokens={allTokens}
          selectedToken={tokenOut}
          preSelected={tokenIn}
          onSelectPre={(token: TokenMetadata) => setTokenIn(token)}
          tokenIn={tokenIn}
          tokenOut={tokenOut}
          useNearBalance={useNearBalance}
          onSelectToken={(token) => {
            localStorage.setItem(SWAP_OUT_KEY, token.id);
            setTokenOut(token);
            if (token.id === skywardId) {
              setShowSkywardTip(true);
            }
          }}
          isError={tokenIn?.id === tokenOut?.id}
          tokenPriceList={tokenPriceList}
          allowWNEAR={true}
        />
        {canShowDetailView && (
          <div className="frcb text-white mt-4">
            <div className="flex items-center mb-1">
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  if (loadingPause) {
                    setLoadingPause(false);
                    setLoadingTrigger(true);
                    setLoadingData(true);
                  } else {
                    setLoadingPause(true);
                    setLoadingTrigger(false);
                  }
                }}
                className="mr-2 cursor-pointer"
              >
                <CountdownTimer
                  loadingTrigger={loadingTrigger}
                  loadingPause={loadingPause}
                />
              </div>
              <SwapRate
                from={tokenInAmount}
                to={selectTrade?.tokenOutAmount || ''}
                tokenIn={tokenIn}
                tokenOut={tokenOut}
                fee={selectTrade?.fee || 0}
                tokenPriceList={tokenPriceList}
              />
            </div>

            {selectMarket === 'orderly' && !isMobile() ? null : (
              <div
                className="text-13px flex items-center cursor-pointer mb-1"
                onClick={() => {
                  setShowDetails(!showDetails);
                }}
              >
                {getPriceImpactTipType(selectTrade.priceImpact)}
                <span
                  className={`  ${
                    isMobile() && showDetails
                      ? 'text-white'
                      : 'text-primaryText'
                  } mx-1.5`}
                >
                  <FormattedMessage id="details" />
                </span>
                <span>
                  {showDetails ? (
                    <FaAngleUp color="#ffffff" size={16} />
                  ) : (
                    <FaAngleDown color="#7E8A93" size={16} />
                  )}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="mt-4">
          <DetailView
            show={canShowDetailView && showDetails}
            trade={selectTrade}
            tokenIn={tokenIn}
            tokenOut={tokenOut}
          />
        </div>

        {wrapOperation ? (
          <DetailView_near_wnear
            tokenIn={tokenIn}
            tokenOut={tokenOut}
            minAmountOut={tokenInAmount}
            from={tokenInAmount}
            to={tokenInAmount}
          />
        ) : null}

        {selectTrade?.swapError &&
        !quoting &&
        !wrapOperation &&
        Number(tokenInAmount || '0') > 0 &&
        tokenIn?.id !== tokenOut?.id ? (
          <div className="pb-2 relative ">
            <Alert
              level="warn"
              message={
                selectMarket === 'ref' &&
                swapType === SWAP_TYPE.Pro &&
                !enableTri &&
                !!selectTrade.hasTriPool
                  ? throwNoPoolError().message +
                  intl.formatMessage({
                    id: 'has_tri_pool_tip',
                  })
                  : throwNoPoolError().message
              }
            />
          </div>
        ) : null}
      </SwapFormWrap>
      <DoubleCheckModal
        isOpen={doubleCheckOpen}
        onRequestClose={() => {
          setDoubleCheckOpen(false);
          setShowSwapLoading(false);
          setLoadingPause(false);
        }}
        tokenIn={tokenIn}
        tokenOut={tokenOut}
        from={tokenInAmount}
        onSwap={() => selectTrade && selectTrade.makeSwap()}
        priceImpactValue={selectTrade?.priceImpact || '0'}
      />

      <SkyWardModal
        onRequestClose={() => {
          setShowSkywardTip(false);
        }}
        isOpen={showSkywardTip}
      />
    </>
  );
}