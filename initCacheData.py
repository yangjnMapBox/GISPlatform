#!/usr/bin/python
#-*- coding:utf-8 -*-
import os
import CommonMethods
import numpy as np
import matplotlib.pyplot as plt
import GeometryMethod

conn = CommonMethods.DatabaseConn()
cursor = conn.cursor()
#初始化POI信息表
def InitPOI():
    dictPOI = {}
    strSql = 'select recordid,x,y,name,address from poi order by recordid;'
    rows = CommonMethods.GetDataFromTable(cursor,strSql)
    for row in rows:
        dictPOI[row[0]] = [row[1],row[2],row[3],row[4]]
    return dictPOI


def Tuples2Dict(strData):
    dictDatas = {}
    lstDatas = strData.split(',')
    for data in lstDatas:
        arrData = data.split('_')
        dictDatas[int(arrData[0])] = arrData[1]
    return dictDatas
#初始化poi索引表
def InitIndexSearch():
    dictIndexDaliSearch = {}
    strSql = "select codeasc ,recordids from indexdalisearch order by codeasc;"
    rows = CommonMethods.GetDataFromTable(cursor, strSql)
    for row in rows:
        key = row[0]
        recordids = row[1]
        arrRecordid = recordids.split(',')
        arrRecordidInt =[]
        for recordid in arrRecordid:
            arrRecordidInt.append(int(recordid))
        dictIndexDaliSearch[key] = arrRecordidInt
    return dictIndexDaliSearch