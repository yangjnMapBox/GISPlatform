import os
import sys
import time
from flask import Flask,render_template
from flask import request
import binascii
import socket,select
from configparser import ConfigParser
import psycopg2
import json
class SheKouTerminal():
	DeviceID = int
	DeviceType = int
	Time = int
	lat = float
	lng = float
	Speed = int
	Status = int
	def __init__(self,DeviceID,DeviceType,Time,lat,lng,Speed,Status):
		super(SheKouTerminal,self).__init__()
		self.DeviceID = DeviceID
		self.DeviceType = DeviceType
		self.Time = Time
		self.lat = lat
		self.lng = lng
		self.Speed = Speed
		self.Status = Status
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
conn = psycopg2.connect(database=dbCfg, user=userCfg, password=pdCfg, host=hostCfg,port=portCfg)
cursor = conn.cursor()
#创建服务套接字对象
server  = socket.socket()
server.bind(('',1029))#绑定要监听的端口
#192.168.26.44
server.listen(3)#监听
print("已开启监听")

inputs = [server]
dictDatas={}#key：DeviceID；value:SheKouTerminal类
while True:
	rs, ws, es = select.select(inputs, [], [])
	for r in rs:
		if r is server:
			c, addr = server.accept()  # 返回两个值，c服务端接收的客户端生成的实例
			inputs.append(c)
			print(len(inputs)-1)
		else:
			try:
 				data = r.recv(1024)
				disconnected = not data
			except:
				disconnected = True
			if disconnected:
				inputs.remove(r)
				print(len(inputs) - 1)
			else:
				try:
					print(data)
					# with open('data.txt',"w") as js:
					# 	js.write(data)
					# dictData = json.loads(data)
					# nowTime = time.localtime()
					# dictData["serverTime"] = time.strftime("%Y-%m-%d %H:%M:%S",nowTime)
					# timeTag = time.strftime("%Y%m%d",nowTime)
					# tableName = 'device' + timeTag
					# dictDatas[dictData["DeviceID"]] = dictData
					# reJson = json.dumps(dictDatas,ensure_ascii=False)
					# with open('data.json',"w",encoding='utf-8') as js:
					# 	js.write(reJson)
					# strSql = "create table if not exists %s(skid serial primary key,deviceid integer, devicetype integer,Time integer,lat double precision,lng double precision,speed integer,status integer,servertime varchar(60));insert into %s(deviceid,devicetype,time,lat,lng,speed,status,servertime) values (%d,%d,%d,%f,%f,%d,%d,%s%s%s);"%(tableName,tableName,dictData["DeviceID"],dictData["DeviceType"],dictData["Time"],dictData["lat"],dictData["lng"],dictData["Speed"],dictData["Status"],"'",dictData["serverTime"],"'")
					# cursor.execute(strSql)
					# conn.commit()
				except:
					print(type(data))
					print(data)

# json = {"DeviceID":1,"DeviceType":2,"Time":2548,"lat":113.86619614,"lng":22.49621409,"Speed":20,"Status":2}
#nohup python  -u test.py > test.log 2>&1 &          29841



