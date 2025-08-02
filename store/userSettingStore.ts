//======================================================
//
// userSettingStore.ts
// ユーザ設定管理用
//
//======================================================

import { defineStore } from 'pinia';
import UserSetting from '@/composables/type/userSetting';
import * as CONSTANTS from '@/composables/etc/constants';
import Script from '@/composables/type/script';

/**
 * 台本情報
 * 
 * @returns 
 */
export const useUserSettingStore = defineStore('userSetting', {
  state: () => ({
    // DBに保存されたユーザ設定
    dbSavedUserSetting: new UserSetting(),

    // Cookieに保存された文字サイズの拡大率（%）
    cookieSavedScriptTextFontSizeRate: CONSTANTS.SCRIPT_TEXT_FONT_SIZE_DEFAULT_PERCENTAGE
  }),
  actions: {
    /**
     * 設定をセット
     * 
     * @param userSetting
     */
    setDbSavedUserSetting(userSetting: UserSetting) {
      try {
        this.dbSavedUserSetting = userSetting
      } catch (error) {
        console.error(error)
      }
    },

    /**
     * 対象台本が'R18'での表示対象かを返す
     * 
     * @param script
     * @returns
     */
    isShowableScriptForAgeRestrict(script: Script): boolean {
      try {
        // 設定でR18を表示する場合は、常に表示
        if (this.dbSavedUserSetting.showAgeRestrictedScript) {
          return true
        }

        // 台本がR18でない場合は、常に表示
        if (!script.isR18Script()) {
          return true
        }

        return false
      } catch (error) {
        console.error(error)
      }

      return true
    }
  },
});

