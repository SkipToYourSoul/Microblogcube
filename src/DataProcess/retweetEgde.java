package DataProcess;

import java.io.BufferedReader;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
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

public class retweetEgde {
	private static final String regexMention = "\\\\@[\\w\u4e00-\u9fa5]*";
	private static final String regexMention1 = "@[\\w\u4e00-\u9fa5]*";

	public static void main(String[] args) throws IOException {
		
		
		Pattern patternMention = Pattern.compile(regexMention);
		Pattern patternMention1 = Pattern.compile(regexMention1);
		
        Map<String,String> id = new HashMap<String,String>();
        Map<String,String> mood = new HashMap<String,String>();
		Map<String,List<String>> map = new HashMap<String,List<String>>();
		Map<String,Map<String,Integer>> status = new HashMap<String,Map<String,Integer>>();
		
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
		
		FileInputStream fis1 = new FileInputStream(".\\data\\edge0902");
		InputStreamReader isr1 = new InputStreamReader(fis1, "utf-8");
		BufferedReader br1 = new BufferedReader(isr1);
		ArrayList<String>list=new ArrayList<String>();
		
		String line1;
	    //Tool.write(".//data//hottopicedge.txt", "EventId"+"\t"+"RTMid"+"\t"+"Retweeter"+"\t"+"Retweetee"+"\t"+"Time",true,"utf-8");
		int num=0;
	    while((line1 = br1.readLine()) != null){
	    	
			line1=line1.replaceAll("\\|#\\|", "\t");
			String[]info=line1.split("\t");
			
			int index=Integer.valueOf(id.get(info[0]))/15;
			
			if(!list.contains(info[0])){
				num=0;
				list.add(info[0]);
				//Tool.write(".//data//moodedge//"+index+".txt", "EventId"+"\t"+"id"+"\t"+"RTMid"+"\t"+"Retweeter"+"\t"+"Retweetee"+"\t"+"Time"+"\t"+"Mood",true,"utf-8"); 
			}
			
			
			Matcher matchMention = patternMention.matcher(info[2]);
			info[2] = matchMention.replaceAll("");
			Matcher matchMention1 = patternMention1.matcher(info[2]);
			info[2] = matchMention1.replaceAll("");
			Matcher matchMention3 = patternMention.matcher(info[3]);
			info[3] = matchMention3.replaceAll("");
			Matcher matchMention4 = patternMention1.matcher(info[3]);
			info[3] = matchMention4.replaceAll("");
			
			if(!info[3].equals("")&&!info[2].equals("")){
			num++;
			//Tool.write(".//data//moodedge//"+index+".txt", id.get(info[0])+"\t"+num+line1.substring(line1.indexOf("\t"),line1.lastIndexOf("\t"))+"\t"+mood.get(line1.substring(line1.lastIndexOf("\t")+1)),true,"utf-8"); 
		//System.out.println(line);
			Tool.write(".//data//edge//"+index+"_final.txt", id.get(info[0])+"\t"+num+"\t"+info[1]+"\t"+info[2]+"\t"+info[3]+"\t"+info[4],true,"utf-8"); 
	       }
			
	}
	}

}
