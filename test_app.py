import pytest
from app.webapp import app
import requests
from unittest.mock import patch

@pytest.fixture
def client():
    with app.test_client() as client:
        with app.app_context():
            yield client

def test_index(client):
    response = client.get("/")
    assert response.status_code == 200
    assert b"Predict Next Price" in response.data

@patch('requests.post')
def test_predict(mock_post, client):
    mock_post.return_value.status_code = 200
    mock_post.return_value.json.return_value = {"result": 130.0}

    response = client.post("/predict", json={"prices": [120.0, 125.0, 123.0, 127.0, 126.0, 128.0, 130.0]})
    assert response.status_code == 200
    assert response.get_json() == {"result": 130.0}

    mock_post.assert_called_once_with("http://127.0.0.1:8080/predict_next_price", json={"prices": [120.0, 125.0, 123.0, 127.0, 126.0, 128.0, 130.0]})

def test_stock_data(client):
    response = client.get("/stock_data")
    assert response.status_code == 200

    data = response.get_json()
    assert "timestamp" in data
    assert "open" in data
    assert "high" in data
    assert "low" in data
    assert "close" in data
