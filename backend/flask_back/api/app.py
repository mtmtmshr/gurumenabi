from flask import Flask, jsonify
from flask_restful import Api
from api.database import init_db
from api.apis.api import gurumeListAPI, locationAPI, locationSearchAPI
from flask_cors import CORS
import os
from os.path import join, dirname
from dotenv import load_dotenv


load_dotenv(verbose=True)

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)


CORS_WHITE = os.environ["CORS_WHITE"]

def create_app():
    app = Flask(__name__)
    cors = CORS(app, resources={r"*": {"origins": CORS_WHITE}})
    app.config.from_pyfile('config.py')

    init_db(app)

    api = Api(app)
    api.add_resource(gurumeListAPI, '/gurume')
    api.add_resource(locationSearchAPI, '/locationSearch')
    api.add_resource(locationAPI, '/location')
    # api.add_resource(HogeAPI, '/hoges/<id>')

    return app


app = create_app()
