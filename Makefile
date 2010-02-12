default: minified

all: default doc

minified: libgithub.js
	python util/jsmin.py < libgithub.js > libgithub.min.js

doc:
	sphinx-build -E -b html docs/ docs/build

clean:
	rm -f libgithub.min.js
	rm -rf docs/build