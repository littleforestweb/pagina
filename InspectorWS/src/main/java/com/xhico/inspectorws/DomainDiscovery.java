/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.xhico.inspectorws;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.json.JSONArray;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

/**
 * @author xhico
 */
@WebServlet(name = "DomainDiscovery", urlPatterns = {"/DomainDiscovery"})
public class DomainDiscovery extends HttpServlet {

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
            URI uri = new URI(url);
            String domain = uri.getHost();
            url = domain.startsWith("www.") ? domain.substring(4) : domain;
            long timeStamp = Instant.now().toEpochMilli();
            String folderPath = "/opt/scripts/domaindiscovery/data/";
            String baseFile = url.replaceAll("[^a-zA-Z0-9]", "") + "_" + timeStamp;
            String jsonFilePath = folderPath + baseFile + ".json";


            boolean useCache = false;
            long epochFile = 0;
            cache = (!(cache == null)) ? cache : "null";
            if (cache.equalsIgnoreCase("true") || cache.equalsIgnoreCase("null")) {
                // Get last log file if available
                List<String> contents = List.of(Objects.requireNonNull(new File(folderPath).list()));
                if (contents.size() != 0) {
                    String finalUrl = url;
                    List<String> result = contents.stream().filter(word -> word.startsWith(finalUrl.replaceAll("[^a-zA-Z0-9]", ""))).sorted().collect(Collectors.toList());
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
                List<String> base = Arrays.asList("sh", "/opt/scripts/domaindiscovery/DomainDiscovery.sh", jsonFilePath, url);
                List<String> cmd = new ArrayList<>(base);

                // Run Cookies Process
                ProcessBuilder builder = new ProcessBuilder(cmd);
                builder.redirectErrorStream(true);
                final Process process = builder.start();
                watch(process);

                // Wait until Process is finished
                process.waitFor();
            }

            Gson gson = new Gson();
            Gson gsonPP = new GsonBuilder().setPrettyPrinting().create();
            String jsonContent = Files.readString(Paths.get(jsonFilePath));

            // Remove Duplicated name values
            JSONArray jsonContentsArray = new JSONArray(jsonContent);
            Set<String> name_values = new HashSet<>();
            JSONArray tempArray = new JSONArray();
            for (int i = 0; i < jsonContentsArray.length(); i++) {
                String name_value = jsonContentsArray.getJSONObject(i).getString("name_value");
                if (!(name_values.contains(name_value))) {
                    name_values.add(name_value);
                    tempArray.put(jsonContentsArray.getJSONObject(i));
                }
            }
            jsonContentsArray = tempArray;

            jsonContent = "{'domains':" + jsonContentsArray + "}";
            JsonObject jsonObject = gson.fromJson(jsonContent, JsonObject.class);
            jsonObject.addProperty("useCache", useCache);
            jsonObject.addProperty("host", url);
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
