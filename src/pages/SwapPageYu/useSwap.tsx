import { useContext, useEffect, useState } from "react";
import { Pool } from "~services/pool";
import { estimateSwap, EstimateSwapView, PoolMode, swap } from "~services/swap";
import { useTokenPriceList } from "~state/token";
import { SwapProContext } from "~pages/SwapPage";
import {
  percentLess,
  scientificNotationToString,
  separateRoutes,
  toNonDivisibleNumber,
  toPrecision, toReadableNumber
} from "~utils/numbers";
import { POOL_TOKEN_REFRESH_INTERVAL } from "~services/near";
import { useIntl } from "react-intl";
import Big from "big.js";
import { SUPPORT_LEDGER_KEY } from "~components/swap/SwapCard";
import { estimateValidator, getPriceImpact } from "~state/swap";

export const useSwap = ({
                          tokenIn,
                          tokenInAmount,
                          setShowSwapLoading,
                          tokenOut,
                          slippageTolerance,
                          loadingTrigger,
                          setLoadingTrigger,
                          loadingPause,
                          reEstimateTrigger,
                          supportLedger,
                        }: SwapOptions) => {
  const [pool, setPool] = useState<Pool>();
  const [canSwap, setCanSwap] = useState<boolean>();

  const [tokenOutAmount, setTokenOutAmount] = useState<string>('');
  const [swapError, setSwapError] = useState<Error>();
  const [swapsToDo, setSwapsToDo] = useState<EstimateSwapView[]>();
  const [quoteDone, setQuoteDone] = useState<boolean>(false);

  const tokenPriceList = useTokenPriceList(loadingTrigger);

  const { enableTri } = useContext(SwapProContext);

  const [forceEstimate, setForceEstimate] = useState<boolean>(false);

  const [priceImpactValue, setPriceImpactValue] = useState<string>('0');

  const [avgFee, setAvgFee] = useState<number>(0);

  const [estimating, setEstimating] = useState<boolean>(false);

  const [count, setCount] = useState<number>(0);

  let minAmountOut = tokenOutAmount
    ? toPrecision(
      percentLess(
        slippageTolerance,
        toPrecision(tokenOutAmount, Math.min(tokenOut?.decimals ?? 8, 8))
      ),
      tokenOut?.decimals ?? 24
    )
    : null;
  const refreshTime = Number(POOL_TOKEN_REFRESH_INTERVAL) * 1000;
  const intl = useIntl();

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
    } catch (error) {}

    setAvgFee(avgFee);
  };

  const getEstimate = async () => {
    setCanSwap(false);
    setQuoteDone(false);

    if (tokenIn && tokenOut && tokenIn.id !== tokenOut.id) {
      if (!tokenInAmount || ONLY_ZEROS.test(tokenInAmount)) {
        setTokenOutAmount('0');
        setSwapsToDo(null);

        return;
      }
      setEstimating(true);

      estimateSwap({
        tokenIn,
        tokenOut,
        amountIn: tokenInAmount,
        intl,
        supportLedger,
        loadingTrigger,
      })
        .then(async ({ estimates: estimatesRes }) => {
          const estimates = estimatesRes.map((e) => ({
            ...e,
            partialAmountIn: e.pool.partialAmountIn,
          }));

          if (!estimates) throw '';
          if (
            localStorage.getItem(SUPPORT_LEDGER_KEY) &&
            estimates?.length > 1
          ) {
            return;
          }

          if (tokenInAmount && !ONLY_ZEROS.test(tokenInAmount)) {
            setAverageFee(estimates);
            setSwapError(null);

            const expectedOut = estimates.reduce(
              (acc, cur) =>
                acc.plus(
                  cur.outputToken === tokenOut.id ? cur.estimate || 0 : 0
                ),
              new Big(0)
            );

            const tokenPriceListForCal = !!tokenPriceList?.['NEAR']
              ? tokenPriceList
              : (await getTokenPriceListFromCache()).reduce(
                (acc, cur) => ({
                  ...acc,
                  [cur.id]: cur,
                }),
                {}
              );

            const priceImpactValue = getPriceImpact({
              swapsToDo: estimates,
              tokenIn,
              tokenOut,
              tokenOutAmount: scientificNotationToString(
                expectedOut.toString()
              ),
              tokenInAmount,
              tokenPriceList: tokenPriceListForCal,
            });

            setPriceImpactValue(priceImpactValue);

            setTokenOutAmount(
              scientificNotationToString(expectedOut.toString())
            );
            setSwapsToDo(estimates);
            setCanSwap(true);
            setQuoteDone(true);
          }

          setPool(estimates[0].pool);
        })
        .catch((err) => {
          // if (!loadingTrigger) {
          setCanSwap(false);
          setTokenOutAmount('');
          setSwapError(err);
          setQuoteDone(true);

          // }
        })
        .finally(() => {
          setForceEstimate && setForceEstimate(false);
          setLoadingTrigger && setLoadingTrigger(false);
          setEstimating && setEstimating(false);
          setShowSwapLoading && setShowSwapLoading(false);
        });
    } else if (
      tokenIn &&
      tokenOut &&
      !tokenInAmount &&
      ONLY_ZEROS.test(tokenInAmount) &&
      tokenIn.id !== tokenOut.id
    ) {
      setTokenOutAmount('0');
    }
  };

  useEffect(() => {
    const valRes =
      !swapError &&
      swapsToDo &&
      tokenIn &&
      tokenOut &&
      estimateValidator(
        swapsToDo,
        tokenIn,
        toNonDivisibleNumber(
          tokenIn?.decimals === null || tokenIn?.decimals === undefined
            ? 24
            : tokenIn.decimals,
          tokenInAmount
        ),
        tokenOut
      );

    if (estimating && swapsToDo && !forceEstimate) return;

    if (valRes && !loadingTrigger && !forceEstimate) {
      return;
    }

    getEstimate();
  }, [
    loadingTrigger,
    loadingPause,
    tokenIn?.id,
    tokenOut?.id,
    tokenInAmount,
    reEstimateTrigger,
    enableTri,
    forceEstimate,
  ]);

  useEffect(() => {
    const valRes =
      swapsToDo &&
      tokenIn &&
      tokenOut &&
      estimateValidator(
        swapsToDo,
        tokenIn,
        toNonDivisibleNumber(
          tokenIn?.decimals === null || tokenIn?.decimals === undefined
            ? 24
            : tokenIn.decimals,
          tokenInAmount
        ),
        tokenOut
      );

    if (estimating && swapsToDo && !forceEstimate) return;

    if (((valRes && !loadingTrigger) || swapError) && !forceEstimate) return;
    getEstimate();
  }, [estimating]);

  useEffect(() => {
    setForceEstimate(true);
  }, [
    tokenIn?.id,
    tokenOut?.id,
    tokenIn?.symbol,
    tokenOut?.symbol,
    supportLedger,
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
      swapMarket: 'ref',
    }).catch(setSwapError);
  };

  return {
    canSwap,
    tokenOutAmount,
    minAmountOut,
    pool,
    setCanSwap,
    swapError,
    makeSwap,
    avgFee,
    tokenInAmount: !swapsToDo
      ? '1'
      : toReadableNumber(
        tokenIn.decimals,
        swapsToDo
          .reduce(
            (acc, cur) => acc.plus(cur?.partialAmountIn || 0),
            new Big(0)
          )
          .toFixed()
      ),
    pools: swapsToDo?.map((estimate) => estimate.pool),
    swapsToDo,
    isParallelSwap: swapsToDo?.every((e) => e.status === PoolMode.PARALLEL),
    quoteDone: quoteDone && !estimating,
    priceImpactValue: scientificNotationToString(
      new Big(priceImpactValue).minus(new Big((avgFee || 0) / 100)).toString()
    ),
  };
};