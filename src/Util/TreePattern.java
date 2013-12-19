package Util;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class TreePattern {
	ArrayList<Integer> starPatternNum;
	ArrayList<Integer> chainPatternNum;
	ArrayList<Integer> c_starPatternNum;
	HashMap<Integer, Integer> starMap;// key<star form, position in
										// starPatternNum>
	HashMap<Integer, Integer> chainMap;// key<chain form, position in
										// chainPatternNum>
	HashMap<Integer, Integer> c_starMap;

	public TreePattern() {
		starPatternNum = new ArrayList<Integer>();
		chainPatternNum = new ArrayList<Integer>();
		starMap = new HashMap<Integer, Integer>();
		chainMap = new HashMap<Integer, Integer>();
		c_starPatternNum = new ArrayList<Integer>();
		c_starMap = new HashMap<Integer, Integer>();
	}

	final static int ischain = 3;
	final static int isstar = 2;
	final static int isstarhead = 1;

	public void patternStatic(Tree<String> t,int len)
	{
	    //c_star
	    int childNum = t.getChildNum();
	    if (childNum <= 0)
	    {
	        if(len<=2 && t.getParent().getChildNum()>=2)
            {
                return;
            }
            if(chainMap.containsKey(len)) {
                int pos = chainMap.get(len);
                int oldnum = chainPatternNum.get(pos);
                chainPatternNum.set(pos, oldnum + 1);
            } else {
                int pos = chainPatternNum.size();
                chainPatternNum.add(1);
                chainMap.put(len, pos);
            }
            return;
	    }
	    
	    if(childNum>=2)
        {
            if(c_starMap.containsKey(childNum))
            {
                int pos = c_starMap.get(childNum);
                int oldnum = c_starPatternNum.get(pos);
                c_starPatternNum.set(pos, ++oldnum);
            }else
            {
                int pos = c_starPatternNum.size();
                c_starPatternNum.add(1);
                c_starMap.put(childNum, pos);
            }
        }
	    ++len;
	    for (Tree<String> t1 : t.getSubTrees()) {
            patternStatic(t1,len);
        }
	}
	public void chainPatternStatic(Tree<String> t,int len)
	{
	    int childNum = t.getChildNum();
	    
        if (childNum <= 0 )
        {
            if(len<=2 && t.getParent().getChildNum()>=2)
            {
                return;
            }
            if(chainMap.containsKey(len)) {
                int pos = chainMap.get(len);
                int oldnum = chainPatternNum.get(pos);
                chainPatternNum.set(pos, oldnum + 1);
            } else {
                int pos = chainPatternNum.size();
                chainPatternNum.add(1);
                chainMap.put(len, pos);
            }
            return;
        }else
        {
            for (Tree<String> t1 : t.getSubTrees()) {
                chainPatternStatic(t1,++len);
            }
        }
            
	}
	public void TreeStatic(Tree<String> t1) {
		int childNum = t1.getChildNum();
		if (childNum <= 0)
			return;

		if (t1.isIsstar() || t1.isCstar() || childNum == 1) {
			for (Tree<String> t : t1.getSubTrees())
				TreeStatic(t);
		}

		if (childNum >= 2) {
			if (t1.getParent().getChildNum() == 1 && !t1.getParent().isIsstar()&& !t1.isCstar()) {

				if (c_starMap.containsKey(childNum)) {
					int pos = c_starMap.get(childNum);
					int oldnum = c_starPatternNum.get(pos);
					c_starPatternNum.set(pos, oldnum + 1);
				} else {
					int pos = c_starPatternNum.size();
					c_starPatternNum.add(1);
					c_starMap.put(childNum, pos);
				}
				t1.setCstar(true);
				t1.getParent().setCstar(true);

				for (Tree<String> t : t1.getSubTrees()) {
					t.setCstar(true);
					TreeStatic(t);
				}

			} else {

				if (starMap.containsKey(childNum)) {
					int pos = starMap.get(childNum);
					int oldnum = starPatternNum.get(pos);
					starPatternNum.set(pos, oldnum + 1);
				} else {
					int pos = starPatternNum.size();
					starPatternNum.add(1);
					starMap.put(childNum, pos);
				}
				t1.setIsstar(true);

				for (Tree<String> t : t1.getSubTrees()) {
					t.setIsstar(true);
					TreeStatic(t);
				}
			}

		}

	}

	public void ChainStatic(Tree<String> c, int len) {
		if (c.isCstar() || c.isIsstar() || c.isIschain()) {
			if (chainMap.containsKey(len)) {
				int pos = chainMap.get(len);
				int oldnum = chainPatternNum.get(pos);
				chainPatternNum.set(pos, oldnum + 1);
			} else {
				int pos = chainPatternNum.size();
				chainPatternNum.add(1);
				chainMap.put(len, pos);
			}
			return;

		}
		if (c.getChildNum() == 0) {
			c.setIschain(true);
			len++;
			if (chainMap.containsKey(len)) {
				int pos = chainMap.get(len);
				int oldnum = chainPatternNum.get(pos);
				chainPatternNum.set(pos, oldnum + 1);
			} else {
				int pos = chainPatternNum.size();
				chainPatternNum.add(1);
				chainMap.put(len, pos);
			}
			return;
		}

		if (c.getChildNum() == 1) {
			c.setIschain(true);
			ChainStatic(c.getSubTrees().get(0), len + 1);
		}

	}

	public ArrayList<String> getStarPatterNum()
	{
	    ArrayList<String> tempList = new ArrayList<String>();
	    Iterator iterator = starMap.entrySet().iterator();
        while (iterator.hasNext())
        {
            Map.Entry<Integer,Integer> entry = (Map.Entry<Integer,Integer>) iterator.next();
            int key = entry.getKey();
            int value = entry.getValue();
            int num = starPatternNum.get(value);
            tempList.add(key+"\t"+num);
        }
        return tempList;
	}
	public ArrayList<String> getChainPatterNum()
    {
	    ArrayList<String> tempList = new ArrayList<String>();
        Iterator iterator = chainMap.entrySet().iterator();
        while (iterator.hasNext())
        {
            Map.Entry<Integer,Integer> entry = (Map.Entry<Integer,Integer>) iterator.next();
            int key = entry.getKey();
            int value = entry.getValue();
            int num = chainPatternNum.get(value);
            tempList.add(key+"\t"+num);
        }
        return tempList;
    }
	public ArrayList<String> getCStarPatterNum()
    {
	    ArrayList<String> tempList = new ArrayList<String>();
        Iterator iterator = c_starMap.entrySet().iterator();
        while (iterator.hasNext())
        {
            Map.Entry<Integer,Integer> entry = (Map.Entry<Integer,Integer>) iterator.next();
            int key = entry.getKey();
            int value = entry.getValue();
            int num = c_starPatternNum.get(value);
            tempList.add(key+"\t"+num);
        }
        return tempList;
    }
	public void Statics(Collection<Tree<String>> c) {
		for (Tree<String> t1 : c) {
		    //System.out.println(t1);
		    
			//patternStatic(t1);
		}

		for (Tree<String> t1 : c) {
			//ChainStatic(t1, 0);
		}
	}
	public void Statics(Tree<String> t) 
	{
	    //star_patternStatic;
	    int childNum = t.getChildNum();
	    if(childNum>=2)
        {
            if (starMap.containsKey(childNum)) {
                int pos = starMap.get(childNum);
                int oldnum = starPatternNum.get(pos);
                starPatternNum.set(pos, oldnum + 1);
            } else {
                int pos = starPatternNum.size();
                starPatternNum.add(1);
                starMap.put(childNum, pos);
            }
        }
	    for(Tree<String> t1:t.getSubTrees())
	    {
	        patternStatic(t1,1);
	    }
	    
    }
	
	
}
