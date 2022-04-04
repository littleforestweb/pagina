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
@WebServlet(name = "Lighthouse", urlPatterns = {"/Lighthouse"})
public class Lighthouse extends HttpServlet {

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
        PrintWriter out = response.getWriter();

        try {
            // Set variables
            long timeStamp = Instant.now().toEpochMilli();
            String url = request.getParameter("url");
            String view = request.getParameter("view");
            String device = request.getParameter("device");
            String cache = request.getParameter("cache");
            String folderPath = "/opt/scripts/lighthouse/data/";
            String baseFile = url.replaceAll("[^a-zA-Z0-9]", "") + "_" + device + "_" + timeStamp;
            String jsonFilePath = folderPath + baseFile + ".json";
            String jsonReport = folderPath + baseFile + ".report" + ".json";
            String htmlReport = baseFile + ".report" + ".html";

            if (!url.equals("null")) {
                response.setContentType("application/json");

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
                    List<String> base = Arrays.asList("lighthouse", url, "--output", "json", "--output", "html",
                            "--output-path", jsonFilePath, "--chrome-flags='--headless --no-sandbox'", "--quiet");
                    List<String> cmd = new ArrayList<>(base);

                    // Set Device
                    if (device.equals("desktop")) {
                        cmd.add("--preset=desktop");
                    } else if (device.equals("mobile")) {
                        cmd.add("--form-factor=mobile");
                    }

                    // Run Lighthouse Process
                    ProcessBuilder builder = new ProcessBuilder(cmd);
                    builder.redirectErrorStream(true);
                    final Process process = builder.start();
                    watch(process);

                    // Wait until Process is finished
                    process.waitFor();

                    // Reads json file && add htmlReport
                    String jsonContent = Files.readString(Paths.get(jsonReport));
                    Gson gson = new Gson();
                    Gson gsonPP = new GsonBuilder().setPrettyPrinting().create();
                    JsonObject jsonObject = gson.fromJson(jsonContent, JsonObject.class);
                    jsonObject.addProperty("htmlReport", htmlReport);
                    String jsonOutput = gsonPP.toJson(jsonObject);

                    // Save json to file
                    BufferedWriter writer = new BufferedWriter(new FileWriter(jsonReport));
                    writer.write(jsonOutput);
                    writer.close();
                }

                String jsonContent = Files.readString(Paths.get(jsonReport));
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
            } else if (!(view.equals("null"))) {
                response.setContentType("text/html;charset=UTF-8");

                // Read HTML Report
                String htmlContent = Files.readString(Paths.get(folderPath + view));

                // Return HTML Report
                out.println(htmlContent);
            } else {
                // Ups!
                out.println("Wrong call");
            }
        } catch (Exception ex) {
            // Even More Ups!
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
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
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
