import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.min.css';
import SwiperCore, { Autoplay } from 'swiper';
import { isMobile } from '../../utils/device';
import { SwiperCloseButton } from '../../components/icon/Common';
import PerpMobilePNG from '../../assets/imgs/PerpMobile.png';
import PerpPNG from '../../assets/imgs/Perp.png';
import StablePoolPNG from '../../assets/imgs/StablePool.png';
import StablePoolMobilePNG from '../../assets/imgs/StablePoolMobile.png';

SwiperCore.use([Autoplay]);

export default function AdSwiper() {
  const [closeStatus, setCloseStatus] = useState(true);
  useEffect(() => {
    const popupSwiper = localStorage.getItem('ad-announcement');
    if (popupSwiper == '4') {
      setCloseStatus(true);
    } else {
      setCloseStatus(false);
    }
  }, []);
  const closePop = (e: any) => {
    localStorage.setItem('ad-announcement', '4');
    e.stopPropagation();
    setCloseStatus(true);
  };
  const is_mobile = isMobile();
  return (
    <>
      {closeStatus ? null : (
        <div>
          <Swiper
            spaceBetween={30}
            centeredSlides={true}
            autoHeight={false}
            autoplay={{
              delay: 10000,
              disableOnInteraction: false,
            }}
            loop={true}
          >
            <SwiperSlide>
              <div
                onClick={closePop}
                className="flex justify-end items-center absolute top-0 right-0 cursor-pointer z-10"
              >
                <SwiperCloseButton className="cursor-pointer"></SwiperCloseButton>
              </div>
              <div
                className="relative cursor-pointer"
                onClick={() => {
                  window.open('/orderbook/perps');
                }}
              >
                {is_mobile ? <PerpMobile /> : <Perp />}
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div
                onClick={closePop}
                className="flex justify-end items-center absolute top-0 right-0 cursor-pointer z-10"
              >
                <SwiperCloseButton className="cursor-pointer"></SwiperCloseButton>
              </div>
              <div
                className="relative cursor-pointer"
                onClick={() => {
                  window.open('/v2farms/4179-r');
                }}
              >
                {is_mobile ? <StablePoolMobile /> : <StablePool />}
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      )}
    </>
  );
}

const Perp = () => {
  return <img src={PerpPNG} alt={""}/>;
};
const PerpMobile = () => {
  return <img src={PerpMobilePNG} alt={""}/>;
};
const StablePool = () => {
  return <img src={StablePoolPNG} alt={""}/>;
};
const StablePoolMobile = () => {
  return <img src={StablePoolMobilePNG} alt={""}/>;
};