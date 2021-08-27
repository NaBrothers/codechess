package com.nabrothers.codechess.web.dto;

import lombok.Data;

@Data
public class UserAuthDTO {
    private Long id;
    private String username;
    private String password;
}
