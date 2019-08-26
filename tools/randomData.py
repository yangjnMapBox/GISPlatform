#!/usr/bin/python
#-*- coding:utf-8 -*-
import os
import CommonMethods
import numpy as np
import matplotlib.pyplot as plt
import GeometryMethod
import random
conn = CommonMethods.DatabaseConn()
cursor = conn.cursor()

#waterlevel (1,5),ph(6.5,7.5),oxygen(6.5,7.5),nitrogen(0.25,0.4)
count = 0
strSql = 'select gid from wstation order by gid'
rows = CommonMethods.GetDataFromTable(cursor,strSql)
for row in rows:
    waterLevel = random.randint(1,5)
    ph = random.randint(650,750)/100
    oxygen = random.randint(650,750)/100
    nitrogen = random.randint(25,40)/100
    arrBiodiversity = []
    arrAlgae = []
    arrPollution = []
    for i in range(0,19):
        arrBiodiversity.append(random.randint(800,2000))
        arrAlgae.append(random.randint(800, 2000))
        arrPollution.append(random.randint(800, 2000))
    strBiodiversity = ','.join(str(i) for i in arrBiodiversity)
    strAlgae = ','.join(str(i) for i in arrAlgae)
    strPollution = ','.join(str(i) for i in arrPollution)
    strSql = "update wstation set waterLevel = %d,ph = %f,oxygen = %f,nitrogen = %f," \
             "pollution = '%s',biodiversity = '%s',algae = '%s'  where gid = %d ;"\
             %(waterLevel,ph,oxygen,nitrogen,strPollution,strBiodiversity,strAlgae,row[0])
    cursor.execute(strSql)
    conn.commit()