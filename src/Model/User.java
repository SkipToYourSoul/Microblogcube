package Model;

import java.util.Date;

public class User {
    protected String uid = null;
    protected String uname = null;
    protected String profileImageUrl = null;
    protected boolean isV = false;
    protected String gender = null;
    protected String province =null;
    protected String city = null;
    protected String description = null;
    protected int followerCount = -1;
    protected int friendCount = -1;
    protected int statusCount = -1;
    protected int favouriteCount = -1;
    protected Date createTime = null;
    public User(String uid)
    {
        this.uid = uid;
    }
    public User(String uid,String uname,String profileImageUrl,boolean isV,String gender,
            String province,String city,String description,int followerCount,int friendCount,
            int statusCount,int favouriteCount,Date createTime)
    {
        this.uid= uid;
        this.uname = uname;
        this.profileImageUrl = profileImageUrl;
        this.isV = isV;
        this.gender = gender;
        this.province = province;
        this.city = city;
        this.description = description;
        this.followerCount = followerCount;
        this.friendCount = friendCount;
        this.statusCount = statusCount;
        this.favouriteCount = favouriteCount;
        this.createTime = createTime;
    }
    //set function
    public void setUid(String uid)
    {
        this.uid = uid;
    }
    public void setUname(String uname)
    {
        this.uname = uname;
    }
    public void setProfileImageUrl(String profileImageUrl)
    {
        this.profileImageUrl = profileImageUrl;
    }
    public void setIsV(boolean isV)
    {
        this.isV = isV;
    }
    public void setGender(String gender)
    {
        this.gender = gender;
    }
    public void setProvince(String province)
    {
        this.province = province;
    }
    public void setCity(String city)
    {
        this.city = city;
    }
    public void setDescription(String description)
    {
        this.description = description;
    }
    public void setFollowerCount(int followerCount)
    {
        this.followerCount = followerCount;
    }
    public void setFriendCount(int friendCount)
    {
        this.friendCount = friendCount;
    }
    public void setStatusCount(int statusCount)
    {
        this.statusCount = statusCount;
    }
    public void setFavouriteCount(int favouriteCount)
    {
        this.favouriteCount = favouriteCount;
    }
    public void setCreateTime(Date createTime)
    {
        this.createTime = createTime;
    }
    //get function
    public String getUid()
    {
        return uid;
    }
    public String getUname()
    {
        return uname;
    }
    public String getProfileImageUrl()
    {
        return profileImageUrl;
    }
    public boolean getIsV()
    {
        return isV;
    }
    public String getGender()
    {
        return gender;
    }
    public String getProvince()
    {
        return province;
    }
    public String getCity()
    {
        return city;
    }
    public String getDescription()
    {
        return description;
    }
    public int getFollowerCount()
    {
        return followerCount;
    }
    public int getFriendCount()
    {
        return friendCount;
    }
    public int getStatusCount()
    {
        return statusCount;
    }
    public int getFavouriteCount()
    {
        return favouriteCount;
    }
    public Date getCreateTime()
    {
        return createTime;
    }
}
