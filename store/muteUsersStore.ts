//======================================================
//
// 状態管理用 
// ミュート中のユーザ情報を保持
//
//======================================================

import { defineStore } from 'pinia';
import Mute from '@/composables/type/mute';

/**
 * ミュート中のユーザ一覧保持用ストア
 * 
 * @returns 
 */
export const useMuteUsersStore = defineStore({
  id: 'muteUsers',

  state: () => ({
    // ミュート中ユーザID一覧
    muteUserIds: [] as number[],
    // ミュート中ユーザID一覧の連想配列
    muteUserIdsMap: {} as { [key: number]: number },

    // データ取得済みか
    isDataFetched: false,
  }),

  actions: {
    /**
     * ミュート中ユーザID一覧をセット
     */
    setMuteUserIds(userMutes: Mute[]) {
      try {
        const ids = userMutes.map(bl => bl.muteTargetUserId)
        this.muteUserIds = ids
        this.muteUserIdsMap = {}
        ids.forEach(id => {
          this.muteUserIdsMap[id] = id
        })

        // データ取得済みにセット
        this.isDataFetched = true
      } catch (error) {
        console.error(error)
      }
    },

    /**
     * 対象ユーザIDをミュート中一覧にセット
     * 
     * @param fid 
     */
    addMute(fid: number) {
      try {
        this.muteUserIds.push(fid)

        // 連想配列にもセット
        this.muteUserIdsMap[fid] = fid
      } catch (error) {
        console.error(error)
      }
    },

    /**
     * 対象ユーザIDをミュート中一覧から削除
     * 
     * @param fid 
     */
    removeMute(uid: number) {
      try {
        // 配列から削除
        this.muteUserIds = this.muteUserIds.filter(id => id !== uid)

        // 連想配列から削除
        delete this.muteUserIdsMap[uid]
      } catch (error) {
        console.error(error)
      }
    },

    /**
     * 対象ユーザをミュート中かを返す
     */
    isMuting(uid: number): boolean {
      let res = false

      try {
        res = this.muteUserIdsMap[uid] !== undefined
      } catch (error) {
        console.error(error)
      }

      return res
    },
  },
});