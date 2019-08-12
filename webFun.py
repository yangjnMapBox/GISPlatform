import os
import sys
import GeometryMethod
import psycopg2
from flask import Flask, render_template,url_for,session
from flask import request
from configparser import ConfigParser
import datetime
import CommonMethods
import json
#递归获取搜索结果recordid字典集合
def GetSearchSet(centerX,centerY,strSearch,dictIndexDaliSearch,dictPOI):
    lenStrSearch = len(strSearch)
    # key:recordid;value:返回poi与coorCenter的距离
    dictRecordid = {}
    reDictRecordid = {}
    firstCodeAsc = ord(strSearch[0])
    if firstCodeAsc not in dictIndexDaliSearch.keys():
        reDictRecordid = {}
    else:
        for recordid in dictIndexDaliSearch[firstCodeAsc]:
            lng2 = dictPOI[recordid][0]
            lat2 = dictPOI[recordid][1]
            distance = GeometryMethod.CalDistanceP2P(centerX, centerY, lng2, lat2)
            dictRecordid[recordid] = distance
        if lenStrSearch == 1:
            reDictRecordid = sorted(dictRecordid.items(),key=lambda x:x[1])
        else:
            dictNewRecordid = {}
            for i in range (1,lenStrSearch):
                charAsc = ord(strSearch[i])
                if charAsc not in dictIndexDaliSearch.keys():
                    reDictRecordid = {}
                    break
                else:
                    for recordid in dictIndexDaliSearch[charAsc]:
                        if (recordid in list(dictRecordid)):
                            dictNewRecordid[recordid] = dictRecordid[recordid]
            if len(dictNewRecordid.keys()) != 0:
                reDictRecordid = sorted(dictNewRecordid.items(),key=lambda x:x[1])
    return reDictRecordid




'''
前台请求获取POI搜索结果
参数-json：
    strSearch:string, //用户输入的字符串（需去掉标点符号），为空的话返回-1
    coorX:lng,        //当前地图视图的中心点坐标，保留到小数点后六位，坐标值不在大理返回-1
    coorY:lat,
    zoom:zoom         //当前地图层级
返回值-json:  //recordid是poi唯一ID,x：经度(float),y:纬度(float)，
                //name:poi名称(string)，address：poi地址(string)，tel：电话(string)，与coorCenter的距离
    recordid1:[lng,lat,名称,地址,电话,距离（米）],
    recordid2:[lng,lat,名称,地址,电话,距离（米）]
    ...
'''
def GetPOIData(jsonData,dictIndexDaliSearch,dictPOI):
    reJson = -1
    try:
        dictJson = json.loads(jsonData)
        strSearch = dictJson['strSearch']
        if strSearch == '' or strSearch == None:
            return  -1
        centerX = float(dictJson['lng'])
        centerY = float(dictJson['lat'])
        #大理的经纬度范围
        if centerX<100 or centerX>100.4 or centerY<25.4 or centerY>26.1:
             return -2
        reDictRecordidDis = GetSearchSet(centerY,centerX,strSearch,dictIndexDaliSearch,dictPOI)
        if len(reDictRecordidDis) == 0:
            return '{}'
        else:
            reDictJson = {}
            for recordids in reDictRecordidDis:
                recordid = recordids[0]
                distance = recordids[1]
                valueDictPOI = dictPOI[recordid]
                reArray = [valueDictPOI[0],valueDictPOI[1],valueDictPOI[2],valueDictPOI[3],distance]
                reDictJson[recordid] = reArray
            reJson = json.dumps(reDictJson,ensure_ascii=False)
            return reJson
    except (OSError, TypeError) as reason:
        return jsonData+'_'+reason
