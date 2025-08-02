<script lang="ts" setup>
//======================================================
//
// about.vue ABOUTページ
//
//======================================================

import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import InfiniteLoading from 'v3-infinite-loading'
import * as CONSTANTS from '@/composables/etc/constants'
import * as phpApiManager from '@/composables/util/phpApiManager'
import User from '@/composables/type/user'
import Script from '@/composables/type/script'
import { useLoginUserStore } from '@/store/loginUserStore';
import { he } from 'vuetify/locale'

//======================================================
// definePageMeta
//======================================================

// ミドルウェアの定義
definePageMeta({
  middleware: ["login-checker"]
})

//======================================================
// vars
//======================================================

// インタフェース 目次の要素
interface TocElement {
  id: string;
  text: string;
  index: number;
  isSubCategory: boolean;
}

// 目次
const tocElements = ref<TocElement[]>([]);

// 目次を表示するか
const _showToc = ref(true);

//======================================================
// onMounted
//======================================================

/**
 * onMounted
 */
onMounted(() => {
  try {
    const headings = document.querySelectorAll('h3,h4');
      
    let index = 0;
    headings.forEach(heading => {
      heading.id = heading.textContent!.toLowerCase().replace(/\s+/g, '-');

      // h3の場合はインデックスを増やす
      if (heading.tagName === 'H3') {
        index += 1

        tocElements.value.push({
          id: heading.id,
          text: heading.textContent!,
          index: index,
          isSubCategory: false
        });
      // h4の場合、サブカテゴリとみなす
      } else if (heading.tagName === 'H4') {
        tocElements.value.push({
          id: heading.id,
          text: heading.textContent!,
          index: 0,
          isSubCategory: true
        });
      }
    }); 
  } catch (error) {
    console.error(error)
  }
});

//======================================================
// methods
//======================================================

/**
 * イベント 目次の要素クリック
 */
const onClickToc = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

/**
 * イベント 目次の表示切り替え
 */
const onClickTocCloseButton = () => {
  _showToc.value = !_showToc.value;
}

</script>
<!--
//======================================================
//
// HTML
//
//======================================================
-->
<template>
  <div id="container" class="px-0">
    <v-card id="card-container" 
      :class="{
        'pb-12': true,
        'mt-0': true,
        'mb-0': true,
        'no-border': useDisplay().smAndDown.value,
      }"         
      flat
      >
      <header id="header"></header>

      <v-card-title>
        <h2 class="mt-4 px-0 mb-0">
          <v-icon class="mr-1 ml-2" color="teal-lighten-3">mdi-help-circle</v-icon><span class="pl-3">ABOUT</span>
        </h2>
        <v-divider class="mt-2" />        
      </v-card-title>

       <v-row>
        <v-col cols="10" class="ml-4 pl-8 mt-4 mb-10 pr-0 text-body-2">
          <p>当サイトについての説明を記載しています。</p>          
        </v-col>
      </v-row>
      <!-- 目次 -->
      <v-card id="toc-container" class="mt-8"
        variant="outlined"
        >
        <v-card-title id="toc-header" class="bg-grey-lighten-3 text-center text-body-1">
          <span class="font-weight-medium">目次</span>
          <v-btn 
            id="toc-close-button" 
            class="mr-2 text-grey-darken-2" 
            @click="onClickTocCloseButton"
            density="compact"
            variant="outlined"
            rounded
            >
            <template v-if="_showToc">
              <v-icon>mdi-menu-up</v-icon>閉じる
            </template>
            <template v-else>
              <v-icon>mdi-menu-down</v-icon>表示
            </template>            
          </v-btn>
        </v-card-title>
        <v-divider />

        <template v-if="_showToc">
          <v-card-text>
            <v-list>
              <template v-for="(item, index) in tocElements" :key="index">
                <v-list-item 
                  @click = "onClickToc(item.id)">
                  
                  <!-- カテゴリ-->
                  <template v-if="!item.isSubCategory">
                    <v-list-item-title class="text-body-1">
                      {{ item.index }}. <strong class="ml-4">{{ item.text }}</strong>
                    </v-list-item-title>
                  </template>
                  <!-- サブカテゴリ-->
                  <template v-else>
                    <v-list-item-title class="text-body-1">
                      <span class="ml-8"><span class="mr-2 text-grey">ー</span><strong class="text-grey-darken-2">{{ item.text }}</strong></span>
                    </v-list-item-title>
                  </template>
                </v-list-item>
                <v-divider />          
              </template>  
            </v-list>
          </v-card-text>
        </template>
      </v-card>      

      <!-- このサイトについて -->
      <v-card-title>
        <h3 class="mt-12 mb-0">
          このサイトについて
        </h3>  
      </v-card-title>
      <v-card-text>              
        <v-row class="paragraph-text-contaienr">
          <v-col>
            <pre class="multiline-text ">
当サイトは台本の投稿、閲覧ができる台本サイトです。
利用規約を遵守していただける方であればどなたでも無償でご利用いただけます。

運営は非営利で行っており、広告収入などはありません。
            </pre>
          </v-col>
        </v-row>
      </v-card-text>

      <!-- ログインについて -->
      <v-card-title>
        <h3 class="mt-12 mb-0">
          ログインについて
        </h3>            
      </v-card-title>
      <v-card-text>
        <v-row class="paragraph-text-contaienr">
          <v-col>
            <pre class="multiline-text">
<strong>台本の閲覧はログイン不要ですが、投稿にはログインが必須となります。</strong>
ただし、閲覧する際でも台本のお気に入りや作者様のフォロー機能を利用をするにはログインが必要です。

ログインの有無で利用できる機能の違いは以下の通りです。
            </pre>

            <v-table justify="center" class="mt-4">
              <thead>
                <tr>
                  <th class="text-left">
                    機能
                  </th>
                  <th class="text-left">
                    ログインの要否
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="title">台本の閲覧</td>
                  <td class="explain">
                    <p class="text-blue font-weight-bold">ログイン不要</p>
                  </td>
                </tr>                
                <tr>
                  <td class="title">台本の投稿</td>
                  <td class="explain">
                    <p class="text-green font-weight-bold">ログインが必要</p>
                  </td>
                </tr>                   
                <tr>
                  <td class="title">台本のお気に入り</td>
                  <td class="explain">
                    <p class="text-green font-weight-bold">ログインが必要</p>
                  </td>
                </tr>      
                <tr>
                  <td class="title">作者のフォロー</td>
                  <td class="explain">
                    <p class="text-green font-weight-bold">ログインが必要</p>
                  </td>
                </tr>         
                <tr>
                  <td class="title">作者のミュート</td>
                  <td class="explain">
                    <p class="text-green font-weight-bold">ログインが必要</p>
                  </td>
                </tr>           
                <tr>
                  <td class="title">通報</td>
                  <td class="explain">
                    <p class="text-green font-weight-bold">ログインが必要</p>
                  </td>
                </tr>                 
              </tbody>
            </v-table>
          </v-col>
        </v-row>
      </v-card-text>


      <!-- ログイン方法 -->
      <v-card-title>
        <h3 class="mt-12 mb-0">
          ログイン方法
        </h3>            
      </v-card-title>
      <v-card-text>
        <v-row class="paragraph-text-contaienr">
          <v-col>
            <pre class="multiline-text ">
SNSアカウントでログインが出来るようになっています。

当サイトの画面右上のアイコンからログインページに移動し、Xアカウント、またはGoogleアカウントを選択して認証を行ってください。
初回ログイン時はSNSアカウントでの認証完了後、当サイトのプロフィール設定ページに進みます。

<strong>なお、当サイトに過去に台本を投稿された方はXアカウントでのログインをお勧めします。</strong>
台本ページにXアカウントを記載していた場合、該当Xアカウントで初回ログインした際に投稿済の台本がアカウントに紐づけされます。
            </pre>              
          </v-col>
        </v-row>
      </v-card-text>
      

      <!-- 投稿済台本の紐づけ -->
      <v-card-title>
        <h3 class="mt-12 mb-0">
          投稿済台本のアカウント紐づけ
        </h3>            
      </v-card-title>
      <v-card-text>
        <v-row class="paragraph-text-contaienr">
          <v-col>
            <pre class="multiline-text ">
過去に台本を投稿されていた場合、以下手順で新しいアカウントに台本を紐づけることが出来ます。
            </pre>              

            <v-table justify="center" class="mt-4">
              <thead>
                <tr>
                  <th class="text-left">
                    状況
                  </th>
                  <th class="text-left link-explain">
                    説明
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="title">台本情報にXアカウントを記載していた場合</td>
                  <td class="link-explain py-4">
                    <p>初回ログイン時、<strong>「Xアカウントでログイン」</strong>を選択すると該当Xアカウントで投稿した台本が紐づけされます。</p>
                  </td>
                </tr>                
                <tr>
                  <td class="title">上記以外</td>
                  <td class="explain py-4">
                    <p>ログイン後、マイページのメニューボタンから<strong>「投稿済台本を紐づけ」</strong>を選択し、投稿済み台本の作者名、パスワードを入力して下さい。</p>
                  </td>
                </tr>                       
              </tbody>
            </v-table>            
          </v-col>
        </v-row>
      </v-card-text>

      <!-- 台本投稿方法 -->
      <v-card-title>
        <h3 class="mt-12 mb-0">
          台本投稿方法
        </h3>            
      </v-card-title>
      <v-card-text>
        <v-row class="paragraph-text-contaienr">
          <v-col>
            <div class="mb-12">
              <h4 class="my-4"><v-icon color="green-lighten-4" class="h-icon mr-2">mdi-circle</v-icon>ファイル形式</h4>
              <pre class="multiline-text ">
台本はテキストファイルで投稿いただけます。
投稿可能なファイル形式は以下の通りです。
              </pre>              

              <v-sheet class="mb-0 px-4">
                <pre class="multiline-text ">          
<strong>【投稿可能なファイル形式】</strong>

拡張子　　： .txt
絵文字　　： 使用可
文字数　　： 制限なし
改行コード： LF、CRLF
文字コード： UTF-8、Shift-JIS、EUC-JP
                </pre>    
              </v-sheet>
            </div>
          </v-col>     
        </v-row>       
        <v-row class="paragraph-text-contaienr">
          <v-col>        
              <h4 class="mb-4"><v-icon color="green-lighten-4" class="h-icon mr-2">mdi-circle</v-icon>台本の記述方法</h4>
              <pre class="multiline-text ">
  テキストファイル内の本文記述ルールは以下の通りです。
              </pre>              

              <v-sheet class="px-4">
                <pre class="multiline-text ">          
<strong>【台本記述ルール】</strong>

・各行に ： （コロン）を付けてください。
・コロンの前には役名を書き、コロンの後にはセリフを書いてください。
・ト書きの行には役名の箇所に 0：を書いてください。

　※コロンと0は全角・半角のどちらでも問題有りません。
                </pre>    
              </v-sheet>      

              <pre class="multiline-text mt-12">
  以下は記述例となります。
              </pre>          

              <v-sheet class="px-4">
                <pre class="multiline-text ">          
0：柚子、ベンチに座る正宗に近づいて話しかける。
柚子：正宗様、こんばんは。月が綺麗な夜ですね。
正宗：やあ、柚子。すまないね。こんな時間に呼び出して。
柚子：いいえ、私もお会いしたかったので大丈夫です。
柚子：二ヶ月ぶりでしょうか。少し日焼けされましたか？　月明かりの下でもわかります。
正宗：はは、そうだね。最近は陸よりも船の上にいるほうがずっと長いからね。
正宗：この間、外洋演習から帰還したばかりだけど、明日にはまた海上生活に逆戻りだ。
                </pre>    
              </v-sheet>                  

              <pre class="multiline-text ">    
上記の台本を投稿すると、アプリ上では以下のように表示されます。
              </pre>

              <v-img width="700" src="/img/explain/about-script-post-explain-1.png" class="mt-4" />
            </v-col>
        </v-row>

        <v-row class="paragraph-text-contaienr">
          <v-col>        
            <h4 class="mt-12 mb-8"><v-icon color="green-lighten-4" class="h-icon mr-2">mdi-circle</v-icon>ルビの振り方</h4>
            <pre class="multiline-text ">
ルビ（ふりがな）を漢字に振りたい場合、台本内に以下のように記載してください。
            </pre>              

            <v-sheet class="px-4">
              <pre class="multiline-text ">          
<strong>【記載例】</strong>

拙者親方と申すは、＊御立会《おたちあい》のうちに

＊ … 半角か全角のアスタリスク
《 … 二重山括弧
              </pre>      
            </v-sheet>
            <pre class="multiline-text ">    
上記の例の台本のルビは以下のように表示されます。
            </pre>     

            <v-img width="400" src="/img/explain/about-script-post-explain-ruby.png" class="mt-4" />                                
          </v-col>
        </v-row>

        <v-row class="paragraph-text-contaienr">
          <v-col>        
            <h4 class="mt-12 mb-8"><v-icon color="green-lighten-4" class="h-icon mr-2">mdi-circle</v-icon>台詞間のスペースの空け方</h4>
            <pre class="multiline-text ">
：（コロン）だけの行を書くと、その行はセリフとセリフの間のスペースとみなされ、空行になります。
            </pre>              

            <v-sheet class="px-4">
              <pre class="multiline-text ">          
<strong>【記載例】</strong>

猫魔王：うむ、十年前に見た、奴の写真に一目惚れして以来、幾年月。
猫魔王：来る日も来る日も玉座に座って待っていたかいがあったニャ……！
サブ：毎日毎日、わくわくソワソワして待っていましたからな。
：
猫魔王：しかし、時間が経ちすぎて、以前に考えていたカッコいいセリフを忘れてしまったニャ……。
              </pre>      
            </v-sheet>
            <pre class="multiline-text ">    
上記の台本を投稿すると、以下のようにセリフとセリフの間にスペースが空きます。
            </pre>     

            <v-img width="400" src="/img/explain/about-script-post-explain-blank.png" class="mt-4" />                                
          </v-col>
        </v-row>
      </v-card-text>

      
      <!-- フォロー -->
      <v-card-title>
        <h3 class="mt-12 mb-0">
          フォロー
        </h3>            
      </v-card-title>
      <v-card-text>
        <v-row class="paragraph-text-contaienr">
          <v-col>
            <pre class="multiline-text ">
作者さんをフォローしたい場合、台本ページの作者さんのお名前をクリックした際に表示されるプロフィールからフォローするか、または台本ページ右下のメニューからプロフィールを表示し、フォローしてください。
            </pre>              
          </v-col>
        </v-row>
      </v-card-text>

      <!-- 新着台本の投稿通知 -->
      <v-card-title>
        <h3 class="mt-12 mb-0">
          新着台本の投稿通知
        </h3>            
      </v-card-title>
      <v-card-text>
        <v-row class="paragraph-text-contaienr">
          <v-col>
            <pre class="multiline-text ">
ログイン後、台本作者さんをフォローすると新着台本投稿時に「新着通知一覧」にお知らせが表示されます。
            </pre>              
          </v-col>
        </v-row>
      </v-card-text>

      <!-- 通報 -->
      <v-card-title>
        <h3 class="mt-12 mb-0">
          通報
        </h3>            
      </v-card-title>
      <v-card-text>
        <v-row class="paragraph-text-contaienr">
          <v-col>
            <pre class="multiline-text ">
利用規約に違反している台本や迷惑行為などを発見された場合、台本右下のメニュー、または作者さんのプロフィールページ右上のメニューから管理者への通報が可能です。

通報内容は管理者が確認後、必要に応じて適切な対応を行います。
            </pre>              
          </v-col>
        </v-row>
      </v-card-text>


      <!-- PWA対応 -->
      <v-card-title>
        <h3 class="mt-12 mb-0">
          スマホホーム画面への追加方法
        </h3>            
      </v-card-title>
      <v-card-text>
        <v-row class="paragraph-text-contaienr">
          <v-col>
            <pre class="multiline-text ">
本サイトはPWA（Progressive Web Application）に対応していますので、スマートフォンのホーム画面に追加する形でインストールすることが出来ます。
ホーム画面に追加した状態で起動するとブラウザのアドレスバーが消えますので、アプリのように使うことが出来ます。
            </pre>

            <v-img width="300" src="/img/explain/about-pwa-explain-view.png" class="mt-4" />    
            <v-img width="300" src="/img/explain/about-pwa-explain-install.png" class="mt-10 mb-4" />    
            <pre class="multiline-text ">                     
ホーム画面に追加したい場合、Androidの方はChrome右上のメニューから「ホーム画面に追加」→「インストール」を選択してください。

iOSの場合、Safariで「ホーム画面に追加」を選択してください。
            </pre>                
              
          </v-col>
        </v-row>
      </v-card-text>      

      <!-- 困ったときの連絡先 -->
      <v-card-title>
        <h3 class="mt-12 mb-0">
          困ったときの連絡先
        </h3>            
      </v-card-title>
      <v-card-text>
        <v-row class="paragraph-text-contaienr">
          <v-col>
            <pre class="multiline-text ">
トラブル発生時やサポートがほしい場合、その他管理者と連絡が取りたい場合は以下フォームからご連絡ください。

返信まではお時間を要する場合があります。ご了承ください。
            </pre>              

            <a href="https://docs.google.com/forms/d/1yullnhaTX0NUXKYEiZgZwYnDCjADbOAtd37pIs7jL98/" target="_blank">
              <v-btn color="teal" class="font-weight-bold" rounded>
                <v-icon class="mr-2">mdi-mail</v-icon>
                連絡用フォーム
              </v-btn>            
            </a>
          </v-col>
        </v-row>
      </v-card-text>

    </v-card>
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

#header {
  height: 120px; //100px;
  background-repeat: repeat-x;
  background-size: cover;
  background-position: center center;
  /** 半透明の黒に */
  background-color: rgba(0, 0, 0, 0.5);
  background-image: $info-page-header-image-path;
}

#container {
  margin: auto;
  //height: 100%;
  max-width: $content-max-width;
}

.v-card {
  height: 100%;
  border: solid 1px $card-border-color;
}

.no-border {
  border: solid 0px #999999 !important;
}

#toc-container {
  width: 90%;
  max-width: 350px;
  margin: 10px auto;
  border: 1px solid #b4b4b4;
}

#toc-header {
  position: relative;
}

#toc-close-button {
  position: absolute;
  top: 6px;
  right: 4px;
  font-size: 80%;
  border: solid 1px #999999;
}

h2 {
  font-size: 80%;
  font-family: "DM Sans", sans-serif;  
}

/*
h3 {
  font-size: 80%;
}*/

h3 {
  font-size: 80%;  
  padding: 0.8em 1em;/*文字の上下 左右の余白*/
  color: #494949;/*文字色*/
  background: #f4f4f4;/*背景色*/
  border-left: solid 5px #80CBC4;/*左線*/
  border-bottom: solid 3px #d7d7d7;/*下線*/
}

h4 {
  padding-bottom: 8px;
  font-size: 110%;  
  border-bottom: solid 1px #999999;
}

.multiline-text {
  white-space: pre-wrap;
  word-wrap: break-word; /* This is optional but can help with long words */
  font-size: 110%;
  line-height: 180%;
  border: solid 0px #999999;
}


.v-table {
  max-width: 900px;
  margin: 0 auto;
  border: solid 1px #9c9c9c;
  border-radius: 4px;
  font-size: 100%;
}

.v-table tr {
  border: solid 1px #868686;
}

.v-table td {
  position: relative;
  border-right: solid 1px #cecece;  
}

.v-table th {
  height: 30px;
  background-color: #eaeaea;
  text-align: center !important;
  font-weight: bold;
  font-size: small;
  color: #042405;
  border-right: solid 1px #cacaca;
  border-bottom: solid 1px #9c9c9c;
}

td.title {
  width: 50%;
  max-width: 300px;
  font-weight: bold;
}

.paragraph-text-contaienr {
  padding: 32px 16px;
  font-size: 110%;
}

@media screen and (max-width: 600px) {
  .paragraph-text-contaienr {
    padding-left: 10px !important;
    padding-right: 10px !important;    
  } 
}

.v-sheet {
  background-color: #F5F6F7;
  border: solid 1px #cccccc;
}

.v-img {
  border: solid 1px #cdcdcd;
}

.v-icon {
  top: -2px;
}
</style>
