//======================================================
//
// 確認ダイアログ表示用
//
// [使い方]
//  if (await showConfirmDialog("text")) {
//    console.log("OK")
//  } else {  
//    console.log("キャンセル")
//  }
// 
//  const { showConfirmDialog } = useConfirmDialog({});
//
// <template>
//   <common-confirm-dialog />
// </template>
//
//======================================================

import { ref } from "vue";

type DialogText = {
  title?: string;
  text?: string;
  ok?: string;
  cancel?: string;
};

const isOpen = ref<boolean>(false);

// ダイアログのテキスト
const dialogText = ref<DialogText>({
  title: "確認",
  text: "",
  ok: "OK",
  cancel: "キャンセル",
});

let _resolve: (value: boolean | PromiseLike<boolean>) => void;

/**
 * 確認メッセージを表示
 * 
 * @param props 
 * @returns 
 */
export function useConfirmDialog(props: DialogText = {}) {
  if (props.title) dialogText.value.title = props.title;
  if (props.text) dialogText.value.text = props.text;
  if (props.ok) dialogText.value.ok = props.ok;
  if (props.cancel) dialogText.value.cancel = props.cancel;

  const showConfirmDialog = (text: string) => {
    isOpen.value = true;

    // textの。に改行を付与
    let aText = text.replace("。", "。<br />");

    dialogText.value.text = aText;

    return new Promise<boolean>((resolve) => {
      _resolve = resolve;
    });
  };

  const ok = () => {
    isOpen.value = false;
    _resolve(true);
  };

  const cancel = () => {
    isOpen.value = false;
    _resolve(false);
  };

  const close = () => {
    isOpen.value = false;
  };

  return {
    showConfirmDialog,
    ok,
    cancel,
    close,
    isOpen,
    dialogText,
  };
}

/**
 * メッセージダイアログを表示
 * 
 * @param props 
 * @returns 
 */
export function useMessageDialog(props: DialogText = {}) {
  if (props.title) dialogText.value.title = props.title;
  if (props.text) dialogText.value.text = props.text;
  if (props.ok) dialogText.value.ok = props.ok;
  if (props.cancel) dialogText.value.cancel = props.cancel;

  const showMessageDialog = (text: string) => {
    isOpen.value = true;

    // textの。に改行を付与
    let aText = text.replace("。", "。<br />");

    dialogText.value.text = aText;

    return new Promise<boolean>((resolve) => {
      _resolve = resolve;
    });
  };

  const ok = () => {
    isOpen.value = false;
    _resolve(true);
  };

  const cancel = () => {
    isOpen.value = false;
    _resolve(false);
  };

  const close = () => {
    isOpen.value = false;
  };

  return {
    showMessageDialog,
    ok,
    cancel,
    close,
    isOpen,
    dialogText,
  };
}