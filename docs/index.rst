libgithub
=========

libgithub is a JavaScript library for displaying GitHub data on websites. It
uses the `GitHub API v2 <http://develop.github.com>`_.

Currently libgithub only generates 'badges', which look something like this:

.. image:: libgithub-badges.png

libgithub is available from `quadpoint.org
<http://quadpoint.org/projects/libgithub>`_ as a single JavaScript file. A
'minified' version of the library is available as well. CSS styles are also
included with the distribution and can be customized.


Requirements and Installation
-----------------------------

libgithub relies on several other JavaScript libraries to function properly, all
of which are conveniently included in the libgithub distribution:

* `jQuery <http://jquery.com>`_
* ``humane.js``
* ``date.js``
* ``md5.js``

These libraries must be loaded along with ``libgithub.min.js`` in the HTML files
which use libgithub.

Thus, to load libgithub for use, simply include in your HTML file::

  <script type="text/javascript" src="jquery.js"></script>
  <script type="text/javascript" src="humane.js"></script>
  <script type="text/javascript" src="date.js"></script>
  <script type="text/javascript" src="md5.js"></script>
  <script type="text/javascript" src="libgithub.min.js"></script>

You may need to modify the file paths as appropriate, depending on your
installation. To get a style similar to the screenshot above, you will also need
to include the CSS stylesheet, using something like::

  <link type="text/css" rel="stylesheet" href="css/libgithub.css" />

Again, modify the path as appropriate. This stylesheet references images also
included with the libgithub distribution that are expected to be in a directory
called 'img' by default.


Usage
-----

Here is a simple example for creating a badge::

  <script type="text/javascript">
  $(window).load(function () {
    var b = new libgithub.Badge('msparks', 'alphasign');
    b.targetIs('#commit');
  });
  </script>

  <div id="commit"></div>

This example uses jQuery to create a badge when the window loads. The output is
displayed in the element selected by '#commit', which is the ``<div
id="commit">``.

To display multiple commits or change other various settings, see the :ref:`libgithub.Badge` API.

API
---

.. toctree::
  :maxdepth: 1

  Badge
