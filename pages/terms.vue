<script lang="ts" setup>
//======================================================
//
// terms.vue 利用規約ページ
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
          <v-icon class="title-icon mr-1 ml-2" color="orange-lighten-3">mdi-file-document</v-icon><span class="pl-2">利用規約</span>
        </h2>
        <v-divider class="mt-2" />        
      </v-card-title>

      <v-row>
        <v-col cols="10" class="ml-4 pl-8 mt-4 mb-10 pr-0 text-top-explain">
          <p>台本の利用や投稿前には以下の規約をご確認ください。</p>          
        </v-col>
      </v-row>

      <v-card-title>
        <h3 class="green mt-12 px-0 mb-0">
          <v-icon class="mr-2 ml-2 mb-1" color="teal-lighten-3">mdi-microphone</v-icon>利用規約（演者様向け）
        </h3>   
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col class="px-0">
            <v-list class="mt-4 px-8 py-4">
              <ul class="text-body-1">
                <li>台本の著作権は作者様に帰属します。無断転載や無断改変はご遠慮ください。</li>
                <li>台本を配信アプリやDiscordなどで使用される際は、作者様のお名前と台本名を配信アプリのコメント欄などにご記載下さい。</li>
                <li>各台本のページにはそれぞれの台本利用規定が個別に記載されていますので、台本使用前にご確認下さい。<br />各規定の説明は以下のとおりです。</li>
              </ul>
            </v-list>

            <div id="table-container" class="mx-6">
              <v-table justify="center" class="mt-2">
                <thead>
                  <tr>
                    <th class="text-left">
                      利用規定
                    </th>
                    <th class="text-left">
                      説明
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="title text-body-2">非商用利用時は連絡不要</td>
                    <td class="explain py-4">
                      <p>非商用利用であれば連絡不要で台本をお使いいただけます。</p>
                    </td>
                  </tr>
                  <tr>
                    <td class="title text-body-2">商用、非商用共に連絡不要</td>
                    <td class="explain py-4">
                      商用、非商用に関わらず、連絡不要で台本をお使いいただけます。
                    </td>
                  </tr>           
                  <tr>
                    <td class="title text-body-2">商用、非商用共に作者に連絡要</td>
                    <td class="explain py-4">
                      台本を使用される前に作者様にXや台本コメントなどで連絡し、許可を得て下さい。
                    </td>
                  </tr>         
                  <tr>
                    <td class="title text-body-2">台本説明欄参照</td>
                    <td class="explain py-4">
                      台本説明欄に記載されている利用規定に従われてください。
                    </td>
                  </tr>                      
                </tbody>
              </v-table>
            </div>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-title class="mt-12">
        <h3 class="blue mt-12">
          <v-icon class="mr-2 mb-1" color="blue-lighten-3">mdi-pencil</v-icon>利用規約（作者様向け）
        </h3>    
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col class="px-0">
            <v-list class="mt-4 px-10 py-4">
              <ul class="text-body-1">
                <li>台本の著作権は台本作者様に帰属します。</li>
                <li>台本投稿時に台本利用規定を選択できるようになっています。独自の利用規定を設けたい場合、台本説明欄に内容をご記載下さい。</li>
                <li><strong>R-18台本を投稿される際はタイトルに「R18」の文字を含めて下さい。</strong></li>
                <li>他者の著作権を侵害する行為はご遠慮ください。</li>
                <li>他者への迷惑を目的とした台本の投稿はご遠慮ください。</li>
                <li>規約違反の台本は削除させていただく場合があります。</li>                
                <li>このサイトは無償で運営しております。運営者が金銭を要求したりサイト上に営利目的の広告を掲載することはありません。</li>     
                <li>利用規約を遵守された上であれば台本の投稿・編集・削除はご自由に行っていただいて構いません。</li>
              </ul>
            </v-list>                   
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
  height: 120px;
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

li {
  margin: 16px 0px;
}

.v-card {
  height: 100%;
  border: solid 1px $card-border-color;
}

.no-border {
  border: solid 0px #999999 !important;
}

.v-card-text {
  max-width: 1000px;
  margin: 0 auto;
}

h2 {
  font-size: 80%;
}

.text-top-explain {
  font-size: 90%;
}

h3.green {
  font-size: 80%;  
  padding: 0.8em 1em;/*文字の上下 左右の余白*/
  color: #494949;/*文字色*/
  background: #f4f4f4;/*背景色*/
  border-left: solid 5px #80CBC4;/*左線*/
  border-bottom: solid 3px #d7d7d7;/*下線*/
}

h3.blue {
  font-size: 80%;  
  padding: 0.8em 1em;/*文字の上下 左右の余白*/
  color: #494949;/*文字色*/
  background: #f4f4f4;/*背景色*/
  border-left: solid 5px #7db4e6;/*左線*/
  border-bottom: solid 3px #d7d7d7;/*下線*/
}

h4 {
    font-size: 75%;
}

.text-body-2 {
  font-size: 110% !important;
}

#table-caption {
  max-width: 1800px;
  margin: 0 auto;
  border: solid 0px #999999;
}

.v-table {
  max-width: 1800px;
  margin: 0 auto;
  border: solid 1px #9c9c9c;
  border-radius: 4px;
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
  width: 40%;
  max-width: 200px;
  font-weight: bold;
}


#toc-container {
  max-width: 350px;
  margin: 10px auto;
  border: 1px solid #b4b4b4;
  border-radius: 4px;
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

</style>
