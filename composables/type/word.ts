//======================================================
//
// 台本のセリフデータ
//
//======================================================

import * as CONSTANTS from '@/composables/etc/constants'

/**
 * 台本のセリフデータ
 */
export default class Word {
  // 名前
  charaName: string = '';
  // セリフ
  text: string = '';
  // 名前の背景色
  charaNameBgColor: string = '';
  // 名前の文字色
  charaNameFontColor: string = '';
  // 枠線の色
  charaNameBorderColor: string = '';
  // 枠線の色、pxを付けた文字列 '1px solid #000' DBには存在しない
  charaNameBorderStyle: string = '';

  /**
   * ルビを含むかを返す
   * ・二重山括弧が2つあればTrue
   * 
   * @returns {boolean} ルビを含むか
   */
  public hasRubyTxt(): boolean {
    // ルビがあれば
    try {
      // 二重山括弧が2つなければfalse
      if (this.text.indexOf(CONSTANTS.SCRIPT_RUBY_START_CHAR) === -1) {
        return false
      }
      if (this.text.indexOf(CONSTANTS.SCRIPT_RUBY_END_CHAR) === -1) {
        return false
      }

      // 空白を一旦除去
      let txt = this.text.replace(/\s/g, '')
      // 二重山括弧が2つ続いていればFalse
      let ignoreTxt = CONSTANTS.SCRIPT_RUBY_START_CHAR + CONSTANTS.SCRIPT_RUBY_END_CHAR
      if (txt.indexOf(ignoreTxt) !== -1) {
        return false
      }

      // 半角アスタリスクを全角に
      txt = txt.replace(new RegExp(CONSTANTS.SCRIPT_RUBY_BASE_START_ALTERNATIVE_CHAR, 'g'), CONSTANTS.SCRIPT_RUBY_BASE_START_CHAR);

      // ＊があればtrue
      if (txt.indexOf(CONSTANTS.SCRIPT_RUBY_BASE_START_CHAR) !== -1) {
        return true
      }
    } catch (error) {
      console.error(error)
    }

    return false
  }

  /**
   * 該当キャラのセリフかを返す
   * ・キャラ名が一致すればTrue
   * ・末尾に'M' or 'Ｍ'を含む場合、末尾以外の文字が一致すればTrue
   * 
   * @param {string} charaName キャラ名
   * @returns {boolean} 該当キャラのセリフか
   */
  public isTargetCharaWord(charaName: string): boolean {
    // キャラ名が一致すればTrue
    if (this.charaName === charaName) {
      return true
    }

    // 末尾に'M' or 'Ｍ'を含む場合、末尾以外の文字が一致すればTrue
    if (this.charaName.slice(-1) === 'M' || this.charaName.slice(-1) === 'Ｍ') {
      if (this.charaName.slice(0, -1) === charaName) {
        return true
      }
    }

    return false
  }
}


