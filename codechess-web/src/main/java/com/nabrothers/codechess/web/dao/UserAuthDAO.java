package com.nabrothers.codechess.web.dao;

import com.nabrothers.codechess.web.dto.UserAuthDTO;
import com.nabrothers.codechess.web.po.UserAuthPO;
import org.springframework.stereotype.Component;

@Component
public interface UserAuthDAO {
    long insert(UserAuthPO user);

    UserAuthPO query(UserAuthDTO user);

    long update(UserAuthPO user);
}
