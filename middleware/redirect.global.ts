//======================================================
//
// リダイレクト用のミドルウェア
// ・public/script/detail/[¥d+] にアクセスされた場合、/?sid=[¥d]+ にリダイレクトする
//
//======================================================

export default defineNuxtRouteMiddleware((to, from) => {
  console.log("[middleware] redirect " + to.path)

  try {
    const match = to.path.match(/^\/public\/script\/detail\/(\d+)$/)
    if (match) {
      const id = match[1]
      //return navigateTo(`/?sid=${id}`)
      useRouter().push(`/?sid=${id}`);
    }
  } catch (error) {
    console.error(error)
  }
})
