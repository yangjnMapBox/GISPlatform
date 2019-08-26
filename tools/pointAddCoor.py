#!/usr/bin/python
#-*- coding:utf-8 -*-
import os
import CommonMethods
import numpy as np
import matplotlib.pyplot as plt
import GeometryMethod

conn = CommonMethods.DatabaseConn()
cursor = conn.cursor()

count = 0
strSql = 'select gid,st_astext(geom) from wstation order by gid'
rows = CommonMethods.GetDataFromTable(cursor,strSql)
for row in rows:
    print(count)
    count += 1
    gid = row[0]
    geom = row[1]
    coor = geom.replace('(','').replace(')','').replace('POINT','').split(' ')
    strSql = 'update wstation set x = %f,y=%f where gid = %d;'%(float(coor[0]),float(coor[1]),gid)
    cursor.execute(strSql)
    conn.commit()