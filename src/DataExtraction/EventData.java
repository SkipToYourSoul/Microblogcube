package DataExtraction;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URI;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Iterator;
import java.util.List;
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

import weibo4j.WeiboException;
import weibo4j.model.Status;
import weibo4j.model.StatusWapper;
import weibo4j.model.User;
import Util.Tool;

public class EventData {
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
                keywordList.add(line);
            }
          } catch (IOException e) {
              // TODO Auto-generated catch block
              e.printStackTrace();
          }
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
                    if(status.getUser()==null || status.getCreatedAt() == null)
                    {
                        continue ;
                    }
                    time = inputFormat.format(status.getCreatedAt());
                    text = status.getText();
                    if(status.getRetweetedStatus()!=null)
                    {
                        rtStatus = status.getRetweetedStatus();
                        rtText = rtStatus.getText();
                        isRetweet = true;
                    }else
                    {
                        rtText = "";
                        isRetweet = false;
                    }
                   
                    /*
                     * 如果是讨论事件的微博，生成数据格式:
                     * key : event+mid
                     * value : time+text+source+repostCount+commentCount+uid+uname+followerCount
                     * +friendsCount+statusCount+favouriteCount+isV+gender+description+profileUrl+location.
                     * 如果是原创微博，则生成一条新的微博记录
                     */
                    
                    for(String keyword:keywordList)
                    {
                        User user =status.getUser();
                        String[] list = keyword.split("\t");
                        String find = list[1];                      
                        Pattern p = Pattern.compile(find);
                        Matcher matcher = p.matcher(text);
                        Matcher matcher1 = p.matcher(rtText);
                        if(matcher.find() || matcher1.find())
                        {
                            x.set(list[0]+this.separator+status.getMid());
                            if(user.getProfileImageUrl()!=null)
                            {
                                profileImageUrl = user.getProfileImageUrl();
                            }else
                            {
                                profileImageUrl = "";
                            }
                            if(user.getLocation()!=null)
                            {
                                location = user.getLocation();
                            }else
                            {
                                location = "";
                            }
                            if(user.getDescription()!=null)
                            {
                                description = user.getDescription();
                            }else
                            {
                                description = "";
                            }
                            y.set(status.getSource()+this.separator
                                    +isRetweet+this.separator
                                    +time+this.separator
                                    +text+this.separator
                                    +status.getRepostsCount()+this.separator
                                    +status.getCommentsCount()+this.separator
                                    +user.getId()+this.separator
                                    +user.getName()+this.separator
                                    +user.getFollowersCount()+this.separator
                                    +user.getFriendsCount()+this.separator
                                    +user.getStatusesCount()+this.separator
                                    +user.getFavouritesCount()+this.separator
                                    +user.isVerified()+this.separator
                                    +user.getGender()+this.separator
                                    +description+this.separator
                                    +profileImageUrl+this.separator
                                    +location);
                            
                            output.collect(x, y);
                        }
                    }
                }
            
            }
      }

      public static class Reduce extends MapReduceBase implements Reducer<Text, Text, Text, Text> 
      {
          public void reduce(Text key, Iterator<Text> values, OutputCollector<Text, Text> output, Reporter reporter) throws IOException 
          {
              while (values.hasNext()) 
              {
                  output.collect(key, new Text(values.next()));
                  break;
              }
          }
      }
      public static void main(String[] args) throws Exception {
          JobConf conf = new JobConf(EventData.class);
          conf.setJobName("Event Data");

          DistributedCache.addCacheFile(new URI("/home/haixinma/weibo/political.txt#political.txt"),conf);
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
