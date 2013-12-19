package DataProcess;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import Util.Tool;

public class moodclassfier {

	
	
	public static void main(String[] args) throws IOException {

		
		Map<String,String> mood = new HashMap<String,String>();
		
		Map<String,String> id = new HashMap<String,String>();
		
		Map<String,Integer> map = new HashMap<String,Integer>();
		
		FileInputStream fis = new FileInputStream(".//data//eventidname");
		InputStreamReader isr = new InputStreamReader(fis, "gbk");
		BufferedReader br = new BufferedReader(isr);
		
		String line;
	
		while((line = br.readLine()) != null){
			String[] info=line.split("\t");
	
			if(!id.containsKey(info[0])){
				
				id.put(info[0], info[1]);
				
			}
		}
		 //Iterator it = id.entrySet().iterator();
         /*while (it.hasNext()) {
       	  java.util.Map.Entry entry = (java.util.Map.Entry) it.next();
       	  
       	  Tool.write(".\\data\\eventidname", entry.getKey()+"\t"+entry.getValue());
       	
       	  }*/
		
		File files=new File(".//data//mood");
		File[] fs=files.listFiles();
		
		for(File f:fs){
		
			FileInputStream fis0 = new FileInputStream(f);
			InputStreamReader isr0 = new InputStreamReader(fis0, "gbk");
			BufferedReader br0 = new BufferedReader(isr0);
			
			String line0;
			
			while((line0 = br0.readLine()) != null){
				
				
					mood.put(line0, f.getName());
				
			}
			
		}
		
		
		
		
		
		FileInputStream fis2 = new FileInputStream(".//data//eventtimemood");
		InputStreamReader isr2 = new InputStreamReader(fis2, "utf-8");
		BufferedReader br2 = new BufferedReader(isr2);
		
		String line2;
		
		while((line2 = br2.readLine()) != null){
			String[] info=line2.split("\\|#\\|");
			String mo[]=info[2].split("\t");
			String key="\""+id.get(info[0])+"\",\""+info[1]+"\",\""+mood.get(mo[0])+"\"";
		    
			if(mood.get(mo[0])==null){
		    	continue;
		    }
			if(map.containsKey(key)){
				int countmood=Integer.valueOf(mo[1])+map.get(key);
				map.put(key, countmood);
				
			}else{
				map.put(key, Integer.valueOf(mo[1]));
			}
		
		}
		
		 Iterator it2 = map.entrySet().iterator();
         while (it2.hasNext()) {
       	  java.util.Map.Entry entry = (java.util.Map.Entry) it2.next();
       	  
       	  Tool.write(".\\data\\eventtimemoodcount", entry.getKey()+","+"\""+entry.getValue()+"\"",true,"utf-8");
       	
       	  }
	}



}
