//======================================================
//
// キャラクターデータ
//
// [メソッド]
//  - getSexTxtForDetail()
//      台本詳細ページ表示用の性別を返す
//  - isMan()
//      男性かを返す
//  - isWoman()
//      女性かを返す
//  - isEtc()
//      不問かを返す
//  - getSexIconName()
//      性別アイコンファイル名を返す
//  - getSexIconColor()
//      性別アイコンの色を返す
//  - setColorsFromBgHexColor()
//      背景色を元に各種色をセット
//
//======================================================

// 定数
import * as CONSTANTS from '@/composables/etc/constants'
import * as scriptTextManager from '@/composables/util/scriptTextManager';

/**
 * キャラクターデータ
 */
export default class Charactor {
  // ID
  id: number = 0
  // 名前
  name: string = ''
  // 性別
  sex: string = ''
  // 背景色
  bgColor: string = ''
  // 文字色
  fontColor: string = ''
  // 線の色
  borderColor: string = ''
  // 説明文
  description: string = ''
  // 台本ID
  scriptId: number = 0

  // 透明度を付与したrgbaの背景色
  bgColorWithOpacity: string = ''
  // 透明度を付与したrgbaの枠線の色
  borderColorWithOpacity: string = ''
  // 透明度を付与したrgbaの文字色
  fontColorWithOpacity: string = ''

  // セリフ数
  wordCount: number = 0

  //======================================================
  // getSexTxtForDetail()
  //======================================================

  /**
   * 台本詳細ページ表示用の性別を返す
   * 
   * @returns {string} 性別
   */
  public getSexTxtForDetail(): string {
    if (this.sex.indexOf('男') !== -1) {
      return CONSTANTS.SEX_MALE
    }
    else if (this.sex.indexOf('女') !== -1) {
      return CONSTANTS.SEX_FEMALE
    }

    return CONSTANTS.SEX_ETC
  }

  //======================================================
  // isMan()
  //======================================================

  /**
   * 男性かを返す
   * 
   * @returns {boolean} 男性かどうか
   */
  public isMan(): boolean {
    if (this.sex.indexOf('男') !== -1) {
      return true
    }

    return false
  }

  //======================================================
  // isWoman()
  //======================================================

  /**
   * 女性かを返す
   * 
   * @returns {boolean} 女性かどうか
   */
  public isWoman(): boolean {
    if (this.sex.indexOf('女') !== -1) {
      return true
    }

    return false
  }

  //======================================================
  // isEtc()
  //======================================================

  /**
   * 不問かを返す
   * 
   * @returns {boolean} 不問かどうか
   */
  public isEtc(): boolean {
    if (this.sex.indexOf('不問') !== -1) {
      return true
    }

    return false
  }

  //======================================================
  // getSexIconName()
  //======================================================

  /**
   * 性別アイコンファイル名を返す
   * 
   * @returns {string} アイコンファイル名
   */
  public getSexIconName(): string {
    if (this.sex.indexOf('男') !== -1) {
      return CONSTANTS.ICONS.ACTOR_MAN.name
    }
    else if (this.sex.indexOf('女') !== -1) {
      return CONSTANTS.ICONS.ACTOR_WOMAN.name
    }

    return CONSTANTS.ICONS.ACTOR_ETC.name
  }

  //======================================================
  // getSexIconColor()
  //======================================================

  /**
   * 性別アイコンの色を返す
   * 
   * @returns {string} アイコンの色s
   */
  public getSexIconColor(): string {
    if (this.sex.indexOf('男') !== -1) {
      return CONSTANTS.ICONS.ACTOR_MAN.color
    }
    else if (this.sex.indexOf('女') !== -1) {
      return CONSTANTS.ICONS.ACTOR_WOMAN.color
    }

    return CONSTANTS.ICONS.ACTOR_ETC.color
  }

  //======================================================
  // setColorsFromBgHexColor()
  //======================================================

  /**
   * 背景色を元に各種色をセット
   * ・背景色に#がない場合に付与
   * ・Vueify風の色をセット
   * ・上記でセットできない場合は以下をセット
   * 　・枠線の色を背景色からやや濃い目でセット
   * 　・文字色を背景色からやや濃い目でセット
   * 
   */
  public setColorsFromBgHexColor() {
    try {
      console.log('setColorsFromBgHexColor()')
      console.log(this)

      // 枠線、フォントの色を初期化      
      this.borderColor = ''
      this.fontColor = ''
      this.borderColorWithOpacity = ''
      this.fontColorWithOpacity = ''
      this.bgColorWithOpacity = ''
      // 背景色に#がない場合に付与
      this.addSharpToBgColor()

      // 定義済みの色があればセット
      if (CONSTANTS.USE_CHARA_BORDER_COLOR_AND_FONT_COLOR_FROM_PRESET) {
        // キャラクターカラーを取得
        let ch = scriptTextManager.useSetDifinedFontAndBorderColors(this)
        // セットできていれば自分にセット
        if (ch.borderColor !== '') {
          this.bgColor = ch.bgColor
          this.borderColor = ch.borderColor
          this.fontColor = ch.fontColor

          console.log('[定義済みのカラーをセット] ' + this.name)
          console.log(ch)
        } else {
          console.log('[定義済みのカラーのセット不可] ' + this.name)
        }
        // Vueify風の色をセット
      } else if (CONSTANTS.SET_CHARA_COLOR_AS_VUETIFY_COLOR) {
        // キャラクターカラーを取得
        let ch = scriptTextManager.useGetColorAsVuetifyThemeCharactor(this)
        // セットできていれば自分にセット
        if (ch.borderColor !== '') {
          this.bgColor = ch.bgColor
          this.borderColor = ch.borderColor
          this.fontColor = ch.fontColor
        } else {
          console.log('[Vuetifyカラーのセット不可]')
        }
      }

      console.log(this)

      // 枠線の色が未設定の場合は処理
      if (this.borderColor === '') {
        console.log('枠線の色を背景色からセット')
        console.log(this)
        // 枠線の色を背景色からセット
        this.setBorderColorFromBgColorDarken()
        console.log(this.borderColor)
        // 文字色が未設定の場合にセット
        this.setFontColorFromBgColorDarken()
        // 透明度を付与したrgbaの背景色をセット
        this.setColorWithOpacity()

        console.log(this.bgColorWithOpacity)
        console.log(this.fontColorWithOpacity)
      }
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * 背景色に#がない場合に付与
   */
  addSharpToBgColor() {
    try {
      if (this.bgColor.includes('rgba')) {
        return
      }

      // '#'を付与
      if (this.bgColor.indexOf('#') === -1) {
        this.bgColor = '#' + this.bgColor
      }
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * 枠線の色を背景色からセット
   * ・背景色よりもやや濃い色をセット
   */
  setBorderColorFromBgColorDarken() {
    try {
      this.borderColor = scriptTextManager.useGetThickBorderColorFromBgColor(this.bgColor)
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * 文字色を背景色からセット
   * ・背景色よりもやや濃い色をセット
   */
  setFontColorFromBgColorDarken() {
    try {
      // 背景色よりもやや濃い色をセット
      this.fontColor = scriptTextManager.useGetThickFontColorFromBgColor(this.bgColor)
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * 透明度を付与したrgbaの背景色をセット
   * ・背景色の明るさが強い場合、背景色、枠線の色に透明度を付与
   */
  setColorWithOpacity() {
    try {
      // 背景色に透明度を付与
      this.bgColorWithOpacity = scriptTextManager.getRgbaAndAddOpacityWhenBrightColor(this.bgColor, CONSTANTS.BRIGHT_CHARA_BG_SET_ALPHA)
      // 枠線の色に透明度を付与
      this.borderColorWithOpacity = scriptTextManager.getRgbaAndAddOpacityWhenBrightColor(this.borderColor, CONSTANTS.BRIGHT_CHARA_BORDER_SET_ALPHA)
      // 文字色はそのまま
      this.fontColorWithOpacity = this.fontColor
    } catch (error) {
      console.error(error)
    }
  }

  //======================================================
  // getBgColorForView()
  //======================================================

  /**
   * 背景色を返す
   * ・bgColorWithOpacityがあり、定数がtrueならばそれを返す
   * 
   * @returns {string} 背景色
   */
  public getBgColorForView(): string {
    if (this.bgColorWithOpacity !== '' && CONSTANTS.ADD_OPACITY_TO_CHARA_BG_COLOR_IF_BLIGHT) {
      return this.bgColorWithOpacity
    }

    return this.bgColor
  }

  //======================================================
  // getBorderColorForView()
  //======================================================

  /**
   * 枠線の色を返す
   * ・borderColorWithOpacityがあり、定数がtrueならばそれを返す
   * 
   * @returns {string} 枠線の色
   */
  public getBorderColorForView(): string {
    if (this.borderColorWithOpacity !== '' && CONSTANTS.ADD_OPACITY_TO_CHARA_BG_COLOR_IF_BLIGHT) {
      return this.borderColorWithOpacity
    }

    return this.borderColor
  }

  //======================================================
  // getFontColorForView()
  //======================================================

  /**
   * 文字色を返す
   * ・fontColorWithOpacityがあり、定数がtrueならばそれを返す
   * 
   * @returns {string} 文字色
   */
  public getFontColorForView(): string {
    if (this.fontColorWithOpacity !== '' && CONSTANTS.ADD_OPACITY_TO_CHARA_BG_COLOR_IF_BLIGHT) {
      return this.fontColorWithOpacity
    }

    return this.fontColor
  }
}
