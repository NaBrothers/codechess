package com.nabrothers.codechess.web.po;

import lombok.Data;

@Data
public class UserAuthPO {
    private Long id;
    private String username;
    private String password;
    private Long createTime;
    private Long updateTime;
}
