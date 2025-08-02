//======================================================
//
// 台本テキスト関連の共通処理
//
// [索引]
//  - useGetWordsFromScriptText
//    本文テキストからWord形式の配列を取得
//
//  - useGetMinutesFromTextLengthBy10MinUnit
//    台本の時間を文字数から10分単位で返す
//
//  - useGetMinutesFromTextLengthBy1MinUnit
//    台本の時間を文字数から1分単位で返す
//
//  - useAddRubyTagToTxt 
//    本文にルビの構文がある場合、ルビタグを追加
//
//  - useGetTxtLengthWithoutRuby
//    ルビを除いた文字数を返す
//
//  - useGetCharactorsFromWords
//    キャラクターをWordsから抽出して返す
//
//  - useGetCharactorsWordCountMapFromWords
//    キャラクターのセリフ数をWordsから抽出して返す
//
//  - useSetWordColors
//    セリフに全キャラクターの色をセット
//
//  - useSetTargetChatactorWordColors 
//    セリフに特定のキャラの色をセット
//
//  - useCheckIsDarkColor
//    色が濃いかを返す
//
//  - useGetThickBorderColorFromBgColor 
//    背景色から濃い色のボーダーカラーを返す
//
//  - useGetThickFontColorFromBgColor
//    背景色から濃い色のフォントカラーを返す
//
//  - useGetThickFontColorFromBgColor
//    背景色から濃い色のフォントカラーを返す
//
//  - useSetColorsAsVuetifyTheme
//    Vuetifyテーマ風の背景色、文字色、ボーダーカラーをセット
//
//  - useConvertCharToFullWidth 
//    半角英数を全角に変換
//
//  - useGetCategoryColor
//    カテゴリの色を返す
//
//======================================================

import Encoding from 'encoding-japanese'
import * as CONSTANTS from '@/composables/etc/constants'
import Word from '@/composables/type/word'
import Charactor from '@/composables/type/charactor'
import { he } from 'vuetify/locale'
import type { charactor } from '#imports'


//======================================================
// useGetWordsFromScriptText
//======================================================

/**
 * 本文テキストからWord形式の配列を取得
 * 
 * @param {string} txt 本文テキスト
 * @returns {Word[]} Word形式の配列
 */
export const useGetWordsFromScriptText = (txt: string): Word[] => {
  let preWord: Word = new Word();
  let words: Word[] = [];

  // 改行で分割
  let lineTxts = txt.split('\n');

  // 行を走査
  for (let lineTxt of lineTxts) {
    // 半角コロンを全角に
    lineTxt = lineTxt.replace(':', CONSTANTS.WORD_SPLIT_CHAR).trim();
    // コロンで分割
    let txts = lineTxt.split(CONSTANTS.WORD_SPLIT_CHAR);

    let word: Word = new Word();
    // デフォルトのボーダーカラーを設定
    word.charaNameBorderColor = CONSTANTS.DEFAULT_BORDER_COLOR

    // キャラ名とセリフを取得
    if (2 <= txts.length) {
      word.charaName = txts[0].trim();
      // 半角英数を全角に
      word.charaName = convertAlphabetuseConvertCharToFullWidth(word.charaName);
      // 全角の０を半角に
      word.charaName = word.charaName.replace('０', CONSTANTS.NARRATION_CHARA_NAME);

      // キャラ名がない場合、空白としてセット
      if (word.charaName === '') {
        //console.log('[キャラ名なしのため空白をセット]')
        word.charaName = CONSTANTS.SCRIPT_EMPTY_CHARACTER_NAME_TXT
      }

      word.text = txts[1].trim();

      // セリフ内に：がある場合、結合
      if (3 <= txts.length) {
        for (let i = 2; i < txts.length; i++) {
          word.text += CONSTANTS.WORD_SPLIT_CHAR + txts[i].trim();
        }
      }
    } else {
      word.text = txts[0].trim();
    }

    // 本文の半角英数を全角に
    word.text = convertAlphabetuseConvertCharToFullWidth(word.text);

    // 前のセリフとキャラ名が異なる場合は配列に追加
    if (preWord.charaName !== word.charaName && preWord.charaName !== '') {
      if (preWord.charaName === CONSTANTS.NARRATION_CHARA_NAME) {
        preWord.charaName = '';
        preWord.text = preWord.text;
      }

      words.push(preWord);
    } else if (preWord.charaName === word.charaName) {
      word.text = preWord.text + '\n' + word.text;
    }

    preWord = word;
  }

  // キャラ名がナレーションならテキストの先頭に追加する文字列を追加
  if (preWord.charaName === CONSTANTS.NARRATION_CHARA_NAME) {
    preWord.charaName = '';
    preWord.text = preWord.text;
  }

  words.push(preWord);

  return words;
}

/**
 * 半角英数を全角に変換
 * 
 * @param {string} str
 * @returns {string} 全角に変換された文字列
 */
const convertAlphabetuseConvertCharToFullWidth = (str: string) => {
  return str.replace(/[A-Za-z0-9]/g, function (s) {
    return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
  });
}

//======================================================
// useGetMinutesFromTextLengthBy10MinUnit
//======================================================

/**
 * 台本の時間を文字数から10分単位で返す
 * 
 * @param {textLength} 文字数
 * @returns {number} 分数
 */
export const useGetMinutesFromTextLengthBy10MinUnit = (textLength: number): number => {
  let m = 0

  try {
    // 文字数から時間を計算
    m = Math.ceil(textLength / CHAR_COUNT_PER_MINUTE)
    // 10の位で四捨五入
    m = Math.round(m / 10) * 10
    // 0分は10分に
    if (m == 0) {
      m = 10
    }
    // 90分以上は90分に
    if (CONSTANTS.SCRIPT_MAX_MINUTES < m) {
      m = CONSTANTS.SCRIPT_MAX_MINUTES
    }
  } catch (error) {
    console.error(error)
  }

  return m
}

//======================================================
// useGetMinutesFromTextLengthBy1MinUnit
//======================================================

/**
 * 台本の時間を文字数から1分単位で返す
 * 
 * @param {textLength} 文字数
 * @returns {number} 分数
 */
export const useGetMinutesFromTextLengthBy1MinUnit = (textLength: number): number => {
  let m = 0

  try {
    // 文字数から時間を計算
    m = Math.ceil(textLength / CHAR_COUNT_PER_MINUTE)
  } catch (error) {
    console.error(error)
  }

  return m
}


//======================================================
// useConvertEncodingToUTF8
//======================================================

/**
 * 台本の文字コードをUTF-8に変換
 * 
 * @param {Uint8Array} arrayBuffer ArrayBuffer形式の文字列
 * @returns {Promise<string>} UTF-8に変換された文字列
 */
export const useConvertEncodingToUTF8 = async (arrayBuffer: Uint8Array): Promise<string> => {
  let utf8Text = ''

  try {
    // 文字コードを取得
    let encoding = Encoding.detect(arrayBuffer)
    console.log('[文字コード]' + encoding)

    // 文字コードをUTF-8に変換
    utf8Text = Encoding.convert(arrayBuffer, {
      to: 'UNICODE',
      type: 'string',
    });

    console.log('[文字コード変換]' + encoding + ' -> UTF-8')
  } catch (error) {
    console.error(error);
  }

  return utf8Text;
}

//======================================================
// useConvertCharToFullWidth
//======================================================

/**
 * 半角英数を全角に変換
 * 
 * @param {string} input 入力文字列
 * @returns {string} 全角に変換された文字列
 */
export const useConvertCharToFullWidth = (input: string): string => {
  try {
    return input.replace(/[A-Za-z0-9]/g, function (s) {
      return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
    });
  } catch (error) {
    console.error(error);
  }

  return input;
}

//======================================================
// useAddRubyTagToTxt
//======================================================

/**
 * ルビを追加
 * 
 * @param {string} txt 本文テキスト
 * @returns {string} ルビタグを追加した本文テキスト
 */
export const useAddRubyTagToTxt = (txt: string): string => {
  try {
    // 二重山括弧が2つあれば
    if (txt.indexOf(CONSTANTS.SCRIPT_RUBY_START_CHAR) !== -1 && txt.indexOf(CONSTANTS.SCRIPT_RUBY_END_CHAR) !== -1) {
      // 半角アスタリスクを全角に
      txt = txt.replace(new RegExp(CONSTANTS.SCRIPT_RUBY_BASE_START_ALTERNATIVE_CHAR, 'g'), CONSTANTS.SCRIPT_RUBY_BASE_START_CHAR);
      // 全角アスタリスクがあれば
      if (txt.indexOf(CONSTANTS.SCRIPT_RUBY_BASE_START_CHAR) !== -1) {
        txt = txt.replace(new RegExp(CONSTANTS.SCRIPT_RUBY_BASE_START_CHAR, 'g'), CONSTANTS.SCRIPT_RUBY_BASE_START_TAG)
        txt = txt.replace(new RegExp(CONSTANTS.SCRIPT_RUBY_START_CHAR, 'g'), CONSTANTS.SCRIPT_RUBY_START_TAG)
        txt = txt.replace(new RegExp(CONSTANTS.SCRIPT_RUBY_END_CHAR, 'g'), CONSTANTS.SCRIPT_RUBY_END_TAG)
      }
    }
  } catch (error) {
    console.error(error)
  }

  return txt
}

//======================================================
// useGetTxtLengthWithoutRuby
//======================================================

/**
 * ルビを除いた文字数を返す
 * 
 * @param txt
 * @returns
 */
export const useGetTxtLengthWithoutRuby = (txt: string): number => {
  let len = 0

  try {
    // 二重山括弧がなければ終了
    if (txt.indexOf(CONSTANTS.SCRIPT_RUBY_START_CHAR) === -1) {
      len = txt.length

      return len
    }
    let orgLen = txt.length
    // 正規表現で二重山括弧内を置換
    txt = txt.replace(new RegExp(CONSTANTS.SCRIPT_RUBY_START_CHAR + '.+?' + CONSTANTS.SCRIPT_RUBY_END_CHAR, 'g'), '')
    //console.log(txt)

    // 半角アスタリスクを全角に
    txt = txt.replace(new RegExp(CONSTANTS.SCRIPT_RUBY_BASE_START_ALTERNATIVE_CHAR, 'g'), CONSTANTS.SCRIPT_RUBY_BASE_START_CHAR);

    // ルビを除いた文字数を返す
    txt = txt.replace(new RegExp(CONSTANTS.SCRIPT_RUBY_BASE_START_CHAR, 'g'), '')

    len = txt.length
  } catch (error) {
    console.error(error)
  }

  return len
}

//======================================================
// useGetCharactorsFromWords
//======================================================

/**
 * キャラクターをWordsから抽出して返す（台本投稿時用）
 * ・既に存在するキャラクターを含めてセットして返す
 * 
 * @param words
 * @param alreadyExistcharactors
 * @returns
 */
export const useGetCharactorsFromWords = async (words: Array<Word>, alreadyExistcharactors: Array<Charactor>): Promise<Array<Charactor>> => {
  let charactors = new Array<Charactor>()

  try {
    let charaNames = new Array<string>()

    // キャラごとのセリフ数を格納するマップ
    let charaWordCountMap = new Map<string, number>()

    // セリフを走査
    for (let i = 0; i < words.length; i++) {
      let w = words[i]
      let c = new Charactor()
      let cName = w.charaName

      // トリム
      cName = cName.trim()

      // 空欄、またはスペースの場合はスキップ
      if (cName !== '' && cName !== CONSTANTS.SCRIPT_EMPTY_CHARACTER_NAME_TXT) {
        if (charaNames.indexOf(cName) === -1) {
          charaNames.push(cName)

          console.log(cName)
        }

        // キャラごとのセリフ数をカウント
        if (charaWordCountMap.has(cName)) {
          let count = charaWordCountMap.get(cName)
          if (count) {
            charaWordCountMap.set(cName, count + 1)
          }
        } else {
          charaWordCountMap.set(cName, 1)
        }
      }
    }

    // charaNamesをセリフ数の降順でソート
    charaNames.sort((a, b) => {
      let countA = charaWordCountMap.get(a)
      let countB = charaWordCountMap.get(b)

      if (countA && countB) {
        return countB - countA
      } else {
        return 0
      }
    })

    // キャラクターを初期化
    charactors = new Array<Charactor>()

    // 既に存在するキャラクターをセット
    alreadyExistcharactors.forEach((c: Charactor) => {
      if (c.name !== '') {
        if (!charaNames.includes(c.name)) {
          charactors.push(c)

          console.log('[取り込み済み]' + c.name)
        }
      }
    })
    console.log(charactors)

    // キャラクターをセット
    for (let i = 0; i < charaNames.length; i++) {
      const c = new Charactor()
      c.name = charaNames[i]
      c.bgColor = CONSTANTS.CHARACTOR_COLOR_CODE_ITEMS[i].bgColor

      //c.borderColor = getDarkenColor(c.bgColor, CONSTANTS.BORDER_COLOR_DARKEN_AMOUNT)
      //console.log(c)

      // セリフ数をセット
      if (charaWordCountMap.has(c.name)) {
        c.wordCount = charaWordCountMap.get(c.name)!
      }

      // 取り込み済みでなければセット
      if (!isExistCharactorInArray(charactors, c.name)) {
        charactors.push(c)
      }
    }

    console.log(charactors)
  } catch (error) {
    console.error(error)
  }

  return charactors
}

/**
 * 該当キャラを配列にセット済か
 * 
 * @param {Array<Charactor>} charactors キャラクターの配列
 * @param {string} targetCharaName 対象キャラ名
 * @return {boolean} 取り込み済みならtrue
 */
const isExistCharactorInArray = (charactors: Array<Charactor>, targetCharaName: string): boolean => {
  let isExist = false

  try {
    // トリム
    targetCharaName = targetCharaName.trim()

    charactors.forEach((c) => {
      if (c.name !== '') {
        // 同じ名前がいればTrue      
        if (c.name == targetCharaName) {
          console.log('[取り込み済み]' + targetCharaName)

          isExist = true
          // Mが最後に付き、同じ名前を含めばTrue
        } else if (targetCharaName.indexOf(c.name) !== -1) {
          // 末尾の文字をセット
          let lastChar = targetCharaName.charAt(targetCharaName.length - 1)
          // 末尾がMならスキップ
          if (lastChar === CONSTANTS.SCRIPT_MIND_VOICE_END_CHAR || lastChar === CONSTANTS.SCRIPT_MIND_VOICE_END_ALTERNATIVE_CHAR) {
            console.log('[取り込み済み]' + targetCharaName)

            isExist = true
          }
        }
      }
    })
  } catch (error) {
    console.error(error)
  }

  return isExist
}

//======================================================
// useGetCharactorsWordCountMapFromWords
//======================================================

/**
 * キャラクターのセリフ数をWordsから抽出して返す
 * 
 * @param {Array<Word>} words セリフの配列
 * @param {Array<Charactor>} alreadyExistcharactors 既に存在するキャラクターの配列
 * @returns {Map<string, number>} キャラクター名とセリフ数のマップ
 */
export const useGetCharactorsWordCountMapFromWords = (words: Array<Word>, alreadyExistcharactors: Array<Charactor>): Map<string, number> => {
  let charactors = new Array<Charactor>()
  // キャラごとのセリフ数を格納するマップ
  let charaWordCountMap = new Map<string, number>()

  try {
    let charaNames = new Array<string>()

    // セリフを走査
    for (let i = 0; i < words.length; i++) {
      let w = words[i]
      let c = new Charactor()
      let cName = w.charaName

      // トリム
      cName = cName.trim()

      // 空欄、またはスペースの場合はスキップ
      if (cName !== '' && cName !== CONSTANTS.SCRIPT_EMPTY_CHARACTER_NAME_TXT) {
        if (charaNames.indexOf(cName) === -1) {
          charaNames.push(cName)

          console.log(cName)
        }

        // キャラごとのセリフ数をカウント
        if (charaWordCountMap.has(cName)) {
          let count = charaWordCountMap.get(cName)
          if (count) {
            charaWordCountMap.set(cName, count + 1)
          }
        } else {
          charaWordCountMap.set(cName, 1)
        }
      }
    }
    // charaNamesをセリフ数の降順でソート
    charaNames.sort((a, b) => {
      let countA = charaWordCountMap.get(a)
      let countB = charaWordCountMap.get(b)

      if (countA && countB) {
        return countB - countA
      } else {
        return 0
      }
    })

    // キャラクターを初期化
    charactors = new Array<Charactor>()

    // 既に存在するキャラクターをセット
    alreadyExistcharactors.forEach((c) => {
      if (c.name !== '') {
        if (charaNames.indexOf(c.name) !== -1) {
          charactors.push(c)
        }
      }
    })

    // キャラクターをセット
    for (let i = 0; i < charaNames.length; i++) {
      const c = new Charactor()
      c.name = charaNames[i]

      // 取り込み済みでなければセット
      if (!isExistCharactorInArray(charactors, c.name)) {
        charactors.push(c)
      }
    }

    console.log(charactors)
  } catch (error) {
    console.error(error)
  }

  return charaWordCountMap
}

//======================================================
// useSetWordColors
//======================================================

/**
 * セリフにキャラクターの色をセット
 * 
 * @param {Array<Word>} words セリフの配列
 * @param {Array<Charactor>} charactors キャラクターの配列
 * @return {Array<Word>} 色をセットしたセリフの配列
 */
export const useSetWordColors = (words: Array<Word>, charactors: Array<Charactor>): Array<Word> => {
  try {
    // キャラをマップにセット
    let charaMap = new Map<string, Charactor>()
    charactors.forEach(c => {
      charaMap.set(c.name, c)
    })

    // キャラクターを走査
    charactors.forEach((c: Charactor) => {
      c.setColorsFromBgHexColor()
    })

    console.log(charactors)

    // セリフを走査
    for (let j = 0; j < words.length; j++) {
      let w = words[j]

      // マップにキャラがあれば色をセット
      if (charaMap.has(w.charaName)) {
        let c = charaMap.get(w.charaName)
        if (c !== undefined) {
          w.charaNameBgColor = c.getBgColorForView()
          w.charaNameBorderColor = c.getBorderColorForView()
          w.charaNameFontColor = c.getFontColorForView()
        }
        // 無ければ含むキャラ名を取得
      } else {
        charactors.forEach(c => {
          if (w.charaName === c.name || w.charaName.indexOf(c.name) !== -1 || c.name.indexOf(w.charaName) !== -1) {
            w.charaNameBgColor = c.getBgColorForView()
            w.charaNameBorderColor = c.getBorderColorForView()
            w.charaNameFontColor = c.getFontColorForView()
          }
        })
      }
    }
  } catch (error) {
    console.error(error)
  }

  return words
}

//======================================================
// useSetTargetChatactorWordColor
//======================================================

/**
 * 特定のキャラの色をセット
 *
 * @param {Array<Word>} words セリフの配列
 * @param {Charactor} chara 対象キャラクター
 * @return {Array<Word>} 色をセットしたセリフの配列
 */
export const useSetTargetChatactorWordColors = (words: Array<Word>, chara: Charactor): Array<Word> => {
  try {
    // セリフを走査
    for (let j = 0; j < words.length; j++) {
      let w = words[j]

      // キャラ名と一致すれば色をセット
      if (w.charaName == chara.name) {
        w.charaNameBgColor = chara.getBgColorForView()
        w.charaNameBorderColor = chara.getBorderColorForView()
        w.charaNameFontColor = chara.getFontColorForView()

        console.log(chara)
        console.log(w)
      }
    }
  } catch (error) {
    console.error(error)
  }

  return words
}


//======================================================
// useCheckIsDarkColor
//======================================================

/**
 * 色が濃いかを返す
 * 
 * @param {string} colorCode 色コード
 * @returns {boolean} 色が濃い場合はtrue
 */
export const useCheckIsDarkColor = (colorCode: string): boolean => {
  const CR_VAL = 128;
  let res = false;

  try {
    if (colorCode === '') {
      return false;
    }

    let luminance = getDarkNessValFromHexColorCode(colorCode);

    res = luminance < CR_VAL;
  } catch (error) {
    console.error(error)
  }

  return res;
}

/**
 * 色の濃さを返す
 * 
 * @param {string} hexColorCode 色コード（#RRGGBB形式）
 * @returns {number} 色の濃さ（輝度）
 */
function getDarkNessValFromHexColorCode(hexColorCode: string): number {
  let luminance = 0;

  try {
    if (hexColorCode.length < 6) {
      return luminance;
    }

    // Remove the leading #
    hexColorCode = hexColorCode.replace('#', '');
    // Convert to uppercase
    let hex = hexColorCode.toUpperCase();

    let r = parseInt(hex.slice(0, 2), 16);
    if (isNaN(r)) {
      return 0
    }
    let g = parseInt(hex.slice(2, 4), 16);
    if (isNaN(g)) {
      return 0
    }
    let b = parseInt(hex.slice(4, 6), 16);
    if (isNaN(b)) {
      return 0
    }

    // Calculate luminance
    luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  } catch (error) {
    console.error(error)
  }

  return luminance
}

//======================================================
// useGetThickBorderColorFromBgColor
//======================================================

/**
 * 背景色から濃い色のボーダーカラーを返す
 * ・定数指定済みなら指定の色を返す
 * ・定数指定済みでない場合、少し濃い色を返す
 * 
 * @param {string} colorCode 背景色のカラーコード
 * @returns {string} 濃い色のボーダーカラー
 */
export function useGetThickBorderColorFromBgColor(colorCode: string): string {
  try {
    // 少し濃い色を返す
    return getDarkenColor(colorCode, CONSTANTS.BORDER_COLOR_DARKEN_AMOUNT)
  } catch (error) {
    console.error(error)
  }

  return ''
}

/**
 * 少し濃い色を返す
 * 
 * @param {string} color 背景色のカラーコード（#RRGGBB形式）
 * @param {number} amount 濃くする量（0〜255）
 * @returns {string} 濃くした色のカラーコード（#RRGGBB形式）
 */
function getDarkenColor(color: string, amount: number): string {
  try {
    // 先頭の '#' を取り除きます。
    color = color.substring(1);

    // 16進数を数値に変換します。
    const num = parseInt(color, 16);

    // RGB値を抽出します。
    let r = (num >> 16) - amount;
    let g = ((num >> 8) & 0x00FF) - amount;
    let b = (num & 0x0000FF) - amount;

    // 値が0未満にならないように調整します。
    r = r < 0 ? 0 : r;
    g = g < 0 ? 0 : g;
    b = b < 0 ? 0 : b;

    // 新しいカラーコードを生成します。
    const newColor = (r << 16) | (g << 8) | b;

    // 16進数の文字列に変換し、先頭に '#' を付けて返します。
    return `#${newColor.toString(16).padStart(6, '0')}`;
  } catch (error) {
    console.error(error)
  }

  return ''
}

//======================================================
// useGetThickFontColorFromBgColor
//======================================================

/**
 * 背景色から濃い色のフォントカラーを返す
 * 
 * @param {string} colorCode 背景色のカラーコード
 * @returns {string} 濃い色のフォントカラー
 */
export function useGetThickFontColorFromBgColor(colorCode: string): string {
  try {
    // 濃い場合は白文字に
    if (CONSTANTS.CHANGE_CHARA_NAME_FONT_COLOR_TO_WHITE) {
      if (useCheckIsDarkColor(colorCode)) {
        return CONSTANTS.SCRIPT_WHITE_COLOR
      }
    }

    // 少し濃い色を返す
    return getDarkenColor(colorCode, CONSTANTS.FONT_COLOR_DARKEN_AMOUNT)
  } catch (error) {
    console.error(error)
  }

  return ''
}

//======================================================
// useSetDifinedFontAndBorderColors
//======================================================

/**
 * 定義されている背景色の場合、定義されている枠線の色、文字色をセット
 * 
 * @param {Charactor} chara キャラクター
 * @returns {Charactor} 色をセットしたキャラクター
 */
export function useSetDifinedFontAndBorderColors(chara: Charactor): Charactor {
  try {
    // 置き換え対象の色に含まれていればそれをセット
    for (let i = 0; i < CONSTANTS.REPLACE_TARGET_COLORS.length; i++) {
      let cItem = CONSTANTS.REPLACE_TARGET_COLORS[i]

      // 小文字を大文字に変換
      let charaBgColorUpper = chara.bgColor.toUpperCase();
      let cItemBgColorUpper = cItem.bgColor.toUpperCase();

      if (cItemBgColorUpper === charaBgColorUpper) {
        let replaceColorItem = cItem.replaceColorCodeItem

        chara.bgColor = replaceColorItem.bgColor
        chara.borderColor = replaceColorItem.borderColor
        chara.fontColor = replaceColorItem.fontColor
        console.log('[置き換え対象の色を取得]' + replaceColorItem.bgColor)

        return chara
      }
    }

    // 定義済みのカラーコードに含まれていればそれをセット
    for (let i = 0; i < CONSTANTS.THEME_COLOR_CODE_ITEMS.length; i++) {
      let cItem = CONSTANTS.THEME_COLOR_CODE_ITEMS[i]

      if (cItem.bgColor === chara.bgColor) {
        chara.bgColor = cItem.bgColor
        chara.borderColor = cItem.borderColor
        chara.fontColor = cItem.fontColor
        console.log('[定義済の色を取得]' + cItem.bgColor)

        return chara
      }
    }
  } catch (error) {
    console.error(error)
  }

  return chara
}

//======================================================
// useSetColorsAsVuetifyTheme
//======================================================

/**
 * Vuetifyテーマ風の背景色、文字色、ボーダーカラーをセット
 * 
 * @param {Charactor} chara キャラクター
 * @returns {Charactor} Vuetifyテーマ風の色をセットしたキャラクター
 */
export const useGetColorAsVuetifyThemeCharactor = (chara: Charactor): Charactor => {
  try {
    // 定義されている背景色の場合、定義されている枠線の色、文字色をセット
    chara = setDefinedBorderAndFontColorsFromVuetifyBgColor(chara)
    // 設定できれば終了
    if (chara.borderColor !== '' && chara.borderColor !== null) {
      return chara
    }

    // 定義済みでない場合、近いテーマカラーをセット
    const themeColor = getClosestColorNameFromColorCode(chara.bgColor)
    console.log('[テーマカラー]' + themeColor)
    if (themeColor == '') {
      console.log('[テーマカラセット不可]')

      return chara
    }

    // テーマカラーから定義されている枠線の色、文字色をセット
    chara = setDefinedBorderAndFontColorsFromVuetifyThemeColorName(chara, themeColor)
  } catch (error) {
    console.error(error)
  }

  return chara
}

/**
 * 定義されている背景色の場合、定義されている枠線の色、文字色をセット
 * 
 * @param {Charactor} chara キャラクター
 * @returns {Charactor} 色をセットしたキャラクター
 */
const setDefinedBorderAndFontColorsFromVuetifyBgColor = (chara: Charactor): Charactor => {
  try {
    // 定義済みのカラーコードに含まれていればそれをセット
    for (let i = 0; i < CONSTANTS.THEME_COLOR_CODE_ITEMS.length; i++) {
      let cItem = CONSTANTS.THEME_COLOR_CODE_ITEMS[i]

      if (cItem.bgColor === chara.bgColor) {
        console.log('[背景色から定義済の色を取得]' + cItem.bgColor)

        chara.borderColor = cItem.borderColor
        chara.fontColor = cItem.fontColor

        return chara
      }
    }

    console.log('[背景色から定義済の色をセット不可]' + chara.bgColor)
  } catch (error) {
    console.error(error)
  }

  return chara
}

/**
 * テーマカラーから定義されている枠線の色、文字色をセット
 * 
 * @param {Charactor} chara キャラクター
 * @param {string} themeColorName テーマカラー名
 * @returns {Charactor} 色をセットしたキャラクター
 */
const setDefinedBorderAndFontColorsFromVuetifyThemeColorName = (chara: Charactor, themeColorName: string): Charactor => {
  try {
    // 定義済みのテーマカラーに含まれていればそれをセット
    for (let i = 0; i < CONSTANTS.THEME_COLOR_CODE_ITEMS.length; i++) {
      let cItem = CONSTANTS.THEME_COLOR_CODE_ITEMS[i]

      if (cItem.name === themeColorName) {
        chara.borderColor = cItem.borderColor
        chara.fontColor = cItem.fontColor
        chara.bgColor = cItem.bgColor
        console.log('[テーマカラーから定義済の色を取得]' + cItem.bgColor)
        console.log(chara)

        return chara
      }
    }
  } catch (error) {
    console.error(error)
  }

  return chara
}

//======================================================
// useReplaceColorToDefaultColors
//======================================================

/**
 * 対象の背景色が定義済みのカラーコードに含まれていなければ、定義済みのカラーコードに置換
 * 
 * @param {string} bgColor 対象の背景色
 * @returns {string} 置換後の背景色
 */
export const useReplaceColorToDefaultColors = (bgColor: string): string => {
  let resColor = bgColor

  try {
    // #がなければ付与
    if (!bgColor.includes('#')) {
      bgColor = '#' + bgColor
    }

    // 定義済みのカラーコードに含まれていれば終了
    for (let i = 0; i < CONSTANTS.CHARACTOR_COLOR_CODE_ITEMS.length; i++) {
      if (CONSTANTS.CHARACTOR_COLOR_CODE_ITEMS[i].bgColor === bgColor) {
        return bgColor
      }
    }

    // 一番近い色名をセット
    const closestColorName = getClosestColorNameFromColorCode(bgColor)
    console.log('[色の置き換えを実施]')
    console.log('[一番近い色名]' + closestColorName)

    // 定義済みのカラーコードに含まれていればそれをセット
    for (let i = 0; i < CONSTANTS.CHARACTOR_COLOR_CODE_ITEMS.length; i++) {
      let cItem = CONSTANTS.CHARACTOR_COLOR_CODE_ITEMS[i]

      if (cItem.replaceTargetColors.includes(closestColorName)) {
        console.log('[色の置き換え]' + bgColor + '→' + cItem.bgColor)

        return cItem.bgColor
      }
    }

    console.warn('[色の置き換えができませんでした]')
  } catch (error) {
    console.error(error)
  }

  return resColor
}


/**
 * 一番近い色を色名で返す
 * 
 * @param {string} hex 16進数カラーコード（#RRGGBB形式）
 * @returns {string} 一番近い色名
 */
const getClosestColorNameFromColorCode = (hex: string): string => {
  const colors: { [key: string]: RGB } = {
    'red': { r: 255, g: 0, b: 0 },
    'blue': { r: 0, g: 0, b: 255 },
    'green': { r: 0, g: 255, b: 0 },
    'yellow': { r: 255, g: 255, b: 0 },
    'lime': { r: 191, g: 255, b: 0 },
    'purple': { r: 128, g: 0, b: 128 },
    'orange': { r: 255, g: 165, b: 0 },
    'orange-lighten-1': { r: 254, g: 219, b: 180 },
    'black': { r: 0, g: 0, b: 0 },
    'grey': { r: 128, g: 128, b: 128 },
    'grey-lighten-1': { r: 222, g: 222, b: 222 },
    'grey-darken-1': { r: 64, g: 64, b: 64 },
    'yellow-lighten-1': { r: 255, g: 255, b: 224 },
    'green-lighten-1': { r: 144, g: 238, b: 144 },
    'blue-lighten-1': { r: 173, g: 216, b: 230 },
    'purple-darken-4': { r: 216, g: 191, b: 216 },
    'red-darken-2': { r: 139, g: 0, b: 0 },
    'blue-darken-3': { r: 0, g: 0, b: 139 },
    'green-darken-3': { r: 0, g: 100, b: 0 },
    'yellow-darken-3': { r: 139, g: 139, b: 0 },
    'red-darken-3': { r: 128, g: 0, b: 32 },
    'pink-darken-3': { r: 255, g: 192, b: 203 },
    'pink-darken-4': { r: 255, g: 224, b: 224 },
    'blue-darken-4': { r: 226, g: 242, b: 254 },
    'green-darken-4': { r: 237, g: 249, b: 215 },
    'purple-lighten-4': { r: 244, g: 217, b: 251 },
    'amber-darken-4': { r: 247, g: 238, b: 208 },
    'yellow-darken-4': { r: 251, g: 248, b: 196 },
    'cyan': { r: 224, g: 252, b: 244 }
  };

  // 16進数カラーコードをRGBに変換
  const targetColorRgb = hexToRgb(hex);
  let closest = '';
  let minDistance = Infinity;

  // 一番近い色を探す
  for (const [colorName, colorValue] of Object.entries(colors)) {
    const distance = colorDistance(targetColorRgb, colorValue);
    if (distance < minDistance) {
      minDistance = distance;
      closest = colorName;
    }
  }

  // '-lighten'以降をカット
  closest = closest.split('-')[0]

  // greyの場合は除外
  if (closest === 'grey') {
    console.log('[一番近い色がgreyのためセット不可とみなします]' + hex)

    closest = ''
  }

  return closest;
}

/**
 * 色のRGB値の差分を返す
 * 
 * @param {any} c1
 * @param {any} c2
 * @returns {number} 色の差分
 */
function colorDistance(c1: RGB, c2: RGB): number {
  return Math.sqrt(
    Math.pow(c1.r - c2.r, 2) +
    Math.pow(c1.g - c2.g, 2) +
    Math.pow(c1.b - c2.b, 2)
  );
}

/**
 * 16進数をRGBに変換
 * 
 * @param {string} hex 16進数カラーコード（#RRGGBB形式）
 * @returns {RGB} RGBオブジェクト
 */
function hexToRgb(hex: string): RGB {
  let bigInt = 0

  try {
    bigInt = parseInt(hex.slice(1), 16);
  } catch (error) {
    console.error(error)
  }

  return {
    r: (bigInt >> 16) & 255,
    g: (bigInt >> 8) & 255,
    b: bigInt & 255
  };
}

//======================================================
// getRgbaAndAddOpacityWhenBrightColor
//======================================================

/**
 * 色が明るい場合、カラーコードを透明度付きのRGBA形式に変換
 * 
 * @param {string} hex 16進数カラーコード（#RRGGBB形式）
 * @param {number} alpha 透明度（0〜1）
 * @returns {string} 透明度付きのRGBA形式のカラーコード
 */
export function getRgbaAndAddOpacityWhenBrightColor(hex: string, alpha: number): string {
  // 先頭の '#' を削除
  hex = hex.replace(/^#/, '');

  // 6桁の16進数カラーコードであることを確認
  if (hex.length !== 6) {
    console.warn('getRgbaAndAddOpacityWhenBrightColor() Invalid hex color code')

    return hex
  }

  // 16進数カラーコードをRGBに変換
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  // RGB値が255のいずれかに近い場合、透明度0.5に変換
  if (r < 150 || g < 150 || b < 150) {
    console.log('[明るい色のため透明度を' + alpha + 'に]' + hex)
    console.log(r + ',' + g + ',' + b)

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  } else {
    return `rgba(${r}, ${g}, ${b}, 1)`;
  }
}

//======================================================
// useGetCategoryColor
//======================================================

/**
 * カテゴリの色を返す
 * 
 * @param {string} targetCategory 対象のカテゴリ名
 * @returns {string} カテゴリの色コード
 */
export const useGetCategoryColor = (targetCategory: string): string => {
  let catColor = ''

  try {
    CONSTANTS.SCRIPT_CATEGORIES.forEach((category: CONSTANTS.ScriptCategoryItem) => {
      if (category.name == targetCategory) {
        catColor = category.color!
      }
    })
  } catch (error) {
    console.error(error)
  }

  return catColor
}

type RGB = {
  r: number;
  g: number;
  b: number;
};
