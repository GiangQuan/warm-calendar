package com.example.demogoogleoauth;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class DemoController {

    @GetMapping("/")
    public String trangChu(@AuthenticationPrincipal OAuth2User user) {
        // KIỂM TRA: Nếu ngựa đã có thẻ bài (đã login)
        if (user != null) {
            return "redirect:/user"; // Đuổi ngay vào chuồng VIP, không cho đứng ở cổng nữa
        }
        return "login"; // Chưa có thẻ thì mới hiện form login
    }

    @GetMapping("/user")
    public String trangUser(@AuthenticationPrincipal OAuth2User user, Model model) {
        if (user != null) {
            model.addAttribute("name", user.getAttribute("name"));
            model.addAttribute("email", user.getAttribute("email"));
            model.addAttribute("picture", user.getAttribute("picture"));
        }
        return "profile";
    }
}