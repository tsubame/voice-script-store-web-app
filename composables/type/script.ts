//======================================================
//
// 台本データ
//
// [メソッド]
// - setCharaColorAndWordsFromScriptBody()
//     台本本文からwordsをセット。charactorsの色をセット。
// - setActorSexSummary()
//     actorSexSummaryをセット
// - sortComments()
//     コメントを並び替え
// - checkHasToShowDescriptionOpenCloseButton()
//     説明文のテキストが規定文字数以内かを返す
// - isR18Script()
//     R18台本かを判別
// 
// - getTagTxts()
//     タグをカンマで分割して返す
// - getCategoryTagColor()
//     カテゴリからタグの色を返す
// - getPostedAtTxtForScriptDetail()
//     台本の日付のテキストを返す
// - getShortDescription()
//     説明文に表示するテキスト（省略形）を返す 
// - getTextLength()
//     文字数を返す
// - getTargetCharaWordCount()
//     該当キャラのセリフ数を返す
// - getBgIllustImageUrlWithAppBaseUrl()
//     背景画像のフルURLを返す
// - getBGIllustImagePathFromCategory()
//     カテゴリから背景イラスト画像を返す
// - getBGSimpleImagePathFromCategory()
//     カテゴリからシンプルな背景画像を返す
// - getHtmlTitle()
//     HTMLページのタイトルを返す
// - getShareText()
//     SNSで共有する際のテキストを返す
// - getXShareText()
//     Xで共有する際のテキストを返す
// - getScriptLink()
//     台本のリンクを返す
//
//======================================================

import * as CONSTANTS from '@/composables/etc/constants'
import * as scriptTextManager from '@/composables/util/scriptTextManager'
import Charactor from '@/composables/type/charactor'
import Word from '@/composables/type/word'
import User from '@/composables/type/user'
import Comment from '@/composables/type/comment'

/**
 * 台本データ
 */
export default class Script {
  // ユーザID
  id: number = 0
  // タイトル
  title: string = ''
  // ユーザID
  userId: number = 0
  // 配信者ユーザ名
  authorName: string = ''
  // 演者人数
  actorCount: number = 0
  // 男性演者人数
  actorManCount: number = 0
  // 女性演者人数
  actorWomanCount: number = 0
  // 不問演者人数
  actorEtcCount: number = 0
  // キャラクター人数
  charaCount: number = 0
  // 男女比
  actorSexSummary: string = ''
  // 兼役があるか
  hasDualRole: boolean = false
  // 時間
  minutes: number = 0
  // カテゴリ
  category: string = ''
  // 説明文
  description: string = ''
  // 本文
  scriptBody: string = ''
  // 閲覧数
  watchCount: number = 0
  // お気に入り数
  favCount: number = 0
  // コメント数
  commentCount: number = 0
  // タグ
  tagsTxt: string = ''
  // 許可タグ
  allowTagsTxt: string = ''
  // サムネイル画像のURL
  thumImageUrl: string = ''
  // 背景画像のURL
  bgImageUrl: string = ''
  // 台本URL
  scriptUrl: string = ''
  // BGM名
  bgmName: string = ''
  // 投稿日時
  createdAt: Date = new Date()
  // 年齢制限ありか
  hasAgeLimit: boolean = false
  // TwitterID
  authorTwitterId: string = ''
  // 台本使用規定
  reusable: string = ''
  // キャラクター
  charactors: Charactor[] = []
  //　セリフ
  words: Word[] = []
  // コメント
  comments: Comment[] = []
  // 作者
  authorUser: User = new User()
  // 同じ作者の台本
  sameAuthorScripts: Script[] = []


  //======================================================
  // setCharaColorAndWordsFromScriptBody()
  //======================================================

  /**
   * 台本本文からwordsをセット。
   * ・キャラクターの色をセット
   * ・本文からセリフをセット
   * ・セリフにキャラクターの色をセット
   */
  public setCharaColorAndWordsFromScriptBody() {
    try {
      console.log('[キャラクターと台本セリフをセット開始]')
      // セリフに変換
      let words = scriptTextManager.useGetWordsFromScriptText(this.scriptBody)
      console.log('[本文からセリフをセット]')
      // キャラクターをセット
      let charactors = this.charactors
      // キャラクターをセット
      for (let i = 0; i < this.charactors.length; i++) {
        let c = this.charactors[i]
        // IDをクリア
        c.id = 0
        // 各種色をセット
        c.setColorsFromBgHexColor()

        charactors[i] = c
        // セリフに色をセット
        words.forEach(w => {
          if (w.isTargetCharaWord(c.name)) {
            w.charaNameBgColor = c.getBgColorForView()
            w.charaNameBorderColor = c.getBorderColorForView()
            w.charaNameFontColor = c.getFontColorForView()
          }
        })
      }

      this.words = words
      this.charactors = charactors
    } catch (error) {
      console.error(error)
    }
  }

  //======================================================
  // setActorSexSummary()
  //======================================================

  /**
   * actorSexSummaryをセット
   * 
   * [書式] "男1、女2、不問3"
   * ・兼役なしの場合、キャラクター比率から男女比率をセット
   * ・兼役有りの場合、フォームに入力された値から男女比率をセット
   * ・上記を元に男女比率をテキストでセット
   */
  public setActorSexSummary() {
    try {
      const CONCAT_CHAR = '、'
      const MAN_KEYWORD = '男'
      const WOMAN_KEYWORD = '女'
      this.actorSexSummary = ''

      // 兼役なしの場合、キャラクター比率から男女比率をセット
      if (!this.hasDualRole) {
        this.actorManCount = 0
        this.actorWomanCount = 0
        this.actorEtcCount = 0

        this.charactors.forEach((c: Charactor) => {
          if (c.sex.includes(MAN_KEYWORD)) {
            this.actorManCount += 1
          } else if (c.sex.includes(WOMAN_KEYWORD)) {
            this.actorWomanCount += 1
          } else {
            this.actorEtcCount += 1
          }
        });
      }

      if (this.actorManCount !== 0) {
        this.actorSexSummary = CONSTANTS.SEX_MALE + this.actorManCount + CONCAT_CHAR
      }
      if (this.actorWomanCount !== 0) {
        this.actorSexSummary += CONSTANTS.SEX_FEMALE + this.actorWomanCount + CONCAT_CHAR
      }
      if (this.actorEtcCount !== 0) {
        this.actorSexSummary += CONSTANTS.SEX_ETC + this.actorEtcCount + CONCAT_CHAR
      }

      // 最後のCONCAT_CHARを削除
      this.actorSexSummary = this.actorSexSummary.slice(0, -1)

      console.log(this.actorSexSummary)
    } catch (error) {
      console.error(error);
    }
  }

  //======================================================
  // sortComments()
  //======================================================

  /**
   * コメントを並び替え
   * ・返信コメントは親コメントの下に表示
   */
  public sortComments() {
    try {
      let cms: Comment[] = []

      // コメントの件数ループ
      this.comments.forEach((c: Comment) => {
        // 返信でなければそのままセットし、返信コメントもセット
        if (c.replyTargetCommentId === 0) {
          cms.push(c)

          this.comments.forEach((cc: Comment) => {
            if (c.id === cc.replyTargetCommentId) {
              cms.push(cc)
            }
          })
        }
      })

      this.comments = cms
    } catch (error) {
      console.error(error)
    }
  }

  //======================================================
  // checkHasToShowDescriptionOpenCloseButton()
  //======================================================

  /**
   * 説明文のテキストが規定文字数以内かを返す
   * 
   * @returns {boolean} 説明文のテキストが規定文字数以内か
   */
  public checkHasToShowDescriptionOpenCloseButton(): boolean {
    try {
      if (CONSTANTS.SCRIPT_DETAIL_DEFAULT_DESCRIPTION_SHOW_LENGTH < this.description.length) {
        return true;
      }
    } catch (error) {
      console.error(error);
    }

    return false;
  }

  //======================================================
  // isR18Script()
  //======================================================  

  /**
   * R18台本かを判別
   * ・タグ、タイトルにR18が含まれていればtrue
   * 
   * @returns {boolean} R18台本か
   */
  public isR18Script(): boolean {
    try {
      const keyword: string = CONSTANTS.R18_KEYWORD
      const aKeyword: string = CONSTANTS.R18_KEYWORD

      if (this.title.includes(keyword)) {
        console.log('[R18台本]' + this.title);
        return true;
      }
      if (this.title.includes(aKeyword)) {
        console.log('[R18台本]' + this.title);
        return true;
      }
    } catch (error) {
      console.error(error)
    }

    return false
  }

  //======================================================
  // getTagTxts()
  //======================================================

  /**
   * タグをカンマで分割して返す
   * ・R18タグは別にセットするためカット
   * 
   * @returns {string[]} タグの配列
   */
  public getTagTxts(): string[] {
    let resTags: string[] = []

    try {
      if (this.tagsTxt === '') {
        return resTags
      }

      console.log(this.tagsTxt)

      let allTags = this.tagsTxt.split(',')
      allTags.forEach((tag: string) => {
        if (tag !== CONSTANTS.TAG_VAL_R18) {
          resTags.push(tag)
        }
      })
    } catch (error) {
      console.error(error)
    }

    return resTags
  }

  //======================================================
  // getCategoryTagColor()
  //======================================================

  /**
   * カテゴリからタグの色を返す
   * 
   * @returns {string} タグの色
   */
  public getCategoryTagColor(): string {
    try {
      // カテゴリを走査
      for (let i = 0; i < CONSTANTS.SCRIPT_CATEGORIES.length; i++) {
        let sc = CONSTANTS.SCRIPT_CATEGORIES[i]
        if (sc.name == this.category) {
          return sc.color!
        }
      }
    } catch (error) {
      console.error(error)
    }

    return '';
  }

  //======================================================
  // getCategoryItem()
  //======================================================

  /**
   * カテゴリのアイテムを返す
   * 
   * @returns {string} タグの色
   */
  public getCategoryItem(): CONSTANTS.ScriptCategoryItem {
    let sc: CONSTANTS.ScriptCategoryItem = {
      name: '',
      color: '',
      bgImageName: ''
    }

    try {
      // カテゴリを走査
      for (let i = 0; i < CONSTANTS.SCRIPT_CATEGORIES.length; i++) {
        let sc = CONSTANTS.SCRIPT_CATEGORIES[i]
        if (sc.name == this.category) {
          return sc
        }
      }
    } catch (error) {
      console.error(error)
    }

    return sc
  }

  //======================================================
  // getPostedAtTxtForScriptDetail()
  //======================================================

  /**
   * 台本の日付のテキストを返す
   * ・[書式] 2021.01.01
   * 
   * @returns {string} 日付のテキスト
   */
  public getPostedAtTxtForScriptDetail(): string {
    try {
      let txt = new Date(this.createdAt).toLocaleDateString().replaceAll('/', '.')

      return txt
    } catch (error) {
      console.error(error)
    }

    return ''
  }

  //======================================================
  // getShortDescription()
  //======================================================

  /**
   * 説明文に表示するテキスト（省略形）を返す
   * 
   * @returns {string} 説明文のテキスト
   */
  public getShortDescription(): string {
    try {
      if (this.description.length > CONSTANTS.SCRIPT_DETAIL_DEFAULT_DESCRIPTION_SHOW_LENGTH) {
        return this.description.substring(0, CONSTANTS.SCRIPT_DETAIL_DEFAULT_DESCRIPTION_SHOW_LENGTH) + '...';
      }
    } catch (error) {
      console.error(error);
    }

    return this.description;
  }

  //======================================================
  // getTextLength()
  //======================================================

  /**
   * 文字数を返す
   * ・textLengthがセットされていればそれを返す
   * ・セットされていなければ、scriptBodyの文字数をルビを除いて返す
   * 
   * @return {number} 文字数
   */
  public getTextLength(): number {
    try {
      let n = scriptTextManager.useGetTxtLengthWithoutRuby(this.scriptBody)

      return n
    } catch (error) {
      console.error(error)
    }

    return 0
  }

  //======================================================
  // getTargetCharaWordCount()
  //======================================================

  /**
   * 該当キャラのセリフ数を返す
   * 
   * @param {string} charaName キャラ名
   * @returns {number} セリフ数
   */
  public getTargetCharaWordCount(charaName: string): number {
    let n = 0

    try {
      this.words.forEach((w: Word) => {
        if (w.charaName !== '') {
          if (w.isTargetCharaWord(charaName)) {
            n++
          }
        }
      })
    } catch (error) {
      console.error(error)
    }

    return n
  }

  //======================================================
  // getBgIllustImageUrlWithAppBaseUrl()
  //======================================================

  /**
   * 背景イラスト画像のフルURLを返す
   * ・BASE URLを付与
   * ・背景がセットされていない場合、カテゴリからセット
   * 
   * @returns {string} 背景イラスト画像のURL
   */
  public getBgIllustImageUrlWithAppBaseUrl(): string {
    let url = this.bgImageUrl
    const runtimeConfig = useRuntimeConfig()

    try {
      if (url === '' || url === null) {
        url = this.getBGIllustImagePathFromCategory()
      }

      url = runtimeConfig.public.APP_BASE_URL + url

      // スラッシュが2つ以上続いている場合、1つにする
      url = url.replace(/([^:]\/)\/+/g, "$1")
    } catch (error) {
      console.error(error)
    }

    return url
  }


  //======================================================
  // getBgSimpleImageUrlWithAppBaseUrl()
  //======================================================

  /**
   * シンプルな背景画像のフルURLを返す
   * ・BASE URLを付与
   * ・背景がセットされていない場合、カテゴリからセット
   * 
   * @returns {string} シンプルな背景画像のURL
   */
  public getBgSimpleImageUrlWithAppBaseUrl(): string {
    let url = this.bgImageUrl
    const runtimeConfig = useRuntimeConfig()

    try {
      url = this.getBGSimpleImagePathFromCategory()
      console.log(url)

      url = runtimeConfig.public.APP_BASE_URL + url

      // スラッシュが2つ以上続いている場合、1つにする
      url = url.replace(/([^:]\/)\/+/g, "$1")
    } catch (error) {
      console.error(error)
    }

    return url
  }


  //======================================================
  // getBGIllustImagePathFromCategory()
  //======================================================

  /**
   * カテゴリから背景イラスト画像を返す
   * 
   * @param {string} category カテゴリ
   * @returns {string} 背景画像
   */
  public getBGIllustImagePathFromCategory(): string {
    let fPath: string = '';

    try {
      const runtimeConfig = useRuntimeConfig()

      if (this.bgImageUrl !== '' && this.bgImageUrl !== null) {
        return this.bgImageUrl
      }

      // カテゴリを走査
      for (let i = 0; i < CONSTANTS.SCRIPT_CATEGORIES.length; i++) {
        let sc = CONSTANTS.SCRIPT_CATEGORIES[i]
        if (sc.name == this.category) {
          fPath = CONSTANTS.IMAGE_BG_R_DIR_PATH_PREFIX + sc.bgImageName

          return fPath
        }
      }
    } catch (error) {
      console.error(error)
    }

    return fPath;
  }


  //======================================================
  // getBGSimpleImagePathFromCategory()
  //======================================================

  /**
   * カテゴリからシンプルな背景画像を返す
   * 
   * @param {string} category カテゴリ
   * @returns {string} 背景画像
   */
  public getBGSimpleImagePathFromCategory(): string {
    let fPath: string = '';

    try {
      const runtimeConfig = useRuntimeConfig()

      // カテゴリを走査
      for (let i = 0; i < CONSTANTS.SCRIPT_CATEGORIES.length; i++) {
        let sc = CONSTANTS.SCRIPT_CATEGORIES[i]
        if (sc.name == this.category) {
          fPath = CONSTANTS.IMAGE_BG_SIMPLE_R_DIR_PATH_PREFIX + sc.bgSimpleImageName

          return fPath
        }
      }
    } catch (error) {
      console.error(error)
    }

    return fPath;
  }

  //======================================================
  // getHtmlTitle()
  //======================================================

  /**
   * HTMLページのタイトルを返す
   * 
   * @returns {string} タイトル
   */
  public getHtmlTitle(): string {
    try {
      return '『' + this.title + '』（' + this.minutes + '分 ' + this.category + ' ' + this.actorCount + '人用）'
    } catch (error) {
      console.error(error)
    }

    return ''
  }

  //======================================================
  // getShareText()
  //======================================================

  /**
   * Xで共有する際のテキストを返す
   * ・書式：
   * 『台本タイトル』（10分コメディ2人用）
   * 作者：作者名様
   * 
   * @param {boolean} isMyScript 自分の台本か
   * @returns {string} 共有テキスト
   */
  public getShareText(isMyScript: boolean): string {
    let txt = ''

    try {
      txt = '『' + this.title + '』（' + this.minutes + '分 ' + this.category + ' ' + this.actorCount + '人用）\n' +
        '作者：' + this.authorUser.name

      if (!isMyScript) {
        txt += '様'
      }

      txt += '\n'
    } catch (error) {
      console.error(error)
    }

    return txt
  }


  //======================================================
  // getXShareText()
  //======================================================

  /**
   * Xで共有する際のテキストを返す
   * ・書式：
   * 『台本タイトル』（10分コメディ2人用）
   * 作者：作者名様（@作者TwitterID）
   * 
   * @param {boolean} isMyScript 自分の台本か
   * @returns {string} 共有テキスト
   */
  public getXShareText(isMyScript: boolean): string {
    let txt = ''

    try {
      txt = '『' + this.title + '』（' + this.minutes + '分 ' + this.category + ' ' + this.actorCount + '人用）\n' +
        '作者：' + this.authorUser.name

      if (!isMyScript) {
        txt += '様'
      }

      if (this.authorUser.revealTwitterScreenName && this.authorUser.twitterScreenName !== '') {
        txt += '（@' + this.authorUser.twitterScreenName + '）'
      }

      txt += '\n'
    } catch (error) {
      console.error(error)
    }

    return txt
  }

  //======================================================
  // getScriptLink()
  //======================================================

  /**
   * 台本のリンクを返す
   * ・scriptUrlがセットされていればそれを返す
   * ・セットされていなければ、BASE URL + '?sid' + idを返す
   * 
   * @return {string} 台本のリンク
   */
  public getScriptLink(): string {
    let url = this.scriptUrl
    const runtimeConfig = useRuntimeConfig()

    try {
      if (url === '' || url === null) {
        url = useRuntimeConfig().public.APP_BASE_URL + '?' + CONSTANTS.URL_QUERY_KEY_SCRIPT_ID + '=' + this.id
      }
    } catch (error) {
      console.error(error)
    }

    return url
  }

  //======================================================
  // getReusableColor()
  //======================================================

  /**
   * 利用規定の色を返す
   * 
   * @returns {string} 利用規定の色
   */
  public getReusableColor(): string {
    let color = ''

    try {
      CONSTANTS.SCRIPT_POST_FORM_VALS_POLICIES.forEach((p: CONSTANTS.SelectItem) => {
        console.log(p.title)
        if (p.title === this.reusable) {
          color = p.color?.toString()!
        }
      })
    } catch (error) {
      console.error(error)
    }

    return color
  }
}
