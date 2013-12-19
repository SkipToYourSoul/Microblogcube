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

public class hottopiconly {


	
	
	public static void main(String[] args) throws IOException {

		
		Map<String,String> mood = new HashMap<String,String>();
		Map<String,String> id = new HashMap<String,String>();
		Map<String,Integer> rtcount = new HashMap<String,Integer>();
		
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
		
		File files=new File(".//data//mood");
		File[] fs=files.listFiles();
		
		for(File f:fs){
		
			FileInputStream fis0 = new FileInputStream(f);
			InputStreamReader isr0 = new InputStreamReader(fis0, "utf-8");
			BufferedReader br0 = new BufferedReader(isr0);
			
			String line0;
			
			while((line0 = br0.readLine()) != null){
				
				
					mood.put(line0, f.getName());
				
			}
			
		}
		FileInputStream fis1 = new FileInputStream(".//data//hottopicmood100");
		InputStreamReader isr1 = new InputStreamReader(fis1, "utf-8");
		BufferedReader br1 = new BufferedReader(isr1);
		
		String line1;
		
		while((line1 = br1.readLine()) != null){
			String[] info=line1.split("\t");
	        rtcount.put(info[1], Integer.valueOf(info[2]));
			
		
		}
		FileInputStream fis2 = new FileInputStream(".//data//hottopicmoodonly");
		InputStreamReader isr2 = new InputStreamReader(fis2, "utf-8");
		BufferedReader br2 = new BufferedReader(isr2);
		
		String line2;
		
		while((line2 = br2.readLine()) != null){
			String[] info=line2.split("\\|#\\|");
			/*if(mood.get(info[info.length-1])==null){
		    	//Tool.write(".\\non", info[info.length-1]);
		    	continue;
		    }*/
			Tool.write(".\\data\\hottopimoodconlyclean3", id.get(info[0])+"\t"+info[1]+"\t"+info[2]+"\t"+info[3]+"\t"+rtcount.get(info[1])+"\t"+info[4]+"\t"+info[5]+"\t"+info[10]+"\t"+mood.get(info[info.length-1]),true,"utf-8");
			    
			
			
		
		}
		}
			

}
