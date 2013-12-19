package DataProcess;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import Util.Tool;

public class index {

	
	
	public static void main(String[] args) throws IOException {
        Map<String,String> id = new HashMap<String,String>();
		
		Map<String,Integer> map = new HashMap<String,Integer>();
		
		FileInputStream fis = new FileInputStream("J:\\EventDemo\\data\\eventidname");
		InputStreamReader isr = new InputStreamReader(fis, "gbk");
		BufferedReader br = new BufferedReader(isr);
		
		String line;
	
		while((line = br.readLine()) != null){
			String[] info=line.split("\t");
	
			if(!id.containsKey(info[0])){
				
				id.put(info[0], info[1]);
				
			}
		}
		
		FileInputStream fis1 = new FileInputStream("J:\\EventDemo\\data\\hottopicclean.txt");
		InputStreamReader isr1 = new InputStreamReader(fis1, "utf-8");
		BufferedReader br1 = new BufferedReader(isr1);
		
		String line1 = null;
	    
		while((line1 = br1.readLine()) != null){
			
			String[] info=line1.split("\t");
	
			if(map.containsKey(id.get(info[0]))){
				
				map.put(id.get(info[0]), map.get(id.get(info[0]))+1);
				
			}else{
				map.put(id.get(info[0]), 1);
			}
		}
		
		int max=0;
		Iterator it = map.entrySet().iterator();
        while (it.hasNext()) {
      	  java.util.Map.Entry entry = (java.util.Map.Entry) it.next();
      	  
      	  if(map.get(entry.getKey())>max){
      		  max=map.get(entry.getKey());
      	  }
      	  //Tool.write(".\\data\\TimeSeries_id", entry.getKey()+","+map.get(entry.getKey()).get(0)+","+map.get(entry.getKey()).get(1)+","+map.get(entry.getKey()).get(2));
      	
      	  }
        
        System.out.println(max);
        Iterator it2 = map.entrySet().iterator();
        while (it2.hasNext()) {
      	  java.util.Map.Entry entry = (java.util.Map.Entry) it2.next();
      	  
      	  double hot=map.get(entry.getKey())*100.00/max;
      	  Tool.write(".\\data\\hotindex", entry.getKey()+"\t"+String.valueOf(hot));
      	
      	  }
		
		
	}


}
