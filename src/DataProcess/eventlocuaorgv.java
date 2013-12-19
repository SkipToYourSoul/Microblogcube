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

public class eventlocuaorgv {


	
	
	public static void main(String[] args) throws IOException {

		
		
		Map<String,String> id = new HashMap<String,String>();
		
		Map<String,List<String>> map = new HashMap<String,List<String>>();
		
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

		FileInputStream fis2 = new FileInputStream(".//data//UAOR");
		InputStreamReader isr2 = new InputStreamReader(fis2, "utf-8");
		BufferedReader br2 = new BufferedReader(isr2);
		
		String line2;
		
		while((line2 = br2.readLine()) != null){
			String[] info=line2.split("\\|#\\|");
			
			String key=id.get(info[0])+"\t"+info[1];		    
			
			if(!map.containsKey(key)){
				List l=new ArrayList();
				l.add(info[2]);
				l.add(info[3]);
				l.add(info[4]);
				l.add(info[5]);
				map.put(key, l);
			
		
		}
		}
			FileInputStream fis1 = new FileInputStream(".//data//isV");
			InputStreamReader isr1 = new InputStreamReader(fis1, "utf-8");
			BufferedReader br1 = new BufferedReader(isr1);
			
			String line1;
			
			while((line1 = br1.readLine()) != null){
				String[] info=line1.split("\\|#\\|");
				
				String key=id.get(info[0])+"\t"+info[1];		    
				System.out.println(line1);
				if(info[2].equals("FALSE")){
					List l=map.get(key);
					l.add(info[3]);
					l.add(info[5]);
					map.put(key,l);
				}else if(info[2].equals("TRUE")){
					List l=map.get(key);
					System.out.println(info[3]);
					l.add(info[5]);
					l.add(info[3]);
					map.put(key,l);
				}
				
			
			}
			
			FileInputStream fis3= new FileInputStream(".//data//eventgender");
			InputStreamReader isr3 = new InputStreamReader(fis3, "utf-8");
			BufferedReader br3 = new BufferedReader(isr3);
			
			String line3;
			
			while((line3 = br3.readLine()) != null){
				String[] info=line3.split("\\|#\\|");
				
				String key=id.get(info[0])+"\t"+info[1];		    
				
				if(info[2].equals("f")){
					List l=map.get(key);
					l.add(info[3]);
					l.add(info[5]);
					map.put(key,l);
				}else{
					List l=map.get(key);
					l.add(info[5]);
					l.add(info[3]);
					map.put(key,l);
				}
				
			
			}
			
		 Iterator it2 = map.entrySet().iterator();
         while (it2.hasNext()) {
       	  java.util.Map.Entry entry = (java.util.Map.Entry) it2.next();
       	  String value="";
       	  for(int i=0;i<map.get(entry.getKey()).size();i++){
       		  value+=map.get(entry.getKey()).get(i)+"\t";
       	  }
       	  Tool.write(".\\data\\UAORVG", entry.getKey()+"\t"+value);
       	
       	  }
	

		}
}
