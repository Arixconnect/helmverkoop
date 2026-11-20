import {defineConfig,devices} from '@playwright/test';

const baseURL = process.env.TEST_BASE_URL || 'http://localhost:4317';
export default defineConfig({
  testDir:'./tests',testMatch:'**/*.spec.ts', fullyParallel:true,workers:2,
  use:{baseURL,channel:process.env.PW_CHANNEL || 'chrome',trace:'retain-on-failure'},
  projects:[
    {name:'desktop',use:{...devices['Desktop Chrome'],viewport:{width:1440,height:960}}},
    {name:'mobiel',testIgnore:'**/routes.spec.ts',use:{...devices['Pixel 7'],defaultBrowserType:'chromium'}}
  ],
  webServer:process.env.TEST_BASE_URL ? undefined : {command:'pnpm start -p 4317',url:baseURL,reuseExistingServer:true,timeout:60000}
});
