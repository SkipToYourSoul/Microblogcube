package DataProcess;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import Util.Tool;

public class eventname_id {
	public static void main(String[] args) throws IOException {
	
        Map<String,Integer> id = new HashMap<String,Integer>();
		
		FileInputStream fis0 = new FileInputStream(".//data//count");
		InputStreamReader isr0 = new InputStreamReader(fis0, "utf-8");
		BufferedReader br0 = new BufferedReader(isr0);
		
		String line0;
		int count=0;
		while((line0 = br0.readLine()) != null){
			String[] info=line0.split("\\|#\\|");
	
			if(!id.containsKey(info[0])){
				count++;
				id.put(info[0], count);
				
			}
		}
		
		 Iterator it = id.entrySet().iterator();
         while (it.hasNext()) {
       	  java.util.Map.Entry entry = (java.util.Map.Entry) it.next();
       	  
       	  Tool.write(".\\data\\eventID", entry.getKey()+"\t"+entry.getValue());
       	
       	  }
	}

}
