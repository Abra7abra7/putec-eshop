import Link from 'next/link';
import { IoMenu } from 'react-icons/io5';

import { CartIcon } from '@/features/cart/components/cart-icon';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const NavLinks = () => (
  <>
    <Link href='/' className='text-white hover:text-zinc-300'>
      Vína
    </Link>
    <Link href='/#degustacia' className='text-white hover:text-zinc-300'>
      Degustácie
    </Link>
    <Link href='/#ubytovanie' className='text-white hover:text-zinc-300'>
      Ubytovanie
    </Link>
  </>
);

export function Navigation() {
  return (
    <div className='flex items-center gap-6'>
      <div className='hidden lg:flex lg:items-center lg:gap-6'>
        <NavLinks />
      </div>

      <div className='flex items-center gap-4'>
        <CartIcon />
        <div className='hidden items-center gap-2 lg:flex'>
          <Button variant='outline' asChild>
            <Link href='/login'>Prihlásiť sa</Link>
          </Button>
          <Button variant='sexy' asChild>
            <Link href='/signup'>Registrovať sa</Link>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <Sheet>
        <SheetTrigger className='block lg:hidden'>
          <IoMenu size={28} />
        </SheetTrigger>
        <SheetContent className='w-full bg-black'>
          <div className='flex flex-col items-center gap-8 pt-16'>
            <NavLinks />
            <div className='mt-8 flex w-full flex-col gap-4'>
              <Button variant='outline' asChild>
                <Link href='/login'>Prihlásiť sa</Link>
              </Button>
              <Button variant='sexy' asChild>
                <Link href='/signup'>Registrovať sa</Link>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

