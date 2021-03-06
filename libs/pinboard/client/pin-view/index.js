
/**
 * Module dependencies
 */

var events = require('events');
var domify = require('domify');
var html = require('./template');
var reactive = require('reactive');
var Emitter = require('emitter');

/**
 * Export `PinView`.
 */

module.exports = PinView;

/**
 * PinView constructor
 */

function PinView(model) {

  this.el = domify(html);
  this.model = model;

  // Assigning featured style to featured pins only
  if (this.model.featuredStatus === true) {
    this.el.className = 'pin featured';
  } else {
    this.el.className = 'pin';
  }

  loadComments(this.el, this.model);

  reactive(this.el, this.model);

  this.thumbnail = this.el.querySelector('img');
  this.thumbnail.addEventListener('load', this.onloaded.bind(this));

  this.commentField = this.el.querySelector('.commentField');

  this.commentsContainer = this.el.querySelector('.comment-box');
  this.pinControlContainer = this.el.querySelector('.pin-controls');

  this.events = events(this.el, this);
  this.events.bind('click [data-js-action=showCommentInput]', 'onShowCommentInput');
  this.events.bind('click [data-js-action=hideCommentInput]', 'onHideCommentInput');
  this.events.bind('click [data-js-action=addComment]', 'onAddComment');
  this.events.bind('click [data-js-action=featurePin]', 'onFeaturePin');
};

function loadComments(element, model) {
  this.el = element;
  this.model = model

  this.commentsList = this.el.querySelector('.comments');
  this.commentCountButton = this.el.querySelector('.pin-comment-btn');

  this.commentsList.innerHTML = '';
  this.commentCountButton.innerHTML = '';

  // Check if a comment exists
  if (this.model.comments) {
    // Reset the commentHTML
    var commentHTML = '';

    // Get comment count
    var commentCount = this.model.comments.length;

    // Show comment count on UI
    this.commentCountButton.innerHTML = commentCount;

    // For each comment, add it using the hardcoded template
    for (var i = 0; i < commentCount; i ++) {
      commentHTML += '<li class="comment">' +
      '<a class="comment-author">Ryan Ko</a>' +
      '<span class="comment-content">' + this.model.comments[i] + '</span>' +
      '<span class="comment-time">13/05/89</span>' +
      '</li>';
    }

    // load commentHTML
    this.commentsList.innerHTML = commentHTML;
  }
}

Emitter(PinView.prototype);

PinView.prototype.onloaded = function (e) {
  this.emit('loaded', this);
};

PinView.prototype.onShowCommentInput = function (e) {
  e.preventDefault();
  // Get the comment-box div
  this.commentsContainer.style.display = 'block';
  this.pinControlContainer.style.display = 'none';

  // fix this to reload packery more elegantly
  pckry = new Packery(container, { itemSelector: '.pin' });
};

PinView.prototype.onHideCommentInput = function (e) {
  e.preventDefault();

  // Get the comment-box div
  this.commentsContainer.style.display = 'none';
  this.pinControlContainer.style.display = 'block';

  // fix this to reload packery more elegantly
  pckry = new Packery(container, { itemSelector: '.pin' });
};

PinView.prototype.onAddComment = function (callback) {
  var text = this.commentField.value;
  console.log('comment text', text);
  this.emit('comment', this, text);
};

PinView.prototype.onFeaturePin = function (e) {
  var pinClassName = this.el.className;

  if (pinClassName === 'pin featured') {
    this.el.className = 'pin';
  } else {
    this.el.className = 'pin featured';
  }

  setTimeout (function(){
    pckry = new Packery(container, { itemSelector: '.pin' });
  }, 300);
}
