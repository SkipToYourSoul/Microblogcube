package DataProcess;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;

import Util.Tool;

public class test {
	public static void main(String[] args) throws IOException {
		
		File f=new File(".//UserInfo_all");
		File[] files=f.listFiles();
		
		for(File f1:files){

			System.out.println(f1.getName());
		FileInputStream fis0 = new FileInputStream(f1);
		
		InputStreamReader isr0 = new InputStreamReader(fis0, "utf-8");
		BufferedReader br0 = new BufferedReader(isr0);
		
		String line;
     
		while((line = br0.readLine()) != null){
			String info[]=line.split("\t");
			
			if(info.length>1){
			String info2[]=info[1].split("\\|\\#\\|");
			
			if(info2.length>3){
			  Tool.write(".//userinfo", info[0]+"\t"+info2[3]+"\t"+info2[0]+"\t"+info2[2]);
			}
			}
		}
		}
	}

}
