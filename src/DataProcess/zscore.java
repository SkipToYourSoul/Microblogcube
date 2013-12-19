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

public class zscore {

	public static void main(String[] args) throws IOException {
	   
	   Map<String,Double> average = new HashMap<String,Double>();
	   Map<String,Double> variance = new HashMap<String,Double>();
	   Map<String,Double> ratio = new HashMap<String,Double>();
	  
	   
	   FileInputStream fis0 = new FileInputStream("./data/average_ratio");
	   InputStreamReader isr0 = new InputStreamReader(fis0, "utf-8");
	   BufferedReader br0 = new BufferedReader(isr0);
		
	   String line;
     
	   while((line = br0.readLine()) != null){
			String[] info=line.split("\t");
			//System.out.println(info[3]);
			if(!average.containsKey(info[0])){
			
			    average.put(info[0], Double.valueOf(info[1]));
			}
		
		}
	   
	   FileInputStream fis1 = new FileInputStream("./data/variance_ratio");
	   InputStreamReader isr1 = new InputStreamReader(fis1, "utf-8");
	   BufferedReader br1 = new BufferedReader(isr1);
		
	   String line1;
     
	   while((line1 = br1.readLine()) != null){
			String[] info=line1.split("\t");
			//System.out.println(info[3]);
			if(!variance.containsKey(info[0])){
			
				variance.put(info[0], Double.valueOf(info[1]));
			}
		
		}
	   
	   FileInputStream fis3 = new FileInputStream("./data/ratio");
	   InputStreamReader isr3 = new InputStreamReader(fis3, "utf-8");
	   BufferedReader br3 = new BufferedReader(isr3);
		
	   String line3;
     
	   while((line3 = br3.readLine()) != null){
			String[] info=line3.split("\t");
			//System.out.println(info[3]);
			if(!ratio.containsKey(info[0])){
				Double zscore=(Double.valueOf(info[2])-average.get(info[1]))/variance.get(info[1]);
			    Tool.write("./data/zscore_ratio", info[0]+"\t"+info[1]+"\t"+zscore,true,"utf-8");
			}
		
		}
	}
}
