package com.xhico.inspectorws;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@WebServlet(name = "Images", value = "/Images")
public class Images extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        try {

            // Get url param
            String url = request.getParameter("url");
            long timeStamp = Instant.now().toEpochMilli();
            String folderPath = "/opt/scripts/images/data/";
            String baseFile = url.replaceAll("[^a-zA-Z0-9]", "") + "_" + timeStamp;
            String jsonFilePath = folderPath + baseFile + ".json";

            // Get last log file if available
            boolean useCache = false;
            long epochFile = 0;
            List<String> contents = List.of(Objects.requireNonNull(new File(folderPath).list()));
            if (contents.size() != 0) {
                List<String> result = contents.stream()
                        .filter(word -> word.startsWith(url.replaceAll("[^a-zA-Z0-9]", ""))).sorted()
                        .collect(Collectors.toList());
                if (result.size() != 0) {
                    String filePath = result.get(result.size() - 1);
                    epochFile = Long.parseLong(filePath.split("_")[1].replace(".json", ""));
                    long delta = (timeStamp - epochFile) / 60; // Milli -> Seconds
                    if (delta <= 86400) {
                        useCache = true;
                        jsonFilePath = folderPath + url.replaceAll("[^a-zA-Z0-9]", "") + "_" + epochFile + ".json";
                    }
                }
            }

            if (!useCache) {
                // Set base command
                String siteURL = "--siteUrl=" + url;
                String jsonPath = "--jsonPath=" + jsonFilePath;
                List<String> base = Arrays.asList("python3", "/opt/scripts/images/Images.py", siteURL, jsonPath);
                List<String> cmd = new ArrayList<>(base);

                // Run Lighthouse Process
                ProcessBuilder builder = new ProcessBuilder(cmd);
                builder.redirectErrorStream(true);
                final Process process = builder.start();
                watch(process);

                // Wait until Process is finished
                process.waitFor();

                // Reads json file && add htmlReport
                String jsonContent = Files.readString(Paths.get(jsonFilePath));
                Gson gson = new Gson();
                Gson gsonPP = new GsonBuilder().setPrettyPrinting().create();
                JsonObject jsonObject = gson.fromJson(jsonContent, JsonObject.class);
                String jsonOutput = gsonPP.toJson(jsonObject);
                // Save json to file
                BufferedWriter writer = new BufferedWriter(new FileWriter(jsonFilePath));
                writer.write(jsonOutput);
                writer.close();
            }

            String jsonContent = Files.readString(Paths.get(jsonFilePath));
            Gson gson = new Gson();
            Gson gsonPP = new GsonBuilder().setPrettyPrinting().create();
            JsonObject jsonObject = gson.fromJson(jsonContent, JsonObject.class);
            jsonObject.addProperty("useCache", useCache);

            if (useCache) {
                SimpleDateFormat sdf = new SimpleDateFormat("EEE, MMM d 'at' HH:mm a z");
                String cacheDate = sdf.format(new Date(epochFile));
                jsonObject.addProperty("cacheDate", cacheDate);
            }
            String jsonOutput = gsonPP.toJson(jsonObject);

            // Return JSON Report
            out.println(jsonOutput);
        } catch (Exception ex) {
            out.println(ex);
        }
    }

    private static void watch(final Process process) {
        new Thread() {
            public void run() {
                BufferedReader input = new BufferedReader(new InputStreamReader(process.getInputStream()));
                String line = null;
                try {
                    while ((line = input.readLine()) != null) {
                        System.out.println(line);
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }.start();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }
}