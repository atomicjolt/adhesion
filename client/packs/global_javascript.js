const CANVAS_DOMAIN = window.location.host;
const SPEED_GRADER_REGEX = /\/courses\/\d+\/gradebook\/speed_grader/;
const STUDENT_REVIEW_REGEX = /\/courses\/\d+\/assignments\/\d+\/submissions\/\d+/;
const COURSE_REGEX = /\/courses\/([0-9]+)/;
const ASSIGNMENT_REGEX = /\/assignments\/([0-9]+)/;
const STUDENT_REGEX = /\/submissions\/([0-9]+)/;
const SUBMISSION_REGEX = /[?&]download=([^&]+).*$/;
let APP_LOADED = false;
let ADDED_FRAME = false;

$(() => {
  function onPage(regex) {
    return window.location.pathname.match(regex);
  }

  function findDomForWindow(sourceWindow) {
    const iframes = document.getElementsByTagName('IFRAME');
    for (let i = 0; i < iframes.length; i += 1) {
      if (iframes[i].contentWindow === sourceWindow) {
        return iframes[i];
      }
    }
    return null;
  }

  function receiveMessage(event) {
    const iframe = findDomForWindow(event.source);
    const message = JSON.parse(event.data);
    let { height } = message;
    switch (message.subject) {
      case 'app.loaded':
        APP_LOADED = true;
        return;
      case 'app.enableFullscreen':
        iframe.requestFullscreen();
        return;
      case 'app.disableFullscreen':
        document.exitFullscreen();
        document.webkitCancelFullScreen();
        document.mozCancelFullScreen();
        document.msExitFullscreen();
        return;
      case 'lti.frameResize':
        if (height <= 0) height = 1;
        if (iframe) {
          if (typeof height === 'number') {
            height += 'px';
          }
          iframe.height = height;
          iframe.style.height = height;
        }
        break;
      default:
    }
  }

  function sendSubmissionMessage(iframe, href) {
    if (href) {
      const submissionMessage = {
        courseId: href.match(COURSE_REGEX)[1],
        assignmentId: href.match(ASSIGNMENT_REGEX)[1],
        studentId: href.match(STUDENT_REGEX)[1],
        submissionId: href.match(SUBMISSION_REGEX)[1],
      };
      iframe.contentWindow.postMessage(submissionMessage, '*');
    } else {
      const submissionMessage = {
        subject: 'app.submissionSelectionChange'
      };
      iframe.contentWindow.postMessage(submissionMessage, '*');
    }
  }

  function initializeApp() {
    $(document).ready(() => {
      APP_LOADED = false;
      const findElement = setInterval(() => {
        const iframeHolder = $('#iframe_holder');
        const iframeDiv = $('#iframe_holder div');
        const speedgraderIframe = $('#speedgrader_iframe');
        const submissionLinks = $('a.display_name');
        const submissionSelect = $('#submission_to_view');

        // Insert the iframe where canvas's is located
        if (iframeHolder.length && speedgraderIframe.length) {
          speedgraderIframe.remove();
          iframeDiv.remove();
          iframeHolder.append(`<iframe id="atomicdocs" allow="fullscreen" src="https://${CANVAS_DOMAIN}/courses/${ENV.course_id}/external_tools/retrieve?display=borderless&url=https://atomicdocs.atomicjolt.xyz/lti_launches?launch_context=ATOMICDOCS" width="100%" height="0" scrolling="yes" style="border:none;">`);
        }
        if ($('#atomicdocs').length && APP_LOADED) {
          // Send latest and last submission info
          const iframe = document.getElementById('atomicdocs');
          const { href } = submissionLinks[submissionLinks.length - 1];
          sendSubmissionMessage(iframe, href);

          // Setup listener for submission selection dropdown
          if (submissionSelect.length) {
            submissionSelect[0].addEventListener('change', () => {
              const newIframe = document.getElementById('atomicdocs');
              sendSubmissionMessage(newIframe);
              initializeApp();
            });
          }

          // Prevent default behavior of submission links and attatch
          // event listener to send the message to the iframe
          submissionLinks.off('click');
          submissionLinks.on('click', (e) => {
            sendSubmissionMessage(iframe, e.target.href);
            return false;
          });
          clearInterval(findElement);
        }
      }, 200);
    });
  }

  function loadStudentApp(previewFrame, link) {
    const findElement = setInterval(() => {
      const containerDiv = previewFrame.contents().find('.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-draggable.ui-resizable').last();
      const iframe = containerDiv.find('iframe').last();
      const parentDiv = iframe.parent();
      const atomicdocs = containerDiv.find('iframe#atomicdocs');
      if (iframe.length && parentDiv.length && !ADDED_FRAME) {
        iframe.remove();
        const course = link.match(COURSE_REGEX)[1];
        parentDiv.last().append(`<iframe id="atomicdocs" allow="fullscreen" src="https://${CANVAS_DOMAIN}/courses/${course}/external_tools/retrieve?display=borderless&url=https://atomicdocs.atomicjolt.xyz/lti_launches?launch_context=ATOMICDOCS" width="100%" height="100%" scrolling="yes" style="border:none;">`);
        ADDED_FRAME = true;
      }
      if (atomicdocs.length && APP_LOADED) {
        sendSubmissionMessage(atomicdocs[0], link);
        clearInterval(findElement);
      }
    }, 200);
  }

  function initializeStudentApp() {
    $(document).ready(() => {
      let submissionLinks;
      const findLinks = setInterval(() => {
        const previewFrame = $('#preview_frame');
        if (previewFrame.length) {
          submissionLinks = previewFrame.contents().find('.modal_preview_link.Button--link');
        }
        if (previewFrame.length && submissionLinks.length) {
          _.forEach(submissionLinks, (link) => {
            link.addEventListener('click', () => {
              ADDED_FRAME = false;
              APP_LOADED = false;
              loadStudentApp(previewFrame, link.href);
            });
          });
          clearInterval(findLinks);
        }
      }, 200);
    });
  }

  window.addEventListener('message', receiveMessage, false);

  if (onPage(SPEED_GRADER_REGEX) && window.parent === window) {
    initializeApp();
  }
  if (onPage(STUDENT_REVIEW_REGEX) && window.parent === window) {
    initializeStudentApp();
  }
});
