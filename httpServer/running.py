import time
from flask import Flask,render_template
from flask import request
import psycopg2
import json


#flask框架
app = Flask(__name__)
app.debug = True
global reDicts
reDicts = {}
# 路由
@app.route('/postjson',methods=['POST','GET'])
def postjson():
	# 连接数据库
	conn = psycopg2.connect(database='data_log', user='postgres', password='yjn123456', host='127.0.0.1', port='5432')
	cursor = conn.cursor()
	'''接收数据'''
	recv_data = request.get_data()
	dictDatas = json.loads(recv_data)
	nowTime = time.localtime()
	serverTime = time.strftime("%Y-%m-%d %H:%M:%S", nowTime)
	timeTag = time.strftime("%Y%m%d", nowTime)
	tableName = 'device' + timeTag
	try:
		for dictKey in dictDatas.keys():
			reDicts[dictKey] = dictDatas[dictKey]
			dictData = dictDatas[dictKey]
			dictData['serverTime'] = serverTime
			strSql = "create table if not exists %s(skid serial primary key,deviceid integer, devicetype integer,Time integer,lat double precision,lng double precision,speed integer,status integer,servertime varchar(60));insert into %s(deviceid,devicetype,time,lat,lng,speed,status,servertime) values (%d,%d,%d,%f,%f,%d,%d,%s%s%s);"%(tableName,tableName,dictData["DeviceID"],dictData["DeviceType"],dictData["Time"],dictData["lat"],dictData["lng"],dictData["Speed"],dictData["Status"],"'",dictData["serverTime"],"'")
			cursor.execute(strSql)
			conn.commit()
		cursor.close()
		conn.close()
		reJson = json.dumps(reDicts,ensure_ascii=False,indent=1)
		with open('data2.json', "w", encoding='utf-8') as js:
			js.write(reJson)
	except:
		if recv_data:
			print('接收数据异常：',recv_data)
			return '接收数据异常：'+str(recv_data)
		else:
			print('接收数据为空')
			return '接收数据为空'
	return '接收成功'
@app.route('/')
def hello():
	return 'hello'

@app.route('/index')
def index():
	return render_template('index.html')
if (__name__=='__main__'):
	app.run(
	host='0.0.0.0',#任何ip都可以访问
	port=1207,
	debug=True
)
