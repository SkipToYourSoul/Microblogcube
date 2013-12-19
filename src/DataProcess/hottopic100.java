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

public class hottopic100 {


	
	
	public static void main(String[] args) throws IOException {

		
		List list=new ArrayList();

		FileInputStream fis2 = new FileInputStream(".//data//hottopicmoodclean");
		InputStreamReader isr2 = new InputStreamReader(fis2, "gbk");
		BufferedReader br2 = new BufferedReader(isr2);
		
		String line2;
		int count=0;
		while((line2 = br2.readLine()) != null){
			String[] info=line2.split("\t");
			if(!list.contains(info[0])){
				count=1;
				list.add(info[0]);
				Tool.write(".\\data\\hottopicmood100", line2,true,"utf-8");
			}else{
				count++;
				if(count<=50){
					Tool.write(".\\data\\hottopicmood100", line2,true,"utf-8");
				}
			}
           
		
		}
		System.out.print(list.size());
	
	

		}
}
