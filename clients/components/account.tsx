import { useAccount, useDisconnect } from "wagmi";

export function Account() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <div
      className="text-black text-[18px] bg-white font-medium px-3 py-1.5 border border-orange-100 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-100 inline-block cursor-pointer"
      onClick={() => disconnect()}
    >
      {address && (
        <div className="">
          <div>
            <span className="sm:hidden">🍙</span>
            <span className="hidden sm:inline">
              🍙 {address.slice(0, 4)}...
              {address.slice(address.length - 4, address.length)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
