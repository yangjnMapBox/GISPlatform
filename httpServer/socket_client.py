# 创建socket对象：指定传输协议
# AF_INET---ipv4
# SOCK_STREAM---TCP协议
import socket
client = socket.socket()
# 建立连接---发送连接请求
client.connect_ex(('127.0.0.1',8022))
# client.connect_ex(('192.168.82.74',8888))
client.sendto(b"hello,world!",('127.0.0.1',1233))
# data = client.recv(1024)#发送数据数量

# print(data)
client.close()