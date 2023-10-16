import React, { useEffect, useState } from 'react';
import { isMobile } from '~utils/device';
import CloseButtonSvg from "../../assets/svg/CloseButton.svg"
import StepTwoSvg from '../../assets/svg/StepTwo.svg';
import StepOneSvg from '../../assets/svg/StepOne.svg';
import StepThreeSvg from '../../assets/svg/StepThree.svg';

export default function Guider() {
  const [currentStep, setCurrentStep] = useState(1); // 1, 2, 3
  const [guiderStatus, setGuiderStatus] = useState(
    localStorage.getItem('ref_guide_status')
  );
  const is_mobile = isMobile();
  useEffect(() => {
    if (guiderStatus != '1' && !is_mobile) {
      document.documentElement.style.overflow = 'hidden';
      document.getElementById('menu-1').style.visibility = 'hidden';
    }
  }, [guiderStatus]);
  function showStep(step: number) {
    setCurrentStep(step);
    init_menu();
    if (step == 1) {
      document.getElementById('menu-1').style.visibility = 'hidden';
    } else if (step == 2) {
      document.getElementById('menu-2').style.visibility = 'hidden';
    } else if (step == 3) {
      document.getElementById('menu-3').style.visibility = 'hidden';
    }
  }
  function closeGuider() {
    localStorage.setItem('ref_guide_status', '1');
    document.documentElement.style.overflow = 'visible';
    init_menu();
    setGuiderStatus('1');
  }
  function init_menu() {
    document.getElementById('menu-1').style.visibility = 'visible';
    document.getElementById('menu-2').style.visibility = 'visible';
    document.getElementById('menu-3').style.visibility = 'visible';
  }
  return (
    <>
      {guiderStatus == '1' || is_mobile ? null : (
        <div
          className="fixed left-0 right-0 top-0 bottom-0 bg-guideBgColor"
          style={{ zIndex: 999 }}
        >
          <div
            className={`absolute ${currentStep == 1 ? '' : 'hidden'}`}
            style={{ top: '21px', left: '122px' }}
          >
            {/* <span
              className="absolute text-sm text-black gotham_bold bottom-1 right-14 cursor-pointer"
              onClick={() => {
                showStep(2);
              }}
            >
              {'Next >'}
            </span> */}
            <StepOne></StepOne>
            <div className="flex items-center absolute right-9 -bottom-8">
              <span className="text-xs text-white">Close</span>
              <CloseButton
                className="cursor-pointer ml-2"
                onClick={closeGuider}
              ></CloseButton>
            </div>
          </div>
          <div
            className={`absolute ${currentStep == 2 ? '' : 'hidden'}`}
            style={{ top: '21px', left: '205px' }}
          >
            <div className="flex items-center absolute text-sm text-black gotham_bold bottom-6 right-16">
              <span
                className="mr-7 cursor-pointer"
                onClick={() => {
                  showStep(1);
                }}
              >
                {'< Pre'}
              </span>
              <span
                className="cursor-pointer"
                onClick={() => {
                  showStep(3);
                }}
              >
                {'Next >'}
              </span>
            </div>
            <StepTwo></StepTwo>
            <div className="flex items-center absolute right-9 -bottom-8">
              <span className="text-xs text-white">Close</span>
              <CloseButton
                className="cursor-pointer ml-2"
                onClick={closeGuider}
              ></CloseButton>
            </div>
          </div>
          <div
            className={`absolute ${currentStep == 3 ? '' : 'hidden'}`}
            style={{ top: '21px', left: '373px' }}
          >
            <div className="flex items-center absolute text-sm text-black gotham_bold bottom-4 right-16">
              <span
                className="mr-7 cursor-pointer"
                onClick={() => {
                  showStep(2);
                }}
              >
                {'< Pre'}
              </span>
              <span className="cursor-pointer" onClick={closeGuider}>
                Got it!
              </span>
            </div>
            <StepThree></StepThree>
            <div className="flex items-center absolute right-9 -bottom-8">
              <span className="text-xs text-white">Close</span>
              <CloseButton
                className="cursor-pointer ml-2"
                onClick={closeGuider}
              ></CloseButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const StepOne = (props: any) => {
  return <span {...props}><StepOneSvg /></span>;
};
const StepTwo = (props: any) => {
  return <span {...props}><StepTwoSvg /></span>;
};
const StepThree = (props: any) => {
  return <span {...props}><StepThreeSvg /></span>;
};

const CloseButton = (props: any) => {
  return <span {...props}><CloseButtonSvg /></span>;
};