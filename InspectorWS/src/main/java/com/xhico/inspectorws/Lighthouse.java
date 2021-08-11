/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.xhico.inspectorws;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @author xhico
 */
@WebServlet(name = "Lighthouse", urlPatterns = {"/Lighthouse"})
public class Lighthouse extends HttpServlet {

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
        try (PrintWriter out = response.getWriter()) {
            // Set variables
            String timeStamp = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
            String url = request.getParameter("url");
            String view = request.getParameter("view");
            String device = request.getParameter("device");
            String folderPath = "/root/lighthouse/";
            String baseFile = url.replaceAll("[^a-zA-Z0-9]", "") + "_" + timeStamp;
            String jsonFilePath = folderPath + baseFile + ".json";

            try {
                if (!url.equals("null")) {
                    response.setContentType("application/json");

                    // Set base command
                    List<String> base = Arrays.asList("lighthouse", url, "--output", "json", "--output", "html", "--output-path", jsonFilePath, "--chrome-flags='--headless --no-sandbox'", "--quiet");
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

                    // Reads json file && add jsonPath
                    String jsonReport = folderPath + baseFile + ".report" + ".json";
                    String htmlReport = baseFile + ".report" + ".html";
                    String jsonContent = Files.readString(Paths.get(jsonReport));
                    Gson gson = new Gson();
                    Gson gsonPP = new GsonBuilder().setPrettyPrinting().create();
                    JsonObject jsonObject = gson.fromJson(jsonContent, JsonObject.class);
                    jsonObject.addProperty("htmlReport", htmlReport);
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
