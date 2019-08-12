#!/usr/bin/python
#-*- coding:utf-8 -*-
import os
import sys
import GeometryMethod
from flask import Flask, render_template,url_for,session
from flask import request
import CommonMethods
import datetime
punctuation = ['\'',',','.',';','"',':','*','@','#','!','`','$','^','&','(',')',' ','{','}','[',']','\\','/','<','>',
               '+','-','，','。','；','：','‘','’','“','”','【','】','、','|','！','·','~','￥','……','（','）','——','-','_']
conn = CommonMethods.DatabaseConn()
cursor = conn.cursor()
dataTable = 'indexDaliSearch'
# strSql ="DROP TABLE IF EXISTS %s ;"%dataTable
# cursor.execute(strSql)
# conn.commit()
# strSql = "CREATE TABLE %s( codeAsc integer,recordids text, charAsc varchar(2) ,recordidNames text, recordidAddresses text , PRIMARY KEY(codeAsc));"%dataTable
# cursor.execute(strSql)
# conn.commit()
#key:codeAsc，values:[recordids,charAsc,recordidNames,recordidAddresses]
dictIndexTable = {}
dictCodeChar = {}
arrChar = []
dictTable= {}
# strSql = "select codeasc from indexdalisearch order by codeasc"
# rows = CommonMethods.GetDataFromTable(cursor,strSql)
# for row in rows:
#     allAscChar.append(row[0])
strSql = "select charasc from indexdalisearch order by codeasc"
rows = CommonMethods.GetDataFromTable(cursor,strSql)
for row in rows:
    arrChar.append(row[0])

strSql = "select recordid,name,address from poi order by recordid"
rows = CommonMethods.GetDataFromTable(cursor,strSql)

count = 0
count2 = 0
for char in arrChar:
    arrRecordids = ""
    arrRecordidNames = ""
    arrRecordidAddresses = ""
    print('完成:', count)
    count += 1
    for row in rows:
        recordid = str(row[0])
        name = row[1]
        address = row[2]
        for i in punctuation:
            name=name.replace(i,'')
            address=address.replace(i,'')
        tupleName = str(recordid)+'_'+name
        tupleAddress = str(recordid)+'_'+address
        if(char in name or char in address):
            arrRecordids += ","+recordid
        if(char in name):
            arrRecordidNames+= ","+tupleName
        if(char in address):
            arrRecordidAddresses+=","+tupleAddress
    arrRecordids = arrRecordids[1:]
    arrRecordidNames = arrRecordidNames[1:]
    arrRecordidAddresses = arrRecordidAddresses[1:]
    dictIndexTable[char] = [arrRecordids,arrRecordidNames,arrRecordidAddresses]
    strSql = r"update %s set recordids = '%s',recordidNames = '%s',recordidAddresses='%s' where charAsc ='%s';"%(dataTable,arrRecordids,arrRecordidNames,arrRecordidAddresses,char)
    cursor.execute(strSql)
    conn.commit()

# for row in rows:
#     count +=1
#     # if(count<2950):
#     #     continue
#     # print('处理poi个数:',count)
#     recordid = row[0]
#     name = row[1]
#     address = row[2]
#     for i in punctuation:
#         name=name.replace(i,'')
#         address=address.replace(i,'')
#     tupleName = str(recordid)+'_'+name
#     tupleAddress = str(recordid)+'_'+address
    #统计不重复字符
    '''
    for char in name:
        ascChar = ord(char)
        if(ascChar not in dictCodeChar.keys()):
            count2 +=1
            print('字符数:',count2)
            dictCodeChar[ascChar] = char
            strSql = r"insert into %s (codeAsc,charAsc) values (%d,'%s')" % (dataTable,ascChar,char)
            cursor.execute(strSql)
            conn.commit()
            
    for char in address:
        ascChar = ord(char)
        if (ascChar not in dictCodeChar.keys()):
            count2 += 1
            print('字符数:', count2)
            dictCodeChar[ascChar] = char

            # allAscChar.append(ascChar)
            strSql = r"insert into %s (codeAsc,charAsc) values (%d,'%s')"%(dataTable,ascChar,char)
            cursor.execute(strSql)
            conn.commit()
    '''



