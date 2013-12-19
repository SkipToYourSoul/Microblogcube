/**
 * SinaT 
 * @date Oct 14, 2010
 * @author haixinma
 */
/**
 *  Mysql Operation Interface
 *
 *  Operation List: 
 *    (1) Open
 *    (2) Close
 *    (3) Put
 *    (4) Get
 *
 */
package DB;

import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Date;

import Model.Tweet;
import Model.User;

public class DBOI {
    private Connection connection = null;
    private DatabaseMetaData dbMetaData = null;
    String database ;
    Statement statement = null;
    String sql = null;
    public DBOI(String database)
    {
        this.database = "jdbc:mysql://localhost:3306/" + database + "?useUnicode=true&characterEncoding=utf8"; 
    }
    public void open()
    {
        try {
            //connection = DriverManager.getConnection(database,"haixinma","");
            connection = DriverManager.getConnection(database,"root","mhx");
            if(!connection.isClosed())
            {
                //System.out.println("Connect successfully!");
            }
            else
            {
                System.out.println("Connection Failed!");
            }
            dbMetaData = connection.getMetaData();
            if (dbMetaData.supportsTransactions())
            {
                connection.setAutoCommit(false);
            }
            statement = connection.createStatement();
            statement.executeUpdate("SET NAMES utf8");
        } catch (SQLException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }
    
    public ResultSet select(String srtCommond)
    {
    	ResultSet res = null;
    	try {
			res = statement.executeQuery(srtCommond);
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			System.err.println(e.getMessage());
			e.printStackTrace();
		}
		return res;
    }
    public void insert(String strCommond,boolean flag)
    {
        boolean ret = true;
        this.sql = strCommond;
        //System.out.println(sql);
        boolean success = false;
        try {
            if (dbMetaData.supportsBatchUpdates())
            {
                if(!sql.equals(""))
                {
                    statement.addBatch(sql);
                }
            }
            else
            {
                if(!sql.equals(""))
                {
                    statement.executeUpdate(sql);
                }
            }
            if(dbMetaData.supportsBatchUpdates() && flag)
            {
                statement.executeBatch();
            }
        } catch (SQLException e) {
            // TODO Auto-generated catch block
            //System.out.println(sql);
            //e.printStackTrace();
            success = true;
            //System.err.println(e.getMessage());
        }
        try
        {
            if (dbMetaData.supportsTransactions())
            {
                if (success)
                {
                    connection.rollback();
                } else if(flag)
                {
                    connection.commit();
                }
            }
        } catch (SQLException e)
        {
            System.out.println("Can't close connection.");
        }
    }
    
    public void close()
    {
        try {
            connection.close();
            //System.out.println("Disconnect successfully!");
        } catch (SQLException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            System.out.println("Can't close connection.");
        }
    }
    //operation 
    public void InsertTweet(Tweet tweet,boolean isToexecute)
    {
        if (IsInTweet(tweet.getMid()))
            return ;

        String stmt = "insert into tweet(mid,uid,text,publishtime,platform,rtcount,commentcount,event,rtmid) values('"
                + tweet.getMid()
                + "','"
                + tweet.getUid()
                + "','"
                + tweet.getText()
                + "','"
                + tweet.getPublishTime()
                + "','"
                + tweet.getPlatform()
                + "',"
                + tweet.getRtCount()
                + ","
                + tweet.getCommentCount()
                + ",'"
                + tweet.getEvent()
                + "','"
                + tweet.getRtMid()
                + "')";
        insert(stmt, isToexecute);
    }
    public void InsertUser(User user,boolean isToexecute)
    {
        if (IsInUser(user.getUid()))
            return ;

        String stmt = "insert into user(uid,uname,profileImageUrl,isV,gender,province,city,description,followerCount," +
                "friendcount,statuscount,favouritecount,createtime) values('"
                + user.getUid()
                + "','"
                + user.getUname()
                + "','"
                + user.getProfileImageUrl()
                + "','"
                + user.getIsV()
                + "','"
                + user.getGender()
                + "',"
                + user.getProvince()
                + "','"
                + user.getCity()
                + "','"
                + user.getDescription()
                + "',"
                + user.getFollowerCount()
                + ","
                + user.getFriendCount()
                + ","
                + user.getStatusCount()
                + ","
                + user.getFavouriteCount()
                + ",'"
                + user.getCreateTime()
                + "')";
        insert(stmt, isToexecute);
    }
    public void InsertMood(String mood,String event,String location,Date time,boolean isToexecute)
    {
        if (IsInMood(mood,event,location,time))
            return ;
        String stmt = "insert into mood(mood,event,location,time) values('"
                + mood
                + "','"
                + event
                + "','"
                + location
                + "','"
                + time
                + "')";
        insert(stmt, isToexecute);
    }
    public void InsertLocation(String location,String event,Date time,boolean isToexecute)
    {
        if (IsInLocation(location,event,time))
            return ;
        String stmt = "insert into location(location,event,time) values('"
                + location
                + "','"
                + event
                + "','"
                + time
                + "')";
        insert(stmt, isToexecute);
    }
    // existence
    public boolean IsInTweet(String mid)
    {
        ResultSet res = null;
        String stmt = "select * from tweet where uid =  '" + mid + "';";
        res = select(stmt);
        try {
            if (!res.next())
                return false;
        } catch (SQLException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return true;
    }
    public boolean IsInUser(String uid)
    {
        ResultSet res = null;
        String stmt = "select * from user where uid =  '" + uid + "';";
        res = select(stmt);
        try {
            if (!res.next())
                return false;
        } catch (SQLException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return true;
    }
    public boolean IsInMood(String mood,String event,String location, Date time)
    {
        ResultSet res = null;
        String stmt = "select * from mood where mood =  '" + mood + "'"
                + " and event = '" + event + "' and location = '" + location + "'"
                + " and time = '" + time + "'";
        res = select(stmt);
        try {
            if (!res.next())
                return false;
        } catch (SQLException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return true;
    }
    public boolean IsInLocation(String location,String event, Date time)
    {
        ResultSet res = null;
        String stmt = "select * from mood where location =  '" + location + "'"
                + " and event = '" + event + "' and time = '" + time + "'";
        res = select(stmt);
        try {
            if (!res.next())
                return false;
        } catch (SQLException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return true;
    }
    
    //select 
    public ResultSet selectUserByUid(String uid)
    {
        ResultSet res = null;
        String stmt = "select * from user where uid =  '" + uid + "';";
        res = select(stmt);
        return res;
    }
    public ResultSet selectTweetByMid(String mid)
    {
        ResultSet res = null;
        String stmt = "select * from tweet where mid =  '" + mid + "';";
        res = select(stmt);
        return res;
    }
    public ResultSet selectTweetbyRTMid(String rtMid)
    {
        ResultSet res = null;
        String stmt = "select * from tweet where rtmid =  '" + rtMid + "';";
        res = select(stmt);
        return res;
    }
    public ResultSet selectTopKRTTweets(int k)
    {
        ResultSet res = null;
        String stmt = "select limit "+k+" rtmid from tweet order by rtcount desc;";
        res = select(stmt);
        return res;
    }
    public ResultSet selectTopKCommentTweets(int k)
    {
        ResultSet res = null;
        String stmt = "select limit "+k+" rtmid from tweet order by commentcount desc;";
        res = select(stmt);
        return res;
    }
    public ResultSet selectEventTimeSeriesByDay(String eventId,String startTime,String endTime)
    {
        ResultSet res = null;
        String stmt = "select eventid,DATE_FORMAT(time,'%Y-%m-%d'),sum(count) from eventtimeseries where eventid='"+eventId+"' " +
        		"where DATEDIFF('"+startTime+"',time)<=0 and DATEDIFF('"+endTime+"', time)>=0"+
                "group DATE_FORMAT(time,'%Y-%m-%d');";
        res = select(stmt);
        return res;
    }
    public ResultSet selectEventTimeSeries(String eventId,String startTime,String endTime)
    {
        ResultSet res = null;
        String stmt = "select eventid,time,count from eventtimeseries where eventid='"+eventId+"' " +
                "where DATEDIFF('"+startTime+"',time)<=0 and DATEDIFF('"+endTime+"', time)>=0;";
        res = select(stmt);
        return res;
    }
    
}
