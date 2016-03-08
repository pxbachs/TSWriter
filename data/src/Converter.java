import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;

import org.apache.commons.lang3.StringEscapeUtils;
import org.apache.commons.lang3.StringUtils;

import com.sun.org.apache.xalan.internal.xsltc.compiler.Pattern;

public class Converter {
	static String map_non_sign = " #$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^abcdefghijklmnopqrstuvwxyz{|}~aaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyAAAAAEEEEEEEEEEEIIIIIOOOOOOOOOOOOOOOOOUUUUUUUUUUUUUUUU_`aaaaaaaaaaaadAAAAAAAAAAAAD";

	static String map = " #$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^abcdefghijklmnopqrstuvwxyz{|}~àáảãạèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵÀÁẢÃẠÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴ_`ăằắẳẵặâầấẩẫậđĂẰẮẲẴẶÂẦẤẨẪẬĐ";

	static String specicalchar = " #$%&'()*+,-./:;<=>?@[\\]^{|}~";

	static final String GROUP = "{ \"id\": \"%s\",\"name\": \"%s\",	\"steps\": [%s]}";
	static final String STEP = "{	\"id\": \"%s\", \"type\": \"step\",	\"syntax\": \"%s\", \"rb\":\"%s\"}";

	public static void main(String[] args) {
		//convertIOS("ios/calabash_steps.rb", false);

		convertAndroid();
	}

	private static void convertAndroid() {
		String path = "android/calabash-defined";
		File[] rbFiles = new File(path).listFiles();
		StringBuffer buff = new StringBuffer();
		String line = "";
		String groupId = "";
		String groupName = "";
		String stepId = "";
		StringBuffer groupSteps = null;
		int stepIndex = 0;
		
		for (File file : rbFiles) {
			System.out.println(file.getName().substring(0, file.getName().length() - "_steps.rb".length()).replaceAll("_", " "));
			
			groupName = file.getName().substring(0, file.getName().length() - "_steps.rb".length()).replaceAll("_", " ").trim();
			groupId = toMSDOSStandard(groupName).toLowerCase();
			groupSteps = new StringBuffer();
			stepIndex = 0;
			groupName = StringUtils.capitalize(groupName);
			
			try {
				BufferedReader reader = new BufferedReader(new InputStreamReader(new FileInputStream(file), "utf8"));

				StringBuffer rbBuffer = new StringBuffer();
				while ((line = reader.readLine()) != null) {
					if (line.startsWith("#")) continue;
					if (line.trim().isEmpty()) while ((line = reader.readLine()).trim().isEmpty());
					if (groupSteps.length() > 0)
						groupSteps.append(",\n");
					rbBuffer = new StringBuffer();
					rbBuffer.append(line).append("\n");
					String rbLine = null;
					boolean isEnd = false;
					while ((rbLine = reader.readLine()) != null) {
						if (rbLine.trim().isEmpty() && isEnd)
							break;
						// System.out.println("#" + line);
						// System.out.println(rbLine);
						isEnd = rbLine.trim().equalsIgnoreCase("end");
						rbBuffer.append(rbLine).append("\n");
					}

					groupSteps.append(String.format(STEP, groupId + "-" + stepIndex, StringEscapeUtils.escapeJson(convertStepSyntax(line)), StringEscapeUtils.escapeJson(rbBuffer.toString())));
					stepIndex++;
				}
				if (groupId != null && !groupId.isEmpty()) {
					if (buff.length() > 0)
						buff.append(",\n");
					buff.append(String.format(GROUP, groupId, groupName, groupSteps.toString()));
				}
			} catch (Exception e) {
				System.out.println(file.getName());
				e.printStackTrace();
			}
		}
		System.out.println("[\n" + buff.toString() + "\n]");
	}

	private static String convertStepSyntax(String rbSyntax) {
		String tmp = rbSyntax;

		int index = tmp.indexOf("$/ do");
		String tt = "$/) do";

		if (tmp.indexOf(tt) > 0) {

		} else {
			tt = "$/ do";
		}
		//System.out.println(rbSyntax);

		

		if (tmp.endsWith("|")) {
			String tmp2 = tmp.substring(tmp.indexOf(tt) + 6);
			tmp2 = tmp2.substring(1, tmp2.length() - 1);
			// System.out.println();
			tmp2 = tmp2.trim().replace("|", "");
			String[] l = tmp2.split(",");

			// tmp = tmp.replace("([^\\\"]*)", "Some Text Here");
			if (l.length > 0) {
				int i1, i2;
				int count = l.length;
				
				while (count > 0) {
					String sp = "([^\\\"]*)";
					i1 = tmp.indexOf(sp);
					if (i1 == -1) {
						sp = "([^\"]*)";
						i1 = tmp.indexOf(sp);
					}
					
					i2 = tmp.indexOf("(\\d+)");

					if (i1 > 0) {
						if (i2 > 0) {
							if (i1 < i2)
								tmp = StringUtils.replaceOnce(tmp, sp, l[l.length - count].trim().toUpperCase());
							else
								tmp = StringUtils.replaceOnce(tmp, "(\\d+)", l[l.length - count].trim().toUpperCase());
						} else
							tmp = StringUtils.replaceOnce(tmp, sp, l[l.length - count].trim().toUpperCase());
					} else
						tmp = StringUtils.replaceOnce(tmp, "(\\d+)", l[l.length - count].trim().toUpperCase());
					count--;
				}
			}
		}
		
		System.out.println("@@@@\n" + tmp +"\t******\t" + tt + "\n@@@@@@@@@@@@");
		tmp = tmp.substring(0, tmp.indexOf(tt));
		tmp = tmp.replace("(/^I", " I");
		tmp = tmp.replace("/^I", "I");
		tmp = tmp.replace("(?:press|touch)", "touch");
		tmp = tmp.replace("(?:input|text)", "input");
		
		//System.out.println(tmp);
		return tmp;
	}

	private static void convertIOS(String file, boolean isRaw) {
		StringBuffer buff = new StringBuffer();
		try {
			BufferedReader reader = new BufferedReader(new InputStreamReader(new FileInputStream(new File(file)), "utf8"));
			String line = "";
			String groupId = "";
			String groupName = "";
			String stepId = "";
			StringBuffer groupSteps = null;
			int stepIndex = 0;
			StringBuffer rbBuffer = new StringBuffer();
			while ((line = reader.readLine()) != null) {
				// System.out.println("$" + line);
				if (line.startsWith("###")) {
					if (groupId != null && !groupId.isEmpty()) {
						if (buff.length() > 0)
							buff.append(",\n");
						buff.append(String.format(GROUP, groupId, groupName, groupSteps.toString()));
					}
					groupName = line.replace("###", "").trim();
					groupId = toMSDOSStandard(groupName).toLowerCase();
					groupSteps = new StringBuffer();
					stepIndex = 0;
				} else if (line.isEmpty() || line.startsWith("#")) {

				} else {
					if (groupSteps.length() > 0)
						groupSteps.append(",\n");
					rbBuffer = new StringBuffer();
					rbBuffer.append(line).append("\n");
					String rbLine = null;
					while ((rbLine = reader.readLine()) != null) {
						if (rbLine.trim().isEmpty())
							break;
						// System.out.println("#" + line);
						// System.out.println(rbLine);
						rbBuffer.append(rbLine).append("\n");
					}

					groupSteps.append(String.format(STEP, groupId + "-" + stepIndex, StringEscapeUtils.escapeJson(convertStepSyntax(line)), StringEscapeUtils.escapeJson(rbBuffer.toString())));
					stepIndex++;
				}

			}
			if (groupId != null && !groupId.isEmpty()) {
				if (buff.length() > 0)
					buff.append(",\n");
				buff.append(String.format(GROUP, groupId, groupName, groupSteps.toString()));
			}
			System.out.println("[\n" + buff.toString() + "\n]");
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
