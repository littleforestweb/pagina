/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.xhico.inspectorws;

import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

/**
 * @author xhico
 */
@WebServlet(name = "HTMLDownloader", urlPatterns = {"/HTMLDownloader"})
public class HTMLDownloader extends HttpServlet {

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
        response.setHeader("Access-Control-Allow-Origin", "*");

        try (PrintWriter out = response.getWriter()) {

            // Get search URL
            String url = request.getParameter("url");
            if (!(url.contains("https://"))) {
                url = "https://" + url;
            }

            // Get HTML from URL
            String html = Jsoup.connect(url).get().html();
            if (html.equals("")) {
                url = url.replace("https://", "http://");
                html = Jsoup.connect(url).get().html();
            }
            Document doc = Jsoup.parse(html, url);

            // Check possible broken href | src | srcset
            doc.select("a, link").forEach(e -> {
                e.attr("href", e.absUrl("href"));
            });
            doc.select("img, script").forEach(e -> {
                e.attr("src", e.absUrl("src"));
            });
            doc.select("source").forEach(e -> {
                e.attr("srcset", e.absUrl("srcset"));
            });

            // Return modified HTML
            out.print(doc);
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
