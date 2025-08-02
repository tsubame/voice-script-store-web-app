//======================================================
//
// 台本検索条件
//
//======================================================

/**
 * 台本検索条件
 */
export default class SearchCondition {
  // カテゴリ
  category: string = ''
  // 演者人数
  actorCount: number = 0
  // 男性演者人数
  actorManCount: number = 0
  // 女性演者人数
  actorWomanCount: number = 0
  // ◯分以上
  minMinutes: number = 0
  // ◯分以下
  maxMinutes: number = 0
  // 作者
  authorName: string = ''
  // 検索ワード
  searchWord: string = ''
  // タグ
  tag: string = ''
  // 本文も含めて検索
  includeScriptBody = false

  // 演者性別割合
  actorSexSummary: string = '';
  // 時間（配列）
  minutesVals: number[] = [];
  // 基準になる時間
  targetBaseMinutes: number = 0;
  // 以上、以下
  targetBaseMinutesAboveBelow: string = '';

  /**
   * 検索条件を検索バー表示用のテキストで返す
   * 
   * @returns {string} 検索バー表示用のテキスト
   */
  public getSearchBarText(): string {
    const SPLIT_CHAR = '/'
    let txt = '';

    try {
      // カテゴリ
      txt = this.category
      // 男性演者人数
      if (this.actorManCount !== 0) {
        txt += SPLIT_CHAR + '男' + this.actorManCount + '人'
      }
      // 女性演者人数
      if (this.actorWomanCount !== 0) {
        txt += SPLIT_CHAR + '女' + this.actorWomanCount + '人'
      }
      // 作者名
      if (this.authorName != '') {
        txt += SPLIT_CHAR + this.authorName
      }
      // 時間
      if (this.targetBaseMinutes !== 0) {
        txt += SPLIT_CHAR + this.targetBaseMinutes + '分'

        if (this.targetBaseMinutesAboveBelow !== '') {
          txt += this.targetBaseMinutesAboveBelow
        }
      }
      // 検索ワード
      if (this.searchWord !== '') {
        txt += SPLIT_CHAR + this.searchWord
      }
      // 先頭に'/'がある場合は削除
      if (txt.indexOf(SPLIT_CHAR) === 0) {
        txt = txt.slice(1)
      }
    } catch (error) {
      console.error(error)
    }

    return txt
  }

  /**
   * 検索条件を配列で返す
   * 
   * @returns {string[]} 検索条件の配列
   */
  public getSearchConditionTxts(): string[] {
    let arr: string[] = []
    const MAN_CHAR = '男'
    const WOMAN_CHAR = '女'
    const PEOPLE_CHAR = '人'
    const MIN_UNIT = '分'
    const CONCAT_CHAR = ' '

    try {
      // カテゴリ
      if (this.category !== '') {
        arr.push(this.category)
      }

      let manWomanTxt = ''

      // 男性演者人数
      if (this.actorManCount !== 0) {
        manWomanTxt = MAN_CHAR + this.actorManCount.toString() + PEOPLE_CHAR
      }
      // 女性演者人数
      if (this.actorWomanCount !== 0) {
        if (manWomanTxt != '') {
          manWomanTxt += CONCAT_CHAR
        }

        manWomanTxt += WOMAN_CHAR + this.actorWomanCount.toString() + PEOPLE_CHAR
      }
      if (manWomanTxt !== '') {
        arr.push(manWomanTxt)
      }

      // 作者名
      if (this.authorName !== '') {
        arr.push(this.authorName)
      }
      // 時間
      if (this.targetBaseMinutes !== 0) {
        let txt = this.targetBaseMinutes.toString() + MIN_UNIT + this.targetBaseMinutesAboveBelow
        arr.push(txt)
      }
      // 検索ワード
      if (this.searchWord !== '') {
        arr.push(this.searchWord)
      }
      // タグ
      if (this.tag !== '') {
        arr.push(this.tag)
      }
    } catch (error) {
      console.error(error)
    }

    return arr
  }
}
