import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import {
  Learn_more,
  CloseBtn,
  Learn_more_m,
  CloseBtn_white,
  CircleCloseBtn,
  PopupCloseButton
} from '~components/icon/Common';
import { isMobile } from '~utils/device';
import { Swiper, SwiperSlide } from 'swiper/react';
import getConfig from '../../services/config';
import 'swiper/swiper.min.css';
import SwiperCore, { Autoplay } from 'swiper';
import PNEARFarmIconPNG from '../../assets/imgs/PNEARFarmIcon.png';
import V2PoolPNG from '../../assets/imgs/V2Pool.png';

const { REF_VE_CONTRACT_ID } = getConfig();
SwiperCore.use([Autoplay]);

export default function PopUpSwiper() {
  const [closeStatus, setCloseStatus] = useState(true);
  const history = useHistory();
  useEffect(() => {
    const popupSwiper = localStorage.getItem('popup-announcement15');
    if (popupSwiper == '1') {
      setCloseStatus(true);
    } else {
      setCloseStatus(false);
    }
  }, []);
  const closePop = (e: any) => {
    localStorage.setItem('popup-announcement15', '1');
    e.stopPropagation();
    setCloseStatus(true);
  };
  const mobile = isMobile();

  return (
    <>
      {closeStatus ? null : (
        <div
          className={`fixed xs:left-1/2 xs:transform xs:-translate-x-1/2 md:left-1/2 md:transform md:-translate-x-1/2 z-50 lg:right-8 ${
            mobile ? 'farmPopupBoxMobile' : 'farmPopupBox'
          }`}
          style={{
            zIndex: 92
          }}
        >
          <Swiper
            spaceBetween={30}
            centeredSlides={true}
            autoHeight={false}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false
            }}
            loop={true}
          >
            <SwiperSlide>
              <div className='absolute bottom-1'>
                <div
                  onClick={closePop}
                  className='flex justify-end items-center absolute right-2.5 cursor-pointer'
                  style={{ bottom: '5.5rem' }}
                >
                  <PopupCloseButton className='cursor-pointer'></PopupCloseButton>
                </div>
                <V2Pool
                  className='cursor-pointer'
                  onClick={() => {
                    localStorage.setItem('REF_FI_POOL_ACTIVE_TAB_VALUE', 'v2');
                    location.href = '/pools';
                  }}
                ></V2Pool>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className='absolute bottom-1'>
                <div
                  onClick={closePop}
                  className='flex justify-end items-center absolute right-2.5 cursor-pointer'
                  style={{ bottom: '5.5rem' }}
                >
                  <PopupCloseButton className='cursor-pointer'></PopupCloseButton>
                </div>
                <PNEARFarmIcon
                  className='cursor-pointer'
                  onClick={() => {
                    location.href = '/poolV2/phoenix-bonds.near@wrap.near@2000';
                  }}
                ></PNEARFarmIcon>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      )}
    </>
  );
}

function PNEARFarmIcon(props: any) {
  return (
    <img{...props} src={PNEARFarmIconPNG} />
  );
}

function V2Pool(props: any) {
  return (
    <img {...props} src={V2PoolPNG} />
  );
}