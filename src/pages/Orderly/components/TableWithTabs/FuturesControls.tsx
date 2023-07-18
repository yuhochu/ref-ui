import React , { useEffect, useState } from 'react';
import { MdArrowDropDown } from 'react-icons/md';
import { IoClose } from 'react-icons/io5';
import { useIntl } from 'react-intl';
import Modal from 'react-modal';
import { TextWrapper } from '../UserBoard';
import { usePerpData } from '../UserBoardPerp/state';
import { parseSymbol } from '../RecentTrade';

export const FutureTableFormHeaders: React.FC = () => {
  const intl = useIntl();

  const TableHeader: React.FC = ({ children }) => (
    <th className={`col-span-1 pb-2 flex items-center`}>
      <div className={`flex items-center relative text-left`}>
        <span
          className="hidden md:flex lg:flex items-center"
          style={{ color: '#7E8A93' }}
        >
          <span className={`ml-2`}>
            {children}
          </span>
        </span>
      </div>
    </th>
  )


  return (
    <>
      <TableHeader>
        {intl.formatMessage({
          id: 'qty.',
          defaultMessage: 'Qty.',
        })}
      </TableHeader>
      <TableHeader>
        {intl.formatMessage({
          id: 'price',
          defaultMessage: 'Price',
        })}
      </TableHeader>
      <TableHeader>{' '}</TableHeader>
    </>
  )
}

export const FutureTableFormCells: React.FC<{
  position_qty: number;
  closingQuantity: number;
  setClosingQuantity: (input: number) => void;
  closingPrice: number | 'Market';
  setClosingPrice: (input: number) => void;
  open: boolean;
  setOpen: (input: boolean) => void;
  handleOpenClosing: (closingQuantity: number, closingPrice: number | 'Market', row: any) => void;
  row: any,
}> = ({
  position_qty,
  closingQuantity,
  setClosingQuantity,
  closingPrice,
  setClosingPrice,
  open,
  setOpen,
  handleOpenClosing,
  row
}) => {
  const intl = useIntl();
  const [price, setPrice] = useState<number | 'Market'>('Market');

  const TableCell: React.FC = ({ children }) => (
    <td className={`col-span-1 flex items-center py-5 relative break-all`}>
      <div className={`flex items-center text-white`}>
        {children}
      </div>
    </td>
  )
  return (
    <>
      <TableCell>
        <input
          className={`px-2 text-sm ${position_qty > -1 ? 'text-buyGreen' : 'text-sellColorNew'}`}
          style={{
            borderRadius: '6px',
            border: '1px solid #1D2932',
            backgroundColor: 'rgba(0, 0, 0, 0.10)'
          }}
          type="number"
          placeholder="0.0"
          onChange={({ target }) => {
            let value: number = parseFloat(target.value);
            if (value > Math.abs(position_qty)) value = position_qty;
            if (value < 0 || !value) value = 0;
            setClosingQuantity(value)
          }}
          value={closingQuantity}
        />
      </TableCell>
      <TableCell>
        <div className="relative">
          <input
            className={`px-2 text-sm`}
            style={{
              borderRadius: '6px',
              border: '1px solid #1D2932',
              backgroundColor: 'rgba(0, 0, 0, 0.10)'
            }}
            placeholder="0.0"
            onChange={({ target }) => {
              let value: number = parseFloat(target.value);
              if (value > Math.abs(position_qty)) value = position_qty;
              if (value < 0 || !value) value = 0;
              setClosingPrice(value);
            }}
            value={price || closingPrice}
            onClick={() => {
              if (price !== 0) setPrice(0) 
              else setOpen(true)
            }}
          />
          {open && (
            <div  
              className="absolute top-full cursor-pointer px-2 text-sm"
              style={{
                borderRadius: '6px',
                border: '1px solid #1D2932',
                backgroundColor: 'rgba(0, 0, 0, 0.10)'
              }}
              onClick={() => {
                setPrice('Market');
                setOpen(false);
              }}
            >
              {intl.formatMessage({
                id: 'market',
                defaultMessage: 'Market',
              })}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div
          className="border border-orderTypeBg px-3 py-1.5 rounded-md text-primaryText cursor-pointer"
          onClick={() => handleOpenClosing(closingQuantity, closingPrice, row)}
        >
          {intl.formatMessage({
            id: 'close',
            defaultMessage: 'Close',
          })}
        </div>
      </TableCell>
    </>
  )
}

function FutureQuantityModal(
  props: Modal.Props & {
    onClose: (input: number) => void;
    quantity: number;
    position_qty: number;
  }
) {
  const { onClose, quantity, position_qty } = props;
  const intl = useIntl();
  const [inputQuantity, setInputQuantity] = useState<number>(quantity);
  
  useEffect(() => {
    setInputQuantity(quantity);
  }, [quantity])

  return (
    <Modal
      {...props}
      onRequestClose={() => onClose && onClose(quantity)}
      style={{
        content: {
          position: 'fixed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          top: 'none',
          bottom: '0px',
          left: '0px',
          transform: 'translate(-50%, -20px)',
          outline: 'none',
        }
      }}
    >
      <div
        className={`rounded-t-2xl fixed w-screen bottom-0 left-0 bg-boxBorder text-sm text-primaryOrderly`}
      >
        <div className=" py-6 text-primaryOrderly text-sm flex flex-col  lg:w-p400  lg:h-p560">
          <div className="flex px-4 items-center pb-6 justify-between">
            <span className="text-white text-base gotham_bold">
              {intl.formatMessage({ id: 'quantity' })}
            </span>

            <span
              className="cursor-pointer"
              onClick={(e: any) => {
                onClose && onClose(quantity);
              }}
            >
              <IoClose size={20} />
            </span>
          </div>
          <div className="flex px-4 items-center pb-6 justify-between">
            <input
              type="number"
              placeholder="0.0"
              value={inputQuantity}
              onChange={({ target }) => {
                let value: number = parseFloat(target.value);
                if (value > Math.abs(position_qty)) value = position_qty;
                if (value < 0 || !value) value = 0;
                setInputQuantity(value)
              }}
              className="text-white text-xl leading-tight px-2.5 pb-2 w-10/12 mr-2"
              style={{ borderBottomColor: '#FFFFFF1A', borderBottomWidth: 1 }}
            />
            <button
              className="text-white py-1 px-4 relative bg-buyGradientGreen rounded-lg text-white font-bold flex items-center justify-center"
              onClick={() => {
                onClose && onClose(inputQuantity);
              }}
            >
              <span>
                {intl.formatMessage({ id: 'save' })}
              </span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function FuturePriceModal(
  props: Modal.Props & {
    onClose: (input: number) => void;
    price: number;
    mark_price: number;
    priceMode: 'market_price' | 'limit_price';
    setPriceMode: (input: 'market_price' | 'limit_price') => void;
  }
) {
  const { onClose, priceMode, setPriceMode, price, mark_price } = props;
  const [inputPrice, setInputPrice] = useState<number>(price);
  const intl = useIntl();

  return (
    <Modal
      {...props}
      onRequestClose={() => onClose && onClose(price)}
      style={{
        content: {
          position: 'fixed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          top: 'none',
          bottom: '0px',
          left: '0px',
          transform: 'translate(-50%, -20px)',
          outline: 'none',
        }
      }}
    >
      <div
        className={`rounded-t-2xl fixed w-screen bottom-0 left-0 bg-boxBorder text-sm text-primaryOrderly`}
      >
        <div className=" py-6 text-primaryOrderly text-sm flex flex-col  lg:w-p400  lg:h-p560">
          <div className="flex px-4 items-center pb-6 justify-between">
            <span className="text-white text-base gotham_bold">
              {intl.formatMessage({ id: 'price' })}
            </span>

            <span
              className="cursor-pointer"
              onClick={(e: any) => {
                onClose && onClose(price);
              }}
            >
              <IoClose size={20} />
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 p-4">
            {['market_price', 'limit_price'].map((item: 'market_price' | 'limit_price') => (
              <div
                key={item}
                className={`text-center px-7 py-4 w-150 rounded-md border ${priceMode !== item ? 'text-primaryText border-orderTypeBg' : 'text-white border-mobileOrderBg bg-mobileOrderBg'}`}
                onClick={() => {
                  setInputPrice(mark_price);
                  setPriceMode(item);
                }}
              >
                {intl.formatMessage({ id: item })}
              </div>
            ))}
          </div>
          {priceMode === 'limit_price' && (
            <div className="flex px-4 items-center pb-6 justify-between">
              <input
                type="number"
                placeholder="0.0"
                value={inputPrice}
                onChange={({ target }) => setInputPrice(parseFloat(target.value))}
                className="text-white text-xl leading-tight px-2.5 pb-2 w-10/12 mr-2"
                style={{ borderBottomColor: '#FFFFFF1A', borderBottomWidth: 1 }}
                min={0}
              />
              <button
                className="text-white py-1 px-4 relative bg-buyGradientGreen rounded-lg text-white font-bold flex items-center justify-center"
                onClick={() => {
                  onClose && onClose(inputPrice);
                }}
              >
                <span>
                  {intl.formatMessage({ id: 'save' })}
                </span>
              </button>
            </div>
            )}
          </div>
      </div>
    </Modal>
  );
}


export  function ClosingModal(
  props: Modal.Props & {
    onClick: () => Promise<any>;
    row: any,
    closingPrice: number | 'Market';
    closingQuantity: number;
    marketList: { text: JSX.Element; withSymbol: JSX.Element; textId: string; }[];
  }
) {
  const {
    onRequestClose,
    onClick,
    closingPrice,
    closingQuantity,
    marketList,
    row
  } = props;

  const { symbol  } = row;

  const { symbolFrom } = parseSymbol(symbol);

  const [loading, setLoading] = useState<boolean>(false);
  
  const intl = useIntl();
  return (
    <Modal
      {...props}
      style={{
        content: {
          zIndex: 999,
        },
      }}
    >
      <div
        className={`rounded-2xl lg:w-96 xs:w-95vw border border-gradientFrom border-opacity-30 bg-boxBorder text-sm text-primaryOrderly`}
      >
        <div className="px-5 py-6 flex flex-col ">
          <div className="w-full grid grid-cols-2 gap-4">
            <div className="col-span-2 m-4">
              <div className="flex items-center justify-center text-white gotham_bold">
                {intl.formatMessage({ id: 'closing_1' })}&nbsp;
                <span className={row.position_qty < 0  ? 'text-buyGreen' : 'text-sellColorNew'}>{closingQuantity}</span>
                &nbsp;{intl.formatMessage({ id: 'closing_2' })}
              </div>
            </div>
            <div className="col-span-1 mb-3">
              <div className="flex items-center ">{marketList.find((m) => m.textId === symbol)?.text}</div>
            </div>
            <div className="col-span-1 mb-3">
              <div className="flex items-center justify-end  text-white">
                {intl.formatMessage({ id: 'market' })}
                <TextWrapper
                  className="px-2 text-sm ml-2"
                  value={intl.formatMessage({
                    id: row.position_qty < 0 ? 'buy' : 'sell',
                    defaultMessage: row.position_qty < 0 ? 'buy' : 'sell',
                  })}
                  bg={row.position_qty < 0  ? 'bg-buyGreen' : 'bg-sellRed'}
                  textC={row.position_qty < 0  ? 'text-buyGreen' : 'text-sellColorNew'}
                />
              </div>
            </div>
            <div className="col-span-1 mb-3">
              <div className="flex items-center text-white">{intl.formatMessage({ id: 'size' })}</div>
            </div>
            <div className="col-span-1 mb-3">
              <div className="flex items-center justify-end text-white">{closingPrice} {symbolFrom}</div>
            </div>
            <div className="col-span-1 mb-3">
              <div className="flex items-center text-white">{intl.formatMessage({ id: 'price' })}</div>
            </div>
            <div className="col-span-1 mb-3">
              <div className="flex items-center justify-end text-white">{closingQuantity}</div>
            </div>
            <div className="col-span-1 mb-3">
              <button
                className={`w-full rounded-lg gotham_bold ${
                  loading
                    ? 'opacity-70 cursor-not-allowed border-buttonGradientBgOpacity'
                    : ''
                } flex items-center justify-center py-1 border border-greenColor text-base text-greenColor`}
                onClick={(e: any) => {
                  e.preventDefault();
                  e.stopPropagation();
                  
                  onRequestClose && onRequestClose(e);
                }}
                disabled={loading}
              >
                {intl.formatMessage({ id: 'cancel' })}
              </button>
            </div>
            <div className="col-span-1 mb-3">
              <button
                className={`w-full rounded-lg gotham_bold ${
                  loading
                    ? 'opacity-70 cursor-not-allowed bg-buttonGradientBgOpacity'
                    : ''
                } flex items-center justify-center py-1 bg-buttonGradientBg hover:bg-buttonGradientBgOpacity text-base text-white`}
                onClick={(e: any) => {
                  e.preventDefault();
                  e.stopPropagation();

                  setLoading(true);
                  onClick().then(() => {
                    setLoading(false);
                    onRequestClose && onRequestClose(e);
                  });
                }}
                disabled={loading}
              >
                {intl.formatMessage({ id: 'Confirm' })}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

const FutureMobileRow: React.FC<{
  row: { symbol: string, position_qty:number, average_open_price: number, unsettled_pnl: number },
  marketList: { text: JSX.Element; withSymbol: JSX.Element; textId: string; }[],
  handleOpenClosing: (closingQuantity: number, closingPrice: number | 'Market', row: any) => void;
}> = ({
  row,
  marketList,
  handleOpenClosing
}) => {
  const intl = useIntl();
  const { markPrices } = usePerpData();
  const { symbol, position_qty, average_open_price, unsettled_pnl } = row;
  const [select, setSelect] = useState<any>('mark_price');
  const [showSideSelector, setShowSideSelector] = useState<boolean>(false);
  const [futureQuantityOpen, setFutureQuantityOpen] = useState<boolean>(false);
  const [futurePriceOpen, setFuturePriceOpen] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(position_qty);
  const [priceMode, setPriceMode] = useState<'market_price' | 'limit_price'>('market_price');
  const mark_price = markPrices.find((i) => i.symbol === symbol)?.price;
  const [price, setPrice] = useState<number>(mark_price);

  useEffect(() => {
    setQuantity(position_qty);
  }, [row])

  return (
    <>
      <div
        className={`w-full gap-2 rounded-xl my-3`}
        style={{ backgroundColor: '#7E8A931A' }}
      >
        <div className="w-full grid grid-cols-2 p-5">
          <div className="col-span-1 mb-3">
            <div className="flex items-center ">{marketList.find((m) => m.textId === symbol)?.withSymbol}</div>
          </div>
          <div className="col-span-1 flex justify-end items-center mb-3">
            <div
              className="cursor-pointer text-center py-1 px-3 border border-orderTypeBg rounded-md"
               onClick={() => {
                handleOpenClosing(quantity, price, row);
               }}
            >
              {intl.formatMessage({ id: 'close' })}
            </div>
          </div>
          <div className="col-span-1 my-3">
            <div className="flex items-center">
              {intl.formatMessage({ id: 'qty.' })}
              <div className="text-10px p-0.5 ml-1" style={{ borderRadius: '4px', backgroundColor: 'rgba(126, 138, 147, 0.15)' }}>USDC</div>
            </div>
            <span className="text-white">{position_qty?.toFixed(4) || '-' }</span>
          </div>
          <div className="col-span-1 my-3">
            <div>
              {intl.formatMessage({ id: 'avg_open' })}
            </div>
            <span className="text-white">{average_open_price?.toFixed(3) || '-'}</span>
          </div>
          <div className="col-span-1 my-3">
            <div
              className="relative flex items-center underline"
              style={{ textDecorationStyle: 'dashed' }}
              onClick={() => setShowSideSelector(true)}
            >
              {intl.formatMessage({ id: 'unreal_pnl' })}

              {showSideSelector && (
                <div className="absolute top-full z-50">
                  <div
                    className={`flex flex-col min-w-28 items-start py-2 px-1.5 rounded-lg border border-borderC text-sm  bg-darkBg `}
                  >
                    {['mark_price', 'last_price'].map((item, index) => {
                      return (
                        <div
                          className={`whitespace-nowrap flex items-center justify-between cursor-pointer min-w-fit my-0.5 text-left px-1 py-1 w-full rounded-md`}
                          key={item + index}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelect(item);
                            setShowSideSelector(false);
                          }}
                        >
                          <div className="mr-2 border border-baseGreen bg-symbolHover2 border-solid w-3 h-3 rounded-full">
                            {select === item && <div className="w-2 h-2 bg-baseGreen rounded-full m-px" />}
                          </div>
                          <span className="whitespace-nowrap pr-2">{intl.formatMessage({ id: item })}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <span className="text-white">{((mark_price - average_open_price) *  position_qty)?.toFixed(3) || '-' }</span>
          </div>
          <div className="col-span-1 my-3">
            <div>
              {intl.formatMessage({ id: 'fut_unsettle_pnl' })}
            </div>
            <span className="text-white">{unsettled_pnl?.toFixed(3) || '-'}</span>
          </div>
          <div className="col-span-1 my-3">
            <div className="flex items-center">
              {intl.formatMessage({ id: 'quantity' })}
            </div>
            <span
              className="text-white flex items-center cursor-pointer"
              onClick={() => setFutureQuantityOpen(true)}
            >
              {quantity}
              <MdArrowDropDown
                className="ml-0.5"
                style={{ flex: '0 0 22px' }}
                size={22}
                color={'#7E8A93'}
              />
            </span>
          </div>
          <div className="col-span-1 my-3">
            <div>
              {intl.formatMessage({ id: 'price' })}
            </div>
            <span
              className="text-white flex items-center cursor-pointer"
              onClick={() => setFuturePriceOpen(true)}
            >
              {price === mark_price ? 'Market' : price}
              <MdArrowDropDown
                className="ml-0.5"
                style={{ flex: '0 0 22px' }}
                size={22}
                color={'#7E8A93'}
              />
            </span>
          </div>
        </div>
      </div>

      <FutureQuantityModal
        isOpen={futureQuantityOpen}
        onClose={(input: number) => {
          setQuantity(input);
          setFutureQuantityOpen(false);
        }}
        position_qty={position_qty}
        quantity={quantity}
      />

      <FuturePriceModal
        isOpen={futurePriceOpen}
        onClose={(input: number) => {
          setPrice((priceMode === 'market_price') ? mark_price : input);
          
          setFuturePriceOpen(false);
        }}
        priceMode={priceMode}
        setPriceMode={setPriceMode}
        price={price}
        mark_price={mark_price}
      />
    </>
  )
}

export const FutureMobileView: React.FC<{
  rows: { symbol: string, position_qty:number, average_open_price: number, mark_price: number, unsettled_pnl: number }[],
  marketList: { text: JSX.Element; withSymbol: JSX.Element; textId: string; }[],
  handleOpenClosing: (closingQuantity: number, closingPrice: number | 'Market', row: any) => void;
}> = ({
  marketList,
  children,
  handleOpenClosing
}) => {
  const intl = useIntl();
  const {
    portfolioUnsettle,
    totalPortfoliouPnl,
    totalDailyReal,
    totalNotional,
    newPositions,
    
  } = usePerpData();

  const { rows } = newPositions

  return (
    <div className="w-full p-3">
      <div
        className={`w-full gap-2 rounded-xl my-3`}
        style={{ backgroundColor: '#7E8A931A' }}
      >
        <div className="w-full grid grid-cols-2 p-5">
          <div className="col-span-1">
            {intl.formatMessage({
              id: 'fut_unreal_pnl',
              defaultMessage: 'Fut. Unreal. PnL',
            })}
            <span className="text-buyGreen pl-2">{totalPortfoliouPnl}</span>
          </div>
          <div className="col-span-1 text-right">
            {intl.formatMessage({
              id: 'fut_daily_real',
              defaultMessage: 'Fut. Daily Real.',
            })}
            <span className="text-white pl-2">{totalDailyReal}</span>
          </div>
          <div className="col-span-2 text-right mt-2">
            {intl.formatMessage({
              id: 'fut_notional',
              defaultMessage: 'Fut. Notional',
            })}
            <span className="text-white pl-2">{totalNotional}</span>
          </div>
          <div className="h-px col-span-2 w-full border border-white opacity-10 my-2.5" />
          <div className="col-span-1 flex items-center">
            {intl.formatMessage({
              id: 'fut_unsettle_pnl',
              defaultMessage: 'Unsettle PnL',
            })}
            <span className="text-buyGreen pl-2">{portfolioUnsettle}</span>
          </div>
          <div className="col-span-1 text-right flex justify-end">
            {children}
          </div>
        </div>
      </div>
      {rows.map((row) => (
        <FutureMobileRow
          key={row.symbol}
          row={row}
          marketList={marketList}
          handleOpenClosing={handleOpenClosing}
        />
      ))}
    </div>
  )
}

export const FutureTopComponent = () => {
  const intl = useIntl();
  const {
    portfolioUnsettle,
    totalPortfoliouPnl,
    totalDailyReal,
    totalNotional
  } = usePerpData();

  return (
    <div className="w-full px-5 mb-4">
      <div className="w-full flex justify-start items-center py-3 px-5 rounded-full" style={{ backgroundColor: '#7E8A931A' }}>
        <div className="mr-5">
          {intl.formatMessage({
            id: 'fut_unreal_pnl',
            defaultMessage: 'Fut. Unreal. PnL',
          })}
          <span className="text-buyGreen pl-2">{totalPortfoliouPnl}</span>
        </div>
        <div className="mr-5">
          {intl.formatMessage({
            id: 'fut_daily_real',
            defaultMessage: 'Fut. Daily Real.',
          })}
          <span className="text-white pl-2">{totalDailyReal}</span>
        </div>
        <div className="mr-5">
          {intl.formatMessage({
            id: 'fut_notional',
            defaultMessage: 'Fut. Notional',
          })}
          <span className="text-white pl-2">{totalNotional}</span>
        </div>
        <div className="ml-auto">
          {intl.formatMessage({
            id: 'fut_unsettle_pnl',
            defaultMessage: 'Unsettle PnL',
          })}
          <span className="text-buyGreen pl-2">{portfolioUnsettle}</span>
        </div>
      </div>
    </div>
  )
}