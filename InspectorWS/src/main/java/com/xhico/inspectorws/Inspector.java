/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.xhico.inspectorws;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

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
            System.out.println("\n# ----------------------------------- #");

            // Get Date
            LocalDateTime myDateObj = LocalDateTime.now();
            DateTimeFormatter myFormatObj = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
            String formattedDate = myDateObj.format(myFormatObj);
            System.out.println("Date: " + formattedDate);

            // Get url && lang && view from URL args
            String reqURI = request.getRequestURI();
            String url = request.getParameter("url");
            String lang = request.getParameter("lang");
            String token = request.getParameter("token");
            String edit = request.getParameter("edit");
            String view = request.getParameter("view");

            // Check if URL is passed as arg
            String mainURL = (!(url == null)) ? getFinalURL(new URL(url)).toString() : "null";
            url = (!(url == null)) ? url : "null";
            lang = (!(lang == null)) ? lang : "null";
            token = (!(token == null)) ? token : "null";
            edit = (!(edit == null)) ? edit : "null";
            view = (!(view == null)) ? view : "null";

            // Prints!
            System.out.println("reqURI - " + reqURI);
            System.out.println("url - " + url);
            System.out.println("mainURL - " + mainURL);
            System.out.println("lang - " + lang);
            System.out.println("token - " + token);
            System.out.println("edit - " + edit);
            System.out.println("view - " + view);

            // Set attributes mainURL && mainLang
            request.setAttribute("url", url);
            request.setAttribute("mainURL", mainURL);
            request.setAttribute("lang", lang);
            request.setAttribute("token", token);
            request.setAttribute("edit", edit);
            request.setAttribute("view", view);
            request.getRequestDispatcher("/index.jsp").forward(request, response);

            System.out.println("# ----------------------------------- #\n");
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }
    }

    public static URL getFinalURL(URL url) {
        try {
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setInstanceFollowRedirects(false);
            con.connect();
            int resCode = con.getResponseCode();
            if (resCode == HttpURLConnection.HTTP_SEE_OTHER || resCode == HttpURLConnection.HTTP_MOVED_PERM || resCode == HttpURLConnection.HTTP_MOVED_TEMP) {
                String Location = con.getHeaderField("Location");
                if (Location.startsWith("/")) {
                    Location = url.getProtocol() + "://" + url.getHost() + Location;
                }
                return getFinalURL(new URL(Location));
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return url;
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
