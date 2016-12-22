url = location.pathname.includes('quizzes')
if (url == true) {
  checkBody()
} else {
  null
}

function checkBody(){
  console.log("CHECKING BODY");
  if(document.getElementsByTagName("body").length){
    addTags();
  } else {
    setTimeout(checkBody, 100);
  }
}

function addTags(){
  document.getElementsByTagName("body")[0].setAttribute("oncopy", "return false");
  document.getElementsByTagName("body")[0].setAttribute("oncut", "return false");
  document.getElementsByTagName("body")[0].setAttribute("onpaste", "return false");
  console.log("TAGS SET")
}
