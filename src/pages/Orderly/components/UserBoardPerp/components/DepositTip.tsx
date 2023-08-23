import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

export function DepositTip(props: {
  onClick: () => void;
  type: 'spot' | 'perp';
}) {
  const intl = useIntl();

  const { type } = props;

  return (
    <div className="text-center text-sm text-white">
      {type == 'spot' && (
        <>
          <span
            className=" cursor-pointer  hover:text-gradientFromHover underline text-white relative "
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              props.onClick();
            }}
            style={{
              textUnderlineOffset: '3px',
            }}
          >
            <FormattedMessage id="deposit" defaultMessage="Deposit" />
          </span>

          <span className={`pl-1 text-white`}>
            {props.type === 'spot' &&
              intl
                .formatMessage({
                  id: 'assets',
                  defaultMessage: 'Assets',
                })
                .toLowerCase()}
          </span>
        </>
      )}

      {type == 'perp' && (
        <span
          className="mr-1 relative cursor-pointer underline hover:text-gradientFromHover text-white"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            props.onClick();
          }}
          style={{
            textUnderlineOffset: '3px',
          }}
        >
          <span className="">
            <FormattedMessage id="deposit" defaultMessage="Deposit" />
          </span>

          <span className={` font-gothamBold`}>
            {props.type === 'perp' && ` USDC`}
          </span>
        </span>
      )}

      <span className="ml-1">
        <FormattedMessage
          id="to_begin_your_trading_journey"
          defaultMessage={'to begin your trading journey.'}
        ></FormattedMessage>
      </span>
    </div>
  );
}
