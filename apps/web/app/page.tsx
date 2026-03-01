import Link from "next/link";
import { ArrowRight, Shield, Lock, Layers, Globe } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center">
      <section className="relative w-full pt-24 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-600/10 blur-[120px] -z-10 rounded-full" />

        <div className="max-w-4xl mx-auto text-center px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            LendX is Live on Sepolia
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
            The Future of <br /> Decentralized Lending
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Borrow stablecoins against your ETH collateral with instant liquidity, real-time health monitoring, and fully transparent on-chain execution.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 group"
            >
              Launch Dashboard
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 rounded-xl font-bold transition-all">
              <Link
                href="https://github.com/niladri-gudu/lendx"
                target="_blank"
              >
                View Source
              </Link>
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-24 w-full border-t border-zinc-900">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Three Steps to Liquidity
          </h2>
          <p className="text-zinc-500">
            No central authority. Just math and code.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent -z-10" />

          <StepCard
            number="01"
            title="Deposit Collateral"
            desc="Connect your wallet and supply ETH. Your assets are held in a non-custodial smart contract, giving you full control over your supplied ETH."
          />
          <StepCard
            number="02"
            title="Borrow Stablecoins"
            desc="Borrow up to 80% of your collateral value instantly based on current Chainlink price feeds, maintaining a safe collateralization ratio."
          />
          <StepCard
            number="03"
            title="Manage & Repay"
            desc="Monitor your Health Factor. Repay anytime to unlock your collateral. Monitor your Health Factor in real-time to prevent liquidation."
          />
        </div>
      </section>

      <section className="w-full bg-zinc-950/50 py-24 border-y border-zinc-900">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase tracking-widest mb-6">
              Security First
            </div>
            <h2 className="text-4xl font-bold mb-6">
              Built on hardened <br /> smart contracts.
            </h2>
            <p className="text-zinc-400 mb-8 leading-relaxed">
              LendX leverages decentralized oracles and over-collateralization to maintain protocol stability. Your positions are managed by transparent smart contract logic on the Sepolia testnet.
            </p>

            <div className="space-y-4">
              <SecurityCheck text="Non-custodial: Only you control your keys" />
              <SecurityCheck text="Real-time Chainlink Price Feeds" />
              <SecurityCheck text="Automated Liquidation Logic" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4 pt-8">
              <FeatureCardSmall icon={<Lock size={20} />} title="Immutable" />
              <FeatureCardSmall icon={<Shield size={20} />} title="Audited" />
            </div>
            <div className="space-y-4">
              <FeatureCardSmall icon={<Layers size={20} />} title="Layered" />
              <FeatureCardSmall
                icon={<Globe size={20} />}
                title="Open Source"
              />
            </div>
          </div>
        </div>
      </section>

      <footer className="w-full py-20 px-6 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-left">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="text-lg font-bold tracking-tighter text-white">
                Lend<span className="text-indigo-400">X</span>
              </span>
            </div>
            <p className="text-zinc-500 text-sm max-w-xs leading-relaxed">
              An experimental DeFi lending protocol built to demonstrate smart
              contract integration and modern frontend architecture.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="flex items-center gap-6">
              <FooterLink
                href="https://github.com/niladri-gudu/lendx"
                label="GitHub"
              />
              <FooterLink href="https://x.com/dev_niladri" label="X" />
            </div>

            <div className="flex flex-col items-center md:items-end text-[11px] font-mono text-zinc-600">
              <span>BUILT BY nILADRI • 2026</span>
              <span className="flex items-center gap-1 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                DEPLOYED ON ETHEREUM SEPOLIA
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StepCard({
  number,
  title,
  desc,
}: {
  number: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-indigo-400 font-mono font-bold mb-6 relative">
        <div className="absolute inset-0 rounded-full bg-indigo-500/10 blur-md" />
        {number}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function SecurityCheck({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-zinc-300">
      <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      </div>
      {text}
    </div>
  );
}

function FeatureCardSmall({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="p-6 rounded-2xl bg-zinc-900/30 border border-white/5 flex flex-col items-center justify-center gap-3">
      <div className="text-indigo-400">{icon}</div>
      <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
        {title}
      </span>
    </div>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
    >
      {label}
    </a>
  );
}
