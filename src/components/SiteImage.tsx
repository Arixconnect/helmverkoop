import Image, {type ImageProps} from 'next/image';

export default function SiteImage({src,...props}:ImageProps) {
  const prefix=process.env.NEXT_PUBLIC_BASE_PATH || '';
  return <Image {...props} src={typeof src==='string' && src.startsWith('/') ? prefix+src : src}/>;
}
