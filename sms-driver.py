import serial
import string
import time
import redis
import json
import unicodedata

ser = serial.Serial('/dev/ttyUSB0', 115200, timeout=1)
messages = 1

def waitFor(_str, _err="ERROR"):
  output = ""
  while 1:
    buffer = ser.readline()
    output += buffer
    if string.find(buffer, _str) > -1:
      return output
    elif string.find(buffer, _err) > -1:
      return 0

def init():
  ser.write("AT\r")
  waitFor("OK")
  ser.write("ATE0\r")
  waitFor("OK")
  ser.write("AT+CMGF=1\r")
  waitFor("OK")

def sendSMS(_rec, _message):
  ser.write("AT+CMGS=" + unicodedata.normalize('NFKD', _rec).encode('utf-8','ignore') + "\r")
  waitFor('>')
  ser.write(unicodedata.normalize('NFKD',_message).encode('utf-8','ignore'))
  ser.write(chr(0x1a))
  waitFor("OK")

init()
r = redis.Redis(host='10.3.0.64', port=6379, db=0)

while 1:
  data = r.lpop('messages')
  if data != None:
    object = json.loads(data)
    sendSMS(object['number'], object['message'])
  time.sleep(0.5)
