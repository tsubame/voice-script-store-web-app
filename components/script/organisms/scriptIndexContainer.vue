<script lang='ts' setup>
//======================================================
//
// index.vue 台本一覧
//
//======================================================

import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import InfiniteLoading from 'v3-infinite-loading'
import * as CONSTANTS from '@/composables/etc/constants'
import * as phpApiManager from '@/composables/util/phpApiManager'
import * as preferenceManager from '@/composables/util/preferenceManager'
import Script from '@/composables/type/script'
import { useWatchHistoryStore } from '~/store/watchHistoryStore'
import { useScriptStore } from '@/store/scriptStore'
import { useUiEventStore } from '@/store/uiEventStore'
import { useUserSettingStore } from '@/store/userSettingStore'
import { useMuteUsersStore } from '@/store/muteUsersStore'

//======================================================
// vars
//======================================================

// 台本データ
const _allScripts = ref<Script[]>([])
// カテゴリごとの台本データ
const _allCategoryScripts = ref<{ [key: string]: Script[] }>({})
// カテゴリ別にロードされた台本データ
const _loadedCategoryScripts = ref<{ [key: string]: Script[] }>({})
// お気に入り台本データ
const _favScripts = ref<Script[]>([])
// フォロー中ユーザの台本データ
const _followUserScripts = ref<Script[]>([])
// 検索した台本データ
const _allSearchedScripts = ref<Script[]>([])
// 表示する台本データ
const _showScripts = ref<Script[]>([])
// カテゴリ
const _selectedCategoryTabName = ref(CONSTANTS.CATEGORY_ALL)
// 該当カテゴリの台本数
const _selectedTabScriptCount= ref(0)
// 並び替え
const _sortBy = ref(CONSTANTS.SCRIPT_ORDER_ITEMS[0])


//======================================================
// method for async
//======================================================

/**
 * 台本個別ページを表示
 * useAsyncDataで使用するため先頭で定義
 * 
 * @param sid 台本ID
 */
const showScriptDetail = async(sid: number) => { 
  try {
    // 該当台本を本日閲覧済みかをチェック
    let res = useWatchHistoryStore().checkIsAlreadyWatchedAtToday(sid)
    if (!res) { 
      // 閲覧済みの台本をstoreにセット
      useWatchHistoryStore().setWatchedScriptIds(sid)
      // 閲覧数をインクリメント
      await phpApiManager.usePostUpdateScriptWatchCount(sid, useAccessTokenStore().accessToken)
    } else { 
      console.log('該当台本を本日閲覧済み')
    }

    // 該当台本取得
    let script = await phpApiManager.useGetReadScript(sid)
    // storeに台本をット
    useScriptStore().targetScript = script
  } catch (error) {
    console.error(error)
  }
}

/**
 * 検索実行
 * useAsyncDataで使用するため先頭で定義
 */
const search = async () => {
  try {
    // タブをリセット
    if (_selectedCategoryTabName.value !== CONSTANTS.CATEGORY_SEARCH_RESULT) {
      _selectedCategoryTabName.value = ""
    }

    // タブ変更
    _showScripts.value = _loadedCategoryScripts.value[_selectedCategoryTabName.value]

    // ウエイト
    await new Promise(resolve => setTimeout(resolve, CONSTANTS.SEARCH_WAIT_MSEC))

    // 検索実行
    _allSearchedScripts.value = await phpApiManager.usePostSearchScripts(useScriptStore().searchCondition)
    _selectedCategoryTabName.value = CONSTANTS.CATEGORY_SEARCH_RESULT
    _allCategoryScripts.value[CONSTANTS.CATEGORY_SEARCH_RESULT] = _allSearchedScripts.value

    useUiEventStore().uiEvent.isSearchButtonClicked = false
    
    // 検索結果カテゴリのロード済台本をセット
    let sScripts: Script[] = []      
    for (let i = 0; i < CONSTANTS.SCRIPTS_LOAD_COUNT; i++) {
      if (_allSearchedScripts.value[i] !== undefined) {
        sScripts.push(_allSearchedScripts.value[i])
      }
    }
    _loadedCategoryScripts.value[CONSTANTS.CATEGORY_SEARCH_RESULT] = sScripts

    // タブ変更
    _showScripts.value = _loadedCategoryScripts.value[_selectedCategoryTabName.value]
    // 台本件数をセット
    _selectedTabScriptCount.value = _allSearchedScripts.value.length

    // ローディングアイコンを非表示
    useUiEventStore().uiEvent.isScriptLoadingIconShowing = false    

    useUiEventStore().uiEvent.bottomNotificationMessage = _allSearchedScripts.value.length + '件の台本がヒットしました。'
    useUiEventStore().uiEvent.isBottomNotificationShowing = true

    // １秒後に非表示
    setTimeout(() => {
      useUiEventStore().uiEvent.isBottomNotificationShowing = false
    }, 1000)
  } catch (error) {
    console.error(error)
  }
} 

//======================================================
// useAsyncData
//======================================================

/**
 * useAsyncData
 * 　・クエリパラメータに台本IDがあれば台本をセット
 */
await useAsyncData(async () => {
  try {
    console.log('[useAsyncData] roomDetailScriptTextContainer ')

    // クエリパラメータに台本IDがあれば台本をセット
    if (useRoute().query.sid !== undefined) {
      // 数値に変換
      const sid = Number(useRoute().query.sid)
      // 台本詳細ページを表示
      await showScriptDetail(sid)
    // クエリパラメータのsearchがtrueなら検索実行
    } else if (useRoute().query.search === CONSTANTS.URL_QUERY_VAL_TRUE) {
      // 検索
      await search()
    }
  } catch (error) {
    console.error(error)
  }
})

//======================================================
// onMounted
//======================================================

/**
 * onMounted
 * ・台本データを2回に分けて取得
 * ・作者名の一覧をstoreにセット
 * ・クエリパラメータに検索条件がセットされていれば検索
 */
onMounted(async () => {
  try {
    // 2回に分けてデータ取得
    if (CONSTANTS.FETCH_ALL_SCRIPTS_TWICE) {
      // 最初に取得する台本データをセット
      await setFirstFetchScripts()
      // 残りの台本データをセット
      await setLeftFetchScripts()
    // 一度にデータ取得
    } else { 
      await setAllScripts()
    }
 
    // 作者名の一覧をstoreにセット
    setAuthorNamesToStore()

    // 検索中の場合、件数をセット
    if (useRoute().query.search === CONSTANTS.URL_QUERY_VAL_TRUE) { 
      _selectedTabScriptCount.value = _allSearchedScripts.value.length      
    }    
  } catch (error) {
    console.error(error)
  }
})

/**
 * 最初に取得する台本データをセット
 * ・最初に表示する台本を1000件分取得
 * ・カテゴリごとの台本をセット
 * ・一覧に最初に描画する台本をセット
 */
const setFirstFetchScripts = async () => {
  try {
    // 最初に表示する台本を1000件分取得
    _allScripts.value = await phpApiManager.useGetReadAllScripts(CONSTANTS.SCRIPTS_FIRST_FETCH_COUNT, 0)
    // カテゴリごとの台本をセット
    setAllCategoriesScripts()
    // 最初に描画する台本をセット
    _showScripts.value = _loadedCategoryScripts.value[_selectedCategoryTabName.value]
  } catch (error) {
    console.error(error)
  }
}

/**
 * 2回目に取得する台本データをセット
 * ・最初の1000件以降の台本データを取得
 * ・カテゴリごとの台本をセット
 * ・台本件数をセット
 * ・お気に入り台本データをセット
 */
const setLeftFetchScripts = async () => {
  try {
    // 残りの台本を取得
    const leftScripts = await phpApiManager.useGetReadAllScripts(CONSTANTS.SCRIPTS_SECOND_FETCH_COUNT, CONSTANTS.SCRIPTS_FIRST_FETCH_COUNT)
    _allScripts.value = _allScripts.value.concat(leftScripts)
    // 台本件数をセット
    _selectedTabScriptCount.value = _allScripts.value.length

    // カテゴリごとの台本を再セット
    setAllCategoriesScripts() 
    // お気に入り台本データをセット
    setFavScripts()   
    // フォロー中ユーザの台本データをセット
    setFollowUserScripts()
  } catch (error) {
    console.error(error)
  }
}

/**
 * まとめて台本をセット
 */
const setAllScripts = async () => {
  try {
    // 残りの台本を取得
    const allScripts = await phpApiManager.useGetReadAllScripts(CONSTANTS.SCRIPTS_ALL_MAX_FETCH_COUNT, 0)
    _allScripts.value = allScripts
    // 台本件数をセット
    _selectedTabScriptCount.value = _allScripts.value.length

    // カテゴリごとの台本をセット
    setAllCategoriesScripts() 
    // 最初に描画する台本をセット
    _showScripts.value = _loadedCategoryScripts.value[_selectedCategoryTabName.value]

    // お気に入り台本データをセット
    setFavScripts()   
    // フォロー中ユーザの台本データをセット
    setFollowUserScripts()
  } catch (error) {
    console.error(error)
  }
}

/**
 * カテゴリごとの台本をセット
 * ・カテゴリ別の全台本、カテゴリ別のロード済台本データをセット
 */
const setAllCategoriesScripts = () => {
  try {
    // カテゴリを走査
    CONSTANTS.SCRIPT_PAGE_CATEGORY_TAB_ITEMS.forEach((cName) => {
      let cScripts: Script[] = [];
      let lScripts: Script[] = [];

      // 全台本を走査      
      _allScripts.value.forEach((s: Script) => {
        // 該当カテゴリ、またはすべてならセット
        if (s.category.indexOf(cName) !== -1 || cName === CONSTANTS.CATEGORY_ALL) {
          cScripts.push(s)

          // 最初に表示する件数以下ならカテゴリ別のロード済台本にセット
          if (cScripts.length < CONSTANTS.SCRIPTS_LOAD_COUNT) {
            lScripts.push(s)
          }
        }
      });

      // お気に入り台本カテゴリなら
      if (cName === CONSTANTS.CATEGORY_FAV) {
        _favScripts.value.forEach((s: Script) => {
          cScripts.push(s)

          // 最初に表示する件数以下ならカテゴリ別のロード済台本にセット
          if (cScripts.length < CONSTANTS.SCRIPTS_LOAD_COUNT) {
            lScripts.push(s)
          }
        });
      }
      // フォロー中カテゴリなら
      if (cName === CONSTANTS.CATEGORY_FOLLOWING) {
        _followUserScripts.value.forEach((s: Script) => {
          cScripts.push(s)

          // 最初に表示する件数以下ならカテゴリ別のロード済台本にセット
          if (cScripts.length < CONSTANTS.SCRIPTS_LOAD_COUNT) {
            lScripts.push(s)
          }
        });
      }      

      _allCategoryScripts.value[cName] = cScripts
      _loadedCategoryScripts.value[cName] = lScripts
    });

    // '検索結果'カテゴリを走査（上記タブに含まれないため）
    let sScripts: Script[] = []
    for (let i = 0; i < CONSTANTS.SCRIPTS_LOAD_COUNT; i++) {
      if (_allSearchedScripts.value[i] !== undefined) {
        sScripts.push(_allSearchedScripts.value[i])
      }
    }

    _allCategoryScripts.value[CONSTANTS.CATEGORY_SEARCH_RESULT] = _allSearchedScripts.value
    _loadedCategoryScripts.value[CONSTANTS.CATEGORY_SEARCH_RESULT] = sScripts    
  } catch (error) {
    console.error(error)
  }
}

/**
 * お気に入り台本をタブ表示用の台本にセットし直す
 * ・storeのお気に入りデータからお気に入り台本をセット
 * ・カテゴリ別、ロード済の台本にセット
 */
const setFavScripts = () => {
  try {
    _favScripts.value = []
    let cfScripts: Script[] = [];
    let lfScripts: Script[] = [];

    // 未ログインならカテゴリ別、ロード別の台本にセットして終了
    if (!useLoginUserStore().hasLogined()) {       
      _allCategoryScripts.value[CONSTANTS.CATEGORY_FAV] = cfScripts
      _loadedCategoryScripts.value[CONSTANTS.CATEGORY_FAV] = lfScripts
          
      return
    }    

    // storeのお気に入りデータからお気に入り台本をセット
    useFavScriptsStore().favScriptIds.forEach((id: number) => {
      _allScripts.value.forEach((s: Script) => {
        if (s.id === id) {
          _favScripts.value.push(s)
        }
      })
    })

    // お気に入り台本を走査
    _favScripts.value.forEach((s: Script) => {
      cfScripts.push(s)

      // 最初に表示する件数以下ならセット
      if (cfScripts.length < CONSTANTS.SCRIPTS_LOAD_COUNT) {
        lfScripts.push(s)
      }
    });

    // カテゴリ別、ロード別の台本にセット
    _allCategoryScripts.value[CONSTANTS.CATEGORY_FAV] = cfScripts
    _loadedCategoryScripts.value[CONSTANTS.CATEGORY_FAV] = lfScripts
  } catch (error) {
    console.error(error)
  }
}


/**
 * フォロー中ユーザの台本をタブ表示用の台本にセットし直す
 * ・storeのフォローデータから台本をセット
 * ・カテゴリ別、ロード済の台本にセット
 */
const setFollowUserScripts = () => {
  try {
    _followUserScripts.value = []
    let cfScripts: Script[] = [];
    let lfScripts: Script[] = [];

    // 未ログインならカテゴリ別、ロード別の台本にセットして終了
    if (!useLoginUserStore().hasLogined()) {       
      _allCategoryScripts.value[CONSTANTS.CATEGORY_FOLLOWING] = cfScripts
      _loadedCategoryScripts.value[CONSTANTS.CATEGORY_FOLLOWING] = lfScripts
          
      return
    }    

    // storeのフォロー中データから台本をセット
      _allScripts.value.forEach((s: Script) => {
    useFollowUsersStore().followUserIds.forEach((id: number) => {
        if (s.userId === id) {
          _followUserScripts.value.push(s)
        }
      })
    })

    // フォロー中台本を走査
    _followUserScripts.value.forEach((s: Script) => {
      cfScripts.push(s)

      // 最初に表示する件数以下ならセット
      if (cfScripts.length < CONSTANTS.SCRIPTS_LOAD_COUNT) {
        lfScripts.push(s)
      }
    });

    // IDの降順にソート
    cfScripts.sort((a, b) => {
      if (a.id < b.id) {
        return 1
      } else {
        return -1
      }
    })

    // カテゴリ別、ロード別の台本にセット
    _allCategoryScripts.value[CONSTANTS.CATEGORY_FOLLOWING] = cfScripts
    _loadedCategoryScripts.value[CONSTANTS.CATEGORY_FOLLOWING] = lfScripts
  } catch (error) {
    console.error(error)
  }
}


/**
 * 作者名の一覧をstoreにセット
 * ・自分の名前を先頭にセット
 */
const setAuthorNamesToStore = async () => {
  try {
    // 作者名の配列
    let authorNames: string[] = []

    let myAuthorName = ''

    // 作者名の一覧を取得
    _allScripts.value.forEach((s: Script) => {
      // 配列に未追加なら
      if (authorNames.indexOf(s.authorName) === -1) {
        if (s.authorName === useLoginUserStore().user.name) {
          myAuthorName = s.authorName
        } else {
          authorNames.push(s.authorName)
        }
      }
    })

    // 昇順にソート
    authorNames.sort()
    // 先頭に自分の名前をセット
    if (myAuthorName !== '') {
      authorNames.unshift(myAuthorName)
    }
    // 先頭に空白をセット
    authorNames.unshift('')
    // 作者名の一覧をstoreにセット
    useScriptStore().authorNames = authorNames

    console.log('setAuthorNamesToStore')
    //console.log(authorNames)
  } catch (error) {
    console.error(error)
  }
}


//======================================================
// methods
//======================================================

/**
 * イベント カテゴリタブクリック 
 * 
 * @param cName
 */
const onCategoryTabItemClick = (cName: string) => { 
  try {
    _selectedCategoryTabName.value = cName
    console.log('onCategoryTabItemClick', cName)
    // 表示する台本をセット
    console.log(_loadedCategoryScripts.value)

    // お気に入り台本データを再セット
    setFavScripts()
    // フォロー中ユーザの台本データをセット
    setFollowUserScripts()

    _showScripts.value = _loadedCategoryScripts.value[_selectedCategoryTabName.value]
    // タブ名によって台本数をセット
    setSelectedTabScriptCount()    
  } catch (error) {
    console.error(error)
  }
}

/**
 * 現在のタブの台本数をセット
 * 
 * @returns 台本数
 */
const setSelectedTabScriptCount = () => {
  try {
    if (_selectedCategoryTabName.value === CONSTANTS.CATEGORY_ALL) {
      _selectedTabScriptCount.value = _allScripts.value.length
    } else if (_selectedCategoryTabName.value === CONSTANTS.CATEGORY_FAV) {
      _selectedTabScriptCount.value = _favScripts.value.length
    } else if (_selectedCategoryTabName.value === CONSTANTS.CATEGORY_SEARCH_RESULT) {
      _selectedTabScriptCount.value = _allSearchedScripts.value.length
    } else {
      _selectedTabScriptCount.value = _allCategoryScripts.value[_selectedCategoryTabName.value].length
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * イベント 台本アイテムクリック
 * ・リンクのデフォルト動作をキャンセル
 * ・スクロール位置をセット
 * ・台本取得
 * ・storeに台本をセット
 * ・スクロール位置をトップに
 * ・クエリパラメータをセット
 * 
 * @param script
 * @returns
 */
const onScriptItemClick = async(event: any, script: Script) => {
  try {
    if (event.ctrlKey || event.shiftKey || event.metaKey || (event.button && event.button === 1)) {
      return;
    }

    // リンクのデフォルト動作をキャンセル
    event.preventDefault();    

    // リンクが存在していればリンク先へ
    if (script.scriptUrl !== '' && script.scriptUrl !== null) {
      // リンクのデフォルト動作をキャンセル
      event.preventDefault();
      // リンク先に新しいタブで遷移
      window.open(script.scriptUrl, '_blank')

      return
    }

    // 該当台本取得
    useScriptStore().watchingScriptId = script.id
    //showTargetScript(script.id)
  } catch (error) {
    console.error(error)
  }
}

/**
 * 該当台本のデータを取得し、表示
 * 
 * @param sid 台本ID
 */
const showTargetScript = async (sid: number) => {
  try {
    // スクロール位置をセット
    console.log('[scrollTop] ' + document.documentElement.scrollTop)
    useUiEventStore().uiEvent.bodyScrollTop = document.documentElement.scrollTop

    // 該当台本を本日閲覧済みかをチェック
    let res = useWatchHistoryStore().checkIsAlreadyWatchedAtToday(sid)
    if (!res) {
      // 閲覧済みの台本をstoreにセット
      useWatchHistoryStore().setWatchedScriptIds(sid)
      // 閲覧数をインクリメント
      await phpApiManager.usePostUpdateScriptWatchCount(sid, useAccessTokenStore().accessToken)
    } else { 
      console.log('[該当台本を本日閲覧済]')
    }

    // 該当台本取得
    let script = await phpApiManager.useGetReadScript(sid)
    // 閲覧中の台本をstoreにセット
    useScriptStore().watchingScriptId = script.id
    // storeに台本をット
    useScriptStore().targetScript = script

    // スクロール位置をトップに
    document.documentElement.scrollTop = 0
    console.log('sctollToTop')
    console.log('[after scrollTop] ' + document.documentElement.scrollTop)

    // クエリパラメータをセット
    navigateTo(CONSTANTS.PAGE_NAME_SCRIPTS + '?' + CONSTANTS.URL_QUERY_KEY_SCRIPT_ID + '=' + script.id)     
  } catch (error) {
    console.error(error)
  }
}

/**
 * inifinityLoading用設定
 * 
 * @param $state 
 */
const load = async ($state: any) => {
  console.log('script loading...');
  try {
    // 1ページ分ローディング
    loadTargrtCategoryScripts()
  } catch (error) {
    $state.error();
  }
};

/**
 * 台本を1ページ分ロード
 */
function loadTargrtCategoryScripts() {
  try {
    const sIndex = _showScripts.value.length
    const eIndex = sIndex + (CONSTANTS.SCRIPTS_LOAD_COUNT)
    console.log('[ロード前台本件数]' + _showScripts.value.length)

    // 対象カテゴリの台本をセット
    let tCatLoadedScripts: Script[] = _loadedCategoryScripts.value[_selectedCategoryTabName.value]
    let tCatAllScripts: Script[] = _allCategoryScripts.value[_selectedCategoryTabName.value]
    // 台本がなければ終了
    if (tCatAllScripts === undefined) {
      return
    }

    // 該当カテゴリの台本をロード
    for (let i = sIndex; i < eIndex; i++) {
      if (tCatAllScripts[i] !== undefined) {
        tCatLoadedScripts.push(tCatAllScripts[i])
      }
    }

    _showScripts.value = tCatLoadedScripts
    console.log('[ロード後台本件数]' + tCatLoadedScripts.length)
  } catch (error) {
    console.error(error)
  }
}

//======================================================
// watch
//======================================================

/**
 * watch 閲覧対象の台本ID変更
 */
watch(() => useScriptStore().watchingScriptId,
  async (val) => {
    try {
      if (useScriptStore().watchingScriptId == 0) {
        return
      }

      // 台本表示
      await showTargetScript(useScriptStore().watchingScriptId)
    } catch (error) {
      console.error(error)
    }
  }
)

/**
 * watch ソート順監視
 */
watch(() => _sortBy.value,
  async (sortBy) => {
    // 並び順をCookieに保存
    await preferenceManager.useSetValToCookie(CONSTANTS.COOKIE_KEY_SCRIPT_ORDER, _sortBy.value)
    // 並び替え
    sortScript()
  }
)

/**
 * 台本並び替え
 */
const sortScript = () => {
  try {
    // ランダム
    if (_sortBy.value === CONSTANTS.SCRIPT_ORDER_RANDOM) {
      console.log('[ランダムで並び替え]')
      console.log(_allScripts.value)      
      _allScripts.value.sort(() => Math.random() - 0.5)
      _favScripts.value.sort(() => Math.random() - 0.5)
      _followUserScripts.value.sort(() => Math.random() - 0.5)
      _allSearchedScripts.value.sort(() => Math.random() - 0.5)
      // 新着順
    } else if (_sortBy.value === CONSTANTS.SCRIPT_ORDER_NEW) {
      console.log('[id順で並び替え]')
      _allScripts.value.sort((a, b) => { return b.id - a.id })
      _favScripts.value.sort((a, b) => { return b.id - a.id })

      // お気に入り台本データを再セット
      setFavScripts()
      
      _followUserScripts.value.sort((a, b) => { return b.id - a.id })
      _allSearchedScripts.value.sort((a, b) => { return b.id - a.id })
      // 古い
    } else if (_sortBy.value === CONSTANTS.SCRIPT_ORDER_OLD) {
      console.log('[id順で並び替え]')
      _allScripts.value.sort((a, b) => { return a.id - b.id })
      _favScripts.value.sort((a, b) => { return a.id - b.id })

      // お気に入り台本データを再セット
      setFavScripts()
      // 逆順に
      _favScripts.value.reverse()

      _followUserScripts.value.sort((a, b) => { return a.id - b.id })
      _allSearchedScripts.value.sort((a, b) => { return a.id - b.id })
      // 人気順
    } else if (_sortBy.value === CONSTANTS.SCRIPT_ORDER_POPULAR) {
      console.log('[人気順で並び替え]')
      _allScripts.value.sort((a, b) => { return b.watchCount - a.watchCount })
      _favScripts.value.sort((a, b) => { return b.watchCount - a.watchCount })
      _followUserScripts.value.sort((a, b) => { return b.watchCount - a.watchCount })
      _allSearchedScripts.value.sort((a, b) => { return b.watchCount - a.watchCount })
    }

    console.log('並び替え完了')
    // カテゴリごとの台本を再セット
    setAllCategoriesScripts()

    console.log(_loadedCategoryScripts.value)
    console.log(_allCategoryScripts.value)
    console.log(_favScripts.value)

    _showScripts.value = _loadedCategoryScripts.value[_selectedCategoryTabName.value]
  } catch (error) {
    console.error(error)
  }
}

/**
 * watch 台本検索ボタン押下状況の監視
 */
watch(() => useUiEventStore().uiEvent.isSearchButtonClicked,
  async (val) => {
    try {
      if (!val) { 
        return
      }
      const SCROLL_TARGET_HEIGHT = 200

      const width = window.innerWidth;
      const threshold = 768; 

      if (width <= threshold ) {
        // 下にスクロール
        document.documentElement.scrollTop = SCROLL_TARGET_HEIGHT   
      }
      
      // 検索実行
      await search()   
    } catch (error) {
      console.error(error)
    }
  }
)

/**
 * watch クエリパラメータの'sid'の変化を監視
 * ・閲覧中の台本IDと異なれば台本表示
 */
watch(() => useRoute().query.sid, (newSid, oldSid) => {
  try {
    if (newSid !== oldSid) {
      console.log('query.sid changed')

      if (newSid !== undefined) {
        // 数値に変換
        let sid = Number(newSid)

        if (useScriptStore().watchingScriptId !== sid) { 
          useScriptStore().watchingScriptId = sid
          console.log('<<WARNING!!>> query.sidの変化から台本表示')
        }
      }
    }    
  } catch (error) {
    console.error(error)   
  }
});
</script>
<!--
//======================================================
//
// HTML
//
//======================================================
-->
<template>
  <div id="outer-container">    
    <div id="index-container" class="px-3">
      <v-row class="pt-4">
        <v-col class="mt-4">
          <div id="top-image-container">        
          <v-img 
            id="top-image"
            src="/img/top/top-image-1.jpg" />
          </div>
        </v-col>
      </v-row>

      <!-- 検索フォーム -->
      <v-row class="justify-center mt-12 mb-0 pt-12">
        <v-col cols="8" class="justify-center">
          <template v-if="useDisplay().mobile.value">
            <script-index-search-button />
          </template>
          <template v-else>
            <script-index-search-text-box />
          </template>
        </v-col>    
      </v-row>

      <v-row class="justify-center mt-0 mb-4">
        <v-col cols="12" class="justify-center">      
          <!-- タブ用ボタン -->
          <div id="scroll-container" class="justify-center text-center mt-8 pt-2 pb-4">
            <h4 class="text-left mb-2 ml-1">ジャンル</h4>
            <!-- 検索結果 -->
            <template v-if="_allSearchedScripts.length !== 0">
              <script-index-tab-button 
                @click="onCategoryTabItemClick(CONSTANTS.CATEGORY_SEARCH_RESULT)"            
                :name="CONSTANTS.CATEGORY_SEARCH_RESULT"
                :selectedCategoryTabName="_selectedCategoryTabName"
              />            
            </template>

            <!-- その他カテゴリ -->
            <template v-for="(name, tabIndex) in CONSTANTS.SCRIPT_PAGE_CATEGORY_TAB_ITEMS" :key="tabIndex">
              <script-index-tab-button 
                @click="onCategoryTabItemClick(name)"            
                :name="name"
                :selectedCategoryTabName="_selectedCategoryTabName"
              />
            </template>
          </div>           
        </v-col>
      </v-row>

      <!-- 並べ替え用プルダウン -->
      <v-row class="justify-end mt-4 mb-0">
        <v-spacer></v-spacer>
        <v-col cols="4" class="d-flex flex-row justify-end my-0 py-0">
          <div id="order-select-box-container">
            <div class="custom-select-container">
              <select class="custom-select"
                v-model="_sortBy"
                >
                <option value="新着順">新着順</option>
                <option value="古い順">古い順</option>
                <option value="人気順">人気順</option>                
                <option value="ランダム順">ランダム順</option>
              </select>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- 台本件数 -->
      <v-row class="justify-end mb-0 mt-0 pb-0">
        <v-col cols="9" class="ml-2 mb-4 pt-0 pb-0">
        </v-col>      
        <v-spacer></v-spacer>

        <!-- 台本件数 -->
        <v-col cols="3" class="d-flex flex-row justify-end mt-2 mb-0 mr-2 pt-0 pb-0 text-grey-darken-5 text-body-2">
          <div id="count-container">
            <p class="count-text">{{ _selectedTabScriptCount }}件</p>
          </div>
        </v-col>
      </v-row>

      <!-- 台本一覧 -->
      <v-row class="justify-center mt-0 mb-10 pt-0 pb-12">
        <v-col cols="12" class="justify-center my-0 py-0">

          <!-- ローディング用 -->
          <template v-if="useUiEventStore().uiEvent.isScriptLoadingIconShowing">
            <div id="loading-container" class="mt-4 text-center">
              <v-progress-circular
                :size="50"          
                color="grey-lighten-3"
                indeterminate
              ></v-progress-circular>         
            </div>
          </template>
          <template v-else>
            <v-list id="script-list-container" class="my-0 py-0 px-0 bg-transparent" lines="three">
              <template v-for="(script, index) in _showScripts" :key="index">
                <!-- ミュート中でなく、R18関連での表示対象であれば表示 -->
                <template 
                  v-if="!useMuteUsersStore().isMuting(script.userId) &&                
                  useUserSettingStore().isShowableScriptForAgeRestrict(script)"
                  >

                  <script-index-list-item 
                  :href="script.getScriptLink()"
                  :targetScript="script"
                  @click="(event: any) => onScriptItemClick(event, script)"
                  />     
                </template>
              </template>

              <InfiniteLoading @infinite="load" />
            </v-list>
          </template>
        </v-col>
      </v-row>    

      <!-- 上に戻るボタン -->
      <template v-if="useScriptStore().targetScript.id == 0">
        <common-move-to-top-button />
      </template>    
    </div>  
  </div>  
</template>
<!--
//======================================================
//
// SCSS
//
//======================================================
-->
<style lang="scss" scoped>

::-webkit-scrollbar-thumb {
  background: #AAAAAA;
}

#outer-container {
  max-width: 1400px;  
  margin: auto;
  padding-bottom: 400px;
}

#index-container {
  margin: 0 auto;
  max-width: $index-max-width;
}

#top-image-container {
  width: 90%;
  max-width: 600px;
  margin: 0 auto;
}

#top-image {
  border-radius: 20px;
  border: solid 4px white;
}

#search-condition-container{
  border: solid 0px #999999;
}

#count-container {
  width: 100%;
  position: relative; /* 親要素に相対位置を設定 */
  min-width: 50px;
  min-height: 1rem;
  border: solid 0px #999999;
}
#count-container .count-text {
  position: absolute;
  bottom: 0px;
  right: 4px;
  text-align: right;
}

#order-select-box-container {
  max-width: 180px; 
}

#scroll-container {
  overflow-x: auto;
  white-space: nowrap;
  margin: 0 auto;
  padding: 0;
}

h4 {
  font-size: 90%;
}

#script-list-container {
  max-width: $index-max-width;
  margin: 0 auto;
}

.card {
	width: 100%;
  max-width: $index-max-width;
  height: 100px;
	border-radius: 8px;
	box-shadow: 0 4px 30px 0 rgba(0,0,0, 0.1);
	background-color: #fff;
	padding: 2.5rem;
	margin-left: auto;
	margin-right: auto;
	margin-bottom: 2rem;
	font-size: 1.125rem;
  border: solid 1px #999999;
}

.custom-select-container {
  position: relative;
  display: inline-block;
  width: 150px; /* 必要に応じて調整 */
}
.custom-select {
  width: 100%;
  padding-left: 16px;
  padding-right: 30px; /* アイコンのスペースを確保 */
  appearance: none; /* デフォルトの矢印を非表示 */
  background: white url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjOTk5OTk5Ij4KICA8cGF0aCBkPSJNNywxMEwxMiwxNUwxNywxMEg3WiIgLz4KPC9zdmc+') no-repeat right 10px center;
  border: 1px solid #8e8e8e; /* 必要に応じて調整 */
  border-radius: 20px; /* 必要に応じて調整 */
  height: 36px; /* 必要に応じて調整 */
  font-size: 90%;
  color: black;
  cursor: pointer;
}
</style>