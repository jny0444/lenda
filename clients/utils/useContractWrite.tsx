import { useWriteContract } from "wagmi";

export function useTokenFactoryCreateToken() {
    const { writeContract, isPending, error, data: addressNewToken } = useWriteContract();

    function createToken(name: string, symbol: string) {
        
    }
}