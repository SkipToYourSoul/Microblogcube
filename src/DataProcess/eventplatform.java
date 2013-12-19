package DataProcess;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Collections;
import Util.Tool;

public class eventplatform {


	
	
	public static void main(String[] args) throws IOException {

		
		
		Map<String,String> id = new HashMap<String,String>();
		Map<String,String> platform = new HashMap<String,String>();
		
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
		
		FileInputStream fis1 = new FileInputStream(".\\data\\eventplatform");
		InputStreamReader isr1 = new InputStreamReader(fis1, "utf-8");
		BufferedReader br1 = new BufferedReader(isr1);
		
		String line1;
		
		while((line1 = br1.readLine()) != null){
			//line2=line2.replaceAll("\t", "\\|#\\|");
		//System.out.println(line2);
			String[] info=line1.split("\\|#\\|");
            String key=info[2].substring(info[2].indexOf("nofollow")+11,info[2].indexOf("</a>"));
           
           
            if(!platform.containsKey(key)){
			  platform.put(key, info[2].substring(info[2].indexOf("a herf=")+9,info[2].indexOf("rel=")-3));
				
            }	
		}
		 //Iterator it = id.entrySet().iterator();
         /*while (it.hasNext()) {
       	  java.util.Map.Entry entry = (java.util.Map.Entry) it.next();
       	  
       	  Tool.write(".\\data\\eventidname", entry.getKey()+"\t"+entry.getValue());
       	
       	  }*/

		FileInputStream fis2 = new FileInputStream(".\\data\\eventplatform");
		InputStreamReader isr2 = new InputStreamReader(fis2, "utf-8");
		BufferedReader br2 = new BufferedReader(isr2);
		
		String line2;
		
		while((line2 = br2.readLine()) != null){
			//line2=line2.replaceAll("\t", "\\|#\\|");
		//System.out.println(line2);
			String[] info=line2.split("\\|#\\|");
            String key=id.get(info[0])+"\t"+info[2].substring(info[2].indexOf("nofollow")+11,info[2].indexOf("</a>"))+"\t"+platform.get(info[2].substring(info[2].indexOf("nofollow")+11,info[2].indexOf("</a>")));
            
            String[] count=info[2].split("\t");
            if(map.containsKey(key)){
			   map.put(key, map.get(key)+Integer.valueOf(count[1]));
				
				}else{
					map.put(key, Integer.valueOf(count[1]));
				}
		}
		
		Iterator it = map.entrySet().iterator();
       while (it.hasNext()) {
      	  java.util.Map.Entry entry = (java.util.Map.Entry) it.next();
      	  
      	  Tool.write(".\\data\\platform", entry.getKey()+"\t"+entry.getValue());
      	
      	  }
	

		}
}
