import React from 'react';
import RefIconNewSvg from '../../assets/svg/RefIconNew.svg';
import OrderlyActionsSvg from '../../assets/svg/OrderlyActions.svg';
import FlashActionSvg from '../../assets/svg/FlashAction.svg';
import RefSwapProSvg from '../../assets/svg/RefSwapPro.svg';
import TriAndAuroraSvg from '../../assets/svg/TriAndAurora.svg';
import TriAndAuroraLedgerSvg from '../../assets/svg/TriAndAuroraLedger.svg';
import OrderlyOrderBookIconMobilePNG from '../../assets/imgs/OrderlyOrderBookIconMobile.png';
import OrderlyOrderBookIconPNG from "../../assets/imgs/OrderlyOrderBookIcon.png"

export const RefSwapPro = () => {
  return <RefSwapProSvg className='ml-1' />;
};
export const TriAndAurora = () => {
  return <TriAndAuroraSvg />;
};
export const TriAndAuroraLedger = () => {
  return <TriAndAuroraLedgerSvg />;
};
export const RefIconNew = () => {
  return <RefIconNewSvg />;
};
export const OrderlyActions = () => {
  return <OrderlyActionsSvg />;
};
export const FlashAction = () => {
  return <FlashActionSvg />;
};
export const OrderlyOrderBookIconMobile = () => {
  return <OrderlyOrderBookIconMobilePNG />;
};

export const AuroraIcon = (props: { hover?: boolean }) => {
  const { hover } = props;

  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.98874 1.63025C5.10427 -0.543412 8.2113 -0.54342 9.32683 1.63025L12.9806 8.74989C14.0052 10.7463 12.5555 13.1196 10.3116 13.1196H3.00398C0.760041 13.1196 -0.689604 10.7463 0.33494 8.74989L3.98874 1.63025ZM7.54747 2.54341C7.17563 1.81886 6.13995 1.81886 5.7681 2.54342L2.1143 9.66306C1.77278 10.3285 2.256 11.1196 3.00398 11.1196H10.3116C11.0596 11.1196 11.5428 10.3285 11.2013 9.66306L7.54747 2.54341Z"
        fill={hover ? 'white' : '#70D44B'}
      />
    </svg>
  );
};

export const ConnectDot = () => {
  return (
    <div
      className="rounded-full bg-dotColor block mx-px z-20"
      style={{
        height: '3px',
        width: '3px',
      }}
    ></div>
  );
};

export const HasBalance = ({ hover }: { hover?: boolean }) => {
  return (
    <div
      className={`rounded-full ml-2 ${
        hover ? 'bg-white' : 'bg-auroraGreen'
      } w-2 h-2`}
    ></div>
  );
};

export const CopyIcon = ({
  hover,
  fillColor,
}: {
  hover?: boolean;
  fillColor?: string;
}) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.1785 12.1904C10.844 12.1904 10.5734 12.4613 10.5734 12.7955V13.2691C10.5734 13.5563 10.34 13.7899 10.0528 13.7899H2.75474C2.46756 13.7899 2.23358 13.5562 2.23358 13.2691V5.97096C2.23358 5.68378 2.46758 5.45039 2.75474 5.45039H3.17487C3.50932 5.45039 3.77995 5.17947 3.77995 4.84531C3.77995 4.51115 3.50932 4.24023 3.17487 4.24023H2.75474C1.79985 4.24023 1.02344 5.01667 1.02344 5.97095V13.2691C1.02344 14.2236 1.79987 15.0001 2.75474 15.0001H10.0528C11.0071 15.0001 11.7836 14.2236 11.7836 13.2691V12.7955C11.7836 12.4613 11.5129 12.1904 11.1785 12.1904Z"
        fill={fillColor || '#00C6A2'}
        opacity={hover ? '0.4' : '1'}
      />
      <path
        d="M13.1607 1H6.03104C5.03007 1 4.21582 1.81425 4.21582 2.81522V9.94463C4.21582 10.9456 5.03007 11.7598 6.03104 11.7598H13.1607C14.1617 11.7598 14.9759 10.9456 14.9759 9.94463V2.81522C14.9759 1.81425 14.1617 1 13.1607 1ZM13.7658 9.94463C13.7658 10.2782 13.4946 10.5497 13.1607 10.5497H6.03104C5.69718 10.5497 5.42596 10.2782 5.42596 9.94463V2.81522C5.42596 2.48165 5.69718 2.21014 6.03104 2.21014H13.1607C13.4946 2.21014 13.7658 2.48165 13.7658 2.81522V9.94463Z"
        fill={fillColor || '#00C6A2'}
        opacity={hover ? '0.4' : '1'}
      />
    </svg>
  );
};

export const CrossBrigdeOff = () => {
  return (
    <>
      <div
        className="absolute"
        style={{
          left: '-5px',
          top: '-1px',
          zIndex: '30',
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_d_2_1235)">
            <circle cx="10" cy="10" r="4" fill="#73818B" />
          </g>
          <defs>
            <filter
              id="filter0_d_2_1235"
              x="0"
              y="0"
              width="20"
              height="20"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset />
              <feGaussianBlur stdDeviation="3" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.65 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_2_1235"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_2_1235"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
      </div>
      <div className="absolute">
        <svg
          width="42"
          height="12"
          viewBox="0 0 42 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 10C4.31707 7.33333 12.1951 2 21.4634 2C30.7317 2 37.374 7.33333 40 10"
            stroke="#001320"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </>
  );
};

export const CrossBridgeOn = () => {
  return (
    <>
      <div className="absolute">
        <svg
          width="42"
          height="12"
          viewBox="0 0 42 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 10C4.31707 7.33333 12.1951 2 21.4634 2C30.7317 2 37.374 7.33333 40 10"
            stroke="#00C6A2"
            strokeOpacity="0.3"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div
        className="absolute"
        style={{
          left: '32px',
          top: '3px',
        }}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_d_5_1656)">
            <circle cx="6" cy="6" r="4" fill="#00FFD1" />
          </g>
          <defs>
            <filter
              id="filter0_d_5_1656"
              x="0"
              y="0"
              width="12"
              height="12"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset />
              <feGaussianBlur stdDeviation="1" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 1 0 0 0 0 0.82 0 0 0 0.6 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_5_1656"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_5_1656"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
      </div>
    </>
  );
};

export const ChainNear = ({ dark }: { dark?: boolean }) => {
  return (
    <svg
      width="17"
      height="15"
      viewBox="0 0 17 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.68421 3.09557V12.0029L7.15789 8.59976L7.60526 8.99919L3.85378 14.3788C2.4599 15.6808 0 14.7999 0 12.9988V2.00114C0 0.138323 2.60392 -0.710183 3.94783 0.714704L14.3158 11.7074V3.1655L10.2895 6.20317L9.8421 5.80374L13.0329 0.782014C14.3647 -0.669256 17 0.171565 17 2.04776V12.8018C17 14.6646 14.3961 15.5131 13.0522 14.0882L2.68421 3.09557Z"
        fill={dark ? '#001320' : '#00C6A2'}
      />
    </svg>
  );
};

export const ChainAurora = ({ dark }: { dark?: boolean }) => {
  return dark ? (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.79288 1.98816C6.13329 -0.662715 9.86671 -0.662725 11.2071 1.98816L15.5975 10.6709C16.8286 13.1056 15.0867 16 12.3904 16H3.60958C0.913266 16 -0.828629 13.1056 0.402464 10.6709L4.79288 1.98816ZM9.06904 3.10181C8.62224 2.21818 7.37776 2.21818 6.93096 3.10181L2.54055 11.7845C2.13018 12.5961 2.71081 13.5609 3.60958 13.5609H12.3904C13.2892 13.5609 13.8698 12.5961 13.4595 11.7845L9.06904 3.10181Z"
        fill="#001320"
      />
    </svg>
  ) : (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_5_1658)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6.79288 3.98816C8.13329 1.33728 11.8667 1.33728 13.2071 3.98816L17.5975 12.6709C18.8286 15.1056 17.0867 18 14.3904 18H5.60958C2.91327 18 1.17137 15.1056 2.40246 12.6709L6.79288 3.98816ZM11.069 5.10181C10.6222 4.21818 9.37776 4.21818 8.93096 5.10181L4.54055 13.7845C4.13018 14.5961 4.71081 15.5609 5.60958 15.5609H14.3904C15.2892 15.5609 15.8698 14.5961 15.4595 13.7845L11.069 5.10181Z"
          fill="#00C6A2"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_5_1658"
          x="0"
          y="0"
          width="20"
          height="20"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="1" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 1 0 0 0 0 0.82 0 0 0 0.6 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_5_1658"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_5_1658"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

export const SwapCross = ({ ifCross }: { ifCross: boolean }) => {
  return (
    <div
      className="flex items-center justify-between w-28 rounded-xl bg-cardBg px-3"
      style={{
        height: '50px',
      }}
    >
      <div>{<ChainNear />}</div>
      <div className="relative right-5 bottom-2">
        {ifCross ? <CrossBridgeOn /> : <CrossBrigdeOff />}
      </div>

      <div>{<ChainAurora dark={!ifCross} />}</div>
    </div>
  );
};

export const AuroraIconWhite = (props: any) => {
  const { width, height, color } = props;
  return (
    <svg
      width={width || '22'}
      height={height || '22'}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.59021 2.73372C8.43328 -0.911234 13.5667 -0.911247 15.4098 2.73372L21.4466 14.6725C23.1394 18.0202 20.7443 22 17.0368 22H4.96318C1.25574 22 -1.13937 18.0202 0.553389 14.6725L6.59021 2.73372ZM12.4699 4.26499C11.8556 3.05 10.1444 3.05 9.53007 4.26499L3.49325 16.2037C2.929 17.3196 3.72737 18.6462 4.96318 18.6462H17.0368C18.2726 18.6462 19.071 17.3196 18.5068 16.2037L12.4699 4.26499Z"
        fill={color || 'white'}
      />
    </svg>
  );
};

export const Inch1IconAndAurora = () => {
  const Inch1 = (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      className="relative "
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <rect
        x="0.5"
        y="0.5"
        width="26.2631"
        height="26.2631"
        rx="8.5"
        fill="black"
        stroke="#566069"
      />
      <rect
        opacity="0.2"
        x="0.708496"
        y="1"
        width="25.3333"
        height="25.3333"
        rx="8"
        fill="url(#pattern0_swap_pro_aurora_inch_1)"
      />
      <defs>
        <pattern
          id="pattern0_swap_pro_aurora_inch_1"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use xlinkHref="#image0_6018_27592" transform="scale(0.0078125)" />
        </pattern>
        <image
          id="image0_6018_27592"
          width="128"
          height="128"
          xlinkHref="data:image/jpeg;base64,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"
        />
      </defs>
    </svg>
  );

  const aurora = (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      className="absolute -right-0.5 -bottom-0.5"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="9.27067"
        cy="8.97917"
        r="7.72917"
        fill="#597D40"
        stroke="#25323C"
        stroke-width="2"
      />
      <path
        opacity="0.3"
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M7.84258 6.20397C8.43948 5.15467 10.102 5.15466 10.6989 6.20397L12.654 9.64088C13.2023 10.6046 12.4266 11.7503 11.2259 11.7503H7.31564C6.11494 11.7503 5.33925 10.6046 5.88747 9.64089L7.84258 6.20397ZM9.74681 6.64479C9.54784 6.29502 8.99366 6.29502 8.79469 6.64479L6.83959 10.0817C6.65685 10.4029 6.91541 10.7849 7.31564 10.7849H11.2259C11.6261 10.7849 11.8847 10.4029 11.7019 10.0817L9.74681 6.64479Z"
        fill="white"
      />
    </svg>
  );

  return (
    <div className="relative mr-1 frcc">
      {Inch1}
      {aurora}
    </div>
  );
};

export const OrderlyOrderBookIcon = () => {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <rect
        x="0.5"
        y="0.5"
        width="26.2631"
        height="26.2631"
        rx="8.5"
        fill="url(#pattern0_orderbook_orderly)"
        stroke="#00C6A2"
      />
      <defs>
        <pattern
          id="pattern0_orderbook_orderly"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use xlinkHref="#image0_5909_14232" transform="scale(0.00195312)" />
        </pattern>
        <image
          id="image0_5909_14232"
          width="512"
          height="512"
          xlinkHref={OrderlyOrderBookIconPNG}
        />
      </defs>
    </svg>
  );
};