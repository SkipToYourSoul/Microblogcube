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
import java.util.Map.Entry;

import Util.Tool;

public class AvgVair {
	public static void tranform2Ratio() throws NumberFormatException,
			IOException {
		FileInputStream fis0 = new FileInputStream("./data/eventlocation.txt");
		InputStreamReader isr0 = new InputStreamReader(fis0, "utf-8");
		BufferedReader br0 = new BufferedReader(isr0);
		String line;
		int eventId = 1;
		HashMap<String, Double> districtCounters = new HashMap<String, Double>();
		double sum = 0.0;
		while ((line = br0.readLine()) != null) {
			String[] info = line.split("\t");
			// System.out.println(info[3]);
			int tempID = Integer.parseInt(info[0]);
			if (tempID != eventId) {
				// 计算比例
				for (Entry<String, Double> entry : districtCounters.entrySet()) {
					Tool.write("./data/ratio", eventId + "\t" + entry.getKey()
							+ "\t" + entry.getValue() / sum, true, "utf-8");
				}
				eventId = tempID;
				sum = 0.0;
				districtCounters.clear();
			} else {
				sum += Double.parseDouble(info[3]);
				districtCounters.put(info[1], Double.parseDouble(info[3]));
			}
		}

		if (!districtCounters.isEmpty()) {
			for (Entry<String, Double> entry : districtCounters.entrySet()) {
				Tool.write("./data/ratio", eventId + "\t" + entry.getKey()
						+ "\t" + entry.getValue() / sum, true, "utf-8");
			}
		}
	}

	public static void main(String[] args) throws IOException {
		tranform2Ratio();
		Map<String, List<Double>> average = new HashMap<String, List<Double>>();

		FileInputStream fis0 = new FileInputStream("./data/ratio");
		InputStreamReader isr0 = new InputStreamReader(fis0, "utf-8");
		BufferedReader br0 = new BufferedReader(isr0);

		String line;

		while ((line = br0.readLine()) != null) {
			String[] info = line.split("\t");
			// System.out.println(info[3]);
			if (!average.containsKey(info[1])) {
				List l = new ArrayList();
				l.add(Double.valueOf(info[2]));
				average.put(info[1], l);
			} else {
				List l = average.get(info[1]);
				l.add(Double.valueOf(info[2]));
				average.put(info[1], l);
			}

		}

		Iterator<Entry<String, List<Double>>> it2 = average.entrySet()
				.iterator();
		HashMap<String, Double> avgMap = new HashMap<String, Double>();
		HashMap<String, Double> varMap = new HashMap<String, Double>();
		while (it2.hasNext()) {
			Entry<String, List<Double>> entry = it2.next();
			List<Double> l = entry.getValue();
			double sum = 0.0;
			for (double ratio : l)
				sum += ratio;
			double avg = sum / l.size();
			avgMap.put(entry.getKey(), avg);
			Tool.write("./data/average_ratio", entry.getKey() + "\t" + avg,
					true, "utf-8");

			sum = 0;
			for (int j = 0; j < l.size(); j++)
				sum += (l.get(j) - avg) * (l.get(j) - avg);
			sum /= l.size();
			sum = Math.sqrt(sum);
			varMap.put(entry.getKey(), sum);
			Tool.write("./data/variance_ratio", entry.getKey() + "\t" + sum,
					true, "utf-8");
		}
	}
}
