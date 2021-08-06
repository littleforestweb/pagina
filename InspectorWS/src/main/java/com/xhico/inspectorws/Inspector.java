/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.xhico.inspectorws;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @author xhico
 */
@WebServlet(name = "Inspector", urlPatterns = {"/Inspector"})
public class Inspector extends HttpServlet {

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

            // Get url && lang from params
            String url = request.getParameter("url");
            String lang = request.getParameter("lang");

            // Initialize mainURL && mainLang variables
            String mainURL;
            String mainLang;
            int code = -1;

            // Check if there is a url or not
            if (url == null) {
                mainURL = "null";
                mainLang = "null";
            } else {
                String[] searchUrl = url.split("://");

                if (url.contains("http")) {
                    if (searchUrl[0].equals("http")) {
                        url = "https://" + searchUrl[1];
                    }
                } else {
                    url = "https://" + url;
                }

                // Get response code HTTPS
                String[] baseURL = url.split("://");
                try {
                    URL myURL = new URL(url);
                    HttpURLConnection connect = (HttpURLConnection) myURL.openConnection();
                    code = connect.getResponseCode();
                } catch (Exception ex) {
                    try {
                        url = "http://" + baseURL[1];
                        URL myURL = new URL(url);
                        HttpURLConnection connect = (HttpURLConnection) myURL.openConnection();
                        code = connect.getResponseCode();
                    } catch (Exception ex_) {
                        code = -1;
                    }
                }

                // Connect to the URL
                mainURL = url;
                mainLang = lang;
            }

            // Set attributes mainURL && mainLang
            request.setAttribute("mainURL", mainURL);
            request.setAttribute("mainLang", mainLang);
            request.setAttribute("URLCode", code);
            request.getRequestDispatcher("/index.jsp").forward(request, response);
        }
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
