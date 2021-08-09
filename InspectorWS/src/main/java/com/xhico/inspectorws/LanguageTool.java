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

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import org.json.JSONArray;
import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.nodes.TextNode;
import org.jsoup.select.Elements;
import org.languagetool.JLanguageTool;
import org.languagetool.language.AmericanEnglish;
import org.languagetool.language.AngolaPortuguese;
import org.languagetool.language.Arabic;
import org.languagetool.language.Asturian;
import org.languagetool.language.AustralianEnglish;
import org.languagetool.language.AustrianGerman;
import org.languagetool.language.Belarusian;
import org.languagetool.language.BelgianDutch;
import org.languagetool.language.BrazilianPortuguese;
import org.languagetool.language.Breton;
import org.languagetool.language.BritishEnglish;
import org.languagetool.language.CanadianEnglish;
import org.languagetool.language.Catalan;
import org.languagetool.language.Chinese;
import org.languagetool.language.Danish;
import org.languagetool.language.Dutch;
import org.languagetool.language.Esperanto;
import org.languagetool.language.French;
import org.languagetool.language.Galician;
import org.languagetool.language.GermanyGerman;
import org.languagetool.language.Greek;
import org.languagetool.language.Irish;
import org.languagetool.language.Italian;
import org.languagetool.language.Japanese;
import org.languagetool.language.Khmer;
import org.languagetool.language.MozambiquePortuguese;
import org.languagetool.language.NewZealandEnglish;
import org.languagetool.language.Persian;
import org.languagetool.language.Polish;
import org.languagetool.language.PortugalPortuguese;
import org.languagetool.language.Portuguese;
import org.languagetool.language.Romanian;
import org.languagetool.language.Russian;
import org.languagetool.language.Slovak;
import org.languagetool.language.Slovenian;
import org.languagetool.language.SouthAfricanEnglish;
import org.languagetool.language.Spanish;
import org.languagetool.language.SpanishVoseo;
import org.languagetool.language.Swedish;
import org.languagetool.language.SwissGerman;
import org.languagetool.language.Tagalog;
import org.languagetool.language.Tamil;
import org.languagetool.language.Ukrainian;
import org.languagetool.language.ValencianCatalan;
import org.languagetool.rules.CategoryId;
import org.languagetool.rules.RuleMatch;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * @author xhico
 */
@WebServlet(name = "LanguageTool", urlPatterns = {"/LanguageTool"})
public class LanguageTool extends HttpServlet {

    private JLanguageTool langTool;

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
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setContentType("application/json");

        try (PrintWriter out = response.getWriter()) {
            try {

                // Read data from request
                StringBuilder buffer = new StringBuilder();
                BufferedReader reader = request.getReader();
                String line;
                while ((line = reader.readLine()) != null) {
                    buffer.append(line);
                    buffer.append(System.lineSeparator());
                }
                String data = buffer.toString();

                // Read JSON data
                JSONObject obj = new JSONObject(data);
                String bodyContent = obj.get("bodyContent").toString();
                String langCode = obj.get("langCode").toString();

                // Initialize JSONObject
                JSONObject jo = new JSONObject();
                JSONArray ja = new JSONArray();

                // Set Language Code and Rules
                setLanguage(langCode);
                disableAll();

                // HTML Check
                Document doc = Jsoup.parse(bodyContent);
                String bodyText = doc.body().text();

                // Check and Iterate over every error found
                List<RuleMatch> matches = langTool.check(bodyText);
                for (RuleMatch match : matches) {

                    // Get error, message, sentence and replacements
                    String error = bodyText.substring(match.getFromPos(), match.getToPos());
                    String message = match.getMessage().replace("<suggestion>", "").replace("</suggestion>", "").replace("'", "");
                    List<String> rep = match.getSuggestedReplacements();
                    String replacements;
                    if (rep.size() > 5) {
                        replacements = rep.subList(0, 5).toString();
                    } else {
                        replacements = rep.toString();
                    }
                    String sentence = match.getSentence().getText();

                    // Add error, message, replacements, text to LinkedHashMap
                    Map<String, String> m = new LinkedHashMap<>();
                    m.put("error", error);
                    m.put("message", message);
                    m.put("replacements", replacements);
                    m.put("sentence", sentence);
                    ja.put(m);

                    // Putting SpellingErrors to JSONObject
                    jo.put("SpellingErrors", ja);
                }

                // Pretty Print JSON
                Gson gson = new Gson();
                Gson gsonPP = new GsonBuilder().setPrettyPrinting().create();
                JsonObject jsonObject = gson.fromJson(jo.toString(), JsonObject.class);
                String jsonOutput = gsonPP.toJson(jsonObject);

                // Return JSON
                out.print(jsonOutput);
            } catch (Exception ex) {
                out.println(ex);
            }

        }
    }

    private void setLanguage(String language) {
        switch (language) {
            case "ar":
                langTool = new JLanguageTool(new Arabic());
                break;
            case "ast-ES":
                langTool = new JLanguageTool(new Asturian());
                break;
            case "be-BY":
                langTool = new JLanguageTool(new Belarusian());
                break;
            case "br-FR":
                langTool = new JLanguageTool(new Breton());
                break;
            case "ca-ES":
                langTool = new JLanguageTool(new Catalan());
                break;
            case "ca-ES-valencia":
                langTool = new JLanguageTool(new ValencianCatalan());
                break;
            case "zh-CN":
                langTool = new JLanguageTool(new Chinese());
                break;
            case "da-DK":
                langTool = new JLanguageTool(new Danish());
                break;
            case "nl":
                langTool = new JLanguageTool(new Dutch());
                break;
            case "nl-BE":
                langTool = new JLanguageTool(new BelgianDutch());
                break;
            case "en-AU":
                langTool = new JLanguageTool(new AustralianEnglish());
                break;
            case "en-CA":
                langTool = new JLanguageTool(new CanadianEnglish());
                break;
            case "en-GB":
                langTool = new JLanguageTool(new BritishEnglish());
                break;
            case "en-NZ":
                langTool = new JLanguageTool(new NewZealandEnglish());
                break;
            case "en-ZA":
                langTool = new JLanguageTool(new SouthAfricanEnglish());
                break;
            case "en-US":
                langTool = new JLanguageTool(new AmericanEnglish());
                break;
            case "eo":
                langTool = new JLanguageTool(new Esperanto());
                break;
            case "fr":
                langTool = new JLanguageTool(new French());
                break;
            case "gl-ES":
                langTool = new JLanguageTool(new Galician());
                break;
            case "de-AT":
                langTool = new JLanguageTool(new AustrianGerman());
                break;
            case "de-DE":
                langTool = new JLanguageTool(new GermanyGerman());
                break;
            case "de-CH":
                langTool = new JLanguageTool(new SwissGerman());
                break;
            case "el-GR":
                langTool = new JLanguageTool(new Greek());
                break;
            case "it":
                langTool = new JLanguageTool(new Irish());
                break;
            case "ja-JP":
                langTool = new JLanguageTool(new Italian());
                break;
            case "km-KH":
                langTool = new JLanguageTool(new Japanese());
                break;
            case "fa":
                langTool = new JLanguageTool(new Khmer());
                break;
            case "pl-PL":
                langTool = new JLanguageTool(new Persian());
                break;
            case "pt":
                langTool = new JLanguageTool(new Polish());
                break;
            case "pt-AO":
                langTool = new JLanguageTool(new Portuguese());
                break;
            case "pt-BR":
                langTool = new JLanguageTool(new AngolaPortuguese());
                break;
            case "pt-MZ":
                langTool = new JLanguageTool(new BrazilianPortuguese());
                break;
            case "pt-PT":
                langTool = new JLanguageTool(new MozambiquePortuguese());
                break;
            case "ro-RO":
                langTool = new JLanguageTool(new PortugalPortuguese());
                break;
            case "ru-RU":
                langTool = new JLanguageTool(new Romanian());
                break;
            case "de-DE-x-simple-language":
                langTool = new JLanguageTool(new Russian());
                break;
            case "sk-SK":
                langTool = new JLanguageTool(new Slovak());
                break;
            case "sl-SI":
                langTool = new JLanguageTool(new Slovenian());
                break;
            case "es":
                langTool = new JLanguageTool(new Spanish());
                break;
            case "es-AR":
                langTool = new JLanguageTool(new SpanishVoseo());
                break;
            case "sv":
                langTool = new JLanguageTool(new Swedish());
                break;
            case "tl-PH":
                langTool = new JLanguageTool(new Tagalog());
                break;
            case "ta-IN":
                langTool = new JLanguageTool(new Tamil());
                break;
            case "uk-UA":
                langTool = new JLanguageTool(new Ukrainian());
                break;
        }

    }

    private void disableAll() {
        // https://languagetool.org/development/api/org/languagetool/rules/Categories.html

        for (CategoryId id : langTool.getCategories().keySet()) {
            langTool.disableCategory(id);
        }
        langTool.enableRuleCategory(new CategoryId("TYPOS"));
        langTool.enableRuleCategory(new CategoryId("COMPOUNDING"));
        langTool.enableRuleCategory(new CategoryId("CONFUSED_WORDS"));
        langTool.enableRuleCategory(new CategoryId("TYPOGRAPHY"));
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