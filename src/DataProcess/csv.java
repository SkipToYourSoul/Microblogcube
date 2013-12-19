package DataProcess;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;

import Util.Tool;

public class csv {
	public static void main(String[] args) throws IOException {
	  FileInputStream fis = new FileInputStream(".//data//edge//7.txt");
	  InputStreamReader isr = new InputStreamReader(fis, "utf-8");
	  BufferedReader br = new BufferedReader(isr);
	
	  String line;

	  while((line = br.readLine()) != null){
		 String[] info=line.split("\t");

		 if(info.length==6){
			
			Tool.write(".//data//edge//7_2.txt", line,true,"utf-8");
			
		}
	
	  }
	}
}
