package DataExtraction;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import Util.Tool;

public class EventDataByFile {
	
	public static void main(String[] args) throws IOException {
	
		Map<String,String> id = new HashMap<String,String>();
		Map<String,List> text = new HashMap<String,List>();
	
		
	    
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
		
		File f=new File("F://EventData//");
		File[] files=f.listFiles();
	
		for(File file:files){
			FileInputStream fis1 = new FileInputStream(file);
	        InputStreamReader isr1 = new InputStreamReader(fis1, "utf-8");
	        BufferedReader br1 = new BufferedReader(isr1);
	    
	        String line1;
	        
	        while((line1 = br1.readLine()) != null){
	        	
	        	line1 = line1.replaceFirst("\t", "\\|#\\|");
	    	
	    	    if(line1.contains("|#|")){
	    	    	String[] info = line1.split("\\|#\\|");
	    	    	
                if(info.length>16&&!info[5].equals("转发微博")&&!info[5].equals("轉發微博")&&!info[5].equals("轉發微博。")&&!info[5].equals("转发微博。")){
                	
                	String time=info[4].substring(0,info[4].lastIndexOf("-"));
                	if(info[5].contains("//@")){
                		info[5]=info[5].substring(0,info[5].indexOf("//@"));
                		
                	}
                	/*if(text.containsKey(id.get(info[0]))){
                		List l=text.get(id.get(info[0]));
                		l.add(time+"\t"+info[5]);
                        text.put(id.get(info[0]), l);	
                	}else{
                	   List<String>l=new ArrayList<String>();
                	   l.add(time+"\t"+info[5]);
                	   text.put(id.get(info[0]),l);	
                	}*/
                
            	    Tool.write(".//data//month//"+id.get(info[0])+"-"+time, info[5]);
            	    }
	    	   }
            }
	        
	        
		}
		
		 /*Iterator it= text.entrySet().iterator();
         while (it.hasNext()) {
       	  java.util.Map.Entry entry = (java.util.Map.Entry) it.next();
       	  List<String> result=(List) entry.getValue();
       	  Collections.sort(result);
       	  
       	  for(int i=0;i<result.size();i++){
       	   Tool.write(".\\data\\result\\"+entry.getKey(), result.get(i));
      
       	  }
       	  }*/
	}
}
