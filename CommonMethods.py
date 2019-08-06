import os
import math
#递归遍历目录下所有文件路径集合
#path = "F:\\water_wyh\\json"
def GetFilesFromPath(path):
    lstFiles = []
    parents = os.listdir(path)
    for parent in parents:
        child = os.path.join(path,parent)
        if os.path.isdir(child):
            GetFilesFromPath(child)
        else:
            lstFiles.append(child)
    return lstFiles

'''
一元线性回归
参数：自变量x数组，y数组
返回值：k,b
'''
def UnaryLinearRegression(arrX,arrY):
	xSum = 0.0
	x2Sum = 0.0
	ySum = 0.0
	xy = 0.0
	n = len(arrX)
	for i in range(n):
		xSum+=arrX[i]
		ySum+=arrY[i]
		xy+=arrX[i]*arrY[i]
		x2Sum+=arrX[i]**2
	k = (xSum*ySum/n -xy)/(xSum**2/n-x2Sum)
	b= (ySum-k*xSum)/n
	return k,b

'''
根据输入的mapbox层级求比例尺分母
'''
def GetMapboxScaleDenominator(zoom):
	if(zoom<2 or zoom >22):
		return -1
	elif (zoom >= 2 and zoom < 8):
		return 3*10**8*math.e**-6
