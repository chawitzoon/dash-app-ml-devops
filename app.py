from flask import Flask, request, jsonify
from flask.logging import create_logger
import logging
import traceback

app = Flask(__name__)
LOG = create_logger(app)
LOG.setLevel(logging.INFO)


@app.route("/")
def home():
    html = (
        "<h3>App Home: From Azure Pipelines (Continuous Delivery)</h3>"
    )
    return html.format(format)


def predict():
    try:
        data = request.json
        input_str = data.get('input', '')
        # For testing, return the input string
        prediction = f'Processed input: {input_str}'
        return jsonify({"prediction": prediction})
    except Exception as e:
        LOG.error(f"Error processing input: {e}")
        return jsonify({"error": str(e)}), 400


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
