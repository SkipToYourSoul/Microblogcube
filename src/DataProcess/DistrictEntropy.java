package DataProcess;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map.Entry;

import Util.Tool;

public class DistrictEntropy {
	public static void calcZscoreEntropy(String[] args)
			throws NumberFormatException, IOException {
		FileInputStream fis0 = new FileInputStream("./data/zscore_ratio");
		InputStreamReader isr0 = new InputStreamReader(fis0, "utf-8");
		BufferedReader br0 = new BufferedReader(isr0);
		String line;
		int eventId = 1;
		HashMap<String, Double> districtRatios = new HashMap<String, Double>();
		while ((line = br0.readLine()) != null) {
			String[] info = line.split("\t");
			// System.out.println(info[3]);
			int tempID = Integer.parseInt(info[0]);
			if (tempID != eventId) {
				// 计算比例
				double entropy = 0.0;
				for (Entry<String, Double> entry : districtRatios.entrySet()) {
					entropy = entry.getValue() * Math.log(entry.getValue());
				}
				entropy = 0 - entropy;
				Tool.write("./data/entropy", eventId + "\t" + entropy, true,
						"utf-8");
				eventId = tempID;
				districtRatios.clear();
			} else {
				districtRatios.put(info[1], Double.parseDouble(info[2]));
			}
		}

		double entropy = 0.0;
		for (Entry<String, Double> entry : districtRatios.entrySet()) {
			entropy = entry.getValue() * Math.log(entry.getValue());
		}
		entropy = 0 - entropy;
		Tool.write("./data/entropy", eventId + "\t" + entropy, true, "utf-8");
	}

	public static void calcRatioEntropy(String[] args)
			throws NumberFormatException, IOException {
		FileInputStream fis0 = new FileInputStream("./data/ratio");
		InputStreamReader isr0 = new InputStreamReader(fis0, "utf-8");
		BufferedReader br0 = new BufferedReader(isr0);
		String line;
		int eventId = 1;
		HashMap<String, Double> districtRatios = new HashMap<String, Double>();
		while ((line = br0.readLine()) != null) {
			String[] info = line.split("\t");
			// System.out.println(info[3]);
			int tempID = Integer.parseInt(info[0]);
			if (tempID != eventId) {
				// 计算比例
				double entropy = 0.0;
				for (Entry<String, Double> entry : districtRatios.entrySet()) {
					entropy = entry.getValue() * Math.log(entry.getValue());
				}
				entropy = 0 - entropy;
				Tool.write("./data/ratio_entropy", eventId + "\t" + entropy,
						true, "utf-8");
				eventId = tempID;
				districtRatios.clear();
			} else {
				districtRatios.put(info[1], Double.parseDouble(info[2]));
			}
		}

		double entropy = 0.0;
		for (Entry<String, Double> entry : districtRatios.entrySet()) {
			entropy = entry.getValue() * Math.log(entry.getValue());
		}
		entropy = 0 - entropy;
		Tool.write("./data/ratio_entropy", eventId + "\t" + entropy, true,
				"utf-8");
	}

	public static void main(String[] args) throws NumberFormatException,
			IOException {
		calcRatioEntropy(args);
	}
}
