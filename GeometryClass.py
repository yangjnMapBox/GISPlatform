import os
import sys
import math
import GeometryMethod
#点，向量类
class Point():
    def __init__(self,lon,lat):
        self.lon = lon
        self.lat = lat
    def __sub__(self, other):
        return Point(self.lon-other.lon,self.lat-other.lat)
    def __mul__(self, other):
        return self.lon*other.lat+self.lat*other.lon
    def __cmp__(self,other):
        return self.lon == other.lon and self.lat == other.lat
    #小于或等于0.001m返回true
    def equal(self,other):
        return GeometryMethod.ClaDistancePoint(self,other)<=0.001
#线类
class LineString():
    def __init__(self,arrPoints):
        self.count = len(arrPoints)
        self.startNode = arrPoints[0]
        self.endNode = arrPoints[self.count-1]
        self.allNodes = arrPoints
    #返回点在线上的索引，不存在返回-1
    def indexOfPoint(self,point):
        if point in self.allNodes:
            return self.allNodes.index(point)
        else:
            return -1
    #线的长度，单位米
    def length(self):
        diss = 0
        point1 = self.startNode
        for i in range(0,self.count-1):
            dis = GeometryMethod.ClaDistancePoint(self.allNodes[i],self.allNodes[i+1])
            diss = diss+dis
        return diss
    '''
    返回距离开始节点dis米的点对象,距离过长则返回-1
    '''
    def PointOfDisMeter(self,distance):
        if (distance>self.length()):
            return -1
        point1 = 0
        point2 = 0
        diss = 0
        for i in range(0,self.count-1):
            dis = GeometryMethod.ClaDistancePoint(self.allNodes[i],self.allNodes[i+1])
            if diss + dis >= distance:
                point1 = self.allNodes[i-1]
                point2 = self.allNodes[i]
                break
            else:
                diss = diss + dis
        subDis = distance - diss
        singleDis =  GeometryMethod.ClaDistancePoint(point1,point2)
        k = subDis/singleDis
        lon =  k*(point2.x-point1.x)+point1.x
        lat = k*(point2.y-point1.y)+point1.y
        return Point(lon,lat)
