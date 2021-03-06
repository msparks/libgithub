/**
 * libgithub - JavaScript library for visualizing GitHub data
 * Matt Sparks [http://quadpoint.org]
 *
 * Badge design from github-commit-badge by Johannes 'heipei' Gilger
 */
libgithub = new Object();


libgithub.Badge = function (username, repo, commitId)
{
  this._username = username;
  this._repo = repo;
  this._commitId = (typeof(commitId) == 'undefined') ? 'master' : commitId;
  this._gravatarSize = 60;
  this._startHidden = true;
  this._target = null;

  this.gravatarSize = function () { return this._gravatarSize; };
  this.gravatarSizeIs = function (size) { this._gravatarSize = size; };
  this.startHidden = function () { return this._startHidden; };
  this.startHiddenIs = function (setting) { this._startHidden = setting; };
  this.target = function () { return this._target; };
};


libgithub.Badge.prototype._userRepo = function (commit)
{
  var userRepo = _ce('div', {'class': 'libgithub-badge-username'});
  var link = _ce('a',
    {'href': 'https://github.com/' + this._username + '/' + this._repo,
     'target': '_blank',
     'class': 'libgithub-badge-username'});

  $(link).append(_tn(this._username + '/' + this._repo));
  $(userRepo).append(link);

  return userRepo;
};


libgithub.Badge.prototype._diffLine = function (commit)
{
  var author = commit.name();
  var image_url = _gravatarImageURL(commit.email(), this._gravatarSize);

  var diffLine = _ce('div', {'class': 'libgithub-badge-diffline'});
  var image = _ce('img',
    {'src': image_url,
     'class': 'libgithub-badge-gravatar',
     'alt': this._username});
  $(diffLine).append(image);

  var link = _ce('a',
    {'href': ('https://github.com/' + this._username + '/' + this._repo +
              '/commit/' + commit.sha()),
     'target': '_blank',
     'class': 'libgithub-badge-commitid'});
  $(link).append(_tn(' ' + _truncate(commit.sha(), 10, '')));
  $(diffLine).append(_tn(author + ' committed '));

  var niceTime = _niceTime(commit.date());
  var commitDate = _ce('span',
    {'class': 'libgithub-badge-text-date'});
  $(commitDate).append(_tn(niceTime));

  $(diffLine).append(link);
  $(diffLine).append(_tn(' about '));
  $(diffLine).append(commitDate);

  return diffLine;
};


libgithub.Badge.prototype._commitMessage = function (commit)
{
  var commitMessage = _ce('div',
    {'class': 'libgithub-badge-commitmessage'});
  $(commitMessage).append(
    _tn('"' + _truncate(commit.message(), 100) + '"'));

  return commitMessage;
};


libgithub.Badge.prototype._diffStat = function (commit, fileList)
{
  var numAdded = 0;
  var numRemoved = 0;
  var files = commit.files();
  for (var i in files) {
    var file = files[i];
    numAdded += file.additions();
    numRemoved += file.deletions();
  }

  var diffStat = _ce('div', {'class': 'libgithub-badge-diffstat'});
  var addedElement = _ce('span', {'class': 'libgithub-badge-diffadded'});
  var removedElement = _ce('span', {'class': 'libgithub-badge-diffremoved'});

  $(diffStat).append(_tn('('));
  $(diffStat).append(_tn(numAdded));
  $(diffStat).append($(addedElement).text(
      numAdded == 1 ? ' line added' : ' lines added'));
  $(diffStat).append(_tn(', '));
  $(diffStat).append(_tn(numRemoved));
  $(diffStat).append($(removedElement).text(
      numRemoved == 1 ? ' line deleted' : ' lines deleted'));
  $(diffStat).append(_tn(')'));

  if (numAdded + numRemoved > 0) {
    var username = this._username;
    var repo = this._repo;
    var showFilesLink = _ce('a',
      {'href': '#',
       'class': 'libgithub-badge-showMoreLink',
       'id': 'showMoreLink' + username + repo});

    $(showFilesLink).append(_tn('Show files'));
    $(diffStat).append(_tn(' '));
    $(diffStat).append(showFilesLink);

    $(showFilesLink).click(function () {
      $(fileList).slideToggle();

      if ($(this).text() == 'Show files')
        $(this).text('Hide files');
      else
        $(this).text('Show files');
      return false;
    });
  }

  return diffStat;
};


libgithub.Badge.prototype._fileList = function (commit)
{
  var files = commit.files();
  var filesAdded = [];
  var filesRemoved = [];
  var filesModified = [];
  for (var i in files) {
    var file = files[i];
    if (file.status() == 'added')
      filesAdded.push(file);
    else if (file.status() == 'removed')
      filesRemoved.push(file);
    else if (file.status() == 'modified')
      filesModified.push(file);
  }

  var fileList = _ce('div',
    {'class': 'libgithub-badge-filelist',
     'id': this._username + this._repo});
  var words = {'added': ['Added', filesAdded],
               'removed': ['Removed', filesRemoved],
               'modified': ['Modified', filesModified]};

  for (var word in words) {
    var container = _ce('div');
    var ulist = _ce('ul');
    var cName = 'libgithub-badge-diff' + word;
    var text = words[word][0] + ':';
    var fset = words[word][1];
    var i = 0;

    $(container).append($(_ce('span', {'class': cName})).text(text));
    $(container).append(ulist);

    $.each(fset, function(j, f) {
      var file = _ce('li');
      if (word == 'modified')
        $(file).append(_tn(f.filename()));
      else
        $(file).append(_tn(f.filename()));
      $(ulist).append(file);
      i++;
    });

    if (i > 0)
      $(fileList).append(container);
  }

  return fileList;
};


libgithub.Badge.prototype._badgeStructure = function (commit)
{
  var username = this._username;
  var repo = this._repo;
  var badgeDiv = _ce('div', {'class': 'libgithub-badge-outline'});

  var userRepo = this._userRepo(commit);
  var diffLine = this._diffLine(commit);
  var commitMessage = this._commitMessage(commit);
  var fileList = this._fileList(commit);
  var diffStat = this._diffStat(commit, fileList);

  $(badgeDiv).append(userRepo);
  $(badgeDiv).append(diffLine);
  $(badgeDiv).append(commitMessage);
  $(badgeDiv).append(diffStat);
  $(badgeDiv).append(fileList);

  badgeDiv.hideFiles = function () {
    $(fileList).hide();
  };

  return badgeDiv;
};


libgithub.Badge.prototype._showCommit = function (commitId, element)
{
  var _url = 'https://api.github.com/repos/' +
             this._username + '/' + this._repo + '/commits/' + commitId +
             '?callback=?';
  var _this = this;

  $.getJSON(_url, function (data) { _this._callback(data, element); });
};


libgithub.Badge.prototype._callback = function (data, element)
{
  var commit = new libgithub._Commit;
  commit.Init(data.data);
  var badgeDiv = this._badgeStructure(commit);
  element.append(badgeDiv);
  if (this._startHidden)
    badgeDiv.hideFiles();
};


libgithub.Badge.prototype.targetIs = function (selector)
{
  this._target = selector;
  var _element = $(selector);
  this._showCommit(this._commitId, _element);
};


/**
 * libgithub.ActivityLine: a single-line activity indicator for a repository.
 */
libgithub.ActivityLine = function (username, repo, commitId)
{
  this._username = username;
  this._repo = repo;
  this._commitId = (typeof(commitId) == 'undefined') ? 'master' : commitId;
  this._gravatarSize = 32;
  this._target = null;
  this._repoLink = null;

  this.gravatarSize = function () { return this._gravatarSize; };
  this.gravatarSizeIs = function (size) { this._gravatarSize = size; };
  this.repoLink = function () { return this._repoLink; };
  this.repoLinkIs = function (link) { this._repoLink = link; };
  this.target = function () { return this._target; };
};


libgithub.ActivityLine.prototype.targetIs = function (selector)
{
  this._target = selector;
  var _element = $(selector);

  this._showCommit(this._commitId, _element);
};


libgithub.ActivityLine.prototype._showCommit = function (commitId, element)
{
  var _url = 'https://api.github.com/repos/' +
             this._username + '/' + this._repo + '/commits/' + commitId +
             '?callback=?';
  var _this = this;

  $.getJSON(_url, function (data) { _this._callback(data, element); });
};


libgithub.ActivityLine.prototype._callback = function (data, element)
{
  var commit = new libgithub._Commit;
  commit.Init(data.data);
  var lineDiv = this._activityLineStructure(commit);
  element.append(lineDiv);
};


libgithub.ActivityLine.prototype._activityLineStructure = function (commit)
{
  var username = this._username;
  var repo = this._repo;
  var lineDiv = _ce('div', {'class': 'libgithub-activity-line'});

  if (this._gravatarSize > 0) {
    var image = _ce(
      'img',
      {'src': _gravatarImageURL(commit.email(), this._gravatarSize),
       'class': 'libgithub-activity-gravatar',
       'alt': this._username});
    $(lineDiv).append(image);
  }

  if (this._repoLink) {
    var repoUrl = 'github.com/' + username + '/' + repo;
    var repoLink = _ce('a', {
      'href': 'https://' + repoUrl,
      'target': '_blank',
      'class': 'libgithub-activity-repository'
    });

    $(repoLink).append(_tn(repoUrl));

    // If _repoLink is a function, allow the client to transform repoLink.
    if (typeof this._repoLink == 'function') {
      repoLink = $(this._repoLink(repoLink));
    } else {  // Else, add a colon and space.
      var span = $(_ce('span', {'class': 'libgithub-activity-repolink'}));
      repoLink = span.append(repoLink).append(': ');
    }

    $(lineDiv).append(repoLink);
  }

  var login = this._username;
  var loginLink = _ce('a', {'href': 'https://github.com/' + login,
                            'target': '_blank',
                            'class': 'libgithub-activity-username'});
  $(loginLink).append(_tn(login));

  var link = _ce('a',
    {'href': ('https://github.com/' + this._username + '/' + this._repo +
              '/commit/' + commit.sha()),
     'target': '_blank',
     'class': 'libgithub-activity-commitid'});
  $(link).append(_tn(' ' + _truncate(commit.sha(), 10, '')));

  var niceTime = _niceTime(commit.date());
  var commitDate = _ce('span',
    {'class': 'libgithub-activity-date'});
  $(commitDate).append(_tn(niceTime));

  $(lineDiv).append(loginLink);
  $(lineDiv).append(_tn(' committed '));
  $(lineDiv).append(link);
  $(lineDiv).append(_tn(' about '));
  $(lineDiv).append(commitDate);

  return lineDiv;
};


/**
 * Internal representation of a git commit on GitHub.
 */
libgithub._Commit = function (data)
{
  // Commit information.
  this._name = undefined;
  this._date = undefined;
  this._email = undefined;
  this._sha = undefined;
  this._message = undefined;

  // Content of the commit.
  this._files = undefined;     // List of _ChangedFile objects.

  this.name = function() { return this._name; };
  this.date = function() { return this._date; };
  this.email = function() { return this._email; };
  this.sha = function() { return this._sha; };
  this.message = function() { return this._message; };

  this.files = function() { return this._files; };
};


/**
 * Initializes the data in this Commit object from GitHub API data.
 *
 * @param {Object} data Data from 'commits' call to GitHub API v3.
 */
libgithub._Commit.prototype.Init = function (data)
{
  this._name =
    (data.committer != null) ? data.committer.login :
    data.commit.committer.name;
  this._date = data.commit.committer.date;
  this._email = data.commit.author.email;
  this._sha = data.sha;
  this._message = data.commit.message;

  this._files = [];
  for (var i in data.files) {
    var changedFile = new libgithub._ChangedFile(data.files[i]);
    this._files.push(changedFile);
  }
};


libgithub._ChangedFile = function (file_data) {
  this._filename = undefined;
  this._status = undefined;
  this._deletions = undefined;
  this._additions = undefined;

  this.filename = function() { return this._filename; };
  this.status = function() { return this._status; };
  this.deletions = function() { return this._deletions; };
  this.additions = function() { return this._additions; };

  this.Init(file_data);
};


libgithub._ChangedFile.prototype.Init = function (file_data) {
  this._filename = file_data.filename;
  this._status = file_data.status;
  this._deletions = file_data.deletions;
  this._additions = file_data.additions;
};

/** utility functions **/

/**
 * truncate a string to a given length
 *
 * Args:
 *   string: string to truncate
 *   length: truncation length
 *   truncation: optional string to append to truncation (default: '...')
 *
 * Returns:
 *   truncated string
 */
var _truncate = function (string, length, truncation)
{
  length = length || 30;
  truncation = (typeof truncation == 'undefined') ? '...' : truncation;
  return string.length > length ?
    string.slice(0, length - truncation.length) + truncation : string;
};


/**
 * format a commit time into a 'humane' string
 *
 * Args:
 *   dateTime: date string returned with a commit
 *
 * Returns:
 *   humane string like '8 weeks ago'
 */
var _niceTime = function (dateTime)
{
  var d = Date.parse(dateTime);
  d.addHours((new Date).getTimezoneOffset() / 60);
  return humane_date(d.toString("yyyy-MM-ddTHH:mm:ssZ"));
};


/**
 * create an HTML element
 *
 * Args:
 *   tagName: name of tag
 *   attributes: map of attribute -> value pairs
 *
 * Returns:
 *   new element
 */
var _ce = function (tagName, attributes)
{
  var e = document.createElement(tagName);
  for (attr in attributes) {
    var value = attributes[attr];
    e.setAttribute(attr, value);
  }
  return e;
};


/**
 * create text node ready for insertion into HTML element
 *
 * Args:
 *   text: text node content
 *
 * Returns:
 *   new text node
 */
var _tn = function (text)
{
  return document.createTextNode(text);
};


/**
 * Generate a Gravatar image URL.
 *
 * Args:
 *   email: email address
 *   size: size in pixels
 *
 * Returns:
 *   image URL
 */
var _gravatarImageURL = function (email, size)
{
  return 'http://www.gravatar.com/avatar/' + hex_md5(email) + '?s=' + size;
};
