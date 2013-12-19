package Model;

import java.util.Date;

public class Tweet {
    protected String mid = null;
    protected String uid = null;
    protected String text = null;
    protected Date publishTime = null;
    protected String platform = null;
    protected int rtCount = -1;
    protected int commentCount =-1;
    protected String event = null;
    protected String rtMid = null;
    public Tweet(String mid)
    {
        this.mid = mid;
    }
    public Tweet(String mid,String uid,String text,Date publishTime,
            String platform,int rtCount,int commentCount,String event,
            String rtMid)
    {
        this.mid = mid;
        this.uid = uid;
        this.text = text;
        this.publishTime = publishTime;
        this.platform = platform;
        this.rtCount = rtCount;
        this.commentCount = commentCount;
        this.event = event;
        this.rtMid = rtMid;
    }
    //set function
    public void setMid(String mid)
    {
        this.mid = mid;
    }
    public void setUid(String uid)
    {
        this.uid = uid;
    }
    public void setText(String text)
    {
        this.text = text;
    }
    public void setPublishTime(Date publishTime)
    {
        this.publishTime = publishTime;
    }
    public void setPlatform(String platform)
    {
        this.platform = platform;
    }
    public void setRtCount(int rtCount)
    {
        this.rtCount = rtCount;
    }
    public void setCommentCount(int commentCount)
    {
        this.commentCount = commentCount;
    }
    public void setEvent(String event)
    {
        this.event = event;
    }
    public void setRtMid(String rtMid)
    {
        this.rtMid = rtMid;
    }
    //get function
    public String getMid()
    {
        return mid;
    }
    public String getUid()
    {
        return uid;
    }
    public String getText()
    {
        return text;
    }
    public Date getPublishTime()
    {
        return publishTime;
    }
    public String getPlatform()
    {
        return platform;
    }
    public int getRtCount()
    {
        return rtCount;
    }
    public int getCommentCount()
    {
        return commentCount;
    }
    public String getEvent()
    {
        return event;
    }
    public String getRtMid()
    {
        return rtMid;
    }
}
