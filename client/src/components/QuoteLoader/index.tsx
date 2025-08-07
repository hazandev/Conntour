import React from 'react';
import styles from './QuoteLoader.module.scss';

interface Quote {
  text: string;
  author: string;
}

interface QuoteLoaderProps {
  quote: Quote;
}

export const QuoteLoader: React.FC<QuoteLoaderProps> = ({ quote }) => {
  return (
    <div className={styles.quoteLoader}>
      <blockquote className={styles.quote}>
        <p className={styles.quoteText}>"{quote.text}"</p>
        <cite className={styles.quoteAuthor}>– {quote.author}</cite>
      </blockquote>
    </div>
  );
};
