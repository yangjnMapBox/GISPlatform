import os
import sys
import json
import psycopg2
from flask import Flask, render_template
from flask import request
from configparser import ConfigParser
import math

'''
判断点是否被面包含（包括在面的边上），返回True,被面包含，返回false,不被面包含
点的横坐标、纵坐标、面的顶点坐标集合
'''
def ISWITHIN (x,y,arrCoors):
	x0 = x
	y0 = y
	i=0
	j=0
	for arrCoor in arrCoors:
		if(i<len(arrCoors)-1):
			i =i+1
		else:
			i=0
		x1 = arrCoor[0]
		y1 = arrCoor[1]
		x2 = arrCoors[i][0]
		y2 = arrCoors[i][1]
		if(x2-x1!=0):
			if(x1<x2):
				xmin=x1
				ymin = y1
				xmax = x2
				ymax = y2
			else:
				xmin=x2
				ymin = y2
				xmax =x1
				ymax = y1
			if((x0-x1)*(y2-y1)==(y0-y1)*(x2-x1) and x0>=xmin and x0<=xmax):
				return True
			else:
				k = (y2-y1)/(x2-x1)
				if(x0<xmin or x0>xmax):
					continue
				else:
					if(k*(x0-xmin)+ymin<y0):
						continue
					else:
						j=j+1
		else:
			if(x0 !=x1):
				continue
			else:
				if(y1<y2):
					ymin = y1
					xmin = x1
					ymax = y2
					xmax = y
				else:
					ymin = y2
					xmin = x2
					ymax = y1
					xmax = x1
				if(y0<=ymax and y0>=ymin):
					return True
				else:
					if(y0>ymax):
						continue
					else:
						j=j+1
	if(j%2==0):
		return False
	else:
		return True

'''
根据点(作为正方形中心点)坐标创建正方形
返回矩形顶点坐标集合
经度、维度、mapbox的zoom值
'''
def CreatSquare(x,y,zoom):
	dictLevelPixel = {0:156412,1:78206,2:39103,3:19551,4:9776,5:4888,6:2444,7:1222,8:610.984,
					  9:305.492,10:152.746,11:76.373,12:38.187,13:19.093,14:9.547,15:4.773,
					  16:2.387,17:1.193,18:0.596,19:0.298}#切片层级对应每个像素的长度（单位m）
	if zoom>19:
		zoom =19
	#正方形边长为4个像素,1°等于110000m来计算
	wideDegree = 4*dictLevelPixel[zoom]/110000
	arrSquare = []
	x1 = x - wideDegree / 2
	y1 = y + wideDegree / 2
	x2 = x + wideDegree / 2
	y2 = y + wideDegree / 2
	x3 = x + wideDegree / 2
	y3 = y - wideDegree / 2
	x4 = x - wideDegree / 2
	y4 = y - wideDegree / 2
	arrSquare.append(str(x1)+' '+str(y1))
	arrSquare.append(str(x2)+' '+str(y2))
	arrSquare.append(str(x3)+' '+str(y3))
	arrSquare.append(str(x4)+' '+str(y4))
	arrSquare.append(str(x1)+' '+str(y1))
	return arrSquare
'''
根据鼠标点击的矩形框返回与之相交的可见图层的图形id
返回相交的可见图层：图形id字典
点击位置的矩形框、数据库地图图形表、前端页面可见的图层、water表id和四至属性bgdid:[x_min,x_max,y_min,y_max]
lstTables = ['water','bgd_25_water','djhydrographicnet']
viLayers1 = [basins,water,river,point,djhydrographicnet_line]
viLayers2 = [influence_11000,river,point,djhydrographicnet_line]
'''
def GetIntersectGeoAtt1(clickSquare,lstTables,viLayers,g_dictWaters,cursor):
	dictLayerGeoID = {}
	strSquare = ','.join(clickSquare)
	strSquare = 'MULTIPOLYGON((('+strSquare+')))'
	strSql = "select st_intersects ((select geom from djhydrographicnet),st_geomfromtext(%s,0))" %(strSquare)
	cursor.execute(strSql)
	rows = cursor.fetchall()
	if(rows[0][0]==True):
		dictLayerGeoID['djhydrographicnet'] = [-1]
	else:
		return '-1'
	xs_min = clickSquare[3].split(' ')[0]
	ys_min = clickSquare[3].split(' ')[1]
	xs_max = clickSquare[1].split(' ')[0]
	ys_max = clickSquare[1].split(' ')[1]
	arrWaterBGDID = []#存放与strSqure相交的水系面id
	for i in g_dictWaters.keys():
		if((g_dictWaters[i][0]>xs_max and g_dictWaters[i][2]>ys_max) or
				(xs_min>g_dictWaters[i][1] and ys_min>g_dictWaters[i][3])):
			continue
		else:
			strSql = "select st_intersects ((select geom from water where bgdid = %d),st_geomfromtext(%s,0))" % (i,strSquare)
			cursor.execute(strSql)
			rows = cursor.fetchall()
			if(rows[0][0] == True):
				arrWaterBGDID.append(i)
	if len(arrWaterBGDID)!=0:
		dictLayerGeoID['water'] = arrWaterBGDID
	return dictLayerGeoID
'''
根据鼠标点击的矩形框返回与之相交的可见图层的图形id
返回相交的可见图层：图形id字典
点击位置的矩形框、数据库地图图形表、前端页面可见的图层、water表id和四至属性bgdid:[x_min,x_max,y_min,y_max]
'''
def GetIntersectGeoAtt2(clickSquare,g_dictWaters,cursor):
	dictLayerGeoID = {}
	strSquare = ','.join(clickSquare)
	strSquare = 'MULTIPOLYGON((('+strSquare+')))'
	strSql = "select st_intersects ((select geom from djhydrographicnet),st_geomfromtext('%s',0))" %(strSquare)
	cursor.execute(strSql)
	rows = cursor.fetchall()
	if(rows[0][0]==True):
		dictLayerGeoID['djhydrographicnet'] = [-1]
	else:
		return -1
	xs_min = float(clickSquare[3].split(' ')[0])
	ys_min = float(clickSquare[3].split(' ')[1])
	xs_max = float(clickSquare[1].split(' ')[0])
	ys_max = float(clickSquare[1].split(' ')[1])
	arrWaterBGDID = []#存放与strSqure相交的水系面id
	for i in g_dictWaters.keys():
		if((g_dictWaters[i][0]>xs_max and g_dictWaters[i][2]>ys_max) or
				(xs_min>g_dictWaters[i][1] and ys_min>g_dictWaters[i][3])):
			continue
		else:
			strSql = "select st_intersects ((select geom from water where bgdid = %d),st_geomfromtext('%s',0))" % (i,strSquare)
			cursor.execute(strSql)
			rows = cursor.fetchall()
			if(rows[0][0] == True):
				arrWaterBGDID.append(i)
	if len(arrWaterBGDID)!=0:
		dictLayerGeoID['water'] = arrWaterBGDID
	return dictLayerGeoID
'''
返回前端字符串
'''
def ReturnLayerAtt(dictLayerGeoID,cursor):
	reStr = ''
	for i in dictLayerGeoID.keys():
		if i == 'djhydrographicnet':
			reStr = reStr+i+';'
		else:
			for id in dictLayerGeoID[i]:
				strSql = "select bgdid,bkname from %s where bgdid = %d" %(i, id)
				cursor.execute(strSql)
				rows = cursor.fetchall()
				strWater = ''
				for row in rows:
					bkname = row[1] if row[1] != None else 'Null'
					reStr =reStr+ str(row[0])+','+bkname+';'
	return reStr
'''
根据比例尺计算地图层级
'''
def CalZoomFromScale(scale):
	zoom = 0
	zoomRatio = 442943842.5/scale
	while(zoomRatio/2>=1):
		zoom+=1
		zoomRatio = round(zoomRatio/2)
	return zoom
'''
度转弧度
'''
def rad(d):
	return d*math.pi/180.0
'''
计算两点距离
输入两点经纬度坐标（单位度）
输出距离（单位米）
'''
def CalDistanceP2P(lng1,lat1,lng2,lat2):
	#地球半径，单位米
	earthRadius = 6378137
	radLat1 = rad(lat1)
	radLat2 = rad(lat2)
	subLat = radLat1 - radLat2
	subLng = rad(lng1) - rad(lng2)
	s = 2*math.asin(math.sqrt(math.pow(math.sin(subLat/2),2) + math.cos(radLat1)*math.cos(radLat2)
							   *math.pow(math.sin(subLng/2),2)))
	s = s * earthRadius
	return s







