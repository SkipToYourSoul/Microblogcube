package Util;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;

public class MinHeap {

	private double heapList[]; // 保存堆的数组
	private int maxSize; // 堆的最大空间 大小控制在 10,000,000左右
	private int size; // 堆的实际大小

	/**
	 * 
	 * @param maxLen
	 * 堆的最大空间
	 */
	public MinHeap(int maxLen) {
		this.maxSize = maxLen;
		this.heapList = new double[maxLen];
		this.size = 0;
	}

	/**
	 * 弹出堆顶元素
	 * 
	 * @return 堆顶元素
	 */
	public double popOut() {
		double ret = 0;
		if (size <= 0)
			return ret;
		ret = heapList[0];
		heapList[0] = heapList[--size];
		adjustDown(0, size);
		return ret;
	}

	/**
	 * 插入元素
	 * 
	 * @param in
	 *            待插入的元素
	 * @return 是否成功插入
	 */
	public boolean pushIn(double in) {
		if (size < maxSize) {
			heapList[size] = in;
			size++;
			adjustUp(0, size);
			return true;
		}
		return false;
	}

	/**
	 *堆大小
	 * 
	 * @return 当前堆大小
	 */
	public int getSize() {
		return size;
	}

	/**
	 * 向下调整，当头元素较小时，需要不断下压。在popOut时使用
	 * 
	 * @param begin
	 *            需要调整的起始位置
	 * @param end
	 *            结束位置
	 */
	private void adjustDown(int begin, int end) {
		int loc = begin;
		int tmp;
		double lson, rson;
		while (loc < end) {
			if (loc * 2 + 1 < end)
				lson = heapList[loc * 2 + 1];
			else
				lson = Double.MAX_VALUE;
			if (loc * 2 + 2 < end)
				rson = heapList[loc * 2 + 2];
			else
				rson = Double.MAX_VALUE;
			tmp = loc;

			if (lson < heapList[tmp])
				tmp = loc * 2 + 1;
			if (rson < heapList[tmp])
				tmp = loc * 2 + 2;
			if (tmp == loc * 2 + 1) {
				heapList[loc * 2 + 1] = heapList[loc];
				heapList[loc] = lson;
				loc = loc * 2 + 1;
			} else if (tmp == loc * 2 + 2) {
				heapList[loc * 2 + 2] = heapList[loc];
				heapList[loc] = rson;
				loc = loc * 2 + 2;
			} else {
				break;
			}
		}
	}

	/**
	 * 向上调整，在尾部插入一个元素，需要向上调整至合适的位置
	 * 
	 * @param begin
	 *            起始位置
	 * @param end
	 *            结束位置
	 */
	private void adjustUp(int begin, int end) {
		int loc = end - 1;
		int parent = 0;
		while (loc > 0) {
			parent = (loc - 1) / 2;
			if (heapList[parent] > heapList[loc]) {
				double tmp = heapList[parent];
				heapList[parent] = heapList[loc];
				heapList[loc] = tmp;
				loc = parent;
			} else {
				break;
			}
		}
	}

	public static void main(String[] args) {
		try {
			MinHeap mh = new MinHeap(8);
			FileReader fr = new FileReader(new File("test.txt"));
			BufferedReader br = new BufferedReader(fr);
			int k = Integer.parseInt(br.readLine());
			for (int i = 0; i < k; ++i) {
				double d = Double.parseDouble(br.readLine());
				// System.out.println(d);
				mh.pushIn(d);
			}
			br.close();
			for (int i = 0; i < k; ++i) {
				System.out.println(mh.popOut());
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}