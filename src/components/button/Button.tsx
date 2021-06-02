import React, { HTMLAttributes } from 'react';
import { wallet, REF_FI_CONTRACT_ID } from '~services/near';
import { Near } from '~components/icon';

export function BorderButton(props: HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`rounded-full text-xs px-3 py-1.5 focus:outline-none font-semibold border border-greenLight focus:outline-none ${props.className}`}
      {...props}
    >
      {props.children}
    </button>
  );
}

export function GreenButton(
  props: HTMLAttributes<HTMLButtonElement> & { disabled?: boolean }
) {
  const { disabled } = props;
  const { className, ...propsWithoutClassName } = props;
  return (
    <button
      disabled={disabled}
      className={`rounded-full text-xs text-white px-3 py-1.5 focus:outline-none font-semibold bg-greenLight focus:outline-none ${className} ${
        disabled ? 'bg-opacity-50 disabled:cursor-not-allowed' : ''
      }`}
      {...propsWithoutClassName}
    >
      {props.children}
    </button>
  );
}

export function GrayButton(
  props: HTMLAttributes<HTMLButtonElement> & {
    disabled?: boolean;
  }
) {
  return (
    <button
      className={`inline-flex cursor-pointer font-bold items-center text-center rounded-full bg-gray-800 px-3.5 py-1 focus:outline-none ${props.className}`}
      {...props}
    >
      {props.children}
    </button>
  );
}

export function ConnectToNearBtn() {
  return (
    <div className="flex items-center justify-center pt-2">
      <GrayButton onClick={() => wallet.requestSignIn(REF_FI_CONTRACT_ID)}>
        <div className="pr-1">
          <Near />
        </div>
        <div className="text-xs text-white">Connect to NEAR</div>
      </GrayButton>
    </div>
  );
}
