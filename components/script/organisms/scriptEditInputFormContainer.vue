<script lang="ts" setup>
//======================================================
//
// scriptEditInputForm.vue 台本入力フォーム
//
//======================================================

import { reactive, onMounted, ref } from 'vue';
import { useDisplay } from 'vuetify';
import Encoding from 'encoding-japanese';
import draggable from 'vuedraggable';
import * as CONSTANTS from '@/composables/etc/constants'
import * as phpApiManager from '@/composables/util/phpApiManager'
import * as scriptTextManager from '@/composables/util/scriptTextManager'
import * as preferenceManager from '@/composables/util/preferenceManager'
import { useScriptStore } from '@/store/scriptStore'
import { useLoginUserStore } from '@/store/loginUserStore'
import { useConfirmDialog } from '@/composables/util/dialogManager'
import Word from '@/composables/type/word'
import Charactor from '@/composables/type/charactor'
import Script from '@/composables/type/script'

//======================================================
// props、emits
//======================================================

// props
const props = defineProps<{
  targetScript: Script
}>()

// emits
const emits = defineEmits(['showDetail'])

//======================================================
// vars
//======================================================

// 入力フォーム
const editForm = ref();
// 確認ダイアログ表示用
const { showConfirmDialog } = useConfirmDialog({});

// フォームの値
const _formVals = reactive({
  // タイトル
  title: '',
  // ユーザID
  userId: 0,
  // 配信者ユーザ名
  authorName: '',
  // 演者人数
  actorCount: 1,
  // 男性演者人数
  actorManCount: 0,
  // 女性演者人数
  actorWomanCount: 0,
  // 不問演者人数
  actorEtcCount: 0,
  // キャラクター人数
  charaCount: 1,
  // 男女比
  actorSexSummary: '',
  // 兼役があるか
  hasDualRole: false,
  // 時間
  minutes: CONSTANTS.SCRIPT_PORT_FORM_MIN_INIT_VAL,
  // 時間のテキスト
  //minutesTxt: '',
  // カテゴリ
  category: '',
  // 利用規定
  reusable: CONSTANTS.SCRIPT_POST_FORM_VALS_POLICIES[0].value,
  // 説明文
  description: '',
  // 本文
  scriptBody: '',
  // 許可タグ
  tags: new Array<string>(),
  // タグ（文字列）
  tagsTxt: '',
  // 年齢制限
  hasAgeLimit: false,
  // 背景画像タイトル
  bgImageTitle: '',  
  // 背景画像パス
  bgImageUrl: '',
  // サムネイル画像パス
  thumImageUrl: '',  
})

// キャラ
const _charactors = ref<any[]>([]) 
// セリフ
const _words = ref(new Array<Word>())
// 選択された名前
const _selectedNames = ref(new Array<string>())
// 文字数
const _textLength = ref(0)
// 文字数（カンマ区切り）
const _textLengthStr = ref('')
// 予測される時間（10分単位）
const _estimatedRoughMinutes = ref(0)
// 予測される時間（1分単位）
const _estimatedDetailMinutes = ref(0)
// ドラッグインデックス
const _dragIndex = ref(0)
// ドラッグ中か
const _isDragging = ref(false)
// 画像選択済か
const _isImageSelected = ref(false)

// バリデーション用共通ルール
const _requiredRules = [(v: any) => {
  if (v !== '') {
    return true
  }
  return CONSTANTS.FORM_VALIDATION_NO_INPUT_ERROR_TXT
},]

//======================================================
// computed
//======================================================

/**
 * カテゴリ名の一覧取得
 * 
 * @returns 
 */
const getCategoryNames = computed((): string[] => {
  let names = new Array<string>()
  CONSTANTS.SCRIPT_CATEGORIES.forEach((item) => {
    names.push(item.name!)
  })

  return names
})

//======================================================
// onMounted
//======================================================

/**
 * onMounted
 * ・キャラクターを1件に
 * ・背景画像をセット
 * ・台本が選択されている場合、フォームにセット
 */
onMounted(async () => {
  try {
    // キャラクターを1件に
    let c = new Charactor()
    c.bgColor = CONSTANTS.CHARACTOR_COLOR_CODE_ITEMS[0].bgColor
    _charactors.value.push(c)

    // 背景画像をセット
    setBGImagePathForCategory()

    // 編集対象の台本がある場合フォームにセット
    if (props.targetScript.id !== 0) {
      setScriptToForm(props.targetScript)
    }
  } catch (error) {
    console.error(error)
  }
})

/**
 * 台本データをformValsの値にセット
 * 
 * @param script 
 */
const setScriptToForm = (script: Script) => {
  try {
    // フォーム要素にセット
    _formVals.title = script.title
    _formVals.category = script.category
    _formVals.actorCount = script.actorCount
    _formVals.hasDualRole = Boolean(Number(script.hasDualRole))
    _formVals.actorCount = Number(script.actorCount)
    _formVals.actorManCount = Number(script.actorManCount)
    _formVals.actorWomanCount = Number(script.actorWomanCount)
    _formVals.actorEtcCount = Number(script.actorEtcCount)
    _formVals.description = script.description
    _formVals.scriptBody = script.scriptBody
    _formVals.charaCount = Number(script.charactors.length)
    _formVals.hasAgeLimit = Boolean(Number(script.hasAgeLimit))
    _formVals.authorName = useLoginUserStore().user.name
    _formVals.minutes = script.minutes

    // 背景画像をセット
    if (script.bgImageUrl !== '') {
      _formVals.bgImageUrl = script.bgImageUrl
      // タイトルをセット
      setBgImageTitleForEditFor()
    }
    // タグをセット
    if (script.tagsTxt !== '') {
      _formVals.tags = script.getTagTxts()
      _formVals.tagsTxt = script.tagsTxt
    }

    // 選択されたファイル名をセット
    useScriptStore().uploadSelectedFileName = script.title
    // セリフに変換
    _words.value = scriptTextManager.useGetWordsFromScriptText(script.scriptBody)
    // 文字数、時間をセット
    setScriptTextLength(script.scriptBody)
    // キャラクターをセット
    _charactors.value = script.charactors

    // キャラクターの色をセット
    _charactors.value.forEach(c => {
      console.log("[set charactor color for edit.]")
      console.log(c)
      c.setColorsFromBgHexColor()
      console.log(c)
    })

    // キャラクターからセリフをセット
    setWordsFromCharactors()
  } catch (error) {
    console.error(error)
  }
}

/**
 * キャラクターからセリフをセット
 */
const setWordsFromCharactors = () => {
  try {
    // キャラクターをセット
    for (let i = 0; i < _charactors.value.length; i++) {
      let c = _charactors.value[i]
      // IDをクリア
      c.id = 0
      // 背景色から各種色をセット
      c.setColorsFromBgHexColor()

      _charactors.value[i] = c
      // セリフに色をセット
      _words.value.forEach(w => {
        if (w.charaName.indexOf(c.name) !== -1) {
          /*
          w.charaNameBgColor = c.bgColorWithOpacity
          w.charaNameBorderColor = c.borderColorWithOpacity //scriptTextManager.useGetThickBorderColorFromBgColor(c.bgColor)
          w.charaNameFontColor = c.fontColor
          */
          w.charaNameBgColor = c.getBgColorForView()
          w.charaNameBorderColor = c.getBorderColorForView()
          w.charaNameFontColor = c.getFontColorForView()          
        }
      })
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * 背景画像のタイトルをセット
 * ・編集時なら選択されたURLからセット
 */
const setBgImageTitleForEditFor = () => {
  try {
    if (_formVals.bgImageUrl === '' || _formVals.bgImageUrl === null || _formVals.bgImageUrl === undefined) {
      return
    }

    for (let i = 0; i < CONSTANTS.SCRIPT_POST_FORM_VALS_BG_IMAGE_ITEMS.length; i++) {
      let item = CONSTANTS.SCRIPT_POST_FORM_VALS_BG_IMAGE_ITEMS[i]
      if (_formVals.bgImageUrl.includes(item.path)) {
        _formVals.bgImageTitle = item.title

        return
      }
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * 背景画像を選択されたカテゴリからセット
 */
const setBGImagePathForCategory = () => {
  const DEFAULT_IMAGE_CATEGORY_NUM = 0
  const runtimeConfig = useRuntimeConfig()

  // デフォルト
  if (_formVals.category === '' && _formVals.bgImageUrl === '') {
    let sc = CONSTANTS.SCRIPT_CATEGORIES[DEFAULT_IMAGE_CATEGORY_NUM]
    _formVals.bgImageUrl = CONSTANTS.IMAGE_BG_R_DIR_PATH_PREFIX + sc.bgImageName

    return
  }

  for (let i = 0; i < CONSTANTS.SCRIPT_CATEGORIES.length; i++) {
    let sc = CONSTANTS.SCRIPT_CATEGORIES[i]
    if (sc.name === _formVals.category) {
      _formVals.bgImageUrl = CONSTANTS.IMAGE_BG_R_DIR_PATH_PREFIX + sc.bgImageName
    }
  }
}

//======================================================
// method
//======================================================

/**
 * イベント 背景画像選択用プルダウンクリック
 */
const onBGImageSelectClick = async () => {
  try {
    useUiEventStore().uiEvent.isSelectBgImgDialogShowing = true
  } catch (error) {
    console.error(error)
  }
}

/**
 * イベント タグ選択用プルダウンクリック
 */
const onTagSelectClick = async () => {
  try {
    useUiEventStore().uiEvent.isSelectScriptTagDialogShowing = true
  } catch (error) {
    console.error(error)
  }
}

/**
 * イベント セリフクリック
 */
function onClickWordItem(charaName: string) {
  try {
    console.log('onClickWordItem')
    console.log(charaName)
  } catch (error) {
    console.error(error)
  }
}

/**
 * イベント 削除ボタンクリック
 */
const onDeleteButtonClick = async () => {
  try {
    const txt = CONSTANTS.CONFIRM_MSG_DELETE_SCRIPT_PREFIX + _formVals.title + CONSTANTS.CONFIRM_MSG_DELETE_SCRIPT_POSTFIX

    //　確認ダイアログ表示
    let res = await showConfirmDialog(txt)
    if (!res) {
      return
    }
    // 削除
    res = await phpApiManager.usePostDeleteScript(useScriptStore().targetScript.id, useLoginUserStore().user, useAccessTokenStore().accessToken)
    if (!res) {
      alert('削除に失敗しました。')

      return
    }

    alert('台本が削除されました。')
    useScriptStore().targetScript = new Script()
    useScriptStore().watchingScriptId = 0
    useScriptStore().isScriptPostingOrEditting = false
    navigateTo(CONSTANTS.PAGE_NAME_SCRIPTS)
  } catch (error) {
    console.error(error)
  }
}

/**
 * イベント 確認ボタンクリック
 */
const onConfirmButtonClick = async () => {
  try {
    // ログインされていなければ終了
    if (!useLoginUserStore().hasLogined()) {
      useUiEventStore().uiEvent.isLoginDialogShowing = true

      return
    }

    let res = await checkValidation()
    if (!res) {
      return
    }

    // タグを文字列に
    _formVals.tagsTxt = _formVals.tags.toString()

    let tScript = new Script()
    tScript.id = useScriptStore().targetScript.id
    tScript.title = _formVals.title
    tScript.category = _formVals.category
    tScript.actorCount = _formVals.actorCount
    tScript.actorManCount = _formVals.actorManCount
    tScript.actorWomanCount = _formVals.actorWomanCount
    tScript.actorEtcCount = _formVals.actorEtcCount
    tScript.hasDualRole = _formVals.hasDualRole
    tScript.description = _formVals.description
    tScript.scriptBody = _formVals.scriptBody
    tScript.charactors = _charactors.value
    tScript.charaCount = tScript.charactors.length
    tScript.authorName = useLoginUserStore().user.name
    tScript.minutes = _formVals.minutes
    tScript.words = _words.value
    tScript.userId = useLoginUserStore().user.id
    tScript.hasAgeLimit = _formVals.hasAgeLimit
    tScript.reusable = _formVals.reusable
    tScript.bgImageUrl = _formVals.bgImageUrl
    tScript.thumImageUrl = _formVals.thumImageUrl
    tScript.tagsTxt = _formVals.tagsTxt

    // actorSexSummaryをセット
    tScript.setActorSexSummary()

    console.log(tScript)

    // emits
    emits('showDetail', tScript)
  } catch (error) {
    console.error(error)
  }
}

/**
 * バリデーションチェック
 */
async function checkValidation(): Promise<boolean> {
  try {
    // フォームのバリデーション
    const res = await editForm.value.validate()
    // 未入力なら
    if (!res.valid) {
      // カテゴリ未入力
      if (_formVals.category === '') {
        alert('カテゴリが未入力です。')

        return false
      } else {
        alert('入力されていない項目があります。')
      }

      return false
    }

    // 兼役有りの場合、キャラクター数が異なればNG
    if (_formVals.hasDualRole) {
      const sum = _formVals.actorManCount + _formVals.actorWomanCount + _formVals.actorEtcCount
      if (sum !== _formVals.actorCount) {
        alert('演者人数（' + _formVals.actorCount + '人）と演者の男女比の合計（' + sum + '人）が一致しません。')

        return false
      }
      // それ以外の場合、演者数とキャラクター数が異なればNG
    } else {
      if (_charactors.value.length !== _formVals.actorCount) {
        alert('演者人数（' + _formVals.actorCount + '人）とキャラクター数（' + _charactors.value.length + '人）が一致しません。演者人数を変更するか、兼役ありのシナリオの場合は「兼役あり」を選択して下さい。')

        return false
      }
    }
  } catch (error) {
    console.error(error)
  }

  return true
}

/**
 * ドラッグ開始
 * @param i 
 */
const onDragStart = (i: number) => {
  try {
    console.log('drag start ' + i);
    _dragIndex.value = i
    _isDragging.value = true    
  } catch (error) {
    console.error(error)
  }
};

/**
 * ドラッグで他の要素に入ったとき
 * @param index 
 */
const dragEnter = (index: number) => {
  console.log('drag enter ' + index);

  if (index === _dragIndex.value) return;
  const deleteElement = _charactors.value.splice(_dragIndex.value, 1)[0];
  _charactors.value.splice(index, 0, deleteElement);
  _dragIndex.value = index;
};

/**
 * ドラッグ終了
 */
const dragEnd = () => {
  console.log('drop');
  _dragIndex.value = 0
  _isDragging.value = false
};

/**
 * イベント キャラ削除ボタンクリック
 */
const onCharaDeleteButtonClick = async (index: number, cName: string) => {
  try {
    // 確認メッセージを表示
    const txt = '「' + cName + '」を登場人物の入力覧から削除します。よろしいですか？'
    //　確認ダイアログ表示
    let res = await showConfirmDialog(txt)
    if (!res) {
      return
    }

    _charactors.value.splice(index, 1)

    // 演者人数よりもキャラクターが少ない場合、空のキャラクターを追加
    if (_charactors.value.length < _formVals.actorCount) {
      let c = new Charactor()
      c.bgColor = CONSTANTS.CHARACTOR_COLOR_CODE_ITEMS[_charactors.value.length].bgColor
      c.fontColor = scriptTextManager.useGetThickFontColorFromBgColor(c.bgColor)
      c.borderColor = scriptTextManager.useGetThickBorderColorFromBgColor(c.bgColor)
      _charactors.value.push(c)

      // 兼役有りの場合、キャラクター人数を変更
    } else if (_formVals.hasDualRole) {
      _formVals.charaCount = _charactors.value.length
    }

    // セリフに色を改めてセット
    _words.value = scriptTextManager.useSetWordColors(_words.value, _charactors.value)
  } catch (error) {
    console.error(error)
  }
}

/**
 * イベント キャラ追加ボタンクリック
 */
const onPlusCharaButtonClick = async () => {
  try {
    // マックスなら終了
    if (CONSTANTS.SCRIPT_POST_FORM_VALS_CHARA_COUNT.length <= _formVals.charaCount) {
      return
    }

    // 空のキャラクターを追加
    let c = new Charactor()
    c.bgColor = CONSTANTS.CHARACTOR_COLOR_CODE_ITEMS[_charactors.value.length].bgColor
      c.setColorsFromBgHexColor()
    _charactors.value.push(c)

    _formVals.charaCount = _charactors.value.length
  } catch (error) {
    console.error(error)
  }
}

/**
 * イベント キャラ削除ボタンクリック
 */
const onMinusCharaButtonClick = async () => {
  try {
    // 1人なら終了
    if (_formVals.charaCount <= 1) {
      return
    }

    // 最後のキャラをセット
    let c = _charactors.value[_charactors.value.length - 1]
    // 空欄でなければ確認
    if (c.name !== '') {
      // 確認メッセージを表示
      const txt = '「' + c.name + '」を登場人物の入力覧から削除します。よろしいですか？'
      //　確認ダイアログ表示
      let res = await showConfirmDialog(txt)
      if (!res) {
        return
      }
    }

    _charactors.value.splice(_charactors.value.length - 1, 1)


    _formVals.charaCount = _charactors.value.length
  } catch (error) {
    console.error(error)
  }
}

/**
 * 背景画像のパスを返す
 * ・環境変数のAPP_BASE_URLの値を付与
 * 
 * @param imageItem
 * @returns
 */
const getBgImagePathWithAppBaseUrl = (): string => {
  let path = ""

  try {
    path = useRuntimeConfig().public.APP_BASE_URL + _formVals.bgImageUrl
    // スラッシュが2つ以上の場合、1つにする
    path = path.replace(/\/{2,}/g, '/')
  } catch (error) {
    console.error(error);
  }

  return path
}

//======================================================
// emits
//======================================================

/**
 * emits用メソッド　背景画像選択
 * 
 * @param item
 */
const onBgImageSelect = async(item: CONSTANTS.BgImageItem) => {
  try {
    _formVals.bgImageTitle = item.title
    _formVals.bgImageUrl = item.path
    console.log(_formVals.bgImageTitle)
    _isImageSelected.value = true
  } catch (error) {
    console.error(error)
  }
}

/**
 * emits用メソッド　タグ選択
 */
const onTagSelectDialogCloseButtonClick = async(tags: Array<string>) => {
  try {
    _formVals.tags = tags
    _formVals.tagsTxt = tags.join(' ')
  } catch (error) {
    console.error(error)
  }
}

/**
 * emits用メソッド　ファイル選択
 */
const onFileSelect = async(file: File) => {
  try {
    let reader = new FileReader();

    // ファイル読み込みに成功したときの処理
    reader.onload = async function (e) {
      const codes = new Uint8Array(e.target?.result as ArrayBuffer);
      // 文字コード変換
      let fileContent = await scriptTextManager.useConvertEncodingToUTF8(codes)
      // キャラクターとセリフをセット
      setCharactorsAndWordsFromScriptContent(fileContent)
    }
    // ファイルの読み込み実行
    reader.readAsArrayBuffer(file);

    // タイトルが空ならファイル名をセット
    if (_formVals.title === '') {
      _formVals.title = file.name
      // 拡張子をカット
      _formVals.title = _formVals.title.replace(/\.[^/.]+$/, '')
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * 台本からキャラクターとセリフをセット
 */
const setCharactorsAndWordsFromScriptContent = async(scriptBody: string) => {
  try {
    let alreadyExistCharas = new Array<Charactor>()

    // 本文をセリフに変換
    _words.value = scriptTextManager.useGetWordsFromScriptText(scriptBody)
    // 文字数、時間をセット
    setScriptTextLength(scriptBody)

    // 編集中は既存のキャラクターをセット
    if (useScriptStore().edittingScriptId !== 0) {     
      alreadyExistCharas = _charactors.value
    }

    // キャラクターをセット
    _charactors.value = await scriptTextManager.useGetCharactorsFromWords(_words.value, alreadyExistCharas)
   
    // キャラが0の場合、1件に
    if (_charactors.value.length == 0) {
      _charactors.value = new Array<Charactor>()
      let c = new Charactor()
      c.bgColor = CONSTANTS.CHARACTOR_COLOR_CODE_ITEMS[0].bgColor
      //c.setColorsFromBgHexColor()      
      _charactors.value.push(c)    
    }

    if (_charactors.value.length < _formVals.actorCount) {
      for (let i = _charactors.value.length; i < _formVals.actorCount; i++) {
        let c = new Charactor()
        c.bgColor = CONSTANTS.CHARACTOR_COLOR_CODE_ITEMS[i].bgColor
        _charactors.value.push(c) 
      }
    }

    // キャラクター数をセット
    _formVals.charaCount = _charactors.value.length
    // 本文をセット
    _formVals.scriptBody = scriptBody
    // 保存済のキャラ説明、性別、色をセット
    setCharactorDataFromMyCharactors(alreadyExistCharas)

    // セリフに色をセット
    _words.value = scriptTextManager.useSetWordColors(_words.value, _charactors.value)
    
    // 時間が初期値の場合のみ、予測時間でフォームの値をセット
    if (_formVals.minutes = CONSTANTS.SCRIPT_PORT_FORM_MIN_INIT_VAL) { 
      _formVals.minutes = _estimatedRoughMinutes.value
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * 台本の文字数をセット
 */
const setScriptTextLength = (scriptBody: string) => {
  try {
    // 文字数をセット
    _textLength.value = scriptTextManager.useGetTxtLengthWithoutRuby(scriptBody)
    // 文字数をカンマ区切りでセット
    _textLengthStr.value = _textLength.value.toLocaleString()
    // 予測時間を10分単位でセット    
    _estimatedRoughMinutes.value = scriptTextManager.useGetMinutesFromTextLengthBy10MinUnit(_textLength.value)
    // 予測時間を1分単位でセット   
    _estimatedDetailMinutes.value = scriptTextManager.useGetMinutesFromTextLengthBy1MinUnit(_textLength.value)
  } catch (error) {
    console.error(error)
  }
}

/**
 * 保存済のキャラクターから色、説明等をセット
 */
const setCharactorDataFromMyCharactors = (tmpCharactors: Array<Charactor>) => {
  try {
    tmpCharactors.forEach((c, i) => {
      _charactors.value.forEach((nc, ni) => {
        if (c.name === nc.name) {
          _charactors.value[ni] = c
        }
      })
    })

    // _charactors.valueの並び順をtmpCharactorsに合わせる
    let tmp = new Array<Charactor>()
    tmpCharactors.forEach((c, i) => {
      _charactors.value.forEach((nc, ni) => {
        if (c.name === nc.name) {
          tmp.push(nc)
        }
      })
    })
  } catch (error) {
    console.error(error)
  }
}

/**
 * emits カラーコード選択時
 * 
 * @param colorCodeItem
 * @param charaIndex
 */
const onColorCodeSelected = (colorCodeItem: CONSTANTS.ColorCodeItem, charaIndex: number) => {
  try {
    _charactors.value[charaIndex].bgColor = colorCodeItem.bgColor
    _charactors.value[charaIndex].borderColor = colorCodeItem.borderColor
    _charactors.value[charaIndex].fontColor = colorCodeItem.fontColor
    _charactors.value[charaIndex].setColorsFromBgHexColor()
    console.log('[onColorCodeSelected]')
    console.log(_charactors.value[charaIndex])

    // 対象キャラクターをセット
    const targetChara = _charactors.value[charaIndex]

    /*
    // 背景色を元に各種色を再セット    
    _charactors.value.forEach(c => {
      console.log(c)
      c.setColorsFromBgHexColor()
      console.log(c)
    })*/

    // セリフに色をセット
    _words.value = scriptTextManager.useSetTargetChatactorWordColors(_words.value, targetChara)
    //_words.value = scriptTextManager.useSetWordColors(_words.value, _charactors.value)    
  } catch (error) {
    console.error(error)
  }
}

//======================================================
// watch
//======================================================

/**
 * 演者人数の監視
 * ・兼役なしの場合、演者人数とキャラ人数を合わせる
 */
watch(() => _formVals.actorCount,
  (v) => {
    try {
      // 兼役なしの場合、演者人数とキャラ人数を合わせる
      if (!_formVals.hasDualRole) {
        _formVals.charaCount = _formVals.actorCount
      }
    } catch (error) {
      console.error(error)
    }
  }
)

/**
 * キャラクター人数の監視
 */
watch(() => _formVals.charaCount,
  (newValue) => {
    try {
      // キャラ人数が増えた場合、追加
      if (_charactors.value.length < _formVals.charaCount) {
        for (let i = _charactors.value.length; i < _formVals.charaCount; i++) {
          let c = new Charactor()
          c.bgColor = CONSTANTS.CHARACTOR_COLOR_CODE_ITEMS[i].bgColor
          c.setColorsFromBgHexColor()
          _charactors.value.push(c)
        }
        // 減っていたらキャラクター削除
      } else {
        _charactors.value = _charactors.value.slice(0, _formVals.charaCount)
      }
    } catch (error) {
      console.error(error)
    }
  })

/**
 * カテゴリの監視
 * ・画像パスをセット（画像が明示的に選択されていない場合）
 */
watch(() => _formVals.category,
  (v) => {
    try {
      if (!_isImageSelected.value) {
        setBGImagePathForCategory()
      }
    } catch (error) {
      console.error(error)
    }
  }
)
</script>
<!--
//======================================================
//
// HTML
//
//======================================================
-->
<template>
  <v-form ref="editForm">
    <v-card id="script-info" class="pt-0 pb-0 px-0"       
      :class="{
        'no-border': useDisplay().smAndDown.value,
      }"   
      flat
      >
      <header id="header" :style="{ backgroundImage: `url('${getBgImagePathWithAppBaseUrl()}')` }"></header>

      <v-row>
        <v-col cols="10" class="mx-6 mt-4 text-caption">
          <template v-if="useScriptStore().edittingScriptId === 0">
            <p>台本の新規投稿を行います。初回投稿前には利用規約をご確認ください。</p>
            <template v-if="!useLoginUserStore().hasLogined()">
              <p><strong>投稿にはログインが必要です。</strong></p>
            </template>
          </template>
          <template v-if="useScriptStore().edittingScriptId !== 0">
            <p>台本の編集を行います。修正後、「編集内容を確認」を押してください。</p>
          </template>
        </v-col>
      </v-row>

      <h4 class="mt-10 px-4 mb-4">
        <v-icon class="mr-2 ml-2 mb-1" color="green-lighten-2">mdi-pencil</v-icon>台本投稿
        <v-divider class="mt-2" />
      </h4>

      <!-- 削除ボタン -->
      <v-row class="text-right mx-0">
        <v-col cols="12" class="mr-12 mt-0">
          <v-btn v-show="useScriptStore().edittingScriptId !== 0" color="error" variant="outlined" rounded
            @click="onDeleteButtonClick">
            <template v-slot:prepend><v-icon>mdi-delete-circle</v-icon></template>
            この台本を削除</v-btn>
        </v-col>
      </v-row>

      <v-row justify="center" class="form-container mt-6" id="basic-info">
        <v-col cols="12" class="input-row-clm px-4">
          <template v-if="!useDisplay().mobile.value">
            <h5 class="input-htxt">タイトル</h5>
          </template>
          <v-text-field v-model="_formVals.title" 
            class="short-width"
            :label="useDisplay().mobile.value ? 'タイトル' : ''"
            :rules="_requiredRules" 
            placeholder="例：星の王子さま" 
            variant="outlined" density="compact" />
        </v-col>

        <v-col cols="12" class="input-row-clm px-4">
          <template v-if="!useDisplay().mobile.value">         
            <h5 class="input-htxt">カテゴリ</h5>
          </template>   
          <v-select v-model="_formVals.category"
            class="short-width"          
            :items="getCategoryNames"               
            :label="useDisplay().mobile.value ? 'カテゴリ' : ''"
            :rules="_requiredRules"
            density="compact" variant="outlined"               
            />
        </v-col>

        <v-col cols="12" class="input-row-clm px-4">
          <template v-if="!useDisplay().mobile.value">         
            <h5 class="input-htxt">時間</h5>
          </template>   
          <v-select v-model="_formVals.minutes" 
            class="short-width"
            :items="CONSTANTS.SCRIPT_POST_SEARCH_FORM_VALS_MINUTES"
            :label="useDisplay().mobile.value ? '時間' : ''"
            :rules="_requiredRules" 
            variant="outlined"  density="compact" 
            />
        </v-col>      

        <v-col cols="12" class="input-row-clm px-4">
          <template v-if="!useDisplay().mobile.value">         
            <h5 class="input-htxt">演者人数</h5>
          </template>   
          <v-select
            class="short-width"          
            v-model="_formVals.actorCount"
            :items="CONSTANTS.SCRIPT_POST_FORM_VALS_ACTOR_COUNT"
            :label="useDisplay().mobile.value ? '演者人数' : ''"              
            :rules="_requiredRules"
            variant="outlined"  density="compact"
            />
        </v-col>

        <v-col cols="12" class="input-row-clm px-4">
          <template v-if="!useDisplay().mobile.value">         
            <h5 class="input-htxt">兼役の有無</h5>
          </template>   
          <v-select
            class="short-width"
            v-model="_formVals.hasDualRole"
            :items="CONSTANTS.SCRIPT_POST_FORM_VALS_HAS_DUAL_ROLE" 
            :label="useDisplay().mobile.value ? '兼役の有無' : ''"         
            :rules="_requiredRules" 
            variant="outlined" density="compact"
            />
        </v-col>

        <!-- 演者の男女比。兼役有りの場合のみ表示 -->
        <template v-if="_formVals.hasDualRole">
          <v-col cols="12" class="mt-0 mb-4 pt-0 px-4">
            <template v-if="!useDisplay().mobile.value">      
              <h5 class="input-htxt">演者の男女比
                <small class="pl-4">※必要な演者さんの男女比を記載してください。</small>
              </h5>
            </template>
            <template v-else>
              <p class="input-htxt mb-2 my-0 py-0 text-caption text-grey-darken-2 text-left">
                ※必要な演者さんの男女比を記載してください。
              </p>
            </template>

            <v-row class="actor-sex-row">
              <div class="actor-sex">
                <v-select class="chara-sex-count" 
                  v-model="_formVals.actorManCount"
                  :items="CONSTANTS.SCRIPT_POST_FORM_VALS_MAN_COUNTS"                   
                  :label="useDisplay().mobile.value ? '男性演者' : ''"                           
                  variant="outlined" density="compact"
                  />
                <v-icon class="actor-sex-icon" color="blue-lighten-2">mdi-gender-male</v-icon>
              </div>
              <div class="actor-sex">
                <v-select class="chara-sex-count" 
                  v-model="_formVals.actorWomanCount"
                  :items="CONSTANTS.SCRIPT_POST_FORM_VALS_WOMAN_COUNTS"                   
                  :label="useDisplay().mobile.value ? '女性演者' : ''"                           
                  variant="outlined" density="compact"
                />
                <v-icon class="actor-sex-icon" color="pink-accent-1">mdi-gender-female</v-icon>
              </div>
              <div class="actor-sex">
                <v-select class="chara-sex-count" 
                  v-model="_formVals.actorEtcCount"
                  :items="CONSTANTS.SCRIPT_POST_FORM_VALS_ETC_COUNTS"                   
                  :label="useDisplay().mobile.value ? '性別不問' : ''"                           
                  variant="outlined" density="compact"
                  />
              </div>
            </v-row>
          </v-col>
        </template>
      
        <v-col cols="12" class="input-row-clm px-4 my-0 py-0">
          <template v-if="!useDisplay().mobile.value">         
            <h5 class="input-htxt">ヘッダ画像</h5>
          </template>               
          <v-combobox
            class="short-width"          
            v-model="_formVals.bgImageTitle"
            :label="useDisplay().mobile.value ? 'ヘッダ画像' : ''" 
            @click="onBGImageSelectClick"   
            variant="outlined" density="compact"              
          >
          </v-combobox>
        </v-col>                    

        <v-col cols="12" class="input-row-clm px-4 my-0 py-0">
          <template v-if="!useDisplay().mobile.value">         
            <h5 class="input-htxt">台本使用規定</h5>
          </template>   
          <v-select 
            class="short-width"          
            v-model="_formVals.reusable" 
            :items="CONSTANTS.SCRIPT_POST_FORM_VALS_POLICIES"
            :label="useDisplay().mobile.value ? '台本使用規定' : ''"                  
            variant="outlined" density="compact" />
        </v-col>          

        <v-col cols="12" class="input-row-clm px-4 my-0 py-0">
          <template v-if="!useDisplay().mobile.value">         
            <h5 class="input-htxt">タグ</h5>
          </template>               
          <v-combobox
            id="tag-select-combobox"
            v-model="_formVals.tags"
            :label="useDisplay().mobile.value ? 'タグ選択' : ''" 
            @click="onTagSelectClick"   
            chips multiple
            variant="outlined" density="compact"              
          >
          </v-combobox>
        </v-col>   

        <!-- 本文 -->
        <v-col cols="12" class="px-4 mt-0 mb-0 py-0">
          <template v-if="!useDisplay().mobile.value">         
            <h5 class="input-htxt">台本説明</h5>
          </template>  
          <v-textarea 
            class="py-0 textarea-basic-description" 
            v-model="_formVals.description"              
            placeholder="台本の説明を記入してください。" 
            :rules="_requiredRules"
            variant="outlined" rows="5" auto-grow 
            density="compact"
          />
        </v-col>

        <!-- ファイル選択ボタン -->
        <v-col cols="12" class="px-4 my-4 py-0">
          <script-file-upload-button @onFileSelect="onFileSelect" />
          <h5 class="input-htxt pt-2"><small class="sub-explain ml-2">※.txt形式のファイルを投稿できます。</small>
          </h5>
        </v-col>
      </v-row>

      <!-- 登場人物 -->
      <h4 class="mt-12 px-4">
        <v-icon class="mr-2 ml-2 mb-1" color="green-lighten-2">mdi-pencil</v-icon>登場人物の入力
        <v-divider class="mt-2" />
      </h4>
      <v-row justify="center" class="form-container" id="chara-info">
        <v-col cols="6" class="pt-8" v-show="_formVals.hasDualRole">
          <v-select variant="outlined" :items="CONSTANTS.SCRIPT_POST_FORM_VALS_CHARA_COUNT" label="キャラクター人数"
            density="compact" class="mx-0" v-model="_formVals.charaCount" />
        </v-col>
        <v-col cols="6"></v-col>

        <v-col cols="12" id="chara-table-container">
          <v-table justify="center" class=" form-container mt-0">
            <thead>
              <tr>
                <th class="text-left">キャラ名</th>
                <th class="text-left">演者の性別</th>
                <th class="text-left">説明</th>
                <th class=" td-color">色分け</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="( c, i ) in _charactors" :key="i">
                <tr :draggable="true" @dragstart="onDragStart(i)" @dragenter="dragEnter(i)" @dragover.prevent
                  :class="{ 'chara-row': true, 'dragging': i == _dragIndex && _isDragging }"
                  @dragend="dragEnd">
                  <td class="td-chara-name text-center">
                    <v-icon :color="c.bgColor" v-if="!useDisplay().mobile.value"
                      class="mr-1 chara-color-circle">mdi-circle</v-icon>
                    <v-text-field variant="outlined" v-model="c.name" placeholder="例：田中" density="compact"
                      class="mt-4 input-chara-name" :rules="_requiredRules" />
                  </td>
                  <td class="td-chara-sex text-center ">
                    <v-select v-if="!useDisplay().mobile.value" variant="outlined"
                      :items="CONSTANTS.SCRIPT_POST_FORM_VALS_CHARA_SEX" density="compact"
                      class="chara-sex-v-select mx-0 mt-4" v-model="c.sex" :rules="_requiredRules" />
                    <v-select v-if="useDisplay().mobile.value" variant="outlined"
                      :items="CONSTANTS.SCRIPT_POST_FORM_VALS_CHARA_SEX_FOR_MOBILE" density="compact" menu-icon=""
                      class="chara-sex-v-select mx-0 mt-4" v-model="c.sex" :rules="_requiredRules" />

                    <template v-if="!useDisplay().mobile.value">
                      <v-icon v-if="c.sex.indexOf('男') !== -1" class="sex-icon"
                        color="blue-lighten-2">mdi-gender-male</v-icon>
                      <v-icon v-if="c.sex.indexOf('女') !== -1" class="sex-icon"
                        color="pink-accent-1">mdi-gender-female</v-icon>
                    </template>
                  </td>
                  <td class="td-chara-description text-center">
                    <textarea v-model="c.description" placeholder=" キャラの説明を記入"></textarea>
                  </td>
                  <td class="td-chara-color text-center">
                    <script-color-code-select-menu 
                      :charaName="c.name"
                      :charaIndex="i"
                      :selectedBgColor="c.bgColor"
                      :selectedBorderColor="c.borderColor"
                      @onColorCodeSelected="onColorCodeSelected"
                    />

                    <!--
                    <input id="input-color" type="color" list="color-list" @change="onChangeColorInput"
                      v-model="c.bgColor">
                    <datalist id="color-list">
                      <template v-for="v in CONSTANTS.CHARACTOR_COLOR_CODE_ITEMS">
                        <option :value="v.bgColor"></option>
                      </template>
                    </datalist>
                  -->
                  </td>
                </tr>
              </template>
            </tbody>
          </v-table>

          <!-- 削除ボタン表示領域 -->
          <div id="chara-delete-buttons-container" v-if="!useDisplay().mobile.value">
            <template v-for="( c, i ) in _charactors" :key="i">
              <div class="chara-delete-button-container" v-show="2 <= _charactors.length">
                <v-btn color="" density="compact" class="chara-delete-button"
                  @click="onCharaDeleteButtonClick(i, c.name)">✕
                  削除</v-btn>
              </div>
            </template>
          </div>

          <!-- ドラッグ&ドロップ説明-->
          <template v-if="!useDisplay().mobile.value">
            <p id="drag-explain" class="text-right mt-2 text-grey">
              <small class="mr-4">※キャラの順番を入れ替えたい時は行をドラッグして下さい。</small>
            </p>
          </template>
          <!-- プラス、マイナスボタン -->
          <template v-if="useDisplay().mobile.value">
            <p id="drag-explain" class="text-right mt-2 text-grey">
              <template v-if="1 < _charactors.length">
                <v-btn icon="mdi-minus" density="compact" rounded variant="outlined" class="mr-2"
                  @click="onMinusCharaButtonClick"></v-btn>
              </template>
              <template v-if="_charactors.length < CONSTANTS.SCRIPT_POST_FORM_VALS_CHARA_COUNT.length">
                <v-btn icon="mdi-plus" density="compact" rounded variant="outlined"
                  @click="onPlusCharaButtonClick"></v-btn>
              </template>
            </p>
          </template>
        </v-col>
      </v-row>

      <v-row v-if="_words.length != 0" class="text-center mt-12 px-4 mb-0" justify="center" t>
        <v-col cols="12" class="mb-12 pb-6">
          <v-btn id="submit-button" color="info" @click="onConfirmButtonClick">
            <template v-slot:prepend><v-icon>mdi-check-circle</v-icon></template>

            <!-- 新規投稿 -->
            <template v-if="useScriptStore().targetScript.id === 0">
              投稿内容を確認</template>
            <!-- 編集 -->
            <template v-if="useScriptStore().targetScript.id !== 0">
              編集内容を確認</template>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <!-- 台本プレビュー -->
    <v-card id="preview-card" v-show="_words.length != 0"
      flat
      >
      <h3 class="blue mt-4 mb-4 mx-4 px-4 text-center text-body-1 font-weight-bold">
        <v-icon class="mr-2 title-icon" color="blue-lighten-2">mdi-note-edit</v-icon>台本プレビュー（約{{ _estimatedDetailMinutes }}分
        <span v-if="_formVals.minutes == CONSTANTS.SCRIPT_MAX_MINUTES">{{
          CONSTANTS.SCRIPT_MAX_MINUTES_ADD_TXT }}</span> / {{
            _textLengthStr
          }}字）
      </h3>

      <v-divider class="mt-2" color="black" />
      <script-detail-container-script-body :words="_words" :selectedNames="_selectedNames"
        @onClickWordItem="onClickWordItem" />
    </v-card>

    <!-- 背景画像選択用ダイアログ -->
    <script-bg-img-select-dialog
      @onBgImageSelect="onBgImageSelect" />
  
    <!-- タグ選択用ダイアログ -->
    <script-tag-select-dialog
      :selctedTags="_formVals.tags"
      @onTagSelectDialogCloseButtonClick="onTagSelectDialogCloseButtonClick"
    />
  </v-form>
</template>
<!--
//======================================================
//
// SCSS
//
//======================================================
-->

<style lang="scss" scoped>
#script-detail-container {
  width: 100%;
  height: fit-content;
  min-height: 100vh;
  border: solid 0px #999999;
  background-color: rgba(255, 255, 255, 0.3);
  z-index: 10;
}

#header {
  height: $content-header-height;
  background-repeat: repeat-x;
  background-size: cover;
  background-position: center center;
  //background-image: url("/image/bg/love-m.jpg");
  /** 半透明の黒に */
  background-color: rgba(0, 0, 0, 0.5);
}

.v-container {
  width: 100%;
  height: fit-content;
}

.v-card {
  border: solid 1px $card-border-color;
}

.no-border {
  border: solid 0px #999999 !important;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.2) !important;  
}

.form-container {
  width: 100%;
  max-width: 800px;
  border: solid 0px #999999;
}

h4 small {
  color: #6b6b6b;
  font-weight: normal;
}

h5.input-htxt {
  color: #616161;
}

.input-row-clm {
  height: 70px;
  border: solid 0px #999999;
  padding: 0px;
}

.input-row-clm-tag {
  margin-top: -20px;
  padding-top: 0px;
  border: solid 0px #999999;
}

.actor-sex-row {
  max-width: 600px;
  display: flex;
  flex-direction: column;
  margin-top: 0px;
  margin-left: 0px;
}

@media (min-width: 768px) {
  .actor-sex-row {
    flex-direction: row;
  }
}

#basic-info .actor-sex {
  position: relative;
  padding-right: 4px;
  border: solid 0px #999999;
}

@media (max-width: 768px) {
  #basic-info .actor-sex {
    width: 100%;
    height: fit-content;
    padding-right: 12px;
  }
}

#basic-info .actor-sex-icon {
  position: absolute;
  top: 12px;
  left: 12px;
  font-size: 100%;
}

@media (max-width: 768px) {
  #basic-info .actor-sex-container {
    margin-top: -20px;
  }
}

.sub-explain {
  color: #6b6b6b;
  font-size: 90%;
  font-weight: normal;
}

input {
  background-color: #F4F7FA;
  border: solid 1px #cbcbcb;
  border-radius: 4px;
}

#basic-info {
  width: 100%;
  margin: auto;
  border: solid 0px #999999;
}

#basic-info input {
  padding: 4px 10px;
  width: 80%;
  min-width: 200px;
}

// 削除ボタン
#delete-button {
  position: absolute;
  top: 166px;
  right: 10px;
  font-size: x-small;
}

.v-table {
  border: solid 1px #9c9c9c;
  border-radius: 4px;
}

.v-table tr {
  border: solid 1px #868686;
}

.v-table td {
  position: relative;
}

#chara-info {
  width: 100%;
  margin: auto;
}

#chara-info th {
  height: 48px;
  background-color: #eaeaea;
  text-align: center !important;
  font-weight: bold;
  font-size: small;
  color: #042405;
  border-right: solid 1px #cacaca;
  border-bottom: solid 1px #9c9c9c;
}

#chara-info tr {
  padding: 8px 0;
}

#chara-info td {
  padding: 0px 4px;
  border-right: solid 1px #cecece;
  //border-top: solid 1px #c9c9c9 !important;
  justify-content: center;
}

#chara-info .th-chara-color {
  border-right: solid 0px #999999;
}

#chara-info .td-chara-name {
  position: relative;
  width: 25%;
  min-width: 100px;
  max-width: 100px;
}

@media (max-width: 768px) {
  #chara-info .td-chara-name {
    padding: 0px;
  }
}

#chara-info .td-chara-name input {
  width: 70%;
  padding: 4px 10px;
}

#chara-info .td-chara-name .chara-color-circle {
  position: absolute;
  top: 34px;
  left: 4px;
  font-size: small;
}

#chara-info .td-chara-name .input-chara-name {
  width: 90%;
  padding: 4px 10px;
  margin-left: 10px;
}

@media (max-width: 768px) {
  #chara-info .td-chara-name .input-chara-name {
    width: 100%;
    margin: 0px;
    font-size: small;
  }
}

#chara-info .td-chara-sex {
  position: relative;
  width: 20%;
}

#chara-info .td-chara-sex .v-select {
  background-color: transparent;
  z-index: 2;
}

#chara-info .td-chara-sex .sex-icon {
  position: absolute;
  top: 34px;
  left: 14px;
  font-size: small;
  z-index: 1;
}


#chara-info .td-chara-description {
  width: 35%;
  padding: 0px 4px 0px;
  justify-content: center;
  align-items: center
}

@media (max-width: 768px) {
  #chara-info .td-chara-description {
    width: 25%;
  }
}

#chara-info .td-chara-description textarea {
  width: 100%;
  margin: 0px auto !important;
  padding: 8px 8px;
  height: 60px;
  border: solid 1px #b0b0b0;
  border-radius: 4px;
}

#chara-info .td-chara-description .v-textarea {
  padding: 0px !important;
}

#chara-info .td-chara-color {
  width: 10%;
  border-right: solid 0px #999999;
}

#input-color {
  height: 32px;
  border: solid 1px #999999;
  max-width: 80px;
}

@media (max-width: 768px) {
  #input-color {
    max-width: 50px;
  }
}

#submit-button {
  width: 95%;
  max-width: 400px;
  min-height: 80px;
  font-size: x-large;
  font-weight: bold;
}

#preview-card {
  margin-top: 80px;
}

.grey {
  color: grey;
}

#script-import-dialog {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 0;
}

.chara-list-item {
  position: relative;
}

.chara-card {
  position: relative;
  background-color: #ffffff
}

.chara-badge {
  position: absolute;
  top: 20px;
  left: 40px;
  z-index: 10;
}

.chara-list-title {
  display: flex;
  justify-content: flex-start;
  /* 左寄せ */
  align-items: center;
}

.chara-list-subtitle {
  display: flex;
  justify-content: flex-start;
  /* 左寄せ */
  align-items: center;
}


.v-text-field {
  max-width: 600px;
}

.short-width {
  width: 100%;
  max-width: 300px;
}

@media (max-width: 768px) {
  .v-text-field {
    max-width: 600px;
  }
}

#tag-select-combobox {
  max-width: 800px !important;
  background-color: red;
}

.textarea-basic-description {
  width: 100%;
  max-width: 600px;
}

.chara-row {
  position: relative;
}

#chara-table-container {
  position: relative;
}

#chara-delete-buttons-container {
  position: absolute;
  top: 60px;
  right: -100px;
  width: 100px;
  border: solid 0px #999999;
}

.chara-delete-button-container {
  position: relative;
  width: 100%;
  height: 87px;
  border: solid 0px #999999;
}

.chara-delete-button {
  position: absolute;
  top: 31px;
  left: 0px;
  font-size: 12px;
  cursor: pointer;
  opacity: 0.5;
}

</style>
