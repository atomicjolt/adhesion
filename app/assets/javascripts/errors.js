/* eslint-disable no-var,object-shorthand,func-names,prefer-arrow-callback */

var toggler;

toggler = function() {
  var display;

  display = {
    errorTextToggle: document.querySelector('.error-text-toggle'),
    errorText: document.querySelector('.error-text'),

    doToggle: function(e) {
      e.preventDefault();
      this.errorText.classList.toggle('expanded');
    }
  };

  if (display.errorTextToggle) {
    display.errorTextToggle.addEventListener('click', function(e) { display.doToggle(e); });
  }
};

toggler();
