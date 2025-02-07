# Entry point to start the Flask app
from app.routes import main
from flask import Flask

app = Flask(__name__)
app.register_blueprint(main)

if __name__ == '__main__':
    app.run(debug=True)