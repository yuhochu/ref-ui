import React from 'react';
import DotTopAreaPNG from '../../assets/imgs/DotTopArea.png';
import DotBottomAreaPNG from '../../assets/imgs/DotBottomArea.png';

import PortfolioREFIconSvg from '../../assets/svg/PortfolioREFIcon.svg';
import MenuREFIconSvg from '../../assets/svg/MenuREFIcon.svg';
import WaterDropIconSvg from '../../assets/svg/WaterDropIcon.svg';
import PortfolioPurpleCircleIconSvg from '../../assets/svg/PortfolioPurpleCircleIcon.svg';
import FarmMiningIconSvg from '../../assets/svg/FarmMiningIcon.svg';
import AuroraIconSvg from '../../assets/svg/AuroraIcon.svg';
import AuroraIconActiveSvg from '../../assets/svg/AuroraIconActive.svg';
import TriangleGreyIconSvg from '../../assets/svg/TriangleGreyIcon.svg';
import PortfolioLinkIconSvg from '../../assets/svg/PortfolioLinkIcon.svg';
import CopyIconSvg from '../../assets/svg/CopyIcon.svg';
import TriangleIconSvg from '../../assets/svg/TriangleIcon.svg';
import MenuBurrowIconSvg from '../../assets/svg/MenuBurrowIcon.svg';
import ArrowRightForOrderSvg from '../../assets/svg/ArrowRightForOrder.svg';
import ArrowRIconSvg from '../../assets/svg/ArrowRIcon.svg';
import PositionsIconSvg from '../../assets/svg/PositionsIcon.svg';
import GreenCircleIconSvg from '../../assets/svg/GreenCircleIcon.svg';
import RefMIconSvg from '../../assets/svg/RefMIcon.svg';
import OrderlyMIconSvg from '../../assets/svg/OrderlyMIcon.svg';
import OverviewMIconSvg from '../../assets/svg/OverviewMIcon.svg';
import PortfolioOverviewIconSvg from '../../assets/svg/PortfolioOverviewIcon.svg';
import ArrowUpIconSvg from '../../assets/svg/ArrowUpIcon.svg';
import BurrowMIconSvg from '../../assets/svg/BurrowMIcon.svg';
import OverviewMenuIconSvg from '../../assets/svg/OverviewMenuIcon.svg';
import TokenIconSvg from '../../assets/svg/TokenIcon.svg';

export const MenuREFIcon = (props: any) => {
  return <span {...props}><MenuREFIconSvg /></span>;
};
export const MenuBurrowIcon = (props: any) => {
  return <span {...props}><MenuBurrowIconSvg /></span>;
};
export const REFIcon = (props: any) => {
  return <span {...props}><PortfolioREFIconSvg /></span>;
};
export const TriangleIcon = (props: any) => {
  return <span {...props}><TriangleIconSvg /></span>;
};
export const LinkIcon = (props: any) => {
  return <span {...props}><PortfolioLinkIconSvg /></span>;
};
export const WaterDropIcon = (props: any) => {
  return <span {...props}><WaterDropIconSvg /></span>;
};
export const FarmMiningIcon = (props: any) => {
  return <span {...props}><FarmMiningIconSvg /></span>;
};
export const PurpleCircleIcon = (props: any) => {
  return <span {...props}><PortfolioPurpleCircleIconSvg /></span>;
};
export const ArrowRIcon = (props: any) => {
  return <span {...props}><ArrowRIconSvg /></span>;
};
export const AuroraIcon = (props: any) => {
  return <span {...props}><AuroraIconSvg /></span>;
};
export const AuroraIconActive = (props: any) => {
  return <span {...props}><AuroraIconActiveSvg /></span>;
};
export const TriangleGreyIcon = (props: any) => {
  return <span {...props}><TriangleGreyIconSvg /></span>;
};
export const CopyIcon = (props: any) => {
  return <span {...props}><CopyIconSvg /></span>;
};
export const OverviewIcon = (props: any) => {
  return <span {...props}><PortfolioOverviewIconSvg /></span>;
};
export const PositionsIcon = (props: any) => {
  return <span {...props}><PositionsIconSvg /></span>;
};
export const TokenIcon = (props: any) => {
  return <span {...props}><TokenIconSvg /></span>;
};
export const ArrowRightForOrder = (props: any) => {
  return <span {...props}><ArrowRightForOrderSvg /></span>;
};
export const GreenCircleIcon = (props: any) => {
  return <span {...props}><GreenCircleIconSvg /></span>;
};
export const ArrowUpIcon = (props: any) => {
  return <span {...props}><ArrowUpIconSvg /></span>;
};
export const OverviewMIcon = (props: any) => {
  return <span {...props}><OverviewMIconSvg /></span>;
};
export const RefMIcon = (props: any) => {
  return <span {...props}><RefMIconSvg /></span>;
};
export const OrderlyMIcon = () => {
  return <OrderlyMIconSvg />;
};
export const BurrowMIcon = (props: any) => {
  return <span {...props}><BurrowMIconSvg /></span>;
};
export const OverviewMenuIcon = () => {
  return <OverviewMenuIconSvg />;
};

export function MenuOrderlyIcon(props: any) {
  return (
    <svg
      {...props}
      width="19"
      height="19"
      viewBox="0 0 19 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity={props.activeMenu ? 1 : 0.5}>
        <circle cx="9.23804" cy="9.23804" r="9.23804" fill="#4627FF" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M15.3788 11.0289C14.6043 13.6894 12.1479 15.6335 9.23736 15.6335C6.32686 15.6335 3.87045 13.6894 3.09593 11.0289H7.06726C7.58341 11.6539 8.36423 12.0522 9.23808 12.0522C10.1119 12.0522 10.8927 11.6539 11.4089 11.0289H15.3788ZM15.505 10.5172H11.7453C11.9415 10.1335 12.0521 9.69871 12.0521 9.23811C12.0521 8.77752 11.9415 8.34277 11.7453 7.959H15.505C15.5889 8.37225 15.6329 8.79997 15.6329 9.23797C15.6329 9.67608 15.5889 10.1039 15.505 10.5172ZM6.73087 10.5172C6.53469 10.1335 6.42403 9.69871 6.42403 9.23811C6.42403 8.77752 6.53468 8.34277 6.73086 7.959H2.9697C2.88583 8.37225 2.8418 8.79997 2.8418 9.23797C2.8418 9.67608 2.88585 10.1039 2.96976 10.5172H6.73087ZM4.12034 5.40077C3.66412 6.00818 3.31353 6.69947 3.09585 7.44736H7.06725C7.58339 6.82238 8.36422 6.42406 9.23808 6.42406C10.1119 6.42406 10.8928 6.82238 11.4089 7.44736H15.3789C15.1612 6.69947 14.8106 6.00818 14.3544 5.40077H4.12034ZM13.9268 4.88912H4.54789C5.7159 3.63022 7.38463 2.84241 9.23736 2.84241C11.0901 2.84241 12.7588 3.63022 13.9268 4.88912Z"
          fill="white"
        />
      </g>
    </svg>
  );
}

export function WavyLine(props: any) {
  const random = Math.random();
  return (
    <svg
      {...props}
      width="395"
      height="78"
      viewBox="0 0 395 78"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.1"
        d="M-9.99999 40.3478C-5.61627 49.0338 9.72672 66.4058 36.029 66.4058C68.9068 66.4058 82.058 8 128.087 8C174.116 8 177.404 70 220.145 70C262.886 70 266.174 8 308.915 8C351.656 8 352.478 66.4058 387 66.4058"
        stroke={`url(#paint0_linear_4224_480_${random})`}
        stroke-width="16"
        stroke-linecap="round"
      />
      <defs>
        <linearGradient
          id={`paint0_linear_4224_480_${random}`}
          x1="397.691"
          y1="70"
          x2="113.305"
          y2="70"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#00FFD1" stop-opacity="0" />
          <stop offset="1" stop-color="#5B40FF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function CircleBg(props: any) {
  const random = Math.random();
  return (
    <svg
      {...props}
      width="93"
      height="71"
      viewBox="0 0 93 71"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        opacity="0.1"
        cx="55.917"
        cy="14.917"
        r="47.3175"
        transform="rotate(45 55.917 14.917)"
        fill={`url(#paint0_linear_4224_479_${random})`}
        stroke={`url(#paint1_linear_4224_479_${random})`}
        stroke-width="16"
        stroke-linecap="round"
      />
      <defs>
        <linearGradient
          id={`paint0_linear_4224_479_${random}`}
          x1="55.917"
          y1="-32.4005"
          x2="55.917"
          y2="62.2345"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#26343E" />
          <stop offset="1" stop-color="#1D2932" />
        </linearGradient>
        <linearGradient
          id={`paint1_linear_4224_479_${random}`}
          x1="6.05101"
          y1="62.2345"
          x2="73.8416"
          y2="62.2345"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#00FFD1" />
          <stop offset="1" stop-color="#5B40FF" />
        </linearGradient>
      </defs>
    </svg>
  );
}
export function DotTopArea(props: any) {
  return (
    <img
      {...props}
      src={DotTopAreaPNG}
    ></img>
  );
}
export function DotBottomArea(props: any) {
  return (
    <img
      {...props}
      src={DotBottomAreaPNG}
    ></img>
  );
}