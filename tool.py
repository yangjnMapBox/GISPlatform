#!/usr/bin/python
#-*- coding:utf-8 -*-
import os
import CommonMethods
import numpy as np
import matplotlib.pyplot as plt
import GeometryMethod
import datetime
import time
#线性回归探究
'''
# arrZoom = [2,2.15,2.3,2.61,2.75,2.9,3.36,3.73,3.91,4.04,4.34,4.64,5.1,5.53,6.14,6.59,7.05,7.5,7.8,8.11,8.41,8.71,9.01,9.32,9.47,9.77,10.03,10.33,10.64,10.94,11.24,11.7,12.13,12.44,12.74,13.19,13.5,13.95,14.41,14.86,15.16,15.62,16.07,16.52,17.13,17.58,18.09,18.55,19]
# arrScale = [0.0000000185 ,0.0000000192 ,0.0000000233 ,0.0000000257 ,0.0000000299 ,0.0000000314 ,0.0000000413 ,0.0000000902 ,0.0000000594 ,0.0000001090 ,0.0000001571 ,0.0000001947 ,0.0000002730 ,0.0000003674 ,0.0000005650 ,0.0000007663 ,0.0000010490 ,0.0000014310 ,0.0000017655 ,0.0000021636 ,0.0000026681 ,0.0000032884 ,0.0000040404 ,0.0000050378 ,0.0000055617 ,0.0000068587 ,0.0000081633 ,0.0000100604 ,0.0000124069 ,0.0000153610 ,0.0000189394 ,0.0000257069 ,0.0000352113 ,0.0000432900 ,0.0000534759 ,0.0000735294 ,0.0000909091 ,0.0001250000 ,0.0001694915 ,0.0002325581 ,0.0002857143 ,0.0004000000 ,0.0005263158 ,0.0007142857 ,0.0011111111 ,0.0016666667 ,0.0020000000 ,0.0033333333 ,0.0050000000 ]
# arrDistance = [541755,522045,429000,388500,334000,318700,242160,110907,168400,91735,63648,51358,36631,27219,17698,13050,9533,6988,5664,4622,3748,3041,2475,1985,1798,1458,1225,994,806,651,528,389,284,231,187,136,110,80,59,43,35,25,19,14,9,6,5,3,2]

# plt.plot(arrScale,arrZoom,'ro')
# plt.show()

# N = 1000
# x = np.random.randn(N)
# y = np.random.randn(N)
# plt.scatter(x, y)
# plt.show()

# if(len(arrZoom) == len(arrDistance)):
#     k,b = CommonMethods.UnaryLinearRegression(arrDistance,arrZoom)
#     k2 = CommonMethods.InverseRegression(arrZoom,arrDistance)
#     print(k,b,k2)

# for i in range(2,9):
#     print (i,CommonMethods.GetMapboxScaleDenominator(i))

scale = 500
for i in range(0,200):
    if(i%2 == 0):
        print(scale,GeometryMethod.CalZoomFromScale(scale))
    scale+=500
'''

conn = CommonMethods.DatabaseConn()
cursor = conn.cursor()
# str = '我\''
# utf8 = str.encode('utf-8')
# print(utf8)

# punctuation = ['\'',',','.',';','"',':','*','@','#','!','`','$','^','&','(',')',' ','{','}','[',']','\\','/','<','>',
#                '+','-','，','。','；','：','‘','’','“','”','【','】','、','|','！','·','~','￥','……','（','）','——','-','_']
# for i in punctuation:
#     ascCode = ord(i)
#     if ascCode == 39:
#         i = '\''+i
#         # i.
#     strSql = "insert into punctuation(codeAsc,punctuation) values (%d,'%s')" % (ascCode,i)
#     cursor.execute(strSql)
#     conn.commit()

dict = {1:'a',2:'b',3:'c'}
arrDictKeys = dict.keys()
for i in list(dict):
    if(i == 1):
        del dict[i]
    else:
        print(dict)

time1 =  datetime.datetime.now()
time.sleep(2)
time2 =  datetime.datetime.now()
subTime = time2 -time1
print (time1)
print(time2)
print (subTime)
# print(c)