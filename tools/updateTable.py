#!/usr/bin/python
#-*- coding:utf-8 -*-
import os
import sys
import GeometryMethod
from flask import Flask, render_template,url_for,session
from flask import request
import CommonMethods
import datetime

conn = CommonMethods.DatabaseConn()
cursor = conn.cursor()
##更新监测站名称
# dataTable = 'wstation'
# strSql = "select gid from wstation order by gid"
# rows = CommonMethods.GetDataFromTable(cursor,strSql)
# for row in rows:
#     strName = '监测站'+str(row[0])
#     strSql = r"update wstation set name = '%s' where gid=%d;"%(strName,row[0])
#     cursor.execute(strSql)
#     conn.commit()