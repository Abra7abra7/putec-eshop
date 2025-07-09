import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AccountPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Môj účet</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Informácie o profile</h2>
        <div className="space-y-4">
          <div>
            <p className="font-medium">Email:</p>
            <p>{user.email}</p>
          </div>
          {profile && (
            <>
              <div>
                <p className="font-medium">Meno:</p>
                <p>{profile.full_name || 'Nezadané'}</p>
              </div>
              <div>
                <p className="font-medium">Rola:</p>
                <p>{profile.role}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
