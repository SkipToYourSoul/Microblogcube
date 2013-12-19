package DataExtraction;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URI;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

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
import weibo4j.model.User;
import DataExtraction.EctractStock.Map;
import DataExtraction.EctractStock.Reduce;
import Util.Tool;

public class collabrate {

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
        String profileImageUrl = null;
        String location = null;
        String description = null;
        ArrayList<String> keywordList = new ArrayList<String>();
        private static String separator = "|#|";
        boolean isRetweet = false;
        public void configure(JobConf job) 
        {
        	Calendar s=Calendar.getInstance(); 
            s.set(2010,01,01,00,00,00);
            startTime = inputFormat.format(s.getTime());
        	Calendar c=Calendar.getInstance(); 
            c.set(2011,07,01,00,00,00);
            endTime = inputFormat.format(c.getTime());
        }
        
        public void map(LongWritable key, Text value, OutputCollector<Text, Text> output, Reporter reporter) throws IOException {
            try {
                statusList.clear();
                if(value.toString().startsWith("{")) 
                {
                    StatusWapper wapper = Status.constructWapperStatus(Tool.removeEol(value.toString()));
                    if(wapper!=null)
                    {
                        statusList = wapper.getStatuses();
                    }
                    
                }
                if(value.toString().startsWith("["))
                {
                    statusList = Status.constructStatuses(Tool.removeEol(value.toString()));
                }
                } catch (WeiboException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                } catch (weibo4j.model.WeiboException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }
                if(statusList == null)
                {
                    return;
                }
                for(Status status : statusList)
                {
                	
                    if(status.getUser()==null || status.getCreatedAt() == null||status.getRetweetedStatus()==null)
                    {
                        continue ;
                    }
                    
                    time=inputFormat.format(status.getCreatedAt());
                    
                    if(time.compareTo(startTime)<0||time.compareTo(endTime)>0){
                    	continue;
                    }
                    
                    if(status.getRetweetedStatus().getCreatedAt()!=null&&status.getRetweetedStatus().getUser()!=null){
                    	String RTtime=inputFormat.format(status.getRetweetedStatus().getCreatedAt());
                    	//x.set(status.getUser().getId()+"|#|"+status.getUser().getName());
                    	//y.set(status.getRetweetedStatus().getMid()+"|#|"+time+"|#|"+RTtime+"|#|"+status.getMid()+"|#|"+status.getRetweetedStatus().getUser().getId()+"|#|"+status.getRetweetedStatus().getUser().getName());
                    	//output.collect(x, y);
                    	x.set(status.getRetweetedStatus().getMid());
                    	y.set(RTtime+"|#|"+status.getRetweetedStatus().getUser().getId()+"|#|"+status.getRetweetedStatus().getUser().getName()+"|#|"+status.getRetweetedStatus().getUser().getFollowersCount()+"|#|"+time+"|#|"+status.getMid()+"|#|"+status.getUser().getId()+"|#|"+status.getUser().getName()+"|#|"+status.getText());
                    	output.collect(x, y);
                    }
                }
            }
      }

      public static class Reduce extends MapReduceBase implements Reducer<Text, Text, Text, Text> 
      {
          public void reduce(Text key, Iterator<Text> values, OutputCollector<Text, Text> output, Reporter reporter) throws IOException 
          {
        	  ArrayList<String>identifier=new ArrayList<String>();
        	  ArrayList<String>temp=new ArrayList<String>();
        	  
              while (values.hasNext()) 
              {
            	  String value=values.next().toString();
        	      String[] info=value.split("\\|\\#\\|");
            	  
        	      if(!identifier.contains(info[5])){
            		  identifier.add(info[5]);
            		  temp.add(value);
            	  }
                  
              }
              
              Collections.sort(temp);
              String []userinfo=temp.get(0).split("\\|\\#\\|");
              output.collect(key, new Text(userinfo[1]+"|#|"+userinfo[2]+"|#|"+userinfo[0]+"|#|"+userinfo[3]+temp.size()));
              
              for(int j=0;j<temp.size();j++){
            	  output.collect(new Text(""), new Text(userinfo[4]+"|#|"+userinfo[5]+"|#|"+userinfo[6]+"|#|"+userinfo[7]+"|#|"+userinfo[8]));
            	  
              }
              
            
              identifier.clear();
              temp.clear();
          }
      }
      public static void main(String[] args) throws Exception {
          JobConf conf = new JobConf(collabrate.class);
          conf.setJobName("Event Data");

          
          conf.setOutputKeyClass(Text.class);
          conf.setOutputValueClass(Text.class);
          conf.setMapperClass(Map.class);
          conf.setReducerClass(Reduce.class);
          conf.setInputFormat(TextInputFormat.class);
          conf.setOutputFormat(TextOutputFormat.class);
          conf.setInt("mapred.min.split.size", 268435456);
          conf.setInt("mapred.task.timeout", 2400000);
          conf.setNumReduceTasks(100);
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
