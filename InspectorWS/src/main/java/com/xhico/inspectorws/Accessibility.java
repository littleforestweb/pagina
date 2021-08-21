/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.xhico.inspectorws;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import org.json.JSONArray;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * @author xhico
 */
@WebServlet(name = "Accessibility", urlPatterns = {"/Accessibility"})
public class Accessibility extends HttpServlet {

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
            String timeStamp = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
            String folderPath = "/opt/node/data/codesniffer/";
            String baseFile = url.replaceAll("[^a-zA-Z0-9]", "") + "_" + timeStamp;
            String jsonFilePath = folderPath + baseFile + ".json";

            // Set base command
            String siteURL = "--siteUrl=" + url;
            String jsonPath = "--jsonPath=" + jsonFilePath;
            List<String> base = Arrays.asList("node", "/opt/node/scripts/HTML_CodeSniffer.js", siteURL, jsonPath);
            List<String> cmd = new ArrayList<>(base);

            // Run Lighthouse Process
            ProcessBuilder builder = new ProcessBuilder(cmd);
            builder.redirectErrorStream(true);
            final Process process = builder.start();
            watch(process);

            // Wait until Process is finished
            process.waitFor();


            // Get File Contents
            ArrayList<String> fileContent = getFileContent(jsonFilePath);

            // Initialize JSONObject and JSONArrays
            JSONObject mainObj = new JSONObject();
            JSONArray jaNotices = new JSONArray();
            JSONArray jaWarnings = new JSONArray();
            JSONArray jaErrors = new JSONArray();

            for (String line : fileContent) {
                if ((line.contains("[HTMLCS] Notice")) || (line.contains("[HTMLCS] Warning")) || (line.contains("[HTMLCS] Error"))) {

                    // Split the line "|" to get the various fields
                    String[] parts = line.split("\\|");
                    List<String> list = new ArrayList<>(Arrays.asList(parts));
                    list.remove("");

                    // Initialize fields
                    String type = list.get(0);
                    String guideline = list.get(1);
                    String tag = "null";
                    String message = "null";
                    String code = "null";

                    // Set type of info
                    if (type.contains("Notice")) {
                        type = "Notice";
                    } else if (type.contains("Warning")) {
                        type = "Warning";
                    } else {
                        type = "Error";
                    }

                    // If the tag, message or code exist -> parse
                    for (int idx = 2; idx < list.size(); idx++) {

                        // Get the text
                        String txt = list.get(idx);

                        // Check is only one word -> tag
                        Pattern wordPattern = Pattern.compile("\\w+");
                        Matcher wordMatcher = wordPattern.matcher(txt);
                        if (wordMatcher.matches()) {
                            tag = txt;
                        } else {
                            // Check is it's a piece of code
                            if (txt.startsWith("<") && txt.endsWith(">")) {
                                code = txt;
                            } else {
                                // Is message
                                message = txt;
                            }
                        }
                    }

                    // Add fields to JSONObject
                    JSONObject jo = new JSONObject();
                    jo.put("Type", type);
                    jo.put("Guideline", guideline);
                    jo.put("Tag", tag);
                    jo.put("Message", message);
                    jo.put("Code", code);

                    // Add JSONObject to respective JSONArray
                    if (type.equals("Notice")) {
                        jaNotices.put(jo);
                    } else if (type.equals("Warning")) {
                        jaWarnings.put(jo);
                    } else {
                        jaErrors.put(jo);
                    }

                }
            }

            // Add each JSONArray to main JSONObject
            mainObj.put("Notices", jaNotices);
            mainObj.put("Warnings", jaWarnings);
            mainObj.put("Errors", jaErrors);

            // Pretty Print JSON
            Gson gson = new Gson();
            Gson gsonPP = new GsonBuilder().setPrettyPrinting().create();
            JsonObject jsonObject = gson.fromJson(mainObj.toString(), JsonObject.class);
            String jsonOutput = gsonPP.toJson(jsonObject);

            // Return JSON Report
            System.out.println(jsonOutput);
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

        return result;
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

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">

    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request  servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException      if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
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
