package DataExtraction;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

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
import DataExtraction.extractSinceId.Map;
import DataExtraction.extractSinceId.Reduce;
import Util.Tool;

public class RTSize {


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
        String profileImageUrl = null;
        String location = null;
        String description = null;
        ArrayList<String> keywordList = new ArrayList<String>();
        private static String separator = "|#|";
        boolean isRetweet = false;
        public void configure(JobConf job) 
        {
            
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
                	if(status.getUser()!=null&&status.getRetweetedStatus()!=null){
                		text=status.getText();
                		x.set(status.getRetweetedStatus().getMid());
                	    y.set(status.getUser().getName()+"|#|"+text);
                        output.collect(x, y);
                     }
                }
            
            }
      }

      public static class Reduce extends MapReduceBase implements Reducer<Text, Text, Text, Text> 
      {
          public void reduce(Text key, Iterator<Text> values, OutputCollector<Text, Text> output, Reporter reporter) throws IOException 
          {
        	  java.util.Map<String,String> identifier = new HashMap<String,String>();
              while (values.hasNext()) 
              {
            	  String value=values.next().toString();
            	  String info[]=value.split("\\|\\#\\|");
            	  if(!identifier.containsKey(info[0])){
            		  identifier.put(info[0], "");
            	  }
            	  
            	  if(info[1].contains(":"))
                  {
            		  info[1] = info[1].replaceAll(":", "：");
                  }
                  if(info[1].contains("// @"))
                  {
                	  info[1] = info[1].replaceAll("// @", "//@");
                  }
                  if(info[1].contains(" "))
                  {
                	  info[1] = info[1].replaceAll(" ", "");
                  }
                  String[] contentList = info[1].split("//@");
                  
                  if(contentList.length > 1)
                  {
                	  for(int j = 1;j<contentList.length-1;j++)
                      {
                		  String uname = contentList[j];
                		  if(uname.contains("："))
                          {
                			  uname = uname.substring(0,uname.indexOf("："));
                			  if(!identifier.containsKey(uname)){
                        		  identifier.put(uname, "");
                        	  }
                           }
                      }
                  }
                 
              }
              
            
            
              output.collect(key, new Text(String.valueOf(identifier.size())));
              
              identifier.clear();
          }
      }
      public static void main(String[] args) throws Exception {
          JobConf conf = new JobConf(extractSinceId.class);
          conf.setJobName("RTSize");

          conf.setOutputKeyClass(Text.class);
          conf.setOutputValueClass(Text.class);
          conf.setMapperClass(Map.class);
          conf.setReducerClass(Reduce.class);
          conf.setInputFormat(TextInputFormat.class);
          conf.setOutputFormat(TextOutputFormat.class);
          conf.setInt("mapred.min.split.size", 268435456);
          conf.setInt("mapred.task.timeout", 2400000);
          conf.setNumReduceTasks(50);
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
