from flask import request, render_template, redirect, url_for
from flask.logging import create_logger
import requests
import logging
from . import app

LOG = create_logger(app)
LOG.setLevel(logging.INFO)
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    prices = request.form.get('prices')
    prices_list = [float(x) for x in prices.split(',')]

    payload = {"prices": prices_list}
    try:
        response = requests.post("http://127.0.0.1:8080/predict_next_price", json=payload)
        response.raise_for_status()
        result = response.json().get("result")
    except requests.RequestException as e:
        return f"An error occurred: {e}", 500

    return render_template('result.html', result=result)
