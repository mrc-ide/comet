import {PlaywrightTestConfig} from '@playwright/test';

const config: PlaywrightTestConfig = {
  testMatch: '*.etest.ts',
  use: {
    baseURL: "http://comet:8080"
  }
};

export default config;
