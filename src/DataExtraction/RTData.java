package DataExtraction;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URI;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
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

import weibo4j.WeiboException;
import weibo4j.model.Status;
import weibo4j.model.StatusWapper;
import weibo4j.model.User;
import Util.Tool;

public class RTData {
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
        String rtProfileImageUrl = null;
        
        String location = null;
        String description = null;
        String rtLocation = null;
        String rtDescription = null;
        ArrayList<String> keywordList = new ArrayList<String>();
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
                    }else
                    {
                        continue;
                    }
                    if(status.getRetweetedStatus().getUser()==null || rtStatus.getCreatedAt() == null)
                    {
                        continue;
                    }
                   
                    /*
                     * 如果是讨论事件的转发微博，生成数据格式:
                     * key : event+rtMid
                     * value : time+text+source+repostCount+commentCount+uid+uname+followerCount
                     * +friendsCount+statusCount+favouriteCount+isV+gender+description+profileUrl+location.
                     * 如果是原创微博，则生成一条新的微博记录
                     */
                    
                    for(String keyword:keywordList)
                    {
                        User user =status.getUser();
                        User rtUser = rtStatus.getUser();
                        String[] list = keyword.split("\t");
                        String find = list[1];                      
                        Pattern p = Pattern.compile(find);
                        //Matcher matcher = p.matcher(text);
                        Matcher matcher1 = p.matcher(rtText);
                        if(matcher1.find())
                        {
                            x.set(list[0]+this.separator
                                    +rtStatus.getMid()+this.separator
                                    +rtText+this.separator
                                    +inputFormat.format(rtStatus.getCreatedAt())+this.separator
                                    +rtUser.getId()+this.separator
                                    +rtUser.getName());
                            
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
                            if(rtUser.getProfileImageUrl()!=null)
                            {
                                rtProfileImageUrl = rtUser.getProfileImageUrl();
                            }else
                            {
                               rtProfileImageUrl = "";
                            }
                            if(rtUser.getLocation()!=null)
                            {
                                rtLocation = rtUser.getLocation();
                            }else
                            {
                                rtLocation = "";
                            }
                            if(rtUser.getDescription()!=null)
                            {
                                rtDescription = rtUser.getDescription();
                            }else
                            {
                                rtDescription = "";
                            }
                            y.set(status.getMid()+this.separator
                                    +status.getText()+this.separator
                                    +inputFormat.format(status.getCreatedAt())+this.separator
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
                                    +location+this.separator
                                    
                                    +rtUser.getFollowersCount()+this.separator
                                    +rtUser.getFriendsCount()+this.separator
                                    +rtUser.getStatusesCount()+this.separator
                                    +rtUser.getFavouritesCount()+this.separator
                                    +rtUser.isVerified()+this.separator
                                    +rtUser.getGender()+this.separator
                                    +rtDescription+this.separator
                                    +rtProfileImageUrl+this.separator
                                    +rtLocation);
                            
                            output.collect(x, y);
                        }
                    }
                }
            
            }
      }

      public static class Reduce extends MapReduceBase implements Reducer<Text, Text, Text, Text> 
      {
          ArrayList<String> rtList = new ArrayList<String>();
          String[] list = null;
          Set<String> midSet = new HashSet<String>();
          int maxFollowersCount = -1;
          String record = "";
          private static String separator = "|#|";
          public void reduce(Text key, Iterator<Text> values, OutputCollector<Text, Text> output, Reporter reporter) throws IOException 
          {
              while (values.hasNext()) 
              {
                  list = values.next().toString().split("\\|#\\|");
                  if(list.length>22)
                  {
                      if(!midSet.contains(list[0]))
                      {
                          rtList.add(list[0]+this.separator
                                  +list[1]+this.separator
                                  +list[2]+this.separator
                                  +list[3]+this.separator
                                  +list[4]+this.separator
                                  +list[5]+this.separator
                                  +list[6]+this.separator
                                  +list[7]+this.separator
                                  +list[8]+this.separator
                                  +list[9]+this.separator
                                  +list[10]+this.separator
                                  +list[11]+this.separator
                                  +list[12]+this.separator
                                  +list[13]
                                  );
                          if(maxFollowersCount<=Integer.parseInt(list[14]))
                          {
                              maxFollowersCount = Integer.parseInt(list[14]);
                              record = list[14]+this.separator
                                      +list[15]+this.separator
                                      +list[16]+this.separator
                                      +list[17]+this.separator
                                      +list[18]+this.separator
                                      +list[19]+this.separator
                                      +list[20]+this.separator
                                      +list[21]+this.separator
                                      +list[22];
                          }
                      }
                  }
              }
              Collections.sort(rtList);
              for(String rt:rtList)
              {
                  output.collect(new Text(key.toString()+this.separator+record), new Text(rt));
              }
              rtList.clear();
              record = "";
              midSet.clear();
              maxFollowersCount = -1;
          }
      }
      public static void main(String[] args) throws Exception {
          JobConf conf = new JobConf(RTData.class);
          conf.setJobName("RT Data");

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
