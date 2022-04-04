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
import java.util.stream.Collectors;

/**
 * @author xhico
 */
@WebServlet(name = "LanguageTool", urlPatterns = {"/LanguageTool"})
public class LanguageTool extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code> methods.
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
            String content = request.getParameter("content");
            String langCode = request.getParameter("langCode");
            String cache = request.getParameter("cache");
            long timeStamp = Instant.now().toEpochMilli();
            String folderPath = "/opt/scripts/languagetool/data/";
            String baseFile = url.replaceAll("[^a-zA-Z0-9]", "") + "_" + timeStamp;
            String jsonFilePath = folderPath + baseFile + ".json";
            String contentFilePath = "/opt/scripts/languagetool/content/" + baseFile + ".txt";

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
                // Save content to file
                BufferedWriter writer = new BufferedWriter(new FileWriter(contentFilePath));
                writer.write(content);
                writer.close();

                List<String> base = Arrays.asList("java", "-jar", "/opt/LangToolHTTPServer/languagetool-commandline.jar", "-l", langCode, "--json", "-eo", "--enablecategories", "TYPOS", contentFilePath);
                List<String> cmd = new ArrayList<>(base);

                // Run LanguageTool Process
                ProcessBuilder builder = new ProcessBuilder(cmd);
                builder.redirectErrorStream(true);
                final Process process = builder.start();
                watch(process, jsonFilePath);

                // Wait until Process is finished
                process.waitFor();

                // Reads json file && add htmlReport
                String jsonContent = getFileContent(jsonFilePath).get(0);
                Gson gson = new Gson();
                Gson gsonPP = new GsonBuilder().setPrettyPrinting().create();
                JsonObject jsonObject = gson.fromJson(jsonContent, JsonObject.class);
                String jsonOutput = gsonPP.toJson(jsonObject);

                // Save json to file
                writer = new BufferedWriter(new FileWriter(jsonFilePath));
                writer.write(jsonOutput);
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

    public static ArrayList<String> getFileContent(String filePath) throws FileNotFoundException, IOException {
        ArrayList<String> result = new ArrayList<>();
        BufferedReader br = new BufferedReader(new FileReader(filePath));
        while (br.ready()) {
            result.add(br.readLine());
        }
        br.close();

        return result;
    }

    private static void watch(final Process process, String jsonFilePath) {
        new Thread() {
            public void run() {
                BufferedReader input = new BufferedReader(new InputStreamReader(process.getInputStream()));
                String line = null;
                try {
                    while ((line = input.readLine()) != null) {
                        // Save content to file
                        BufferedWriter writer = new BufferedWriter(new FileWriter(jsonFilePath));
                        writer.write(line);
                        writer.close();
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
