#encoding:utf-8
import requests,urllib,json

headers={
        "User-Agent":"Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
        }
datas={"100": {"DeviceID": 100, "DeviceType": 7, "Time": 2548, "lat":113.86567357, "lng": 22.49587450, "Speed": 20, "Status": 2, "serverTime": "2019-06-14 15:59:56"},"200": {"DeviceID": 200, "DeviceType": 2, "Time": 2548, "lat": 113.8664065634, "lng":22.49599931, "Speed": 20, "Status": 2, "serverTime": "2019-06-14 17:03:37"}, "300": {"DeviceID": 300, "DeviceType": 2, "Time": 2548, "lat":113.86567357, "lng": 22.49612197, "Speed": 20, "Status": 2, "serverTime": "2019-06-14 15:59:56"}}
# datas = {"DeviceID": 3, "DeviceType": 7}
data=json.dumps(datas)
text=requests.post('http://113.100.139.50:5537/postjson',data=json.dumps(datas))
print(type(data))
print (text)

# data=b'{"3": {"DeviceID": 3, "DeviceType": 7, "Time": 2548, "lat":113.86567357, "lng": 22.49587450, "Speed": 20, "Status": 2, "serverTime": "2019-06-14 15:59:56"},"2": {"DeviceID": 2, "DeviceType": 2, "Time": 2548, "lat": 113.8664065634, "lng":22.49599931, "Speed": 20, "Status": 2, "serverTime": "2019-06-14 17:03:37"}, "1": {"DeviceID": 1, "DeviceType": 2, "Time": 2548, "lat":113.86567357, "lng": 22.49612197, "Speed": 20, "Status": 2, "serverTime": "2019-06-14 15:59:56"}}'
# print type(data)
# url = 'http://192.168.26.44:1207/postjson'
# # data = urllib.urlencode(data)
# req = urllib2.Request(url, data,{'Content-Type': 'application/x-www-form-urlencoded'})
# response = urllib2.urlopen(req)
# html = response.read()
# print html