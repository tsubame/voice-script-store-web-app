//======================================================
//
// watchHistoryStore.ts
// アクセス履歴保存用store
//
//======================================================

import { defineStore } from 'pinia';

/**
 * アクセス履歴保存用store
 * 
 * @returns 
 */
export const useWatchHistoryStore = defineStore('watchHistory', {
  state: () => ({
    // 閲覧済みの台本ID一覧
    watchedScriptIds: [] as number[],
    // 台本を閲覧した日付　'YYYYMMDD'形式
    latestScriptWatchedDayTxt: '',
  }),
  actions: {
    /**
     * 閲覧した台本ID、日付をセット
     * 
     * @param scriptId
     */
    setWatchedScriptIds(scriptId: number) {
      try {
        // JSTの現在日時を'YYYYMMDD'形式でセット
        const now = new Date()
        const currentDayTxt = now.getFullYear() + ('0' + (now.getMonth() + 1)).slice(-2) + ('0' + now.getDate()).slice(-2)

        // 日付が変わっていたら初期化
        if (this.latestScriptWatchedDayTxt != currentDayTxt) {
          this.watchedScriptIds = []
        }

        // 配列に追加
        this.watchedScriptIds.push(scriptId)
        this.latestScriptWatchedDayTxt = currentDayTxt
      } catch (error) {
        console.error(error)
      }
    },

    /**
     * 該当台本を本日閲覧済みかを返す
     * 
     * @param scriptId
     */
    checkIsAlreadyWatchedAtToday(scriptId: number): boolean {
      try {
        // JSTの現在日時を'YYYYMMDD'形式でセット
        const now = new Date()
        const currentDayTxt = now.getFullYear() + ('0' + (now.getMonth() + 1)).slice(-2) + ('0' + now.getDate()).slice(-2)

        // 最後に閲覧した人日付が変わっていたらfalse
        if (this.latestScriptWatchedDayTxt != currentDayTxt) {
          return false
        }

        // 配列にIDが存在すればtrue
        if (this.watchedScriptIds.includes(scriptId)) {
          return true
        }
      } catch (error) {
        console.error(error)
      }

      return false
    }

  },
  // 永続化
  persist: {
    storage: persistedState.localStorage,
  },
});

