部署命令：
配置/etc/httpd/http.conf文件
添加
WSGIScriptAlias /microblogcube /home/microblogcube/proxypj/proxypj/wsgi.py
WSGIPythonPath /home/microblogcube/proxypj/proxypj

<Directory /home/microblogcube/proxypj/proxypj>
<Files wsgi.py>
Order deny,allow
Allow from all
</Files>
</Directory>


proxypj项目文件复制到/home/microblogcube下面
进入proxypj目录执行一下命令
第一次部署，初始化数据库
python manage.py syncdb
启动后台爬虫程序
python manage.py crawlproc start
重启apache服务器
apachectl restart