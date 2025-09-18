from app import create_app
from prometheus_flask_exporter import PrometheusMetrics

# Create a Flask application instance
app = create_app()
metrics = PrometheusMetrics(app)
metrics.info('app_info', 'File Conversion Service', version='1.0.0')

if __name__ == '__main__':
    # Run the application
    app.run(debug=False)