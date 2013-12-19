#coding=utf8
from django.http import HttpResponse
from django.shortcuts import render_to_response
from google.appengine.api import search
import csv
import StringIO
import logging

_INDEX_NAME="eventindex"
index = doc_index = search.Index(name=_INDEX_NAME)
def process_upload_file(request):
    # 获取文件
    file_obj = request.FILES.get('your_file', None)
    if file_obj == None:
        return render_to_response('upload.html',{})
    #return HttpResponse('file not existing in the request')
# 写入文件
    else:
        #logging.error('file loaded %s'%(file_obj.read()))
        csvReader = csv.reader(StringIO.StringIO(file_obj.read()))
        content=""
        i = 0
        for line in csvReader:
            if i != 0:
                addTuple(line)
                i=i+1
            else:
                i=1

        return HttpResponse("%d"%(i))

   
#EventId Title Information Hot Link
def addTuple(record):
    #logging.error("%s"%(record[0]))
    document = search.Document(
        fields=[search.TextField(name='EventId', value=record[0]),
                search.TextField(name='content', value=record[2])],
        language='zh')
    
    try:
        index.put(document)
        return True
    except search.Error:
        logging.exception('Put failed')
        return False
