import React, { ImgHTMLAttributes } from 'react';

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  webpSrc?: string;
  loading?: 'lazy' | 'eager' | 'auto';
  imgClassName?: string;
};

const LazyImage: React.FC<Props> = props => {
  const { imgClassName, webpSrc, ...imgProps } = props;

  return (
    <picture>
      {!!webpSrc ? <source srcSet={webpSrc} type="image/webp" /> : null}
      <source srcSet={imgProps.src} />
      <img className={imgClassName} {...imgProps} />
    </picture>
  );
};

export default LazyImage;
