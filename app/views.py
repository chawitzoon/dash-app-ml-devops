from flask import request, render_template, jsonify
from flask.logging import create_logger
import requests
import logging
import os
from . import app

# for test
import random
from datetime import datetime

LOG = create_logger(app)
LOG.setLevel(logging.INFO)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/predict", methods=["POST"])
def predict():
    prices = request.json.get("prices")
    payload = {"prices": prices}
    api_url = os.getenv('PREDICT_API_URL', 'http://127.0.0.1:8080/predict_next_price') # also default value for local development
    try:
        response = requests.post(api_url, json=payload)
        response.raise_for_status()
        result = response.json().get("result")
    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 500

    return jsonify({"result": result})


init_price = 120.0


@app.route("/stock_data", methods=["GET"])
def stock_data():
    # Generate dummy OHLC data with timestamps
    global init_price  # Declare init_price as global to modify it

    # Update init_price
    open_price = init_price
    close_price = init_price + round(random.uniform(-5, 6), 2)
    high = max(open_price, close_price) + round(random.uniform(5, 5), 2)
    low = min(open_price, close_price) - round(random.uniform(5, 5), 2)
    init_price = close_price
    now = datetime.utcnow()

    ohlc_data = {
        "timestamp": now.isoformat() + "Z",
        "open": open_price,
        "high": high,
        "low": low,
        "close": close_price,
    }
    return jsonify(ohlc_data)
