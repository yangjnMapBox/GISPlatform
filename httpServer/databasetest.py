import psycopg2
from configparser import ConfigParser
import time
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
# print(time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()))
# print(time.time())
# strSql = '''
# create table if not exists data_log20190613
# (
# 	skid serial primary key,
# 	deviceid integer, devicetype integer,
# 	Time integer,lat double precision,
# 	lng double precision,speed integer,
# 	status integer,servertime varchar(60)
# );insert into data_log20190613(deviceid,devicetype,time,lat,lng,speed,status,servertime) values (1,2,3,4,5,6,7,'15:35');'''
#
# cursor.execute(strSql)
# conn.commit()
# print(time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()))
# print(time.time())
nowTime = time.localtime()
timeTag = time.strftime("%Y%m%d",nowTime)
print(type(timeTag))