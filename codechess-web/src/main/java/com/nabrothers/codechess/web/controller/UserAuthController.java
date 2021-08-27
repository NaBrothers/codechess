package com.nabrothers.codechess.web.controller;

import com.nabrothers.codechess.web.dto.HttpResponse;
import com.nabrothers.codechess.web.dto.UserAuthDTO;
import com.nabrothers.codechess.web.po.UserAuthPO;
import com.nabrothers.codechess.web.service.UserAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/api/auth")
public class UserAuthController {
    @Autowired
    private UserAuthService authService;

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    @ResponseBody
    public HttpResponse<String> login(@RequestBody UserAuthDTO userAuthDTO) {
        HttpResponse<String> response = new HttpResponse<>();
        Long userId = authService.query(userAuthDTO);
        if (userId == null) {
            response.setCode(HttpResponse.SYSTEM_FAILURE_CODE);
            response.setMsg("用户名或密码错误！");
            return response;
        }
        response.setData(authService.getToken(userId));
        return response;
    }

    @RequestMapping(value = "/register", method = RequestMethod.POST)
    @ResponseBody
    public HttpResponse<Long> register(@RequestBody UserAuthDTO userAuthDTO) {
        HttpResponse<Long> response = new HttpResponse<>();
        UserAuthDTO user = new UserAuthDTO();
        user.setUsername(userAuthDTO.getUsername());
        Long userId = authService.query(user);
        if (userId != null) {
            response.setCode(HttpResponse.SYSTEM_FAILURE_CODE);
            response.setMsg("该用户名已经被注册！");
            return response;
        }
        response.setData(authService.insert(userAuthDTO));
        return response;
    }
}
