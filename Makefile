install:
	pip install --upgrade pip &&\
		pip install -r requirements.txt

test:
	python -m pytest -vv test_app.py


lint:
	pylint --disable=R,C,W0718 *.py

format:
	black *.py

all: install lint test