/**
 * WeiboCrawler2 
 * @date Jul 2, 2011
 * @author haixinma
 */
package Util;

import java.io.Serializable;
import java.util.Date;

public class MyUser implements Serializable,Comparable<MyUser>{
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	public static final String eol = System.getProperty("line.separator");
    public String uid = null;
    public String uname = null;
    public String location = null;
    public String description = null;
    public String gender = null;
    public long followers_count = 0;
    public int friends_count = 0;
    public int statuses_count = 0;
    public int favourites_count = 0;
    public String created_at = null;
    public String verified = null;
    
    public MyUser()
    {
        
    }
    public MyUser(String uid,String uname,
            String location,String description,
            String gender,long followers_count,
            int friends_count,int statuses_count,int favourites_count,
            String created_at,String verified)
    {
        this.uid = uid;
        this.uname = uname;
        this.location = location;
        this.description = description;
        this.gender = gender;
        this.followers_count = followers_count;
        this.friends_count = friends_count;
        this.statuses_count = statuses_count;
        this.favourites_count = favourites_count;
        this.created_at = created_at;
        this.verified = verified;
    }
    public void setUid(String uid)
    {
    	this.uid = uid;
    }
    public void setUname(String uname)
    {
    	this.uname = uname;
    }
    public void setLocation(String location)
    {
    	this.location = location;
    }
    public void setDestription(String description)
    {
    	this.description = description;
    }
    public void setGender(String gender)
    {
    	this.gender = gender;
    }
    public void setFollowersCount(int followers_count)
    {
    	this.followers_count = followers_count;
    }
    public void setFriendsCount(int friends_count)
    {
    	this.friends_count = friends_count;
    }
    public void setStatusCount(int statuses_count)
    {
    	this.statuses_count = statuses_count;
    }
    public void setFavouritesCount(int favourites_count)
    {
    	this.favourites_count =favourites_count;
    }
    public void setCreatedAt(String created_at)
    {
    	this.created_at = created_at;
    }
    public void setIsVerified(String verified)
    {
    	this.verified = verified;
    }
    public int compareTo(MyUser m2){
        return uid.compareTo(m2.uid);
    }

    @Override
	public boolean equals(Object o){
        return this.uid.equals(((MyUser)o).uid);
    }

    @Override
	public int hashCode(){
        return this.uid.hashCode();
    }
    
    @Override
	public String toString(){
    	StringBuffer sb = new StringBuffer();
    	sb.append("uid:");
		sb.append(uid);
		sb.append("|#|");
		
		sb.append("uname:");
		sb.append(uname);
		sb.append("|#|");
		
		sb.append("location:");
		sb.append(location);
		sb.append("|#|");
		
		sb.append("description:");
		sb.append(description);
		sb.append("|#|");
		
		sb.append("followers_count:");
		sb.append(followers_count);
		sb.append("|#|");
		
		sb.append("friends_count:");
		sb.append(friends_count);
		sb.append("|#|");
		
		sb.append("statuses_count:");
		sb.append(statuses_count);
		sb.append("|#|");
		
		sb.append("favourites_count:");
		sb.append(favourites_count);
		sb.append("|#|");
		
		sb.append("created_at:");
		sb.append(created_at);
		sb.append("|#|");
		
		sb.append("verified:");
		sb.append(verified);
		sb.append("|#|");
		
		sb.append("gender:");
		sb.append(gender);
		
    	return sb.toString();
    }
    public String rtToString(){
    	StringBuffer sb = new StringBuffer();
    	sb.append("rtUid:");
		sb.append(uid);
		sb.append("|#|");
		
		sb.append("rtUname:");
		sb.append(uname);
		sb.append("|#|");
		
		sb.append("rtLocation:");
		sb.append(location);
		sb.append("|#|");
		
		sb.append("rtDescription:");
		sb.append(description);
		sb.append("|#|");
		
		sb.append("rtFollowers_count:");
		sb.append(followers_count);
		sb.append("|#|");
		
		sb.append("rtFriends_count:");
		sb.append(friends_count);
		sb.append("|#|");
		
		sb.append("rtStatuses_count:");
		sb.append(statuses_count);
		sb.append("|#|");
		
		sb.append("rtFavourites_count:");
		sb.append(favourites_count);
		sb.append("|#|");
		
		sb.append("rtCreated_at:");
		sb.append(created_at);
		sb.append("|#|");
		
		sb.append("rtVerified:");
		sb.append(verified);
		sb.append("|#|");
		
		sb.append("rtGender:");
		sb.append(gender);
		
    	return sb.toString();
    }
    public void set(String uid,String uname,
            String location,String description,
            String gender,long followers_count,
            int friends_count,int statuses_count,int favourites_count,
            String created_at,String verified)
    {
        this.uid = uid;
        this.uname = uname;
        this.location = location;
        this.description = description;
        this.gender = gender;
        this.followers_count = followers_count;
        this.friends_count = friends_count;
        this.statuses_count = statuses_count;
        this.favourites_count = favourites_count;
        this.created_at = created_at;
        this.verified = verified;
    }
    private String xmlString() {
        StringBuffer sb = new StringBuffer();
        sb.append("<user>");
        sb.append(eol);
        if (uid == null)
        {
            sb.append("<uid/>");
        }else{
            sb.append("<uid>");
            sb.append(uid);
            sb.append("</uid>");
        }
        sb.append(eol);
        if (uname == null)
        {
            sb.append("<uname/>");
        }else{
            sb.append("<uname>");
            sb.append(uname);
            sb.append("</uname>");
        }
        sb.append(eol);
        if (location== null || location.equals(""))
        {
            sb.append("<location/>");
        }else{
            sb.append("<location>");
            sb.append(location);
            sb.append("</location>");
        }
        sb.append(eol);
       
        sb.append(eol);
        
        sb.append(eol);
        
        sb.append(eol);
        if (gender == null || gender.equals(""))
        {
            sb.append("<gender/>");
        }else{
            sb.append("<gender>");
            sb.append(gender);
            sb.append("</gender>");
        }
        sb.append(eol);
        if (followers_count == 0)
        {
            sb.append("<followers_count/>");
        }else{
            sb.append("<followers_count>");
            sb.append(followers_count);
            sb.append("</followers_count>");
        }
        sb.append(eol);
        if (friends_count == 0)
        {
            sb.append("<friends_count/>");
        }else{
            sb.append("<friends_count>");
            sb.append(friends_count);
            sb.append("</friends_count>");
        }
        sb.append(eol);
        if (statuses_count == 0)
        {
            sb.append("<statuses_count/>");
        }else{
            sb.append("<statuses_count>");
            sb.append(statuses_count);
            sb.append("</statuses_count>");
        }
        sb.append(eol);
        if (favourites_count == 0)
        {
            sb.append("<favourites_count/>");
        }else{
            sb.append("<favourites_count>");
            sb.append(favourites_count);
            sb.append("</favourites_count>");
        }
        sb.append(eol);
        if (created_at == null)
        {
            sb.append("<created_at/>");
        }else{
            sb.append("<created_at>");
            sb.append(created_at);
            sb.append("</created_at>");
        }
        sb.append(eol);
        if (verified == null)
        {
            sb.append("<verified/>");
        }else{
            sb.append("<verified>");
            sb.append(verified);
            sb.append("</verified>");
        }
        sb.append(eol);
       
        return sb.toString();
    }
    public void clear()
    {
        this.uid = null;
        this.uname = null;
        this.location = null;
        this.description = null;
        this.gender = null;
        this.followers_count = 0;
        this.friends_count = 0;
        this.statuses_count = 0;
        this.favourites_count = 0;
        this.created_at = null;
        this.verified = null;
    }

}
