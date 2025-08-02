import { defineStore } from 'pinia';
import Script from '@/composables/type/script'
import * as CONSTANTS from '@/composables/etc/constants';
import SearchCondition from '~/composables/type/searchCondition';
import type Charactor from '~/composables/type/charactor';

/**
 * 台本情報
 * 
 * @returns 
 */
export const useScriptStore = defineStore('script', {
  state: () => ({
    // 対象の台本
    targetScript: new Script(),
    // 詳細閲覧中の台本ID
    watchingScriptId: 0,
    // 編集中の台本
    edittingScriptId: 0,
    // 台本投稿、または編集中か
    isScriptPostingOrEditting: false,
    // アップロードで選択された台本ファイル
    uploadSelectedFileName: '',
    // 選択された背景画像
    selectedBgImageItem: {} as CONSTANTS.BgImageItem,
    // 検索条件
    searchCondition: new SearchCondition(),
    // 作者名一覧
    authorNames: [] as string[],

    // 編集中のキャラクター一覧
    edittingCharacters: [] as Charactor[],
  }),
  actions: {
    /**
     * 値を初期化
     */
    clearScriptVals() {
      this.uploadSelectedFileName = ''
      this.targetScript = new Script()
      this.isScriptPostingOrEditting = false
      this.watchingScriptId = 0
    },
    /**
     * 検索条件を初期化
     */
    clearSearchCondition() {
      this.searchCondition = new SearchCondition()
    },

  },
});

