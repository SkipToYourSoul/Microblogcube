package DataExtraction;
import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URI;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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
public class TimeEventCount {
    public static class Map extends MapReduceBase implements Mapper<LongWritable,Text, Text, Text> {
        private Text x = new Text();
        private Text y = new Text();
        String time;
        String location;
        ArrayList<String> moodList = new ArrayList<String>();
        //时间粒度到天
        SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        SimpleDateFormat inputFormat1 = new SimpleDateFormat("yyyy-MM-dd");
        private static String separator = "|#|";
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
       
        
        public void map(LongWritable key, Text value, OutputCollector<Text, Text> output, Reporter reporter) throws IOException {
            String record = value.toString();
            record = record.replaceFirst("\t", "|#|");
            String[] list = record.split("\\|"+"\\#"+"\\|");
            if(list.length>18)
            {
                try {
                    time = inputFormat1.format(inputFormat.parse(list[4]));
                    //location = list[18];
                    //if(location.contains(" "))
                    // {
                   //     location = location.substring(0,location.indexOf(" "));  
                   // }
                    
                   
                    //x.set(list[0]+"|#|"+location);
                   // y.set(list[14]);
                   // output.collect(x, y);
                    //x format : time event
                    //format : count 
                    //x.set(time+"\t"+list[0]);
                    //y.set(1+"");
                    /*location = list[17];
                    x.set(time+"\t"+list[0]+"\t"+location);*/
                    //x.set(time+"\t"+list[0]);
                    /* x.set(time+"\t"+list[0]+"\t"+list[17]);
                    y.set(list[7]);*/
                   location = list[18];
                    if(location.contains(" "))
                    {
                        location = location.substring(0,location.indexOf(" "));  
                    }
                   // for(String mood:moodList)
                   // {
                        //if(list[5].contains(mood))
                      //  {
                            x.set(list[0]+"|#|"+location+"|#|"+list[2]);
                            y.set(1+"");
                            output.collect(x, y);
                            /*if(list[3].equals("false")){
                            	 y.set(list[8]+"\t"+"1"+"\t"+"1"+"\t"+"0");
                            	 output.collect(x, y);
                            }else{
                            	 y.set(list[8]+"\t"+"1"+"\t"+"0"+"\t"+"1");
                            	 output.collect(x, y);
                            }
                           
                            
                       //}
                    //}
                    /*int followers = Integer.parseInt(list[9]);
                    x.set(list[0]);
                    y.set(followers+"");*/
                    //output.collect(x, y);
                } catch (ParseException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }
                
            }
            
            }
      }

      public static class Reduce extends MapReduceBase implements Reducer<Text, Text, Text, Text> 
      {
          java.util.Map<String,Integer> countMap = new HashMap<String,Integer>();
          public void reduce(Text key, Iterator<Text> values, OutputCollector<Text, Text> output, Reporter reporter) throws IOException 
          {
             int count1 = 0;
             int count2 = 0;
             int count3 = 0;
              List uidSet=new ArrayList();
              while(values.hasNext())
              {
                 values.next();
                  
                ++count1;
                /*String[] info = values.next().toString().split("\t");
            
                count1++;
               
                if(Integer.valueOf(info[2])==1){
                	count2++;
                }
                if(Integer.valueOf(info[3])==1){
                	count3++;
                }
                  /*if(countMap.containsKey(count))
                  {
                      int temp = countMap.get(count);
                      countMap.put(count,++temp);
                  }else
                  {
                      countMap.put(count, new Integer(1));
                  }*/
                 //String uid = values.next().toString();
                 /* if(!uidSet.contains(info[0]))
                  {
                      uidSet.add(info[0]);
                  }*/
              }
              output.collect(key, new Text(count1+""));
             /* String value="";
              Iterator it = countMap.entrySet().iterator();
              while (it.hasNext()) {
            	  java.util.Map.Entry entry = (java.util.Map.Entry) it.next();
            	   value+=entry.getKey()+"\t"+entry.getValue()+"|#|";
            	
            	  }
            output.collect(key, new Text(uidSet.size()+""));*/
              uidSet.clear();
              //output.collect(key, new Text(value));
            // countMap.clear();
          }
      }
      public static void main(String[] args) throws Exception {
          JobConf conf = new JobConf(TimeEventCount.class);
          conf.setJobName("Event isV Count");

          DistributedCache.addCacheFile(new URI("/home/haixinma/weibo/motion.txt#motion.txt.txt"),conf);
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
