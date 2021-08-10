package com.nabrothers.codechess.core.dao;

import com.nabrothers.codechess.core.po.BattleRecordPO;
import org.springframework.stereotype.Component;

@Component
public interface BattleRecordDAO {
    int insert(BattleRecordPO record);
}
