package com.nabrothers.codechess.core.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class HealthCheck {
    @RequestMapping("/healthCheck")
    @ResponseBody
    public String healthCheck() {
        return "ok";
    }
}