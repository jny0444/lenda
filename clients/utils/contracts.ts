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
  address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  abi: ABIs.TokenFactory,
} as const;
