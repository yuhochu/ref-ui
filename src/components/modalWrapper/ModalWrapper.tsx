import Modal from 'react-modal';
import { isMobile } from '~utils/device';
import { Card } from '~components/card/Card';
import { CloseIcon } from '~components/icon/Actions';
import React from 'react';

export const ModalWrapper = (
  props: Modal.Props & {
    title: JSX.Element | string | null;
    customWidth?: string;
    customHeight?: string;
    overflow?: string;
  }
) => {
  const { isOpen, onRequestClose, title, customHeight, customWidth, overflow } =
    props;

  const cardWidth = isMobile() ? '90vw' : '423px';
  const cardHeight = '90vh';
  return (
    <Modal
      {...props}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        overlay: {
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          overflow: 'auto',
        },
        content: {
          outline: 'none',
          transform: 'translate(-50%, -50%)',
        },
      }}
    >
      <Card
        width="w-full"
        className="border border-gradientFrom border-opacity-50 flex overflow-y-auto overflow-x-hidden flex-col  text-white "
        style={{
          width: customWidth || cardWidth,
          maxHeight: customHeight || cardHeight,
          overflow: overflow || '',
        }}
        padding="p-6 xsm:p-4"
      >
        <div className="flex items-center justify-between">
          <span className="text-xl ">{title}</span>

          <button className="pl-2 pb-1" onClick={onRequestClose}>
            <CloseIcon width="12" height="12" />
          </button>
        </div>

        {props.children}
      </Card>
    </Modal>
  );
};
