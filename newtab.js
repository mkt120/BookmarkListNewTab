const STYLE_VETICAL_ALIGN =  'middle';

// padidng は top right bottom left

const TITLE_VIEW_ICON_OPEN = "＋";
const TITLE_VIEW_ICON_CLOSE = "－";

const CLASS_BOOKMARK_LIST_VIEW = "bookmarkListView";
const CLASS_BOOKMARK_TITLE_VIEW = "bookmarkTitleView";
const CLASS_BOOKMARK_CHLID_VIEWS = "bookmarkChildViews";
const CLASS_BOOKMARK_TITLE_ICON_VIEW = "bookmarkTitleIconView";
const CLASS_BOOKMARK_TITLE_TEXT_VIEW = "bookmarkTitleTextView";
const CLASS_BOOKMARK_CHILD_VIEW = "bookmarkChildView";

// お気に入りのツリーを全て取得する
chrome.bookmarks.getTree(function(bookmark) {

  // getTree でブックマーク全体が取得できた時のコールバック
  // https://developer.chrome.com/extensions/bookmarks#method-getTree
  
  // [その他のブックマーク]フォルダを取得する
  console.log(bookmark[0]['title']);
  var root = bookmark[0]['children'];

  // [その他のブックマーク]フォルダのブックマークをbodyに追加する
  root = document.getElementById("bookmark");
  root.setAttribute("Align", "left");
  
  // rootが空なのでchildrenを渡す
  bookmark = bookmark[0]['children'];

  for (var i in bookmark) {
    if (bookmark[i]['children'] != null && bookmark[i]['children'].length > 0) {
      var parents = createBookmarks(document, bookmark[i]);
      root.appendChild(parents);
    }
  }
});



////////////////////////////////////////////
// ブックマークツリーを作る
////////////////////////////////////////////
function createBookmarks(document, bookmarkTreeNode) {
  console.log("createBookmarks");

  var parent = document.createElement("div");
  parent.setAttribute("class", CLASS_BOOKMARK_LIST_VIEW);
  var id = bookmarkTreeNode['id'];
  var isOpen = localStorage[id];
  var parentDiv = createTitleView(document, bookmarkTreeNode, isOpen);
  parent.appendChild(parentDiv);

  // 子View要素の親
  var childViews = document.createElement("div");
  childViews.setAttribute("class", CLASS_BOOKMARK_CHLID_VIEWS);

  // 子Bookmarkを作る
  var children = bookmarkTreeNode['children'];
  for (var i in children) {
    var child;
    if (children[i]['children'] != null && children[i]['children'].length > 0) {
      child = createBookmarks(document, children[i]);
    } else {
      child = createChild(document, children[i]);
    }
    console.log("createBookmarks:" + children[i]['title']);
    childViews.appendChild(child);
  }
  parent.appendChild(childViews);

  if (isOpen == 'true') {
      childViews.style.display = "";
  } else {
      childViews.style.display = "none";
  }

  // クリックリスナー
  parentDiv.addEventListener("click", function(){
    var element= parentDiv.getElementsByClassName(CLASS_BOOKMARK_TITLE_ICON_VIEW)[0];
    var isOpen;
    if (childViews.style.display != "none") {
      isOpen = 'false';
      element.innerHTML = TITLE_VIEW_ICON_OPEN;
      childViews.style.display = "none";
    } else {
      isOpen = 'true';
      element.innerHTML = TITLE_VIEW_ICON_CLOSE;
      childViews.style.display = "";
    }
    var id = parentDiv.getAttribute('id');
    localStorage[id] = isOpen;
  });
  return parent;
}

////////////////////////////////////////////
// タイトルのViewを作る
////////////////////////////////////////////
function createTitleView(document, bookmarkTreeNode, isOpen) {
  // root
  var div = document.createElement("div");
  div.setAttribute("name", bookmarkTreeNode['title']);
  div.setAttribute("class", CLASS_BOOKMARK_TITLE_VIEW);
  div.setAttribute("id", bookmarkTreeNode['id']);

  // アイコン
  var span = document.createElement("span");
  var a = document.createElement("a");
  if (isOpen == 'true') {
    a.innerHTML = TITLE_VIEW_ICON_CLOSE;
  } else {
    a.innerHTML = TITLE_VIEW_ICON_OPEN;
  }
  a.setAttribute("class", CLASS_BOOKMARK_TITLE_ICON_VIEW);
  span.appendChild(a);
  
  // タイトル
  a = document.createElement("a");
  a.innerHTML = bookmarkTreeNode['title'];
  a.setAttribute("class", CLASS_BOOKMARK_TITLE_TEXT_VIEW);
  span.appendChild(a);

  div.appendChild(span);
  
  return div;
}

////////////////////////////////////////////
// 子ブックマークを作る
////////////////////////////////////////////
function createChild(document, child) {
  var title = child['title'];
  var url = child['url'];
  
  var div = document.createElement("div");
  div.setAttribute("class", CLASS_BOOKMARK_CHILD_VIEW);
  // 要素の設定
  var a = document.createElement("a");
  a.style.verticalAlign = STYLE_VETICAL_ALIGN;
  if (title != null && title.length > 0) {
    // タイトルを設定
    a.innerHTML = title;
    if (url != null && url.length > 0) {
      // URLもあれば設定
      a.setAttribute("href", url);
      // 新しいタブで表示させる設定
      a.setAttribute("target", "_blank");
    }
  }
  div.appendChild(a);
  return div;
}
