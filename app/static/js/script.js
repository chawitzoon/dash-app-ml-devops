$(document).ready(function() {
    const TIMESTAMP_INTERVAL = 1; // interval in second
    const MAX_DATA_POINTS = 6 * 3600 / TIMESTAMP_INTERVAL; // Max data points for 6 hours if fetching every second

    let timestamps = [];
    let openPrices = [];
    let highPrices = [];
    let lowPrices = [];
    let closePrices = [];
    let predictedPrices = [];
    let differences = [];

    function fetchStockData() {
        $.ajax({
            type: 'GET',
            url: '/stock_data',
            success: function(response) {
                console.log('Stock data:', response);
                updateChart(response);
                runPrediction();
            },
            error: function(error) {
                console.error('Error:', error);
            }
        });
    }

    function runPrediction() {
        if (closePrices.length >= 7) {
            const lastSevenPrices = closePrices.slice(-7);
            $.ajax({
                type: 'POST',
                url: '/predict',
                contentType: 'application/json',
                data: JSON.stringify({prices: lastSevenPrices}),
                success: function(response) {
                    console.log('Prediction data:', response);
                    predictedPrices.push(response.result);
                    if (predictedPrices.length > MAX_DATA_POINTS) {
                        predictedPrices.shift();
                    }
                },
                error: function(error) {
                    console.error('Error:', error);
                }
            });
        }
    }

    function updateChart(data) {
        if (timestamps.length >= 50) {
            timestamps.shift();
            openPrices.shift();
            highPrices.shift();
            lowPrices.shift();
            closePrices.shift();
        }

        timestamps.push(data.timestamp);
        openPrices.push(data.open);
        highPrices.push(data.high);
        lowPrices.push(data.low);
        closePrices.push(data.close);

        if (predictedPrices.length > 0) {
            const nextActualPrice = closePrices[closePrices.length - 1];
            const lastPredictedPrice = predictedPrices.shift(); // Get and remove the oldest predicted price
            const difference = nextActualPrice - lastPredictedPrice;
            const percentageDifference = ((difference) / lastPredictedPrice * 100).toFixed(2);
            differences.push(difference);
            if (differences.length > MAX_DATA_POINTS) {
                differences.shift();
            }

            const predictionMessage = `Predicted price: ${lastPredictedPrice}, Actual price: ${nextActualPrice}, Difference: ${percentageDifference}%`;
            $('#predictionResult').text(predictionMessage);

            updateAccuracyTable();
        }

        const candlestickTrace = {
            x: timestamps,
            close: closePrices,
            decreasing: {line: {color: 'red'}},
            high: highPrices,
            increasing: {line: {color: 'green'}},
            low: lowPrices,
            open: openPrices,
            type: 'candlestick',
            xaxis: 'x',
            yaxis: 'y'
        };

        const layout = {
            title: 'Amazon Stock Price Over Time',
            xaxis: {
                title: 'Time',
                rangeslider: {
                    visible: true
                },
                type: 'date'
            },
            yaxis: {
                title: 'Price'
            }
        };

        Plotly.newPlot('stockChart', [candlestickTrace], layout);
    }

    function updateAccuracyTable() {
        const lastPrediction = differences.slice(-1);
        const last10Predictions = differences.slice(-10);
        const last1HourPredictions = differences.slice(-3600 / TIMESTAMP_INTERVAL); // Assuming data fetched every second
        const last6HourPredictions = differences.slice(-6 * 3600 / TIMESTAMP_INTERVAL); // Assuming data fetched every second

        const statistics = {
            'last prediction': calculateStatistics(lastPrediction),
            'last 10 predictions': calculateStatistics(last10Predictions),
            'last 1 hour predictions': calculateStatistics(last1HourPredictions),
            'last 6 hour predictions': calculateStatistics(last6HourPredictions)
        };

        const tableHtml = `
            <table class="table">
                <thead>
                    <tr>
                        <th>Statistics</th>
                        <th>Last Prediction</th>
                        <th>Last 10 Predictions</th>
                        <th>Last 1 Hour Predictions</th>
                        <th>Last 6 Hour Predictions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Mean Difference</td>
                        <td>${statistics['last prediction'].mean}</td>
                        <td>${statistics['last 10 predictions'].mean}</td>
                        <td>${statistics['last 1 hour predictions'].mean}</td>
                        <td>${statistics['last 6 hour predictions'].mean}</td>
                    </tr>
                    <tr>
                        <td>Median Difference</td>
                        <td>${statistics['last prediction'].median}</td>
                        <td>${statistics['last 10 predictions'].median}</td>
                        <td>${statistics['last 1 hour predictions'].median}</td>
                        <td>${statistics['last 6 hour predictions'].median}</td>
                    </tr>
                    <tr>
                        <td>Max Difference</td>
                        <td>${statistics['last prediction'].max}</td>
                        <td>${statistics['last 10 predictions'].max}</td>
                        <td>${statistics['last 1 hour predictions'].max}</td>
                        <td>${statistics['last 6 hour predictions'].max}</td>
                    </tr>
                    <tr>
                        <td>Min Difference</td>
                        <td>${statistics['last prediction'].min}</td>
                        <td>${statistics['last 10 predictions'].min}</td>
                        <td>${statistics['last 1 hour predictions'].min}</td>
                        <td>${statistics['last 6 hour predictions'].min}</td>
                    </tr>
                </tbody>
            </table>
        `;

        $('#accuracyTable').html(tableHtml);
    }

    function calculateStatistics(data) {
        const n = data.length;
        if (n === 0) return {mean: 'N/A', median: 'N/A', max: 'N/A', min: 'N/A'};

        const mean = (data.reduce((acc, val) => acc + val, 0) / n).toFixed(2);
        const sortedData = [...data].sort((a, b) => a - b);
        const median = (sortedData[Math.floor(n / 2)] + sortedData[Math.ceil(n / 2)]) / 2;
        const max = Math.max(...data).toFixed(2);
        const min = Math.min(...data).toFixed(2);

        return {mean, median: median.toFixed(2), max, min};
    }

    fetchStockData();
    setInterval(fetchStockData, TIMESTAMP_INTERVAL * 1000); // Update every second for testing; change to 3600000 for hourly updates
});
