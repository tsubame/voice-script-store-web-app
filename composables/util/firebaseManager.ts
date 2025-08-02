//======================================================
//
// FirabaseManager.js FireBase関連の処理管理用
// ※セキュリティ対策のため一部を残して空欄化済
//
// [索引]
//
//  □ 1-1. Twitter認証実行（Sign in with popup）
//  □ 1-2. Twitter認証実行（Sign in with Redirect）
//  □ 1-3. Twitter認証のリダイレクト結果を取得（Sign in with Redirect）
//
//======================================================

import { getAuth, signInWithRedirect, signInWithPopup, GoogleAuthProvider, TwitterAuthProvider, setPersistence, getRedirectResult, browserLocalPersistence, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { initializeApp, getApps, getApp } from 'firebase/app'
import * as FireBaseAuth from 'firebase/auth'
import * as firebase from 'firebase/app'
import * as CONSTANTS from '@/composables/etc/constants'
import TwitterUser from '@/composables/type/twitterUser'
import GoogleUser from '@/composables/type/googleUser'

//======================================================
// vars
//======================================================

// FireBaseApp
let _firebaseApp: any;
// FireBase Auth
let _firebaseAuth: any;
// TwitterAuthProvider
let _tProvider: TwitterAuthProvider;
// GoogleAuthProvider
let _gProvider: GoogleAuthProvider = new GoogleAuthProvider();


// ※セキュリティ対策のため空欄化済