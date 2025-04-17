import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from "wagmi";

export function Account() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });

  return (
    <div className="" onClick={() => disconnect()}>
      {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
      {address && (
        <div className="">
          {ensName
            ? `${ensName} (${address})`
            : `${address.slice(0, 4)}...${address.slice(
                address.length - 4,
                address.length
              )}`}
        </div>
      )}
    </div>
  );
}
