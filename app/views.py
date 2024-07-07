from flask import Flask, request, jsonify
from flask.logging import create_logger
import logging
from . import app

LOG = create_logger(app)
LOG.setLevel(logging.INFO)


@app.route("/")
def home():
    html = (
        "<h3>App Home: From Azure Pipelines (Continuous Delivery)</h3>"
    )
    return html.format(format)


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        input_str = data.get('input', '')
        # For testing, return the input string
        prediction = f'Processed input: {input_str}'
        return jsonify({"prediction": prediction})
    except KeyError as e:
        LOG.error("KeyError: %s", e)
        return jsonify({"error": "KeyError occurred"}), 400
    except TypeError as e:
        LOG.error("TypeError: %s", e)
        return jsonify({"error": "TypeError occurred"}), 400
    except Exception as e:
        LOG.error("Unexpected error: %s", e)
        return jsonify({"error": "An unexpected error occurred"}), 500
