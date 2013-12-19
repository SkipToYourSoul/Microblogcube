package Model;

import java.util.LinkedList;
import java.util.List;

public class EventSummary {
	private int distinctUserCount;
	private int tweetCount;
	private int rtCount;
	//private int commentCount;

	public EventSummary(int distinctUserCount, int tweetCount, int rtCount,
			int commentCount) {
		super();
		this.distinctUserCount = distinctUserCount;
		this.tweetCount = tweetCount;
		this.rtCount = rtCount;
	}

	/**
	 * 唯一用户参与数
	 * @return the distinctUserCount
	 */
	public int getDistinctUserCount() {
		return distinctUserCount;
	}

	/**
	 * 事件相关微博数（包含转发？）
	 * @return the tweetCount
	 */
	public int getTweetCount() {
		return tweetCount;
	}

	/**
	 * 事件相关转发微博数
	 * @return the rtCount
	 */
	public int getRtCount() {
		return rtCount;
	}
}
