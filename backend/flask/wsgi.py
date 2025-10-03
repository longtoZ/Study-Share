from app import create_app
from prometheus_flask_exporter import PrometheusMetrics

app = create_app()
metrics = PrometheusMetrics(app)
metrics.info('app_info', 'File Conversion Service', version='1.0.0')

if __name__ == '__main__':
    app.run(debug=False)