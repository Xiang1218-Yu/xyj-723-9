/// <reference types="miniprogram-api-typings" />

declare namespace WechatMiniprogram {
  interface AppOptions {
    globalData?: Record<string, unknown>;
  }
}

declare const App: WechatMiniprogram.App.Constructor;
declare const Page: WechatMiniprogram.Page.Constructor;
declare const Component: WechatMiniprogram.Component.Constructor;
declare const Behavior: WechatMiniprogram.Behavior.Constructor;
declare const getApp: <T = WechatMiniprogram.IAnyObject>() => T & WechatMiniprogram.App.Instance<T>;
declare const getCurrentPages: () => Array<WechatMiniprogram.Page.Instance<WechatMiniprogram.IAnyObject, WechatMiniprogram.IAnyObject>>;
declare const wx: WechatMiniprogram.Wx;

declare module '*.json' {
  const value: unknown;
  export default value;
}
