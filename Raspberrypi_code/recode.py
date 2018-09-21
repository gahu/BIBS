import picamera
import time
import subprocess
import os
import glob
import RPi.GPIO as GPIO
import time
import threading
import requests
import json
import base64

GPIO.setmode(GPIO.BOARD)
GPIO.setup(11, GPIO.IN, pull_up_down=GPIO.PUD_UP)

accident_flag = False
accident_flag2 = False
transfer_flag = False
record_flag = False
accident_time = ""
count = int(0)
time_list =[[0 for rows in range(2)for cols in range(10)]]

def push_button(channel) :
    print ("interrupt!")
    global accident_flag
    global accident_time
    global transfer_flag
    global record_flag
    global count
    global time_list
    with picamera.PiCamera() as camera:
        camera.resolution = (640, 480)
        while True:
            #starttime
            now = time.localtime()
            str = "%04d-%02d-%02d-%02d-%02d-02d" % (now.tm_year, now.tm._mon, now.tm_mday, now.tm_hour, now.tm_min, now.tm_sec)
            start_str = str
            time_list[count][0] = start_str = str

            chara = 'alwaysMode/' + chr((int(count) % 10) + 97) + '.h264'
            camera.start_preview()
            camera.start_recording(chara)
            camera.wait_recording(3)
            camera.stop_recording()
            camera.stop_preview()

            #endtime
            now = time.localtime()
            str = "%04d-%02d-%02d-%02d-%02d-02d" % (now.tm_year, now.tm._mon, now.tm_mday, now.tm_hour, now.tm_min, now.tm_sec)
            end_str = str
            time_list[count][1] = end_str

            count = count + 1
            count = count % 10

            if transfer_flag == True:
                record_flag = True
            elif accident_flag == True and accident_flag2 == True:
                transfer_flag = True
            elif accident_flag == True:
                accident_flag2 = True

def transfer_Video():
    global accident_flag
    global accident_flag2
    global transfer_flag
    global record_flag
    global accident_time
    global count
    global time_list
    global files_list
    url = "http://192.168.0.29:8000"
    while True:
        str = ""
        str2 = ""
        if record_flag == True:
            if count == 0:
                str = './alwaysMode/j.h264'
                str2 = './alwaysMode/' + chr((int(count) %10) + 97) + '.h264'
                values = {'video1_start_time' : time_list[9][0],
                            'video1_end_time' : time_list[9][1],
                            'video2_start_time' : time_list[count][0],
                            'video2_end_time' : time_list[count][1],
                            'accident_time' : accident_time}
            else:
                str = './alwaysMode/' + chr((int(count) %10) + 96) + '.h264'
                str2 = './alwaysMode/' + chr((int(count) %10) + 97) + '.h264'
                values = {'video1_start_time' : time_list[count-1][0],
                            'video1_end_time' : time_list[count-1][1],
                            'video2_start_time' : time_list[count][0],
                            'video2_end_time' : time_list[count][1],
                            'accident_time' : accident_time}

            files = {'video1' : open(str, 'rb'), 'video2' : open(str2, 'rb')}
            print ("OK")
            r = requests.post(url, files = files, data = values)
            print (r)
            accident_flag = False
            accident_flag2 = False
            transfer_flag = False
            record_flag = False

if __name__ == "_main_":
#    recort()
    recordTh = threading.Thread(target = record)
    transferTh = threading.Thread(target = transfer_Video)
    recordTh.daemon = True
    transferTh.daemon = True
    recordTh.start()
    transferTh.start()
    while True:
        try:
            str = "looping.."
        except KeyboardInterrupt:
            break
