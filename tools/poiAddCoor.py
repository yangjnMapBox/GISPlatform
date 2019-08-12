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
strSql = 'select recordid,st_astext(geom) from poi order by recordid'
rows = CommonMethods.GetDataFromTable(cursor,strSql)
for row in rows:
    print(count)
    count += 1
    recordid = row[0]
    geom = row[1]
    coor = geom.replace('(','').replace(')','').replace('POINT','').split(' ')
    strSql = 'update poi set x = %f,y=%f where recordid = %d;'%(float(coor[0]),float(coor[1]),recordid)
    cursor.execute(strSql)
    conn.commit()