import type { EnvConfig, EnvType } from '../types/app';

const ENV_CONFIGS: Record<EnvType, EnvConfig> = {
  development: {
    env: 'development',
    apiBaseUrl: 'https://www.zhaotool.com',
    cdnBaseUrl: 'https://cdn.example.com/dev',
    reportUrl: 'https://report.example.com/dev',
    debug: true,
    enableMock: false,
  },
  staging: {
    env: 'staging',
    apiBaseUrl: 'https://www.zhaotool.com',
    cdnBaseUrl: 'https://cdn.example.com/staging',
    reportUrl: 'https://report.example.com/staging',
    debug: true,
    enableMock: false,
  },
  production: {
    env: 'production',
    apiBaseUrl: 'https://www.zhaotool.com',
    cdnBaseUrl: 'https://cdn.example.com/prod',
    reportUrl: 'https://report.example.com/prod',
    debug: false,
    enableMock: false,
  },
};

function detectEnv(): EnvType {
  wx.getSystemInfoSync();
  try {
    const accountInfo = wx.getAccountInfoSync();
    if (accountInfo.miniProgram.envVersion === 'release') {
      return 'production';
    }
    if (accountInfo.miniProgram.envVersion === 'trial') {
      return 'staging';
    }
  } catch {
    // getAccountInfoSync may not be available in all environments
  }
  return 'development';
}

const currentEnv: EnvType = detectEnv();

export const config: EnvConfig = ENV_CONFIGS[currentEnv];

export function getConfig(): EnvConfig {
  return config;
}

export { currentEnv };
