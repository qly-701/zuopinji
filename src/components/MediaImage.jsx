import media from '../mediaSources.json';

export function mediaSource(src, usage = 'full') {
  return media[src]?.[usage] || src;
}

export default function MediaImage({ src, usage = 'card', layout, sizes, loading = 'lazy', width, height, ...props }) {
  const item = media[src];
  return <img {...props} src={item?.[usage] || src} data-source={src}
    srcSet={usage === 'full' ? undefined : usage === 'thumb' ? item?.srcSet?.split(', ').filter(part => Number(part.split(' ').at(-1).replace('w','')) <= 800).join(', ') : item?.srcSet}
    sizes={usage === 'full' ? undefined : sizes || item?.sizes?.[layout || (usage === 'thumb' ? 'reel' : usage)]}
    width={width || item?.width} height={height || item?.height}
    loading={loading} decoding="async"/>;
}
