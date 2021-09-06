import os
from os.path import join, dirname
from dotenv import load_dotenv


load_dotenv(verbose=True)

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://{user}:{password}@{host}/{db}?charset=utf8'.format(**{
        'user': os.getenv('DB_USER', os.environ['DB_USERNAME']),
        'password': os.getenv('DB_PASSWORD', os.environ['DB_PASSWORD']),
        'host': os.getenv('DB_HOST', os.environ['DB_HOSTNAME']),
        'db': os.getenv('DB_NAME', os.environ['DB_NAME']),
    })

DEBUG = True

SQLALCHEMY_TRACK_MODIFICATIONS = True if os.environ["SQLALCHEMY_TRACK_MODIFICATIONS"] == "True" else False 
SQLALCHEMY_ECHO = True if os.environ["SQLALCHEMY_ECHO"] == "True" else False
SECRET_KEY = os.getenv('SECRET_KEY', '')
STRIPE_API_KEY = os.getenv('STRIPE_API_KEY', '')
