import pytest
from app.webapp import app


@pytest.fixture
def client():
    with app.test_client() as client:
        with app.app_context():
            yield client
def test_home(client):
    response = client.get("/")
    assert response.status_code == 200
    assert b"App Home: From Azure Pipelines (Continuous Delivery)" in response.data
def test_predict(client):
    response = client.post("/predict", json={"input": "test string"})
    assert response.status_code == 200
    assert response.get_json() == {"prediction": "Processed input: test string"}
