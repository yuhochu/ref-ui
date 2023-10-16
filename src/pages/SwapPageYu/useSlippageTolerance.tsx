import { useState } from "react";
import { SWAP_SLIPPAGE_KEY } from "~pages/SwapPageYu/constSwap";

const TOKEN_URL_SEPARATOR = "|";

export const useSlippageTolerance = () => {
  const [urlTokenIn, urlTokenOut, urlSlippageTolerance] = decodeURIComponent(location.hash.slice(1)).split(TOKEN_URL_SEPARATOR);

  const [slippageToleranceNormal, setSlippageToleranceNormal] = useState<number>(
    Number(localStorage.getItem(SWAP_SLIPPAGE_KEY) || urlSlippageTolerance) || 0.5
  );

  return {
    slippageValue: slippageToleranceNormal,
    setSlippageValue: setSlippageToleranceNormal,
    slippageKey: SWAP_SLIPPAGE_KEY
  };
};




