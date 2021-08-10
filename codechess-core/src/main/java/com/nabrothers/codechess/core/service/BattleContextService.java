package com.nabrothers.codechess.core.service;

import com.nabrothers.codechess.core.dao.BattleRecordDAO;
import com.nabrothers.codechess.core.data.BattleContext;
import com.nabrothers.codechess.core.dto.BattleContextDTO;
import com.nabrothers.codechess.core.dto.BattleProcessDTO;
import com.nabrothers.codechess.core.dto.BattleResultDTO;
import com.nabrothers.codechess.core.po.BattleRecordPO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BattleContextService {
    @Autowired
    private BattleContext battleContext;

    @Autowired
    private BattleRecordDAO battleRecordDAO;

    public int startBattle() {
        BattleRecordPO record = new BattleRecordPO();
        record.setStatus(0);
        battleRecordDAO.insert(record);
        return record.getId();
    }

    public BattleProcessDTO getProcess() {
        BattleProcessDTO processDTO = new BattleProcessDTO();
        if (battleContext.getStatus() == 2) {
            processDTO.setFinished(true);
        } else {
            processDTO.setFinished(false);
        }
        processDTO.setStep(battleContext.getCurrentStep());
        return processDTO;
    }

    public BattleResultDTO getBattleResult() {
        BattleResultDTO result = new BattleResultDTO();
        result.setStatus(battleContext.getStatus());
        List<BattleContextDTO> history = battleContext.getHistory();
        result.setSteps(history);
        result.setTotalSteps(history.size());
        return result;
    }
}
