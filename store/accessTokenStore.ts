
//======================================================
//
// 状態管理用 アクセストークン
//
//======================================================

import { defineStore } from 'pinia';
import AccessToken from '@/composables/type/accessToken';

/**
 * アクセストークン情報
 * 
 * @returns 
 */
export const useAccessTokenStore = defineStore('accessToken', {
  state: () => ({
    accessToken: new AccessToken(),
  }),
  actions: {
    setAccessToken(value: AccessToken) {
      this.accessToken = value;
    },
  },
});