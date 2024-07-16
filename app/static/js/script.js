$(document).ready(function() {
    $('#priceForm').on('submit', function(event) {
        event.preventDefault();
        const prices = $('#prices').val().split(',').map(Number);
        
        $.ajax({
            type: 'POST',
            url: '/predict',
            contentType: 'application/json',
            data: JSON.stringify({prices: prices}),
            success: function(response) {
                $('#result').text(response.result);
            },
            error: function(error) {
                console.error('Error:', error);
                $('#result').text('Error occurred. Please try again.');
            }
        });
    });

    function fetchStockData() {
        $.ajax({
            type: 'GET',
            url: '/stock_data',
            success: function(response) {
                console.log('Stock data:', response); // Log the response to ensure data is fetched
                updateChart(response);
            },
            error: function(error) {
                console.error('Error:', error);
            }
        });
    }

    function updateChart(data) {
        const ctx = document.getElementById('stockChart').getContext('2d');
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.timestamps,
                datasets: [{
                    label: 'Amazon Stock Price',
                    data: data.prices,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: false
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'hour',
                            tooltipFormat: 'll HH:mm'
                        },
                        title: {
                            display: true,
                            text: 'Time'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Price'
                        }
                    }
                }
            }
        });
    }

    fetchStockData();
    setInterval(fetchStockData, 3600000); // Update every hour
});
