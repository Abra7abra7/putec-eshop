import { Hero } from "@/components/hero";
import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/lib/utils";

export default function Home() {
  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex flex-1 flex-col gap-20 max-w-5xl px-3 py-16 lg:py-24">
        <Hero />
        <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
        <div className="flex flex-col gap-8 text-foreground">
            <h2 className="text-lg font-bold text-center">
              Všetko čo potrebuješ na štart
            </h2>
            {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
        </div>
      </div>
    </div>
  );
}
