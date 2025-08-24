import Link from 'next/link';
import { IoMenu } from 'react-icons/io5';

import { AccountMenu } from '@/components/account-menu';
import { CartIcon } from '@/features/cart/components/cart-icon';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { getSession } from '@/features/account/controllers/get-session';

import { signOut } from './(auth)/auth-actions';

const NavLinks = () => (
  <>
    <Link href='/#produkty' className='text-white hover:text-zinc-300'>
      Produkty
    </Link>
    <Link href='/#ubytovanie' className='text-white hover:text-zinc-300'>
      Ubytovanie
    </Link>
    <Link href='/kontakt' className='text-white hover:text-zinc-300'>
      Kontakt
    </Link>
  </>
);

export async function Navigation() {
  const session = await getSession();

  return (
    <div className='flex items-center gap-6'>
      <div className='hidden lg:flex lg:items-center lg:gap-6'>
        <NavLinks />
      </div>

      <div className='flex items-center gap-4'>
        <CartIcon />
        {session ? (
          <AccountMenu signOut={signOut} />
        ) : (
          <div className='hidden items-center gap-2 lg:flex'>
            <Button variant='outline' asChild>
              <Link href='/login'>Prihlásiť sa</Link>
            </Button>
            <Button variant='sexy' asChild>
              <Link href='/signup'>Registrovať sa</Link>
            </Button>
          </div>
        )}
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
              {session ? (
                <Button
                  onClick={async () => {
                    await signOut();
                  }}
                >
                  Odhlásiť sa
                </Button>
              ) : (
                <>
                  <Button variant='outline' asChild>
                    <Link href='/login'>Prihlásiť sa</Link>
                  </Button>
                  <Button variant='sexy' asChild>
                    <Link href='/signup'>Registrovať sa</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

