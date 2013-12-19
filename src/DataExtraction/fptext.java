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


public class fptext {
    public static class Map extends MapReduceBase implements Mapper<LongWritable,Text, Text, Text> {
        private Text x = new Text();
        private Text y = new Text();
        ArrayList<String> tempList = new ArrayList<String>();
        SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        List<Status> statusList = new ArrayList<Status>();
        Status rtStatus = null;
        String startTime = null;
        String endTime = null;
        String time = null;
        String text = null;
        String rtText = null;
        String rtMid = "";
        private static String separator = "|#|";
        private ArrayList<String> moodList = new ArrayList<String>();
        public void configure(JobConf job) 
        {
        	Calendar s=Calendar.getInstance(); 
            s.set(2010,01,01,00,00,00);
            startTime = inputFormat.format(s.getTime());
        	Calendar c=Calendar.getInstance(); 
            c.set(2010,06,01,00,00,00);
            endTime = inputFormat.format(c.getTime());
        }
        
        public void map(LongWritable key, Text value, OutputCollector<Text, Text> output, Reporter reporter) throws IOException 
        {
            String record = value.toString();
            record=record.replaceAll("\t", "\\|#\\|");
            
            String[] info = record.split("\\|"+"\\#"+"\\|");
            if(info.length>8&&info[3].compareTo(startTime)>=0&&info[3].compareTo(endTime)<=0){
            	x.set(info[0]);
            	y.set(info[7]);
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
              String value = "";
              int count=0;
              java.util.Map<String,String>map=new HashMap<String,String>();
              while (values.hasNext()) 
              {
            	  
                  String s=values.next().toString();
                  if(!map.containsKey(s)){
                	  map.put(s, "");
                	  count++;
                       value+=s+"\t";
                  }
              }
             
             if(count>1){
            	 String result=value.substring(0,value.lastIndexOf("\t"));
            	 output.collect(new Text(result), new Text(""));
                 
             }
                  
            map.clear();
          
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

