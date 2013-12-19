package weibo4j;

import weibo4j.http.HttpClient;
import weibo4j.http.Response;
import weibo4j.model.IDs;
import weibo4j.model.Paging;
import weibo4j.model.PostParameter;
import weibo4j.model.Status;
import weibo4j.model.StatusWapper;
import weibo4j.model.User;
import weibo4j.model.WeiboException;
import weibo4j.util.WeiboConfig;

/**
 * @author sinaWeibo
 * 
 */

public class Weibo implements java.io.Serializable {

	private static final long serialVersionUID = 4282616848978535016L;
	public static String CONSUMER_KEY = "";
	public static String CONSUMER_SECRET = "";
	public static String REDIRECT_URI = "";
	public static HttpClient client = new HttpClient();

	/**
	 * Sets token information
	 * 
	 * @param token
	 */
	public synchronized void setToken(String token) {
		client.setToken(token);
	}
   
	public IDs getFriendsIDSByUserId(String userid) throws WeiboException{
		return new IDs((Weibo.client.get(
				WeiboConfig.getValue("baseURL") + "friendships/friends/ids.json",
				new PostParameter[] { new PostParameter("uid", userid) })),this);
	}
	public StatusWapper getFriendsTimeline3(String userid,String max_id) throws weibo4j.WeiboException, WeiboException {
		return Status.constructWapperStatus(Weibo.client.get(WeiboConfig.getValue("baseURL") + "statuses/user_timeline.json",new PostParameter[] {
			new PostParameter("uid", userid),
			new PostParameter("max_id", max_id) }));

	}
	public Response getFriendsTimeline2(String userid,String max_id) throws weibo4j.WeiboException, WeiboException {
		return Weibo.client.get(WeiboConfig.getValue("baseURL") + "statuses/user_timeline.json",new PostParameter[] {
			new PostParameter("uid", userid),
			new PostParameter("max_id", max_id)});
	}
		
	public Response getFriendsTimeline4(String userid,String since_id) throws weibo4j.WeiboException, WeiboException {
		return Weibo.client.get(WeiboConfig.getValue("baseURL") + "statuses/user_timeline.json",new PostParameter[] {
			new PostParameter("uid", userid),
			new PostParameter("since_id", since_id)});
	}
	public Response getUserTimelineByUidTest(String uid, Paging page) throws weibo4j.WeiboException, WeiboException {
        return Weibo.client.get(
                        WeiboConfig.getValue("baseURL") + "statuses/user_timeline.json",
                        new PostParameter[] {new PostParameter("uid", uid)},page);
    }
	public StatusWapper getUserTimelineByUid(String uid, Paging page) throws weibo4j.WeiboException, WeiboException {
        return Status.constructWapperStatus(Weibo.client.get(
                        WeiboConfig.getValue("baseURL") + "statuses/user_timeline.json",
                        new PostParameter[] {new PostParameter("uid", uid)},page));
    }
	public StatusWapper getFriendsTimeline(String userid,String since_id) throws weibo4j.WeiboException, WeiboException {
			return Status.constructWapperStatus(Weibo.client.get(WeiboConfig.getValue("baseURL") + "statuses/user_timeline.json",new PostParameter[] {
				new PostParameter("uid", userid),
				new PostParameter("since_id", since_id)}));

	}
	public Response getPlaceByUid(String uid,Paging page) throws WeiboException{
	    return Weibo.client.get(
                WeiboConfig.getValue("baseURL") + "place/user_timeline.json",
                new PostParameter[] {new PostParameter("uid", uid)},page);
    }

		public User showUserById(String uid) throws WeiboException, weibo4j.WeiboException {
		return new User(Weibo.client.get(
				WeiboConfig.getValue("baseURL") + "users/show.json",
				new PostParameter[] { new PostParameter("uid", uid) })
				.asJSONObject());
	}
}