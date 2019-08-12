#!/usr/bin/python
#coding:utf8
import sys
sys.path.append("..")
from . import home
from flask import render_template,request,abort,make_response, send_from_directory,url_for,redirect,session
from functools import  wraps
from app import db
import json
import urllib2,urllib
from lxml import etree
import codecs,os,datetime,csv
import math

@home.route("/")
def index():
    "主页面"
    return render_template('index.html')


