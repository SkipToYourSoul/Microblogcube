package DataExtraction;


import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URI;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.hadoop.filecache.DistributedCache;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapred.FileInputFormat;
import org.apache.hadoop.mapred.FileOutputFormat;
import org.apache.hadoop.mapred.JobClient;
import org.apache.hadoop.mapred.JobConf;
import org.apache.hadoop.mapred.MapReduceBase;
import org.apache.hadoop.mapred.Mapper;
import org.apache.hadoop.mapred.OutputCollector;
import org.apache.hadoop.mapred.Reducer;
import org.apache.hadoop.mapred.Reporter;
import org.apache.hadoop.mapred.TextInputFormat;
import org.apache.hadoop.mapred.TextOutputFormat;

import weibo4j.WeiboException;
import weibo4j.model.Status;
import weibo4j.model.StatusWapper;
import Util.Tool;


public class hottopicedge {
    public static class Map extends MapReduceBase implements Mapper<LongWritable,Text, Text, Text> {
        private Text x = new Text();
        private Text y = new Text();
        ArrayList<String> tempList = new ArrayList<String>();
        SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        List<Status> statusList = new ArrayList<Status>();
        Status rtStatus = null;
        String endTime = null;
        String time = null;
        String text = null;
        String rtText = null;
        String rtMid = "";
        private static String separator = "|#|";
        private ArrayList<String> moodList = new ArrayList<String>();
        public void configure(JobConf job) 
        {
        	FileInputStream fis;
            InputStreamReader isr;
            BufferedReader br;
            String line = null;
            try {
              Path[] file = DistributedCache.getLocalCacheFiles(job);
              fis = new FileInputStream(file[0].toString());
            isr = new InputStreamReader(fis,"utf8");
            br = new BufferedReader(isr);
            while((line = br.readLine()) != null)
            {
                moodList.add(line);
            }
          } catch (IOException e) {
              // TODO Auto-generated catch block
              e.printStackTrace();
          }
        }
        
        public void map(LongWritable key, Text value, OutputCollector<Text, Text> output, Reporter reporter) throws IOException 
        {
            String record = value.toString();
            record=record.replaceAll("\t", "\\|#\\|");
            
            String[] info = record.split("\\|"+"\\#"+"\\|");
            if(info.length>20){
            	x.set(info[0]+"|#|"+info[1]);
            	y.set(info[17]+"|#|"+info[15]+"|#|"+info[16]+"|#|"+info[5]+"|#|"+info[19]+"|#|"+info[3]);
                output.collect(x, y);
               
            }
        
        }
      }

      public static class Reduce extends MapReduceBase implements Reducer<Text, Text, Text, Text> 
      {
          ArrayList<String> tempList = new ArrayList<String>();
          ArrayList<String> identifier = new ArrayList<String>();
          //ArrayList<String> rtEdgeList = new ArrayList<String>();
          java.util.Map<String,String> rtEdgeList = new HashMap<String,String>();

          public void reduce(Text key, Iterator<Text> values, OutputCollector<Text, Text> output, Reporter reporter) throws IOException 
          {
              String uname = null;
              String uname1 = null;
              while (values.hasNext()) 
              {
                  String s=values.next().toString();
                  String[] info=s.split("\\|"+"\\#"+"\\|");
                  //info[1]为mid
                  //info[3]为被转发微博的uname
                  //info[4]为转发微博的uname
                  //info[5]为被转发微博的发表时间
                  if(!identifier.contains(info[1])){
                      identifier.add(info[1]);
                      tempList.add(s);
                  }
              }
              //if(tempList.size()>=100)
              Collections.sort(tempList);
                  
              for(String temp:tempList)
              {
            	  String[] list = temp.split("\\|"+"\\#"+"\\|");
                  if(list.length<6)
                  {
                	  continue;
                  }
                  if(list[2].contains(":"))
                  {
                      list[2] = list[2].replaceAll(":", "：");
                  }
                  if(list[2].contains("// @"))
                  {
                      list[2] = list[2].replaceAll("// @", "//@");
                  }
                  if(list[2].contains(" "))
                  {
                      list[2] = list[2].replaceAll(" ", "");
                  }
                  
                  String[] contentList = list[2].split("//@");
                  
                  if(contentList.length == 1)
                  {
                      rtEdgeList.put(list[4]+"\t"+list[3],list[0]);
                    
                  }
                  else if(contentList.length > 1)
                  {
                      uname = contentList[contentList.length-1];
                      String thelastuname = uname;
                      
                      if(uname.contains("："))
                      {
                         uname = uname.substring(0,uname.indexOf("："));
                         thelastuname=uname;
                         if(!rtEdgeList.containsKey(uname+"\t"+list[3]))
                         {
                        	 try {
                        		 String time=midDate(list[5],list[0],contentList.length);
                        		
								 rtEdgeList.put(uname+"\t"+list[3],time);
									
								} catch (ParseException e) {
									// TODO Auto-generated catch block
									e.printStackTrace();
								}
                              }
                       }
                          for(int j = contentList.length-2;j>0;j--)
                          {
                              uname = contentList[j];
                              uname1 = contentList[j+1];
                              if(uname.contains("：") && uname1.contains("："))
                              {
                                  uname = uname.substring(0,uname.indexOf("："));
                                  uname1 = uname1.substring(0,uname1.indexOf("："));
                                  
                                  if(j==(contentList.length-2)){
                                	  if(!rtEdgeList.containsKey(uname+"\t"+uname1)&&rtEdgeList.containsKey(thelastuname+"\t"+list[3]))
                                      {
                                		  try {
                                			  String time=midDate(list[5],rtEdgeList.get(thelastuname+"\t"+list[3]),j+1);
                                			 
											   rtEdgeList.put(uname+"\t"+uname1,time);
                                			 
										      } catch (ParseException e) {
											// TODO Auto-generated catch block
											e.printStackTrace();
										} 
                                      }
                                  }
                                  else if(j<(contentList.length-2)){
                                	  if(!rtEdgeList.containsKey(uname+"\t"+uname1))
                                       {
                                		  String unameFather = contentList[j+1];
                                          String unameFather1 = contentList[j+2];
                                          if(unameFather.contains("：") && unameFather1.contains("："))
                                          {
                                        	  unameFather = unameFather.substring(0,unameFather.indexOf("："));
                                              unameFather1 = unameFather1.substring(0,unameFather1.indexOf("："));
                                          
                                              try {
                                            	  if(rtEdgeList.containsKey(unameFather+"\t"+unameFather1)){
											        rtEdgeList.put(uname+"\t"+uname1,midDate(list[5],rtEdgeList.get(unameFather+"\t"+unameFather1),j+1));
                                            	  }
                                            	  } catch (ParseException e) {
											// TODO Auto-generated catch block
											          e.printStackTrace();
										           }
                                          }
                                        }
                               
                              }
                          }
                          }
                          uname = contentList[1];
                          if(uname.contains("："))
                          {
                              uname = uname.substring(0,uname.indexOf("："));
                              //rtEdgeList.put(list[4]+"\t"+uname,list[0]);
                              if(!rtEdgeList.containsKey(list[4]+"\t"+uname))
                              {
                                  rtEdgeList.put(list[4]+"\t"+uname,list[0]);
                              }
                          }
                                      
                  }
                  
                  
                  //output.collect(new Text(""),new Text("end of retweet"));
              }
              Iterator it = rtEdgeList.entrySet().iterator();
              while (it.hasNext()) {
            	  java.util.Map.Entry entry = (java.util.Map.Entry) it.next();
            	  output.collect(key,new Text(entry.getKey()+"\t"+entry.getValue()));
            	}
           
              rtEdgeList.clear();
              tempList.clear();
              identifier.clear();
          
      }
      
      protected static String midDate(String startTime,String endTime,int splitNum) throws ParseException{
    	  
    	  SimpleDateFormat dfs = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    	  java.util.Date begin=dfs.parse(startTime);
    	  java.util.Date end = dfs.parse(endTime);
    	 
    	  Calendar m=Calendar.getInstance(); 
    	  long timediff=(end.getTime()-begin.getTime())/splitNum;
    	  m.setTimeInMillis(end.getTime()-timediff);
    	  String midTime=dfs.format(m.getTime());
    	  return midTime;
      }
      }
      public static void main(String[] args) throws Exception {
          JobConf conf = new JobConf(hottopicedge.class);
          conf.setJobName("BackboneEdge");
          DistributedCache.addCacheFile(new URI("/home/haixinma/weibo/motion.txt#motion.txt"),conf);
          conf.setOutputKeyClass(Text.class);
          conf.setOutputValueClass(Text.class);
          conf.setMapperClass(Map.class);
          conf.setReducerClass(Reduce.class);
          conf.setInputFormat(TextInputFormat.class);
          conf.setOutputFormat(TextOutputFormat.class);
          conf.setNumReduceTasks(1);
          FileInputFormat.setInputPaths(conf, new Path(args[0]));
          //FileOutputFormat.setOutputPath(conf, new Path(args[1]));
          Path output = new Path(args[1]);
          FileSystem fs = FileSystem.get(conf);
          if(fs.exists(output)){
            fs.delete(output,true);
          }
          FileOutputFormat.setOutputPath(conf, output);
          JobClient.runJob(conf);
        }
}

