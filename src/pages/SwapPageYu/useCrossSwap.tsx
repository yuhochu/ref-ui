import { ExchangeEstimate, SWAP_TYPE, SwapProContext } from "~pages/SwapPage";
import React, { useContext, useEffect, useState } from "react";
import { estimateSwapAurora, EstimateSwapView, swap } from "~services/swap";
import { useTokenPriceList } from "~state/token";
import { POOL_TOKEN_REFRESH_INTERVAL } from "~services/near";
import { percentLess, scientificNotationToString, toNonDivisibleNumber, toPrecision } from "~utils/numbers";
import { useIntl } from "react-intl";
import { SUPPORT_LEDGER_KEY } from "~components/swap/SwapCard";
import Big from "big.js";
import { getPriceImpact } from "~state/swap";

export const useCrossSwap = ({
                               tokenIn,
                               tokenInAmount,
                               tokenOut,
                               slippageTolerance,
                               loadingTrigger,
                               setLoadingTrigger,
                               loadingPause,
                               wrapOperation,
                               reEstimateTrigger,
                             }: SwapOptions): ExchangeEstimate => {
  const { enableTri, swapType } = useContext(SwapProContext);

  const [canSwap, setCanSwap] = useState<boolean>();
  const [tokenOutAmount, setTokenOutAmount] = useState<string>('');
  const [swapError, setSwapError] = useState<Error>();
  const [swapsToDo, setSwapsToDo] = useState<EstimateSwapView[]>();
  const tokenPriceList = useTokenPriceList(loadingTrigger);
  const [crossQuoteDone, setCrossQuoteDone] = useState<boolean>(false);

  const [priceImpact, setPriceImpact] = useState<string>('0');

  const [count, setCount] = useState<number>(0);
  const refreshTime = Number(POOL_TOKEN_REFRESH_INTERVAL) * 1000;

  const minAmountOut = tokenOutAmount
    ? percentLess(slippageTolerance, tokenOutAmount)
    : null;

  const intl = useIntl();

  const getAvgFee = (estimates: EstimateSwapView[]) => {
    let avgFee: number = 0;

    try {
      avgFee = estimates[0].pool.fee;
    } catch (error) {}

    return avgFee;
  };

  const getEstimateCrossSwap = (proGetCachePool?: boolean) => {
    if (wrapOperation || !enableTri) {
      setLoadingTrigger(false);
      setCanSwap(true);
      return;
    }
    if (!tokenIn || !tokenOut || tokenIn?.id === tokenOut?.id) return;
    setSwapError(null);
    estimateSwapAurora({
      tokenIn,
      tokenOut,
      amountIn: tokenInAmount,
      intl,
      loadingTrigger: loadingTrigger && !loadingPause,
      proGetCachePool,
      swapPro: true,
    })
      .then(({ estimates: estimatesRes }) => {
        const estimates = estimatesRes.map((e) => ({
          ...e,
          partialAmountIn: e.pool.partialAmountIn,
          totalInputAmount: e.pool.partialAmountIn,
        }));
        if (localStorage.getItem(SUPPORT_LEDGER_KEY) && estimates?.length > 1) {
          return;
        }
        if (tokenInAmount && !ONLY_ZEROS.test(tokenInAmount)) {
          setTokenOutAmount(estimates[0].estimate);
          setSwapsToDo(estimates);
          setCanSwap(true);

          const priceImpact = getPriceImpact({
            swapsToDo: estimates,
            tokenIn,
            tokenOut,
            tokenInAmount,
            tokenOutAmount: estimates?.[0]?.estimate || '0',
            tokenPriceList,
          });

          const fee = getAvgFee(estimates);

          setPriceImpact(
            scientificNotationToString(
              new Big(priceImpact || 0)
                .minus(new Big(fee || 0).div(100))
                .toString()
            )
          );
        }

        setLoadingTrigger(false);
      })
      .catch((err) => {
        setCanSwap(false);
        setTokenOutAmount('');
        setSwapError(err);
        setCrossQuoteDone(true);
        setLoadingTrigger(false);
      })
      .finally(() => {
        setCrossQuoteDone(true);

        setLoadingTrigger(false);
      });
  };

  useEffect(() => {
    if (ONLY_ZEROS.test(tokenInAmount)) {
      setCrossQuoteDone(false);
      return;
    }
    setCanSwap(false);
    setSwapError(null);

    setCrossQuoteDone(false);

    getEstimateCrossSwap(true);
  }, [[tokenIn?.id, tokenOut?.id].sort().join('-')]);

  useEffect(() => {
    if (ONLY_ZEROS.test(tokenInAmount)) {
      setCrossQuoteDone(false);
      return;
    }
    setCanSwap(false);
    setSwapError(null);

    setCrossQuoteDone(false);

    getEstimateCrossSwap(loadingTrigger);
  }, [loadingTrigger]);

  useEffect(() => {
    if (ONLY_ZEROS.test(tokenInAmount)) {
      setCrossQuoteDone(false);
      return;
    }
    setCanSwap(false);
    setSwapError(null);

    setCrossQuoteDone(false);
    getEstimateCrossSwap(false);
  }, [
    tokenInAmount,
    [tokenIn?.id, tokenOut?.id].join('-'),
    enableTri,
    reEstimateTrigger,
  ]);

  useEffect(() => {
    let id: any = null;
    if (!loadingTrigger && !loadingPause) {
      id = setInterval(() => {
        setLoadingTrigger(true);
        setCount(count + 1);
      }, refreshTime);
    } else {
      clearInterval(id);
    }
    return () => {
      clearInterval(id);
    };
  }, [count, loadingTrigger, loadingPause]);

  const makeSwap = () => {
    swap({
      slippageTolerance,
      swapsToDo,
      tokenIn,
      amountIn: tokenInAmount,
      tokenOut,
      swapMarket: 'tri',
    }).catch(setSwapError);
  };

  return {
    canSwap,
    tokenOutAmount: !!tokenOutAmount
      ? toPrecision(tokenOutAmount || '0', Math.min(tokenOut.decimals, 8))
      : '',
    minAmountOut,
    priceImpact,
    swapError,
    makeSwap,
    estimates: swapsToDo?.map((s) => ({
      ...s,
      contract: 'Trisolaris',
    })),
    quoteDone:
      !!swapError ||
      (crossQuoteDone &&
        (swapsToDo
          ? toNonDivisibleNumber(tokenIn.decimals, tokenInAmount) ===
          swapsToDo?.[0].totalInputAmount
          : true)),
    fee: swapsToDo && !wrapOperation ? getAvgFee(swapsToDo) : 0,
    availableRoute: enableTri && !swapError && swapType === SWAP_TYPE.Pro,
    tokenInAmount,
    tokenIn,
    tokenOut,
    market: 'tri',
    exchange_name: (
      <div className="text-white flex flex-col items-start">
        <span
          style={{
            position: 'relative',
            top: '3px',
          }}
        >
          Trisolaris
        </span>

        <span
          style={{
            fontSize: '13px',
            position: 'relative',
            bottom: '3px',
          }}
          className="text-primaryText"
        >
          Aurora
        </span>
      </div>
    ),
  };
};
