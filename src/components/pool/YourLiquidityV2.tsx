import React, {
  useState,
  useEffect,
  useContext,
  useMemo,
  createContext,
} from 'react';
import { useHistory } from 'react-router';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  list_liquidities,
  get_pool,
  get_liquidity,
  PoolInfo,
  remove_liquidity,
  claim_all_liquidity_fee,
} from '../../services/swapV3';
import { ColorsBox, TipIon } from '~components/icon/V3';
import {
  GradientButton,
  BorderButton,
  ButtonTextWrapper,
  ConnectToNearBtn,
} from '~components/button/Button';
import {
  toPrecision,
  toReadableNumber,
  formatWithCommas,
  scientificNotationToString,
} from '~utils/numbers';
import { useTokens } from '../../state/token';
import {
  getPriceByPoint,
  CONSTANT_D,
  UserLiquidityInfo,
  getXAmount_per_point_by_Lx,
  getYAmount_per_point_by_Ly,
  TOKEN_LIST_FOR_RATE,
  displayNumberToAppropriateDecimals,
  get_all_seeds,
  get_liquidity_value,
  allocation_rule_liquidities,
  get_pool_name,
  openUrl,
  sort_tokens_by_base,
} from '../../services/commonV3';
import BigNumber from 'bignumber.js';
import {
  FarmBoost,
  getBoostTokenPrices,
  Seed,
  get_seed,
} from '../../services/farm';
import { RemovePoolV3 } from '~components/pool/RemovePoolV3';
import { AddPoolV3 } from '~components/pool/AddPoolV3';
import { WalletContext } from '../../utils/wallets-integration';
import { list_farmer_seeds, list_seed_farms } from '../../services/farm';
import getConfig from '../../services/config';
import { LinkArrowIcon, NFTIdIcon } from '~components/icon/FarmBoost';
import { get_detail_the_liquidity_refer_to_seed } from '../../pages/poolsV3/YourLiquidityPageV3';
import { LinkIcon, WaterDropIcon } from '../../components/icon/Portfolio';
import { UpDownButton } from '../portfolio/Tool';
import { ftGetTokenMetadata, TokenMetadata } from '~services/ft-contract';
import { PortfolioData } from '../../pages/Portfolio';
import { isMobile } from '~utils/device';
import Big from 'big.js';
import { useWalletSelector } from '~context/WalletSelectorContext';
const is_mobile = isMobile();
const { REF_UNI_V3_SWAP_CONTRACT_ID } = getConfig();
const LiquidityContext = createContext(null);
export function YourLiquidityV2(props: any) {
  const {
    set_dcl_liquidities_list,
    set_dcl_liquidities_details_list,
    set_dcl_tokens_metas,
    set_dcl_liquidities_details_list_done,
  } = useContext(PortfolioData) || {};
  const {
    setYourLpValueV2,
    setLpValueV2Done,
    setLiquidityLoadingDone,
    setLiquidityQuantity,
    styleType,
    liquidityLoadingDone,
  } = props;
  const [all_seeds, set_all_seeds] = useState<Seed[]>([]);
  const [tokenPriceList, setTokenPriceList] = useState<Record<string, any>>({});
  const [all_pools_map, set_all_pools_map] =
    useState<Record<string, PoolInfo>>();
  const [liquidities_list, set_liquidities_list] = useState<
    UserLiquidityInfo[]
  >([]);

  const [groupYourLiquidity, setGroupYourLiquidity] = useState<any>();

  const [liquidities_details_list, set_iquidities_details_list] = useState<
    UserLiquidityInfo[]
  >([]);
  const [liquidities_tokens_metas, set_liquidities_tokens_metas] =
    useState<Record<string, TokenMetadata>>();

  const { globalState } = useContext(WalletContext);
  const isSignedIn = globalState.isSignedIn;
  useEffect(() => {
    getBoostTokenPrices().then(setTokenPriceList);
    get_all_seeds().then((seeds: Seed[]) => {
      set_all_seeds(seeds);
    });
  }, []);
  useEffect(() => {
    if (isSignedIn) {
      get_list_liquidities();
    }
  }, [isSignedIn]);
  useEffect(() => {
    if (liquidities_list.length > 0) {
      get_all_pools_detail();
      get_all_tokens_metas();
      get_all_liquidities_details();
    }
  }, [liquidities_list]);
  useEffect(() => {
    get_all_liquidity_value();
  }, [all_pools_map, liquidities_tokens_metas, tokenPriceList]);
  const dcl_liquidities_details_map = useMemo(() => {
    let temp_map = {};
    if (liquidities_details_list.length > 0) {
      temp_map = liquidities_details_list.reduce(
        (acc: any, cur: UserLiquidityInfo) => {
          return {
            ...acc,
            [cur.lpt_id]: cur,
          };
        },
        {}
      );
    }
    return temp_map;
  }, [liquidities_details_list]);
  async function get_list_liquidities() {
    const list: UserLiquidityInfo[] = await list_liquidities();
    if (list.length > 0) {
      // get user seeds
      const user_seeds_map = await list_farmer_seeds();
      const user_seed_ids = Object.keys(user_seeds_map);
      if (user_seed_ids.length > 0) {
        const seedsPromise = user_seed_ids.map((seed_id: string) => {
          return get_seed(seed_id);
        });
        const user_seeds = await Promise.all(seedsPromise);
        user_seeds.forEach((seed: Seed) => {
          const { seed_id } = seed;
          const [contractId, mft_id] = seed_id.split('@');
          if (contractId == REF_UNI_V3_SWAP_CONTRACT_ID) {
            const { free_amount, locked_amount } =
              user_seeds_map[seed_id] || {};
            const user_seed_amount = new BigNumber(free_amount)
              .plus(locked_amount)
              .toFixed();
            allocation_rule_liquidities({ list, user_seed_amount, seed });
          }
        });
      }
      // sort
      list.sort((item1: UserLiquidityInfo, item2: UserLiquidityInfo) => {
        const item1_hashId = +item1.lpt_id.split('#')[1];
        const item2_hashId = +item2.lpt_id.split('#')[1];
        return item1_hashId - item2_hashId;
      });
      set_liquidities_list(list);
      set_dcl_liquidities_list && set_dcl_liquidities_list(list);
    } else {
      setLpValueV2Done(true);
      setYourLpValueV2('0');
      set_dcl_liquidities_details_list_done &&
        set_dcl_liquidities_details_list_done(true);
    }
    setLiquidityLoadingDone && setLiquidityLoadingDone(true);

    const groupedList = list.reduce((pre, cur) => {
      const { pool_id } = cur;
      const pool = pre[pool_id] || [];
      pool.push(cur);
      pre[pool_id] = pool;
      return pre;
    }, {});

    setLiquidityQuantity &&
      setLiquidityQuantity(Object.keys(groupedList).length);
  }
  async function get_all_pools_detail() {
    const pool_ids = new Set();
    liquidities_list.forEach((liquidity: UserLiquidityInfo) => {
      pool_ids.add(liquidity.pool_id);
    });
    const promise_pools = Array.from(pool_ids).map(async (id: string) => {
      const detail = await get_pool(id);
      return detail;
    });
    const all_liquidities_related_pools = await Promise.all(promise_pools);
    const pools_detail_map = all_liquidities_related_pools.reduce(
      (acc, cur) => {
        return {
          ...acc,
          [cur.pool_id]: cur,
        };
      },
      {}
    );
    set_all_pools_map(pools_detail_map);
  }
  async function get_all_tokens_metas() {
    const token_ids = new Set();
    liquidities_list.forEach((liquidity: UserLiquidityInfo) => {
      const { pool_id } = liquidity;
      const [token_x, token_y, fee] = pool_id.split('|');
      token_ids.add(token_x).add(token_y);
    });
    const promise_all_tokens_meta = Array.from(token_ids).map(
      async (id: string) => {
        const token_mata = await ftGetTokenMetadata(id);
        return token_mata;
      }
    );
    const all_tokens_meta = await Promise.all(promise_all_tokens_meta);
    const liquidities_tokens_metas = all_tokens_meta.reduce((acc, cur) => {
      return {
        ...acc,
        [cur.id]: cur,
      };
    }, {});
    set_liquidities_tokens_metas(liquidities_tokens_metas);
    set_dcl_tokens_metas && set_dcl_tokens_metas(liquidities_tokens_metas);
  }
  async function get_all_liquidities_details() {
    const promise_list_details = liquidities_list.map(
      (item: UserLiquidityInfo) => {
        return get_liquidity(item.lpt_id);
      }
    );
    const list_details = await Promise.all(promise_list_details);
    set_iquidities_details_list(list_details);
    if (set_dcl_liquidities_details_list) {
      set_dcl_liquidities_details_list(list_details);
    }
    if (set_dcl_liquidities_details_list_done) {
      set_dcl_liquidities_details_list_done(true);
    }
  }
  function get_all_liquidity_value() {
    let total_value = new BigNumber(0);
    if (
      all_pools_map &&
      liquidities_tokens_metas &&
      Object.keys(tokenPriceList).length > 0
    ) {
      liquidities_list.forEach((liquidity: UserLiquidityInfo) => {
        const { pool_id } = liquidity;
        const [token_x, token_y] = pool_id.split('|');
        const poolDetail = all_pools_map[pool_id];
        const tokensMeta = [
          liquidities_tokens_metas[token_x],
          liquidities_tokens_metas[token_y],
        ];
        const v = get_liquidity_value({
          liquidity,
          poolDetail,
          tokenPriceList,
          tokensMeta,
        });
        total_value = total_value.plus(v);
      });
      setLpValueV2Done && setLpValueV2Done(true);
      setYourLpValueV2 && setYourLpValueV2(total_value.toFixed());
    }
  }
  console.log('liquidities_list: ', liquidities_list);
  console.log('groupYourLiquidity: ', groupYourLiquidity);

  useEffect(() => {
    if (
      !liquidities_list ||
      !all_pools_map ||
      !liquidities_tokens_metas ||
      !tokenPriceList ||
      !dcl_liquidities_details_map ||
      Object.keys(dcl_liquidities_details_map).length === 0
    ) {
      return;
    }

    Promise.all(
      liquidities_list.map((liquidity) =>
        getYourLiquidityData({
          liquidity,
          all_seeds,
          styleType,
          tokenPriceList,
          poolDetail: all_pools_map?.[liquidity.pool_id],
          liquidityDetail: dcl_liquidities_details_map?.[liquidity.lpt_id],
          liquidities_tokens_metas,
        })
      )
    ).then((yourLiquidityList) => {
      const groupedLiquidity = yourLiquidityList.reduce((acc, cur) => {
        const { pool_id } = cur;
        const [token_x, token_y] = pool_id.split('|');
        const poolDetail = all_pools_map[pool_id];
        const tokensMeta = [
          liquidities_tokens_metas[token_x],
          liquidities_tokens_metas[token_y],
        ];

        if (acc[pool_id]) {
          acc[pool_id].push(cur);

          return acc;
        } else {
          return {
            ...acc,
            [pool_id]: [
              {
                ...cur,
                poolDetail,
                tokensMeta,
              },
            ],
          };
        }
      }, {} as Record<string, any[]>);

      setGroupYourLiquidity(groupedLiquidity);
    });
  }, [
    liquidities_list,
    all_seeds,
    all_pools_map,
    liquidities_tokens_metas,
    tokenPriceList,
    dcl_liquidities_details_map,
    Object.keys(dcl_liquidities_details_map).length === 0,
  ]);

  return (
    <div>
      {liquidityLoadingDone && (
        <div className="grid grid-cols-6 px-6 text-sm text-primaryText">
          <div className="col-span-2 ">
            <FormattedMessage
              id="pool"
              defaultMessage={'Pool'}
            ></FormattedMessage>
          </div>

          <div className="col-span-2 ">
            <FormattedMessage
              id="price_range"
              defaultMessage={'Price Range'}
            ></FormattedMessage>
          </div>

          <div className="col-span-1 ">
            <FormattedMessage
              id="apr_24h"
              defaultMessage={'APR(24h)'}
            ></FormattedMessage>
          </div>
          <div className="col-span-1 ">
            <FormattedMessage
              id="your_liquidity"
              defaultMessage={'Your Liquidity'}
            ></FormattedMessage>
          </div>
        </div>
      )}

      {groupYourLiquidity &&
        Object.entries(groupYourLiquidity).map(
          ([id, liquidity]: any, index: number) => {
            return (
              <UserLiquidityLineStyleGroup1
                key={index}
                groupYourLiquidityList={liquidity}
                liquidities_list={liquidity.map((l: any) => l.liquidityDetail)}
                tokenPriceList={tokenPriceList}
              />
            );
          }
        )}
    </div>
  );
}
function UserLiquidityLine({
  liquidity,
  all_seeds,
  styleType,
  tokenPriceList,
  poolDetail,
  liquidities_tokens_metas,
  liquidityDetail,
}: {
  liquidity: UserLiquidityInfo;
  all_seeds: Seed[];
  styleType: string;
  tokenPriceList: Record<string, any>;
  poolDetail: PoolInfo;
  liquidities_tokens_metas: Record<string, TokenMetadata>;
  liquidityDetail: UserLiquidityInfo;
}) {
  const [hover, setHover] = useState<boolean>(false);
  const [isInrange, setIsInrange] = useState<boolean>(true);
  const [your_liquidity, setYour_liquidity] = useState('');
  const [claimLoading, setClaimLoading] = useState<boolean>(false);
  const [showRemoveBox, setShowRemoveBox] = useState<boolean>(false);
  const [showAddBox, setShowAddBox] = useState<boolean>(false);
  const [related_farms, set_related_farms] = useState<FarmBoost[]>([]);
  const [is_in_farming, set_is_in_farming] = useState<boolean>(false);
  const [related_seed_info, set_related_seed_info] = useState<
    Record<string, any>
  >({});

  const { lpt_id, pool_id, left_point, right_point, amount: L } = liquidity;
  const [token_x, token_y, fee] = pool_id.split('|');
  const tokenMetadata_x_y = liquidities_tokens_metas
    ? [liquidities_tokens_metas[token_x], liquidities_tokens_metas[token_y]]
    : null;
  const rate_need_to_reverse_display = useMemo(() => {
    if (tokenMetadata_x_y) {
      const [tokenX] = tokenMetadata_x_y;
      if (TOKEN_LIST_FOR_RATE.indexOf(tokenX.symbol) > -1) return true;
      return false;
    }
  }, [tokenMetadata_x_y?.length]);

  const history = useHistory();
  useEffect(() => {
    get_pool_related_farms();
  }, []);
  useEffect(() => {
    if (poolDetail) {
      judge_is_in_range();
    }
  }, [poolDetail]);
  useEffect(() => {
    if (tokenMetadata_x_y && poolDetail && tokenPriceList) {
      const { current_point } = poolDetail;
      get_your_liquidity(current_point);
    }
  }, [poolDetail, tokenMetadata_x_y, tokenPriceList]);
  useEffect(() => {}, []);
  useEffect(() => {
    const info = get_detail_the_liquidity_refer_to_seed({
      liquidity,
      all_seeds,
      is_in_farming,
      related_farms,
      tokenPriceList,
    });
    set_related_seed_info(info);
  }, [liquidity, all_seeds, is_in_farming, tokenPriceList, related_farms]);

  async function get_pool_related_farms() {
    const is_in_farming =
      liquidity.part_farm_ratio && +liquidity.part_farm_ratio > 0;

    if (is_in_farming) {
      const id = liquidity.mft_id.slice(1);
      const seed_id = REF_UNI_V3_SWAP_CONTRACT_ID + '@' + id;
      const farmList = await list_seed_farms(seed_id);
      set_related_farms(farmList);
    }

    set_is_in_farming(is_in_farming);
  }
  async function judge_is_in_range() {
    if (poolDetail) {
      const { current_point } = poolDetail;
      if (current_point >= left_point && right_point > current_point) {
        setIsInrange(true);
      } else {
        setIsInrange(false);
      }
    }
  }
  function getRate(direction: string) {
    let value = '';
    if (tokenMetadata_x_y) {
      const [tokenX, tokenY] = tokenMetadata_x_y;
      const decimalRate =
        Math.pow(10, tokenX.decimals) / Math.pow(10, tokenY.decimals);
      if (direction == 'left') {
        value = getPriceByPoint(left_point, decimalRate);
      } else if (direction == 'right') {
        value = getPriceByPoint(right_point, decimalRate);
      }
      if (rate_need_to_reverse_display && +value !== 0) {
        value = new BigNumber(1).dividedBy(value).toFixed();
      }
    }
    return displayNumberToAppropriateDecimals(value);
  }
  function getLpt_id() {
    return lpt_id.split('#')[1];
  }

  function get_your_liquidity(current_point: number) {
    const [tokenX, tokenY] = tokenMetadata_x_y;
    const priceX = tokenPriceList[tokenX.id]?.price || 0;
    const priceY = tokenPriceList[tokenY.id]?.price || 0;
    let total_price;
    //  in range
    if (current_point >= left_point && right_point > current_point) {
      let tokenYAmount = getY(left_point, current_point, L, tokenY) || 0;
      let tokenXAmount = getX(current_point + 1, right_point, L, tokenX) || 0;
      const { amountx, amounty } = get_X_Y_In_CurrentPoint(tokenX, tokenY, L);
      tokenXAmount = new BigNumber(tokenXAmount).plus(amountx).toFixed();
      tokenYAmount = new BigNumber(tokenYAmount).plus(amounty).toFixed();
      const tokenYTotalPrice = new BigNumber(tokenYAmount).multipliedBy(priceY);
      const tokenXTotalPrice = new BigNumber(tokenXAmount).multipliedBy(priceX);
      total_price = tokenYTotalPrice.plus(tokenXTotalPrice).toFixed();
    }
    // only y token
    if (current_point >= right_point) {
      const tokenYAmount = getY(left_point, right_point, L, tokenY);
      const tokenYTotalPrice = new BigNumber(tokenYAmount).multipliedBy(priceY);
      total_price = tokenYTotalPrice.toFixed();
    }
    // only x token
    if (left_point > current_point) {
      const tokenXAmount = getX(left_point, right_point, L, tokenX);
      const tokenXTotalPrice = new BigNumber(tokenXAmount).multipliedBy(priceX);
      total_price = tokenXTotalPrice.toFixed();
    }
    setYour_liquidity(formatWithCommas(toPrecision(total_price, 2)));
  }
  function getY(
    leftPoint: number,
    rightPoint: number,
    L: string,
    token: TokenMetadata
  ) {
    const y = new BigNumber(L).multipliedBy(
      (Math.pow(Math.sqrt(CONSTANT_D), rightPoint) -
        Math.pow(Math.sqrt(CONSTANT_D), leftPoint)) /
        (Math.sqrt(CONSTANT_D) - 1)
    );
    const y_result = y.toFixed();
    return toReadableNumber(token.decimals, toPrecision(y_result, 0));
  }
  function getX(
    leftPoint: number,
    rightPoint: number,
    L: string,
    token: TokenMetadata
  ) {
    const x = new BigNumber(L)
      .multipliedBy(
        (Math.pow(Math.sqrt(CONSTANT_D), rightPoint - leftPoint) - 1) /
          (Math.pow(Math.sqrt(CONSTANT_D), rightPoint) -
            Math.pow(Math.sqrt(CONSTANT_D), rightPoint - 1))
      )
      .toFixed();
    return toReadableNumber(token.decimals, toPrecision(x, 0));
  }
  function get_X_Y_In_CurrentPoint(
    tokenX: TokenMetadata,
    tokenY: TokenMetadata,
    L: string
  ) {
    const { liquidity, liquidity_x, current_point } = poolDetail;
    const liquidity_y_big = new BigNumber(liquidity).minus(liquidity_x);
    let Ly = '0';
    let Lx = '0';
    // only remove y
    if (liquidity_y_big.isGreaterThanOrEqualTo(L)) {
      Ly = L;
    } else {
      // have x and y
      Ly = liquidity_y_big.toFixed();
      Lx = new BigNumber(L).minus(Ly).toFixed();
    }
    const amountX = getXAmount_per_point_by_Lx(Lx, current_point);
    const amountY = getYAmount_per_point_by_Ly(Ly, current_point);
    const amountX_read = toReadableNumber(
      tokenX.decimals,
      toPrecision(amountX, 0)
    );
    const amountY_read = toReadableNumber(
      tokenY.decimals,
      toPrecision(amountY, 0)
    );
    return { amountx: amountX_read, amounty: amountY_read };
  }
  function claimRewards(e: any) {
    e.stopPropagation();
    if (!canClaim()) return;
    setClaimLoading(true);
    const [tokenX, tokenY] = tokenMetadata_x_y;
    remove_liquidity({
      token_x: tokenX,
      token_y: tokenY,
      lpt_id,
      amount: '0',
      mft_id: '',
      min_amount_x: '0',
      min_amount_y: '0',
    });
  }
  function goYourLiquidityDetailPage(goType?: string) {
    const pool_id = lpt_id.split('#')[0];
    const lptId = lpt_id.split('#')[1];
    const pool_name = get_pool_name(pool_id);
    const link = `${pool_name}@${lptId}`;
    if (goType == 'new window') {
      openUrl(`/yoursLiquidityDetailV2/${link}`);
    } else {
      history.push(`/yoursLiquidityDetailV2/${link}`);
    }
  }
  function goPoolDetailPage() {
    const params_str = get_pool_name(liquidity.pool_id);
    openUrl(`/poolV2/${params_str}`);
  }
  function getTokenFeeAmount(p: string) {
    if (liquidityDetail && tokenMetadata_x_y && tokenPriceList) {
      const [tokenX, tokenY] = tokenMetadata_x_y;
      const { unclaimed_fee_x, unclaimed_fee_y } = liquidityDetail;
      const fee_x_amount = toReadableNumber(
        tokenX.decimals,
        unclaimed_fee_x || '0'
      );
      const fee_y_amount = toReadableNumber(
        tokenY.decimals,
        unclaimed_fee_y || '0'
      );
      if (p == 'l') {
        if (new BigNumber(fee_x_amount).isEqualTo('0')) {
          return <span className="text-primaryText">0</span>;
        } else if (new BigNumber(fee_x_amount).isLessThan('0.001')) {
          return '<0.001';
        } else {
          return toPrecision(fee_x_amount, 3);
        }
      } else if (p == 'r') {
        if (new BigNumber(fee_y_amount).isEqualTo('0')) {
          return <span className="text-primaryText">0</span>;
        } else if (new BigNumber(fee_y_amount).isLessThan('0.001')) {
          return '<0.001';
        } else {
          return toPrecision(fee_y_amount, 3);
        }
      } else if (p == 'p') {
        const tokenxSinglePrice = tokenPriceList[tokenX.id]?.price || '0';
        const tokenySinglePrice = tokenPriceList[tokenY.id]?.price || '0';
        const priceX = new BigNumber(fee_x_amount).multipliedBy(
          tokenxSinglePrice
        );
        const priceY = new BigNumber(fee_y_amount).multipliedBy(
          tokenySinglePrice
        );
        const totalPrice = priceX.plus(priceY);
        if (totalPrice.isEqualTo('0')) {
          return <span className="text-primaryText">$0</span>;
        } else if (totalPrice.isLessThan('0.01')) {
          return '<$0.001';
        } else {
          return '$' + toPrecision(totalPrice.toFixed(), 2);
        }
      }
    }
  }
  function canClaim() {
    if (liquidityDetail) {
      const { unclaimed_fee_x, unclaimed_fee_y } = liquidityDetail;
      if (+unclaimed_fee_x > 0 || +unclaimed_fee_y > 0) return true;
    }
    return false;
  }
  function getRateMapTokens() {
    if (tokenMetadata_x_y) {
      const [tokenX, tokenY] = tokenMetadata_x_y;
      if (rate_need_to_reverse_display) {
        return `${tokenX.symbol}/${tokenY.symbol}`;
      } else {
        return `${tokenY.symbol}/${tokenX.symbol}`;
      }
    }
  }
  function mobile_ReferenceToken(direction: string) {
    if (tokenMetadata_x_y) {
      const [tokenX, tokenY] = tokenMetadata_x_y;
      if (direction == 'left') {
        if (rate_need_to_reverse_display) {
          return tokenY.symbol;
        } else {
          return tokenX.symbol;
        }
      } else if (direction == 'right') {
        if (rate_need_to_reverse_display) {
          return tokenX.symbol;
        } else {
          return tokenY.symbol;
        }
      }
    }
  }
  function go_farm() {
    const [fixRange, pool_id, left_point, right_point] =
      liquidity.mft_id.split('&');
    const link_params = `${get_pool_name(
      pool_id
    )}[${left_point}-${right_point}]`;
    const actives = related_farms.filter((farm: FarmBoost) => {
      return farm.status != 'Ended';
    });
    let url;
    if (related_farms.length > 0 && actives.length == 0) {
      url = `/v2farms/${link_params}-e`;
    } else {
      url = `/v2farms/${link_params}-r`;
    }
    openUrl(url);
  }
  const {
    Icon: Liquidity_icon,
    your_apr: liquidity_your_apr,
    link: liquidity_link,
    inRange: liquidity_inRange,
    status: liquidity_staked_farm_status,
  } = related_seed_info;
  return (
    <>
      <LiquidityContext.Provider
        value={{
          hover,
          setHover,
          getLpt_id,
          goYourLiquidityDetailPage,
          tokenMetadata_x_y,
          fee,
          Liquidity_icon,
          liquidity_link,
          is_in_farming,
          liquidity_inRange,
          getRate,
          rate_need_to_reverse_display,
          getRateMapTokens,
          isInrange,
          liquidity_your_apr,
          liquidity_staked_farm_status,
          your_liquidity,
          setShowAddBox,
          setShowRemoveBox,
          getTokenFeeAmount,
          canClaim,
          go_farm,
          mobile_ReferenceToken,
          claimRewards,
          claimLoading,
          showRemoveBox,
          poolDetail,
          tokenPriceList,
          liquidityDetail,
          showAddBox,
          goPoolDetailPage,
        }}
      >
        {styleType == '1' ? (
          <UserLiquidityLineStyle1 />
        ) : (
          <UserLiquidityLineStyle2 />
        )}
      </LiquidityContext.Provider>
    </>
  );
}

// a function just to return your liquidity data
async function getYourLiquidityData({
  liquidity,
  all_seeds,
  styleType,
  tokenPriceList,
  poolDetail,
  liquidities_tokens_metas,
  liquidityDetail,
}: {
  liquidity: UserLiquidityInfo;
  all_seeds: Seed[];
  styleType: string;
  tokenPriceList: Record<string, any>;
  poolDetail: PoolInfo;
  liquidities_tokens_metas: Record<string, TokenMetadata>;
  liquidityDetail: UserLiquidityInfo;
}) {
  const { lpt_id, pool_id, left_point, right_point, amount: L } = liquidity;
  const [token_x, token_y, fee] = pool_id.split('|');

  const tokenMetadata_x_y = liquidities_tokens_metas
    ? [liquidities_tokens_metas[token_x], liquidities_tokens_metas[token_y]]
    : null;

  let rate_need_to_reverse_display: boolean;

  if (tokenMetadata_x_y) {
    const [tokenX] = tokenMetadata_x_y;
    if (TOKEN_LIST_FOR_RATE.indexOf(tokenX.symbol) > -1)
      rate_need_to_reverse_display = true;
    else rate_need_to_reverse_display = false;
  }

  let your_liquidity: any;

  if (tokenMetadata_x_y && poolDetail && tokenPriceList) {
    const { current_point } = poolDetail;
    your_liquidity = get_your_liquidity(current_point, left_point, right_point);
  }

  const is_in_farming =
    liquidity.part_farm_ratio && +liquidity.part_farm_ratio > 0;
  console.log('liquidity: ', liquidity);

  let related_farms: any;

  if (is_in_farming) {
    const id = liquidity.mft_id.slice(1);
    const seed_id = REF_UNI_V3_SWAP_CONTRACT_ID + '@' + id;
    related_farms = await list_seed_farms(seed_id);
  }

  const related_seed_info = get_detail_the_liquidity_refer_to_seed({
    liquidity,
    all_seeds,
    is_in_farming,
    related_farms,
    tokenPriceList,
  });

  function get_your_liquidity_in_farm_range() {
    if (!related_seed_info.targetSeed || !related_seed_info.targetSeed.seed_id)
      return '0';

    const seed_info = related_seed_info.targetSeed.seed_id.split('&');
    const farmRangeLeft = Number(seed_info[2]);
    const farmRangeRight = Number(seed_info[3]);
    const { current_point } = poolDetail;

    if (left_point > farmRangeRight || right_point < farmRangeLeft) return '0';

    return get_your_liquidity(
      current_point,
      left_point >= farmRangeLeft ? left_point : farmRangeLeft,
      right_point <= farmRangeRight ? right_point : farmRangeRight
    );
  }

  function get_your_liquidity(
    current_point: number,
    left_point: number,
    right_point: number
  ) {
    const [tokenX, tokenY] = tokenMetadata_x_y;
    const priceX = tokenPriceList[tokenX.id]?.price || 0;
    const priceY = tokenPriceList[tokenY.id]?.price || 0;
    let total_price;
    //  in range
    if (current_point >= left_point && right_point > current_point) {
      let tokenYAmount = getY(left_point, current_point, L, tokenY) || 0;
      let tokenXAmount = getX(current_point + 1, right_point, L, tokenX) || 0;
      const { amountx, amounty } = get_X_Y_In_CurrentPoint(tokenX, tokenY, L);
      tokenXAmount = new BigNumber(tokenXAmount).plus(amountx).toFixed();
      tokenYAmount = new BigNumber(tokenYAmount).plus(amounty).toFixed();
      const tokenYTotalPrice = new BigNumber(tokenYAmount).multipliedBy(priceY);
      const tokenXTotalPrice = new BigNumber(tokenXAmount).multipliedBy(priceX);
      total_price = tokenYTotalPrice.plus(tokenXTotalPrice).toFixed();
    }
    // only y token
    if (current_point >= right_point) {
      const tokenYAmount = getY(left_point, right_point, L, tokenY);
      const tokenYTotalPrice = new BigNumber(tokenYAmount).multipliedBy(priceY);
      total_price = tokenYTotalPrice.toFixed();
    }
    // only x token
    if (left_point > current_point) {
      const tokenXAmount = getX(left_point, right_point, L, tokenX);
      const tokenXTotalPrice = new BigNumber(tokenXAmount).multipliedBy(priceX);
      total_price = tokenXTotalPrice.toFixed();
    }

    return total_price;
  }
  function getY(
    leftPoint: number,
    rightPoint: number,
    L: string,
    token: TokenMetadata
  ) {
    const y = new BigNumber(L).multipliedBy(
      (Math.pow(Math.sqrt(CONSTANT_D), rightPoint) -
        Math.pow(Math.sqrt(CONSTANT_D), leftPoint)) /
        (Math.sqrt(CONSTANT_D) - 1)
    );
    const y_result = y.toFixed();
    return toReadableNumber(token.decimals, toPrecision(y_result, 0));
  }
  function getX(
    leftPoint: number,
    rightPoint: number,
    L: string,
    token: TokenMetadata
  ) {
    const x = new BigNumber(L)
      .multipliedBy(
        (Math.pow(Math.sqrt(CONSTANT_D), rightPoint - leftPoint) - 1) /
          (Math.pow(Math.sqrt(CONSTANT_D), rightPoint) -
            Math.pow(Math.sqrt(CONSTANT_D), rightPoint - 1))
      )
      .toFixed();
    return toReadableNumber(token.decimals, toPrecision(x, 0));
  }
  function get_X_Y_In_CurrentPoint(
    tokenX: TokenMetadata,
    tokenY: TokenMetadata,
    L: string
  ) {
    const { liquidity, liquidity_x, current_point } = poolDetail;
    const liquidity_y_big = new BigNumber(liquidity).minus(liquidity_x);
    let Ly = '0';
    let Lx = '0';
    // only remove y
    if (liquidity_y_big.isGreaterThanOrEqualTo(L)) {
      Ly = L;
    } else {
      // have x and y
      Ly = liquidity_y_big.toFixed();
      Lx = new BigNumber(L).minus(Ly).toFixed();
    }
    const amountX = getXAmount_per_point_by_Lx(Lx, current_point);
    const amountY = getYAmount_per_point_by_Ly(Ly, current_point);
    const amountX_read = toReadableNumber(
      tokenX.decimals,
      toPrecision(amountX, 0)
    );
    const amountY_read = toReadableNumber(
      tokenY.decimals,
      toPrecision(amountY, 0)
    );
    return { amountx: amountX_read, amounty: amountY_read };
  }

  function getTokenFeeAmount(p: string) {
    if (liquidityDetail && tokenMetadata_x_y && tokenPriceList) {
      const [tokenX, tokenY] = tokenMetadata_x_y;
      const { unclaimed_fee_x, unclaimed_fee_y } = liquidityDetail;
      const fee_x_amount = toReadableNumber(
        tokenX.decimals,
        unclaimed_fee_x || '0'
      );
      const fee_y_amount = toReadableNumber(
        tokenY.decimals,
        unclaimed_fee_y || '0'
      );
      if (p == 'l') {
        return fee_x_amount;
      } else if (p == 'r') {
        return fee_y_amount;
      } else if (p == 'p') {
        const tokenxSinglePrice = tokenPriceList[tokenX.id]?.price || '0';
        const tokenySinglePrice = tokenPriceList[tokenY.id]?.price || '0';
        const priceX = new BigNumber(fee_x_amount).multipliedBy(
          tokenxSinglePrice
        );
        const priceY = new BigNumber(fee_y_amount).multipliedBy(
          tokenySinglePrice
        );
        const totalPrice = priceX.plus(priceY);

        return scientificNotationToString(totalPrice.toString());
      }
    }
  }

  const tokenFeeLeft = getTokenFeeAmount('l');

  const tokenFeeRight = getTokenFeeAmount('r');

  function getRate(direction: string) {
    let value = '';
    if (tokenMetadata_x_y) {
      const [tokenX, tokenY] = tokenMetadata_x_y;
      const decimalRate =
        Math.pow(10, tokenX.decimals) / Math.pow(10, tokenY.decimals);
      if (direction == 'left') {
        value = getPriceByPoint(left_point, decimalRate);
      } else if (direction == 'right') {
        value = getPriceByPoint(right_point, decimalRate);
      }
      if (rate_need_to_reverse_display && +value !== 0) {
        value = new BigNumber(1).dividedBy(value).toFixed();
      }
    }
    return value;
  }

  function go_farm() {
    const [fixRange, pool_id, left_point, right_point] =
      liquidity.mft_id.split('&');
    const link_params = `${get_pool_name(
      pool_id
    )}[${left_point}-${right_point}]`;
    const actives = related_farms.filter((farm: FarmBoost) => {
      return farm.status != 'Ended';
    });
    let url;
    if (related_farms.length > 0 && actives.length == 0) {
      url = `/v2farms/${link_params}-e`;
    } else {
      url = `/v2farms/${link_params}-r`;
    }
    openUrl(url);
  }

  const rangeMin = getRate(rate_need_to_reverse_display ? 'right' : 'left');

  const rangeMax = getRate(rate_need_to_reverse_display ? 'left' : 'right');

  function getRateMapTokens() {
    if (tokenMetadata_x_y) {
      const [tokenX, tokenY] = tokenMetadata_x_y;
      if (rate_need_to_reverse_display) {
        return `${tokenX.symbol}/${tokenY.symbol}`;
      } else {
        return `${tokenY.symbol}/${tokenX.symbol}`;
      }
    }
  }

  const ratedMapTokens = getRateMapTokens();

  const your_liquidity_farm = get_your_liquidity_in_farm_range();

  return {
    fee,
    your_liquidity,
    your_liquidity_farm,
    related_seed_info,
    go_farm,
    tokenFeeLeft: tokenFeeLeft || '0',
    tokenFeeRight: tokenFeeRight || '0',
    rate_need_to_reverse_display,
    related_farms,
    is_in_farming,
    liquidity,
    pool_id,
    rangeMax,
    rangeMin,
    ratedMapTokens,
    tokenMetadata_x_y,
    liquidityDetail,
  };
}

function UserLiquidityLineStyle1() {
  const {
    hover,
    setHover,
    getLpt_id,
    goYourLiquidityDetailPage,
    tokenMetadata_x_y,
    fee,
    Liquidity_icon,
    liquidity_link,
    is_in_farming,
    liquidity_inRange,
    getRate,
    rate_need_to_reverse_display,
    getRateMapTokens,
    isInrange,
    liquidity_your_apr,
    liquidity_staked_farm_status,
    your_liquidity,
    setShowAddBox,
    setShowRemoveBox,
    getTokenFeeAmount,
    canClaim,
    go_farm,
    mobile_ReferenceToken,
    claimRewards,
    claimLoading,
    showRemoveBox,
    poolDetail,
    tokenPriceList,
    liquidityDetail,
    showAddBox,
  } = useContext(LiquidityContext);

  const history = useHistory();

  function goDetailV2() {
    const url_pool_id = get_pool_name(poolDetail.pool_id);
    history.push(`/poolV2/${url_pool_id}`);
  }

  const tokens = sort_tokens_by_base(tokenMetadata_x_y);
  return (
    <div
      className="mt-3.5"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* for PC */}
      <div className="relative flex flex-col items-center xs:hidden md:hidden">
        <div className="w-full rounded-xl overflow-hidden">
          <div
            className={`relative p-4 pt-8 cursor-pointer ${
              hover ? 'bg-v3HoverDarkBgColor' : 'bg-cardBg'
            }`}
            onClick={goDetailV2}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex items-center flex-shrink-0">
                  <img
                    src={tokens[0]?.icon}
                    className="w-7 h-7 border border-greenColor rounded-full"
                  ></img>
                  <img
                    src={tokens[1]?.icon}
                    className="relative -ml-1.5 w-7 h-7 border border-greenColor rounded-full"
                  ></img>
                </div>
                <span className="text-white font-bold ml-9 mr-2.5 text-sm gotham_bold">
                  {tokens[0]?.['symbol']}-{tokens[1]?.['symbol']}
                </span>
                <div className="flex items-center justify-center bg-black bg-opacity-25 rounded-2xl px-3 h-6 py-0.5">
                  <span className="text-xs text-v3SwapGray whitespace-nowrap mr-1.5">
                    <FormattedMessage id="fee_Tiers" />
                  </span>
                  <span className="text-sm text-v3Blue">{+fee / 10000}%</span>
                </div>
                {Liquidity_icon ? (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      if (liquidity_link) {
                        openUrl(liquidity_link);
                      }
                    }}
                    className={`flex items-center justify-center border border-greenColor rounded-lg px-1 ml-2 ${
                      liquidity_link ? 'cursor-pointer' : ''
                    } ${
                      is_in_farming || liquidity_inRange ? '' : 'opacity-40'
                    }`}
                  >
                    <span className="text-xs text-greenColor mr-1">
                      <FormattedMessage id="farm" />
                    </span>{' '}
                    <Liquidity_icon num={Math.random()}></Liquidity_icon>
                  </div>
                ) : null}
              </div>
              <div className="flex items-center">
                <span className="text-v3SwapGray text-xs mr-1.5">
                  <FormattedMessage
                    id="min"
                    defaultMessage="Min"
                  ></FormattedMessage>
                </span>
                <span className="text-white text-sm overflow-hidden whitespace-nowrap overflow-ellipsis gotham_bold">
                  {getRate(rate_need_to_reverse_display ? 'right' : 'left')}
                </span>
                <label className="text-v3SwapGray text-xs mx-2">-</label>
                <span className="text-v3SwapGray text-xs mr-1.5">
                  <FormattedMessage
                    id="max"
                    defaultMessage="Max"
                  ></FormattedMessage>
                </span>
                <span className="text-white text-sm overflow-hidden whitespace-nowrap overflow-ellipsis gotham_bold">
                  {getRate(rate_need_to_reverse_display ? 'left' : 'right')}
                </span>
                <span className="text-v3SwapGray text-xs ml-1.5 mr-3">
                  {getRateMapTokens()}
                </span>
                <div className="flex items-center justify-center bg-black bg-opacity-25 rounded-2xl px-3 h-6 py-0.5">
                  <span
                    className={`flex-shrink-0 w-1.5 h-1.5 rounded-full mr-1.5 ${
                      isInrange
                        ? 'bg-gradientFromHover'
                        : 'bg-v3GarkWarningColor'
                    }`}
                  ></span>
                  <span
                    className={`whitespace-nowrap text-xs ${
                      isInrange
                        ? 'text-gradientFromHover'
                        : 'text-v3GarkWarningColor'
                    }`}
                  >
                    {isInrange ? (
                      <FormattedMessage id="in_range"></FormattedMessage>
                    ) : (
                      <FormattedMessage id="out_of_range"></FormattedMessage>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`border-t border-v3BlueBorderColor w-full ${
              hover ? '' : 'hidden'
            }`}
          >
            {liquidity_your_apr &&
            (!is_in_farming || liquidity_staked_farm_status == 'end') ? (
              <div
                className="relative flex items-center justify-center p-1"
                style={{ background: 'rgba(91, 64, 255, 0.5)' }}
              >
                <TipIon className="mr-2 flex-shrink-0"></TipIon>
                <span className="text-sm text-white">
                  {liquidity_staked_farm_status == 'end' ? (
                    <FormattedMessage id="you_can_earn_current_tip" />
                  ) : (
                    <FormattedMessage id="you_can_earn_tip" />
                  )}{' '}
                  {liquidity_your_apr}
                </span>
                <div
                  className="flex items-center justify-center absolute right-4 text-white cursor-pointer"
                  onClick={() => {
                    openUrl(liquidity_link);
                  }}
                >
                  <a className="text-sm text-white mr-1 underline">
                    {liquidity_staked_farm_status == 'end' ? (
                      <FormattedMessage id="go_new_farm" />
                    ) : (
                      <FormattedMessage id="go_farm" />
                    )}
                  </a>
                  <LinkArrowIcon className="cursor-pointer"></LinkArrowIcon>
                </div>
              </div>
            ) : null}

            <div className={`flex items-center justify-between bg-cardBg p-4`}>
              <div className="flex items-center justify-center">
                <span className="text-xs text-v3SwapGray">
                  <FormattedMessage id="your_liquidity" />
                </span>
                <span className="text-sm text-white mx-2.5 gotham_bold">
                  ${your_liquidity || '-'}
                </span>
                <GradientButton
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAddBox(true);
                  }}
                  color="#fff"
                  minWidth="5rem"
                  disabled={is_in_farming}
                  borderRadius="8px"
                  btnClassName={is_in_farming ? 'cursor-not-allowed' : ''}
                  className={`px-3 h-8 text-center text-sm text-white gotham_bold focus:outline-none mr-2.5 ${
                    is_in_farming ? 'opacity-40 ' : ''
                  }`}
                >
                  <FormattedMessage id="add" />
                </GradientButton>
                <BorderButton
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowRemoveBox(true);
                  }}
                  rounded="rounded-lg"
                  disabled={is_in_farming}
                  px="px-0"
                  py="py-1"
                  style={{ minWidth: '5rem' }}
                  className={`flex-grow  gotham_bold text-sm text-greenColor h-8 ${
                    is_in_farming ? 'opacity-40' : ''
                  }`}
                >
                  <FormattedMessage id="remove" />
                </BorderButton>
                {is_in_farming ? (
                  <div className="flex items-center text-sm text-primaryText ml-2.5">
                    <FormattedMessage id="staked" />
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        go_farm();
                      }}
                    >
                      <span className="text-greenColor mx-1 cursor-pointer underline">
                        {liquidity_staked_farm_status == 'end' ? (
                          <FormattedMessage id="in_ended_farm" />
                        ) : (
                          <FormattedMessage id="in_farm_3" />
                        )}
                      </span>
                      <LinkArrowIcon className="cursor-pointer text-greenColor"></LinkArrowIcon>
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="flex items-center justify-center">
                <span className="text-xs text-v3SwapGray mr-2.5">
                  <FormattedMessage id="unclaimed_fees" />
                </span>
                <img
                  src={tokenMetadata_x_y && tokenMetadata_x_y[0].icon}
                  className="w-5 h-5 border border-greenColor rounded-full mr-1"
                ></img>
                <span className="text-sm text-white mr-3 gotham_bold">
                  {getTokenFeeAmount('l') || '-'}
                </span>
                <img
                  src={tokenMetadata_x_y && tokenMetadata_x_y[1].icon}
                  className="w-5 h-5 border border-greenColor rounded-full mr-1"
                ></img>
                <span className="text-sm text-white gotham_bold">
                  {getTokenFeeAmount('r') || '-'}
                </span>
                <div
                  className={`flex items-center justify-center  rounded-lg text-sm px-2 py-1 ml-5 gotham_bold ${
                    !canClaim()
                      ? 'bg-deepBlue text-white opacity-30 cursor-not-allowed'
                      : 'bg-deepBlue text-white hover:bg-lightBlue cursor-pointer'
                  }`}
                  onClick={claimRewards}
                >
                  <ButtonTextWrapper
                    loading={claimLoading}
                    Text={() => <FormattedMessage id="claim" />}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* for Mobile */}
      <div className="lg:hidden">
        <div
          className={`relative cursor-pointer bg-cardBg rounded-lg overflow-hidden`}
          onClick={goDetailV2}
        >
          <div className="flex flex-col items-center justify-between w-full bg-orderMobileTop px-3 pb-3">
            <div className="flex items-center justify-center">
              <ColorsBox svgId="paint0_linear_124_7158"></ColorsBox>
              <span className="absolute text-white text-xs gotham_bold">
                NFT ID #{getLpt_id()}
              </span>
            </div>
            <div className="flex items-center justify-between w-full mt-1.5">
              <div className="flex items-center flex-shrink-0">
                <div className="flex items-center flex-shrink-0">
                  <img
                    src={tokens[0]?.icon}
                    className="w-7 h-7 border border-greenColor rounded-full"
                  ></img>
                  <img
                    src={tokens[1]?.icon}
                    className="relative -ml-1.5 w-7 h-7 border border-greenColor rounded-full"
                  ></img>
                </div>
                <span className="text-white text-sm ml-1.5">
                  {tokens[0]?.['symbol']}-{tokens[1]?.['symbol']}
                </span>
                {Liquidity_icon ? (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      if (liquidity_link) {
                        openUrl(liquidity_link);
                      }
                    }}
                    className={`flex items-center justify-center border border-greenColor rounded-lg px-1 ml-2 ${
                      is_in_farming || liquidity_inRange ? '' : 'opacity-40'
                    }`}
                  >
                    <span className="text-xs text-greenColor mr-1">
                      <FormattedMessage id="farm" />
                    </span>{' '}
                    <Liquidity_icon num={Math.random()}></Liquidity_icon>
                  </div>
                ) : null}
              </div>
              <div className="flex items-center justify-center ml-2 bg-black bg-opacity-25 rounded-2xl px-1.5 h-6 py-0.5 overflow-hidden whitespace-nowrap overflow-ellipsis">
                <span
                  className={`flex-shrink-0 w-1.5 h-1.5 rounded-full mr-1.5 ${
                    isInrange ? 'bg-gradientFromHover' : 'bg-v3GarkWarningColor'
                  }`}
                ></span>
                <span
                  className={`whitespace-nowrap text-xs overflow-hidden  overflow-ellipsis ${
                    isInrange
                      ? 'text-gradientFromHover'
                      : 'text-v3GarkWarningColor'
                  }`}
                >
                  {isInrange ? (
                    <FormattedMessage id="in_range"></FormattedMessage>
                  ) : (
                    <FormattedMessage id="out_of_range"></FormattedMessage>
                  )}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col p-3">
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-v3SwapGray">
                <FormattedMessage id="fee_Tiers" />
              </span>
              <span className="text-sm text-white">{+fee / 10000}%</span>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-v3SwapGray text-xs">
                <FormattedMessage id="min_price" /> (1{' '}
                {mobile_ReferenceToken('left')})
              </span>
              <span className="text-white text-sm">
                {getRate(rate_need_to_reverse_display ? 'right' : 'left')}&nbsp;
                {mobile_ReferenceToken('right')}
              </span>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-v3SwapGray text-xs">
                <FormattedMessage id="max_price" /> (1{' '}
                {mobile_ReferenceToken('left')})
              </span>
              <span className="text-white text-sm">
                {getRate(rate_need_to_reverse_display ? 'left' : 'right')}&nbsp;
                {mobile_ReferenceToken('right')}
              </span>
            </div>
            <div className="flex items-start justify-between mt-4">
              <span className="text-v3SwapGray text-xs">
                <FormattedMessage id="unclaimed_fees" />
              </span>
              <div className="flex items-center text-white text-sm">
                <img
                  src={tokenMetadata_x_y && tokenMetadata_x_y[0].icon}
                  className="w-5 h-5 border border-greenColor rounded-full mr-1"
                ></img>
                <span className="text-sm text-white mr-3">
                  {getTokenFeeAmount('l') || '-'}
                </span>
                <img
                  src={tokenMetadata_x_y && tokenMetadata_x_y[1].icon}
                  className="w-5 h-5 border border-greenColor rounded-full mr-1"
                ></img>
                <span className="text-sm text-white">
                  {getTokenFeeAmount('r') || '-'}
                </span>
                <div
                  className={`flex items-center justify-center  rounded-lg text-sm px-2 py-1 ml-3 ${
                    !canClaim()
                      ? 'bg-deepBlue text-white opacity-30 cursor-not-allowed'
                      : 'bg-deepBlue text-white hover:bg-lightBlue cursor-pointer'
                  }`}
                  onClick={claimRewards}
                >
                  <ButtonTextWrapper
                    loading={claimLoading}
                    Text={() => <FormattedMessage id="claim" />}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-searchBgColor rounded-2xl pt-3 overflow-hidden">
          <div className="flex items-center justify-between px-3">
            <span className="text-xs text-v3SwapGray">
              <FormattedMessage id="your_liquidity" />
            </span>
            <span className="text-sm text-white">${your_liquidity || '-'}</span>
          </div>
          <div className="flex items-center justify-between px-3 mt-3.5 mb-4">
            <GradientButton
              onClick={(e) => {
                e.stopPropagation();
                setShowAddBox(true);
              }}
              disabled={is_in_farming ? true : false}
              color="#fff"
              className={`w-1 flex-grow h-8 text-center text-sm text-white focus:outline-none mr-3 ${
                is_in_farming ? 'opacity-40' : ''
              }`}
            >
              <FormattedMessage id="add" />
            </GradientButton>
            <BorderButton
              onClick={(e) => {
                e.stopPropagation();
                setShowRemoveBox(true);
              }}
              disabled={is_in_farming ? true : false}
              rounded="rounded-md"
              px="px-0"
              py="py-1"
              className={`w-1 flex-grow  text-sm text-greenColor h-8 ${
                is_in_farming ? 'opacity-40' : ''
              }`}
            >
              <FormattedMessage id="remove" />
            </BorderButton>
          </div>
          {is_in_farming ? (
            <div className="flex items-center justify-center text-sm text-primaryText mb-3">
              <FormattedMessage id="this_staked_tip" />
              <span
                className="text-sm text-greenColor underline ml-1 mr-0.5"
                onClick={(e) => {
                  e.stopPropagation();
                  go_farm();
                }}
              >
                {liquidity_staked_farm_status == 'end' ? (
                  <FormattedMessage id="in_ended_farm" />
                ) : (
                  <FormattedMessage id="in_farm_3" />
                )}
              </span>
              <LinkArrowIcon className="text-greenColor"></LinkArrowIcon>
            </div>
          ) : null}
          {liquidity_your_apr &&
          (!is_in_farming || liquidity_staked_farm_status == 'end') ? (
            <div
              className="relative flex items-start justify-center p-1"
              style={{ background: 'rgba(91, 64, 255, 0.5)' }}
            >
              <div
                className={`flex flex-col items-center justify-center text-sm text-white ${
                  liquidity_staked_farm_status == 'end' ? 'hidden' : ''
                }`}
              >
                <div className="flex items-center">
                  <TipIon className="mr-2 flex-shrink-0"></TipIon>
                  <div className="flex items-center">
                    <FormattedMessage id="earn_rewards" />
                    <div
                      className="flex items-center"
                      onClick={() => {
                        openUrl(liquidity_link);
                      }}
                    >
                      <span className="underline ml-1 mr-0.5">
                        <FormattedMessage id="by_farming" />
                      </span>
                      <LinkArrowIcon className="cursor-pointer"></LinkArrowIcon>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <FormattedMessage id="est_apr_is" />
                  <span className="gotham_bold ml-1">{liquidity_your_apr}</span>
                </div>
              </div>
              <div
                className={`flex flex-col items-center justify-center text-sm text-white ${
                  liquidity_staked_farm_status == 'end' ? '' : 'hidden'
                }`}
              >
                <div className="flex items-center">
                  <TipIon className="mr-2 flex-shrink-0"></TipIon>
                  <span>
                    <FormattedMessage id="you_can_earn_current_pre_tip" />
                  </span>
                </div>
                <div className="flex items-center justify-center flex-wrap">
                  <div
                    className="flex items-center"
                    onClick={() => {
                      openUrl(liquidity_link);
                    }}
                  >
                    <span className="underline ml-1 mr-0.5">
                      <FormattedMessage id="new_farm_2" />
                    </span>
                    <LinkArrowIcon className="cursor-pointer mr-0.5"></LinkArrowIcon>
                  </div>
                  <FormattedMessage id="is_coming" />,
                  <FormattedMessage id="est_apr_is" />
                  <span className="gotham_bold ml-1">{liquidity_your_apr}</span>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      {showRemoveBox ? (
        <RemovePoolV3
          isOpen={showRemoveBox}
          onRequestClose={() => {
            setShowRemoveBox(false);
          }}
          tokenMetadata_x_y={tokenMetadata_x_y}
          poolDetail={poolDetail}
          tokenPriceList={tokenPriceList}
          userLiquidity={liquidityDetail}
          style={{
            overlay: {
              backdropFilter: 'blur(15px)',
              WebkitBackdropFilter: 'blur(15px)',
            },
            content: {
              outline: 'none',
              transform: 'translate(-50%, -50%)',
            },
          }}
        ></RemovePoolV3>
      ) : null}
      <AddPoolV3
        isOpen={showAddBox}
        onRequestClose={() => {
          setShowAddBox(false);
        }}
        tokenMetadata_x_y={tokenMetadata_x_y}
        poolDetail={poolDetail}
        tokenPriceList={tokenPriceList}
        userLiquidity={liquidityDetail}
        style={{
          overlay: {
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
          },
          content: {
            outline: 'none',
            transform: 'translate(-50%, -50%)',
          },
        }}
      ></AddPoolV3>
    </div>
  );
}

export function findRangeIntersection(arr: number[][]) {
  if (!Array.isArray(arr) || arr.length === 0) {
    return [];
  }

  arr.sort((a, b) => a[0] - b[0]);

  let intersection = [arr[0]];

  for (let i = 1; i < arr.length; i++) {
    const current = arr[i];
    const [currentStart, currentEnd] = current;
    const [prevStart, prevEnd] = intersection[intersection.length - 1];

    if (currentStart > prevEnd) {
      intersection.push(current);
    } else {
      const start = Math.min(currentStart, prevStart);
      const end = Math.max(currentEnd, prevEnd);
      intersection[intersection.length - 1] = [start, end];
    }
  }

  return intersection;
}

function UserLiquidityLineStyleGroup1({
  groupYourLiquidityList,
  liquidities_list,
  tokenPriceList,
}: {
  groupYourLiquidityList: any[];
  liquidities_list: UserLiquidityInfo[];
  tokenPriceList: any;
}) {
  // const {
  //   goYourLiquidityDetailPage,
  //   Liquidity_icon,
  //   liquidity_link,

  //   // liquidity_staked_farm_status,
  //   // setShowAddBox,
  //   // setShowRemoveBox,
  //   getTokenFeeAmount,
  //   // canClaim,
  //   // go_farm,
  //   mobile_ReferenceToken,
  //   // claimRewards,
  //   // claimLoading,
  //   showRemoveBox,
  //   poolDetail,
  //   tokenPriceList,
  //   liquidityDetail,
  //   showAddBox,
  // } = useContext(LiquidityContext);

  const [hover, setHover] = useState<boolean>(false);

  const publicData = groupYourLiquidityList[0];

  const [showRemoveBox, setShowRemoveBox] = useState<boolean>(false);

  const {
    tokenMetadata_x_y,
    fee,
    pool_id,
    related_seed_info,
    ratedMapTokens,
    related_farms,
    poolDetail,
    go_farm,
  } = publicData;

  const history = useHistory();

  const groupList = () => {
    const your_liquidity = groupYourLiquidityList.reduce((prev, cur) => {
      return new Big(prev || '0').plus(new Big(cur.your_liquidity || '0'));
    }, new Big(0));

    const tokenFeeLeft = groupYourLiquidityList.reduce((prev, cur) => {
      return new Big(prev || '0').plus(new Big(cur.tokenFeeLeft || '0'));
    }, new Big(0));

    const tokenFeeRight = groupYourLiquidityList.reduce((prev, cur) => {
      return new Big(prev || '0').plus(new Big(cur.tokenFeeRight || '0'));
    }, new Big(0));

    const rangeList = groupYourLiquidityList.map((g) => [
      Number(g.rangeMin),
      Number(g.rangeMax),
    ]);

    const pointRangeList = groupYourLiquidityList.map((g) => [
      g.liquidity.left_point,
      g.liquidity.right_point,
    ]);

    const is_in_farming = groupYourLiquidityList.reduce(
      (pre, cur) => !!pre || !!cur.is_in_farming,
      false
    );

    const intersectionRangeList = findRangeIntersection(rangeList);

    const intersectionPointRangeList = findRangeIntersection(pointRangeList);

    const current_point = poolDetail.current_point;

    const isInRange = intersectionPointRangeList.some(
      (range) => current_point >= range[0] && current_point <= range[1]
    );

    const canClaim = groupYourLiquidityList.reduce((pre, cur) => {
      const liquidityDetail = cur.liquidityDetail;
      const { unclaimed_fee_x, unclaimed_fee_y } = liquidityDetail;

      return !!pre && !!(+unclaimed_fee_x > 0 || +unclaimed_fee_y > 0);
    }, true);

    // on farm not on myself
    const farmApr: Big = !publicData.related_seed_info.your_apr
      ? ''
      : groupYourLiquidityList.reduce((prev: any, cur: any) => {
          return new Big(prev || '0').plus(
            new Big(cur.related_seed_info.your_apr_raw || '0')
          );
        }, new Big(0));

    let farmRangeLeft;
    let farmRangeRight;

    if (related_seed_info.targetSeed) {
      const seed_info = related_seed_info.targetSeed.seed_id.split('&');
      farmRangeLeft = Number(seed_info[2]);
      farmRangeRight = Number(seed_info[3]);
    }

    const totalLiquidityAmount = groupYourLiquidityList.reduce(
      (pre, cur) => {
        const { mft_id } = cur.liquidity;

        const { your_liquidity_farm } = cur;

        return {
          total: pre.total.plus(new Big(your_liquidity_farm)),
          in_farm: mft_id
            ? pre.in_farm.plus(new Big(your_liquidity_farm))
            : pre.in_farm,
        };
      },
      {
        total: new Big(0),
        in_farm: new Big(0),
      }
    );

    return {
      ...publicData,
      your_liquidity:
        '$' +
        (your_liquidity.toNumber() < 0.01
          ? '< 0.01'
          : your_liquidity.toFixed(2, 0)),
      tokenFeeLeft:
        tokenFeeLeft.toNumber() < 0.01 ? '< 0.01' : tokenFeeLeft.toFixed(2, 0),
      tokenFeeRight:
        tokenFeeRight.toNumber() < 0.01
          ? '< 0.01'
          : tokenFeeRight.toFixed(2, 0),
      intersectionRangeList: intersectionRangeList.map((range) => [
        new Big(range[0]).toFixed(),
        new Big(range[1]).toFixed(),
      ]),
      is_in_farming,
      intersectionPointRangeList,
      isInRange,
      canClaim,
      farmApr: !farmApr
        ? ''
        : farmApr.eq(new Big(0))
        ? '0%'
        : farmApr.lt(0.01)
        ? '<0.01%'
        : farmApr.toFixed(2, 0) + '%',
      in_farm_percent: totalLiquidityAmount.total.eq(0)
        ? '0%'
        : toPrecision(
            scientificNotationToString(
              totalLiquidityAmount.in_farm
                .div(totalLiquidityAmount.total)
                .times(100)
                .toString()
            ),
            2
          ) + '%',
    };
  };

  const groupedData = groupList();

  const {
    your_liquidity,
    tokenFeeLeft,
    tokenFeeRight,
    is_in_farming,
    intersectionRangeList,
    isInRange,
    canClaim,
    farmApr,
    in_farm_percent,
  } = groupedData;

  function goDetailV2() {
    const url_pool_id = get_pool_name(pool_id);
    history.push(`/poolV2/${url_pool_id}`);
  }

  const tokens = sort_tokens_by_base(tokenMetadata_x_y);

  const { accountId } = useWalletSelector();

  // const poolApr = useDCLAccountAPR({
  //   pool_id,
  //   account_id: accountId,
  // });
  const poolApr = '';

  const [claim_loading, set_claim_loading] = useState(false);

  function claimRewards() {
    if (!canClaim) return;

    set_claim_loading(true);
    const lpt_ids: string[] = [];
    groupYourLiquidityList
      .map((g) => g.liquidityDetail)
      .forEach((liquidity: UserLiquidityInfo) => {
        const { unclaimed_fee_x, unclaimed_fee_y } = liquidity;
        if (+unclaimed_fee_x > 0 || +unclaimed_fee_y > 0) {
          lpt_ids.push(liquidity.lpt_id);
        }
      });
    claim_all_liquidity_fee({
      token_x: tokenMetadata_x_y[0],
      token_y: tokenMetadata_x_y[1],
      lpt_ids,
    });
  }

  function getTotalAprForSeed() {
    const farms = related_seed_info.targetSeed.farmList;
    let apr = 0;
    const allPendingFarms = isPending(related_seed_info.targetSeed);
    farms.forEach(function (item: FarmBoost) {
      const pendingFarm = item.status == 'Created' || item.status == 'Pending';
      if (allPendingFarms || (!allPendingFarms && !pendingFarm)) {
        apr = +new BigNumber(item.apr).plus(apr).toFixed();
      }
    });
    if (apr == 0) {
      return '-';
    } else {
      apr = +new BigNumber(apr).multipliedBy(100).toFixed();
      return toPrecision(apr.toString(), 2) + '%';
    }
  }

  function isPending(seed: Seed) {
    let pending: boolean = true;
    const farms = seed.farmList;
    for (let i = 0; i < farms.length; i++) {
      if (farms[i].status != 'Created' && farms[i].status != 'Pending') {
        pending = false;
        break;
      }
    }
    return pending;
  }

  return (
    <div
      className="mt-3.5"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* for PC */}
      <div className="relative flex flex-col items-center xs:hidden md:hidden">
        <div className="w-full rounded-xl overflow-hidden">
          <div
            className={`relative p-6 cursor-pointer grid grid-cols-6  ${
              hover ? 'bg-v3HoverDarkBgColor' : 'bg-cardBg'
            }`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goDetailV2();
            }}
          >
            {/* 1/3 */}
            <div className="frcs col-span-2">
              <div className="flex items-center flex-shrink-0">
                <img
                  src={tokens[0]?.icon}
                  className="w-7 h-7 border border-greenColor rounded-full"
                ></img>
                <img
                  src={tokens[1]?.icon}
                  className="relative -ml-1.5 w-7 h-7 border border-greenColor rounded-full"
                ></img>
              </div>
              <div className="flex ml-2.5 flex-col  gap-1">
                <span className="text-white  font-gothamBold  text-sm">
                  {tokens[0]?.['symbol']}-{tokens[1]?.['symbol']}
                </span>

                <div className="frcs gap-2 text-xs">
                  <div className="rounded-xl px-1.5 text-white text-sm bg-DCLIconGradient">
                    DCL
                  </div>
                  <div className="flex items-center text-v3SwapGray justify-center bg-black bg-opacity-25 rounded-2xl px-3 h-6 py-0.5">
                    <span className="text-xs  whitespace-nowrap mr-1.5">
                      <FormattedMessage id="fee_Tiers" />
                    </span>
                    <span className="">{+fee / 10000}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2/3 */}

            <div className="col-span-2">
              <div className=" flex flex-wrap">
                {intersectionRangeList.map((range: string[], i: number) => {
                  return (
                    <div className="text-white whitespace-nowrap text-sm">
                      <span>
                        {displayNumberToAppropriateDecimals(range[0])}
                      </span>
                      <span className="mx-1">-</span>

                      <span>
                        {displayNumberToAppropriateDecimals(range[1])}
                      </span>
                      {intersectionRangeList.length > 1 &&
                        i < intersectionRangeList.length - 1 && (
                          <span className="mr-1">,</span>
                        )}
                    </div>
                  );
                })}
                <span className="text-sm ml-1 text-v3SwapGray">
                  {ratedMapTokens}
                </span>
              </div>
              <div className="frcs mt-1 max-w-max bg-black bg-opacity-25 rounded-2xl px-1.5 h-6 py-0.5 overflow-hidden whitespace-nowrap overflow-ellipsis">
                <span
                  className={`whitespace-nowrap text-xs overflow-hidden  overflow-ellipsis ${
                    isInRange
                      ? 'text-gradientFromHover'
                      : 'text-v3GarkWarningColor'
                  }`}
                >
                  {isInRange ? (
                    <FormattedMessage id="in_range"></FormattedMessage>
                  ) : (
                    <FormattedMessage id="out_of_range"></FormattedMessage>
                  )}
                </span>
              </div>
            </div>

            <div className="text-white flex flex-col gap-2  text-sm">
              <span>{poolApr}</span>
              <span className="frcs gap-1 text-primaryText">
                {related_seed_info.your_apr && (
                  <span>
                    <FormattedMessage
                      id="farm_apr"
                      defaultMessage={'Farm APR'}
                    ></FormattedMessage>
                  </span>
                )}

                {related_seed_info.your_apr
                  ? !is_in_farming || related_seed_info.status == 'end'
                    ? '0%'
                    : getTotalAprForSeed()
                  : '-'}
              </span>
            </div>

            <div className=" text-white text-sm flex flex-col gap-2">
              {your_liquidity}

              {related_seed_info.your_apr ? (
                <div className="frcs gap-1 text-primaryText">
                  <span>{in_farm_percent}</span>
                  <span>
                    <FormattedMessage
                      id="in"
                      defaultMessage={'in'}
                    ></FormattedMessage>
                  </span>

                  <span
                    className="underline text-primaryText hover:text-gradientFromHover cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      go_farm();
                    }}
                  >
                    <FormattedMessage
                      id="farm"
                      defaultMessage={'farm'}
                    ></FormattedMessage>
                  </span>
                </div>
              ) : (
                <span className="text-primaryText">-</span>
              )}
            </div>
          </div>
          {farmApr && (!is_in_farming || related_seed_info.status == 'end') ? (
            <div className="relative flex items-center pr-8  bg-dclFarmTipColor justify-end p-1">
              <TipIon className="mr-2 flex-shrink-0"></TipIon>
              <span className="text-sm mr-8  text-white">
                {related_seed_info.status == 'end' ? (
                  <FormattedMessage id="you_can_earn_current_tip" />
                ) : (
                  <FormattedMessage id="you_can_earn_tip" />
                )}{' '}
                <span className="font-gothamBold">{getTotalAprForSeed()}</span>
              </span>
              <div
                className="flex items-center justify-center  text-white cursor-pointer"
                onClick={() => {
                  openUrl(related_seed_info.link);
                }}
              >
                <a className="text-sm text-white mr-1 underline">
                  {related_seed_info.status == 'end' ? (
                    <FormattedMessage id="go_new_farm" />
                  ) : (
                    <FormattedMessage id="go_farm" />
                  )}
                </a>
                <LinkArrowIcon className="cursor-pointer"></LinkArrowIcon>
              </div>
            </div>
          ) : null}
          <div
            className={`border-t border-v3BlueBorderColor w-full ${
              hover ? '' : 'hidden'
            }`}
          >
            <div className={`frcb bg-cardBg p-4`}>
              {/* unclaimed fees */}
              <div className="frcc">
                <span className="text-sm text-v3SwapGray mr-2.5">
                  <FormattedMessage id="unclaimed_fees" />
                </span>
                <img
                  src={tokenMetadata_x_y && tokenMetadata_x_y[0].icon}
                  className="w-5 h-5 border border-greenColor rounded-full mr-1"
                ></img>
                <span className="text-sm text-white mr-3 gotham_bold">
                  {tokenFeeLeft || '-'}
                </span>
                <img
                  src={tokenMetadata_x_y && tokenMetadata_x_y[1].icon}
                  className="w-5 h-5 border border-greenColor rounded-full mr-1"
                ></img>
                <span className="text-sm text-white gotham_bold">
                  {tokenFeeRight || '-'}
                </span>
              </div>

              <div className="flex items-center justify-center">
                <div
                  className={`flex mr-2.5 w-24 h-8 items-center justify-center  rounded-lg text-sm px-3 py-1 ml-5  ${
                    !canClaim
                      ? 'bg-deepBlue text-white opacity-30 cursor-not-allowed'
                      : 'bg-deepBlue text-white hover:bg-lightBlue cursor-pointer'
                  }`}
                  onClick={claimRewards}
                >
                  <ButtonTextWrapper
                    loading={claim_loading}
                    Text={() => <FormattedMessage id="claim" />}
                  />
                </div>
                <GradientButton
                  onClick={(e) => {
                    e.stopPropagation();
                    // setShowAddBox(true);

                    history.push('/addLiquidityV2');
                  }}
                  color="#fff"
                  minWidth="5rem"
                  disabled={is_in_farming}
                  borderRadius="8px"
                  btnClassName={is_in_farming ? 'cursor-not-allowed' : ''}
                  className={`px-3 w-24 h-8 text-center text-sm text-white  focus:outline-none mr-2.5 ${
                    is_in_farming ? 'opacity-40 ' : ''
                  }`}
                >
                  <FormattedMessage id="add" />
                </GradientButton>
                <BorderButton
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowRemoveBox(true);
                  }}
                  rounded="rounded-lg"
                  disabled={is_in_farming}
                  px="px-0"
                  py="py-1"
                  style={{ minWidth: '5rem' }}
                  className={`flex-grow w-24  text-sm text-greenColor h-8 ${
                    is_in_farming ? 'opacity-40' : ''
                  }`}
                >
                  <FormattedMessage id="remove" />
                </BorderButton>
                {/* {is_in_farming ? (
                  <div className="flex items-center text-sm text-primaryText ml-2.5">
                    <FormattedMessage id="staked" />
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        go_farm();
                      }}
                    >
                      <span className="text-greenColor mx-1 cursor-pointer underline">
                        {liquidity_staked_farm_status == 'end' ? (
                          <FormattedMessage id="in_ended_farm" />
                        ) : (
                          <FormattedMessage id="in_farm_3" />
                        )}
                      </span>
                      <LinkArrowIcon className="cursor-pointer text-greenColor"></LinkArrowIcon>
                    </div>
                  </div>
                ) : null} */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* for Mobile */}
      {/* <div className="lg:hidden">
        <div
          className={`relative cursor-pointer bg-cardBg rounded-lg overflow-hidden`}
          onClick={goDetailV2}
        >
          <div className="flex flex-col items-center justify-between w-full bg-orderMobileTop px-3 pb-3">
            <div className="flex items-center justify-between w-full mt-1.5">
              <div className="flex items-center flex-shrink-0">
                <div className="flex items-center flex-shrink-0">
                  <img
                    src={tokens[0]?.icon}
                    className="w-7 h-7 border border-greenColor rounded-full"
                  ></img>
                  <img
                    src={tokens[1]?.icon}
                    className="relative -ml-1.5 w-7 h-7 border border-greenColor rounded-full"
                  ></img>
                </div>
                <span className="text-white text-sm ml-1.5">
                  {tokens[0]?.['symbol']}-{tokens[1]?.['symbol']}
                </span>
              </div>
              <div className="flex items-center justify-center ml-2 bg-black bg-opacity-25 rounded-2xl px-1.5 h-6 py-0.5 overflow-hidden whitespace-nowrap overflow-ellipsis">
                <span
                  className={`flex-shrink-0 w-1.5 h-1.5 rounded-full mr-1.5 ${
                    isInrange ? 'bg-gradientFromHover' : 'bg-v3GarkWarningColor'
                  }`}
                ></span>
                <span
                  className={`whitespace-nowrap text-xs overflow-hidden  overflow-ellipsis ${
                    isInrange
                      ? 'text-gradientFromHover'
                      : 'text-v3GarkWarningColor'
                  }`}
                >
                  {isInrange ? (
                    <FormattedMessage id="in_range"></FormattedMessage>
                  ) : (
                    <FormattedMessage id="out_of_range"></FormattedMessage>
                  )}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col p-3">
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-v3SwapGray">
                <FormattedMessage id="fee_Tiers" />
              </span>
              <span className="text-sm text-white">{+fee / 10000}%</span>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-v3SwapGray text-xs">
                <FormattedMessage id="min_price" /> (1{' '}
                {mobile_ReferenceToken('left')})
              </span>
              <span className="text-white text-sm">
                {getRate(rate_need_to_reverse_display ? 'right' : 'left')}&nbsp;
                {mobile_ReferenceToken('right')}
              </span>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-v3SwapGray text-xs">
                <FormattedMessage id="max_price" /> (1{' '}
                {mobile_ReferenceToken('left')})
              </span>
              <span className="text-white text-sm">
                {getRate(rate_need_to_reverse_display ? 'left' : 'right')}&nbsp;
                {mobile_ReferenceToken('right')}
              </span>
            </div>
            <div className="flex items-start justify-between mt-4">
              <span className="text-v3SwapGray text-xs">
                <FormattedMessage id="unclaimed_fees" />
              </span>
              <div className="flex items-center text-white text-sm">
                <img
                  src={tokenMetadata_x_y && tokenMetadata_x_y[0].icon}
                  className="w-5 h-5 border border-greenColor rounded-full mr-1"
                ></img>
                <span className="text-sm text-white mr-3">
                  {getTokenFeeAmount('l') || '-'}
                </span>
                <img
                  src={tokenMetadata_x_y && tokenMetadata_x_y[1].icon}
                  className="w-5 h-5 border border-greenColor rounded-full mr-1"
                ></img>
                <span className="text-sm text-white">
                  {getTokenFeeAmount('r') || '-'}
                </span>
                <div
                  className={`flex items-center justify-center  rounded-lg text-sm px-2 py-1 ml-3 ${
                    !canClaim()
                      ? 'bg-deepBlue text-white opacity-30 cursor-not-allowed'
                      : 'bg-deepBlue text-white hover:bg-lightBlue cursor-pointer'
                  }`}
                  onClick={claimRewards}
                >
                  <ButtonTextWrapper
                    loading={claimLoading}
                    Text={() => <FormattedMessage id="claim" />}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-searchBgColor rounded-2xl pt-3 overflow-hidden">
          <div className="flex items-center justify-between px-3">
            <span className="text-xs text-v3SwapGray">
              <FormattedMessage id="your_liquidity" />
            </span>
            <span className="text-sm text-white">${your_liquidity || '-'}</span>
          </div>
          <div className="flex items-center justify-between px-3 mt-3.5 mb-4">
            <GradientButton
              onClick={(e) => {
                e.stopPropagation();
                setShowAddBox(true);
              }}
              disabled={is_in_farming ? true : false}
              color="#fff"
              className={`w-1 flex-grow h-8 text-center text-sm text-white focus:outline-none mr-3 ${
                is_in_farming ? 'opacity-40' : ''
              }`}
            >
              <FormattedMessage id="add" />
            </GradientButton>
            <BorderButton
              onClick={(e) => {
                e.stopPropagation();
                setShowRemoveBox(true);
              }}
              disabled={is_in_farming ? true : false}
              rounded="rounded-md"
              px="px-0"
              py="py-1"
              className={`w-1 flex-grow  text-sm text-greenColor h-8 ${
                is_in_farming ? 'opacity-40' : ''
              }`}
            >
              <FormattedMessage id="remove" />
            </BorderButton>
          </div>
          {is_in_farming ? (
            <div className="flex items-center justify-center text-sm text-primaryText mb-3">
              <FormattedMessage id="this_staked_tip" />
              <span
                className="text-sm text-greenColor underline ml-1 mr-0.5"
                onClick={(e) => {
                  e.stopPropagation();
                  go_farm();
                }}
              >
                {liquidity_staked_farm_status == 'end' ? (
                  <FormattedMessage id="in_ended_farm" />
                ) : (
                  <FormattedMessage id="in_farm_3" />
                )}
              </span>
              <LinkArrowIcon className="text-greenColor"></LinkArrowIcon>
            </div>
          ) : null}
          {liquidity_your_apr &&
          (!is_in_farming || liquidity_staked_farm_status == 'end') ? (
            <div
              className="relative flex items-start justify-center p-1"
              style={{ background: 'rgba(91, 64, 255, 0.5)' }}
            >
              <div
                className={`flex flex-col items-center justify-center text-sm text-white ${
                  liquidity_staked_farm_status == 'end' ? 'hidden' : ''
                }`}
              >
                <div className="flex items-center">
                  <TipIon className="mr-2 flex-shrink-0"></TipIon>
                  <div className="flex items-center">
                    <FormattedMessage id="earn_rewards" />
                    <div
                      className="flex items-center"
                      onClick={() => {
                        openUrl(liquidity_link);
                      }}
                    >
                      <span className="underline ml-1 mr-0.5">
                        <FormattedMessage id="by_farming" />
                      </span>
                      <LinkArrowIcon className="cursor-pointer"></LinkArrowIcon>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <FormattedMessage id="est_apr_is" />
                  <span className="gotham_bold ml-1">{liquidity_your_apr}</span>
                </div>
              </div>
              <div
                className={`flex flex-col items-center justify-center text-sm text-white ${
                  liquidity_staked_farm_status == 'end' ? '' : 'hidden'
                }`}
              >
                <div className="flex items-center">
                  <TipIon className="mr-2 flex-shrink-0"></TipIon>
                  <span>
                    <FormattedMessage id="you_can_earn_current_pre_tip" />
                  </span>
                </div>
                <div className="flex items-center justify-center flex-wrap">
                  <div
                    className="flex items-center"
                    onClick={() => {
                      openUrl(liquidity_link);
                    }}
                  >
                    <span className="underline ml-1 mr-0.5">
                      <FormattedMessage id="new_farm_2" />
                    </span>
                    <LinkArrowIcon className="cursor-pointer mr-0.5"></LinkArrowIcon>
                  </div>
                  <FormattedMessage id="is_coming" />,
                  <FormattedMessage id="est_apr_is" />
                  <span className="gotham_bold ml-1">{liquidity_your_apr}</span>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div> */}
      {showRemoveBox ? (
        <RemovePoolV3
          isOpen={showRemoveBox}
          onRequestClose={() => {
            setShowRemoveBox(false);
          }}
          listLiquidities={liquidities_list}
          tokenMetadata_x_y={tokenMetadata_x_y}
          poolDetail={poolDetail}
          tokenPriceList={tokenPriceList}
          userLiquidity={list_liquidities[0]}
          style={{
            overlay: {
              backdropFilter: 'blur(15px)',
              WebkitBackdropFilter: 'blur(15px)',
            },
            content: {
              outline: 'none',
              transform: 'translate(-50%, -50%)',
            },
          }}
        ></RemovePoolV3>
      ) : null}
      {/* <AddPoolV3
        isOpen={showAddBox}
        onRequestClose={() => {
          setShowAddBox(false);
        }}
        tokenMetadata_x_y={tokenMetadata_x_y}
        poolDetail={poolDetail}
        tokenPriceList={tokenPriceList}
        userLiquidity={liquidityDetail}
        style={{
          overlay: {
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
          },
          content: {
            outline: 'none',
            transform: 'translate(-50%, -50%)',
          },
        }}
      ></AddPoolV3> */}
    </div>
  );
}

function UserLiquidityLineStyle2() {
  const {
    getLpt_id,
    goPoolDetailPage,
    tokenMetadata_x_y,
    fee,
    liquidity_link,
    is_in_farming,
    getRate,
    rate_need_to_reverse_display,
    getRateMapTokens,
    isInrange,
    your_liquidity,
    getTokenFeeAmount,
    go_farm,
  } = useContext(LiquidityContext);
  const [switch_off, set_switch_off] = useState<boolean>(true);

  function getUsageDiv() {
    let div;
    if (is_in_farming) {
      div = (
        <div className="flex items-center text-sm text-white">
          <FormattedMessage id="staked_in_farm" />{' '}
          <LinkIcon
            onClick={(e: any) => {
              e.stopPropagation();
              go_farm();
            }}
            className="text-primaryText hover:text-white cursor-pointer ml-1.5"
          ></LinkIcon>
        </div>
      );
    } else if (liquidity_link) {
      div = (
        <div className="flex items-center text-sm text-white">
          <FormattedMessage id="unstaked" />
          <LinkIcon
            onClick={(e: any) => {
              e.stopPropagation();
              openUrl(liquidity_link);
            }}
            className="text-primaryText hover:text-white cursor-pointer ml-1.5"
          ></LinkIcon>
        </div>
      );
    } else {
      div = (
        <span className="text-sm text-white">
          <FormattedMessage id="holding" />
        </span>
      );
    }
    return div;
  }
  return (
    <>
      {is_mobile ? (
        <UserLiquidityLineStyle2Mobile
          switch_off={switch_off}
          set_switch_off={set_switch_off}
          getUsageDiv={getUsageDiv}
        ></UserLiquidityLineStyle2Mobile>
      ) : (
        <UserLiquidityLineStyle2Pc
          switch_off={switch_off}
          set_switch_off={set_switch_off}
          getUsageDiv={getUsageDiv}
        ></UserLiquidityLineStyle2Pc>
      )}
    </>
  );
}
function UserLiquidityLineStyle2Mobile({
  switch_off,
  set_switch_off,
  getUsageDiv,
}: {
  switch_off: boolean;
  set_switch_off: any;
  getUsageDiv: any;
}) {
  const {
    getLpt_id,
    goYourLiquidityDetailPage,
    goPoolDetailPage,
    tokenMetadata_x_y,
    fee,
    getRate,
    rate_need_to_reverse_display,
    getRateMapTokens,
    isInrange,
    your_liquidity,
    getTokenFeeAmount,
  } = useContext(LiquidityContext);
  const tokens = sort_tokens_by_base(tokenMetadata_x_y);
  return (
    <div
      className={`rounded-xl mb-3 mx-4 ${
        switch_off
          ? 'bg-portfolioBgColor'
          : 'border border-border_light_grey_color bg-portfolioBarBgColor'
      }`}
    >
      <div className="flex flex-col justify-between h-20 p-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center flex-shrink-0 mr-1.5">
              <img
                src={tokens[0]?.icon}
                className="w-6 h-6 border border-greenColor rounded-full"
              ></img>
              <img
                src={tokens[1]?.icon}
                className="relative -ml-1.5 w-6 h-6 border border-greenColor rounded-full"
              ></img>
            </div>
            <span className="text-white font-bold text-sm gotham_bold whitespace-nowrap">
              {tokens[0]?.['symbol']}-{tokens[1]?.['symbol']}
            </span>
          </div>
          <span className="text-white text-sm gotham_bold">
            ${your_liquidity || '-'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span
              onClick={() => {
                goYourLiquidityDetailPage('new window');
              }}
              className="flex items-center bg-portfolioRainbowColor rounded-md gotham_bold text-xs text-white cursor-pointer px-1.5 py-0.5"
            >
              NFT #{getLpt_id()} <LinkIcon className="ml-1"></LinkIcon>
            </span>
            <span
              onClick={() => {
                goPoolDetailPage();
              }}
              className="flex items-center justify-center text-xs text-v3SwapGray bg-selectTokenV3BgColor rounded-md cursor-pointer whitespace-nowrap py-0.5 px-1.5 ml-1.5"
            >
              DCL<LinkIcon className="ml-1 flex-shrink-0"></LinkIcon>
            </span>
          </div>
          <div className="flex items-center">
            <WaterDropIcon></WaterDropIcon>
            <span className="text-xs text-portfolioGreenColor gotham_bold px-1.5">
              {getTokenFeeAmount('p')}
            </span>
            <UpDownButton
              set_switch_off={() => {
                set_switch_off(!switch_off);
              }}
              switch_off={switch_off}
            ></UpDownButton>
          </div>
        </div>
      </div>

      <div
        className={`px-2.5 py-4 border-t border-limitOrderFeeTiersBorderColor ${
          switch_off ? 'hidden' : ''
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-v3SwapGray whitespace-nowrap">
            <FormattedMessage id="your_liquidity" />
          </span>
          <span className="text-sm text-white whitespace-nowrap">
            ${your_liquidity || '-'}
          </span>
        </div>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center">
            <span className="text-sm text-v3SwapGray whitespace-nowrap">
              <FormattedMessage id="price_range" />
            </span>
            <div className="flex items-center justify-center bg-selectTokenV3BgColor rounded-md px-1.5 h-5 py-0.5 ml-1.5">
              <span
                className={`flex-shrink-0 w-1.5 h-1.5 rounded-full mr-1.5 ${
                  isInrange ? 'bg-gradientFromHover' : 'bg-v3GarkWarningColor'
                }`}
              ></span>
              <span
                className={`whitespace-nowrap text-xs ${
                  isInrange
                    ? 'text-gradientFromHover'
                    : 'text-v3GarkWarningColor'
                }`}
              >
                {isInrange ? (
                  <FormattedMessage id="in_range"></FormattedMessage>
                ) : (
                  <FormattedMessage id="out_of_range"></FormattedMessage>
                )}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end  text-sm text-white">
            <span className="text-sm text-white whitespace-nowrap">
              {getRate(rate_need_to_reverse_display ? 'right' : 'left')} -{' '}
              {getRate(rate_need_to_reverse_display ? 'left' : 'right')}
            </span>
            <span className="text-xs text-v3SwapGray whitespace-nowrap mt-0.5">
              {getRateMapTokens()}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-v3SwapGray">
            <FormattedMessage id="usage" />
          </span>
          {getUsageDiv()}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-v3SwapGray whitespace-nowrap mr-3">
            <FormattedMessage id="unclaimed_fees" />
          </span>
          <div className="flex items-center flex-wrap">
            <img
              src={tokenMetadata_x_y && tokenMetadata_x_y[0].icon}
              className="w-5 h-5 border border-greenColor rounded-full mr-1.5"
            ></img>
            <span className="text-sm text-white mr-4">
              {getTokenFeeAmount('l') || '-'}
            </span>
            <img
              src={tokenMetadata_x_y && tokenMetadata_x_y[1].icon}
              className="w-5 h-5 border border-greenColor rounded-full mr-1.5"
            ></img>
            <span className="text-sm text-white">
              {getTokenFeeAmount('r') || '-'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
function UserLiquidityLineStyle2Pc({
  switch_off,
  set_switch_off,
  getUsageDiv,
}: {
  switch_off: boolean;
  set_switch_off: any;
  getUsageDiv: any;
}) {
  const {
    getLpt_id,
    goYourLiquidityDetailPage,
    goPoolDetailPage,
    tokenMetadata_x_y,
    fee,
    getRate,
    rate_need_to_reverse_display,
    getRateMapTokens,
    isInrange,
    your_liquidity,
    getTokenFeeAmount,
  } = useContext(LiquidityContext);
  const tokens = sort_tokens_by_base(tokenMetadata_x_y);
  return (
    <div
      className={`rounded-xl mt-3 bg-portfolioBgColor px-5 ${
        switch_off ? '' : 'pb-4'
      }`}
    >
      <div className="flex items-center justify-between h-14">
        <div className="flex items-center">
          <div className="flex items-center flex-shrink-0 mr-2.5">
            <img
              src={tokens[0]?.icon}
              className="w-7 h-7 border border-greenColor rounded-full"
            ></img>
            <img
              src={tokens[1]?.icon}
              className="relative -ml-1.5 w-7 h-7 border border-greenColor rounded-full"
            ></img>
          </div>
          <span className="text-white font-bold text-sm gotham_bold">
            {tokens[0]?.['symbol']}-{tokens[1]?.['symbol']}
          </span>
          <span className="flex items-center justify-center text-xs text-v3SwapGray bg-portfolioFeeBgColor rounded-md px-1.5 mx-1.5 py-0.5">
            {+fee / 10000}%
          </span>
          <span
            onClick={() => {
              goPoolDetailPage();
            }}
            className="flex items-center justify-center text-xs text-v3SwapGray bg-selectTokenV3BgColor rounded-md px-1.5 cursor-pointer hover:text-white  py-0.5  mr-1.5"
          >
            <FormattedMessage id="dcl_pool" />{' '}
            <LinkIcon className="ml-1"></LinkIcon>
          </span>
          <span
            onClick={() => {
              goYourLiquidityDetailPage('new window');
            }}
            className="flex items-center bg-portfolioRainbowColor rounded-md gotham_bold text-xs text-white cursor-pointer px-1.5 py-0.5"
          >
            NFT #{getLpt_id()} <LinkIcon className="ml-1"></LinkIcon>
          </span>
        </div>
        <div className="flex items-center">
          <div className="flex flex-col items-end mr-5">
            <span className="text-white text-sm gotham_bold">
              ${your_liquidity || '-'}
            </span>
            <div className="flex items-center">
              <WaterDropIcon className="m-1.5"></WaterDropIcon>
              <span className="text-xs text-portfolioGreenColor gotham_bold">
                {getTokenFeeAmount('p')}
              </span>
            </div>
          </div>
          <UpDownButton
            set_switch_off={() => {
              set_switch_off(!switch_off);
            }}
            switch_off={switch_off}
          ></UpDownButton>
        </div>
      </div>
      <div className={`${switch_off ? 'hidden' : ''}`}>
        <div className="flex items-center justify-between"></div>
        <div className="bg-primaryText rounded-xl px-3.5 py-5 bg-opacity-10 mt-3">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-v3SwapGray">
              <FormattedMessage id="your_liquidity_usd_value" />
            </span>
            <span className="text-sm text-white">${your_liquidity || '-'}</span>
          </div>
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-v3SwapGray">
              <FormattedMessage id="price_range" />
            </span>
            <div className="flex items-center text-sm text-white">
              <div className="flex items-center justify-center bg-selectTokenV3BgColor rounded-md px-3 h-5 py-0.5">
                <span
                  className={`flex-shrink-0 w-1.5 h-1.5 rounded-full mr-1.5 ${
                    isInrange ? 'bg-gradientFromHover' : 'bg-v3GarkWarningColor'
                  }`}
                ></span>
                <span
                  className={`whitespace-nowrap text-xs ${
                    isInrange
                      ? 'text-gradientFromHover'
                      : 'text-v3GarkWarningColor'
                  }`}
                >
                  {isInrange ? (
                    <FormattedMessage id="in_range"></FormattedMessage>
                  ) : (
                    <FormattedMessage id="out_of_range"></FormattedMessage>
                  )}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-white ml-3 mr-1.5">
                  {getRate(rate_need_to_reverse_display ? 'right' : 'left')} -{' '}
                  {getRate(rate_need_to_reverse_display ? 'left' : 'right')}
                </span>
                <span className="text-xs text-v3SwapGray">
                  {getRateMapTokens()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-v3SwapGray">
              <FormattedMessage id="usage" />
            </span>
            {getUsageDiv()}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-v3SwapGray">
              <FormattedMessage id="unclaimed_fees" />
            </span>
            <div className="flex items-center">
              <img
                src={tokenMetadata_x_y && tokenMetadata_x_y[0].icon}
                className="w-5 h-5 border border-greenColor rounded-full mr-1.5"
              ></img>
              <span className="text-sm text-white mr-5 gotham_bold">
                {getTokenFeeAmount('l') || '-'}
              </span>
              <img
                src={tokenMetadata_x_y && tokenMetadata_x_y[1].icon}
                className="w-5 h-5 border border-greenColor rounded-full mr-1.5"
              ></img>
              <span className="text-sm text-white gotham_bold">
                {getTokenFeeAmount('r') || '-'}
              </span>
              <span className="tex-sm text-portfolioQinColor pl-3.5 border-l border-orderTypeBg ml-3.5">
                {getTokenFeeAmount('p')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
