// src/components/Button.tsx
import React from 'react';
import classNames from 'classnames';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline';
};

const Button: React.FC<ButtonProps> = ({ variant = 'primary', className, children, ...props }) => {
  const base = 'font-semibold px-4 py-2 rounded transition-colors duration-300';
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    secondary: 'bg-secondary text-white hover:bg-primary-500',
    outline: 'border border-primary-600 text-primary-700 hover:bg-primary-50',
  };

  return (
    <button className={classNames(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
};

export default Button;