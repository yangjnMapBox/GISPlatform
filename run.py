import os
import sys
import GeometryMethod
import psycopg2
from flask import Flask, render_template,url_for,session
from flask import request
from configparser import ConfigParser
import datetime

#读取配置文件
cp = ConfigParser()
cp.read("db.cfg")
section = cp.sections()[0]
dbCfg =cp.get(section, "database")
userCfg = cp.get(section,"user")
pdCfg = cp.get(section,"password")
hostCfg = cp.get(section,"host")
portCfg = cp.get(section,"port")
#连接数据库
conn = psycopg2.connect(database='water', user=userCfg, password=pdCfg, host=hostCfg,port=portCfg)
global cursor
# cursor = conn.cursor()

# #地图数据库表
global g_lstTable
# g_lstTables = ['water','point','reservoir','bgd_25_water','river','djhydrographicnet']
# #取water表属性
global g_dictWaters
# g_dictWaters = {}
# strSql = "select bgdid,x_min,x_max,y_min,y_max from water order by gid"
# cursor.execute(strSql)
# rows = cursor.fetchall()
# for row in rows:
# 	g_dictWaters[row[0]] = [row[1],row[2],row[3],row[4]]

#实例化
app = Flask(__name__)

# 路由
@app.route('/')
def index():
	return render_template('GISmap.html')
@app.route('/dali')
def dali():
	return render_template('water_dali.html')
@app.route('/customMap')
def customMap():
	return render_template('customMap.html')
@app.route('/customMap/addSources')
def addSources():
	return render_template('addSources.html')
@app.route('/customMap/addSources/sourceInfo')
def sourceInfo():
	return render_template('sourceInfo.html')
@app.route('/mapAttribution/')
def mapAttribution():
	starttime = datetime.datetime.now()
	# conn.commit()
	reValue = ''
	lng =request.args.get('lng')
	lat = request.args.get('lat')
	zoom = request.args.get('zoom')
	viLayer = request.args.get('viLayer')
	# viLayers = viLayer.split(",")
	lng = float(lng)
	lat = float(lat)
	zoom = int(zoom)
	clickSquare = GeometryMethod.CreatSquare(lng,lat,zoom)#点击点正方形框，宽8个像素
	starttime2 = datetime.datetime.now()
	dictLayerGeoID = GeometryMethod.GetIntersectGeoAtt2(clickSquare,g_dictWaters,cursor)#与正方形框相交的图形key:图层/数据表名，value:相交的id
	starttime3 = datetime.datetime.now()
	if(dictLayerGeoID == -1):
		reValue = '-1'
	else:
		reValue = GeometryMethod.ReturnLayerAtt(dictLayerGeoID,cursor)
	endtime = datetime.datetime.now()
	print(starttime2-starttime,starttime3-starttime2, endtime - starttime2)
	return reValue

#程序入口
if (__name__=='__main__'):
	app.run(
	host = '0.0.0.0',
	port = 5005,
	debug = True
	)