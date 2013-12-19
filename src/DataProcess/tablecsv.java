package DataProcess;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import Util.Tool;

public class tablecsv {
	
	
	public static void main(String[] args) throws IOException {
		
		Map<String,List<String>> map = new HashMap<String,List<String>>();
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
		
		FileInputStream fis = new FileInputStream(".//data//count");
		InputStreamReader isr = new InputStreamReader(fis, "utf-8");
		BufferedReader br = new BufferedReader(isr);
		
		String line;
		
		while((line = br.readLine()) != null){
			String[] info=line.split("\\|#\\|");
			//System.out.println(line);
			String[] detail=info[1].split("\t");
			if(!map.containsKey("\""+id.get(info[0])+"\""+","+"\""+detail[0]+"\"")){
				List l=new ArrayList();
				l.add("\""+detail[1]+"\"");
				l.add("\""+"0"+"\"");
				l.add("\""+"0"+"\"");
				map.put("\""+id.get(info[0])+"\""+","+"\""+detail[0]+"\"", l);
				
			}
		}
		
		FileInputStream fis1 = new FileInputStream(".//data//RT");
		InputStreamReader isr1 = new InputStreamReader(fis1, "utf-8");
		BufferedReader br1 = new BufferedReader(isr1);
		
		String line1;
		
		while((line1 = br1.readLine()) != null){
			String[] info=line1.split("\\|#\\|");
			String[] detail=info[1].split("\t");
			
			if(map.containsKey("\""+id.get(info[0])+"\""+","+"\""+detail[0]+"\"")){
				List l1=new ArrayList();
				List l=map.get("\""+id.get(info[0])+"\""+","+"\""+detail[0]+"\"");
				//System.out.println(l);
				l1.add(l.get(0));
				l1.add("\""+detail[1]+"\"");
				l1.add("\""+"0"+"\"");
				//System.out.println(l1);
				map.put("\""+id.get(info[0])+"\""+","+"\""+detail[0]+"\"", l1);
				
			}
		}
		
		FileInputStream fis2 = new FileInputStream(".//data//Original");
		InputStreamReader isr2 = new InputStreamReader(fis2, "utf-8");
		BufferedReader br2 = new BufferedReader(isr2);
		
		String line2;
		
		while((line2 = br2.readLine()) != null){
			String[] info=line2.split("\\|#\\|");
			String[] detail=info[1].split("\t");
			if(map.containsKey("\""+id.get(info[0])+"\""+","+"\""+detail[0]+"\"")){
				List l2=new ArrayList();
				List l=map.get("\""+id.get(info[0])+"\""+","+"\""+detail[0]+"\"");
				l2.add(l.get(0));
				l2.add(l.get(1));
				l2.add("\""+detail[1]+"\"");
				map.put("\""+id.get(info[0])+"\""+","+"\""+detail[0]+"\"", l2);
				
				
			}
		}
		
		 Iterator it = map.entrySet().iterator();
         while (it.hasNext()) {
       	  java.util.Map.Entry entry = (java.util.Map.Entry) it.next();
       	  
       	  Tool.write(".\\data\\TimeSeries_id", entry.getKey()+","+map.get(entry.getKey()).get(0)+","+map.get(entry.getKey()).get(1)+","+map.get(entry.getKey()).get(2));
       	
       	  }
	}

}
