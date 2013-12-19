package DataAnalysis;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Properties;
import java.util.Set;

import Util.Tool;
import edu.stanford.nlp.ie.crf.CRFClassifier;
import edu.stanford.nlp.ling.CoreLabel;

public class HotKeyword {
    protected String inputDir = null;
    protected String stopwordPath = null;
    private static String separator = "|#|";
    protected Set<String> stopwordSet = new HashSet<String>();
    public static void main(String[] args)
    {
        
    }
    public void run()
    {
        readStopword();
        //cleanData();
        splitWord();
        hotKeyword();
    }
    protected void readStopword()
    {
        File file = new File(stopwordPath);
        if(!file.exists())
        {
            System.out.println("stopword file did not find");
            return; 
        }
        FileInputStream fis;
        InputStreamReader isr;
        BufferedReader br;
        String line = null;
        try {
            fis = new FileInputStream(file);
            isr = new InputStreamReader(fis,"utf-8");
            br = new BufferedReader(isr);
            while((line = br.readLine()) != null)
            {
                if (!stopwordSet.contains(line) && !line.equals(""))
                {
                    stopwordSet.add(line);
                }
            }
            fis.close();
            isr.close();
            br.close();
        } catch (FileNotFoundException e) {
            // TODO Auto-generated catch block
            System.err.println(e.getMessage());
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            // TODO Auto-generated catch block
            System.err.println(e.getMessage());
            e.printStackTrace();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            System.err.println(e.getMessage());
            e.printStackTrace();
        }
    }
    protected void cleanData()
    {
        ArrayList<String> resultList = new ArrayList<String>();
        File file = new File(this.inputDir+File.separator+"inputFile");
        if(!file.exists())
        {
            System.out.println("clean input file did not find");
            return; 
        }
        FileInputStream fis;
        InputStreamReader isr;
        BufferedReader br;
        String line = null;
        try {
            //File[] fileList = f.listFiles();
            //for(File file: fileList)
            {
                System.out.println(file.getName());
                fis = new FileInputStream(file);
                isr = new InputStreamReader(fis,"utf8");
                br = new BufferedReader(isr);
                while((line = br.readLine()) != null)
                {
                    String key = line.substring(0, line.indexOf("\t"));
                    String record = line.substring(line.indexOf("\t")+1);
                    //去除数字
                    record = record.replaceAll(" [0-9]* ", " ");
                    //清除日文
                    record = record.replaceAll("[ ][[\\u0800-\\u4e00]*||[\\x3130-\\x318F]*||[\\xAC00-\\xD7A3]*]+[ ]", " ");
                    
                    for(String stopword:stopwordSet)
                    {
                        if(record.contains(" "+stopword+" "))
                        {
                            record = record.replace(" "+stopword+" ", " ");
                        }
                    }
                    resultList.add(key+"\t"+record);
                    
                }
                fis.close();
                isr.close();
                br.close();
            }
        } catch (FileNotFoundException e) {
            // TODO Auto-generated catch block
            System.err.println(e.getMessage());
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            // TODO Auto-generated catch block
            System.err.println(e.getMessage());
            e.printStackTrace();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            System.err.println(e.getMessage());
            e.printStackTrace();
        }
        Tool.write(this.inputDir+File.separator+"cleanData", resultList,true,"utf8");
        resultList.clear();
    }
    protected void splitWord()
    {
        Properties props = new Properties();
        props.setProperty("sighanCorporaDict", "dict");
        // props.setProperty("NormalizationTable", "data/norm.simp.utf8");
        // props.setProperty("normTableEncoding", "UTF-8");
        // below is needed because CTBSegDocumentIteratorFactory accesses it
        props.setProperty("serDictionary","dict/dict-chris6.ser.gz");
        props.setProperty("testFile", "test.txt");
        props.setProperty("inputEncoding", "UTF-8");
        props.setProperty("sighanPostProcessing", "true");

        CRFClassifier<CoreLabel> classifier = new CRFClassifier<CoreLabel>(props);
        classifier.loadClassifierNoExceptions("dict/ctb.gz", props);
        // flags must be re-set after data is loaded
        classifier.flags.setProperties(props);
        FileInputStream fis;
        InputStreamReader isr;
        BufferedReader br;
        String line = null;
        ArrayList<String> resultList = new ArrayList<String>();
        try {
            File inputFile = new File(this.inputDir+File.separator+"input");
            if(!inputFile.exists() || !inputFile.isDirectory())
            {
                System.out.println("seg input file did not find or seg input is not dir");
                return;
            }
            //File[] fileList = new File("."+File.separator+"input").listFiles();
            File[] fileList = inputFile.listFiles();
            for(File file: fileList)
            {
                System.out.println(file.getName());
                fis = new FileInputStream(file);
                isr = new InputStreamReader(fis,"utf-8");
                br = new BufferedReader(isr);
                
                while((line = br.readLine()) != null)
                {
                    String key = line.substring(0, line.indexOf("\t"));
                    String record = line.substring(line.indexOf("\t")+1);
                    
                    //去除url
                    if (record.contains("http://"))
                    {
                        record =  record.replaceAll("http://*.*/\\w*", "");
                    }
                    if(record.length() > 7640000)
                    {
                        continue;
                    }
                    record = record.replaceAll("\\pP|\\pS|\\pC|\\pM", "");
                    
                    record = classifier.apply(record);
                    //clean the stop word and the num
                    //去除数字
                    record = record.replaceAll(" [0-9]* ", " ");
                    //清除日文
                    record = record.replaceAll("[ ][[\\u0800-\\u4e00]*||[\\x3130-\\x318F]*||[\\xAC00-\\xD7A3]*]+[ ]", " ");
                    
                    for(String stopword:stopwordSet)
                    {
                        if(record.contains(" "+stopword+" "))
                        {
                            record = record.replace(" "+stopword+" ", " ");
                        }
                    }
                    ;
                    //不写入空的内容
                    //System.out.println(temp);
                    resultList.add(key+"|#|"+record);
                    
                }
                br.close();
                isr.close();
                fis.close();
                Tool.write("."+File.separator+"output"+File.separator+"segData",resultList,true,"utf8");
                resultList.clear();
            }
        }catch (FileNotFoundException e) {
         // TODO Auto-generated catch block
            System.err.println(e.getMessage());
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            // TODO Auto-generated catch block
            System.err.println(e.getMessage());
            e.printStackTrace();
        }  
        catch (IOException e) {
            // TODO Auto-generated catch block
            System.err.println(e.getMessage());
            e.printStackTrace();
        }
        
    }
    protected void hotKeyword()
    {
        Map<String,Integer> keywordCountMap = new HashMap<String,Integer>();
        FileInputStream fis;
        InputStreamReader isr;
        BufferedReader br;
        String line = null;
        ArrayList<String> resultList = new ArrayList<String>();
        try {
            File inputFile = new File(this.inputDir+File.separator+"segData");
            if(!inputFile.exists() || !inputFile.isDirectory())
            {
                System.out.println("seg input file did not find or seg input is not dir");
                return;
            }
            //File[] fileList = new File("."+File.separator+"input").listFiles();
            File[] fileList = inputFile.listFiles();
            for(File file: fileList)
            {
                System.out.println(file.getName());
                fis = new FileInputStream(file);
                isr = new InputStreamReader(fis,"utf-8");
                br = new BufferedReader(isr);
                
                while((line = br.readLine()) != null)
                {
                    String key = line.substring(0, line.indexOf("\t"));
                    //key format
                    String record = line.substring(line.indexOf("\t")+1);
                    String[] list = record.split(" ");
                    for(String keyword:list)
                    {
                        if(keywordCountMap.containsKey(key+this.separator+keyword))
                        {
                            int temp = keywordCountMap.get(key+this.separator+keyword);
                            keywordCountMap.put(key+this.separator+keyword, ++temp);
                        }
                        else
                        {
                            keywordCountMap.put(key+this.separator+keyword,new Integer(1));
                        }
                    }
                    
                }
                br.close();
                isr.close();
                fis.close();
            }
        }catch (FileNotFoundException e) {
         // TODO Auto-generated catch block
            System.err.println(e.getMessage());
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            // TODO Auto-generated catch block
            System.err.println(e.getMessage());
            e.printStackTrace();
        }  
        catch (IOException e) {
            // TODO Auto-generated catch block
            System.err.println(e.getMessage());
            e.printStackTrace();
        }
        Iterator iterator = keywordCountMap.entrySet().iterator();
        while(iterator.hasNext())
        {
            Entry<String,Integer> entry = (Entry<String, Integer>) iterator.next();
            String key = entry.getKey();
            int value = entry.getValue();
            resultList.add(key+this.separator+value);
        }
        Tool.write("."+File.separator+"output"+File.separator+"result",resultList,true,"utf8");
        resultList.clear();
    }
}
