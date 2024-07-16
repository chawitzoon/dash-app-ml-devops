from flask import request, render_template, jsonify
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
    prices = request.json.get('prices')
    payload = {"prices": prices}
    try:
        response = requests.post("http://127.0.0.1:8080/predict_next_price", json=payload)
        response.raise_for_status()
        result = response.json().get("result")
    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 500

    return jsonify({"result": result})

# @app.route('/stock_data', methods=['GET'])
# def stock_data():
#     # Fetch real-time stock data from an API
#     api_url = "https://api.example.com/stock/amazon"  # Replace with a real stock API endpoint
#     response = requests.get(api_url)
#     data = response.json()
#     return jsonify(data)

@app.route('/stock_data', methods=['GET'])
def stock_data():
    # Dummy data for testing
    data = {
        "timestamps": [
            "2024-07-14T10:00:00Z",
            "2024-07-14T11:00:00Z",
            "2024-07-14T12:00:00Z",
            "2024-07-14T13:00:00Z",
            "2024-07-14T14:00:00Z",
            "2024-07-14T15:00:00Z",
            "2024-07-14T16:00:00Z"
        ],
        "prices": [
            3300.00,
            3310.50,
            3325.75,
            3330.25,
            3320.00,
            3315.50,
            3305.00
        ]
    }
    return jsonify(data)