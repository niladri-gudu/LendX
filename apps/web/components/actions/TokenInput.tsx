"use client";

export default function TokenInput({
  value,
  setValue,
  symbol,
}: {
  value: string;
  setValue: (v: string) => void;
  symbol: string;
}) {
  return (
    <div className="flex items-center justify-between bg-zinc-800 rounded-xl px-4 py-3 border border-zinc-700">
      <input
        type="number"
        placeholder="0.0"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="bg-transparent outline-none text-lg w-full text-white placeholder:text-zinc-500"
      />
      <span className="text-zinc-400 font-semibold ml-2">{symbol}</span>
    </div>
  );
}
