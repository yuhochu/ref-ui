import React, { createContext, useEffect, useMemo, useState } from "react";
import { TokenMetadata } from "~services/ft-contract";
import { SWAP_ENABLE_TRI, SWAP_MODE, SWAP_TYPE, SwapMarket, TradeEstimates } from "~pages/SwapPage";
import { sort_tokens_by_base } from "~services/commonV3";
import { Images, Symbols } from "~components/stableswap/CommonComp";
import {
  useGlobalWhitelistTokens,
  useTokenPriceList,
  useTokensData,
  useTriTokens,
  useWhitelistTokens
} from "~state/token";
import { PoolInfo } from "~services/swapV3";
import { useAllPoolsV2 } from "~state/swapV3";
import Token from "~components/tokens/Token";
import { toReadableNumber } from "~utils/numbers";
import { NEARXIDS, TOKEN_BLACK_LIST } from "~services/near";
import { useTriTokenIdsOnRef } from "~services/aurora/aurora";
import { SingleToken } from "~components/forms/SelectToken";
import { WRAP_NEAR_CONTRACT_ID } from "~services/wrap-near";
import { SWAP_IN_KEY, SWAP_OUT_KEY } from "~pages/SwapPageYu/constSwap";
import { getEstimate, useEstimateYu } from "~pages/SwapPageYu/useEstimateYu";
import InputAmount from "~components/forms/InputAmount";
import { TradeRouteModal } from "~components/layout/SwapRoutes";
import { useSlippageTolerance } from "~pages/SwapPageYu/useSlippageTolerance";

interface SwapProContextValue {
  trades: TradeEstimates;
  enableTri: boolean;
  selectMarket: SwapMarket;
  setSelectMarket: (e?: SwapMarket) => void;
  setTrades: (e?: TradeEstimates) => void;
  setEnableTri: (e?: boolean) => void;
  swapType: SWAP_TYPE;
  changeSwapType: (e?: SWAP_TYPE) => void;
  swapMode: SWAP_MODE;
  forceEstimatePro?: boolean;
  setForceEstimatePro?: (e?: boolean) => void;
}


const SwapProContext = createContext<SwapProContextValue>(null);
const SwapPageYu = () => {
  const [estimate, setEstimate] = useState();
  const [modal, setModal] = useState();

  const [tokenInAmount, setTokenInAmount] = useState<string>("1");
  const [tokenInAmountInput, setTokenInAmountInput] = useState<string>("1");

  const [tokenIn, setTokenIn] = useState<TokenMetadata>();
  const [tokenOut, setTokenOut] = useState<TokenMetadata>();

  // const [trades, setTrades] = useState<TradeEstimates>();

  const [enableTri, setEnableTri] = useState<boolean>(
    sessionStorage.getItem(SWAP_ENABLE_TRI) === "true" || false
  );

  const [selectMarket, setSelectMarket] = useState<SwapMarket>(undefined);
  const changeEnableTri = (e: boolean) => {
    setEnableTri(e);
    sessionStorage.setItem(SWAP_ENABLE_TRI, e.toString());
  };

  const { estimates, priceImpact, tokenOutAmount, minAmountOut, fee, trades } = estimate || {};
  console.log("estimateestimate", estimate);
  const handleModalOpen = (name, data) => {
    setModal({ name, data });
  };

  // @ts-ignore
  return (
    <div style={{ color: "#fff" }}>
      <div>
        <TokenDataLoader setEstimate={setEstimate} />
        <button onClick={() => handleModalOpen("tradeRoute", estimate)}>See trades</button>
      </div>

      {
        modal?.data &&
        <TradeRouteModal
          trade={modal?.data}
          isOpen={modal?.name === "tradeRoute"}
          onRequestClose={() => {
            setModal({ name: "", data: null });
          }}
        />
      }

    </div>
  );
};

const TokenDataLoader = ({ setEstimate }) => {
  const triTokenIds = useTriTokenIdsOnRef();
  const triTokens = useTriTokens();
  const refTokens = useWhitelistTokens((triTokenIds || []).concat(["aurora"]));
  const tokenPriceList = useTokenPriceList();
  const allTokens = refTokens && triTokens && getAllTokens(refTokens, triTokens);
  const [listData, setListData] = useState<TokenMetadata[]>([]);
  // todo: refactor to filter on  no need loop again here
  const crossSwapTokens = allTokens?.filter(
    (token) => token.onTri || token.onRef
  );

  const {
    tokensData,
    loading: loadingTokensData,
    trigger
  } = useTokensData(
    crossSwapTokens?.filter((t) => TOKEN_BLACK_LIST.indexOf(t.id) === -1) // can merge togher
    // balances,
    // visible
  );
  if (!refTokens || !triTokens) {
    return <div>loading</div>;
  }
  const tokenList = listData?.length ? listData : crossSwapTokens;
  return <TokenDataSelect tokenList={tokenList} tokenPriceList={tokenPriceList} setEstimate={setEstimate} />;
};

const TokenDataSelect = ({ tokenList, tokenPriceList, estimate, setEstimate }) => {
  const [tokenIn, setTokenIn] = useState<TokenMetadata>();
  const [tokenOut, setTokenOut] = useState<TokenMetadata>();
  const [tokenInAmount, setTokenInAmount] = useState("");
  const [tokenOutAmount, setTokenOutAmount] = useState("");
  const [estimating, setEstimating] = useState(false);
  const { slippageValue } = useSlippageTolerance();


  useEffect(() => {
    if (tokenIn && tokenOut && tokenIn?.id !== tokenOut?.id) {
      getEstimateTokenOutAmount().then();
    }
  }, [tokenIn, tokenOut, tokenInAmount]);

  const getEstimateTokenOutAmount = async () => {
    try {
      setEstimating(true);
      const estimateRes = await getEstimate({
        tokenIn,
        tokenOut,
        tokenInAmount,
        tokenPriceList,
        slippageTolerance: slippageValue
      });
      const { estimates, priceImpact, tokenOutAmount, minAmountOut, fee, trades } = estimateRes || {};
      setTokenOutAmount(tokenOutAmount);
      setEstimate(estimateRes);
    } catch (e) {
      console.error(e);
    } finally {
      setEstimating(false);
    }
  };

  // useEffect(() => {
  //   if (!loadingTokensData) {
  //     const tokenList = tokensData?.length ? tokensData : crossSwapTokens;
  //     // const sortedData = [...tokensData].sort(sortTypes[currentSort].fn);
  //     // sortedData.sort(sortBySymbol);
  //     setListData(tokensData);
  //     setTokenOut(tokenList[0])
  //   }
  // }, [loadingTokensData, tokensData]);

  return (
    <div>
      <div>
        <div>{tokenIn?.symbol} ({tokenIn?.price})</div>
        <div>Token In Amount</div>
        <TokenInAmountInput value={"1"} onChange={setTokenInAmount} />
      </div>
      <br />
      <div>
        <div>{tokenOut?.symbol} ({tokenOut?.price})</div>
        <div>Token Out Amount</div>
        <TokenOutAmountInput value={tokenOutAmount} />
      </div>
      <button disabled={estimating}>Submit</button>


      <hr />
      <TokenData setTokenIn={setTokenIn} setTokenOut={setTokenOut} tokenList={tokenList}
                 tokenPriceList={tokenPriceList} />
    </div>
  );
};

const TokenOutAmountInput = ({ value }) => {
  return (
    <InputAmount value={value} />
  );
};

const TokenInAmountInput = ({ value, onChange }) => {
  const [tokenInAmount, setTokenInAmount] = useState(value || "");

  useEffect(() => {
    const delayInput = setTimeout(() => {
      onChange(tokenInAmount);
    }, 300);
    return () => clearTimeout(delayInput);
  }, [tokenInAmount]);

  const handleInput = (v) => {
    setTokenInAmount(v);
  };

  return (
    <InputAmount value={tokenInAmount} onChangeAmount={handleInput} />
  );
};


const TokenData = ({ setTokenIn, setTokenOut, tokenList, tokenPriceList }) => {

  const handleTokenInSelect = (token) => {
    localStorage.setItem(SWAP_IN_KEY, token.id);
    setTokenIn(token);
    // if (token.id === skywardId) {
    //   setShowSkywardTip(true);
    // }
  };

  const handleTokenOutSelect = (token) => {
    localStorage.setItem(SWAP_OUT_KEY, token.id);
    setTokenOut(token);
  };
  return (
    <div>
      <div>Token in</div>
      <MemoTokenList tokenList={tokenList} tokenPriceList={tokenPriceList}
                     onClick={handleTokenInSelect} />

      <div>Token Out</div>
      <MemoTokenList tokenList={tokenList} tokenPriceList={tokenPriceList}
                     onClick={handleTokenOutSelect} />
    </div>

  );
};


const SelectToken2 = ({ tokenList, tokenPriceList, onClick }) => {
  // console.log("render tokenList", tokenList);
  return (
    <div className={"flex"}>
      {tokenList?.filter((token) => !!token).map((token, index) => {
        const tokenPrice = tokenPriceList?.[token.id]?.price;
        token.price = tokenPrice;
        return (
          <div onClick={() => onClick(token)} key={token?.id}>
            <SingleToken token={token} price={tokenPrice} />
          </div>
          // <Token
          //   index={index}
          //   key={token.id + token.symbol}
          //   onClick={onClick}
          //   token={token}
          //   price={tokenPriceList?.[token.id]?.price}
          //   // sortBy={sortBy}
          //   // forCross={forCross}
          //   // totalAmount={
          //   //   balances
          //   //     ? toReadableNumber(token.decimals, balances[token.id])
          //   //     : ''
          //   // }
          // />
        );
      })}
    </div>
  );
};


const MemoTokenList = React.memo(SelectToken2, (prev, next) => {
  if (!prev?.tokenList || !prev?.tokenPriceList) {
    console.log("prev?.tokenList", prev?.tokenList);
    console.log("prev?.tokenList", prev?.tokenList);
    return false;
  }
  const isCached = (
    JSON.stringify(prev?.tokenList) === JSON.stringify(next?.tokenList) &&
    JSON.stringify(prev?.tokenPriceList) === JSON.stringify(next?.tokenPriceList)
  );
  return isCached;
});

const SelectToken = () => {
  const allPools = useAllPoolsV2();

  const globalWhiteList = useGlobalWhitelistTokens();
  const displayPools = allPools?.reduce((acc, cur, i) => {
    const id = [cur.token_x, cur.token_y].sort().join("|");
    if (!acc[id]) {
      acc[id] = cur;
    }
    return acc;
  }, {} as Record<string, PoolInfo>);

  const renderPools = useMemo(
    () =>
      Object.values(displayPools || {})?.filter((p) => {
        const { token_x_metadata, token_y_metadata } = p;
        return (
          !!globalWhiteList.find((t) => t.id === token_x_metadata.id) &&
          !!globalWhiteList.find((t) => t.id === token_y_metadata.id)
        );
      }),
    [globalWhiteList]
  );

  const handleSelect = () => {

  };

  const renderList = renderPools?.map((p) => {
    const { token_x_metadata, token_y_metadata } = p;
    const tokens = sort_tokens_by_base([token_x_metadata, token_y_metadata]);
    return (
      <div
        key={p.pool_id}
        className="flex items-center text-sm xs:text-base min-w-max px-1.5 bg-opacity-90 py-3 rounded-lg hover:bg-dclSelectTokenHover cursor-pointer"
        onClick={() => {
          handleSelect(p);
          // setHoverSelectToken(false);
        }}
      >
        <Images tokens={tokens} size="5" className="mr-2 ml-1" />

        <Symbols tokens={tokens} separator="-" />
      </div>
    );
  });

  return (
    <div>
      {renderList}
    </div>
  );
};

function getAllTokens(refTokens: TokenMetadata[], triTokens: TokenMetadata[]) {
  triTokens?.forEach((tk) => {
    const tokenInRef = refTokens?.find((token) => token.id === tk.id);
    if (tokenInRef) {
      tokenInRef.onTri = true;
    } else {
      refTokens.push(tk);
    }
  });

  return refTokens;
}


export default SwapPageYu;