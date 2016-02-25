import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;

import org.apache.commons.lang3.StringEscapeUtils;
import org.apache.commons.lang3.StringUtils;


public class Converter {
	static String map_non_sign = " #$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^abcdefghijklmnopqrstuvwxyz{|}~aaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyAAAAAEEEEEEEEEEEIIIIIOOOOOOOOOOOOOOOOOUUUUUUUUUUUUUUUU_`aaaaaaaaaaaadAAAAAAAAAAAAD";

	static String map = " #$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^abcdefghijklmnopqrstuvwxyz{|}~àáảãạèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵÀÁẢÃẠÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴ_`ăằắẳẵặâầấẩẫậđĂẰẮẲẴẶÂẦẤẨẪẬĐ";

	static String specicalchar = " #$%&'()*+,-./:;<=>?@[\\]^{|}~";

	static final String GROUP = "{ \"id\": \"%s\",\"name\": \"%s\",	\"steps\": [%s]}";
	static final String STEP = "{	\"id\": \"%s\",	\"syntax\": \"%s\"}";

	public static void main(String[] args) {
		convert("ios/steps_raw.txt");
	}

	private static void convert(String file) {
		StringBuffer buff = new StringBuffer();
		try {
			BufferedReader reader = new BufferedReader(new InputStreamReader(
					new FileInputStream(new File(file)), "utf8"));
			String line = "";
			String groupId = "";
			String groupName = "";
			String stepId = "";
			StringBuffer groupSteps = null;
			int stepIndex = 0;
			while ((line = reader.readLine()) != null) {
				if (line.startsWith("###")) {
					if (groupId != null && !groupId.isEmpty()) {
						if (buff.length() > 0) buff.append(",\n");
						buff.append(String.format(GROUP, groupId, groupName, groupSteps.toString()));
					}
					groupName = line.replace("###", "").trim();
					groupId = toMSDOSStandard(groupName).toLowerCase();
					groupSteps = new StringBuffer();
					stepIndex = 0;
				} else if (line.isEmpty() || line.startsWith("#")) {
					
				} else {
					if (groupSteps.length() > 0) groupSteps.append(",\n");
					groupSteps.append(String.format(STEP, groupId +"-" + stepIndex, line.replace("\\", "\\\\").replace("\"", "\\\"")));
					stepIndex++;
				}

			}
			System.out.println("[\n"+buff.toString()+"\n]");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public static String toMSDOSStandard(String s) {
		if (s == null || s.equals(""))
			return "";

		StringBuffer tmp = new StringBuffer();
		int index = 0;
		for (int i = 0; i < s.length(); i++)
			if (s.charAt(i) == '\n')
				tmp.append('\n');
			else {
				index = map.indexOf(s.charAt(i));
				if (index < 0)
					index = 0;
				if (specicalchar.indexOf(s.charAt(i)) == -1)
					tmp.append(map_non_sign.charAt(index));
			}

		return tmp.toString();
	}
}
