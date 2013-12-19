import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.text.SimpleDateFormat;

import DB.DBOI;
import Model.Tweet;
import Model.User;


public class Insert {
    DBOI db = null;
    SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    public Insert()
    {
        db = new DBOI("Event");
    }

    public Insert(String dir)
    {
        run(dir);
    }
    public void run(String dir)
    {
        insertTweet(dir+File.separator+"Event");
        insertUser(dir+File.separator+"UserInfo");
        insertMood(dir+File.separator+"Mood");
        insertLocation(dir+File.separator+"Location");
    }
    
    public void insertTweet(String dataDir)
    {
        db.open();
        Tweet tweet = null;
        FileInputStream fis;
        InputStreamReader isr;
        BufferedReader br;
        String line = null;
        try {
            fis = new FileInputStream(dataDir);
            isr = new InputStreamReader(fis,"utf-8");
            br = new BufferedReader(isr);
            while((line = br.readLine()) != null)
            {
                line = line.replaceFirst("\t", "|#|");
                String[] list = line.split("\\|#\\|");
                //数据格式错误，跳过
                if(list.length<8)
                {
                    continue;
                }
                try {
                    tweet = new Tweet(list[0],list[1],list[2],inputFormat.parse(list[3]),
                            list[4],Integer.parseInt(list[5]),Integer.parseInt(list[6]),list[7],list[8]);
                    db.InsertTweet(tweet, false);
                } catch (NumberFormatException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                } catch (ParseException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }
            }
            db.insert("", true);
            br.close();
            isr.close();
            fis.close();
            
        }catch (FileNotFoundException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        db.close();
    }
    public void insertUser(String dataDir)
    {
        db.open();
        User user = null;
        String province = null;
        String city = null;
        FileInputStream fis;
        InputStreamReader isr;
        BufferedReader br;
        String line = null;
        try {
            fis = new FileInputStream(dataDir);
            isr = new InputStreamReader(fis,"utf-8");
            br = new BufferedReader(isr);
            while((line = br.readLine()) != null)
            {
                line = line.replaceFirst("\t", "|#|");
                String[] list = line.split("\\|#\\|");
                //数据格式错误，跳过
                if(list.length<11)
                {
                    continue;
                }
                try {
                    if(list[5].contains(" "))
                    {
                        province = list[5].substring(0,list[5].indexOf(" "));
                        city = list[5].substring(list[5].indexOf(" ")+1);
                    }else
                    {
                        province = list[5];
                        city = "";
                    }
                    user = new User(list[0],list[1],list[2],Boolean.parseBoolean(list[3]),
                            list[4],province,city,list[6],Integer.parseInt(list[7]),
                            Integer.parseInt(list[8]),Integer.parseInt(list[9]),
                            Integer.parseInt(list[10]),inputFormat.parse(list[11]));
                   db.InsertUser(user, false);
                } catch (NumberFormatException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                } catch (ParseException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }
            }
            db.insert("", true);
            br.close();
            isr.close();
            fis.close();
            
        }catch (FileNotFoundException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        db.close();
    }
    public void insertMood(String dataDir)
    {
        db.open();
        User user = null;
        String province = null;
        String city = null;
        String[] list = null;
        FileInputStream fis;
        InputStreamReader isr;
        BufferedReader br;
        String line = null;
        try {
            fis = new FileInputStream(dataDir);
            isr = new InputStreamReader(fis,"utf-8");
            br = new BufferedReader(isr);
            while((line = br.readLine()) != null)
            {
                line = line.replaceFirst("\t", "|#|");
                list = line.split("\\|#\\|");
                //数据格式错误，跳过
                if(list.length<3)
                {
                    continue;
                }
                try {
                    db.InsertMood(list[1],list[0],list[2],inputFormat.parse(list[3]), false);
                } catch (NumberFormatException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                } catch (ParseException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }
            }
            db.insert("", true);
            br.close();
            isr.close();
            fis.close();
            
        }catch (FileNotFoundException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        db.close();
    }
    public void insertLocation(String dataDir)
    {
        db.open();
        User user = null;
        String province = null;
        String city = null;
        String[] list = null;
        FileInputStream fis;
        InputStreamReader isr;
        BufferedReader br;
        String line = null;
        try {
            fis = new FileInputStream(dataDir);
            isr = new InputStreamReader(fis,"utf-8");
            br = new BufferedReader(isr);
            while((line = br.readLine()) != null)
            {
                line = line.replaceFirst("\t", "|#|");
                list = line.split("\\|#\\|");
                //数据格式错误，跳过
                if(list.length<2)
                {
                    continue;
                }
                try {
                    db.InsertLocation(list[1],list[0],inputFormat.parse(list[2]), false);
                } catch (NumberFormatException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                } catch (ParseException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }
            }
            db.insert("", true);
            br.close();
            isr.close();
            fis.close();
            
        }catch (FileNotFoundException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        db.close();
    }
}
