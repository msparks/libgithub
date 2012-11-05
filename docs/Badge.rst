.. _libgithub.Badge:

libgithub.Badge
===============

This class is used to create and display GitHub commit badges.

Reference
---------

.. class:: libgithub.Badge(username, repo[, commitId])

  Construct a new badge object.

  :param username: GitHub username
  :param repo: Repository name
  :param commitId: ref name or commit ID (default: 'master')

  .. method:: gravatarSize()

    Get the `Gravatar <http://gravatar.com>`_ size. Defaults to 60 pixels.

  .. method:: gravatarSizeIs(size)

    Set the `Gravatar <http://gravatar.com>`_ size.

    :param size: width of Gravatar in pixels

  .. method:: startHidden()

    Current ``startHidden`` setting. If true, the file list is hidden when the
    badge is created. Defaults to true.

  .. method:: startHiddenIs(setting)

    Set the ``startHidden`` setting.

    :param setting: new setting. True = hide file list, False = show file list

  .. method:: target()

    Get the current target.

  .. method:: targetIs(selector)

    Set the target HTML element via a jQuery selector.

    This issues a request to GitHub for commit data and creates a callback to
    display the badge.

    The badge is appended to the inside of the element selected by the selector.

    :param selector: string selector to find the target HTML element. See the
                     `jQuery documentation <http://jquery.com>`_ for more
                     information about valid selectors.


Examples
--------

Here is a simple example for creating a badge::

  <script type="text/javascript">
  $(window).load(function () {
    var b = new libgithub.Badge('msparks', 'alphasign');
    b.targetIs('#commit');
  });
  </script>

  <div id="commit"></div>

To show the file list by default, simply toggle the ``startHidden`` setting like so::

  var b = new libgithub.Badge('msparks', 'alphasign');
  b.startHiddenIs(false);
  b.targetIs('#commit');

The ``commitId`` parameter in the badge constructor can be a ref of any kind: a specific commit ID, partial or complete; a branch name; or a tag name. Creating a badge for a specific commit is easy::

  var b = new libgithub.Badge('msparks', 'alphasign', 'c5f6c7a2');
  b.targetIs('#commit');
