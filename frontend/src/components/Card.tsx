import { useMantineTheme } from '@mantine/core';
import { ReactNode } from 'react';
import './Card.css';

interface CardProps {
  children: ReactNode;
  className?: string;
}

function Card({ children, className = '' }: CardProps) {
  const theme = useMantineTheme();
  return (
    <div
      className={`card ${className}`}
      style={{ backgroundColor: theme.colors.slate[8] }}
    >
      {children}
    </div>
  );
}

export default Card;
