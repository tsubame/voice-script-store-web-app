//======================================================
//
// 状態管理用 
// フォロー中のユーザ情報を保持
//
//======================================================

import { defineStore } from 'pinia';
import Follow from '@/composables/type/follow';

/**
 * フォロー中ユーザ一覧保持用ストア
 * 
 * @returns 
 */
export const useFollowUsersStore = defineStore({
  id: 'followUsers',

  state: () => ({
    // フォロー中ユーザID一覧
    followUserIds: [] as number[],
    // フォロー中ユーザID一覧の連想配列
    followUserIdsMap: {} as { [key: number]: number },
    // フォロワーのユーザID一覧
    followerUserIds: [] as number[],
    // フォロワーユーザID一覧の連想配列
    followerUserIdsMap: {} as { [key: number]: number },
  }),

  actions: {
    /**
     * フォロー中ユーザID一覧をセット
     * 
     * @param follows
     */
    setFollowUserIds(follows: Follow[]) {
      try {
        const ids = follows.map(follow => follow.followTargetUserId)
        this.followUserIds = ids
        this.followUserIdsMap = {}
        ids.forEach(id => {
          this.followUserIdsMap[id] = id
        })

        console.log("[フォロー中ユーザをセット]")
        console.log(this.followUserIds)
      } catch (error) {
        console.error(error)
      }
    },

    /**
     * フォロワーユーザID一覧をセット
     * 
     * @param followers
     */
    setFollowerUserIds(followers: Follow[]) {
      try {
        const ids = followers.map(follow => follow.userId)
        this.followerUserIds = ids
        this.followerUserIdsMap = {}
        ids.forEach(id => {
          this.followerUserIdsMap[id] = id
        })

        console.log("[フォロワーユーザをセット]")
        console.log(this.followerUserIds)
      } catch (error) {
        console.error(error)
      }
    },

    /**
     * 対象ユーザIDをフォロー一覧にセット
     * 
     * @param fid 
     */
    addFollow(fid: number) {
      try {
        this.followUserIds.push(fid)

        // 連想配列にもセット
        this.followUserIdsMap[fid] = fid
      } catch (error) {
        console.error(error)
      }
    },

    /**
     * 対象ユーザIDをフォロー一覧から削除
     * 
     * @param fid 
     */
    removeFollow(fid: number) {
      try {
        // 配列から削除
        this.followUserIds = this.followUserIds.filter(id => id !== fid)

        // 連想配列から削除
        delete this.followUserIdsMap[fid]
      } catch (error) {
        console.error(error)
      }
    },

    /**
     * 対象ユーザをフォロー中かを返す
     */
    isFollowing(fid: number): boolean {
      try {
        return this.followUserIdsMap[fid] !== undefined
      } catch (error) {
        console.error(error)
      }

      return false
    }
  },
});