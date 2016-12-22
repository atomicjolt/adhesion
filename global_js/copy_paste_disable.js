const url = location.pathname.includes('quizzes');

function addTags() {
  document.getElementsByTagName('body')[0].setAttribute('oncopy', 'return false');
  document.getElementsByTagName('body')[0].setAttribute('oncut', 'return false');
  document.getElementsByTagName('body')[0].setAttribute('onpaste', 'return false');
}

function checkBody() {
  if (document.getElementsByTagName('body').length) {
    addTags();
  } else {
    setTimeout(checkBody, 100);
  }
}

if (url === true) {
  checkBody();
}
