import { ExchangeEstimate } from "~pages/SwapPage";
import Big from "big.js";
import { toPrecision } from "~utils/numbers";
import React from "react";
import { useSwap, useSwapV3 } from "~state/swap";

export const useRefSwap = ({
                             tokenIn,
                             tokenInAmount,
                             tokenOut,
                             slippageTolerance,
                             setLoadingData,
                             loadingTrigger,
                             setLoadingTrigger,
                             setShowSwapLoading,
                             loadingPause,
                             swapMode,
                             reEstimateTrigger,
                             supportLedger,
                             loadingData,
                           }: SwapOptions): ExchangeEstimate => {
  const {
    canSwap,
    tokenOutAmount,
    minAmountOut,
    swapError,
    makeSwap: makeSwapV1,
    avgFee: fee,
    swapsToDo,
    quoteDone,
    priceImpactValue,
    tokenInAmount: tokenInAmountV1,
  } = useSwap({
    tokenIn,
    tokenInAmount,
    tokenOut,
    slippageTolerance,
    setLoadingData,
    loadingTrigger,
    setLoadingTrigger,
    setShowSwapLoading,
    loadingData,
    loadingPause,
    swapMode,
    reEstimateTrigger,
    supportLedger,
  });

  const {
    makeSwap: makeSwapV2,
    tokenOutAmount: tokenOutAmountV2,
    minAmountOut: minAmountOutV2,
    fee: feeV2,
    swapsToDoV2,
    priceImpact: priceImpactV2,
    quoteDone: quoteDoneV2,
    canSwap: canSwapV2,
    swapErrorV3: swapErrorV2,
    tokenInAmount: tokenInAmountV2,
    tag: tagV2,
  } = useSwapV3({
    tokenIn,
    tokenOut,
    tokenInAmount,
    slippageTolerance,
    swapMode,
    loadingTrigger,
    swapError,
    setLoadingTrigger,
    reEstimateTrigger,
  });

  const quoteDoneRef = quoteDoneV2 && quoteDone;

  if (!quoteDoneRef)
    return {
      quoteDone: false,
      canSwap: false,
      tokenInAmount,
      tokenIn,
      tokenOut,
      market: 'ref',
      tokenOutAmount: '0',
    };

  const bestSwap =
    new Big(tokenOutAmountV2 || '0').gte(tokenOutAmount || '0') &&
    canSwapV2 &&
    !swapErrorV2
      ? 'v2'
      : 'v1';

  if (bestSwap === 'v1') {
    return {
      quoteDone: true,
      canSwap: canSwap,
      makeSwap: makeSwapV1,
      estimates: swapsToDo?.map((s) => ({ ...s, contract: 'Ref_Classic' })),
      tokenOutAmount:
        !tokenOutAmount || swapError
          ? ''
          : toPrecision(
            tokenOutAmount || '0',
            Math.min(8, tokenOut?.decimals ?? 8)
          ),
      minAmountOut: minAmountOut,
      fee: fee,
      priceImpact: priceImpactValue,
      swapError,
      availableRoute: !swapError,
      tokenInAmount: tokenInAmountV1,
      tokenIn,
      tokenOut,
      market: 'ref',
      exchange_name: <div className="text-white">Ref</div>,
    };
  }
  if (bestSwap === 'v2') {
    return {
      quoteDone: true,
      canSwap: canSwapV2,
      makeSwap: makeSwapV2,
      estimates: swapsToDoV2?.map((s) => ({
        ...s,
        contract: 'Ref_DCL',
      })),

      tokenOutAmount:
        !tokenOutAmountV2 || swapErrorV2
          ? ''
          : toPrecision(
            tokenOutAmountV2 || '0',
            Math.min(8, tokenOut?.decimals ?? 8)
          ),
      tokenInAmount: tokenInAmountV2,
      minAmountOut: minAmountOutV2,
      fee: feeV2,
      priceImpact: priceImpactV2,
      swapError: swapErrorV2,
      availableRoute: !swapErrorV2,
      tokenIn,
      tokenOut,
      market: 'ref',
      exchange_name: <div className="text-white">Ref</div>,
    };
  }
};
