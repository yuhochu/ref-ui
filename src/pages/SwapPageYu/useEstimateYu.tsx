import { estimateSwap, EstimateSwapView } from "~services/swap";
import { SUPPORT_LEDGER_KEY } from "~components/swap/SwapCard";
import Big from "big.js";
import {
  ONLY_ZEROS,
  percentLess,
  scientificNotationToString,
  separateRoutes,
  toNonDivisibleNumber,
  toPrecision
} from "~utils/numbers";
import { getPriceImpact, REF_FI_BEST_MARKET_ROUTE } from "~state/swap";
import db from "~store/RefDatabase";
import React from "react";

export const getEstimate=async({ tokenIn, tokenOut, tokenInAmount = "1", tokenPriceList, slippageTolerance })=>{
  const refEstimate = getEstimateRef({ tokenIn, tokenOut, tokenInAmount, tokenPriceList, slippageTolerance })
  const trades = {
    ref: refEstimate,
    // ['tri']: resAurora,
    // ['orderly']: resOrderly,
  };

  const bestMarket = Object.keys(trades).reduce((a, b) => {
    return new Big(
      trades[a].availableRoute ? trades[a].tokenOutAmount || '0' : '0'
    ).gt(trades[b].availableRoute ? trades[b].tokenOutAmount || '0' : '0')
      ? a
      : b;
  });

  sessionStorage.setItem(
    REF_FI_BEST_MARKET_ROUTE,
    trades[bestMarket].availableRoute === true ? bestMarket : 'ref'
  );
console.log("bestMarketbestMarket",bestMarket)
  const selectedMarket = trades[bestMarket].availableRoute === true ? bestMarket :'ref'
console.log("selectedMarketselectedMarket",selectedMarket)
  return trades.ref
}


export const getEstimateRef = async ({ tokenIn, tokenOut, tokenInAmount = "1", tokenPriceList, slippageTolerance }) => {
  // setCanSwap(false);
  // setQuoteDone(false);

  // if (tokenIn && tokenOut && tokenIn.id !== tokenOut.id) {
  // if (!tokenInAmount || ONLY_ZEROS.test(tokenInAmount)) {
  //   setTokenOutAmount('0');
  //   setSwapsToDo(null);
  //
  //   return;
  // }
  // setEstimating(true);
  try {
    const { estimates: estimatesRes, tag } = await estimateSwap({
      tokenIn,
      tokenOut,
      amountIn: String(tokenInAmount),
      // intl,
      // supportLedger,
      loadingTrigger: false
    });
    console.log("estimatesResestimatesRes", estimatesRes);
    // 总计routing所需花费
    const estimates = estimatesRes.map((e) => ({
      ...e,
      partialAmountIn: e.pool.partialAmountIn
    }));
    if (!estimates) {
      throw "cant estimate";
    }
    if (localStorage.getItem(SUPPORT_LEDGER_KEY) && estimates?.length > 1) {
      return;
    }
    const expectedOut = estimates.reduce(
      (acc, cur) =>
        acc.plus(
          cur.outputToken === tokenOut.id ? cur.estimate || 0 : 0
        ),
      new Big(0)
    );

    const tokenPriceListForCal = !!tokenPriceList?.["NEAR"]
      ? tokenPriceList
      : (await getTokenPriceListFromCache()).reduce(
        (acc, cur) => ({
          ...acc,
          [cur.id]: cur
        }),
        {}
      );

    const tokenOutAmount = scientificNotationToString(expectedOut.toString());
    const priceImpact = getPriceImpact({
      swapsToDo: estimates,
      tokenIn,
      tokenOut,
      tokenOutAmount: tokenOutAmount,
      tokenInAmount: String(tokenInAmount),
      tokenPriceList: tokenPriceListForCal
    });

    const setAverageFee = (estimates: EstimateSwapView[]) => {
      let avgFee: number = 0;

      try {
        const routes = separateRoutes(estimates, tokenOut.id);

        routes.forEach((route) => {
          const allocation = new Big(route[0].partialAmountIn).div(
            new Big(toNonDivisibleNumber(tokenIn.decimals, tokenInAmount))
          );

          const routeFee = route.reduce(
            (acc, cur) => {
              return acc.plus(new Big(cur.pool.fee));
            },

            new Big(0)
          );

          avgFee += allocation.mul(routeFee).toNumber();
        });
      } catch (error) {
      }

      return avgFee;
    };


    // if (tokenInAmount && !ONLY_ZEROS.test(tokenInAmount)) {
    //   setAverageFee(estimates);
    //   setSwapError(null);
    //
    //   const expectedOut = estimates.reduce(
    //     (acc, cur) =>
    //       acc.plus(
    //         cur.outputToken === tokenOut.id ? cur.estimate || 0 : 0
    //       ),
    //     new Big(0)
    //   );
    //
    //   const tokenPriceListForCal = !!tokenPriceList?.["NEAR"]
    //     ? tokenPriceList
    //     : (await getTokenPriceListFromCache()).reduce(
    //       (acc, cur) => ({
    //         ...acc,
    //         [cur.id]: cur
    //       }),
    //       {}
    //     );
    //
    //   const priceImpactValue = getPriceImpact({
    //     swapsToDo: estimates,
    //     tokenIn,
    //     tokenOut,
    //     tokenOutAmount: scientificNotationToString(
    //       expectedOut.toString()
    //     ),
    //     tokenInAmount,
    //     tokenPriceList: tokenPriceListForCal
    //   });
    //
    //   setPriceImpactValue(priceImpactValue);
    //
    //   setTokenOutAmount(
    //     scientificNotationToString(expectedOut.toString())
    //   );
    //   setSwapsToDo(estimates);
    //   setCanSwap(true);
    //   setQuoteDone(true);
    // }
    //
    // setPool(estimates[0].pool);
    let minAmountOut = tokenOutAmount
      ? toPrecision(
        percentLess(
          slippageTolerance,
          toPrecision(tokenOutAmount, Math.min(tokenOut?.decimals ?? 8, 8))
        ),
        tokenOut?.decimals ?? 24
      )
      : null;


    const refClassicEstimates = estimates?.map((s) => ({ ...s, contract: "Ref_Classic" }))
    const trades={

    }

    return {
      availableRoute:true,
      tokenIn,
      tokenOut,
      estimates,
      pools: estimates?.map((estimate) => estimate.pool),
      trades: estimates?.map((s) => ({ ...s, contract: "Ref_Classic" })),
      priceImpact,
      tokenOutAmount,
      minAmountOut,
      fee: setAverageFee(estimates),
      market: 'ref',
      exchange_name: <div className="text-white">Ref</div>,
    };
  } catch (e) {
    console.log("errr", e);
    // setCanSwap(false);
    // setTokenOutAmount("");
    // setSwapError(err);
    // setQuoteDone(true);

  } finally {
    // setForceEstimate && setForceEstimate(false);
    // setLoadingTrigger && setLoadingTrigger(false);
    // setEstimating && setEstimating(false);
    // setShowSwapLoading && setShowSwapLoading(false);
  }
};


const bk = () => {
  return {
    quoteDone: true,
    canSwap: canSwap,
    makeSwap: makeSwapV1,
    estimates: swapsToDo?.map((s) => ({ ...s, contract: "Ref_Classic" })),
    tokenOutAmount:
      !tokenOutAmount || swapError
        ? ""
        : toPrecision(
          tokenOutAmount || "0",
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
    market: "ref",
    exchange_name: <div className="text-white">Ref</div>
  };
};
export const useEstimateYu = () => {

};

const getTokenPriceListFromCache = async () => {
  return await db.queryTokenPrices();
};