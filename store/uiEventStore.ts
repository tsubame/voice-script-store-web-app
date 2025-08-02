//======================================================
//
// uiEventStore
// UIイベント管理用
//
//======================================================

import { defineStore } from 'pinia';
import Script from '@/composables/type/script'
import UiEvent from '@/composables/type/uiEvent';

/**
 * 台本情報
 * 
 * @returns 
 */
export const useUiEventStore = defineStore('uiEvent', {
  state: () => ({
    uiEvent: new UiEvent(),
  }),
  actions: {
  },
});

