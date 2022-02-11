/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.xhico.inspectorws;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.SecureRandom;
import java.text.SimpleDateFormat;
import java.util.Base64;
import java.util.Date;


/**
 * @author xhico
 */
@WebServlet(name = "GetToken", urlPatterns = {"/GetToken"})
public class GetToken extends HttpServlet {

    private static final SecureRandom secureRandom = new SecureRandom();
    private static final Base64.Encoder base64Encoder = Base64.getUrlEncoder();

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
        response.setContentType("text/html;charset=UTF-8");

        try (PrintWriter out = response.getWriter()) {

            // Get params
            String accountId = request.getParameter("accountId");
            String loginUrl = request.getParameter("loginUrl");
            String username = request.getParameter("username");
            String usernameSelector = request.getParameter("usernameSelector");
            String password = request.getParameter("password");
            String passwordSelector = request.getParameter("passwordSelector");
            String submitBtn = request.getParameter("submitBtn");
//            System.out.println("accountId: " + accountId);
//            System.out.println("loginUrl: " + loginUrl);
//            System.out.println("username: " + username);
//            System.out.println("usernameSelector: " + usernameSelector);
//            System.out.println("password: " + password);
//            System.out.println("passwordSelector: " + passwordSelector);
//            System.out.println("submitBtn: " + submitBtn);

            // Generate Token
            String token = generateNewToken();

            // Set JSON Token
            JSONObject jo = new JSONObject();
            jo.put("token", token);

            // Pretty Print JSON
            Gson gson = new Gson();
            Gson gsonPP = new GsonBuilder().setPrettyPrinting().create();
            JsonObject jsonObject = gson.fromJson(jo.toString(), JsonObject.class);
            String jsonOutput = gsonPP.toJson(jsonObject);
            System.out.println(jsonOutput);

            // Return JSON Report
            out.println(jsonOutput);
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }
    }


    public static String generateNewToken() {
        byte[] randomBytes = new byte[24];
        secureRandom.nextBytes(randomBytes);
        return base64Encoder.encodeToString(randomBytes);
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
