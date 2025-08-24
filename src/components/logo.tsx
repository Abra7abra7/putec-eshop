import Link from 'next/link';

export function Logo() {
  return (
    <Link href='/' className='inline-block'>
      <svg width='200' height='50' viewBox='0 0 200 50' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <text
          x='50%'
          y='50%'
          dominantBaseline='middle'
          textAnchor='middle'
          fontFamily='Garamond, serif'
          fontSize='28'
          fill='white'
          fontStyle='italic'
        >
          Pútec
        </text>
      </svg>
    </Link>
  );
}

