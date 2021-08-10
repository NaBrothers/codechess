package com.nabrothers.codechess.core.dao;

import com.nabrothers.codechess.core.po.BattleRecordPO;
import org.springframework.stereotype.Component;

@Component
public interface BattleRecordDAO {
    long insert(BattleRecordPO record);

    BattleRecordPO queryById(Integer id);

    long update(BattleRecordPO record);
}
