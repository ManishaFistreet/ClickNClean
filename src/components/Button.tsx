import React from 'react';
import classNames from 'classnames';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline' | 'default';
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  className,
  children,
  ...props
}) => {
  const base =
    'font-poppins text-md font-semibold px-4 py-2 rounded-lg transition-all duration-300';

  const variants = {
    default: classNames(
      'bg-globalPrimary',
      'text-white',
      'rounded-lg shadow-md hover:shadow-lg',
      'shadow-sm hover:shadow-2xl'
    ),
    primary: classNames(
      'bg-[linear-gradient(165deg,#B6D73E,#88b448)]',
      'text-globalSecondary',
      'border-[4px] border-white',
      'shadow-[0px_5px_10px_rgba(0,0,0,0.15)]',
      'hover:brightness-105'
    ),
    secondary: classNames(
      'bg-globalAccent',
      'text-white',
      'rounded-lg shadow-md hover:shadow-lg',
      'hover:bg-globalOliveLight'
    ),
    outline: classNames(
      'border border-globalPrimary',
      'text-globalPrimary',
      'bg-transparent hover:bg-globalWhiteTexture',
      'shadow-sm hover:shadow-md'
    ),
  };

  return (
    <button
      className={classNames(base, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;