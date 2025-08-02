
//======================================================
//
// 状態管理用 ログイン中のユーザ
// ユーザ情報を保持
//
//======================================================

import { defineStore } from 'pinia';
import User from '@/composables/type/user'

/**
 * ログイン中の自分のユーザ情報
 * 
 * @returns 
 */
export const useLoginUserStore = defineStore('loginUser', {
  state: () => ({
    // ログイン済ユーザ情報
    user: new User(),
    // 登録用の一時ユーザ情報
    tempUserForRegister: new User(),
    // ログイン時に取得したTwitterID
    twitterUserIdStrFetchedFromTwitterLogin: "",
    // ログイン時に取得したGoogleID
    googleUserIdStrFetchedFromGoogleLogin: "",
  }),
  getters: {
    getUser: (state) => state.user,
  },
  actions: {
    setUser(value: User) {
      this.user = value;
    },

    /**
     * ログイン済かを返す
     * 
     * @param boolean
     */
    hasLogined(): boolean {
      try {
        if (this.user.id !== 0) {
          return true
        }
      } catch (error) {
        console.error(error)
      }

      return false
    },

    /**
     * 環境を短い文字列で返す
     */
    getShortEnvTxt(): string {
      try {
        const envTxt = navigator.userAgent.toUpperCase()

        // Capaitor iOS
        if (envTxt.indexOf("CAPACITOR") !== -1 && envTxt.indexOf("IOS") !== -1) {
          return "Capacitor iOS"
        }
        // iPhone
        if (envTxt.indexOf("IPHONE") !== -1) {
          return "iPhone"
        }
        // Android
        if (envTxt.indexOf("ANDROID") !== -1) {
          return "Android"
        }
        // Windows
        if (envTxt.indexOf("WINDOWS") !== -1) {
          return "Windows"
        }
        // Mac
        if (envTxt.indexOf("MAC") !== -1) {
          return "Mac"
        }
      } catch (error) {
        console.error(error)
      }

      return ""
    }
  },

  /*
  persist: {
    storage: persistedState.localStorage,
  },*/
});