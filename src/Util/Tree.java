package Util;


import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;

import Util.Node;

public class Tree<T> {
	protected T head;
	protected int size = -1;
	protected ArrayList<Tree<T>> leafs = new ArrayList<Tree<T>>();
	protected Tree<T> parent = null;
	protected HashMap<T, Tree<T>> locate = new HashMap<T, Tree<T>>();
	protected HashMap<String,Node> nodeMap = new HashMap<String,Node>();
	protected int allHeight = -1;	//总高度
	protected int leafCount = -1;	//总叶子数量
	protected int allBorder = -1;	//总宽度
	protected int nonLeafCount = -1;	//总非叶节点数量
	protected boolean isstar = false;
	protected boolean ischain = false;
	protected boolean isCstar = false;

	
	public boolean isCstar() {
		return isCstar;
	}

	public void setCstar(boolean isCstar) {
		this.isCstar = isCstar;
	}

	public boolean isIsstar() {
		return isstar;
	}

	public void setIsstar(boolean isstar) {
		this.isstar = isstar;
	}

	public boolean isIschain() {
		return ischain;
	}

	public void setIschain(boolean ischain) {
		this.ischain = ischain;
	}

	public Tree(T head) {
		this.head = head;
		this.parent = null;
		locate.put(head, this);
	}

	public boolean isExists(T x) {
		if (locate.containsKey(x)) {
			return true;
		} else {
			return false;
		}
	}

	public void addNode(String key,Node node)
	{
		if(!nodeMap.containsKey(key))
		{
			nodeMap.put(key, node);
		}
	}
	
	public Node getNode(String key)
	{
		if(nodeMap.containsKey(key))
		{
			return nodeMap.get(key);
		}else
		{
			return null;
		}
	}
	public void addLeaf(T root, T leaf) {
		if (locate.containsKey(root)) {
			locate.get(root).addLeaf(leaf);
		} else {
			addLeaf(root).addLeaf(leaf);
		}
	}

	public Tree<T> addLeaf(T leaf) {
		Tree<T> t = new Tree<T>(leaf);
		leafs.add(t);
		t.parent = this;
		t.locate = this.locate;
		locate.put(leaf, t);
		return t;
	}

	public Tree<T> setAsParent(T parentRoot) {
		Tree<T> t = new Tree<T>(parentRoot);
		t.leafs.add(this);
		this.parent = t;
		t.locate = this.locate;
		t.locate.put(head, this);
		t.locate.put(parentRoot, t);
		return t;
	}

	public T getHead() {
		return head;
	}

	public Tree<T> getTree(T element) {
		return locate.get(element);
	}

	public Tree<T> getParent() {
		return parent;
	}

	public Collection<T> getSuccessors(T root) {
		Collection<T> successors = new ArrayList<T>();
		Tree<T> tree = getTree(root);
		if (null != tree) {
			for (Tree<T> leaf : tree.leafs) {
				successors.add(leaf.head);
			}
		}
		return successors;
	}
	public int getChildNum() {
		return leafs.size();
	}
	public ArrayList<Tree<T>> getSubTrees() {
		return leafs;
	}

	public static <T> Collection<T> getSuccessors(T of, Collection<Tree<T>> in) {
		for (Tree<T> tree : in) {
			if (tree.locate.containsKey(of)) {
				return tree.getSuccessors(of);
			}
		}
		return new ArrayList<T>();
	}

	@Override
	public String toString() {
		return printTree(0);
	}

	private static final int indent = 1;

	private String printTree(int increment) {
		String s = "";
		String inc = "";
		/*for (int i = 0; i < increment; ++i) {
			inc = inc + "1";
		}*/
		s = inc + head;
		for (Tree<T> child : leafs) {
			s += "\n" + child.printTree(increment + indent);
		}
		return s;
	}
	public ArrayList<String> getEdgeList(ArrayList<String> edgeList)
	{
        for (Tree<T> child : leafs) {
            edgeList.add(head+"\t"+child.getHead());
            child.getEdgeList(edgeList);
        }
        return edgeList;
	}

	public int getSize() {
		if (this.size >= 0) {
			return this.size;
		}
		this.size = 0;
		calSize();
		return this.size;
	}

	public int getLeafSize(Tree<String> tree) {
		return tree.leafs.size();
	}

	private int calSize() {
		size = leafs.size();
		for (Tree<T> child : leafs) {
			size += child.getSize();
		}
		return size;
	}

	public double getAvgHeight() {
		if (allHeight == -1 && leafCount == -1){
			calHeight();
		}
		return allHeight * 1.0 / leafCount;
	}

	protected void calHeight() {
		allHeight = 0;
		leafCount = 0;
		for( Tree<T> child : leafs){
			child.calHeight();
			allHeight += child.allHeight + child.leafCount;
			leafCount += child.leafCount;
		}
		if( leafs.size() == 0 ) 
			leafCount++;
	}
	
	public double getAvgBorder(){
		if(allBorder == -1 && nonLeafCount == -1 ){
			calBorder();
		}
		return allBorder * 1.0 / nonLeafCount;
	}
	
	protected void calBorder(){
		allBorder = 0;
		nonLeafCount = 0;
		for(Tree<T> child : leafs){
			child.calBorder();
			nonLeafCount += child.nonLeafCount;
			allBorder += child.allBorder;
		}
		allBorder += leafs.size();
		if( leafs.size() != 0 ) nonLeafCount++;
	}
	
}
