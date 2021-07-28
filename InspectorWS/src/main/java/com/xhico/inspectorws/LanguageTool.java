/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.xhico.inspectorws;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONArray;
import org.json.JSONObject;
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
import org.languagetool.rules.RuleMatch;

/**
 *
 * @author xhico
 */
@WebServlet(name = "LanguageToolServlet", urlPatterns = {"/LanguageToolServlet"})
public class LanguageTool extends HttpServlet {

    private JLanguageTool langTool;
    private String langName;

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setContentType("application/json");

        try (PrintWriter out = response.getWriter()) {
            try {

                // Set variables
                String text = request.getParameter("text");
                String langCode = request.getParameter("lang");

                // Check Spelling
                setLanguage(langCode);
                List<RuleMatch> matches = langTool.check(text);

                // Initialize JSONObject
                JSONObject jo = new JSONObject();
                JSONArray ja = new JSONArray();

                // Putting Language to JSONObject
                jo.put("Language", langName);

                // Iterate over every error found
                for (RuleMatch match : matches) {

                    // Get error, message and replacements
                    String error = text.substring(match.getFromPos(), match.getToPos());
                    String message = match.getMessage().replace("<suggestion>", "").replace("</suggestion>", "").replace("'", "");
                    List<String> rep = match.getSuggestedReplacements();
                    String replacements = null;
                    if (rep.size() > 5) {
                        replacements = rep.subList(0, 5).toString();
                    } else {
                        replacements = rep.toString();
                    }

                    // Add error, message, replacements to LinkedHashMap
                    Map m = new LinkedHashMap(3);
                    m.put("error", error);
                    m.put("message", message);
                    m.put("replacements", replacements);
                    ja.put(m);

                    // Putting SpellingErrors to JSONObject
                    jo.put("SpellingErrors", ja);

                }

                // Pretty Print JSON
                Gson gson = new Gson();
                Gson gsonPP = new GsonBuilder().setPrettyPrinting().create();
                JsonObject jsonObject = gson.fromJson(jo.toString(), JsonObject.class);
                String jsonOutput = gsonPP.toJson(jsonObject);

                // Return JSON Report
                out.println(jsonOutput);
            } catch (Exception ex) {
                out.println(ex);
            }

        }
    }

    private void setLanguage(String language) {
        switch (language) {
            case "ar":
                langTool = new JLanguageTool(new Arabic());
                langName = "Arabic";
                break;
            case "ast-ES":
                langTool = new JLanguageTool(new Asturian());
                langName = "Asturian";
                break;
            case "be-BY":
                langTool = new JLanguageTool(new Belarusian());
                langName = "Belarusian";
                break;
            case "br-FR":
                langTool = new JLanguageTool(new Breton());
                langName = "Breton";
                break;
            case "ca-ES":
                langTool = new JLanguageTool(new Catalan());
                langName = "Catalan";
                break;
            case "ca-ES-valencia":
                langTool = new JLanguageTool(new ValencianCatalan());
                langName = "Catalan (Valencian)";
                break;
            case "zh-CN":
                langTool = new JLanguageTool(new Chinese());
                langName = "Chinese";
                break;
            case "da-DK":
                langTool = new JLanguageTool(new Danish());
                langName = "Danish";
                break;
            case "nl":
                langTool = new JLanguageTool(new Dutch());
                langName = "Dutch";
                break;
            case "nl-BE":
                langTool = new JLanguageTool(new BelgianDutch());
                langName = "Dutch (Belgium)";
                break;
            case "en-AU":
                langTool = new JLanguageTool(new AustralianEnglish());
                langName = "English (Australian)";
                break;
            case "en-CA":
                langTool = new JLanguageTool(new CanadianEnglish());
                langName = "English (Canadian)";
                break;
            case "en-GB":
                langTool = new JLanguageTool(new BritishEnglish());
                langName = "English (GB)";
                break;
            case "en-NZ":
                langTool = new JLanguageTool(new NewZealandEnglish());
                langName = "English (New Zealand)";
                break;
            case "en-ZA":
                langTool = new JLanguageTool(new SouthAfricanEnglish());
                langName = "English (South African)";
                break;
            case "en-US":
                langTool = new JLanguageTool(new AmericanEnglish());
                langName = "English (US)";
                break;
            case "eo":
                langTool = new JLanguageTool(new Esperanto());
                langName = "Esperanto";
                break;
            case "fr":
                langTool = new JLanguageTool(new French());
                langName = "French";
                break;
            case "gl-ES":
                langTool = new JLanguageTool(new Galician());
                langName = "Galician";
                break;
            case "de-AT":
                langTool = new JLanguageTool(new AustrianGerman());
                langName = "German (Austria)";
                break;
            case "de-DE":
                langTool = new JLanguageTool(new GermanyGerman());
                langName = "German (Germany)";
                break;
            case "de-CH":
                langTool = new JLanguageTool(new SwissGerman());
                langName = "German (Swiss)";
                break;
            case "el-GR":
                langTool = new JLanguageTool(new Greek());
                langName = "Greek";
                break;
            case "it":
                langTool = new JLanguageTool(new Irish());
                langName = "Irish";
                break;
            case "ja-JP":
                langTool = new JLanguageTool(new Italian());
                langName = "Italian";
                break;
            case "km-KH":
                langTool = new JLanguageTool(new Japanese());
                langName = "Japanese";
                break;
            case "fa":
                langTool = new JLanguageTool(new Khmer());
                langName = "Khmer";
                break;
            case "pl-PL":
                langTool = new JLanguageTool(new Persian());
                langName = "Persian";
                break;
            case "pt":
                langTool = new JLanguageTool(new Polish());
                langName = "Polish";
                break;
            case "pt-AO":
                langTool = new JLanguageTool(new Portuguese());
                langName = "Portuguese";
                break;
            case "pt-BR":
                langTool = new JLanguageTool(new AngolaPortuguese());
                langName = "Portuguese (Angola preAO)";
                break;
            case "pt-MZ":
                langTool = new JLanguageTool(new BrazilianPortuguese());
                langName = "Portuguese (Brazil)";
                break;
            case "pt-PT":
                langTool = new JLanguageTool(new MozambiquePortuguese());
                langName = "Portuguese (MoÃ§ambique preAO)";
                break;
            case "ro-RO":
                langTool = new JLanguageTool(new PortugalPortuguese());
                langName = "Portuguese (Portugal)";
                break;
            case "ru-RU":
                langTool = new JLanguageTool(new Romanian());
                langName = "Romanian";
                break;
            case "de-DE-x-simple-language":
                langTool = new JLanguageTool(new Russian());
                langName = "Russian";
                break;
            case "sk-SK":
                langTool = new JLanguageTool(new Slovak());
                langName = "Slovak";
                break;
            case "sl-SI":
                langTool = new JLanguageTool(new Slovenian());
                langName = "Slovenian";
                break;
            case "es":
                langTool = new JLanguageTool(new Spanish());
                langName = "Spanish";
                break;
            case "es-AR":
                langTool = new JLanguageTool(new SpanishVoseo());
                langName = "Spanish (voseo)";
                break;
            case "sv":
                langTool = new JLanguageTool(new Swedish());
                langName = "Swedish";
                break;
            case "tl-PH":
                langTool = new JLanguageTool(new Tagalog());
                langName = "Tagalog";
                break;
            case "ta-IN":
                langTool = new JLanguageTool(new Tamil());
                langName = "Tamil";
                break;
            case "uk-UA":
                langTool = new JLanguageTool(new Ukrainian());
                langName = "Ukrainian";
                break;
        }

    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
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
