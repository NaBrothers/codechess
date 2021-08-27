package com.nabrothers.codechess.web.service;

import com.nabrothers.codechess.web.dao.UserAuthDAO;
import com.nabrothers.codechess.web.dto.UserAuthDTO;
import com.nabrothers.codechess.web.po.UserAuthPO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.UUID;

@Component
public class UserAuthService {

    @Autowired
    private UserAuthDAO userAuthDAO;

    private Map<Long, String> tokenMap = new HashMap<>();

    public Long query(UserAuthDTO userAuthDTO) {
        UserAuthPO userAuthPO = userAuthDAO.query(userAuthDTO);
        if (userAuthPO == null) {
            return null;
        }
        return userAuthPO.getId();
    }

    public Long insert(UserAuthDTO userAuthDTO) {
        UserAuthPO userAuthPO = new UserAuthPO();
        userAuthPO.setUsername(userAuthDTO.getUsername());
        userAuthPO.setPassword(userAuthDTO.getPassword());
        userAuthDAO.insert(userAuthPO);
        return userAuthPO.getId();
    }

    public String getToken(Long id) {
        String token = tokenMap.get(id);
        if (token == null) {
            token = id + "_" + UUID.randomUUID().toString();
            tokenMap.put(id, token);
        }
        return token;
    }
}
