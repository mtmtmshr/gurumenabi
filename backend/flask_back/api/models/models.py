from datetime import datetime
from flask_marshmallow import Marshmallow

from flask_marshmallow.fields import fields

from api.database import db

from flask import Flask

app = Flask(__name__)
ma = Marshmallow(app)


class gurumeModel(db.Model):
    __tablename__ = 'restaurants'

    id = db.Column(db.String(10), primary_key=True)
    name = db.Column(db.String(30), nullable=False)
    address = db.Column(db.String(50), nullable=True)
    url = db.Column(db.String(50), nullable=True)
    tel = db.Column(db.String(15), nullable=True)
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    image1 = db.Column(db.String(50), nullable=True)
    image2 = db.Column(db.String(50), nullable=True)
    holiday = db.Column(db.String(30), nullable=True)
    category = db.Column(db.String(30), nullable=True)
    bottomless = db.Column(db.Boolean, nullable=True)
    private_room = db.Column(db.Boolean, nullable=True)
    area_code = db.Column(db.String(10), nullable=True)
    budget = db.Column(db.Integer, nullable=True)

    def __init__(self, name, address):
        self.name = name
        self.address = address

    def __repr__(self):
        return '<gurumeModel {}:{}>'.format(self.name, self.address)


class gurumeSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = gurumeModel
        load_instance = True


class areaModel(db.Model):
    __tablename__ = 'areas'

    area_code = db.Column(db.String(15), primary_key=True)
    area_name = db.Column(db.String(15), primary_key=True)

    def __init__(self, area_code, area_name):
        self.area_code = area_code
        self.area_name = area_name

    def __repr__(self):
        return '<areaModel {}:{}>'.format(self.area_code, self.area_name)


class areaSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = areaModel
        load_instance = True
