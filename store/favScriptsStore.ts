//======================================================
//
// 状態管理用 お気に入りの台本データ管理用
//
//======================================================

import { defineStore } from 'pinia';
import * as CONSTANTS from '@/composables/etc/constants';
import ScriptFavorite from '@/composables/type/scriptFavorite';

/**
 * お気に入り台本一覧保持用ストア
 * 
 * @returns 
 */
export const useFavScriptsStore = defineStore({
  id: 'favScripts',

  state: () => ({
    // ID一覧
    favScriptIds: [] as number[],
    // ID一覧の連想配列
    favScriptIdsMap: {} as { [key: number]: number },
  }),

  actions: {
    /**
     * お気に入り台本ID一覧をセット
     */
    setFavScriptIds(scriptFavorites: ScriptFavorite[]) {
      try {
        const ids = scriptFavorites.map(sf => sf.scriptId)
        this.favScriptIds = ids
        this.favScriptIdsMap = {}
        ids.forEach(id => {
          this.favScriptIdsMap[id] = id
        })
      } catch (error) {
        console.error(error)
      }
    },

    /**
     * 対象台本IDをお気に入り一覧にセット
     * ・先頭にセット
     * 
     * @param sid 
     */
    addFavScript(sid: number) {
      try {
        console.log(this.favScriptIdsMap)

        // 先頭にセット
        this.favScriptIds.unshift(sid)

        // 連想配列にもセット
        this.favScriptIdsMap[sid] = sid

        console.log(this.favScriptIdsMap)
      } catch (error) {
        console.error(error)
      }
    },

    /**
     * 対象台本IDをお気に入り一覧から削除
     * 
     * @param sid 
     */
    removeFavScript(sid: number) {
      try {
        console.log(this.favScriptIdsMap)

        // 配列から削除
        this.favScriptIds = this.favScriptIds.filter(id => id !== sid)

        // 連想配列から削除
        delete this.favScriptIdsMap[sid]

        console.log(this.favScriptIdsMap)
      } catch (error) {
        console.error(error)
      }
    },

    /**
     * 対象台本をお気に入り中かを返す
     * 
     * @param sid
     * @returns
     */
    isFavorited(sid: number): boolean {
      try {
        const res = this.favScriptIdsMap[sid] !== undefined

        return res
      } catch (error) {
        console.error(error)
      }

      return false
    }
  },
});