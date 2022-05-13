/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
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
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

/**
 * @author xhico
 */
@WebServlet(name = "Wappalyzer", urlPatterns = {"/Wappalyzer"})
public class Wappalyzer extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request  servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException      if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        try {

            // Get url param
            String url = request.getParameter("url");
            String cache = request.getParameter("cache");
            long timeStamp = Instant.now().toEpochMilli();
            String folderPath = "/opt/scripts/wappalyzer/data/";
            String baseFile = url.replaceAll("[^a-zA-Z0-9]", "") + "_" + timeStamp;
            String jsonFilePath = folderPath + baseFile + ".json";

            boolean useCache = false;
            long epochFile = 0;
            cache = (!(cache == null)) ? cache : "null";
            if (cache.equalsIgnoreCase("true") || cache.equalsIgnoreCase("null")) {
                // Get last log file if available
                List<String> contents = List.of(Objects.requireNonNull(new File(folderPath).list()));
                if (contents.size() != 0) {
                    List<String> result = contents.stream().filter(word -> word.startsWith(url.replaceAll("[^a-zA-Z0-9]", ""))).sorted().collect(Collectors.toList());
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
            }

            if (!useCache) {
                // Set base command
                String siteURL = "--siteUrl=" + url;
                String jsonPath = "--jsonPath=" + jsonFilePath;
                List<String> base = Arrays.asList("node", "/opt/scripts/wappalyzer/Wappalyzer.js", siteURL, jsonPath);
                List<String> cmd = new ArrayList<>(base);

                // Run Lighthouse Process
                ProcessBuilder builder1 = new ProcessBuilder(cmd);
                builder1.redirectErrorStream(true);
                final Process process1 = builder1.start();
                watch(process1);

                // Wait until Process is finished
                process1.waitFor();

                // Reads json file && add jsonPath
                String jsonContent = Files.readString(Paths.get(jsonFilePath));
                Gson gson = new Gson();
                Gson gsonPP = new GsonBuilder().setPrettyPrinting().create();
                JsonObject jsonObject = gson.fromJson(jsonContent, JsonObject.class);
                String jsonOutput = gsonPP.toJson(jsonObject);

                // Run CMS Scanner
                List<String> base2 = Arrays.asList("sh", "/opt/scripts/wappalyzer/cmseek.sh", url, baseFile);
                List<String> cmd2 = new ArrayList<>(base2);

                // Run CMS Scanner Process
                ProcessBuilder builder2 = new ProcessBuilder(cmd2);
                builder2.redirectErrorStream(true);
                final Process process2 = builder2.start();
                watch(process2);

                // Wait until Process is finished
                process2.waitFor();

                // Reads json file
                String CMSeekJsonPath = "/opt/scripts/wappalyzer/CMSeeK/Result/" + baseFile + "/cms.json";
                System.out.println(CMSeekJsonPath);
                String jsonContent2 = Files.readString(Paths.get(CMSeekJsonPath));
                Gson gson2 = new Gson();
                Gson gsonPP2 = new GsonBuilder().setPrettyPrinting().create();
                JsonObject jsonObject2 = gson2.fromJson(jsonContent2, JsonObject.class);
                String jsonOutput2 = gsonPP2.toJson(jsonObject2);

                // Save json to file
                BufferedWriter writer = new BufferedWriter(new FileWriter(jsonFilePath));
                writer.write("{'Wappalyzer':" + jsonOutput + ", 'CMSeeK':" + jsonOutput2 + "}");
                writer.close();
            }

            String jsonContent = Files.readString(Paths.get(jsonFilePath));
            Gson gson = new Gson();
            Gson gsonPP = new GsonBuilder().setPrettyPrinting().create();
            JsonObject jsonObject = gson.fromJson(jsonContent, JsonObject.class);
            jsonObject.addProperty("useCache", useCache);
            if (useCache) {
                SimpleDateFormat sdf = new SimpleDateFormat("EEE, MMM d 'at' HH:mm:ss a z");
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

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the
    // + sign on the left to edit the code.">

    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request  servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException      if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request  servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException      if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
