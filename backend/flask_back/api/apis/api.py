from flask_restful import Resource, reqparse, abort
from flask import jsonify
from api.models.models import gurumeModel, gurumeSchema, areaModel, areaSchema
from api.database import db
import json
import requests
import sqlalchemy
from bs4 import BeautifulSoup
import math


class gurumeListAPI(Resource):
    def __init__(self):
        self.reqparse = reqparse.RequestParser()
        self.reqparse.add_argument('area', required=True)
        self.reqparse.add_argument('is_bottomless_cup', required=True)
        self.reqparse.add_argument('is_private_room', required=True)
        self.reqparse.add_argument('lowerbudget', required=True)
        self.reqparse.add_argument('checked_category', required=True)
        super(gurumeListAPI, self).__init__()

    def get(self):
        query_data = self.reqparse.parse_args()

        # 条件をfileter_dictに格納
        fileter_dict = {}
        area = query_data['area']
        if area != "高松市全域":
            area_code = db.session.query(areaModel.area_code).filter_by(area_name=area)[0][0]
            fileter_dict[gurumeModel.area_code] = area_code

        if query_data['is_private_room'] == "true":
            fileter_dict[gurumeModel.private_room] = True

        if query_data['is_bottomless_cup'] == "true":
            fileter_dict[gurumeModel.bottomless] = True

        fileter_dict[gurumeModel.budget] = int(query_data['lowerbudget'])

        #　fileter_dictをもとに条件に当てはまらないものをフィルタリング
        results = db.session.query(gurumeModel)
        for k, v in fileter_dict.items():
            if k != gurumeModel.budget:
                results = results.filter(k == v)
            else:
                results = results.filter(k < v)


        # カテゴリー選択Falseの店をフィルタリング
        category_fileter_dict = {}
        checked_category = query_data['checked_category']

        for k, v in json.loads(checked_category).items():
            if not v:
                category_fileter_dict[k] = False
        for k, v in category_fileter_dict.items():
            results = results.filter(sqlalchemy.not_(gurumeModel.category.like('%\\' + k + '%', escape='\\')))

        jsonData = gurumeSchema(many=True).dump(results.all()[::-1])

        return jsonData



class locationSearchAPI(Resource):
    def __init__(self):
        self.reqparse = reqparse.RequestParser()
        self.reqparse.add_argument('lat', required=True)
        self.reqparse.add_argument('lng', required=True)
        self.reqparse.add_argument('distance', required=True)
        self.reqparse.add_argument('is_bottomless_cup', required=True)
        self.reqparse.add_argument('is_private_room', required=True)
        self.reqparse.add_argument('checked_category', required=True)
        self.reqparse.add_argument('lowerbudget', required=True)
        super(locationSearchAPI, self).__init__()

    def calculate_distance_from_lat_lng(self, lat1, lng1, lat2, lng2):
        r = 6378.137
        lat1 *= math.pi / 180
        lng1 *= math.pi / 180
        lat2 *= math.pi / 180
        lng2 *= math.pi / 180
        # km
        distance = r * math.acos(math.sin(lat1) * math.sin(lat2) + math.cos(lat1) * math.cos(lat2) * math.cos(lng2-lng1))
        return distance * 1000 # m

    def get(self):
        query_data = self.reqparse.parse_args()

        lat = float(query_data['lat'])
        lng = float(query_data['lng'])
        results = db.session.query(gurumeModel)
        fileter_dict = {}
        if query_data['is_private_room'] == "true":
            fileter_dict[gurumeModel.private_room] = True

        if query_data['is_bottomless_cup'] == "true":
            fileter_dict[gurumeModel.bottomless] = True

        fileter_dict[gurumeModel.budget] = int(query_data['lowerbudget'])

        #　fileter_dictをもとに条件に当てはまらないものをフィルタリング
        results = db.session.query(gurumeModel)
        for k, v in fileter_dict.items():
            if k != gurumeModel.budget:
                results = results.filter(k == v)
            else:
                results = results.filter(k < v)

        # カテゴリー選択Falseの店をフィルタリング
        category_fileter_dict = {}
        checked_category = query_data['checked_category']

        for k, v in json.loads(checked_category).items():
            if not v:
                category_fileter_dict[k] = False
        for k, v in category_fileter_dict.items():
            results = results.filter(sqlalchemy.not_(gurumeModel.category.like('%\\' + k + '%', escape='\\')))

        distance = int(query_data['distance'])

        new_results = []
        for result in results.all()[::-1]:
            if result.latitude and result.longitude:
                if self.calculate_distance_from_lat_lng(lat, lng, result.latitude, result.longitude) <= distance:
                    new_results.append(result)

        jsonData = gurumeSchema(many=True).dump(new_results)

        return jsonData


class locationAPI(Resource):
    def __init__(self):
        self.reqparse = reqparse.RequestParser()
        self.reqparse.add_argument('lat', required=True)
        self.reqparse.add_argument('lng', required=True)
        super(locationAPI, self).__init__()

    def get(self):
        query_data = self.reqparse.parse_args()

        lat = query_data['lat']
        lng = query_data['lng']

        params = {
            "ipt": "csv",
            "latcsv": lat,
            "loncsv": lng
        }

        url = "http://usoinfo.if.land.to/osmtool/latlon2addr.php"
        res = requests.get(url, params=params)
        res.encoding = res.apparent_encoding
        soup = BeautifulSoup(res.text, 'html.parser')
        return jsonify(location=soup.find_all("b")[2].get_text())
