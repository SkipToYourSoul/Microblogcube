#coding=utf8
from datetime import datetime
from google.appengine.api import search
from django.http import HttpResponse
import json
import logging

#http://ftableproxy.appspot.com/search?op=add&ename=%22%E5%8A%A8%E8%BD%A6%22&content=%22%E6%B8%A9%E5%B7%9E%E5%8A%A8%E8%BD%A6%E4%BA%8B%E4%BB%B6%22&date=%222012-09-01%22&loc=31.230393000000,121.473704000000
_INDEX_NAME="eventindex"
index = doc_index = search.Index(name=_INDEX_NAME)
def parseField(request):
    error = False
    ename = request.GET.get('ename')
    if ename is None:
        return None

    content = request.GET.get('content')
    if content is None:
        return None
    
    dateF  = request.GET.get('date')
    date = datetime.now()
    if dateF :
        date = datetime.strptime(dateF, "%Y-%m-%d") 
    else:
        return None
        
    loc = request.GET.get('loc')
    latitude = 0.0
    longitude =0.0
    geopoint = search.GeoPoint(latitude=latitude,longitude=longitude)
    if loc :
        coord = loc.split(",")
        latitude = float(coord[0])
        longtitude = float(coord[1])
        geopoint=search.GeoPoint(latitude=latitude,longitude=longitude)
    else:
        return None
    #logging.error(ename + " " + content + " " + dateF + " " + geopoint )
    return (ename, content, date, geopoint)

def addTuple(request):
    record = parseField(request)
    if record:
        document = search.Document(
            fields=[search.TextField(name='ename', value=record[0]),
                    search.TextField(name='content', value=record[1]),
                    search.GeoField(name='loc', value=record[3]),
                    search.DateField(name='date', value=record[2])],
            language='zh')
        
        try:
            index.put(document)
            return True
        except search.Error:
            logging.exception('Put failed')
            return False
    else:
        return False


def find_documents(words, limit, cursor):
    try:
       # subject_desc = search.SortExpression(
        #    expression='EventId',
         #   direction=search.SortExpression.DESCENDING,
          #  default_value='')
        
        # Sort up to 1000 matching results by subject in descending order
        #sort = search.SortOptions(expressions=[subject_desc], limit=1000)
        
        # Set query options
        options = search.QueryOptions(
            limit=limit,  # the number of results to return
            cursor=cursor,
            #sort_options=sort,
            returned_fields=['EventId', 'content'],
            snippeted_fields=['content'])
        query_string = words 
        query = search.Query(query_string=query_string, options=options)
        
        index = search.Index(name=_INDEX_NAME)

        # Execute the query
        return index.search(query)
    except search.Error:
        logging.exception('Search failed')
        return None

#http://localhost:8080/search?op=q&ename=%E5%8A%A8%E8%BD%A6&content=%E6%B8%A9%E5%B7%9E%E5%8A%A8%E8%BD%A6%E4%BA%8B%E4%BB%B6&date=2012-09-01&loc=31.230393000000,121.473704000000
def textSearch(request):
    query = ""
    field = request.GET.get('ename')
    if field :
        query += "ename: %s "%(field)
    
    field = request.GET.get('content')
    if field :
        query += "AND content: %s "%(field)

    field = request.GET.get('date')
    if field :
        query += "AND date: %s "%(field)
    
    field = request.GET.get('loc')
    if field :
        query += "AND loc: (%s) "%(field)

    logging.error(query)
    results = find_documents(query, 10,search.Cursor());

    ret = ""
    if results:
            #ret = ret+ results.length
        for scored_document in results:
            # process scored_document
                #logging.error(socred_document.fields['name'])
            if not ret:
                ret+=scored_document.fields[0].value
            else:
                ret += "," + scored_document.fields[0].value
        return ret
    else :
        return "none"

def simpleSearch(request):
    query = request.GET.get('text')
    logging.error(query)
    results = find_documents(query, 10,search.Cursor());

    ret = set()
    if results:
            #ret = ret+ results.length
        for scored_document in results:
            # process scored_document
                #logging.error(socred_document.fields['name'])
            ret.add(scored_document.fields[0].value)
        retStr = ""
        for item in ret:
            if not retStr:
                retStr += item
            else:
                retStr += ","+ item
        return retStr
    else :
        return ""

def searchView(request):
    op = request.GET.get('op')
    
    if (op == "add"):
        if addTuple(request):
            return HttpResponse("true")
        else:
            return HttpResponse("false")
    elif (op == "q"):
        return HttpResponse(textSearch(request))
    elif (op=="s"):
        result = {"r":simpleSearch(request)}
        callback = request.GET.get('callback', '')
        response = json.dumps(result)
        response = callback + '(' + response + ');'
        return HttpResponse(response, mimetype="application/json")
        
    elif (op=="del"):
        emptyIndex()
        return HttpResponse("success")

def emptyIndex():
    # looping because get_range by default returns up to 100 documents at a time
    while True:
        # Get a list of documents populating only the doc_id field and extract the ids.
        document_ids = [document.doc_id
                        for document in index.get_range(ids_only=True)]
        if not document_ids:
            break
        # Delete the documents for the given ids from the Index.
        index.delete(document_ids)
            
