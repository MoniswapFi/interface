import {
    decodeFunctionResult,
    encodeFunctionData,
    encodePacked as viemEncodePacked,
    type Abi,
} from "viem";

export const callToBytes = (abi: Abi, functionName: string, args?: any[]) => {
    return encodeFunctionData({
        abi,
        functionName,
        args,
    });
};

export const resultFromBytes = <T>(
    abi: Abi,
    functionName: string,
    data: string,
): T => {
    return decodeFunctionResult({
        abi,
        functionName,
        data: data as `0x${string}`,
    }) as T;
};

export const encodePacked = (args: any[], values: any[]) =>
    viemEncodePacked(args, values);
