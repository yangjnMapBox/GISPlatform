#!/usr/bin/python
#-*- coding:utf-8 -*-
import os
import CommonMethods
import numpy as np
import matplotlib.pyplot as plt
import GeometryMethod
import random
import psycopg2
conn = CommonMethods.DatabaseConn()
cursor = conn.cursor()

#waterlevel (1,5),ph(6.5,7.5),oxygen(6.5,7.5),nitrogen(0.25,0.4)
count = 0
strSql = 'select buildingid,height from building'
rows = CommonMethods.GetDataFromTable(cursor,strSql)
dictBuildidHeight = {}
for row in rows:
    dictBuildidHeight[row[0]] = row[1]
conn2 = psycopg2.connect(database='dali_special2', user='postgres', password='careland', host='192.168.82.38',port='5432')
cursor2 = conn2.cursor()
strSql = "select buildingid from building "
rows =  CommonMethods.GetDataFromTable(cursor2,strSql)
try:
    for row in rows:
        strSql = "update building set height = %d where buildingid = %d"%(dictBuildidHeight[row[0]],row[0])
        cursor2.execute(strSql)
        conn2.commit()
except ZeroDivisionError as e:
    print(e)