import ABIs from "../constants/abi";

export const customTokenConfig = {
  address: "0x1234567890abcdef1234567890abcdef12345678",
  abi: ABIs.CustomToken,
} as const;

export const factoryDeployConfig = {
  address: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
  abi: ABIs.FactoryDeploy,
} as const;

export const routerDeployConfig = {
  address: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
  abi: ABIs.RouterDeploy,
} as const;

export const simpleDexConfig = {
  address: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
  abi: ABIs.SimpleDex,
} as const;

export const tokenFactoryConfig = {
  address: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
  abi: ABIs.TokenFactory,
} as const;
