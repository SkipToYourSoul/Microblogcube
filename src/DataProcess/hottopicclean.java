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

public class hottopicclean {


	
	
	public static void main(String[] args) throws IOException {

		
		
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

		FileInputStream fis2 = new FileInputStream(".//data//hottopicmood");
		InputStreamReader isr2 = new InputStreamReader(fis2, "utf-8");
		BufferedReader br2 = new BufferedReader(isr2);
		
		String line2;
		
		while((line2 = br2.readLine()) != null){
			String[] info=line2.split("\\|#\\|");

			if(id.containsKey(info[0])){
				String[] detail=line2.split("\t");
				if(Integer.valueOf(detail[1])>50){
					Tool.write(".//data//hottopicmoodclean", line2);
				}
				
				}
		}
		
	
	

		}
}
