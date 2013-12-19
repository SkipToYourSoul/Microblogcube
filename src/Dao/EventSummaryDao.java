package Dao;

import java.util.List;

import Model.EventSummary;
import Model.Tweet;

public class EventSummaryDao {

	/**
	 * 查找event对应的事件摘要
	 * @param event
	 * @return
	 */
	public EventSummary findByEvent(String event){
		return null;
	}
	
	/**
	 * 事件相关的被转发次数最多的微博
	 * @return the topKRtedTweets
	 */
	public List<Tweet> getTopKRtedTweets() {
		return null;
	}

	/**
	 *  事件相关的被评论次数最多的微博
	 * @return the topCmtedTweets
	 */
	public List<Tweet> getTopCmtedTweets() {
		return null;
	}
	
}
