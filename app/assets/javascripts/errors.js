// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

var toggler = function() {
  var display = {
    errorTextToggle: document.querySelector('.error-text-toggle'),
    errorText: document.querySelector('.error-text'),

    doToggle: function(e) {
      e.preventDefault();
      this.errorText.classList.toggle('expanded');
    }
  };

  display.errorTextToggle.addEventListener('click', function(e) { display.doToggle(e); });
};

toggler();
