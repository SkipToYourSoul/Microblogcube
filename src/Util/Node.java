package Util;

import java.util.Date;

public class Node {
	protected String uname = null;
	protected String uid = null;
	protected String content = null;
	protected int followersCount = -1;
	protected boolean isV = false;
	protected Date pubTime = null;
	protected int tweetLen = -1;
	protected double retweetSChild = -1;
	protected double retweetSSuccessor = -1;
	protected int childNum = -1;
	protected int successorNum = -1;
	
	public Node()
	{
		
	}
	public Node(String uname)
	{
		this.uname = uname;
	}
	public Node(String uname,String content)
	{
		this.uname = uname;
		this.content = content;
	}
	public Node(String uname,String uid,int followersCount,boolean isV)
	{
		this.uname = uname;
		this.uid = uid;
		this.followersCount = followersCount;
		this.isV = isV;
	}
	public Node(String uname,String uid,int followersCount,boolean isV,Date pubTime)
	{
		this.uname = uname;
		this.uid = uid;
		this.followersCount = followersCount;
		this.isV = isV;
		this.pubTime = pubTime;
	}
	
	public Node(String uname,Date pubTime, int followersCount,boolean isV)
	{
		this.uname = uname;
		this.pubTime = pubTime;
		this.followersCount = followersCount;
		this.isV = isV;
	}
	public void setUname(String uname)
	{
		this.uname = uname;
	}
	public void setContent(String content)
	{
		this.content = content;
	}
	public void setUid(String uid)
	{
		this.uid = uid;
	}
	public void setFollowerCount(int followersCount)
	{
		this.followersCount = followersCount;
	}
	public void setIsV(boolean isV)
	{
		this.isV = isV;
	}
	public void setRetweetSChild(int retweetSChild)
	{
		this.retweetSChild = retweetSChild;
	}
	public void setRetweetSSuccessor(int retweetSSuccessor)
	{
		this.retweetSSuccessor = retweetSSuccessor;
	}
	public String getUname()
	{
		return this.uname;
	}
	public String getContent()
	{
		return this.content;
	}
	public String getUid()
	{
		return this.uid;
	}
	public int getFollowersCount()
	{
		return this.followersCount;
	}
	public boolean getIsV()
	{
		return this.isV;
	}
	public double getRetweetSChild()
	{
		return this.retweetSChild;
	}
	public double getRetweetSSuccessor()
	{
		return this.retweetSSuccessor;
	}
	public String toString()
	{
		return uname;
	}
	public int compareTo(Node temp)
	{
		return this.uname.compareTo(((Node)temp).uname);
		
	}
	@Override
	public boolean equals(Object temp)
	{
		if(temp instanceof Node)
		{
			return this.uname.equals(((Node)temp).uname);
		}
		else
		{
			return false;
		}
		
	}
	@Override
	public int hashCode()
	{
		return this.uname.hashCode();
	}
	
}
